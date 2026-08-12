---
title: Regex Lab interaction model
programs:
  - Regex Lab
horizon: Post-Fourth Edition
maturity: Exploratory
last-reviewed: 2026-08-12
review-triggers:
  - A downstream Regex Lab product decision
  - User research validates or rejects proposed capability boundaries
  - Material change to compiler, Knowledge, Conformance, or Website interfaces
---

# Regex Lab interaction model

## Research question

How should an interactive Regex Lab separate static inspection, controlled execution, cross-profile comparison, and composition while sharing useful session context and preserving authority and evidence boundaries?

## Motivation / decision informed

The answer may inform future capability boundaries, sessions, profiles, result types, explanation, witnesses, sharing, execution isolation, privacy, and compiler/product interfaces.

## Current state

No dedicated Regex Lab or Inspect/Run/Compare/Compose surface was found in Website commit [`7c7042f`](https://github.com/strling-lang/website/tree/7c7042f3d4418533f5dc0283537546529633b081). STRling at [`9991575`](https://github.com/strling-lang/strling/tree/9991575b347ac5f56108f18065c88b2b16a5065a) provides evolving compiler contracts but not the full product architecture proposed by the report. Regex Conformance at [`f8c603a`](https://github.com/strling-lang/regex-conformance/tree/f8c603a1a4f5f827247f8a5bed61c85f483857f8) has no certified observations.

## Scope

Capability contracts, common session state, subject and profile context, static versus executed results, comparison and witnesses, explanation, reproducible sharing, compiler interfaces, execution trust, privacy, and result authority.

## Non-goals

This inquiry does not build the Lab, create Conformance evidence, redefine compiler semantics, own Regex Knowledge, prescribe Reference IA, or authorize public execution of untrusted regex. Reference organization belongs to [Regex Reference information architecture](../regex-reference-information-architecture/README.md).

## Research method

The report analyzed mature regex and developer tools against STRling's authority boundaries. This synthesis refreshes current product state and retains interaction principles while treating all names and schemas as proposals.

## Evidence and source quality

Repository state and selected public-tool behavior were checked. The report has no direct STRling usability, privacy, security, or performance study. Competitive and user-workflow claims remain partially verified, so the inquiry is Exploratory.

## Findings

- Static reasoning, runtime execution, profile comparison, and authoring/composition have different contracts and must not share an ambiguous generic result.
- Shared session context can reduce re-entry cost, but operation-specific inputs, results, provenance, and failure states must remain distinct.
- A compiler result, runtime observation, Knowledge statement, Conformance observation, and explanation have different authorities.
- Comparison should preserve exact profiles, observables, conditions, and replayable witnesses rather than only a red/green verdict.
- Permalinks need immutable or versioned dependencies, privacy choices, and explicit reproducibility limits.
- Public execution requires isolation, quotas, cancellation, output limits, and separation from trusted Conformance production.
- Explanations should cite the underlying result and evidence rather than becoming a new fact source.

## Limits, uncertainty, and negative knowledge

The names Inspect/Run/Compare/Compose, their information density, session transitions, default profiles, sharing behavior, and expected user jobs are unvalidated. Execution cost and privacy boundaries are unknown. A unified surface may be too complex; separate tools may fragment context.

## Alternatives considered

One generic playground, separate standalone tools, a shared session with typed capabilities, client-only execution, server-side sandboxing, remote workers, and links to external runtimes.

## Implications for STRling

If a downstream owner pursues a Lab, it can ask the compiler, Knowledge, Conformance, and execution systems for typed results without merging their authority. The session and result schemas would require independent product and security decisions.

## Recommendations

The report recommends candidate Inspect/Run/Compare/Compose capabilities, a shared but typed session model, evidence-class labels, replayable witnesses, versioned sharing, and hardened execution boundaries. Names, LabSession/ProfileRef shapes, and result schemas remain proposals.

## Rejected or abandoned alternatives

A generic “Run” result that conflates static and executed evidence, execution output presented as certified Conformance, a session as canonical knowledge, and an unbounded public runtime are rejected.

## Downstream disposition

**Disposition:** none.

## Reports

| Report | Role | Source verification |
| --- | --- | --- |
| [STRling Regex Lab: Product Architecture and Developer-Tooling Research](reports/regex-lab-interaction-model.md) | Modern active research input | Partially verified; current product boundaries and selected tool precedents checked. |

## Sources

- [STRling Website at `7c7042f`](https://github.com/strling-lang/website/tree/7c7042f3d4418533f5dc0283537546529633b081)
- [STRling architecture at `9991575`](https://github.com/strling-lang/strling/blob/9991575b347ac5f56108f18065c88b2b16a5065a/docs/architecture.md)
- [Regex Conformance at `f8c603a`](https://github.com/strling-lang/regex-conformance/tree/f8c603a1a4f5f827247f8a5bed61c85f483857f8)
- [Regex Lab program](../../programs/regex-lab/README.md)
- [Developer adoption pathways](../developer-adoption-pathways/README.md)

[← Inquiries](../README.md)
