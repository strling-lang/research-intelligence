---
title: Regex Conformance evidence methodology
programs:
  - Regex Conformance Science
horizon: Post-Fourth Edition
maturity: Exploratory
last-reviewed: 2026-08-12
review-triggers:
  - First production observation or certified evidence set
  - Ratification of evidence, replication, correction, or certification contracts
  - A correction or replication failure exposes a methodological gap
---

# Regex Conformance evidence methodology

## Research question

What provenance, attempt, observation, reproducibility, replication, correction, evidence-admission, and certification methods are necessary before a regex execution result can support a durable empirical claim?

## Motivation / decision informed

The answer may inform future Conformance evidence contracts, replication policy, correction propagation, certification, archival strategy, and downstream evidence admission.

## Current state

At Regex Conformance commit [`f8c603a`](https://github.com/strling-lang/regex-conformance/tree/f8c603a1a4f5f827247f8a5bed61c85f483857f8), repository bootstrap is certified and the portable Control Plane foundation is being implemented. The repository states that no observation is yet a certified conformance result and no production evidence campaign is authorized by repository existence. The report evaluates the design and proposes refinements; it does not create evidence or alter Conformance authority.

## Scope

Logical executions, physical attempts, observations, environment identity, provenance, normalization, evidence admission, reproducibility, replication independence, discrepancies, correction and supersession, immutable evidence sets, derived claims, and certification methodology.

## Non-goals

This inquiry does not own generated-test strategy, store profiles/probes/attempts/observations, run a campaign, define normative regex behavior, or implement Conformance infrastructure. Generated defect discovery belongs to [Regex validation testing methods](../regex-validation-testing-methods/README.md).

## Research method

The report compared the current Conformance architecture with reproducibility, provenance, research-data, supply-chain, and correction practices. This synthesis refreshed the repository status and separates observed implementation from proposed methodology.

## Evidence and source quality

The current-state boundary is verified at an exact commit, and selected primary methodology standards were checked. The report's broader empirical literature and specific proposed controls remain partially verified. Most importantly, the proposed design has not been validated under production evidence load.

## Findings

- A logical execution and its retryable physical attempts must remain distinct.
- Recipe identity is not realized-environment identity; exact runtime artifacts and behaviorally relevant configuration need provenance.
- Infrastructure failure is inconclusive about target regex behavior.
- Raw observations, qualified evidence, derived findings, and certification are separate authority layers.
- Reproducibility has multiple levels; rerun count alone does not establish independent replication.
- Corrections should preserve prior records and propagate through an explicit dependency graph to affected findings and certificates.
- Analytical publications need immutable evidence-set snapshots and frozen policy identities.
- Content integrity, issuer authenticity, and scientific validity are related but distinct.

## Limits, uncertainty, and negative knowledge

No production campaign validates the proposed envelope, reproducibility ladder, replication sampling, correction graph, independent verifier, or checkpointing cost. Environment completeness is inherently open-ended; finite reruns cannot prove determinism; and managed services may never reach artifact-level reproducibility.

## Alternatives considered

Mutable compatibility tables, one-pass observations, append-only object graphs, graded reproducibility, universal replication, risk-based replication, heavyweight generic provenance storage, compact domain schemas with export, human override, and evidence-gated certification.

## Implications for STRling

If adopted by Regex Conformance, the recommendations could make evidence reusable without allowing Research Intelligence to become an evidence store. Downstream STRling or public products would still need explicit admission criteria for each claim class.

## Recommendations

The report recommends an evidence envelope, immutable attempt disposition, a candidate E0-E5 reproducibility ladder, declared replication-independence dimensions, predeclared rerun policy, correction impact tracking, evidence-set snapshots, independent verification, archival identity, and authenticated certification. All are non-normative candidate models.

## Rejected or abandoned alternatives

This inquiry rejects majority vote over flaky outcomes, mutable correction by overwrite, certification by human override, a single “reproducible” Boolean, and treating a digest as proof of trustworthy production or scientific validity.

## Downstream disposition

**Disposition:** none.

## Reports

| Report | Role | Source verification |
| --- | --- | --- |
| [Methodology for Durable Empirical Evidence in STRling Regex Conformance](reports/regex-conformance-evidence-methodology.md) | Modern active research input | Partially verified; current Conformance state and selected methodology standards checked. |

## Sources

- [Regex Conformance README at `f8c603a`](https://github.com/strling-lang/regex-conformance/blob/f8c603a1a4f5f827247f8a5bed61c85f483857f8/README.md)
- [W3C PROV overview](https://www.w3.org/TR/prov-overview/)
- [FAIR Guiding Principles](https://doi.org/10.1038/sdata.2016.18)
- [RFC 8785: JSON Canonicalization Scheme](https://www.rfc-editor.org/rfc/rfc8785)
- [SLSA provenance](https://slsa.dev/spec/v1.2/provenance)
- [Regex Conformance Science program](../../programs/regex-conformance-science/README.md)

[← Inquiries](../README.md)
