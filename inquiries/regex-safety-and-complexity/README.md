---
title: Regex safety and complexity
programs:
  - Fourth Edition Architecture
  - Regex Analysis & Explanation
horizon: Fourth Edition
maturity: Exploratory
last-reviewed: 2026-08-12
review-triggers:
  - Material change to STRling safety-analysis contracts or implementation
  - New certified engine-specific complexity or exploitability evidence
  - Major survey or replication of regex denial-of-service analysis methods
---

# Regex safety and complexity

## Research question

How should STRling reason about structural regex complexity, engine-specific worst-case behavior, and practical denial-of-service risk without turning partial analysis into a universal guarantee?

## Motivation / decision informed

The answer may inform compiler safety facts, diagnostics, evidence requirements, target-aware explanations, and public Audit behavior.

## Current state

The active STRling compiler includes structured safety analysis and diagnostics, governed by the product repository. Historical research collected backtracking mechanisms, vulnerability shapes, runtime mitigations, analysis ideas, and rewrite proposals. It predates current architecture and sometimes treats a proposed solution as selected.

## Scope

Structural ambiguity, backtracking complexity, target/runtime sensitivity, exploitability context, diagnostic evidence, bounded mitigations, and limitations of analysis.

## Non-goals

This inquiry does not certify any engine, claim that all regex is dangerous, promise universal ReDoS immunity or linear-time execution, select an analysis algorithm, or replace controlled conformance evidence.

## Research method

The present synthesis is an inventory and reframing of historical reports against current STRling authority. Focused later work should verify claims against original papers, official runtime sources, versioned execution evidence, and the implemented safety contracts.

## Evidence and source quality

The reports are historical, AI-assisted research inputs with bibliographies. Their citations and runtime-version claims have not been comprehensively verified under the current [evidence standard](../../docs/EVIDENCE_STANDARD.md). Active implementation status comes only from `strling`; exact observations belong to Regex Conformance.

## Findings

- Regex performance and safety depend on pattern structure, engine algorithm, enabled features, runtime version, input, resource limits, host context, and threat model.
- Structural risk, theoretical worst case, measured runtime behavior, and demonstrated exploitability are related but distinct claims.
- Static analysis can provide useful bounded findings and counterexamples even when full-feature soundness or completeness is unavailable.
- Diagnostics should carry scope, evidence, uncertainty, and remediation tradeoffs rather than a binary safety badge.

These are provisional synthesis statements pending focused verification.

## Limits, uncertainty, and negative knowledge

No reviewed evidence establishes a universal analyzer that proves all supported patterns safe, a universal rewrite that preserves semantics across profiles, or a universal runtime bound. The historical report generalizes some runtime behavior and proposed mitigations beyond their demonstrated scope. Exploitability criteria, false-positive/negative rates, and target/version applicability remain under-researched.

## Alternatives considered

Structural heuristics, derivatives, automata graph analysis, symbolic execution, bounded dynamic testing, runtime timeouts or budgets, safer engine subsets, semantics-preserving rewrites, and layered combinations remain candidates.

## Implications for STRling

STRling can surface target-neutral structural evidence and later combine it with exact profile and runtime context. It should preserve unknown or indeterminate outcomes and avoid converting warnings into guarantees.

## Recommendations

Define claims and evaluation criteria before comparing algorithms. Tie target-specific conclusions to exact profiles and certified evidence. Evaluate explanation usefulness and false confidence alongside detector performance.

## Rejected or abandoned alternatives

The earlier framing that STRling would eliminate ReDoS categorically is abandoned. Automatic atomic-group injection is not presumed semantics-preserving. A derivative-based architecture is not selected by this inquiry.

## Downstream disposition

**Disposition:** none. Current compiler safety work is independent downstream authority, not acceptance of this historical report.

## Reports

| Report | Role | Current status |
| --- | --- | --- |
| [Regex Backtracking and ReDoS Vulnerabilities](reports/Regex%20Backtracking%20and%20ReDoS%20Vulnerabilities.md) | Historical research input | Preserved; requires source and version revalidation. |
| [Legacy inquiry synthesis](reports/legacy-inquiry-synthesis.md) | Historical synthesis | Superseded by this README; obsolete guarantees are non-authoritative. |

## Sources

See the report bibliographies. Future revisions should cite controlling sources directly from this synthesis.

[← Inquiries](../README.md)
