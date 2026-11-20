---
title: Regex Lab interaction model
programs:
  - Regex Lab
horizon: Post-Fourth Edition
maturity: Evidence-backed
last-reviewed: 2026-11-20
review-triggers:
  - Website selects a shared operation or replay contract or qualifies an interactive provider
  - First eligible certified Coverage Shard checkpoint is consumed
  - Participant observations change a proposed interaction or evidence presentation
  - Compiler artifact or explanation contract changes where Labs use it
---

# Regex Lab interaction model

## Research question

How can RegEx Lab and STRling Lab share orchestration and session context while preserving raw provider operations, semantic compiler provenance, and evidence boundaries?

## Motivation / decision informed

The answer may inform future capability boundaries, sessions, profiles, result types, explanation, witnesses, sharing, execution isolation, privacy, and compiler/product interfaces.

## Current state

The [three-gap candidate review](../../docs/THREE_GAP_CLOSURE_2026-11-20.md) exercised the newer dual-Lab Website worktree with real browser providers and a separate compiler-tools Wasm candidate. That evidence concerns exact review revisions. Public availability and compiler distribution still depend on their owners' decisions.

RegEx Docs is available. Both Labs are marked coming soon. Website `3187d307` has a RegEx Lab route with a locked workbench, v1 execution types and a reactive coordinator. Its production profile state is empty and the default provider is unavailable. STRling Lab is a pending route without website compile or execution wiring. Fourth Edition 4.0.3 has versioned compiler artifact, semantic explanation, and bounded no-match contracts. The Conformance checkpoint index at `3285cc9f` contains zero certified Coverage Shards. [Pinned sources and scope](reports/shared-lab-contract-feasibility.md#downstream-baseline-checked-on-2026-11-20)

## Scope

Capability contracts, common session state, subject and profile context, static versus executed results, comparison and witnesses, explanation, reproducible sharing, compiler interfaces, execution trust, privacy, and result authority.

## Non-goals

This inquiry does not build the Lab, create Conformance evidence, redefine compiler semantics, own Regex Knowledge, prescribe Reference IA, or authorize public execution of untrusted regex. Reference organization belongs to [Regex Reference information architecture](../regex-reference-information-architecture/README.md).

## Research method

The August report analyzed tool precedents. The November study read the pinned downstream contracts, executed fixed native Node operations against hand-authored expectations, exercised the exact Website coordinator with an injected fixture, and saved a dual-Lab session using labelled semantic target fixtures. [Method and results](reports/shared-lab-contract-feasibility.md#method-and-results)

## Evidence and source quality

Pinned code establishes the product boundary. The bounded replay establishes feasibility of preserving operation, state, provider and provenance distinctions. It combines local runtime observations with synthetic semantic and failure cases. The August competitive and user-workflow claims remain partially verified. Public provider operation, isolation, performance, and user effects remain untested by this study.

## Findings

- Static reasoning, runtime execution, profile comparison, and authoring/composition have different contracts and must not share an ambiguous generic result.
- In the trial, two exact raw operations could replay from shared history and a semantic compile-target fixture retained its own evidence label and provenance. Reduction in user effort remains a hypothesis.
- A compiler result, local runtime observation, researched corpus claim, certified observation, and explanation have different authority and scope.
- Comparison should preserve exact profiles, observables, conditions, and replayable witnesses rather than only a red/green verdict.
- Permalinks need immutable or versioned dependencies, privacy choices, and explicit reproducibility limits.
- The coordinator dropped stale work but accepted a fixture response with mismatched operation and provider identity. Public provider qualification should test correct request binding, isolation, quotas, output limits, and operational termination independently from Conformance.
- Explanations should cite the underlying result and evidence rather than becoming a new fact source.

## Limits, uncertainty, and negative knowledge

The candidate interaction names, information density, workflow, sharing behavior, and user jobs remain open to formative evaluation. Actual browser identity, semantic compile and target run, storage/consent, provider termination in deployment, and execution cost remain untested. The local fixture replay does not establish the security of a production trust boundary.

## Alternatives considered

One generic playground, separate standalone tools, a shared session with typed capabilities, client-only execution, server-side sandboxing, remote workers, and links to external runtimes.

## Implications for STRling

The existing RegEx workspace can inform common coordination and history. Per-operation payloads, semantic provenance, and explicit evidence/replay states are needed before it can faithfully represent both Labs. Public execution and certified compatibility keep independent qualification and evidence boundaries.

## Recommendations

Consider the [typed handoff](reports/shared-lab-contract-feasibility.md#shared-envelope-and-owner-handoff) for operation variants, coordinate mapping, lifecycle, provider qualification, and replay. Exercise public-provider requirements in the actual deployment and evaluate evidence interpretation in the formative study. The candidate envelope carries no production API commitment.

## Rejected or abandoned alternatives

A generic “Run” result that conflates static and executed evidence, execution output presented as certified Conformance, a session as canonical knowledge, and an unbounded public runtime are rejected.

## Downstream disposition

**Disposition:** none.

The raw workspace, typed coordinator, and checkpoint integration are independently related. No downstream record reviewed establishes adoption of the shared-Lab recommendation.

## Reports

| Report | Role | Source verification |
| --- | --- | --- |
| [Shared Lab execution and session contract feasibility](reports/shared-lab-contract-feasibility.md) | November bounded experiment | Pinned authority, native fixed-case tests, semantic fixtures, and replay. |
| [STRling Regex Lab: Product Architecture and Developer-Tooling Research](reports/regex-lab-interaction-model.md) | August research input | Partially verified. Product and authority descriptions refer to the August baseline. |

## Replay artifacts

- [Hand-authored fixtures](artifacts/contract-cases.json)
- [Offline runner](artifacts/replay-contract.mjs)
- [Recorded output](artifacts/replay-record.json)

## Sources

- [November product, compiler, and checkpoint sources](reports/shared-lab-contract-feasibility.md#downstream-baseline-checked-on-2026-11-20)
- [Regex Lab program](../../programs/regex-lab/README.md)
- [Developer adoption pathways](../developer-adoption-pathways/README.md)

[← Inquiries](../README.md)
