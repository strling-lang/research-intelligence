# Fourth Edition Architecture

## Purpose

Investigate questions directly relevant to STRling's transition to a canonical semantic compiler: frontends, Semantic IR, normalization, semantic and structural analysis, safety analysis, diagnostics, exact target profiles, capability evaluation, portability planning, evidence-backed rewrites, target lowering, structured artifacts, validation, adapters, and compiler-backed CLI, LSP, editor, and API intelligence.

## Important research questions

- Which compiler invariants need additional evidence, formalization, or independent evaluation?
- How should correctness and equivalence claims be validated across stages and exact target profiles?
- Which responsibilities belong in the canonical compiler versus thin adapters and tooling projections?
- How should uncertainty and incomplete capability evidence propagate through diagnostics and artifacts?

## Relationship to STRling

The compiler repository owns contracts, implementation, product certification and release decisions. Research may test concrete extensions or analyze scoped behavior.

## Current evidence boundary

Fourth Edition 4.0.3 is released. Scoped frontend, compiler and target contracts govern the canonical Rust implementation. The broad Semantic Specification remains draft. The [November review and pinned sources](../../docs/CURRENT_STATE_2026-11-20.md) distinguishes certified product source, closure and current maintenance, and records exact package and profile limits.

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

Use accepted versioned contracts and scope existing conformance evidence before proposing changes. Investigate observable preservation and concrete new profile, adapter or tooling gaps.

## Explicit non-goals

This program does not define the normative specification, implement compiler stages, track campaign tasks, certify releases, or declare target support.

[← Programs](../README.md)
