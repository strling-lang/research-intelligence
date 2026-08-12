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

As reviewed 2026-08-12, active product work contains a Rust compiler kernel, canonical semantic contracts, normalization and analyses, structured diagnostics, profile-aware capability and portability work, a regex-compatible frontend, and target-family work for PCRE2, ECMAScript, and Python `re`. Exact completion changes rapidly; consult the active branch and campaign. Semantic STRling and full adapter convergence remain directions unless downstream authority records implementation.

## Related existing inquiries

- [Canonical semantic compiler architecture](../../inquiries/canonical-semantic-compiler-architecture/README.md)
- [Semantic IR and target lowering](../../inquiries/semantic-ir-and-target-lowering/README.md)
- [Regex validation testing methods](../../inquiries/regex-validation-testing-methods/README.md)
- [Regex safety and complexity](../../inquiries/regex-safety-and-complexity/README.md)
- [Regex analysis techniques](../../inquiries/regex-analysis-techniques/README.md)
- [Embedded regex tooling](../../inquiries/embedded-regex-tooling/README.md)
- [Semantic validation and domain libraries](../../inquiries/semantic-validation-and-domain-libraries/README.md)

## Future research opportunities

Diagnostic explanation quality, target-profile completeness, adapter conformance, compiler-backed tooling, and empirical evaluation of the active compiler, frontend, lowering, and validation inquiries.

## Explicit non-goals

This program does not define the normative specification, implement compiler stages, track campaign tasks, certify releases, or declare target support.

[← Programs](../README.md)
