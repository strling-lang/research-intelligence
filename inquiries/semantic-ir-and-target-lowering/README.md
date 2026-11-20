---
title: Semantic IR and target lowering
programs:
  - Fourth Edition Architecture
horizon: Fourth Edition
maturity: Exploratory
last-reviewed: 2026-11-20
review-triggers:
  - Incompatible change to Semantic IR, artifact or interop contracts
  - A new target requirement or observed loss of match, capture or provenance across lowering
---

# Semantic IR and target lowering

## Research question

Which information belongs in frontend representations, canonical Semantic IR, derived analysis, portability planning, target-specific IR, and TargetArtifact so lowering can preserve meaning without turning one representation into a universal container?

## Motivation / decision informed

The answer may inform contract boundaries, legalization, target lowering, artifacts, identity, provenance, evolution, and stage-specific validation.

## Current state

Fourth Edition 4.0.3 defines canonical Semantic IR, compiler protocol, analysis, diagnostic, portability, profile, artifact and interop contracts. PCRE2, ECMAScript and Python re have scoped lowering, serialization and exact-profile runtime evidence. The August pre-serialization PCRE2 checkpoint remains prior implementation evidence. See S2–S4 in the [decision evidence register](../../docs/DECISION_EVIDENCE_2026-11-20.md).

## Scope

Information placement, semantic observables, derived requirements, legality, legalization, target-specific representation, artifact content, identities, provenance, versioning, and validation across compiler stages.

## Non-goals

This inquiry does not redefine multi-frontend semantic governance, specify exact production schemas, select an emitter API, or implement lowering. Frontend ownership is addressed by [Canonical semantic compiler architecture](../canonical-semantic-compiler-architecture/README.md).

## Research method

The report analyzed compiler-IR precedents and STRling contracts. This synthesis refreshed the active repository status and retained stable placement principles, risks, and open questions without adopting the report's proposed data shapes.

## Evidence and source quality

The serialized IR, target-artifact and target-profile schemas ground information placement. Runtime certification has exact profile and operation scope. The comparative IR precedents and field proposals in the August report remain partially verified.

## Findings

- Canonical Semantic IR should express target-independent meaning and observable contracts, not target spellings or planning outcomes.
- Frontend syntax, recovery, comments, and presentation belong before semantic construction; derived requirements and analyses should remain recomputable facts outside canonical meaning.
- Capability evaluation and portability plans are target-relative decisions and should not become a second semantic IR.
- Legalization must be profile- and instance-sensitive; a feature name alone is too coarse to establish legality.
- Target IR may be unapologetically target-specific after evidence-qualified planning.
- TargetArtifact must carry the emitted source plus configuration, identity, provenance, and semantic mapping needed by its consumers.
- Capture behavior, character domain, modes, matching policy, and source attribution are load-bearing observables that cannot be normalized away accidentally.

## Limits, uncertainty, and negative knowledge

The versioned data contracts and exact target profiles establish scoped representation and execution evidence. New target families and stronger preservation claims require independent checks for capture participation, character domains and priority. Unresolved required capability evidence prevents a complete usable artifact.

## Alternatives considered

One universal IR through emission, frontend-owned semantics, target flags embedded in Semantic IR, a separate portability IR, direct string emission, progressive legalization through Target IR, and structured TargetArtifact output.

## Implications for STRling

The research supplies review questions for downstream contract owners: whether each field expresses meaning, derived fact, target decision, or final external configuration; whether its identity and invalidation rules are explicit; and whether stage contracts can be independently tested.

## Recommendations

Use the current contract fields and invalid fixtures as the boundary for review. Investigate new fields or lowering stages only for a concrete target or independently replayed loss of required meaning or provenance.

## Rejected or abandoned alternatives

This inquiry rejects an overstuffed universal IR, target spellings as canonical semantics, and any artifact that is considered usable while required legality remains unresolved.

## Downstream disposition

**Disposition:** none. Existing contracts are prior downstream authority, not acceptance of this report's proposed refinements.

## Reports

| Report | Role | Source verification |
| --- | --- | --- |
| [Semantic IR and Target-Specific Lowering](reports/semantic-ir-and-target-lowering.md) | Modern active research input | Partially verified; current repository contracts and selected primary precedents checked. |

## Sources

- [STRling architecture at `9991575`](https://github.com/strling-lang/strling/blob/9991575b347ac5f56108f18065c88b2b16a5065a/docs/architecture.md)
- [STRling capability evaluation at `9991575`](https://github.com/strling-lang/strling/blob/9991575b347ac5f56108f18065c88b2b16a5065a/docs/capability-evaluation.md)
- [STRling portability planning at `9991575`](https://github.com/strling-lang/strling/blob/9991575b347ac5f56108f18065c88b2b16a5065a/docs/portability-planning.md)
- [MLIR dialect conversion](https://mlir.llvm.org/docs/DialectConversion/)
- [ECMAScript RegExp objects](https://tc39.es/ecma262/multipage/text-processing.html#sec-regexp-regular-expression-objects)
- [Fourth Edition Architecture program](../../programs/fourth-edition-architecture/README.md)

[← Inquiries](../README.md)
