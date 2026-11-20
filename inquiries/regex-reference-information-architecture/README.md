---
title: Regex Reference information architecture
programs:
  - Regex Reference
horizon: Post-Fourth Edition
maturity: Exploratory
last-reviewed: 2026-11-20
review-triggers:
  - A user study exposes a findability or provenance issue in available RegEx Docs
  - A published semantic revision or first certified consumer-compatible checkpoint
---

# Regex Reference information architecture

## Research question

How should a public Regex Reference organize, navigate, and project authoritative regex knowledge so developers can answer feature-, system-, version-, operation-, syntax-, and evidence-centered questions without creating duplicate authorities?

## Motivation / decision informed

The answer may inform future Website information architecture, page identities, navigation lenses, provenance display, version handling, search, permalinks, and authored-versus-generated boundaries.

## Current state

RegEx Docs is available at the pinned website revision. It projects the reviewed Conformance v4 semantic corpus, with source-lock identity, 269 features and 16 categories. The compatibility consumer has no checkpoint. Website owns navigation and presentation. See C1 and W1–W2 in the [decision evidence register](../../docs/DECISION_EVIDENCE_2026-11-20.md).

## Scope

Developer questions, navigation lenses, feature/system/profile/operation pages, addressable statements, version and Unicode context, evidence and uncertainty display, search, aliases, permalinks, generated projections, authored explanation, freshness, and correction.

## Non-goals

This inquiry studies information architecture. The corpus, observations, Website pages and production schemas are maintained by their owners. The [Lab interaction inquiry](../regex-lab-interaction-model/README.md) covers interactive execution.

## Research method

The report compared mature technical references and regex documentation with the STRling authority model. This synthesis refreshed the live Website state and retained stable IA principles and anti-patterns without adopting a website architecture.

## Evidence and source quality

The versioned surface registry and source lock establish the available product projection and its provenance. Deployment reachability and participant results remain unverified. User-task frequency, search behavior and maintenance effects remain provisional.

## Findings

- Canonical semantic identity should be feature-centered, while navigation can offer feature, system, syntax, operation, mode/Unicode, history, and evidence lenses.
- Compatibility is a qualified statement across profile, version, option, operation, text model, and evidence—not a Boolean cell.
- Syntax is a discovery index, not a second ontology; the same token may have different meanings by grammar or profile.
- Page identities can be fewer than underlying data entities while qualified claims remain individually addressable and citable.
- Current, historical, unknown, unsupported, conflicting, normative, and observed information require distinct presentation.
- Stable identifiers and context-preserving permalinks are more durable than snapshotting the whole reference for every runtime version.
- Generated facts and authored explanation should remain visibly distinct and traceable to their owners.

## Limits, uncertainty, and negative knowledge

The public projection can be evaluated for wayfinding, accessibility and provenance interpretation. No current task-success data selects a search or editorial design. First-checkpoint scope, compatibility display, and correction behavior require producer-and-consumer evidence.

## Alternatives considered

Engine-manual collections, Boolean compatibility matrices, whole-site version snapshots, feature-centric documentation, engine-centric documentation, generic knowledge-graph UI, and one semantic graph projected through multiple task-oriented lenses.

## Implications for STRling

Evaluate the available reference against tasks and keep semantic scope visible. Claims about exact runtime compatibility require the relevant empirical evidence and a validated downstream checkpoint.

## Recommendations

The report recommends “normalize knowledge, denormalize navigation,” stable entity and statement permalinks, profile-aware context, separate evidence views, and generated projections with authored explanation. These are candidate IA recommendations.

## Rejected or abandoned alternatives

Boolean support tables as canonical truth, engine names as behavioral identity, feature inheritance through lineage, Unicode as a checkbox, duplicated compatibility prose, and empirical success as normative truth are rejected.

## Downstream disposition

**Disposition:** none. RegEx Docs has an independently related catalog projection. No documented acceptance relationship was found for the report's proposed IA.

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
- [Developer adoption pathways](../developer-adoption-pathways/README.md)

[← Inquiries](../README.md)
