---
title: Weighted and approximate patterns
programs:
  - Beyond Regex
horizon: Beyond Regex
maturity: Exploratory
last-reviewed: 2026-08-12
review-triggers:
  - Concrete approximate-matching user need
  - Focused evaluation of weighted automata or edit-distance systems
---

# Weighted and approximate patterns

## Research question

How should edit distance, fuzzy matching, weighted automata, scoring, probability, and calibrated confidence be distinguished, composed, and explained in possible future pattern systems?

## Motivation / decision informed

The answer could prevent misleading semantics if STRling ever studies approximate results or interoperates with systems that produce scores.

## Current state

The historical report surveys weighted automata, semirings, edit metrics, confusion costs, Viterbi search, and confidence outputs, but often moves from cost to probability without adequate calibration boundaries.

## Scope

Distance metrics, weighted transitions, semirings, ranking, thresholds, probabilistic models, calibration, result semantics, provenance, and explanation.

## Non-goals

This inquiry does not treat a score as a probability, claim confidence without calibration evidence, select a weighted IR, or commit STRling to fuzzy or stochastic matching.

## Research method

Current work preserves and separates the historical concepts. Later research should use formal definitions, primary algorithm literature, benchmark tasks, calibration evaluation where probability is claimed, and comparisons with established libraries.

## Evidence and source quality

The report is AI-assisted with a bibliography. Formal and empirical claims, especially confidence conversion and real-time performance, require verification.

## Findings

Edit distance is a defined cost or distance, weighted automata generalize transition aggregation under a chosen algebra, scores order or filter results under a convention, probabilities require a probabilistic model, and calibrated confidence requires empirical calibration against outcomes. These terms are not interchangeable.

## Limits, uncertainty, and negative knowledge

No current user task, training data, calibration method, target semantics, or product boundary is established. Composition with language models introduces additional provenance and nondeterminism questions.

## Alternatives considered

Host libraries, specialized search engines, edit-distance automata, weighted finite-state toolkits, probabilistic models, post-processing rankers, and separate approximate-search services.

## Implications for STRling

Any future result contract must name what the numeric value means, its algebra or model, direction, range, comparability, and evidence. Boolean regex matching can remain the right abstraction.

## Recommendations

Keep Beyond Regex and select a concrete task before further architecture work. Require calibration evidence for probability or confidence language.

## Rejected or abandoned alternatives

A single “stochastic pattern logic” that collapses distance, weights, score, probability, and confidence is rejected.

## Downstream disposition

**Disposition:** none.

## Related research

- [Weighted Symbolic Similarity](../weighted-symbolic-similarity-and-evidence-combination/README.md) now owns the focused vector-first evidence and aggregation-contract question; this inquiry retains the broader approximate-pattern landscape.
- [Symbolic Equivalence](../symbolic-equivalence-confusability-and-human-interpretable-representation/README.md) owns the underlying exact, confusable, contextual, and uncertain relation types that numeric evidence must not erase.

## Reports

- [Stochastic Pattern Language Research](reports/stochastic-pattern-language.md) — historical research input; terminology and architecture require revalidation.
- [Legacy inquiry synthesis](reports/legacy-inquiry-synthesis.md) — superseded synthesis.

## Sources

See report bibliography pending focused formal and empirical verification.

[← Inquiries](../README.md)
