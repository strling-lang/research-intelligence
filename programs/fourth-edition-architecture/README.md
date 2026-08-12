# Fourth Edition Architecture

## Purpose

Investigate questions directly relevant to STRling's transition to a canonical semantic compiler: frontends, Semantic IR, normalization, semantic and structural analysis, safety analysis, diagnostics, exact target profiles, capability evaluation, portability planning, evidence-backed rewrites, target lowering, structured artifacts, validation, adapters, and compiler-backed CLI, LSP, editor, and API intelligence.

## Important research questions

- Which compiler invariants need additional evidence, formalization, or independent evaluation?
- How should correctness and equivalence claims be validated across stages and exact target profiles?
- Which responsibilities belong in the canonical compiler versus thin adapters and tooling projections?
- How should uncertainty and incomplete capability evidence propagate through diagnostics and artifacts?

## Relationship to STRling

This program may analyze and recommend. The [`strling` product repository](https://github.com/strling-lang/strling), its authority hierarchy, active `architecture/v4` branch, and current Fourth Edition campaign govern architecture, implementation, and delivery status.

## Current evidence boundary

As reviewed 2026-08-12, the active product work contains a Rust compiler kernel, canonical semantic contracts, normalization and analyses, structured diagnostics, profile-aware capability and portability work, a regex-compatible frontend, and target-family work for PCRE2, ECMAScript, and Python `re`. Exact completion changes rapidly; consult the active branch and campaign rather than treating this summary as a status tracker. Semantic STRling and full adapter convergence remain architecture directions unless their downstream authorities record implementation.

## Related existing inquiries

Historical safety, analysis, tooling, and validation reports are being migrated into focused inquiries and will be linked here after their active syntheses are established.

## Future research opportunities

- compiler-stage property and proof strategy;
- diagnostic explanation quality and uncertainty projection;
- target-profile completeness and evolution;
- cross-frontend semantic equivalence;
- adapter conformance and compiler-backed tooling architecture; and
- structured artifact consumption and round-trip evidence.

## Explicit non-goals

This program does not define the normative specification, implement compiler stages, track campaign tasks, certify releases, or declare target support.

[← Programs](../README.md)
