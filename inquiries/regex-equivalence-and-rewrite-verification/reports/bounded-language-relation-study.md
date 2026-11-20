# Comparing bounded regular-language decision procedures

- Role: Experiment report
- Origin: Research Intelligence, AI-assisted study design and execution for `RI-2026-11-20-decision-grade-completeness`
- Published/Generated: 2026-11-20
- Source verification: Verified under current evidence standard for the stated scope
- Last reviewed: 2026-11-20
- Current status: Active input

## Decision and disposition

**Conditional yes for language-only comparison.** A complete reachable-state
search can answer whether two regular patterns admit the same complete
strings, whether a new pattern admitted a string outside the previous
language, or whether two validating rules can accept the same string. Both
implementations found checkable shortest witnesses and returned unknown when
exploration stopped early. The useful product candidate is an explicit
whole-input language relation with a witness, for an owner-defined fragment.

**No-go for applying general rewrites on the strength of this result.** A
search can select a different span. Captures can differ in value and
participation. Iteration and replacement can then produce different results.
Speed, clarity, portability, safety, and target support each need their own
evidence. No compiler claim or acceptance of this study is recorded.

## Current compiler boundary

At `strling@eba5dad3de3fa620eb1ea13e0514d02f4b23e288`, the canonical
compiler data contract is normative for serialization and its cross-contract
invariants. Semantic IR distinguishes `empty`, `literal`, `sequence`,
`alternation`, `character_set`, and `repeat` and retains authored branch
order, capture identity, and case intent. The broad semantic specification
remains unratified. A formal decision about the model below requires only
its stated premises. Applying it to product input would additionally require
a checked interpretation of the relevant canonical IR and options.
[Compiler specification hub](https://github.com/strling-lang/strling/blob/eba5dad3de3fa620eb1ea13e0514d02f4b23e288/spec/README.md),
[compiler contract suite, Semantic IR and Canonical normalization](https://github.com/strling-lang/strling/blob/eba5dad3de3fa620eb1ea13e0514d02f4b23e288/spec/contracts/1.0/README.md).

The existing conversion contract proves normalized semantic alpha
equivalence for exact reconstruction into Semantic STRling 1.0 or a
direct-operation Simply 1.0 request. That relation retains node values,
topology, order, and semantic options. The separate rewrite registry contains
two structural rules, mandatory atomic-literal wrapper elision on an exact
applicability check and optional nonpossessive exact-once elision on explicit
request. Their preconditions and evidence govern those rules. This study
tests a more general **language** relation and leaves those rules' stronger
behavioral obligations to the owning compiler.
[Conversion proof rules](https://github.com/strling-lang/strling/blob/eba5dad3de3fa620eb1ea13e0514d02f4b23e288/spec/conversions/semantic/1.0/README.md),
[structural rewrite registry and evidence IDs](https://github.com/strling-lang/strling/blob/eba5dad3de3fa620eb1ea13e0514d02f4b23e288/spec/portability/equivalence/1.0/registry.json).

## Model and preservation relation

The domain is every finite word over the exact alphabet `Σ = {a,b}`. Each
symbol is compared literally and consumes one model symbol. Use `∅` for
the empty language and `ε` for the empty word. `L(∅) = ∅`,
`L(ε) = {ε}`, `L(a) = {a}`, and the language of a positive finite predicate
is the set of its one-symbol words. Alternation means set union, sequences
mean ordered language concatenation, and star means all finite concatenations
of the operand, including zero. These definitions are independent of
backtracking and engine matching. An IR `empty` corresponds to `ε`; the
model's `∅` is an internal value for the failed residual or a fixture.

The supported shapes correspond to case-sensitive `a` and `b` literals,
positive enumerated sets of them, sequence, alternation, and nonpossessive
zero-to-unbounded repeat under the declared word interpretation. Longer
literal strings expand to model sequences. More complex repeat bounds,
wildcards, complement, anchors, lookarounds, atomicity, possessive repetition,
captures, backreferences, caseless options, Unicode properties, normalization,
and other alphabets are excluded. The fixture parser accepts a research tree.
No production source is parsed or automatically projected.

| Query | Violation at a whole word |
| --- | --- |
| Same accepted language | Exactly one side accepts |
| Left language contained in right | Left accepts and right rejects |
| Disjoint word languages | Both sides accept |

For selected search, the observable would instead need at least the selected
span under a specified starting position, profile, and priority rule. Capture
preservation would include identities, values, spans, and participation.
Iteration would include ordered results, cursor transitions and zero-width
progress. Replacement would include template semantics, output and count
under the chosen operation. A claim about arbitrary local replacement would
also need a contextual relation that preserves the choices available to an
enclosing pattern. These obligations are outside the word queries.

## Methods and source verification

| Method | Evidence read and decision |
| --- | --- |
| Brzozowski derivatives | Implemented. Left quotients are a direct fit to whole-word membership and make each state a residual expression. Normalize union by associativity, commutativity, and idempotence and simplify neutral or absorbing terms. The paper relates those identities to finiteness of dissimilar derivatives. [Brzozowski, JACM 11(4), 481–494, §§4–5](https://doi.org/10.1145/321239.321249), [primary-text copy](https://www.oilshell.org/archive/1964_JACM_Brzozowski.pdf). |
| Thompson-style ε-NFA | Implemented. An independent structural compiler plus state-set transitions avoids using the derivative implementation as its own reference. This construction uses two vertices per tree node and treats state sets as unordered. The original paper motivates simulation of all active alternatives for a substring-search program. This trial tests whole words. [Thompson, CACM 11(6), 419–422](https://doi.org/10.1145/363347.363387), [primary-text copy](https://www.jmeiners.com/efficient-programming-with-components/papers/regular-expressions.pdf). |
| Antimirov partial derivatives | Literature comparison. A derivative language can be represented by the union of partial derivatives. The paper bounds the number of partial derivatives by one plus the number of letter occurrences in its expression model, making a compact NFA plausible. Determinization or exploration of paired subsets can still grow exponentially. A third method sharing derivative logic would give less independence in this trial. [Antimirov, TCS 155(2), 291–319, abstract items 1–2](https://www.sciencedirect.com/science/article/pii/0304397595001824). |
| ERE# | Literature comparison. Its Lean lookaround normal form and decidability theorem apply in the defined span model modulo a decidable effective Boolean algebra. Span equivalence preserves a relation over context and match, richer than comparing just the words. Lookarounds are restricted. The single-variable SMT benchmark evaluation used the fragment without lookarounds. This source supplies neither the compiler's predicate algebra nor a proof for ordered captures and replacement. Use as candidate prior art if an actual span decision needs assertions or symbolic predicates. [Varatalu, Veanes, Zhuchko and Ernits, CAV 2025, §§3–4 and §6](https://link.springer.com/chapter/10.1007/978-3-031-98682-6_7). |
| Mechanized JavaScript semantics | Literature comparison. The contextual result uses ordered backtracking-tree leaves, including group maps, and distinguishes forward and backward context. The PikeVM verification has a restricted grammar including captures and greedy or lazy star, without backreferences or lookarounds in that subset. The model is checked against a line-by-line ECMAScript embedding. It supplies an example of the evidence needed for ordered or contextual preservation. Transfer to STRling or host operations would need a correspondence proof. [Barrière, Deng and Pit-Claudel, arXiv:2507.13091v3 (7 April 2026), §§5–6, Fig. 9 and Thm. 8](https://arxiv.org/html/2507.13091v3). |

**Bibliographic correction.** The Elsevier record gives
`10.1016/0304-3975(95)00182-4`, TCS 155(2), 11 March 1996,
pages 291–319. A fresh publisher-index lookup returned the title, date,
pages, DOI, and original abstract. DOI resolution pointed to Elsevier PII
`0304397595001824`. A direct fetch of the publisher landing page was blocked
in the verification tool, and direct lookups of the imported alternatives
`10.1016/0304-0208(95)00011-G` and `10.1016/0304-0208(95)00058-H`
did not return the paper. The active syntheses now cite the publisher record.
The [August equivalence report](regex-equivalence-and-rewrite-verification.md)
retains its original reference as provenance. The publisher abstract supports
the Antimirov claims above. Unmapped report markers and stronger comparative
claims in the August reports remain unresolved where this study does not
recover them.

## Why a closed search proves the declared relation

This is a formal argument for the stated model and algorithm, with separate
runtime checks of the implementation.

1. For any symbol `c`, define `D_c(R)` so that
   `L(D_c(R)) = {v | cv ∈ L(R)}`. By structural induction, a matching symbol
   or positive predicate yields `ε`, otherwise `∅`. The quotient
   distributes over union. In a sequence its first consuming operand must
   follow a nullable prefix, so union the derivatives at each eligible
   operand followed by the untouched suffix. In a star the first symbol must
   occur in some nonempty repetition, after possibly empty ones. The result
   is the quotient of the body followed by star. The normalizations preserve
   these languages. Induction on the read prefix now makes residual
   nullability exactly acceptance of that prefix.
2. Every Thompson subgraph has an entry and exit. Induction on the same
   model gives exactly the words labelling paths between them. Succession
   connects child exits to entries, union allows either branch, and star
   permits an empty path of symbols or a finite succession of child paths.
   The ε-closure uses visited vertices, including for a nullable star.
   Induction on the read prefix makes subset membership of the final vertex
   exactly acceptance of that prefix.
3. A paired state reached by a word summarizes both languages after that
   prefix. Visiting the initial pair and closing the reached set under both
   symbol transitions covers the state pair for every possible word. If no
   reached state violates the requested Boolean condition, the relation
   holds for all finite words in the model. Breadth-first order with
   `a` before `b` finds a shortest violation, with ties broken in alphabet
   order, on a run that reaches a violating pair. Both step functions are
   deterministic, so replacing a later duplicate path by the earlier path
   preserves its possible continuations. A cut-off before closure cannot
   support the positive conclusion.

The fixed alphabet allows explicit exact testing of predicate membership
and overlap. For example, `{a,b}` and literal `b` share witness `b`.
Two stars with disjoint positive leading symbols still share the empty word.
This result does not license treating uncertain predicates as disjoint.
Current compiler structural analysis preserves unknown for selected unequal
scalars and finite sets under case-insensitive matching. Extending the study
to an actual larger alphabet would require a declared complement universe
and an effective, exact partition for each supported predicate family, with a
representative for each nonempty cell. No expansion to Unicode properties
or folding was evaluated.
[Compiler structural analysis, Leading-consumption abstraction](https://github.com/strling-lang/strling/blob/eba5dad3de3fa620eb1ea13e0514d02f4b23e288/docs/migration/structural-analysis.md).

## Reproduction and independent checks

[Harness](../experiments/language-relations/run.py),
[fixtures](../experiments/language-relations/fixtures.json), and
[canonical results](../experiments/language-relations/results.json).
Run from the repository root with CPython **3.13.5**, using only its standard
library. No network, inputs from other checkouts, or external code are used.

```text
python -I -B inquiries/regex-equivalence-and-rewrite-verification/experiments/language-relations/run.py --check
python -I -B inquiries/regex-equivalence-and-rewrite-verification/experiments/language-relations/run.py --check --profile
```

The model has a 64-node and 12-level input-tree cap and a 256-pair search
cap with at most two transitions per allowed pair. The 23 authored
fixtures include a forced one-pair interruption, a state-growth case at the
normal cap, malformed trees, model exclusions, nullable-loop cases, and
a counterexample beyond the ordinary finite-oracle horizon. Another 48
cases use local PRNG seed `20261120` and maximum generator depth three
before authored positive controls are composed. The third, direct evaluator
uses word equality and substring partitions, without compiling either
state representation. It compares individual membership on all 63 words
of lengths zero to five. For each returned witness it searches all words
through that witness's full length, with a replay limit of eight. Expected
authored outcomes and the canonical result record are checked separately.

The two solvers share a product search, Boolean relations, and a fixture
parser. A common search or query-encoding defect can survive solver agreement.
The word oracle tests the declared grammar directly over the same parsed
syntax. Hand-labelled forward and reverse containment, empty-word and tie
cases, and a six-symbol witness reduce the risk of shared false positives.
The finite checks cannot certify solver implementation soundness for every
valid tree. No proof object external to these implementations is produced.
The replay also passed in a fresh folder containing only the three study
files with CRLF line endings and reproduced the canonical LF stdout bytes.
Two in-memory negative controls changed the product-search result before
checking. Promoting budget exhaustion to proof failed the
`budget-exhaustion` fixture. Substituting `bb` for every witness
failed `empty-language-versus-empty-word`.

## Results

| Measure | Derivatives | Thompson |
| --- | ---: | ---: |
| Completed proofs | 40 | 40 |
| Refutations | 23 | 23 |
| Budget unknown | 2 | 2 |
| Total pairs discovered / maximum per case | 463 / 256 | 486 / 256 |
| Total transitions attempted | 608 | 653 |
| Maximum initial two-input representation size | 26 expression nodes | 76 NFA vertices |
| Maximum observed sum of two state widths | 116 expression nodes | 43 active NFA vertices |
| One traced run, initialization / search | 6.27 ms / 118.96 ms | 12.61 ms / 32.90 ms |

Two malformed and four model-excluded cases were refused before either
solver ran. Across both methods, 16,380 finite membership checks had zero
disagreements. All 46 reported witness instances replayed independently at
their shortest lengths, including `aaaaaa` against the empty language.
There were zero detected false assertions and zero method disagreements.
Those counts describe this corpus and its checks.

The separate raw same-language controls ran Python 3.13.5 `re` with default
flags and fixed tiny subjects. Spans use the native half-open string slice
indices. The same IDs connect these runtime examples with their manually
authored language projections.

| Compared patterns | Subject | Observed difference |
| --- | --- | --- |
| `a\|ab` and `ab\|a` | `ab` | Search and iteration choose `[0,1)` and `[0,2)`. Replacing with `X` yields `Xb` and `X`. |
| `(a)b` and `a(b)` | `ab` | The selected span agrees. Capture 1 and its substitution give `a` and `b`. |
| `(?:(a)\|a)` and `(?:a\|(a))` | `a` | The selected span agrees. Capture 1 participates only on the left. The replacement expands to `<a>` and `<>`. |

These observations refute transferring language equality to those operation
relations. They are observations of one CPython runtime and three inputs.
[CPython v3.13.5 API documentation source, Regular Expression Syntax and compiled pattern operations](https://github.com/python/cpython/blob/v3.13.5/Doc/library/re.rst).

The state-growth case admits the same words on each side by the elementary
positive-class/union identity. Both searches reach their 256-pair budget.
Tracking whether the ninth symbol from the end is `a` explains the growth.
Each distinct nine-symbol suffix can be distinguished by an extension of up
to eight symbols that brings the differing position into that slot. The
Thompson graph has two vertices per input-tree node. For two graphs with
`m` and `n` vertices, their paired-subset graph has
an upper bound of `2^(m+n)` states. The derivative route can also grow
residual expressions and may represent the same language in several states.
Neither the deterministic state count nor one traced execution establishes
a wall-clock bound.

The profiled run measured about 1.345 s total and 2,534,762 peak Python
allocation bytes tracked by `tracemalloc`, including finite oracles, with
Windows CPython 3.13.5 under PowerShell. Timings share that measurement
overhead. Representation counts use different units. This sample favors
Thompson search time under these implementations but cannot establish a
production performance ranking. The canonical record excludes timing and
memory measurements. Its canonical LF serialization has SHA-256
`449d917c1c84b8e2993c474beed2a933275237389195e7c6aa35e7a43551a970`.

## Compiler handoff and triggers

If the compiler owner has a concrete whole-input comparison use case,
define the accepted IR subset, text/predicate interpretation and option
identity, then prove the correspondence and replay witnesses against
independently authored cases. Preserve provenance for the relation, scope,
limit and source. Return unknown on exhaustion. Keep the Thompson
construction as a different reference when testing alternative solvers.
Measure realistic latency and memory after the owner sets the query budget.

Revisit stronger methods only when a specific operation requires them.
A selected-span or local-rewrite proposal needs a defined priority/context
relation and independent evidence, with explicit capture, iteration and
replacement obligations when relevant. A caseless or Unicode proposal needs
a versioned predicate and option contract and counterexamples at its
boundaries. A budget failure, mismatch during witness replay, or change to
the compiler's rewrite or language authority triggers review.
