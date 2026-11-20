---
title: Regex operation and result semantics
programs:
  - Portability & Compatibility
  - Regex Conformance Science
  - Regex Lab
  - Regex Reference
horizon: Fourth Edition
maturity: Evidence-backed
last-reviewed: 2026-11-20
review-triggers:
  - Website selects operation payloads, an interactive provider, or a coordinate conversion policy
  - Compiler or adapter changes artifact, target profile, or execution contracts
  - An applicable Coverage Shard or operation-level counterexample changes the evidence
---

# Regex operation and result semantics

## Research question

What engine-independent vocabulary can describe compiling and running regexes, execution state, matches, captures, spans, iteration, split, replacement, and failure without erasing native behavior?

## Motivation / decision informed

The answer may inform future adapter, artifact, Conformance-vector, Lab, and Reference contracts that compare like operations and preserve observable differences.

## Current state

The [integrated dual-Lab source](../../docs/THREE_GAP_INTEGRATION_2026-11-20.md#website-acceptance-evidence) was qualified locally with real JavaScript, PCRE2, and Python providers and with semantic target execution. The source preserves provider-specific capabilities, operation-specific results, and separate termination and refusal states. Session history can support a fresh run, and the saved native cursor is unavailable. Certified compatibility still depends on Conformance's checkpoint authority.

Fourth Edition 4.0.3 has scoped compile request/result, target profile, and TargetArtifact contracts. They govern compiler output and provenance on their terms. The earlier public Website revision is the baseline for the authored feasibility trial. The merged source adds structured split and replace behavior where the named provider supports those operations. Conformance owns the canonical semantic corpus and controlled evidence. Its certified Coverage Shard index at the verified baseline is empty. [Historical baseline](../regex-lab-interaction-model/reports/shared-lab-contract-feasibility.md#downstream-baseline-checked-on-2026-11-20), [merged contracts](https://github.com/strling-lang/website/blob/674e06a70a8f86ae9a1cb18061111be949f8e785/src/lib/regex-lab/contracts.ts).

## Scope

Compile, search, full-match, prefix-match, scan, split, and replace; initial and evolving execution state; match selection; capture participation and history; native and normalized spans; zero-width progression; result and error taxonomy.

## Non-goals

This inquiry does not build an engine compatibility table, redefine portability, specify Unicode character semantics, or design Regex Lab UI. It links to the corresponding inquiries.

## Research method

The August report decomposed representative native APIs and proposed structured results. The new bounded study tested search, full-match, scan, replace, split, and extraction with fixed local ECMAScript inputs and independent expected outputs. It used fixtures for semantic target execution, non-UTF-16 coordinates, and failure outcomes, and checked the pinned raw coordinator with a deterministic provider.

## Evidence and source quality

Versioned compiler schemas and Website source establish the implementation boundary. ECMA-262 and fixed native operations establish specific ECMAScript behavior in the trial. The August API survey lacks its original durable citation map, so claims outside the verified sources and fixtures remain partially verified.

## Findings

- “Run a regex” is underspecified: compile, search, full-match, prefix, scan, split, and replace have distinct inputs and observables.
- Region, slice, start position, end bound, direction, selection policy, and mutable cursor state cannot be collapsed safely.
- No-match is a successful execution outcome, distinct from compile failure, unsupported operation, runtime error, timeout, cancellation, or infrastructure failure.
- Capture nonparticipation differs from an empty capture; repeated captures and duplicate names require native behavior to remain representable.
- Every span needs a unit and coordinate space. Native spans are evidence; normalized spans are derived and require mapping provenance.
- Scan is a state machine. Zero-width progression, overlap, and termination policy are part of semantics.
- Split and replace are composite operations with callback/template, unmatched-capture, limit, and output semantics beyond language acceptance.
- The trial found that `a|ab` can select `a` for search and `ab` under a separately defined full-match operation. It reproduced different zero-width scan starts under Unicode/code-unit progression and showed that unchanged replacement output is compatible with either a match or no match. [Trial results](../regex-lab-interaction-model/reports/shared-lab-contract-feasibility.md#method-and-results)

## Limits, uncertainty, and negative knowledge

The original trial covers selected Node operations and synthetic semantic target provenance. The subsequent browser qualification adds the exact providers, profiles and limits in the acceptance record. Repeated-capture histories, reverse matching, streaming, callbacks, other replacement mini-languages and production resource enforcement remain open. Unsupported must come from provider evidence or a controlling contract, and unknown stays explicit.

## Alternatives considered

A single `match` operation, native-only results, fully normalized results, a small semantic kernel plus extensions, and operation-specific contracts were compared.

## Implications for STRling

Future artifacts and adapters may need to state operation contracts separately from target profiles and preserve both semantic and native result coordinates. Conformance vectors can compare exact operations without turning runtime output into normative meaning.

## Recommendations

Keep a small shared envelope and operation-specific payloads. Preserve native spans, derive display coordinates only when mapped, record the scan and replacement policies, and require separate completion, interruption and refusal states. Qualify each selected operation against the actual provider before exposing it publicly. [Owner handoff](../regex-lab-interaction-model/reports/shared-lab-contract-feasibility.md#shared-envelope-and-owner-handoff)

## Rejected or abandoned alternatives

Reject unqualified `match`, unmatched-as-empty normalization, unitless offsets, retrying zero-width searches without a declared progression rule, and treating timeout or infrastructure failure as no-match.

## Downstream disposition

**Disposition:** none.

The compiler artifact and raw Lab request/result unions are independently related and have their own downstream authority. No schema from this inquiry is recorded as adopted.

## Reports

| Report | Role | Current status |
| --- | --- | --- |
| [Shared Lab execution and session contract feasibility](../regex-lab-interaction-model/reports/shared-lab-contract-feasibility.md) | November operation trial | Scoped native-case evidence and contract fixtures. |
| [What It Means to “Run a Regex”](reports/regex-operation-and-result-semantics.md) | August research input | Partially verified with unresolved claim-level citations. Product references are historical. |

## Related inquiries

- [Regex portability semantics](../regex-portability-semantics/README.md)
- [Unicode and text semantics](../unicode-and-text-semantics/README.md)
- [Regex Lab interaction model](../regex-lab-interaction-model/README.md)

## Sources

- [November contract locations and editions](../regex-lab-interaction-model/reports/shared-lab-contract-feasibility.md#downstream-baseline-checked-on-2026-11-20)
- [ECMA-262 2025 RegExp operations and abstract operations](https://tc39.es/ecma262/2025/multipage/text-processing.html#sec-regexp-regular-expression-objects)

[← Inquiries](../README.md)
