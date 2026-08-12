---
title: Goal-directed pattern evaluation
programs:
  - Beyond Regex
horizon: Beyond Regex
maturity: Exploratory
last-reviewed: 2026-08-12
review-triggers:
  - Focused comparison of SNOBOL, Icon, generators, and modern search systems
  - Downstream interest in non-regex evaluation semantics
---

# Goal-directed pattern evaluation

## Research question

What useful semantics from goal-directed evaluation, generators, scanning environments, reversible state, and first-class pattern composition apply to modern pattern systems, and should any remain separate from regex compilation?

## Motivation / decision informed

The answer could inform long-range evaluation or orchestration research without assuming that such semantics belong in STRling's regex-intent compiler.

## Current state

Historical research surveys SNOBOL4 and Icon and maps their concepts to an older STRling architecture. Its implementation sketches, emitter assumptions, and direct roadmap implications are obsolete.

## Scope

Success/failure semantics, resumable search, generators, scanning state, reversible effects, modular pattern composition, and interoperability with compiled regex artifacts.

## Non-goals

This inquiry does not commit STRling to a virtual machine, generator runtime, stateful evaluation model, or generalized pattern engine.

## Research method

The current synthesis preserves one historical report. Later work should verify language semantics from primary documentation and compare them with modern parser combinators, generators, logic programming, and search frameworks on explicit tasks.

## Evidence and source quality

The report is historical and AI-assisted. Its original-language descriptions and cited claims require verification; its STRling mapping predates Fourth Edition.

## Findings

Goal-directed systems expose useful ideas—resumable alternatives, explicit success/failure propagation, and state restoration—that differ materially from returning a single regex match. Those differences may justify a separate evaluation layer rather than expansion of regex semantics.

## Limits, uncertainty, and negative knowledge

No current evidence establishes demand, performance, safety, interoperability, or a product fit. The report does not separate language semantics cleanly from its proposed implementation.

## Alternatives considered

Host-language generators, parser combinators, explicit search APIs, logic programming, regex iteration, backtracking control, and separate orchestration systems.

## Implications for STRling

If revisited, research should begin with user tasks and semantic boundaries. Existing target artifacts could potentially participate without changing canonical regex intent.

## Recommendations

Keep this Beyond Regex. Produce a primary-source semantic comparison and task corpus before considering architecture.

## Rejected or abandoned alternatives

The old report's Python compiler, node, and per-target emitter sketches are not current architecture. Goal-directed search is not presumed to require a STRling language feature.

## Downstream disposition

**Disposition:** none.

## Reports

- [STRling Pattern Evolution Research](reports/pattern-evolution.md) — historical SNOBOL/Icon research input; requires revalidation.
- [Legacy inquiry synthesis](reports/legacy-inquiry-synthesis.md) — superseded synthesis; grammar research moved to a separate inquiry.

## Sources

See the report bibliography pending focused primary-source verification.

[← Inquiries](../README.md)
