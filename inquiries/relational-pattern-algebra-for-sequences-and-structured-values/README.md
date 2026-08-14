---
title: Relational pattern algebra for sequences and structured values
programs:
  - Beyond Patterns
horizon: Beyond Regex
maturity: Exploratory
last-reviewed: 2026-08-14
review-triggers:
  - Formal review of the proposed algebra and its composition laws
  - A representative task corpus tests structure, relation, weave, and correspondence semantics
  - Complexity analysis establishes tractable supported fragments
---

# Relational pattern algebra for sequences and structured values

## Research question

What bounded declarative algebra can separate sequence structure from typed value and subsequence relations while supporting captures, explicit views, interleaving, correspondence, witnesses, and a defensible boundary before general programming?

## Motivation / decision informed

The answer can frame expressive relational pattern research without disguising arbitrary computation as regex or making discovery part of matching semantics.

## Current state

The report proposes regular structural composition plus a closed typed relational layer, explicit views and weave, immutable captures, relational lifts, and compiler-visible expressiveness strata. Kleene-style algebras, symbolic automata, SQL row-pattern recognition, register/data-word models, linear arithmetic, and parser combinators provide relevant prior art. The specific kernel and laws have not been formally validated.

## Scope

Structure versus relation; ordered views; scalar and sequence relation sorts; captures and constraints; `project`, `weave`, `adjacent`, `window`, and `correspond`; explicit alignment; affine and specialized theories; match witnesses; the syntax-level programming boundary.

## Non-goals

This inquiry does not discover unknown patterns, define symbolic observations or relation evidence, select a runtime, or extend current STRling regex semantics. Candidate generation belongs to [Automatic Discovery](../automatic-discovery-of-symbolic-patterns-in-data/README.md).

## Research method

The synthesis compares the proposed decomposition with formal-language, database, constraint, and combinator precedents, then preserves unproven operator interactions as open questions. Further work should define denotations and laws before surface syntax or implementation.

## Evidence and source quality

Established prior art supports separating regular structure, predicates, relational row conditions, and observable match roles. It also shows that small capture or composition changes can alter decidability and complexity. The exact proposed vocabulary is an AI-assisted architectural inference, not an established standard; maturity remains Exploratory.

## Findings

- Structural arrangement and value relations are different semantic sorts. Interleaving is structure; arithmetic progression is a derived relation over a declared view.
- A small structural kernel plus typed closed theories is more analyzable than an open-ended expression language.
- Captures should be immutable semantic bindings. Captured data may parameterize supported constraints but should not construct arbitrary future pattern syntax.
- Subsequence relations require explicit traversal and alignment. `weave` or lane assignment must be declared rather than guessed during ordinary matching.
- Successful matches need proof-relevant witnesses for source extents, choices, captures, partitions, relation bindings, and correspondence.
- Expressiveness must be classified in strata; individually tractable operators may become intractable or undecidable in combination.

Computational guarantees are owned by [Computational Boundaries](../computational-models-and-complexity-limits-of-symbolic-matching-and-discovery/README.md), not by this semantic inquiry.

## Limits, uncertainty, and negative knowledge

The report does not prove closure, decidability, equivalence procedures, completeness of the kernel, user comprehensibility, or performance. Arbitrary-length correspondence, backreference-like equality, nonlinear theories, hierarchy, and mixed operators may require different semantic classes and backends.

## Alternatives considered

Extend regex with callbacks; embed a general expression language; use parser or relational combinators; define independent domain DSLs; or maintain a bounded typed algebra dispatched to specialized mechanisms.

## Implications for STRling

A future investigation could reuse compiler discipline—typed semantics and explicit lowering—without putting relational operators into the current regex IR. Shared compiler vocabulary does not imply one IR or engine.

## Recommendations

Formalize the smallest denotational kernel, witness contract, and interaction matrix. Require every operator to declare semantic sort and computational class before any prototype or downstream proposal.

## Rejected or abandoned alternatives

Reject arbitrary callbacks, mutable captures, general folds, user recursion, dynamic pattern construction, and the assumption that all named motifs must be primitives.

## Downstream disposition

**Disposition:** none.

Formal and product adoption remain with their future owning authority. See [Beyond Patterns](../../programs/beyond-patterns/README.md).

## Reports

- [Declarative Relational Pattern Algebra for Future STRling Research](reports/relational-pattern-algebra-for-sequences-and-structured-values.md) — active AI-assisted research input; partially verified and non-canonical.

## Sources

- [Oracle SQL pattern matching](https://docs.oracle.com/en/database/oracle/oracle-database/19/dwhsg/sql-pattern-matching-data-warehouses.html) — deployed separation of row patterns, definitions, and measures.
- [SMT-LIB logics](https://smt-lib.org/logics.shtml) — formal distinctions among background theories, including linear and nonlinear arithmetic.

[← Inquiries](../README.md)
