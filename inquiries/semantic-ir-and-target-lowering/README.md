---
title: Semantic IR and target lowering
programs:
  - Fourth Edition Architecture
horizon: Fourth Edition
maturity: Exploratory
last-reviewed: 2026-08-12
review-triggers:
  - Ratification or incompatible revision of Semantic IR or TargetArtifact contracts
  - A second target lowering reaches the canonical compiler path
  - New equivalence evidence changes legalization requirements
---

# Semantic IR and target lowering

## Research question

Which information belongs in frontend representations, canonical Semantic IR, derived analysis, portability planning, target-specific IR, and TargetArtifact so lowering can preserve meaning without turning one representation into a universal container?

## Motivation / decision informed

The answer may inform contract boundaries, legalization, target lowering, artifacts, identity, provenance, evolution, and stage-specific validation.

## Current state

STRling `architecture/v4` commit [`9991575`](https://github.com/strling-lang/strling/tree/9991575b347ac5f56108f18065c88b2b16a5065a) contains versioned source, Semantic IR, diagnostic, compiler, analysis, capability, and portability contracts. The Rust kernel implements normalization, analysis, profile-aware planning, and a pure pre-serialization PCRE2 lowering tree. Regex serialization, TargetArtifact construction, runtime execution, and equivalent completed lowerings for ECMAScript and Python are not established by that inspected revision.

## Scope

Information placement, semantic observables, derived requirements, legality, legalization, target-specific representation, artifact content, identities, provenance, versioning, and validation across compiler stages.

## Non-goals

This inquiry does not redefine multi-frontend semantic governance, specify exact production schemas, select an emitter API, or implement lowering. Frontend ownership is addressed by [Canonical semantic compiler architecture](../canonical-semantic-compiler-architecture/README.md).

## Research method

The report analyzed compiler-IR precedents and STRling contracts. This synthesis refreshed the active repository status and retained stable placement principles, risks, and open questions without adopting the report's proposed data shapes.

## Evidence and source quality

Current status is tied to an exact STRling commit. MLIR dialect-conversion and ECMAScript regex sources were checked, but much of the report's detailed precedent mapping and field-level reasoning remains partially verified because the original citation-token map is unavailable.

## Findings

- Canonical Semantic IR should express target-independent meaning and observable contracts, not target spellings or planning outcomes.
- Frontend syntax, recovery, comments, and presentation belong before semantic construction; derived requirements and analyses should remain recomputable facts outside canonical meaning.
- Capability evaluation and portability plans are target-relative decisions and should not become a second semantic IR.
- Legalization must be profile- and instance-sensitive; a feature name alone is too coarse to establish legality.
- Target IR may be unapologetically target-specific after evidence-qualified planning.
- TargetArtifact must carry the emitted source plus configuration, identity, provenance, and semantic mapping needed by its consumers.
- Capture behavior, character domain, modes, matching policy, and source attribution are load-bearing observables that cannot be normalized away accidentally.

## Limits, uncertainty, and negative knowledge

Exact capture-observation and character-domain contracts still require downstream specification. One implemented lowering cannot establish that the proposed boundaries generalize across target families. The report's example schemas are recommendations, not contracts, and partial lowering must not be mistaken for a valid partial artifact.

## Alternatives considered

One universal IR through emission, frontend-owned semantics, target flags embedded in Semantic IR, a separate portability IR, direct string emission, progressive legalization through Target IR, and structured TargetArtifact output.

## Implications for STRling

The research supplies review questions for downstream contract owners: whether each field expresses meaning, derived fact, target decision, or final external configuration; whether its identity and invalidation rules are explicit; and whether stage contracts can be independently tested.

## Recommendations

The report recommends a layered source-to-artifact model, instance-sensitive legality, monotonic evidence-qualified legalization, explicit capture contracts, target-specific IR, and deterministic artifact construction. Concrete field lists and API shapes remain candidate models.

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
