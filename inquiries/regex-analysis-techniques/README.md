---
title: Regex analysis techniques
programs:
  - Fourth Edition Architecture
  - Regex Analysis & Explanation
horizon: Fourth Edition
maturity: Exploratory
last-reviewed: 2026-08-12
review-triggers:
  - New comparative or reproduced evidence for a portfolio technique
  - STRling ratifies an analysis query/result or entitlement contract
  - Expansion of supported semantic envelopes or observable relations
---

# Regex analysis techniques

## Research question

How should STRling select and combine derivative, automata, symbolic, relational, abstract, constraint, operational, empirical, and hybrid techniques for specific analysis properties and semantic envelopes?

## Motivation / decision informed

The answer may inform future method selection for nullability, safety, ambiguity, equivalence, containment, witnesses, counterexamples, why-no-match, repair, portability, and editor-latency queries.

## Current state

The modern report replaces the historical two-technique framing with a property-specific portfolio. At reviewed commit [`6ff362a`](https://github.com/strling-lang/strling/tree/6ff362ac261d38aff282173c08a8841d3c5704cf/core), the Rust core exposes canonical semantic, structural, and safety analyses with typed uncertainty and complexity limits. This is useful implementation evidence, not adoption of the report’s dispatcher, semantic envelopes, guarantee matrix, or derived-view portfolio.

## Scope

Technique applicability by property, semantic feature envelope, observable relation, soundness/completeness requirement, target scope, budget, witness and proof production, caching, refusal, and composition with controlled execution.

## Non-goals

This inquiry does not redefine equivalence, safety, validation, portability, or explanation requirements. It consumes those inquiries’ questions and owns method selection and composition. It does not select a production architecture or canonical automaton.

## Research method

The modern AI-assisted report surveyed formal and practical technique families, defined semantic envelopes, proposed a property-to-technique dispatch matrix, and compared epistemic result categories. The historical derivative-versus-graph report remains context for an earlier architecture proposal. Current STRling analysis files were inspected, but no comparative prototype or benchmark was run.

## Evidence and source quality

Current compiler facts are verified against a pinned repository revision. The modern report cites relevant primary papers and official tool documentation, but its opaque citation mapping was removed and the comparative guarantee/performance matrix has not been reproduced. Maturity therefore remains exploratory.

## Findings

- No single representation is appropriate for every analysis property or observable relation.
- Method entitlement depends on the query property, modeled semantics, supported feature envelope, requested guarantee, target scope, resource budget, and explanation need.
- Canonical Semantic IR should remain semantic authority; residual expressions, NFAs/DFAs, symbolic automata, tagged models, search trees, constraints, and executions are derived views.
- Cheap shared semantic and structural facts can discharge queries or constrain heavier methods without becoming proof for unsupported properties.
- Language acceptance, selected span, captures, iteration, operation behavior, and target behavior are distinct observables and may require different analyzers.
- A staged portfolio can combine exact decision procedures, sound abstractions, bounded witness search, and concrete validation if each stage keeps a typed epistemic role.
- Result states must distinguish proven, refuted by a valid witness, unknown/resource-exhausted, unsupported/refused, and empirical evidence only.

## Limits, uncertainty, and negative knowledge

The report does not establish comparative performance, implementation cost, proof-object checking, cache stability, witness minimality, or sound handling of every lookaround, capture, backreference, recursion, priority, or replacement behavior. No shared corpus or prototype has validated dispatch thresholds. Failure, timeout, bounded search, and no found counterexample are not proofs.

## Alternatives considered

A universal derivative engine, canonical Thompson NFA or DFA, symbolic automata, tagged automata, graph ambiguity checks, abstract interpretation, SMT/constraint solving, operational search models, fuzzing, differential execution, and staged portfolios were compared.

## Implications for STRling

The existing canonical facts and typed uncertainty can form inputs to future property-specific analyzers. A query contract could prevent tools from asking an analyzer to make claims outside its semantic entitlement while preserving evidence and explanations across stages.

## Recommendations

The report recommends a candidate entitlement-aware dispatcher over shared facts and disposable derived views. Before adoption, define representative property/observable queries, build small competing prototypes, require checkable witnesses or proof artifacts where applicable, and measure accuracy, unknown rates, latency, memory, and explanation quality under explicit budgets.

## Rejected or abandoned alternatives

The historical recommendation to make symbolic derivatives the linter architecture is not current authority. Reject one canonical automaton, silent fallback from proof to testing, unsupported-feature erasure, and negative conclusions inferred from budget exhaustion.

## Downstream disposition

**Disposition:** none.

No portfolio dispatcher or technique selection from this inquiry is recorded as adopted.

## Reports

| Report | Role | Current status |
| --- | --- | --- |
| [STRling Semantic Regex Analysis](reports/regex-analysis-architecture.md) | Modern primary research input | Active input; partially verified and not prototyped. |
| [STRling Linter Architecture — Derivatives vs. Graph](reports/linter-derivatives-vs-graph.md) | Historical comparative proposal | Historical context; architecture and performance claims require revalidation. |

## Related inquiries

- [Regex equivalence and rewrite verification](../regex-equivalence-and-rewrite-verification/README.md)
- [Regex safety and complexity](../regex-safety-and-complexity/README.md)
- [Regex validation testing methods](../regex-validation-testing-methods/README.md)
- [Evidence-aware regex explanation](../evidence-aware-regex-explanation/README.md)

## Sources

- [`strling` core](https://github.com/strling-lang/strling/tree/6ff362ac261d38aff282173c08a8841d3c5704cf/core), reviewed commit `6ff362a`.
- Brzozowski, [Derivatives of Regular Expressions](https://doi.org/10.1145/321239.321249), 1964.
- Antimirov, [Partial Derivatives of Regular Expressions and Finite Automaton Constructions](https://doi.org/10.1016/0304-0208(95)00011-G), 1996.
- [Rust `regex-automata` documentation](https://docs.rs/regex-automata/).

[← Inquiries](../README.md)
