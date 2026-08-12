---
title: Regex validation testing methods
programs:
  - Fourth Edition Architecture
  - Regex Conformance Science
horizon: Fourth Edition
maturity: Exploratory
last-reviewed: 2026-08-12
review-triggers:
  - Adoption or evaluation of a generated-testing strategy
  - Material change to Semantic IR, lowering, or oracle boundaries
  - A replicated study changes the expected value of a testing technique
---

# Regex validation testing methods

## Research question

How can STRling and regex-system research systematically discover semantic defects through generation, oracles, properties, metamorphic and differential testing, and reduction?

## Motivation / decision informed

The answer may inform compiler validation strategy, generator design, oracle selection, regression promotion, failure triage, and the handoff from discovered cases to scientific evidence.

## Current state

STRling commit [`9991575`](https://github.com/strling-lang/strling/tree/9991575b347ac5f56108f18065c88b2b16a5065a) contains stage-specific and property tests across the canonical Rust path, but this inquiry does not establish a comprehensive generated-testing system. Regex Conformance at [`f8c603a`](https://github.com/strling-lang/regex-conformance/tree/f8c603a1a4f5f827247f8a5bed61c85f483857f8) has no certified observations; generated cases are not automatically admitted as evidence.

## Scope

Semantic IR generation, grammar-aware mutation, property and metamorphic testing, bounded independent oracles, differential testing, stage contracts, coverage guidance, shrinking, reproducibility, nondeterminism, and regression promotion.

## Non-goals

This inquiry does not define when a discovered result becomes certified evidence, own execution provenance or correction, specify production tests, or prove rewrite equivalence. Evidence admission belongs to [Regex Conformance evidence methodology](../regex-conformance-evidence-methodology/README.md); universal proof belongs to [Regex equivalence and rewrite verification](../regex-equivalence-and-rewrite-verification/README.md).

## Research method

The report synthesized compiler-testing, property-based testing, fuzzing, metamorphic testing, differential testing, and reduction methods against STRling's compiler stages and Conformance boundaries. This README extracts method-selection principles rather than adopting a test architecture.

## Evidence and source quality

Current repositories and several foundational primary method sources were checked. Exact defect counts, tool performance, regex-specific technique claims, and some candidate metamorphic relations remain partially verified. No STRling experiment compares the alternatives yet.

## Findings

- Generated volume is useful only when inputs are semantically meaningful and failures have an applicable oracle.
- Semantic IR generation can reach deeper compiler stages than random bytes while preserving invariants and enabling targeted invalid cases.
- Differential disagreement is a signal requiring semantic classification, not an oracle of majority truth.
- Metamorphic relations must declare preconditions and the observable they preserve; language identities may fail for captures or match selection.
- Independent bounded models can provide strong oracles for small fragments.
- Stage-specific properties localize defects better than comparing only final emitted strings.
- Stable failures need semantic shrinking that preserves the original contradiction and exact reproducibility context.
- Discovery cases should be classified and minimized before promotion into deterministic regressions or Conformance vectors.

## Limits, uncertainty, and negative knowledge

Generator distributions, coverage metrics, oracle completeness, useful small-scope bounds, and nondeterminism policy have not been evaluated for STRling. Cross-engine disagreement may be legitimate. No finite generated suite proves semantic equivalence or scientific completeness.

## Alternatives considered

Example tests, random byte fuzzing, grammar generation, typed Semantic IR generation, coverage-guided mutation, differential comparison, metamorphic relations, bounded interpreters, exhaustive enumeration, mutation testing, and hybrid layering.

## Implications for STRling

Downstream test owners can select techniques per compiler stage and preserve failure provenance. Regex Conformance can receive well-framed candidate questions without treating the generator or discovery run as certification authority.

## Recommendations

The report recommends small semantically rich generators, co-generated discriminating subjects, independent stage properties, preconditioned metamorphic relations, applicability-aware differential testing, automatic reduction, and deliberate promotion of stable cases. These remain research recommendations.

## Rejected or abandoned alternatives

Random bytes as the primary strategy, engine consensus as truth, unqualified algebraic identities, unbounded Cartesian engine comparisons, and unreduced flaky failures are rejected as sufficient methods.

## Downstream disposition

**Disposition:** none.

## Reports

| Report | Role | Source verification |
| --- | --- | --- |
| [Advanced Semantic Testing for STRling and Regex Engines](reports/regex-validation-testing-methods.md) | Modern active research input | Partially verified; foundational methods and current repository boundaries checked. |

## Sources

- [STRling tests at `9991575`](https://github.com/strling-lang/strling/tree/9991575b347ac5f56108f18065c88b2b16a5065a/core/tests)
- [Regex Conformance at `f8c603a`](https://github.com/strling-lang/regex-conformance/tree/f8c603a1a4f5f827247f8a5bed61c85f483857f8)
- [Csmith](https://www.cs.utah.edu/~regehr/papers/pldi11-preprint.pdf)
- [QuickCheck](https://doi.org/10.1145/351240.351266)
- [Delta debugging](https://www.st.cs.uni-saarland.de/papers/tse2002/tse2002.pdf)
- [Fourth Edition Architecture program](../../programs/fourth-edition-architecture/README.md)
- [Regex Conformance Science program](../../programs/regex-conformance-science/README.md)

[← Inquiries](../README.md)
