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

[`regex-conformance`](https://github.com/strling-lang/regex-conformance) is in repository bootstrap as reviewed 2026-08-12; it states that no repository observation is yet a certified result and no production evidence campaign is authorized merely by repository existence. Its foundation and program remain the authority for exact status.

## Related existing inquiries

Historical ReDoS and analysis reports may motivate future experiments, but they are not conformance observations.

## Future research opportunities

- oracle design and triangulation;
- minimized counterexamples and discrepancy taxonomies;
- environment identity and replication independence;
- completeness metrics under applicability and unavailable versions; and
- certification criteria for findings and datasets.

## Explicit non-goals

This program does not store probes, runtime profiles, attempts, observations, evidence objects, or certified results and does not run a shadow conformance campaign.

[← Programs](../README.md)
