---
title: Unicode and text semantics
programs:
  - Fourth Edition Architecture
  - Portability & Compatibility
  - Regex Knowledge Architecture
horizon: Fourth Edition
maturity: Exploratory
last-reviewed: 2026-08-12
review-triggers:
  - STRling ratifies Unicode or text-model semantics
  - A supported target changes Unicode provider, version, or index behavior
  - Conformance produces relevant cross-profile observations
---

# Unicode and text semantics

## Research question

Which explicit text domains, character units, Unicode versions, normalization and case relations, properties, boundaries, newline policies, malformed-input rules, and coordinate systems are required for portable regex intent?

## Motivation / decision informed

The answer may inform future normative text semantics and the obligations that profiles, lowering, results, evidence, and explanations must carry.

## Current state

STRling’s architecture requires semantic meaning to precede target lowering but has not ratified the report’s canonical Unicode contract. Current implementation and documentation contain Unicode-sensitive behavior, yet exact Semantic IR and profile contracts remain later work. Regex Knowledge owns researched Unicode/profile facts; Conformance owns future controlled observations.

## Scope

Unicode text and byte domains; bytes, code units, scalar values, and grapheme clusters; Unicode dependency identity; normalization; simple/full/locale-sensitive case relations; properties; word classes and segmentation; newline, dot, and anchors; malformed text; typed positions and offset provenance.

## Non-goals

This inquiry does not define general profile structure, portability claims, target-lowering architecture, engine compatibility tables, or public APIs beyond the text-semantic obligations they would need to preserve.

## Research method

The report synthesized Unicode standards and representative runtime behavior into a candidate semantic contract. The active synthesis checked current STRling authority and separates standards-backed distinctions from policy recommendations requiring downstream ratification.

## Evidence and source quality

Unicode standards are primary for terminology, data, and algorithms. The report’s session markers were not durable, and its engine-specific comparisons and lowering claims remain partially verified. Proposed STRling defaults are recommendations even when based on standards.

## Findings

- Unicode text and arbitrary bytes are distinct semantic domains; an encoding is not itself the regex alphabet.
- Bytes, code units, scalar values, and extended grapheme clusters are not interchangeable. Positions must name their unit and coordinate space.
- Unicode version and data-provider identity can affect properties, folding, and segmentation, so evidence and artifacts need dependency fingerprints.
- Normalization and canonical-equivalence matching must be explicit; transforms need offset provenance.
- Case-insensitive behavior is not one relation: simple folding, full folding, and locale tailoring differ.
- Character predicates, word segmentation, grapheme segmentation, newline, dot, and anchors need independent semantic identities rather than inherited target spellings.
- Malformed encoding policy belongs at the text-domain boundary; native coordinates must not be discarded when normalized coordinates are derived.

## Limits, uncertainty, and negative knowledge

The research does not ratify scalar values as STRling’s default alphabet, a particular `\w`/`\b` formula, newline set, folding mode, normalization policy, Unicode pinning policy, or eager public span API. Exact target lowering and helper requirements need proofs and empirical evidence.

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
- [`strling` architectural invariants](https://github.com/strling-lang/strling/blob/6ff362ac261d38aff282173c08a8841d3c5704cf/governance/architecture.md), reviewed commit `6ff362a`.

[← Inquiries](../README.md)
