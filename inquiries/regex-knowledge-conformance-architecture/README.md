---
title: Regex Knowledge–Conformance architecture
programs:
  - Regex Knowledge Architecture
  - Regex Conformance Science
horizon: Post-Fourth Edition
maturity: Exploratory
last-reviewed: 2026-08-12
review-triggers:
  - Regex Knowledge resumes or changes its authority model
  - Regex Conformance begins a production evidence campaign
  - A cross-system identity or reconciliation contract is proposed downstream
---

# Regex Knowledge–Conformance architecture

## Research question

How should researched claims, normative expectations, executable probes, immutable observations, discrepancies, and corrections link across Regex Knowledge and Regex Conformance without creating a duplicate source of truth?

## Motivation / decision informed

The answer may inform a future authority-preserving bridge between documented knowledge and empirical evidence, including identifiers, revisions, derived views, and correction feedback.

## Current state

The [Regex Knowledge Program](https://app.notion.com/p/3ba7d940647581a9b60dd76f67e5230e?pvs=204) remains the operational researched-knowledge authority and is on hold pending reassessment against Conformance. [`regex-conformance`](https://github.com/strling-lang/regex-conformance/blob/57672519e899f986d94b7d1256ffe0aa90f1b26d/README.md) has certified repository bootstrap and is implementing its Control Plane foundation; it records no certified observation and has authorized no production evidence campaign. No cross-system bridge described here has been adopted.

## Scope

Authority-preserving linkage, claim/expectation/observation relations, cross-system identity and revision, discrepancies, correction and supersession feedback, derived-view lineage, and multidimensional completeness.

## Non-goals

This inquiry does not redefine Conformance evidence lifecycle or certification; those belong to [Conformance evidence methodology](../regex-conformance-evidence-methodology/README.md). It does not define public presentation, which belongs to [Reference information architecture](../regex-reference-information-architecture/README.md), and it does not copy either authority’s records.

## Research method

An AI-assisted deep-research report compared current STRling authority documents with provenance, scientific-disagreement, versioning, linked-data, web-testing, and compatibility-data precedents. This synthesis rechecked current Knowledge, Conformance, and adjacent-inquiry status and retained only bounded architectural findings.

## Evidence and source quality

Current-state claims were checked directly against the governing Notion page and pinned repository revisions. The report names strong primary precedents, but its opaque session citations lacked a durable mapping and were removed. External comparisons and proposed schemas therefore remain provisional.

## Findings

- Authority is claim-type specific: Knowledge governs researched/documented propositions; immutable Conformance evidence governs exact observations.
- Claims, expectations, probes, observations, comparisons, discrepancies, findings, and corrections require distinct identities when their histories or authority differ.
- A qualified many-to-many bridge can associate exact revisions without copying ontology or evidence.
- Disagreement and ambiguity are states to preserve, not signals to overwrite an input.
- Public `documented`, `observed`, `conflicting`, or `unknown` states should be reproducible derived views over selected versions, never a third editable truth store.
- Completeness must distinguish research coverage, resolved knowledge, execution coverage, and verified linkage. Unknown is not unsupported.

## Limits, uncertainty, and negative knowledge

No row-level audit established that every existing Knowledge record follows the candidate rules. No production campaign has tested correction propagation, discrepancy lifecycle, crosswalk evolution, or derived-view reconstruction. Exact identifier syntax, claim-family identity, historical source retention, and feature-level empirical aggregation remain unresolved.

## Alternatives considered

A merged database, Knowledge-owned empirical fields, Conformance-owned ontology, automatic capability flipping after observations, stored compatibility truth, and revision-qualified federation were compared.

## Implications for STRling

If adopted downstream, compiler and product consumers could cite exact documented claims and exact observations while preserving their distinct authority. This would support evidence-aware portability and explanation without making Research Intelligence an integration database.

## Recommendations

The report recommends a candidate dual-identity and qualified-link model: durable logical IDs plus immutable revisions, owner-qualified references, explicit discrepancy history, versioned crosswalk and projection policies, and derived views with lineage. Before adoption, owners should validate the smallest end-to-end lifecycle on one claim, expectation, probe, observation, discrepancy, correction, and regenerated view.

## Rejected or abandoned alternatives

Reject silent synchronization, editable copies of observations, empirical pass/fail as canonical Knowledge, unversioned `latest` inputs for historical interpretation, and a universal completeness percentage. These approaches erase authority or reproducibility.

## Downstream disposition

**Disposition:** none.

No downstream owner has adopted the candidate model.

## Reports

| Report | Role | Current status |
| --- | --- | --- |
| [Authority-Preserving Architecture for STRling Regex Knowledge and Regex Conformance](reports/regex-knowledge-conformance-architecture.md) | Modern primary research input | Active input; partially verified with unresolved claim-level citations. |

## Related inquiries

- [Regex Conformance evidence methodology](../regex-conformance-evidence-methodology/README.md)
- [Regex Reference information architecture](../regex-reference-information-architecture/README.md)
- [Execution and target profiles](../regex-execution-and-target-profiles/README.md)

## Sources

- [STRling Regex Knowledge Program](https://app.notion.com/p/3ba7d940647581a9b60dd76f67e5230e?pvs=204), reviewed 2026-08-12.
- [`regex-conformance` program status and authority boundary](https://github.com/strling-lang/regex-conformance/blob/57672519e899f986d94b7d1256ffe0aa90f1b26d/README.md), reviewed commit `5767251`.
- [W3C PROV-O](https://www.w3.org/TR/prov-o/).
- [FAIR Guiding Principles](https://doi.org/10.1038/sdata.2016.18).

[← Inquiries](../README.md)
