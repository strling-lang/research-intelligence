"""Descriptive, paired analysis of the scored Lab study export."""

import argparse
from collections import Counter, defaultdict
import json
from pathlib import Path
import re
from statistics import median


ARMS = ("candidate", "baseline")
STATUSES = ("completed", "timed_out", "withdrew", "unavailable")
AVAILABLE = {"completed", "timed_out"}
CARDS = "FSPLUC"
CORE_FIELDS = {"code", "band", "task", "form", "arm", "status", "elapsed_s"}
TASK_FIELDS = {"first", "assisted", "debug_success", "replay_correct", "refusal_correct"}
CARD_FIELDS = {"card", "classification", "scope_correct", "confidence"}


def check(condition, number, field):
    if not condition:
        raise ValueError(f"Invalid scored row {number} ({field})")


def validate(rows):
    if not isinstance(rows, list):
        raise ValueError("Expected a JSON list of scored rows")
    records = {}
    identity = {}
    for number, row in enumerate(rows, 1):
        check(isinstance(row, dict), number, "object")
        evidence = row.get("task") == "T9"
        check(set(row) == CORE_FIELDS | (CARD_FIELDS if evidence else TASK_FIELDS), number, "fields")
        code = row["code"]
        check(isinstance(code, str) and re.fullmatch(r"p[0-9]{3}", code), number, "code")
        check(row["band"] in ("occasional", "frequent"), number, "band")
        check(row["task"] in tuple(f"T{i}" for i in range(1, 10)), number, "task")
        shared = row["task"] == "T5"
        check(row["arm"] in (("shared",) if shared else ARMS), number, "arm")
        check(row["form"] in ("A", "B"), number, "form")
        check(row["status"] in STATUSES, number, "status")
        elapsed = row["elapsed_s"]
        if row["status"] in AVAILABLE:
            check(type(elapsed) in (int, float) and 0 <= elapsed <= 240, number, "elapsed_s")
        else:
            check(elapsed is None, number, "elapsed_s")
        if row["status"] == "timed_out":
            check(elapsed == 240, number, "timeout cap")

        if evidence:
            check(row["card"] in tuple(CARDS), number, "card")
            if row["status"] == "completed":
                check(row["classification"] in tuple(CARDS), number, "classification")
                check(type(row["scope_correct"]) is bool, number, "scope_correct")
                confidence = row["confidence"]
                check(confidence is None or (type(confidence) is int and 1 <= confidence <= 5), number, "confidence")
            else:
                check(all(row[k] is None for k in CARD_FIELDS - {"card"}), number, "missing card marks")
        else:
            for field in ("first", "assisted"):
                mark = row[field]
                check(mark is None or (type(mark) is int and 0 <= mark <= 2), number, field)
            check((row["first"] is not None) == (row["status"] == "completed"), number, "first score")
            if row["status"] not in AVAILABLE:
                check(row["assisted"] is None, number, "assisted score")
            for field in TASK_FIELDS - {"first", "assisted"}:
                mark = row[field]
                is_applicable = row["status"] in AVAILABLE and (field == "debug_success" or row["task"] == "T8")
                check(mark is None or (type(mark) is bool and is_applicable), number, field)

        band_key = (code, "band")
        check(identity.setdefault(band_key, row["band"]) == row["band"], number, "consistent familiarity band")
        if not shared:
            form_key = (code, row["arm"])
            check(identity.setdefault(form_key, row["form"]) == row["form"], number, "consistent arm form")
            other = ARMS[1] if row["arm"] == ARMS[0] else ARMS[0]
            check(identity.get((code, other)) != row["form"], number, "distinct paired forms")
        key = (code, row["task"], row.get("card"), row["arm"])
        check(key not in records, number, "duplicate score")
        records[key] = row
    return records


def is_correct(row):
    if row["status"] != "completed":
        return False
    if row["task"] == "T9":
        return row["card"] == row["classification"] and row["scope_correct"]
    return row["first"] == 2


def summarize(rows):
    eligible = [row for row in rows if row["status"] in AVAILABLE]
    completed = [row for row in eligible if row["status"] == "completed"]
    cards = [row for row in completed if row["task"] == "T9"]
    result = {
        "statuses": {status: sum(row["status"] == status for row in rows) for status in STATUSES},
        "eligible": len(eligible),
        "unassisted_success": sum(is_correct(row) for row in eligible),
        "median_completed_s": median(row["elapsed_s"] for row in completed) if completed else None,
        "assisted_scores": dict(Counter(row["assisted"] for row in eligible if row.get("assisted") is not None)),
    }
    for field in TASK_FIELDS - {"first", "assisted"}:
        marked = [row[field] for row in eligible if row.get(field) is not None]
        result[field] = {"yes": sum(marked), "scored": len(marked)}
    result["cards"] = {
        "answered": len(cards),
        "missing_confidence": sum(row["confidence"] is None for row in cards),
        "incorrect_high_confidence": sum(not is_correct(row) and (row["confidence"] or 0) >= 4 for row in cards),
        "class_confusion": dict(Counter(f"{row['card']}->{row['classification']}" for row in cards)),
        "incorrect_scope": sum(not row["scope_correct"] for row in cards),
    }
    return result


def analyze(rows):
    records = validate(rows)
    groups = defaultdict(list)
    paired = defaultdict(dict)
    for (code, task, card, arm), row in records.items():
        label = card or task
        kind = "evidence_cards" if card else "tasks"
        for key in (("condition", arm, kind), ("task", label, arm), ("form", label, arm, row["form"]),
                    ("familiarity", label, arm, row["band"])):
            groups["/".join(key)].append(row)
        if arm in ARMS:
            paired[(code, label)][arm] = row

    by_pair = defaultdict(Counter)
    elapsed = defaultdict(list)
    for (_, label), arms in paired.items():
        metrics = by_pair[label]
        if any(arm not in arms for arm in ARMS):
            metrics["missing_arm"] += 1
            continue
        candidate, baseline = (arms[arm] for arm in ARMS)
        if any(row["status"] not in AVAILABLE for row in arms.values()):
            metrics["incomparable_access"] += 1
            continue
        contrast = {
            (True, True): "both_success",
            (True, False): "candidate_only_success",
            (False, True): "baseline_only_success",
            (False, False): "neither_success",
        }
        metrics[contrast[is_correct(candidate), is_correct(baseline)]] += 1
        metrics["scored_pairs"] += 1
        if all(row["status"] == "completed" for row in arms.values()):
            elapsed[label].append(candidate["elapsed_s"] - baseline["elapsed_s"])

    for label, metrics in by_pair.items():
        metrics["paired_completed_times"] = len(elapsed[label])
    return {
        "scored_participants": len({key[0] for key in records}),
        "groups": {key: summarize(value) for key, value in groups.items()},
        "paired_by_task_or_card": {
            label: {**metrics, "median_completed_candidate_minus_baseline_s": median(elapsed[label]) if elapsed[label] else None}
            for label, metrics in by_pair.items()
        },
    }


def self_test():
    task = dict(code="p001", band="frequent", task="T8", form="A", arm="candidate", status="completed",
                elapsed_s=20, first=2, assisted=None, debug_success=None, replay_correct=True, refusal_correct=True)
    baseline = dict(task, form="B", arm="baseline", elapsed_s=30, first=0, assisted=2, replay_correct=False)
    card = dict(code="p001", band="frequent", task="T9", form="A", arm="candidate", status="completed",
                elapsed_s=10, card="P", classification="S", scope_correct=False, confidence=5)
    no_access = dict(card, form="B", arm="baseline", status="unavailable", elapsed_s=None,
                     classification=None, scope_correct=None, confidence=None)
    timeout = dict(task, task="T4", status="timed_out", elapsed_s=240, first=None,
                   replay_correct=None, refusal_correct=None)
    result = analyze([task, baseline, card, no_access, timeout])
    pairs = result["paired_by_task_or_card"]
    assert pairs["T8"]["candidate_only_success"] == 1
    assert pairs["T8"]["median_completed_candidate_minus_baseline_s"] == -10
    assert pairs["P"]["incomparable_access"] == 1 and pairs["T4"]["missing_arm"] == 1
    assert result["groups"]["task/P/candidate"]["cards"]["incorrect_high_confidence"] == 1
    assert result["groups"]["task/T4/candidate"]["statuses"]["timed_out"] == 1
    for rejected in ([task, task], [dict(task, first=True)], [dict(task, raw_answer="synthetic")],
                     [task, dict(baseline, form="A")], [dict(timeout, elapsed_s=241)]):
        try:
            analyze(rejected)
        except ValueError:
            continue
        raise AssertionError("Malformed synthetic export was accepted")
    print("Synthetic scoring checks passed. No participants or human outcomes.")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--self-test", action="store_true")
    mode.add_argument("--scored-only", type=Path)
    args = parser.parse_args()
    if args.self_test:
        self_test()
        return
    try:
        result = analyze(json.loads(args.scored_only.read_text(encoding="utf-8")))
    except ValueError as error:
        parser.error(str(error))
    print(json.dumps(result, indent=2, sort_keys=True))


if __name__ == "__main__":
    main()
