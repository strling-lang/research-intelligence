---
title: Developer adoption pathways
programs:
  - Adoption & Ergonomics
horizon: Post-Fourth Edition
maturity: Exploratory
last-reviewed: 2026-08-12
review-triggers:
  - New STRling package, migration, or public-product availability
  - Focused adoption or workflow research
---

# Developer adoption pathways

## Research question

Under which tasks, constraints, workflows, and trust conditions would existing regex users adopt STRling, use it alongside regex, or reasonably prefer not to use it?

## Motivation / decision informed

The answer may inform integration, migration, packaging, documentation, interoperability, and product-value hypotheses.

## Current state

Historical research identifies dependency friction, standard-library availability, familiarity, engine fragmentation, safety concerns, verbosity, and migration as plausible factors. Its active thesis used “Stockholm Syndrome,” a loaded analogy that substitutes rhetoric for evidence. That framing is retired.

## Scope

Adoption jobs, switching and coexistence costs, package trust, ecosystem fit, interoperability, migration, discoverability, learning, and task-specific value.

## Non-goals

This inquiry does not prescribe marketing, treat continued regex use as irrational, assume STRling is always preferable, or promise cross-target identity that downstream evidence has not established.

## Research method

The present work reframes one historical synthesis. Future work should combine interviews, surveys, task observation, package and workflow analysis, migration studies, and product experiments with explicit sampling and measures.

## Evidence and source quality

The preserved report is an AI-assisted secondary synthesis with mixed source quality. It contains useful hypotheses and a “good enough” zone but also universal claims, analogies, and obsolete compiler assumptions. It is not evidence of actual STRling adoption behavior.

## Findings

Regex's ubiquity, compactness, standard-library presence, transferable syntax, and strong tooling make it an excellent choice for many simple tasks. Plausible STRling adoption paths therefore emphasize additive value: clearer intent for complex patterns, explicit target/version reasoning, compiler-backed diagnostics, explanation, and safe export or import. Dependency and migration costs are real decision criteria.

## Limits, uncertainty, and negative knowledge

STRling-specific user evidence is currently absent. The relative weight of safety, portability, readability, package size, trust, and familiarity is unknown by ecosystem and task. The historical report's claims about developer psychology are unsupported as population-level conclusions.

## Alternatives considered

Direct replacement, coexistence, audit-only entry, editor-first entry, compiler service, generated artifact workflow, library adoption, and no adoption.

## Implications for STRling

Interoperability with regex, transparent artifacts, thin adapters, and value before migration may matter more than a replacement narrative.

## Recommendations

Research concrete jobs and ecosystems after downstream product surfaces are stable enough to test. Make “use regex directly” an explicit successful outcome for simple cases.

## Rejected or abandoned alternatives

The “Stockholm Syndrome” thesis, the claim that enterprise users have only one responsible choice, and guaranteed identical behavior across many targets are rejected as active framing.

## Downstream disposition

**Disposition:** none.

## Reports

| Report | Role | Current status |
| --- | --- | --- |
| [RegEx vs. STRling Developer Adoption](reports/RegEx%20vs.%20STRling%20Developer%20Adoption.md) | Historical research input | Preserved; rhetoric and empirical claims require revalidation. |
| [Legacy inquiry synthesis](reports/legacy-inquiry-synthesis.md) | Historical synthesis | Superseded by this README. |

## Sources

See report bibliography pending focused verification.

[← Inquiries](../README.md)
