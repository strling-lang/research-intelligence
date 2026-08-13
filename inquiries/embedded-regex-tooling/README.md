---
title: Embedded regex tooling
programs:
  - Fourth Edition Architecture
  - Adoption & Ergonomics
  - Regex Lab
horizon: Fourth Edition
maturity: Exploratory
last-reviewed: 2026-08-12
review-triggers:
  - STRling ratifies canonical compiler, source, diagnostic, or protocol contracts
  - A host integration prototype validates or falsifies the projection model
  - Material change to host-language embedded-language APIs
---

# Embedded regex tooling

## Research question

How can canonical compiler intelligence operate accurately inside host-language literals, templates, builders, macros, and source files while preserving host syntax, provenance, coordinates, edit safety, and semantic authority?

## Motivation / decision informed

The answer may inform future LSP/editor integrations, host plugins, diagnostics, completion, navigation, refactoring, migration, and Lab handoff without creating binding-specific semantic implementations.

## Current state

The modern report supersedes the inquiry’s earlier universal-looking virtual-document framing. STRling’s [ratified architecture](https://github.com/strling-lang/strling/blob/9991575b347ac5f56108f18065c88b2b16a5065a/governance/architecture.md) requires tooling to consume one canonical compiler, but says binding-to-core convergence and exact source, diagnostic, and protocol contracts remain later work. Existing LSP/editor code is transitional. No proposed projection contract or host pilot is adopted.

## Scope

Host-source discovery and classification, host-authoritative parsing and decoding, immutable snapshots, semantic-node provenance, coordinate conversion, non-bijective mappings, partial and malformed source, incremental state, cancellation, safe edit inversion, security, transport choices, and mapping conformance.

## Non-goals

This inquiry does not define regex or STRling semantics, reimplement host parsers, implement an editor extension, promise every host, or make an editor protocol authoritative. It consumes canonical compiler and [explanation](../evidence-aware-regex-explanation/README.md) contracts and owns host-source projection and editor integration.

## Research method

The modern report surveyed host compiler/IDE APIs and embedded-language mechanisms, analyzed coordinate and provenance failure modes, and proposed falsification-oriented pilots. The historical island-grammar and legacy syntheses remain as prior inputs. No prototype or cross-host conformance suite was run.

## Evidence and source quality

Current architecture is verified against a pinned STRling revision. Official host and editor APIs provide relevant precedents, but the report’s opaque citation map was removed, versions were not exhaustively rechecked, and the mapping model has not been implemented or fuzzed.

## Findings

- Semantic authority can remain singular while source provenance varies across raw regex, strings, templates, concatenations, builders, and macros.
- Host integrations should use authoritative host AST, token, symbol, literal-decoding, and recovery machinery; regex-based host parsing creates a shadow parser.
- A constant offset or width-preserving mask cannot model escapes, elisions, holes, concatenations, macros, or synthetic semantic nodes generally.
- Mappings need immutable host snapshots, explicit coordinate units, relation/transform kinds, multiple origins, and editability; non-bijective mappings are normal.
- Diagnostics may map to one or more host ranges. Safe fixes require reverse mapping and stale-snapshot rejection.
- Virtual documents, direct compiler calls, language-service plugins, IDE injection, lexical grammars, and explicit STRling files are replaceable integration mechanisms, not universal architecture.
- Static tooling must not execute builders or host code to discover semantics.
- Incremental caching should key stable syntax/semantic identities and support cancellation rather than compiling every embedded unit after every keystroke.

## Limits, uncertainty, and negative knowledge

No evidence establishes one projection schema across all hosts. Malformed source, macro provenance, interpolations, generated values, multiple coordinate systems, host API stability, latency, memory, and safe edit inversion remain unvalidated. TextMate recognition is not semantic evidence, and virtual-document success in a width-preserving case does not generalize.

## Alternatives considered

Virtual documents, direct compiler invocation, host-language service plugins, Roslyn/PSI-style integrations, lexical injection, host AST extraction, build-time extraction, explicit STRling files, and a shared provenance core were compared.

## Implications for STRling

A future compiler may accept canonical source or semantic-node inputs with provenance and return canonical results that adapters project into host snapshots. This preserves one semantic authority while allowing host-specific acquisition and presentation.

## Recommendations

The report recommends a candidate projection/provenance core behind replaceable host and editor adapters. Before implementation commitment, build headless mapping fixtures and independent TypeScript, C#, and adversarial Python pilots; test escapes, Unicode positions, holes, malformed syntax, concatenation, stale edits, and cancellation. Evaluate virtual documents only behind the projection abstraction.

## Rejected or abandoned alternatives

Reject regex-based host parsing, one global `offset`, constant-delta mapping, independent string decoding, name-only API detection, executing builders, flattening holes or origins, editor-side semantic diagnostics, and virtual URI identity based on ordinal occurrence.

## Downstream disposition

**Disposition:** none.

No projection model, pilot sequence, or integration mechanism from this inquiry is recorded as adopted.

## Reports

| Report | Role | Current status |
| --- | --- | --- |
| [Projecting Canonical STRling Compiler Intelligence into Host-Language Source](reports/embedded-compiler-intelligence.md) | Modern primary research input | Active input; partially verified and not prototyped. |
| [STRling LSP Island Grammar Research](reports/lsp-island-grammar.md) | Historical architecture input | Historical context; virtual projection is not universally selected. |
| [Legacy inquiry synthesis](reports/legacy-inquiry-synthesis.md) | Historical cross-cutting synthesis | Historical input; active framing replaced. |

## Related inquiries

- [Canonical semantic compiler architecture](../canonical-semantic-compiler-architecture/README.md)
- [Evidence-aware regex explanation](../evidence-aware-regex-explanation/README.md)
- [Regex analysis techniques](../regex-analysis-techniques/README.md)
- [Regex Lab interaction model](../regex-lab-interaction-model/README.md)

## Sources

- [`strling` architectural invariants](https://github.com/strling-lang/strling/blob/9991575b347ac5f56108f18065c88b2b16a5065a/governance/architecture.md), reviewed commit `9991575`.
- [Language Server Protocol 3.17](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/).
- [VS Code embedded-language guidance](https://code.visualstudio.com/api/language-extensions/embedded-languages).
- [TypeScript language-service plugin guidance](https://github.com/microsoft/TypeScript/wiki/Writing-a-Language-Service-Plugin).
- [Python AST documentation](https://docs.python.org/3/library/ast.html).

[← Inquiries](../README.md)
