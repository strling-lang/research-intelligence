---
title: Regex analysis techniques
programs:
  - Fourth Edition Architecture
  - Regex Analysis & Explanation
horizon: Fourth Edition
maturity: Evidence-backed
last-reviewed: 2026-11-20
review-triggers:
  - New evidence from an independently authored language relation corpus or a witness mismatch
  - STRling ratifies an analysis query/result or entitlement contract
  - A specific selected-span or caseless question requires another model or predicate algebra
---

# Regex analysis techniques

## Research question

How should STRling select and combine derivative, automata, symbolic, relational, abstract, constraint, operational, empirical, and hybrid techniques for specific analysis properties and semantic envelopes?

## Motivation / decision informed

The answer may inform future method selection for nullability, safety, ambiguity, equivalence, containment, witnesses, counterexamples, why-no-match, repair, portability, and editor-latency queries.

## Current state

The [admitted private compiler tool](../../docs/THREE_GAP_INTEGRATION_2026-11-20.md#bounded-language-analysis) projects a declared Semantic IR fragment into a bounded Unicode-scalar language model. It decides whole-input equivalence, containment, and disjointness under its documented resource limits. Public compiler interfaces retain their own versioned contracts.

Fourth Edition 4.0.3 has canonical foundational, structural, and safety analysis stages. At the released closure revision, structural analysis preserves typed unknowns for certain caseless predicate and overlap decisions, and safety analysis produces structural risk evidence. This compiler work is independently related to the August portfolio proposal. The broader dispatcher remains a hypothesis. [Structural analysis](https://github.com/strling-lang/strling/blob/eba5dad3de3fa620eb1ea13e0514d02f4b23e288/docs/migration/structural-analysis.md), [safety analysis](https://github.com/strling-lang/strling/blob/eba5dad3de3fa620eb1ea13e0514d02f4b23e288/docs/migration/semantic-safety-analysis.md).

## Scope

Technique applicability by property, semantic feature envelope, observable relation, soundness/completeness requirement, target scope, budget, witness and proof production, caching, refusal, and composition with controlled execution.

## Non-goals

This inquiry does not redefine equivalence, safety, validation, portability, or explanation requirements. It consumes those inquiries’ questions and owns method selection and composition. It does not select a production architecture or canonical automaton.

## Research method

The August report surveyed a portfolio of methods. The current bounded study compares normalized derivatives with a Thompson ε-NFA implementation using an independently defined finite-word oracle and a formal reachable-state argument. The fixture corpus includes explicit budget failures. [Comparative study](../regex-equivalence-and-rewrite-verification/reports/bounded-language-relation-study.md).

## Evidence and source quality

The scoped language result rests on a declared model, a formal argument, primary publications and deterministic replay. Both methods decided the same 63 relation cases and returned unknown on two budgeted cases. The broader guarantee and performance matrix and unresolved historical citation mappings remain provisional. The publisher record corrects the earlier Antimirov citation. [Comparative study methods and results](../regex-equivalence-and-rewrite-verification/reports/bounded-language-relation-study.md), [Antimirov publisher record](https://www.sciencedirect.com/science/article/pii/0304397595001824).

## Findings

- No single representation is appropriate for every analysis property or observable relation.
- Method entitlement depends on the query property, modeled semantics, supported feature envelope, requested guarantee, target scope, resource budget, and explanation need.
- Canonical Semantic IR should remain semantic authority; residual expressions, NFAs/DFAs, symbolic automata, tagged models, search trees, constraints, and executions are derived views.
- Cheap shared semantic and structural facts can discharge queries or constrain heavier methods without becoming proof for unsupported properties.
- Language acceptance, selected span, captures, iteration, operation behavior, and target behavior are distinct observables and may require different analyzers.
- A staged portfolio can combine exact decision procedures, sound abstractions, bounded witness search, and concrete validation if each stage keeps a typed epistemic role.
- Result states must distinguish proven, refuted by a valid witness, unknown/resource-exhausted, unsupported/refused, and empirical evidence only.
- In the finite-alphabet model, both derivative and NFA state-set searches support language equality, containment, and disjointness, with independently replayed shortest witnesses. The witness for an overlap can be the empty word even when positive leading symbols are disjoint.

## Limits, uncertainty, and negative knowledge

Comparative production performance, implementation cost, proof-object checking, cache stability, and dispatch thresholds remain untested. The experiment's shortest-witness claim is confined to the declared word domain and completed search. Richer observables and excluded operators require their own decision procedure and evidence. Budget exhaustion leaves the relation unknown.

## Alternatives considered

A universal derivative engine, canonical Thompson NFA or DFA, symbolic automata, tagged automata, graph ambiguity checks, abstract interpretation, SMT/constraint solving, operational search models, fuzzing, differential execution, and staged portfolios were compared.

## Implications for STRling

Existing canonical facts and typed uncertainty can inform a future property-specific query contract. A whole-input comparison can expose the precise relation and witness without committing to a general dispatcher or stronger observables.

## Recommendations

If a compiler-owned comparison decision arises, define the language relation and IR projection first. Keep the independent Thompson construction for cross-checking. Measure latency, memory, and refusal rates on realistic input before selecting an implementation. Revisit broader dispatch when a concrete query requires more than one property model.

## Rejected or abandoned alternatives

The historical recommendation to make symbolic derivatives the linter architecture is not current authority. Reject one canonical automaton, silent fallback from proof to testing, unsupported-feature erasure, and negative conclusions inferred from budget exhaustion.

## Downstream disposition

**Disposition:** partially accepted. The compiler admitted the private whole-input comparison tool for its exact fragment and analysis scope. The general dispatcher proposal has no recorded adoption. [Compiler admission](https://github.com/strling-lang/strling/pull/152).

## Reports

| Report | Role | Current status |
| --- | --- | --- |
| [Comparing bounded regular-language decision procedures](../regex-equivalence-and-rewrite-verification/reports/bounded-language-relation-study.md) | Executed comparative study | Evidence-backed for the declared word model. |
| [STRling Semantic Regex Analysis](reports/regex-analysis-architecture.md) | Modern primary research input | Active input; partially verified and not prototyped. |
| [STRling Linter Architecture — Derivatives vs. Graph](reports/linter-derivatives-vs-graph.md) | Historical comparative proposal | Historical context; architecture and performance claims require revalidation. |

## Related inquiries

- [Regex equivalence and rewrite verification](../regex-equivalence-and-rewrite-verification/README.md)
- [Regex safety and complexity](../regex-safety-and-complexity/README.md)
- [Regex validation testing methods](../regex-validation-testing-methods/README.md)
- [Evidence-aware regex explanation](../evidence-aware-regex-explanation/README.md)

## Sources

- [`strling` compiler specification hub at the 4.0.3 closure](https://github.com/strling-lang/strling/blob/eba5dad3de3fa620eb1ea13e0514d02f4b23e288/spec/README.md).
- Brzozowski, [Derivatives of Regular Expressions](https://doi.org/10.1145/321239.321249), 1964.
- Antimirov, [Partial Derivatives of Regular Expressions and Finite Automaton Constructions](https://doi.org/10.1016/0304-3975(95)00182-4), 1996.
- [Rust `regex-automata` documentation](https://docs.rs/regex-automata/).

[← Inquiries](../README.md)
