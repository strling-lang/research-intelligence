---
title: Symbolic attribute models for generalized pattern recognition
programs:
  - Beyond Patterns
horizon: Beyond Regex
maturity: Exploratory
last-reviewed: 2026-08-14
review-triggers:
  - Claim-level verification of the imported report against its cited primary sources
  - A concrete cross-domain matching task tests the observation and projection boundary
  - A downstream authority requests a typed symbolic observation contract
---

# Symbolic attribute models for generalized pattern recognition

## Research question

What minimal observation model can represent multiple symbolic interpretations, typed attributes and claims, context, grouping, ambiguity, and provenance without becoming a universal feature bag or prematurely selecting an IR?

## Motivation / decision informed

The answer can give later Beyond Patterns inquiries a precise vocabulary for what is observed and what is inferred from it. It may inform a future architecture investigation, but it does not decide whether STRling should implement such a model.

## Current state

The imported report proposes a Typed Observation–Projection Model as a research abstraction. It compares typed feature structures, annotation graphs, UIMA views, relational and provenance models, Unicode, and extensible typed IR precedents. Representative claims about Unicode normalization, UIMA multi-view subjects of analysis, and PROV were spot-checked; the full source set and opaque citation markers have not been audited.

## Scope

Observation occurrences and extents; representation domains; typed projections, attributes, claims, and relations; explicit context; composite observations and groups; alternative interpretations; derivation and provenance.

## Non-goals

This inquiry does not own equivalence or confusability semantics, numerical similarity aggregation, relational pattern operators, discovery, a universal ontology, a STRling IR, or a runtime. Those questions belong to their focused inquiries or downstream authorities.

## Research method

The active synthesis separates the report's prior-art findings from its proposed vocabulary, checks representative controlling sources, and compares the proposal with adjacent inquiries. Further work should test the model against concrete counterexamples from at least three domains and record which abstractions remain genuinely shared.

## Evidence and source quality

The report is AI-assisted and source-rich, but its research-session citation markers are not durable claim-level citations. Spot checks support several central separations; they do not verify every comparison or establish that the proposed model is the uniquely correct architecture. Maturity therefore remains Exploratory.

## Findings

- An observation occurrence should remain distinct from symbolic interpretations projected from it. This prevents a source span, abstract symbol, rendering, and domain analysis from becoming one ontological object.
- Representations and projections need explicit types and context. A projection can be partial, many-valued, many-to-many, or loss-bearing; it need not be a unary feature lookup.
- Typed claims should distinguish semantic applicability, production or derivation, commitment state, and provenance. Those axes cannot safely collapse into one `intrinsic/contextual/inferred` enumeration.
- Groups and multi-element observations need their own extents, membership or part relations, and emergent claims. Ambiguous alternatives must remain alternatives rather than simultaneous facts.
- A many-sorted relational account, typed local feature structures, and attributed graphs are compatible views of this research model. Their analogy does not select one storage form, IR, or runtime.

The semantics of [equivalence and confusability](../symbolic-equivalence-confusability-and-human-interpretable-representation/README.md), [linguistic projections](../phonetic-graphemic-and-linguistic-pattern-domains/README.md), and [relational operators](../relational-pattern-algebra-for-sequences-and-structured-values/README.md) remain owned by those inquiries.

## Limits, uncertainty, and negative knowledge

No cross-domain prototype or task evaluation establishes that the whole vocabulary is necessary, sufficient, ergonomic, or efficiently implementable. Shared graph terminology is not evidence for a shared runtime. It remains unknown whether a future system should use an internal model, external schemas, provider contracts, or only interoperable result conventions.

## Alternatives considered

A universal feature map; destructive canonical records; one schema per domain with no shared vocabulary; an ontology-first graph; typed records only; or a small common observation envelope with specialized domain projections.

## Implications for STRling

If downstream work ever studies generalized symbolic matching, preserving source observations while attaching typed, context-scoped projections would avoid several category errors. This is not a recommendation to modify the current regex semantic compiler or Fourth Edition work.

## Recommendations

Use observation, extent, representation, projection, typed claim, context, group, alternative, and provenance as provisional research terms. Test them with adversarial span, ambiguity, and loss cases before proposing syntax, IR, or product scope.

## Rejected or abandoned alternatives

Reject the universal bag-of-features model and destructive normalization as research defaults. Do not adopt the report's named TOPM abstraction as a product architecture without independent validation.

## Downstream disposition

**Disposition:** none.

Any architecture decision belongs to the `strling` repository and its Program Owner. The [Beyond Patterns program](../../programs/beyond-patterns/README.md) classifies this research but does not schedule implementation.

## Reports

- [Symbolic Observation Models for Future Generalized STRling Research](reports/symbolic-attribute-models-for-generalized-pattern-recognition.md) — active AI-assisted research input; partially verified and non-canonical.

## Sources

- [Apache UIMA CAS API](https://uima.apache.org/d/uimaj-current/api/org/apache/uima/cas/CAS.html) — official multi-view subject-of-analysis precedent.
- [PROV-O: The PROV Ontology](https://www.w3.org/TR/prov-o/) — W3C provenance model.
- [Unicode Normalization Forms](https://www.unicode.org/reports/tr15/) — controlling distinctions among normalization forms and information loss.

[← Inquiries](../README.md)
