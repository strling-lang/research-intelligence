---
title: Regex equivalence and rewrite verification
programs:
  - Regex Analysis & Explanation
  - Portability & Compatibility
horizon: Fourth Edition
maturity: Exploratory
last-reviewed: 2026-08-12
review-triggers:
  - Ratification of an equivalence relation or proof-evidence contract
  - Implementation or independent validation of a complete proof fragment
  - A counterexample invalidates a proposed rewrite class
---

# Regex equivalence and rewrite verification

## Research question

Which semantic relations between regexes or lowered artifacts can be proven, refuted, or bounded, and what provenance must accompany rewrite evidence?

## Motivation / decision informed

The answer may inform rewrite gating, containment, migration, counterexample generation, proof artifacts, diagnostics, and public Compare explanations.

## Current state

STRling at [`9991575`](https://github.com/strling-lang/strling/tree/9991575b347ac5f56108f18065c88b2b16a5065a) binds portability rewrites to authored strategy and evidence identities, but the inspected repository does not establish the report's proposed equivalence vocabulary or a general proof kernel as adopted contracts.

## Scope

Accepted-language, selection, span, capture, and operation relations; containment; witnesses; decidability boundaries; bounded verification; proof/refutation provenance; evidence invalidation; and rewrite gating.

## Non-goals

This inquiry does not define the portability ontology, generated-test system, safety policy, target profile facts, or product UI. Portability claim meaning belongs to [Regex portability semantics](../regex-portability-semantics/README.md); defect discovery belongs to [Regex validation testing methods](../regex-validation-testing-methods/README.md).

## Research method

The report compared formal-language decision procedures, tagged and symbolic methods, translation validation, and practical regex observables. The synthesis retains stable distinctions and boundaries while leaving algorithms and schemas unselected.

## Evidence and source quality

Classical regular-language foundations and several primary standards were checked. Tool-specific capabilities, specialized complexity claims, capture-aware completeness, and some version-drift examples remain partially verified because the original marker mapping is unavailable.

## Findings

- “Equivalent” is incomplete without a semantic profile, observation relation, and input domain.
- Classical language equivalence and containment are decidable for regular subsets, while stronger practical observables require richer models.
- One valid witness can refute a universal equivalence claim; failure to find one proves nothing unless the search was complete for the declared model and domain.
- Captures, prioritized selection, spans, iteration, and replacement can distinguish patterns with the same accepted language.
- Backreferences create a major boundary for unrestricted universal equivalence; bounded and restricted results must say so.
- Rewrite evidence needs relation, assumptions, profiles, method, domain, dependencies, and invalidation rules.
- Safety-motivated rewrites must delegate their semantic-preservation obligation here rather than assume it.

## Limits, uncertainty, and negative knowledge

A complete capture-aware relation for STRling's intended regular fragment is not established. Regular lookaround, repeated captures, Unicode predicate theories, operation semantics, certificate checking, and useful restricted backreference fragments remain open. The proposed status vocabulary is not adopted.

## Alternatives considered

DFA products, NFA subset/antichain methods, derivatives, symbolic automata, SMT encodings, tagged automata, bounded exhaustive verification, differential tests, and refusal outside supported fragments.

## Implications for STRling

Downstream systems can use exact proofs where available, preserve witnesses where refuted, report bounded evidence honestly, and refuse automatic rewrites when the required observable relation cannot be established.

## Recommendations

The report recommends typed relations, proof-carrying or independently checkable rewrite evidence, shortest useful witnesses, explicit stale-evidence handling, and conservative refusal. These are candidate models.

## Rejected or abandoned alternatives

This inquiry rejects a single Boolean equivalence flag, capture-blind algebraic rewriting, and treating differential agreement or a timeout-limited search as a universal proof.

## Downstream disposition

**Disposition:** none.

## Reports

| Report | Role | Source verification |
| --- | --- | --- |
| [Regex Equivalence, Containment, Witness Generation, and Rewrite Verification](reports/regex-equivalence-and-rewrite-verification.md) | Modern active research input | Partially verified; formal foundations and selected standards checked, specialized claims remain gaps. |

## Sources

- [STRling architecture at `9991575`](https://github.com/strling-lang/strling/blob/9991575b347ac5f56108f18065c88b2b16a5065a/docs/architecture.md)
- [Brzozowski, Derivatives of Regular Expressions](https://dl.acm.org/doi/10.1145/321239.321249)
- [Antimirov, Partial Derivatives of Regular Expressions](https://doi.org/10.1016/0304-0208(95)00058-H)
- [ECMAScript pattern semantics](https://tc39.es/ecma262/multipage/text-processing.html#sec-patterns)
- [Alive2](https://alive2.llvm.org/)
- [Regex Analysis & Explanation program](../../programs/regex-analysis-explanation/README.md)
- [Portability & Compatibility program](../../programs/portability-compatibility/README.md)

[← Inquiries](../README.md)
