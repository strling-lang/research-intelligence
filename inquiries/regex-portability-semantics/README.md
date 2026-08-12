---
title: Regex portability semantics
programs:
  - Portability & Compatibility
horizon: Fourth Edition
maturity: Exploratory
last-reviewed: 2026-08-12
review-triggers:
  - Ratification of a STRling portability contract or verdict vocabulary
  - Material change to target-profile or portability-planning contracts
  - Certified cross-profile observations that challenge a semantic dimension
---

# Regex portability semantics

## Research question

What does a defensible regex portability claim preserve across exact execution profiles, operations, input domains, configurations, and versions?

## Motivation / decision informed

The answer may inform STRling portability contracts, profile comparison, diagnostics, public explanations, and the boundary between unknown, conditional, and unsupported outcomes.

## Current state

STRling at [`9991575`](https://github.com/strling-lang/strling/tree/9991575b347ac5f56108f18065c88b2b16a5065a) already separates capability evaluation from portability planning and binds planning to exact profiles and evidence. No active downstream record establishes the report's proposed portability tuple or verdict vocabulary as normative STRling semantics.

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

The minimum public contract for the word “portable,” treatment of performance/safety, normalization allowances, and version-range admission remain unsettled. The report's tuple and verdict vocabulary are candidates. Regex Knowledge retains authority over profile facts, and Regex Conformance retains authority over controlled observations.

## Alternatives considered

Same-source portability, syntax compatibility, accepted-language equivalence, whole-operation equivalence, behavior plus operational constraints, and a multidimensional intent-sensitive contract.

## Implications for STRling

Any downstream portability claim should state what must agree, for which profiles and versions, under which conditions, and on what evidence. Unrequested observables need not be demanded, but exposed behavior cannot be ignored.

## Recommendations

The report recommends a typed portability contract with explicit dimensions, conditions, evidence, and indeterminate outcomes. It also recommends separating intent portability from same-source portability. These models are non-normative.

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
