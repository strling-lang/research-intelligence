---
title: Regex equivalence and rewrite verification
programs:
  - Regex Analysis & Explanation
  - Portability & Compatibility
horizon: Fourth Edition
maturity: Evidence-backed
last-reviewed: 2026-11-20
review-triggers:
  - Compiler owner defines a product comparison query and its IR and text interpretation
  - A proposed rewrite needs a specified context, span, capture, or operation relation
  - A witness or exhaustion mismatch or a change to an existing preservation contract
---

# Regex equivalence and rewrite verification

## Research question

Which semantic relations between regexes or lowered artifacts can be proven, refuted, or bounded, and what provenance must accompany rewrite evidence?

## Motivation / decision informed

The answer may inform rewrite gating, containment, migration, counterexample generation, proof artifacts, diagnostics, and public Compare explanations.

## Current state

The Fourth Edition 4.0.3 closure includes two bounded structural strategies with preconditions, evidence identities, exact-profile applicability and separate automatic-portability and explicit optimization roles. The semantic conversion contract proves normalized semantic alpha equivalence for exact reconstruction into its named destinations. These own different relations. The broad semantic specification remains unratified, and a general product equivalence kernel is open. [Rewrite registry](https://github.com/strling-lang/strling/blob/eba5dad3de3fa620eb1ea13e0514d02f4b23e288/spec/portability/equivalence/1.0/registry.json), [conversion contract](https://github.com/strling-lang/strling/blob/eba5dad3de3fa620eb1ea13e0514d02f4b23e288/spec/conversions/semantic/1.0/README.md), [specification hub](https://github.com/strling-lang/strling/blob/eba5dad3de3fa620eb1ea13e0514d02f4b23e288/spec/README.md).

## Scope

Accepted-language, selection, span, capture, and operation relations; containment; witnesses; decidability boundaries; bounded verification; proof/refutation provenance; evidence invalidation; and rewrite gating.

## Non-goals

This inquiry does not define the portability ontology, generated-test system, safety policy, target profile facts, or product UI. Portability claim meaning belongs to [Regex portability semantics](../regex-portability-semantics/README.md); defect discovery belongs to [Regex validation testing methods](../regex-validation-testing-methods/README.md).

## Research method

The August report surveyed general approaches. The November study implemented two deterministic state representations for whole-input word relations, gave an analytical reachability argument, and used a third direct evaluator for bounded checks and witness replay. Three local CPython cases test a possible misuse of the language result. [Comparative study](reports/bounded-language-relation-study.md).

## Evidence and source quality

The November study documents the claim-to-source mapping for the implemented methods, ERE# span reasoning and the mechanized JavaScript comparison. A publisher-record check repairs the Antimirov DOI in the active bibliography. The August report retains its imported citation, with this correction recorded in the successor study. Its unmapped specialized claims remain provisional. [Study methods and source verification](reports/bounded-language-relation-study.md), [Antimirov publisher record](https://www.sciencedirect.com/science/article/pii/0304397595001824).

## Findings

- “Equivalent” is incomplete without a semantic profile, observation relation, and input domain.
- Classical language equivalence and containment are decidable for regular subsets, while stronger practical observables require richer models.
- One valid witness can refute a universal equivalence claim; failure to find one proves nothing unless the search was complete for the declared model and domain.
- Captures, prioritized selection, spans, iteration, and replacement can distinguish patterns with the same accepted language.
- Backreferences create a major boundary for unrestricted universal equivalence; bounded and restricted results must say so.
- Rewrite evidence needs relation, assumptions, profiles, method, domain, dependencies, and invalidation rules.
- Safety-motivated rewrites must delegate their semantic-preservation obligation here rather than assume it.
- Both trial implementations established 40 relations, refuted 23 and returned two budget unknowns. All 46 witness instances replayed independently. CPython controls show differences in selected span, iteration, capture values, capture participation, and replacement despite equal word languages.

## Limits, uncertainty, and negative knowledge

The word model uses a literal, finite alphabet and excludes context, priority, captures, positions, complement, case folding and Unicode properties. A product correspondence proof, general contextual or capture-aware relation, operation equivalence, and external certificate checking remain open. A budget or model refusal carries no conclusion about the underlying relation.

## Alternatives considered

DFA products, NFA subset/antichain methods, derivatives, symbolic automata, SMT encodings, tagged automata, bounded exhaustive verification, differential tests, and refusal outside supported fragments.

## Implications for STRling

Compiler-owned comparison could expose exact model-scoped proofs, replayable counterexamples and explicit unknowns. The proven word relation can inform a validation check where whole-input acceptance is the actual requirement. Rewrite use depends on the operation and contextual obligations that downstream defines.

## Recommendations

Conditionally evaluate a whole-input query if the compiler owner can define its admitted inputs and prove a mapping from canonical IR. Retain independently checkable witnesses and explicit budget outcomes. Any stronger operation-preserving rewrite requires evidence for that relation before registration.

## Rejected or abandoned alternatives

This inquiry rejects a single Boolean equivalence flag, capture-blind algebraic rewriting, and treating differential agreement or a timeout-limited search as a universal proof.

## Downstream disposition

**Disposition:** none. The scoped conversion and structural rewrite contracts are established downstream and independently related to the August research. No adoption of the study procedures or general rewrite proposal is recorded.

## Reports

| Report | Role | Source verification |
| --- | --- | --- |
| [Comparing bounded regular-language decision procedures](reports/bounded-language-relation-study.md) | Executed comparative study | Scoped formal argument, primary sources, independent bounded checks, and local behavior controls. |
| [Regex Equivalence, Containment, Witness Generation, and Rewrite Verification](reports/regex-equivalence-and-rewrite-verification.md) | Modern active research input | Partially verified; formal foundations and selected standards checked, specialized claims remain gaps. |

## Sources

- [STRling specification hub at the 4.0.3 closure](https://github.com/strling-lang/strling/blob/eba5dad3de3fa620eb1ea13e0514d02f4b23e288/spec/README.md)
- [Brzozowski, Derivatives of Regular Expressions](https://dl.acm.org/doi/10.1145/321239.321249)
- [Antimirov, Partial Derivatives of Regular Expressions](https://doi.org/10.1016/0304-3975(95)00182-4)
- [ECMAScript pattern semantics](https://tc39.es/ecma262/multipage/text-processing.html#sec-patterns)
- [Alive2](https://alive2.llvm.org/)
- [Regex Analysis & Explanation program](../../programs/regex-analysis-explanation/README.md)
- [Portability & Compatibility program](../../programs/portability-compatibility/README.md)
- [Regex safety and complexity](../regex-safety-and-complexity/README.md)

[← Inquiries](../README.md)
