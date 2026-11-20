---
title: Semantic validation and domain libraries
programs:
  - Fourth Edition Architecture
  - Regex Analysis & Explanation
  - Adoption & Ergonomics
horizon: Fourth Edition
maturity: Exploratory
last-reviewed: 2026-11-20
review-triggers:
  - New documented demand and controlling standard for a particular domain helper
  - Change to an Essential-5 helper or guarantee contract
---

# Semantic validation and domain libraries

## Research question

How should STRling distinguish lexical shape, normalized structure, domain semantics, external verification, and existence while supporting reusable domain logic with explicit guarantees and provenance?

## Motivation / decision informed

The answer may inform validation contracts, domain helpers, standard-library evidence, diagnostics, registries, distribution, and public explanations.

## Current state

The versioned validation guarantee schemas and canonical Essential-5 registry govern scoped helper claims in 4.0.3. The historical utility map, registry and Standard Library proposals precede these controls. See S7 in the [decision evidence register](../../docs/DECISION_EVIDENCE_2026-11-20.md).

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

Use the current helper guarantee contract for a named validation task. Require the governing standard, permitted subset, relevant inputs and independently checked evidence before proposing an additional helper or stronger claim.

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
