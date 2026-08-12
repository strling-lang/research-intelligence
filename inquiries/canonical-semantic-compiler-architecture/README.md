---
title: Canonical semantic compiler architecture
programs:
  - Fourth Edition Architecture
horizon: Fourth Edition
maturity: Exploratory
last-reviewed: 2026-08-12
review-triggers:
  - Ratification of a Semantic STRling or Simply frontend contract
  - Material change to the canonical compiler or adapter boundary
  - Frontend-convergence evidence across two or more authoring surfaces
---

# Canonical semantic compiler architecture

## Research question

How can STRling support multiple textual, builder, import, adapter, and tooling surfaces while preserving one semantic authority and detecting frontend divergence?

## Motivation / decision informed

The answer may inform frontend contracts, adapter boundaries, shared compiler intelligence, provenance, convergence testing, and safeguards against a regex-first semantic model.

## Current state

At STRling `architecture/v4` commit [`9991575`](https://github.com/strling-lang/strling/tree/9991575b347ac5f56108f18065c88b2b16a5065a), the ratified responsibility flow converges authoring frontends on canonical Semantic IR and a Rust reference compiler. The kernel implements the regex-compatible frontend and the common path through certified portability planning and pre-serialization PCRE2 lowering. Semantic STRling remains a future flagship language, current Simply implementations remain transitional, and full adapter/tooling convergence is not established by the inspected repository revision.

## Scope

Semantic authority across frontends, frontend-to-core contracts, source provenance, semantic equality, shared diagnostics and intelligence, adapter thinness, representability, and convergence verification.

## Non-goals

This inquiry does not decide detailed Semantic IR field placement, define syntax, implement a frontend, select transport technology, or ratify compiler APIs. Information placement after the frontend boundary belongs to [Semantic IR and target lowering](../semantic-ir-and-target-lowering/README.md).

## Research method

The report compared compiler precedents with STRling's active architecture and contracts. This synthesis rechecked current repository status and extracted only durable architectural boundaries; it did not redo the literature review.

## Evidence and source quality

STRling current-state claims are repository-observed at an exact commit. External precedent claims are partially reconstructed from primary compiler documentation, but the imported report lacks a complete durable mapping from its research-session markers to sources. The report is therefore an active but partially verified input and cannot by itself support Evidence-backed maturity.

## Findings

- Sharing a backend is insufficient; semantic defaulting, validation, normalization, analysis, and capability meaning need one authority.
- Frontends may retain syntax-specific trees, source recovery, formatting, and host ergonomics before crossing a narrow semantic-construction boundary.
- Semantic convergence means equivalence within an explicitly shared representable domain, not identical source trees or universal feature availability.
- Provenance and diagnostic presentation can vary without changing semantic equality, provided canonical identities and facts remain compiler-owned.
- Implementing the regex-compatible frontend first creates a plausible regex-bias risk that later frontend work must test rather than assume away.
- Thin adapters need a stable semantic compiler contract; they must not become parallel implementations.

## Limits, uncertainty, and negative knowledge

The inquiry has no cross-frontend convergence results because the inspected revision does not contain the full set of planned authoring surfaces. It is unknown which concepts will prove awkward outside regex import. The report's campaign-only status claims and several precedent details remain incompletely verified. A single Rust implementation does not prove frontend neutrality.

## Alternatives considered

Parallel per-language compilers, a common backend after frontend-owned semantics, a universal syntax AST, frontend-specific syntax models converging on canonical semantics, and a stable compiler service with thin adapters.

## Implications for STRling

If accepted downstream, future frontend and tooling decisions should be evaluated against semantic singularity, explicit representability, provenance preservation, and executable convergence tests. This conclusion does not choose the detailed Semantic IR schema.

## Recommendations

The report recommends a frontend-neutrality audit before semantic authoring contracts are ratified, specification-authored convergence cases, explicit frontend selection, centralized normalization, and stable fact/query boundaries for tools. These are non-normative candidates.

## Rejected or abandoned alternatives

This inquiry rejects parallel semantic implementations as an architectural target and does not recommend a universal syntax AST. It also rejects interpreting “one language” as “every frontend expresses every construct.”

## Downstream disposition

**Disposition:** none. The existing Fourth Edition architecture predates this inquiry and is not evidence that this report's safeguards were accepted.

## Reports

| Report | Role | Source verification |
| --- | --- | --- |
| [Canonical Semantics Across Many Frontends](reports/canonical-semantic-compiler-architecture.md) | Modern active research input | Partially verified; current STRling state and selected primary precedents checked, remaining marker mappings documented as gaps. |

## Sources

- [STRling architecture at `9991575`](https://github.com/strling-lang/strling/blob/9991575b347ac5f56108f18065c88b2b16a5065a/docs/architecture.md)
- [STRling engineering authority at `9991575`](https://github.com/strling-lang/strling/blob/9991575b347ac5f56108f18065c88b2b16a5065a/governance/authority.md)
- [GCC front-end internals](https://gcc.gnu.org/onlinedocs/gccint/Front-End.html)
- [MLIR language reference: locations](https://mlir.llvm.org/docs/LangRef/#locations-and-locations)
- [Roslyn overview](https://github.com/dotnet/roslyn/blob/main/docs/wiki/Roslyn-Overview.md)
- [Fourth Edition Architecture program](../../programs/fourth-edition-architecture/README.md)

[← Inquiries](../README.md)
