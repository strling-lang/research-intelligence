---
title: Non-text sequence patterns
programs:
  - Beyond Regex
horizon: Beyond Regex
maturity: Exploratory
last-reviewed: 2026-08-12
review-triggers:
  - Concrete user need for bit, byte, biological, or numeric symbolic sequences
  - Focused comparison against specialized sequence systems
---

# Non-text sequence patterns

## Research question

Which pattern operations over bits, bytes, structured sequences, biological alphabets, or discretized numerical sequences share useful abstractions with text pattern systems, and where do their semantics and architectures diverge?

## Motivation / decision informed

The answer could distinguish legitimate reusable compiler concepts from superficial “all data is patterns” generalization.

## Current state

The historical report surveys binary telemetry, streaming engines, packet processing, numeric motifs, and genomics, then proposes a stream-agnostic parser. Its domains, guarantees, and architecture are too broad for one conclusion.

## Scope

Finite alphabets, bit and byte sequences, typed or structured elements, biological alphabets, discretized numeric symbols, streaming, packing, alignment, captures, and domain-specific semantics.

## Non-goals

This inquiry does not include images, audio, vision, arbitrary tensors, or every use of the word pattern by default. It does not promise zero-copy operation, hardware acceleration, or a unified architecture.

## Research method

The current work reframes historical discovery material. Future inquiries should select one domain and task, use primary system documentation and empirical benchmarks, and compare specialized tools before generalizing.

## Evidence and source quality

The report is AI-assisted, broad, and partly speculative. Performance statements, system capabilities, and proposed abstractions require domain-specific verification.

## Findings

Some non-text domains can be modeled as sequences over explicit alphabets, but element identity, alignment, endianness, structure, scoring, streaming, and domain meaning materially affect semantics. Shared sequence vocabulary does not imply one runtime or IR.

## Limits, uncertainty, and negative knowledge

The report does not establish user demand, cross-domain commonality, end-to-end performance, or safe abstraction boundaries. Numerical motif discovery and structured binary parsing may require fundamentally different systems.

## Alternatives considered

Specialized binary parsers, packet languages, bioinformatics libraries, symbolic discretization, stream processors, automata engines, and independent domain DSLs.

## Implications for STRling

Any future connection should be justified per domain and may be interoperability or shared tooling rather than compiler expansion.

## Recommendations

Keep Beyond Regex. Split future work by concrete sequence type and task; define semantics before architecture.

## Rejected or abandoned alternatives

The stream-agnostic parser and universal `Sequence<T>` compiler layers are not accepted direction. Multimodal framing is retired from the active question.

## Downstream disposition

**Disposition:** none.

## Reports

- [Stream-Agnostic Parser Deep Research](reports/Stream-Agnostic%20Parser%20Deep%20Research.md) — historical discovery and architecture input; requires domain-specific revalidation.
- [Legacy inquiry synthesis](reports/legacy-inquiry-synthesis.md) — superseded synthesis.

## Sources

See report bibliography pending focused verification.

[← Inquiries](../README.md)
