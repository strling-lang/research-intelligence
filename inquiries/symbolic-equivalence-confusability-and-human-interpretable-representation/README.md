---
title: Symbolic equivalence, confusability, and human-interpretable representation
programs:
  - Beyond Patterns
horizon: Beyond Regex
maturity: Exploratory
last-reviewed: 2026-08-14
review-triggers:
  - Claim-level verification of relation classes and cited datasets
  - A concrete security, OCR, search, or moderation task requires nonliteral matching
  - New Unicode normalization or security guidance changes an applicable relation
---

# Symbolic equivalence, confusability, and human-interpretable representation

## Research question

How should identity, standardized and declared equivalence, confusability, directed transformation, contextual interpretation, and uncertain substitution be represented so that nonliteral matches remain explainable and scoped?

## Motivation / decision informed

The answer can prevent a future symbolic matcher from turning every normalization key, visual resemblance, OCR candidate, or contextual reading into one unsafe equality relation.

## Current state

The report develops a typed relation taxonomy over strings and spans. Its central Unicode claims were checked against UAX #15 and UTS #39: canonical and compatibility equivalence differ, and confusable skeletons are security-test intermediates rather than identifier normalization. Broader OCR, transliteration, spelling, and adversarial-text evidence remains only partially reviewed.

## Scope

Literal identity; canonical, profile, and declared equivalence; confusability; span correspondence; direction and cardinality; loss and reversibility; context; uncertain candidates; relation witnesses and provenance.

## Non-goals

This inquiry does not define a general attribute ontology, a universal similarity score, numerical evidence aggregation, linguistic internals, or automatic candidate discovery.

## Research method

The synthesis compares the report's relation classes against controlling Unicode specifications and preserves differences in authority, direction, context, and uncertainty. Later work should validate non-Unicode classes against versioned datasets and measured human or system confusion.

## Evidence and source quality

Official Unicode material strongly supports the distinction between canonical equivalence, compatibility processing, and confusability. Other relation families are plausible but task-, dataset-, language-, font-, or acquisition-dependent. The imported report's citation markers are not independently auditable as stored, so maturity remains Exploratory.

## Findings

- Representational collapse is an operation; equivalence is a semantic claim. A shared key or skeleton does not establish identity.
- Identity, standardized equivalence, declared equivalence, confusability, similarity, directed transformation, contextual interpretation, and uncertain inference require distinct relation types.
- Relations operate over spans, not necessarily characters. One-to-many, many-to-one, and competing alignments need explicit correspondence rather than inferred pairwise substitutions.
- Direction, profile, context, lossiness, reversibility, version, and authority are semantic parts of a transformation or relation.
- Explanations should preserve the original spans and relation path. Approximate scores may qualify evidence but must not erase relation type.

The underlying observation and provenance vocabulary is owned by [Symbolic Attribute Models](../symbolic-attribute-models-for-generalized-pattern-recognition/README.md); numeric aggregation is owned by [Weighted Symbolic Similarity](../weighted-symbolic-similarity-and-evidence-combination/README.md).

## Limits, uncertainty, and negative knowledge

Visual confusability is not stable across fonts, rendering, scripts, users, or tasks. OCR and contextual substitutions require versioned models or datasets. Unrestricted transformation closure can create adversarial expansion and spurious matches. No evidence establishes one complete relation lattice for every domain.

## Alternatives considered

One normalization function; a universal synonym/confusable table; a single fuzzy relation; domain-specific transducers with no shared result contract; or a small typed relation vocabulary with specialized providers.

## Implications for STRling

A future system could retain exact semantics while admitting explicitly named non-equivalent relations and witnesses. Nothing here changes present regex equivalence or authorizes product support.

## Recommendations

Require every nonliteral relation to declare its type, scope, cardinality, direction, profile, context, loss contract, provenance, and witness. Bound adversarial transformations and preserve original text.

## Rejected or abandoned alternatives

Reject a universal `equivalent` or `fuzzy-equal` operator that collapses confusability, normalization, interpretation, and inference. Do not derive character relations from whole-span resemblance such as `rn` and `m`.

## Downstream disposition

**Disposition:** none.

Any adoption belongs to downstream product authority. This inquiry is classified by [Beyond Patterns](../../programs/beyond-patterns/README.md), not by a roadmap.

## Reports

- [Symbolic Equivalence and Representational Substitution for Future Generalized STRling Pattern Systems](reports/symbolic-equivalence-confusability-and-human-interpretable-representation.md) — active AI-assisted research input; partially verified and non-canonical.

## Sources

- [Unicode Normalization Forms](https://www.unicode.org/reports/tr15/) — canonical and compatibility equivalence and normalization limits.
- [Unicode Security Mechanisms](https://www.unicode.org/reports/tr39/) — confusable skeleton scope and security guidance.

[← Inquiries](../README.md)
