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
  - Material change to STRling LSP or editor architecture
  - New host-language embedded-language APIs or standards
---

# Embedded regex tooling

## Research question

How can compiler-backed regex or STRling intelligence operate accurately inside host-language literals and templates while preserving host syntax, coordinates, escapes, and authority boundaries?

## Motivation / decision informed

The answer may inform LSP/editor integrations, virtual-document projection, diagnostics, completion, semantic highlighting, and migration workflows.

## Current state

A historical report studies island grammars and virtual documents for Python strings and JavaScript templates. The active product repository contains LSP and editor history, while the Fourth Edition direction requires tooling to consume the canonical compiler rather than a binding-specific semantic implementation.

## Scope

Host-language discovery, literal applicability, decoding and coordinate mapping, incremental synchronization, diagnostics, completions, security boundaries, and compiler-backed projection.

## Non-goals

This inquiry does not implement an editor extension, define host parsers, promise support for every language or embedding, or give tooling independent semantic authority.

## Research method

The current synthesis inventories the report. Later work should inspect current editor APIs and host parsers, prototype bounded projections, and test malformed syntax, escapes, Unicode coordinates, interpolation, and incremental edits.

## Evidence and source quality

The report is historical and partly implementation-prescriptive. Source claims and API behavior require versioned verification. Current architecture comes from `strling`, not the report.

## Findings

Embedded tooling requires a deliberate mapping among host source, decoded pattern source, canonical compiler coordinates, and editor coordinates. Virtual documents are one viable pattern, but direct embedded-language APIs and host AST integrations are alternatives. Compiler results must remain canonical while tooling owns presentation and projection.

## Limits, uncertainty, and negative knowledge

The report covers only selected Python and JavaScript cases and does not establish cross-language feasibility, latency, recovery quality, or maintenance cost. Escape handling and malformed host syntax are major correctness boundaries.

## Alternatives considered

Virtual documents, direct middleware, host AST plugins, tagged-template integrations, language injection APIs, build-time extraction, and explicit STRling files.

## Implications for STRling

A stable compiler protocol and provenance-preserving diagnostics can support several editor strategies without duplicating semantic logic.

## Recommendations

Define a language-neutral projection contract and evaluate it on a small set of materially different hosts before expanding. Treat coordinate round trips and malformed-source behavior as hard correctness tests.

## Rejected or abandoned alternatives

The old binding-specific LSP dependency direction is obsolete. Virtual-document projection is not declared the only valid architecture.

## Downstream disposition

**Disposition:** none.

## Reports

| Report | Role | Current status |
| --- | --- | --- |
| [STRling LSP Island Grammar Research](reports/lsp-island-grammar.md) | Historical architecture input | Preserved; host API and current architecture claims need revalidation. |
| [Legacy inquiry synthesis](reports/legacy-inquiry-synthesis.md) | Historical cross-cutting synthesis | Superseded; cognitive-cost research now has a separate inquiry. |

## Sources

See report bibliography pending focused verification.

[← Inquiries](../README.md)
