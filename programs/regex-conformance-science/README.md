# Regex Conformance Science

## Purpose

Study the experimental methodology needed to produce trustworthy evidence about real regex-system behavior: exact profiles, applicability, reproducibility, differential and metamorphic testing, replication, discrepancies, completeness, and certification.

## Important research questions

- How should logical executions remain distinct from retryable physical attempts?
- Which applicability rules prevent meaningless comparisons while preserving coverage?
- How should differential and metamorphic findings be interpreted without treating consensus as normativity?
- What constitutes independent replication, discrepancy resolution, and certification?
- How should historical runtime unavailability remain visible in completeness measures?

## Relationship to STRling

Conformance evidence may inform target profiles, portability reasoning, compiler validation, and public explanations. It does not directly define STRling semantics or automatically authorize implementation changes.

## Current evidence boundary

The [November review and pinned sources](../../docs/CURRENT_STATE_2026-11-20.md) verifies foundation and adjudication acceptance boundaries, semantic corpus and denominator authority, full-data FAIL and zero certified coverage checkpoints. Operational datasets and certification remain with Conformance.

## Related existing inquiries

- [Regex Conformance evidence methodology](../../inquiries/regex-conformance-evidence-methodology/README.md)
- [Regex Knowledge–Conformance architecture](../../inquiries/regex-knowledge-conformance-architecture/README.md)
- [Regex execution and target profiles](../../inquiries/regex-execution-and-target-profiles/README.md)
- [Regex operation and result semantics](../../inquiries/regex-operation-and-result-semantics/README.md)
- [Regex validation testing methods](../../inquiries/regex-validation-testing-methods/README.md)
- [Regex safety and complexity](../../inquiries/regex-safety-and-complexity/README.md)
- [Regex analysis techniques](../../inquiries/regex-analysis-techniques/README.md)

These inquiries may motivate future experiments; their reports are not conformance observations.

## Future research opportunities

Examine an actual campaign discrepancy, independently admitted observation or first certified checkpoint against the established applicability, oracle, adjudication and certification contracts.

## Explicit non-goals

This program does not store probes, profiles, attempts, observations, evidence objects, or certified results and does not run a shadow conformance campaign.

[← Programs](../README.md)
