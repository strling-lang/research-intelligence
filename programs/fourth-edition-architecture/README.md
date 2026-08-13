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

As reviewed at [`strling` commit `9991575`](https://github.com/strling-lang/strling/tree/9991575b347ac5f56108f18065c88b2b16a5065a), active product work contains a Rust compiler kernel and semantic, structural, safety, capability, portability, and target-family work. The ratified architecture still identifies exact source, Semantic IR, diagnostic, compiler-protocol, target-profile, and TargetArtifact contracts as later work. Semantic STRling and full adapter convergence remain directions unless downstream authority records implementation.

## Related existing inquiries

- [Canonical semantic compiler architecture](../../inquiries/canonical-semantic-compiler-architecture/README.md)
- [Semantic IR and target lowering](../../inquiries/semantic-ir-and-target-lowering/README.md)
- [Regex execution and target profiles](../../inquiries/regex-execution-and-target-profiles/README.md)
- [Unicode and text semantics](../../inquiries/unicode-and-text-semantics/README.md)
- [Regex validation testing methods](../../inquiries/regex-validation-testing-methods/README.md)
- [Regex safety and complexity](../../inquiries/regex-safety-and-complexity/README.md)
- [Regex analysis techniques](../../inquiries/regex-analysis-techniques/README.md)
- [Evidence-aware regex explanation](../../inquiries/evidence-aware-regex-explanation/README.md)
- [Embedded regex tooling](../../inquiries/embedded-regex-tooling/README.md)
- [Semantic validation and domain libraries](../../inquiries/semantic-validation-and-domain-libraries/README.md)

## Future research opportunities

Prototype and empirically evaluate the candidate profile, text, analysis-dispatch, explanation, and host-projection contracts; measure adapter conformance and active compiler behavior without treating these inquiry recommendations as ratified architecture.

## Explicit non-goals

This program does not define the normative specification, implement compiler stages, track campaign tasks, certify releases, or declare target support.

[← Programs](../README.md)
