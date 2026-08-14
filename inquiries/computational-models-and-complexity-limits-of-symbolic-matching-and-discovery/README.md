---
title: Computational models and complexity limits of symbolic matching and discovery
programs:
  - Beyond Patterns
horizon: Beyond Regex
maturity: Exploratory
last-reviewed: 2026-08-14
review-triggers:
  - Formal complexity review of a proposed operator fragment or composition
  - A compiler prototype emits checkable execution-class contracts
  - New algorithms or lower bounds materially change a classified boundary
---

# Computational models and complexity limits of symbolic matching and discovery

## Research question

How should a compiler classify the runtime, compilation, decidability, and discovery consequences of symbolic pattern features and their combinations, and when should it dispatch, budget, warn, or refuse?

## Motivation / decision informed

Syntax that looks locally modest can change the computational model. A durable taxonomy can prevent one neighboring operator's guarantee from being incorrectly inherited by relational, recursive, graph, solver, or discovery workloads.

## Current state

The report surveys finite-state, symbolic-automata, register, backreference, parsing, relational-query, graph, string-constraint, and synthesis boundaries. It argues for compiler-visible classification and specialized backends. Representative automaton-identification and database precedents were checked, but the full taxonomy and every cited bound require formal review.

## Scope

Data, pattern, and compiled-state size; combined versus data complexity; compiler complexity signatures; runtime and memory classes; ambiguity; algorithm dispatch; parameterized tractability; combinatorial and undecidable boundaries; multidimensional budgets; warnings, refusals, and execution outcomes; discovery complexity.

## Non-goals

This inquiry does not redefine semantic operators, choose product features, prove safety from timeouts, or conflate matcher and discovery complexity. Operator meaning belongs to [Relational Pattern Algebra](../relational-pattern-algebra-for-sequences-and-structured-values/README.md).

## Research method

The synthesis groups claims by computational dependency structure and separates compile-time, fixed-pattern execution, combined complexity, and discovery. Future work should formalize an operator interaction matrix and independently review every guarantee or lower bound used for admission policy.

## Evidence and source quality

Primary complexity results support the central warning that finite-state matching and automaton discovery have different costs, and that capture, join topology, recursion, or string theories can cross major boundaries. The proposed classification contract and dispatch architecture remain AI-assisted synthesis. Maturity remains Exploratory.

## Findings

- Computational class follows semantic dependency structure, not whether syntax is called regex or symbolic.
- Input size, pattern size, compiled-state size, capture or variable count, window or nesting bounds, and structural width must remain distinct parameters.
- “Linear” is incomplete unless the fixed variables, compilation cost, memory model, operation, and target are named.
- Matching a supplied pattern and discovering a pattern in the same class are separate problems and can have radically different complexity.
- Unary predicates over large domains may remain finite-state, while remembered substring equality, cyclic joins, arbitrary graph topology, nonlinear constraints, or executable predicates may require different classes or become undecidable.
- The compiler should expose a complexity signature, select a justified backend, apply multidimensional budgets, and return typed outcomes such as completed, exhausted, refused, unsupported, or indeterminate.

## Limits, uncertainty, and negative knowledge

The report is not a proof of one complete taxonomy. Worst-case class does not predict every workload; parameterized islands may be useful; and individually decidable features may interact badly. Resource caps limit harm but do not prove tractability or semantic completeness.

## Alternatives considered

One universal VM; always interpret; compile everything to automata; send every rich case to a solver; warning-only policies; or compiler classification with specialized backends and explicit refusal boundaries.

## Implications for STRling

If generalized symbolic operators are ever considered downstream, their admission should include formal class, algorithm family, compilation and execution bounds, memory policy, discovery consequences, and unsupported combinations. This does not modify current STRling guarantees.

## Recommendations

Develop a reviewed semantic-feature interaction matrix and a small execution-contract vocabulary. Prototype classification before any generalized matcher, and treat unknown combinations as unknown rather than inheriting adjacent guarantees.

## Rejected or abandoned alternatives

Reject a single strongest algorithm, scalar safety labels, timeout-as-proof, and silent fallback from exact semantics to heuristic execution.

## Downstream disposition

**Disposition:** none.

Any compiler or runtime change belongs to `strling` and its Program Owner. See [Beyond Patterns](../../programs/beyond-patterns/README.md).

## Reports

- [Execution Boundaries for Symbolic Pattern Matching and Automatic Pattern Discovery](reports/computational-models-and-complexity-limits-of-symbolic-matching-and-discovery.md) — active AI-assisted research input; partially verified and non-canonical.

## Sources

- [Gold, Complexity of Automaton Identification from Given Data](https://doi.org/10.1016/S0019-9958(78)90562-4) — matching/discovery complexity separation precedent.
- [Symbolic Automata: The Toolkit](https://www.microsoft.com/en-us/research/publication/symbolic-automata-the-toolkit/) — symbolic automata over predicate-defined alphabets.
- [Oracle SQL pattern matching](https://docs.oracle.com/en/database/oracle/oracle-database/19/dwhsg/sql-pattern-matching-data-warehouses.html) — deployed relational row-pattern semantics.

[← Inquiries](../README.md)
