---
title: Weighted symbolic similarity and evidence combination
programs:
  - Beyond Patterns
horizon: Beyond Regex
maturity: Exploratory
last-reviewed: 2026-08-14
review-triggers:
  - A concrete approximate-matching task defines outcomes, data, and calibration criteria
  - Formal review of a proposed aggregation or semiring contract
  - Independent evaluation of learned weighting under distribution shift
---

# Weighted symbolic similarity and evidence combination

## Research question

How should heterogeneous exact, approximate, structural, and probabilistic evidence be typed, normalized, weighted, aggregated, thresholded, and explained without inventing a universal similarity or confidence scalar?

## Motivation / decision informed

The answer can prevent category errors and pseudo-precision when future research compares nonliteral symbolic relationships or ranks approximate matches.

## Current state

The report distinguishes distance, cost, similarity, fuzzy membership, score, likelihood, probability, and calibrated probability. It proposes vector-first evidence with optional named aggregation contracts. Weighted-automata and calibration literature support parts of the distinction, but no STRling task, data, or empirical calibration exists.

## Scope

Typed evidence vectors; distance, cost, score, probability, and calibration semantics; normalization; authored and learned weights; reliability versus importance; aggregation; missing evidence; thresholds, ranking, gates, Pareto comparison, provenance, and reproducibility.

## Non-goals

This inquiry does not define the symbolic relations that produce evidence, decide scientific meaningfulness, select a learned model, or promise approximate matching. Relation semantics belong to [Symbolic Equivalence](../symbolic-equivalence-confusability-and-human-interpretable-representation/README.md); discovery evaluation belongs to [Meaningfulness](../meaningfulness-compression-recurrence-and-false-discovery/README.md).

## Research method

The synthesis compares mathematical object types and aggregation families, checks representative weighted-automata and calibration sources, and treats the report's contract as a candidate rather than an adopted design. A future evaluation must start with one task and explicit decision loss.

## Evidence and source quality

Formal literature supports distinct algebras and statistical meanings, and calibration literature supports treating calibrated probabilities as empirical, population-bound claims. The broader architectural recommendation and example taxonomies are AI-assisted and only partially verified. Maturity remains Exploratory.

## Findings

- Evidence should remain vector-valued by default; each component needs a kind, value, scale contract, applicability, and provenance.
- Distance, cost, similarity, membership, score, likelihood, posterior probability, and calibrated probability are not interchangeable even when encoded on the same numeric range.
- Normalization establishes a scale convention, not commensurability. Sample-relative normalization can change meaning and ranking when the comparison set changes.
- Authored weights express policy or tradeoffs; learned weights are model parameters conditional on data and loss. Reliability is a separate concern.
- Missing evidence is not zero evidence. Non-compensable gates or lexicographic rules are preferable when one dimension must not offset another.
- Any scalar aggregate should be a named, versioned derived result that preserves its input vector and derivation.

## Limits, uncertainty, and negative knowledge

No universal aggregation is justified. Correlation can double-count evidence; thresholds can be unstable; learned coefficients can shift; and probability language is unsupported without an event model and calibration evidence. A score useful for ranking need not be interpretable across tasks or versions.

## Alternatives considered

One weighted sum; a shared 0–1 similarity scale; fuzzy aggregation; metric geometry; Pareto or vector comparison; semiring path aggregation; multi-criteria utility; learned ranking; and probabilistic fusion under explicit assumptions.

## Implications for STRling

If approximate evidence is ever exposed, result contracts should identify the mathematical meaning, direction, range, comparability, model or policy, and provenance of every numeric output. Boolean exact matching may remain the correct product abstraction.

## Recommendations

Adopt vector-first evidence as the research default. Permit scalarization only through an explicit task-bound contract, retain raw components, and reserve confidence or probability language for properly modeled and evaluated outputs.

## Rejected or abandoned alternatives

Reject arbitrary weighted sums, hidden sample-relative scaling, zero-filling missing evidence, and a single universal confidence value.

## Downstream disposition

**Disposition:** none.

No downstream API or product decision is recorded. See [Beyond Patterns](../../programs/beyond-patterns/README.md).

## Reports

- [Rigorous Semantics for Heterogeneous Symbolic Approximate Matching](reports/weighted-symbolic-similarity-and-evidence-combination.md) — active AI-assisted research input; partially verified and non-canonical.

## Sources

- [Finite-State Transducers in Language and Speech Processing](https://aclanthology.org/J97-2003/) — weighted finite-state prior art.
- [Classifier Calibration: A Survey](https://arxiv.org/abs/2112.10327) — calibration concepts and evaluation methods.

[← Inquiries](../README.md)
