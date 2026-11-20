---
title: Regex portability semantics
programs:
  - Portability & Compatibility
horizon: Fourth Edition
maturity: Exploratory
last-reviewed: 2026-11-20
review-triggers:
  - Change to the target profile, portability decision or rewrite registry contract
  - An independently replayed counterexample or proposed stronger observable preservation relation
---

# Regex portability semantics

## Research question

What does a defensible regex portability claim preserve across exact execution profiles, operations, input domains, configurations, and versions?

## Motivation / decision informed

The answer may inform STRling portability contracts, profile comparison, diagnostics, public explanations, and the boundary between unknown, conditional, and unsupported outcomes.

## Current state

Fourth Edition uses exact profile-scoped capability evaluation and versioned portability planning. Final decisions are native, equivalent rewrite or unsupported. Indeterminate capability or proof remains unresolved evidence. The registry has exactly two governed rules, including an optional explicit action separate from mandatory portability. See S3–S4 in the [decision evidence register](../../docs/DECISION_EVIDENCE_2026-11-20.md).

## Scope

Recognized language, match selection, spans, captures, Unicode/text models, anchors, global progression, host operations, replacement behavior, version/configuration conditions, operational constraints when requested, and evidence-qualified conclusions.

## Non-goals

This inquiry does not own algorithms for proving equivalence, target profile facts, compatibility tables, generated tests, or compiler implementation. Proof and witness methods belong to [Regex equivalence and rewrite verification](../regex-equivalence-and-rewrite-verification/README.md).

## Research method

The report synthesized standards, runtime documentation, and STRling ecosystem boundaries. This README extracts the stable ontology of a claim and records unresolved verification without reproducing the report's proposed schema.

## Evidence and source quality

The central dimensions are supported by primary standards and official runtime documentation, but not every version-specific example or host-API edge case has been verified claim by claim. The original session markers lack a durable mapping, so the inquiry remains Exploratory.

## Findings

- Portability is relative to a declared observable contract, exact profiles, operation, input domain, and permitted normalization.
- Identical syntax is neither necessary nor sufficient for behavioral portability.
- Recognition, selected match, spans, captures, iteration, replacement, and operational behavior are distinct claim dimensions.
- Version, Unicode model, flags, locale, host API, and matcher mode can be semantic parameters rather than incidental metadata.
- Evidence strength must remain separate from the verdict: finite agreement cannot silently become universal proof.
- Known difference, missing evidence, inapplicability, and infrastructure failure require different states.
- Different target artifacts can be portable when they preserve the declared observations.

## Limits, uncertainty, and negative knowledge

The historical portability tuple, performance/safety claims, normalization allowances, and version-family admission remain exploratory. Runtime result, index, replacement and capture behavior need separate scope and evidence. Conformance owns its semantic corpus and empirical observations. The compiler owns authored target capability claims.

## Alternatives considered

Same-source portability, syntax compatibility, accepted-language equivalence, whole-operation equivalence, behavior plus operational constraints, and a multidimensional intent-sensitive contract.

## Implications for STRling

Any downstream portability claim should state what must agree, for which profiles and versions, under which conditions, and on what evidence. Unrequested observables need not be demanded, but exposed behavior cannot be ignored.

## Recommendations

Use the current planner vocabulary and its evidence distinctions. For proposals beyond the closed registry, define the observable and obtain the applicable proof first. The [bounded language-relation study](../regex-equivalence-and-rewrite-verification/reports/bounded-language-relation-study.md) establishes a narrower model for accepted-language decisions.

## Rejected or abandoned alternatives

This inquiry rejects Boolean engine-level compatibility, syntax identity as proof, and treating finite differential agreement as universal equivalence.

## Downstream disposition

**Disposition:** none.

## Reports

| Report | Role | Source verification |
| --- | --- | --- |
| [Regex Portability: A Formal Conceptual Framework](reports/regex-portability-semantics.md) | Modern active research input | Partially verified; primary standards and runtime documentation checked selectively. |

## Sources

- [STRling portability planning at `9991575`](https://github.com/strling-lang/strling/blob/9991575b347ac5f56108f18065c88b2b16a5065a/docs/portability-planning.md)
- [ECMAScript RegExp specification](https://tc39.es/ecma262/multipage/text-processing.html#sec-regexp-regular-expression-objects)
- [Unicode Technical Standard #18](https://www.unicode.org/reports/tr18/)
- [PCRE2 pattern documentation](https://www.pcre.org/current/doc/html/pcre2pattern.html)
- [POSIX regular expressions](https://pubs.opengroup.org/onlinepubs/9799919799/basedefs/V1_chap09.html)
- [Portability & Compatibility program](../../programs/portability-compatibility/README.md)

[← Inquiries](../README.md)
