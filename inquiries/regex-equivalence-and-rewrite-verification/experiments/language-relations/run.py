"""Offline comparison for the explicitly finite alphabet language model."""

import argparse
from collections import Counter, deque
from functools import lru_cache
from itertools import product
import json
import operator
from pathlib import Path
import random
import re
import sys
from time import perf_counter_ns
import tracemalloc


HERE = Path(__file__).resolve().parent
PYTHON_VERSION = (3, 13, 5)
ALPHABET = ("a", "b")
ZERO = ("zero",)
EPSILON = ("epsilon",)
SEED = 20261120
GENERATED = 48
MAX_PAIRS = 256
MAX_INPUT_NODES = 64
MAX_DEPTH = 12
ORACLE_DEPTH = 5
MAX_WITNESS = 8
RELATIONS = {
    "equivalence": operator.ne,
    "left_subset": lambda left, right: left and not right,
    "disjoint": operator.and_,
}
EXCLUDED = {
    "anchor", "atomic", "backreference", "capture", "case_fold", "complement",
    "lookaround", "possessive", "unicode_property", "wildcard",
}


class OutsideModel(ValueError):
    pass


def parse_model(raw):
    """Read the fixture tree. This is not a STRling or target parser."""
    remaining = MAX_INPUT_NODES

    def read(node, depth):
        nonlocal remaining
        remaining -= 1
        if remaining < 0 or depth > MAX_DEPTH:
            raise OutsideModel("input_budget")
        if not isinstance(node, list) or not node or not isinstance(node[0], str):
            raise ValueError("node_shape")
        kind, *items = node
        if kind in EXCLUDED:
            raise OutsideModel(kind)
        if kind in {"zero", "epsilon"} and not items:
            return (kind,)
        if kind == "literal" and len(items) == 1 and items[0] in ALPHABET:
            return (kind, items[0])
        if kind == "class" and items and all(item in ALPHABET for item in items):
            return (kind, "".join(sorted(set(items))))
        if kind in {"alt", "seq"} and len(items) >= 2:
            return (kind, *(read(item, depth + 1) for item in items))
        if kind == "star" and len(items) == 1:
            return (kind, read(items[0], depth + 1))
        raise ValueError("node_shape_or_symbol")

    return read(raw, 1)


# Brzozowski expressions use language-only normalizations. Ordered input is
# preserved in the fixtures and the Thompson compiler sees the original tree.
def union(*items):
    branches = set()
    for item in items:
        if item == ZERO:
            continue
        branches.update(item[1:] if item[0] == "alt" else (item,))
    if not branches:
        return ZERO
    if len(branches) == 1:
        return branches.pop()
    return ("alt", *sorted(branches))


def sequence(*items):
    if ZERO in items:
        return ZERO
    parts = []
    for item in items:
        if item != EPSILON:
            parts.extend(item[1:] if item[0] == "seq" else (item,))
    if not parts:
        return EPSILON
    if len(parts) == 1:
        return parts[0]
    return ("seq", *parts)


def normalized(node):
    kind, *items = node
    if kind == "alt":
        return union(*(normalized(item) for item in items))
    if kind == "seq":
        return sequence(*(normalized(item) for item in items))
    if kind == "star":
        body = normalized(items[0])
        if body in {EPSILON, ZERO}:
            return EPSILON
        return ("star", body)
    return node


def nullable(node):
    kind, *items = node
    if kind in {"epsilon", "star"}:
        return True
    if kind == "alt":
        return any(map(nullable, items))
    if kind == "seq":
        return all(map(nullable, items))
    return False


def derivative(node, char):
    kind, *items = node
    if kind in {"literal", "class"}:
        return EPSILON if char in items[0] else ZERO
    if kind == "alt":
        return union(*(derivative(item, char) for item in items))
    if kind == "seq":
        branches = []
        for index, item in enumerate(items):
            branches.append(sequence(derivative(item, char), *items[index + 1:]))
            if not nullable(item):
                break
        return union(*branches)
    if kind == "star":
        return sequence(derivative(items[0], char), node)
    return ZERO


def node_count(node):
    if node[0] in {"alt", "seq", "star"}:
        return 1 + sum(map(node_count, node[1:]))
    return 1


class Derivatives:
    def __init__(self, expression):
        self.start = normalized(expression)
        self.accepts = nullable
        self.step = derivative
        self.compilation_units = node_count(self.start)
        self.state_size = node_count


class Thompson:
    def __init__(self, expression):
        self.edges = []
        start, self.end = self.build(expression)
        self.start = self.close({start})
        self.compilation_units = len(self.edges)
        self.state_size = len

    def build(self, node):
        kind, *items = node
        start = len(self.edges)
        end = start + 1
        self.edges.extend(([], []))
        if kind in {"literal", "class"}:
            self.edges[start].extend((symbol, end) for symbol in items[0])
        elif kind == "epsilon":
            self.edges[start].append((None, end))
        elif kind == "alt":
            for item in items:
                child_start, child_end = self.build(item)
                self.edges[start].append((None, child_start))
                self.edges[child_end].append((None, end))
        elif kind == "seq":
            tail = start
            for item in items:
                child_start, child_end = self.build(item)
                self.edges[tail].append((None, child_start))
                tail = child_end
            self.edges[tail].append((None, end))
        elif kind == "star":
            child_start, child_end = self.build(items[0])
            self.edges[start].extend(((None, end), (None, child_start)))
            self.edges[child_end].extend(((None, end), (None, child_start)))
        return start, end

    def close(self, members):
        pending = list(members)
        reached = set(members)
        while pending:
            for char, target in self.edges[pending.pop()]:
                if char is None and target not in reached:
                    reached.add(target)
                    pending.append(target)
        return frozenset(reached)

    def step(self, state, symbol):
        return self.close({
            target
            for source in state
            for char, target in self.edges[source]
            if char == symbol
        })

    def accepts(self, state):
        return self.end in state


def compare(left, right, violates, pair_budget):
    initial = (left.start, right.start)
    pending = deque([(initial, "")])
    reached = {initial}
    examined = transitions = 0
    peak_pair_width = left.state_size(left.start) + right.state_size(right.start)
    status, witness = "proven", None
    while pending:
        (a, b), word = pending.popleft()
        examined += 1
        if violates(left.accepts(a), right.accepts(b)):
            status, witness = "refuted", word
            break
        for symbol in ALPHABET:
            if transitions >= pair_budget * len(ALPHABET):
                status = "unknown_budget"
                pending.clear()
                break
            transitions += 1
            pair = (left.step(a, symbol), right.step(b, symbol))
            peak_pair_width = max(peak_pair_width, left.state_size(pair[0]) + right.state_size(pair[1]))
            if pair not in reached:
                if len(reached) >= pair_budget:
                    status = "unknown_budget"
                    pending.clear()
                    break
                reached.add(pair)
                pending.append((pair, word + symbol))
    return {
        "status": status,
        "witness": witness,
        "pairs_seen": len(reached),
        "pairs_examined": examined,
        "transitions": transitions,
        "peak_pair_width": peak_pair_width,
        "initial_units": left.compilation_units + right.compilation_units,
    }


@lru_cache(maxsize=8192)
def word_member(node, word):
    """Independent direct denotation over concrete words, with no state compiler."""
    kind, *items = node
    if kind == "zero":
        return False
    if kind == "epsilon":
        return not word
    if kind == "literal":
        return word == items[0]
    if kind == "class":
        return len(word) == 1 and word in items[0]
    if kind == "alt":
        return any(word_member(item, word) for item in items)
    if kind == "seq":
        if len(items) == 1:
            return word_member(items[0], word)
        return any(
            word_member(items[0], word[:i]) and word_member(("seq", *items[1:]), word[i:])
            for i in range(len(word) + 1)
        )
    if kind == "star":
        # Empty repetitions add no words. A positive split decreases the suffix.
        return not word or any(
            word_member(items[0], word[:i]) and word_member(node, word[i:])
            for i in range(1, len(word) + 1)
        )
    raise AssertionError(kind)


def words(max_length):
    for length in range(max_length + 1):
        yield from map("".join, product(ALPHABET, repeat=length))


def engine_member(engine, word):
    state = engine.start
    for symbol in word:
        state = engine.step(state, symbol)
    return engine.accepts(state)


def generated_expression(rng, depth):
    if depth == 0 or rng.randrange(4) == 0:
        return rng.choice([["literal", "a"], ["literal", "b"], ["class", "a", "b"], ["epsilon"], ["zero"]])
    tag = rng.choice(["alt", "seq", "star"])
    arity = 1 if tag == "star" else 2
    return [tag, *(generated_expression(rng, depth - 1) for _ in range(arity))]


def generated_cases():
    rng = random.Random(SEED)
    for index in range(GENERATED):
        lhs = generated_expression(rng, 3)
        rhs = generated_expression(rng, 3)
        mode = index % 4
        if mode == 0:
            # Positive control whose order and number of branches can change.
            rhs = ["alt", ["zero"], lhs, lhs]
        elif mode == 1:
            rhs = ["alt", rhs, lhs]
        relation = ("equivalence", "left_subset", "equivalence", "disjoint")[mode]
        yield {"id": f"seeded-{index:02}", "left": lhs, "right": rhs, "relation": relation}


def measure_case(case, counters, timings):
    row = {"id": case["id"], "relation": case["relation"]}
    try:
        left, right = parse_model(case["left"]), parse_model(case["right"])
    except OutsideModel as error:
        row.update(status="outside_model", reason=str(error))
        return row
    except ValueError as error:
        row.update(status="invalid", reason=str(error))
        return row

    violation = RELATIONS[row["relation"]]
    pair_budget = case.get("pair_budget", MAX_PAIRS)
    assert 0 < pair_budget <= MAX_PAIRS
    first_finite_witness = next((
        word for word in words(ORACLE_DEPTH) if violation(word_member(left, word), word_member(right, word))
    ), None)
    for method in (Derivatives, Thompson):
        started = perf_counter_ns()
        lhs, rhs = method(left), method(right)
        compiled = perf_counter_ns()
        result = compare(lhs, rhs, violation, pair_budget)
        ended = perf_counter_ns()
        timings[f"{method.__name__} compile"] += compiled - started
        timings[f"{method.__name__} search"] += ended - compiled
        row[method.__name__] = result
        if result["status"] == "proven" and first_finite_witness is not None:
            counters["false_assertions"] += 1
        if result["status"] == "refuted":
            witness = result["witness"]
            assert len(witness) <= MAX_WITNESS, "witness exceeds independent replay bound"
            independent_witness = next((
                word for word in words(len(witness)) if violation(word_member(left, word), word_member(right, word))
            ), None)
            if witness != independent_witness:
                counters["false_assertions"] += 1
            counters["witnesses_replayed"] += 1
        for word in words(ORACLE_DEPTH):
            for engine, node in ((lhs, left), (rhs, right)):
                counters["finite_membership_checks"] += 1
                if engine_member(engine, word) != word_member(node, word):
                    counters["membership_disagreements"] += 1
    results = [row["Derivatives"], row["Thompson"]]
    if all(result["status"] != "unknown_budget" for result in results):
        if any(results[0][key] != results[1][key] for key in ("status", "witness")):
            counters["method_disagreements"] += 1
    return row


def observe_regex(pattern, subject, replacement):
    regex = re.compile(pattern)
    match = regex.search(subject)
    return {
        "search": {"span": list(match.span()), "groups": list(match.groups())},
        "full_match": regex.fullmatch(subject) is not None,
        "iteration": [list(entry.span()) for entry in regex.finditer(subject)],
        "replacement": regex.sub(replacement, subject),
    }


def measure(fixture, timings):
    counters = Counter(dict.fromkeys([
        "false_assertions", "witnesses_replayed", "finite_membership_checks",
        "membership_disagreements", "method_disagreements",
    ], 0))
    cases = []
    for case in [*fixture["cases"], *generated_cases()]:
        row = measure_case(case, counters, timings)
        if "expected" in case:
            status, witness = case["expected"]
            shape = {"status": status, "witness": witness}
            actual = (row["Derivatives"], row["Thompson"]) if "Derivatives" in row else (row,)
            for result in actual:
                assert all(result.get(key) == value for key, value in shape.items()), case["id"]
        cases.append(row)
    observations = []
    for control in fixture["operational_controls"]:
        lhs = observe_regex(control["left"], control["subject"], control["replacement"])
        rhs = observe_regex(control["right"], control["subject"], control["replacement"])
        assert lhs == control["expected_left"] and rhs == control["expected_right"], control["id"]
        assert lhs != rhs, control["id"]
        observations.append({"id": control["id"], "left": lhs, "right": rhs})
    assert all(counters[key] == 0 for key in ("false_assertions", "membership_disagreements", "method_disagreements")), counters
    return {
        "model": {"alphabet": ALPHABET, "default_pair_budget": MAX_PAIRS, "input_depth_cap": MAX_DEPTH, "input_node_cap": MAX_INPUT_NODES},
        "finite_oracle_depth": ORACLE_DEPTH,
        "python": ".".join(map(str, PYTHON_VERSION)),
        "seed": SEED,
        "generated_cases": GENERATED,
        "measurement_counts": dict(counters),
        "cases": cases,
        "operational_observations": observations,
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="check canonical results against the committed snapshot")
    parser.add_argument("--profile", action="store_true", help="report diagnostic wall time and peak tracked Python memory to stderr")
    args = parser.parse_args()
    if sys.version_info[:3] != PYTHON_VERSION or sys.implementation.name != "cpython":
        parser.error(f"replay uses CPython {'.'.join(map(str, PYTHON_VERSION))}")
    if not __debug__:
        parser.error("fixture assertions must be enabled")
    fixture = json.loads((HERE / "fixtures.json").read_text(encoding="utf-8"))
    if args.profile:
        tracemalloc.start()
        started = perf_counter_ns()
    timings = Counter()
    results = measure(fixture, timings)
    if args.profile:
        peak = tracemalloc.get_traced_memory()[1]
        elapsed_ms = (perf_counter_ns() - started) / 1_000_000
        print(f"profile (including finite oracles and tracing): {elapsed_ms:.2f} ms, {peak} peak traced bytes", file=sys.stderr)
        for name, nanoseconds in timings.items():
            print(f"  {name}: {nanoseconds / 1_000_000:.2f} ms", file=sys.stderr)
    canonical = json.dumps(results, sort_keys=True, ensure_ascii=True, indent=2) + "\n"
    if args.check:
        if canonical != (HERE / "results.json").read_text(encoding="ascii"):
            parser.error("canonical results differ")
        print(f"{len(results['cases'])} relations and {len(results['operational_observations'])} behavioral controls verified")
    else:
        # The canonical stdout record is ASCII with LF on each platform.
        sys.stdout.buffer.write(canonical.encode("ascii"))


if __name__ == "__main__":
    main()
