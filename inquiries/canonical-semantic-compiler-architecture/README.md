---
title: Canonical semantic compiler architecture
programs:
  - Fourth Edition Architecture
horizon: Fourth Edition
maturity: Exploratory
last-reviewed: 2026-11-20
review-triggers:
  - Ratification of the broader Semantic Specification or change to a frontend contract
  - Convergence regression or new adapter contract with an observable mismatch
---

# Canonical semantic compiler architecture

## Research question

How can STRling support multiple textual, builder, import, adapter, and tooling surfaces while preserving one semantic authority and detecting frontend divergence?

## Motivation / decision informed

The answer may inform frontend contracts, adapter boundaries, shared compiler intelligence, provenance, convergence testing, and safeguards against a regex-first semantic model.

## Current state

Fourth Edition 4.0.3 ships the Rust compiler boundary. Semantic STRling and regex-compatible source have distinct normative 1.0.0 grammar and mapping contracts. Simply 1.0.0 and 1.1.0 construct canonical input through a versioned host-neutral protocol. Compiler, artifact and interop schemas establish the data boundaries. Semantic Specification 1.0 is still a draft. The August branch describes an earlier implementation snapshot. See S1–S3 in the [decision evidence register](../../docs/DECISION_EVIDENCE_2026-11-20.md).

## Scope

Semantic authority across frontends, frontend-to-core contracts, source provenance, semantic equality, shared diagnostics and intelligence, adapter thinness, representability, and convergence verification.

## Non-goals

This inquiry does not decide detailed Semantic IR field placement, define syntax, implement a frontend, select transport technology, or ratify compiler APIs. Information placement after the frontend boundary belongs to [Semantic IR and target lowering](../semantic-ir-and-target-lowering/README.md).

## Research method

The report compared compiler precedents with STRling's active architecture and contracts. This synthesis rechecked current repository status and extracted only durable architectural boundaries; it did not redo the literature review.

## Evidence and source quality

The release, specification hub and controlling schemas establish the scoped contracts. STRling's [convergence test](https://github.com/strling-lang/strling/blob/eba5dad3de3fa620eb1ea13e0514d02f4b23e288/core/tests/explanation_frontend_convergence.rs) is implementation evidence. External architectural precedents in the report remain partially verified.

## Findings

- Sharing a backend is insufficient; semantic defaulting, validation, normalization, analysis, and capability meaning need one authority.
- Frontends may retain syntax-specific trees, source recovery, formatting, and host ergonomics before crossing a narrow semantic-construction boundary.
- Semantic convergence means equivalence within an explicitly shared representable domain, not identical source trees or universal feature availability.
- Provenance and diagnostic presentation can vary without changing semantic equality, provided canonical identities and facts remain compiler-owned.
- Implementing the regex-compatible frontend first creates a plausible regex-bias risk that later frontend work must test rather than assume away.
- Thin adapters need a stable semantic compiler contract; they must not become parallel implementations.

## Limits, uncertainty, and negative knowledge

Convergence fixtures exercise the implemented forms. General frontend neutrality, future constructs, target execution, and untested host adapters require independent evidence. Broader language behavior needs ratification under the compiler authority model.

## Alternatives considered

Parallel per-language compilers, a common backend after frontend-owned semantics, a universal syntax AST, frontend-specific syntax models converging on canonical semantics, and a stable compiler service with thin adapters.

## Implications for STRling

If accepted downstream, future frontend and tooling decisions should be evaluated against semantic singularity, explicit representability, provenance preservation, and executable convergence tests. This conclusion does not choose the detailed Semantic IR schema.

## Recommendations

Use released frontend contracts and accepted convergence fixtures to review future extensions. Require explicit representability, stable provenance and discriminating cross-frontend cases for a concrete compiler change.

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
