---
title: Unicode and text semantics
programs:
  - Fourth Edition Architecture
  - Portability & Compatibility
  - Regex Knowledge Architecture
horizon: Fourth Edition
maturity: Exploratory
last-reviewed: 2026-11-20
review-triggers:
  - New case, predicate or normalization requirement with a pinned Unicode data version
  - A supported target or provider changes encoding, malformed-input policy or index behavior
---

# Unicode and text semantics

## Research question

Which explicit text domains, character units, Unicode versions, normalization and case relations, properties, boundaries, newline policies, malformed-input rules, and coordinate systems are required for portable regex intent?

## Motivation / decision informed

The answer may inform future normative text semantics and the obligations that profiles, lowering, results, evidence, and explanations must carry.

## Current state

The released Semantic IR, structural analysis and exact profiles establish scoped text and index representations. Text and bytes remain distinct in the Python re profiles. Conformance owns the canonical researched text taxonomy. Broader STRling text semantics remain draft. See S2–S3, S6 and C1 in the [decision evidence register](../../docs/DECISION_EVIDENCE_2026-11-20.md).

## Scope

Unicode text and byte domains; bytes, code units, scalar values, and grapheme clusters; Unicode dependency identity; normalization; simple/full/locale-sensitive case relations; properties; word classes and segmentation; newline, dot, and anchors; malformed text; typed positions and offset provenance.

## Non-goals

This inquiry does not define general profile structure, portability claims, target-lowering architecture, engine compatibility tables, or public APIs beyond the text-semantic obligations they would need to preserve.

## Research method

The report synthesized Unicode standards and representative runtime behavior into a candidate semantic contract. The active synthesis checked current STRling authority and separates standards-backed distinctions from policy recommendations requiring downstream ratification.

## Evidence and source quality

Unicode 17.0 §3.13.3 and UTS #18 revision 25 establish distinctions among simple and full folding, Unicode regex requirements and normalization. These standards do not identify a runtime's actual Unicode data. The [decision evidence register](../../docs/DECISION_EVIDENCE_2026-11-20.md) records their versions and the pinned ECMAScript and UTF-8 index boundaries.

## Findings

- Unicode text and arbitrary bytes are distinct semantic domains; an encoding is not itself the regex alphabet.
- Bytes, code units, scalar values, and extended grapheme clusters are not interchangeable. Positions must name their unit and coordinate space.
- Unicode version and data-provider identity can affect properties, folding, and segmentation, so evidence and artifacts need dependency fingerprints.
- Normalization and canonical-equivalence matching must be explicit; transforms need offset provenance.
- Case-insensitive behavior is not one relation: simple folding, full folding, and locale tailoring differ.
- Character predicates, word segmentation, grapheme segmentation, newline, dot, and anchors need independent semantic identities rather than inherited target spellings.
- Malformed encoding policy belongs at the text-domain boundary; native coordinates must not be discarded when normalized coordinates are derived.

## Limits, uncertainty, and negative knowledge

The [bounded language-relation study](../regex-equivalence-and-rewrite-verification/reports/bounded-language-relation-study.md) intentionally compares explicit symbols and does not discharge Unicode predicate, normalization or case obligations. Cross-provider span projection must distinguish native unit, valid boundaries and the exact source snapshot. General full folding, grapheme semantics, and overlap need a specific profile and evidence.

## Alternatives considered

Code-unit semantics, code-point/scalar semantics, grapheme-default semantics, Unicode versus byte domains, runtime-native versus pinned Unicode, implicit versus explicit normalization, simple versus full folding, classic versus UAX #29 boundaries, and native-only versus dual-coordinate results were compared.

## Implications for STRling

If adopted, semantic programs and artifacts would carry explicit text policies, target profiles would report relevant capabilities and dependencies, lowering would prove or refuse preservation, and results would preserve native spans plus traceable derived coordinates.

## Recommendations

The report recommends a candidate baseline of separate Unicode-scalar and byte domains, explicit grapheme operations, pinned Unicode dependencies, no implicit normalization, named folding and boundary relations, coherent newline/dot/anchor policy, reject-by-default malformed Unicode, and typed native/semantic spans. Every choice requires downstream specification.

## Rejected or abandoned alternatives

Reject “character” as an unqualified host unit, implicit UTF decoding for bytes, implicit canonical equivalence, `\w` as a proxy for Unicode word segmentation, `\s` as the newline set, and unitless offsets.

## Downstream disposition

**Disposition:** none.

No candidate Unicode/text policy from this inquiry is recorded as adopted.

## Reports

| Report | Role | Current status |
| --- | --- | --- |
| [STRling’s Canonical Unicode and Text Model](reports/unicode-and-text-semantics.md) | Modern primary research input | Active input; partially verified with unresolved engine-specific citations. |

## Related inquiries

- [Regex execution and target profiles](../regex-execution-and-target-profiles/README.md)
- [Regex operation and result semantics](../regex-operation-and-result-semantics/README.md)
- [Regex portability semantics](../regex-portability-semantics/README.md)
- [Semantic IR and target lowering](../semantic-ir-and-target-lowering/README.md)

## Sources

- [The Unicode Standard](https://www.unicode.org/versions/latest/).
- [UTS #18: Unicode Regular Expressions](https://www.unicode.org/reports/tr18/).
- [UAX #15: Unicode Normalization Forms](https://www.unicode.org/reports/tr15/).
- [UAX #29: Unicode Text Segmentation](https://www.unicode.org/reports/tr29/).
- [UAX #44: Unicode Character Database](https://www.unicode.org/reports/tr44/).
- [`strling` architectural invariants](https://github.com/strling-lang/strling/blob/9991575b347ac5f56108f18065c88b2b16a5065a/governance/architecture.md), reviewed commit `9991575`.

[← Inquiries](../README.md)
