---
title: Regex operation and result semantics
programs:
  - Portability & Compatibility
  - Regex Conformance Science
  - Regex Lab
  - Regex Reference
horizon: Fourth Edition
maturity: Exploratory
last-reviewed: 2026-08-12
review-triggers:
  - STRling ratifies compiler or adapter operation/result contracts
  - Regex Conformance defines executable operation schemas
  - A Lab or Reference surface for execution results is proposed downstream
---

# Regex operation and result semantics

## Research question

What engine-independent vocabulary can describe compiling and running regexes, execution state, matches, captures, spans, iteration, split, replacement, and failure without erasing native behavior?

## Motivation / decision informed

The answer may inform future adapter, artifact, Conformance-vector, Lab, and Reference contracts that compare like operations and preserve observable differences.

## Current state

STRling’s ratified architecture defines compiler responsibility but leaves exact request/result and TargetArtifact contracts to later work. Conformance reserves protocol responsibility for native indexes, captures, replacement, errors, and timeouts, but no certified observations exist. The website remains Fourth Edition pre-release; Regex Lab and a comprehensive Regex Reference are research directions, not shipped surfaces.

## Scope

Compile, search, full-match, prefix-match, scan, split, and replace; initial and evolving execution state; match selection; capture participation and history; native and normalized spans; zero-width progression; result and error taxonomy.

## Non-goals

This inquiry does not build an engine compatibility table, redefine portability, specify Unicode character semantics, or design Regex Lab UI. It links to the corresponding inquiries.

## Research method

The report decomposed representative native APIs into an engine-independent operation model, compared edge cases, and proposed structured results. The active synthesis checked current downstream status and retained distinctions that survive API-specific vocabulary.

## Evidence and source quality

Official downstream documents support the ownership and implementation boundary. The report’s broad API survey lacks a durable marker-to-source map, so exact mappings and edge cases require focused verification against versioned official documentation and controlled observations.

## Findings

- “Run a regex” is underspecified: compile, search, full-match, prefix, scan, split, and replace have distinct inputs and observables.
- Region, slice, start position, end bound, direction, selection policy, and mutable cursor state cannot be collapsed safely.
- No-match is a successful execution outcome, distinct from compile failure, unsupported operation, runtime error, timeout, cancellation, or infrastructure failure.
- Capture nonparticipation differs from an empty capture; repeated captures and duplicate names require native behavior to remain representable.
- Every span needs a unit and coordinate space. Native spans are evidence; normalized spans are derived and require mapping provenance.
- Scan is a state machine. Zero-width progression, overlap, and termination policy are part of semantics.
- Split and replace are composite operations with callback/template, unmatched-capture, limit, and output semantics beyond language acceptance.

## Limits, uncertainty, and negative knowledge

There is no verified universal core that losslessly represents every native API. Repeated-capture histories, reverse matching, streaming, callbacks, replacement mini-languages, malformed text, resource accounting, and index conversion may require extensions or explicit refusal. The candidate schema is not adopted.

## Alternatives considered

A single `match` operation, native-only results, fully normalized results, a small semantic kernel plus extensions, and operation-specific contracts were compared.

## Implications for STRling

Future artifacts and adapters may need to state operation contracts separately from target profiles and preserve both semantic and native result coordinates. Conformance vectors can compare exact operations without turning runtime output into normative meaning.

## Recommendations

The report recommends a candidate operation vocabulary and layered result model: explicit operation and state, typed outcomes, capture participation, native spans plus optional normalized spans, declared scan progression, and structured replacement/split behavior. Validate per operation and profile before downstream ratification.

## Rejected or abandoned alternatives

Reject unqualified `match`, unmatched-as-empty normalization, unitless offsets, retrying zero-width searches without a declared progression rule, and treating timeout or infrastructure failure as no-match.

## Downstream disposition

**Disposition:** none.

No operation or result schema from this inquiry is recorded as adopted.

## Reports

| Report | Role | Current status |
| --- | --- | --- |
| [What It Means to “Run a Regex”](reports/regex-operation-and-result-semantics.md) | Modern primary research input | Active input; partially verified with unresolved claim-level citations. |

## Related inquiries

- [Regex portability semantics](../regex-portability-semantics/README.md)
- [Unicode and text semantics](../unicode-and-text-semantics/README.md)
- [Regex Lab interaction model](../regex-lab-interaction-model/README.md)

## Sources

- [`strling` architectural invariants](https://github.com/strling-lang/strling/blob/6ff362ac261d38aff282173c08a8841d3c5704cf/governance/architecture.md), reviewed commit `6ff362a`.
- [`regex-conformance` adapter protocol boundary](https://github.com/strling-lang/regex-conformance/blob/57672519e899f986d94b7d1256ffe0aa90f1b26d/protocol/README.md).
- [`website` Fourth Edition content rules](https://github.com/strling-lang/website/blob/7c7042f3d4418533f5dc0283537546529633b081/README.md), reviewed commit `7c7042f`.

[← Inquiries](../README.md)
