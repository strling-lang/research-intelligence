---
title: Meaningfulness, compression, recurrence, and false discovery
programs:
  - Beyond Patterns
horizon: Beyond Regex
maturity: Exploratory
last-reviewed: 2026-08-14
review-triggers:
  - A discovery benchmark defines null models, baselines, and held-out evaluation
  - Independent statistical review of the proposed evidence profile
  - A domain task supplies explicit utility, semantic, or causal criteria
---

# Meaningfulness, compression, recurrence, and false discovery

## Research question

What evidence can justify attention to an automatically discovered symbolic pattern, and how should compression, fit, recurrence, significance, prediction, stability, novelty, usefulness, semantics, and causality remain distinct?

## Motivation / decision informed

Discovery can produce vast numbers of technically valid candidates. This inquiry defines the evidentiary burden for ranking and describing them without turning frequency, short syntax, or a small p-value into “meaning.”

## Current state

The report proposes validity gates, a multidimensional evidence profile, Pareto filtering, and optional task-specific ranking. It draws on Minimum Description Length, multiple-testing control, held-out prediction, stability, residual analysis, and novelty. Representative MDL and false-discovery sources were checked; the full framework has not been empirically evaluated.

## Scope

Model-plus-residual compression; complexity accounting; fit, coverage, recurrence, significance and effect size; search-induced multiplicity; prediction; robustness and stability; novelty and redundancy; residual adequacy; utility; claim vocabulary; semantic and causal boundaries.

## Non-goals

This inquiry does not generate candidates, define matcher semantics, supply domain meaning, infer causality from association, or produce one universal meaningfulness score. Candidate generation belongs to [Automatic Discovery](../automatic-discovery-of-symbolic-patterns-in-data/README.md).

## Research method

The synthesis separates evidence dimensions by what each can and cannot establish, checks representative primary and survey sources, and treats the evaluation contract as a testable proposal. Future work must reproduce the complete discovery-and-selection process, not evaluate only surviving candidates.

## Evidence and source quality

Established statistical and information-theoretic work supports complexity penalties, explicit nulls, multiple-testing control, and held-out evaluation. The proposed combined profile and ranking order are architectural inference, while domain meaning, utility, and causality necessarily require external evidence. Maturity remains Exploratory.

## Findings

- A pattern earns attention only relative to explicit alternatives and evidence dimensions; truth on the observed sample is insufficient.
- Generative compression must charge the pattern, parameters, exceptions, and residuals against a stated baseline. Short pattern syntax alone is not MDL evidence.
- Frequency, recurrence, statistical significance, prediction, stability, novelty, usefulness, semantic interpretation, and causality establish different claims.
- Adaptive search changes the evidentiary burden. Multiplicity and null calibration should cover the selection procedure, not only the final candidate.
- Held-out prediction and perturbation stability are important corroboration but do not establish causality or semantic meaning.
- Validity gates and evidence profiles should precede Pareto comparison or any task-specific scalar ranking; missing evidence must remain missing.

## Limits, uncertainty, and negative knowledge

There is no domain-independent null model, perturbation policy, utility, causal design, or semantic ground truth. Compression can reward the wrong model language; stable bias remains bias; recurrence may reflect dependence; and adaptive reuse can invalidate naïve holdouts. The framework itself requires empirical comparison.

## Alternatives considered

Frequency ranking; shortest syntax; one significance value; a universal meaningfulness score; pure MDL selection; pure prediction; expert review only; or multidimensional model criticism with task-specific decisions.

## Implications for STRling

Any future discovery-facing product should make evidence and claim boundaries visible and avoid labels such as meaningful, causal, or confident unless their separate requirements are satisfied. No product change is authorized here.

## Recommendations

Define a versioned evidence-profile contract and claim vocabulary before discovery experiments. Evaluate selection-aware null calibration, holdouts, stability, residuals, and redundancy on explicit tasks.

## Rejected or abandoned alternatives

Reject one domain-independent meaningfulness score and any inference that compression, recurrence, significance, prediction, or stability alone supplies semantic or causal meaning.

## Downstream disposition

**Disposition:** none.

Any use in a product or research gate requires Program Owner and domain-expert review. See [Beyond Patterns](../../programs/beyond-patterns/README.md).

## Reports

- [Evaluating Automatically Discovered Symbolic Patterns: A Defensible Evidence Framework](reports/meaningfulness-compression-recurrence-and-false-discovery.md) — active AI-assisted research input; partially verified and non-canonical.

## Sources

- [The Minimum Description Length Principle for Pattern Mining: A Survey](https://arxiv.org/abs/2007.14009) — MDL pattern-mining synthesis.
- [Krimp: mining itemsets that compress](https://doi.org/10.1007/s10618-010-0202-x) — pattern-set selection by compression.
- [Benjamini and Hochberg, Controlling the False Discovery Rate](https://doi.org/10.2307/2346101) — foundational FDR procedure and scope.

[← Inquiries](../README.md)
