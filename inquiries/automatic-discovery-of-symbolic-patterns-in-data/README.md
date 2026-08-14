---
title: Automatic discovery of symbolic patterns in data
programs:
  - Beyond Patterns
horizon: Beyond Regex
maturity: Exploratory
last-reviewed: 2026-08-14
review-triggers:
  - A bounded declarative hypothesis language is formalized
  - A task corpus permits comparison of discovery portfolios and baselines
  - Candidate replay through an independent matcher is demonstrated
---

# Automatic discovery of symbolic patterns in data

## Research question

How can a system search for useful symbolic patterns in data while keeping the hypothesis space explicit, bounded, typed, resource-governed, and independently verifiable?

## Motivation / decision informed

The answer can separate a feasible induction research program from unrestricted universal search and can define what a discovery system must return for ordinary semantic verification.

## Current state

The report surveys sequential pattern mining, symbolic regression, sparse selection, constraint and inductive logic programming, multi-model fitting, grammar induction, residual search, and library learning. It proposes a portfolio of bounded proposal mechanisms over an externally defined declarative algebra. No shared hypothesis language, implementation, or benchmark currently validates that architecture.

## Scope

Bounded hypothesis spaces; typed bottom-up candidate construction; cost-layered and residual-guided search; decomposition, interleaving, multi-model fitting, hierarchy, and noise; proposal portfolios; pruning; candidate provenance; independent matcher verification; explicit incompleteness and budgets.

## Non-goals

This inquiry does not define the pattern algebra, decide whether a candidate is meaningful, make AI authoritative, or search all computable explanations. Evaluation is owned by [Meaningfulness](../meaningfulness-compression-recurrence-and-false-discovery/README.md).

## Research method

The synthesis compares families of induction methods by the restrictions that make their searches practical. It spot-checks representative primary work and preserves the common architecture as an inference, not a claim that the algorithms share one objective or engine.

## Evidence and source quality

Primary work supports prefix-projected mining and other deliberately restricted searches; computability results reject unrestricted universal induction as an executable target. The proposed portfolio and common candidate contract remain AI-assisted architecture inference. Maturity remains Exploratory.

## Findings

- Practical discovery depends on a declared hypothesis language and resource profile. A timeout around an unrestricted programming language is not an adequate bound.
- Different pattern families need specialized proposal mechanisms; no single search algorithm is supported across subsequences, numeric relations, latent partitions, hierarchies, and grammars.
- Structural search should be separated from parameter fitting, and candidate construction should be typed and cost-layered.
- Residuals can guide later search; hierarchical discovery should mine reusable patterns among accepted patterns rather than flattening every level into one pass.
- Discovery scores should expose a vector of search and fit evidence, not decide scientific meaningfulness.
- Final candidates should be ordinary declarative patterns replayed by a verifier intentionally independent of the discovery procedure.

The candidate semantics are supplied by [Relational Pattern Algebra](../relational-pattern-algebra-for-sequences-and-structured-values/README.md); execution feasibility is governed by [Computational Boundaries](../computational-models-and-complexity-limits-of-symbolic-matching-and-discovery/README.md).

## Limits, uncertainty, and negative knowledge

The common candidate representation does not yet exist. Completeness, scalability, benchmark tasks, stopping rules, search provenance, hierarchy semantics, and independence of verification remain untested. Similar generate-and-check patterns across algorithms do not imply one implementation.

## Alternatives considered

Exhaustive enumeration; one learned generator; stochastic program synthesis; specialized miners with exported artifacts; a portfolio over a bounded algebra; and no automatic discovery.

## Implications for STRling

A future discovery tool could remain operationally adjacent to matching while emitting inspectable patterns and evidence. This does not authorize changes to STRling or make discovered candidates correct, meaningful, or accepted.

## Recommendations

Formalize one small hypothesis language and benchmark before architecture work. Require explicit budgets, search provenance, ordinary-matcher replay, adversarial baselines, and honest incomplete or exhausted outcomes.

## Rejected or abandoned alternatives

Reject universal induction, unbounded hypothesis programs, discovery-specific semantics, and self-verification by the same procedure that generated the candidate.

## Downstream disposition

**Disposition:** none.

Any prototype or adoption requires Program Owner review. See [Beyond Patterns](../../programs/beyond-patterns/README.md).

## Reports

- [Bounded Symbolic Discovery for a Future STRling System](reports/automatic-discovery-of-symbolic-patterns-in-data.md) — active AI-assisted research input; partially verified and non-canonical.

## Sources

- [PrefixSpan: Mining Sequential Patterns Efficiently by Prefix-Projected Pattern Growth](https://hanj.cs.illinois.edu/pdf/span01.pdf) — bounded sequential pattern-mining prior art.
- [Syntax-Guided Synthesis](https://sygus-org.github.io/) — grammar-bounded synthesis community and specifications.

[← Inquiries](../README.md)
