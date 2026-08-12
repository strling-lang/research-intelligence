---
title: Semantic validation and domain libraries
programs:
  - Fourth Edition Architecture
  - Regex Analysis & Explanation
  - Adoption & Ergonomics
horizon: Fourth Edition
maturity: Exploratory
last-reviewed: 2026-08-12
review-triggers:
  - Change to STRling validation-guarantee or standard-library contracts
  - Focused revalidation of a domain pattern or registry model
  - New standards governing preserved domain examples
---

# Semantic validation and domain libraries

## Research question

How should STRling distinguish lexical shape, normalized structure, domain semantics, external verification, and existence while supporting reusable domain logic with explicit guarantees and provenance?

## Motivation / decision informed

The answer may inform validation contracts, domain helpers, standard-library evidence, diagnostics, registries, distribution, and public explanations.

## Current state

The active product repository now defines validation guarantee levels and compiler boundaries. Three historical reports propose a Standard Library, registry and structural extensions, and a global pattern utility map. They predate those contracts and are research/proposal material, not normative design.

## Scope

Validation claim taxonomy, domain helper guarantees, standards and version scope, parsing versus regex, external checks, provenance, packaging and distribution concepts, and revalidation of candidate utilities.

## Non-goals

This inquiry does not define normative STRling APIs, establish a package registry, claim that regex alone proves semantic validity, duplicate Regex Knowledge, or accept the historical “top 50” audit as current demand evidence.

## Research method

The current work maps historical material to the modern question. Later research should examine ratified compiler contracts, controlling domain standards, real user tasks, existing library ecosystems, and reproducible validation behavior one domain at a time.

## Evidence and source quality

The reports are AI-assisted historical inputs with bibliographies and implementation sketches. Their proposed APIs, citations, standards versions, utility rankings, and claims require focused verification. The active `strling` specification governs current guarantee vocabulary.

## Findings

- Lexical shape, normalized structure, semantic validity, external verification, and existence are distinct claims.
- Reusable helpers need machine-readable guarantee scope, standards/version provenance, target behavior, uncertainty, and explicit exclusions.
- Distribution and registry architecture is separate from semantic design and requires its own threat, trust, versioning, and ownership analysis.
- Some high-value domains require parsing or external operations rather than one regex artifact.

## Limits, uncertainty, and negative knowledge

No preserved report proves market priority, complete standards conformance, safe defaults, or the feasibility of the proposed registry and structural IR. The utility audit's ranking and examples need fresh source and demand validation. Domain conclusions cannot be generalized from email, URL, UUID, IP, and date examples.

## Alternatives considered

Compiler-shipped helpers, separately versioned domain libraries, generated validators, parser-backed helpers, host-native delegates, community packages, a curated registry, and no standard helper for domains with unstable or misleading guarantees.

## Implications for STRling

The current validation-guarantee contracts provide a stronger basis for future domain research. Helpers should not manufacture compiler, portability, safety, or existence guarantees outside their evidence.

## Recommendations

Revalidate candidates individually, beginning with a declared user job and controlling standard. Separate semantic contract research from distribution architecture. Preserve “not appropriate for regex” as a valid result.

## Rejected or abandoned alternatives

The historical Standard Library document is not a specification. Its API, defaults, strict/lax terminology, registry, Structural IR, and distribution plan are not accepted architecture.

## Downstream disposition

**Disposition:** none. Existing downstream validation contracts are separate authority and do not accept these historical proposals.

## Reports

| Report | Role | Current status |
| --- | --- | --- |
| [STRling Standard Library Specification](reports/standard-library.md) | Historical proposal | Preserved as non-normative input. |
| [STRling Evolution — Registry & Structure](reports/semantic-registry-structure.md) | Historical architecture proposal | Preserved; registry/distribution and structural claims need separate revalidation. |
| [Global Pattern Utility Audit](reports/global-pattern-utilities.md) | Historical research input | Preserved; rankings and source claims require revalidation. |
| [Legacy inquiry synthesis](reports/legacy-inquiry-synthesis.md) | Historical synthesis | Superseded by this README. |

## Sources

See report bibliographies pending focused domain-by-domain verification.

[← Inquiries](../README.md)
