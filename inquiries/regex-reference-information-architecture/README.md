---
title: Regex Reference information architecture
programs:
  - Regex Reference
horizon: Post-Fourth Edition
maturity: Exploratory
last-reviewed: 2026-08-12
review-triggers:
  - A downstream Regex Reference product decision
  - Material change to Regex Knowledge projection or Website architecture
  - User research challenges the proposed navigation model
---

# Regex Reference information architecture

## Research question

How should a public Regex Reference organize, navigate, and project authoritative regex knowledge so developers can answer feature-, system-, version-, operation-, syntax-, and evidence-centered questions without creating duplicate authorities?

## Motivation / decision informed

The answer may inform future Website information architecture, page identities, navigation lenses, provenance display, version handling, search, permalinks, and authored-versus-generated boundaries.

## Current state

Website commit [`7c7042f`](https://github.com/strling-lang/website/tree/7c7042f3d4418533f5dc0283537546529633b081) contains documentation, learning, package, and Fourth Edition pre-release surfaces. No dedicated comprehensive Regex Reference was found. Regex Knowledge remains the authority for canonical entities and claims; Regex Conformance remains the authority for controlled observations; Website would own any public projection.

## Scope

Developer questions, navigation lenses, feature/system/profile/operation pages, addressable statements, version and Unicode context, evidence and uncertainty display, search, aliases, permalinks, generated projections, authored explanation, freshness, and correction.

## Non-goals

This inquiry does not define or copy Regex Knowledge data, store Conformance observations, implement Website pages, prescribe Lab execution, or choose production schemas. Interactive execution belongs to [Regex Lab interaction model](../regex-lab-interaction-model/README.md).

## Research method

The report compared mature technical references and regex documentation with the STRling authority model. This synthesis refreshed the live Website state and retained stable IA principles and anti-patterns without adopting a website architecture.

## Evidence and source quality

Current product absence is repository-observed at an exact commit. Official documentation and selected reference precedents were checked, but user-task frequency, search behavior, and maintenance-effect claims remain partially verified. No STRling Reference usability study exists.

## Findings

- Canonical semantic identity should be feature-centered, while navigation can offer feature, system, syntax, operation, mode/Unicode, history, and evidence lenses.
- Compatibility is a qualified statement across profile, version, option, operation, text model, and evidence—not a Boolean cell.
- Syntax is a discovery index, not a second ontology; the same token may have different meanings by grammar or profile.
- Page identities can be fewer than underlying data entities while qualified claims remain individually addressable and citable.
- Current, historical, unknown, unsupported, conflicting, normative, and observed information require distinct presentation.
- Stable identifiers and context-preserving permalinks are more durable than snapshotting the whole reference for every runtime version.
- Generated facts and authored explanation should remain visibly distinct and traceable to their owners.

## Limits, uncertainty, and negative knowledge

The correct top-level taxonomy, search ranking, comparison density, novice/expert layering, accessibility, and editorial workflow have not been tested with users. The proposed page/entity model may expose too much or too little detail. No comprehensive Reference currently exists to evaluate.

## Alternatives considered

Engine-manual collections, Boolean compatibility matrices, whole-site version snapshots, feature-centric documentation, engine-centric documentation, generic knowledge-graph UI, and one semantic graph projected through multiple task-oriented lenses.

## Implications for STRling

A future public Reference can remain a projection rather than a new source of truth. Website decisions would need freshness, provenance, conflict, correction, and source-boundary contracts before generation.

## Recommendations

The report recommends “normalize knowledge, denormalize navigation,” stable entity and statement permalinks, profile-aware context, separate evidence views, and generated projections with authored explanation. These are candidate IA recommendations.

## Rejected or abandoned alternatives

Boolean support tables as canonical truth, engine names as behavioral identity, feature inheritance through lineage, Unicode as a checkbox, duplicated compatibility prose, and empirical success as normative truth are rejected.

## Downstream disposition

**Disposition:** none.

## Reports

| Report | Role | Source verification |
| --- | --- | --- |
| [Information Architecture for a Definitive Public Regex Reference](reports/regex-reference-information-architecture.md) | Modern active research input | Partially verified; current Website state and selected primary documentation checked. |

## Sources

- [STRling Website at `7c7042f`](https://github.com/strling-lang/website/tree/7c7042f3d4418533f5dc0283537546529633b081)
- [MDN Browser Compatibility Data](https://github.com/mdn/browser-compat-data)
- [Unicode Technical Standard #18](https://www.unicode.org/reports/tr18/)
- [PCRE2 documentation](https://www.pcre.org/current/doc/html/)
- [Regex Reference program](../../programs/regex-reference/README.md)

[← Inquiries](../README.md)
