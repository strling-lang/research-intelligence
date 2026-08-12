---
title: Regex analysis techniques
programs:
  - Fourth Edition Architecture
  - Regex Analysis & Explanation
horizon: Fourth Edition
maturity: Exploratory
last-reviewed: 2026-08-12
review-triggers:
  - New comparative evidence for derivative, graph, symbolic, or hybrid analyzers
  - Expansion of STRling analysis or explanation requirements
---

# Regex analysis techniques

## Research question

Which combinations of derivative, automata-graph, symbolic, abstract-interpretation, empirical, and hybrid methods best support bounded STRling analyses and explanations?

## Motivation / decision informed

This inquiry may inform method selection for safety, equivalence, containment, witnesses, counterexamples, why-no-match, repair, and editor latency.

## Current state

One historical report recommends symbolic derivatives for a real-time linter and sketches an implementation. Current STRling already has a canonical Rust analysis pipeline, so the report's assumed IR, schedule, and component architecture are obsolete as authority.

## Scope

Analysis method properties, supported feature envelopes, complexity, caching, witness production, explanation, incremental use, and composability with controlled execution.

## Non-goals

This inquiry does not select a production architecture, prove one technique universally superior, or conflate structural ambiguity detection with practical exploitability.

## Research method

The current work preserves and reframes the existing comparative input. A future review should reproduce representative algorithms, define common corpora and claims, and compare soundness, completeness, performance, witness quality, and implementation cost by feature subset.

## Evidence and source quality

The historical report cites academic and technical sources but remains unverified as a whole. Its benchmark expectations and architecture fit require reproduction against current compiler contracts.

## Findings

Derivatives and graph techniques expose different useful representations; neither should be selected from conceptual elegance alone. Method choice depends on the exact property, feature subset, proof obligation, latency budget, and explanation needs. Hybrid staged analysis is a live alternative.

## Limits, uncertainty, and negative knowledge

Comparative accuracy, worst-case growth, backreference/lookaround handling, incremental performance, and witness minimality remain unresolved. The report's suggested milestone sequence and “real-time” threshold are not current project commitments.

## Alternatives considered

Symbolic derivatives, partial derivatives, Thompson-style constructions, graph ambiguity checks, abstract interpretation, bounded execution, fuzzing, differential testing, and portfolio analysis.

## Implications for STRling

The compiler can expose stable semantic facts and evidence identities while allowing property-specific analyzers. Analysis outputs should state their supported envelope and uncertainty.

## Recommendations

Build a claim-centered evaluation matrix before any architecture decision. Include adversarial inputs, unsupported constructs, counterexample quality, resource bounds, and integration with canonical Semantic IR.

## Rejected or abandoned alternatives

The historical report's derivative engine is not an accepted architecture. A single analyzer for all properties is not assumed.

## Downstream disposition

**Disposition:** none.

## Reports

| Report | Role | Current status |
| --- | --- | --- |
| [STRling Linter Architecture — Derivatives vs. Graph](reports/STRling%20Linter%20Architecture%20-%20Derivatives%20vs.%20Graph.md) | Historical comparative proposal | Preserved; architecture and performance claims require revalidation. |

## Sources

See the report bibliography pending focused verification.

[← Inquiries](../README.md)
