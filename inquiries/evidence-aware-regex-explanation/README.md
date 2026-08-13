---
title: Evidence-aware regex explanation
programs:
  - Regex Analysis & Explanation
  - Fourth Edition Architecture
  - Regex Lab
  - Regex Reference
horizon: Fourth Edition
maturity: Exploratory
last-reviewed: 2026-08-12
review-triggers:
  - STRling ratifies structured diagnostic or explanation contracts
  - Analysis inquiries produce new proof, witness, or uncertainty result types
  - User research evaluates regex explanations or remediation communication
---

# Evidence-aware regex explanation

## Research question

How should STRling distinguish diagnostics from explanations and communicate why-match, why-no-match, evidence, causality, uncertainty, witnesses, and remediation without overstating what an analyzer knows?

## Motivation / decision informed

The answer may inform future structured compiler outputs and downstream CLI, editor, Lab, and Reference presentation while preserving the epistemic limits of contributing analyses.

## Current state

STRling’s architecture assigns target-independent diagnostics, safety findings, and explanations to semantic analysis, but exact diagnostic and protocol contracts remain later work. Current analysis produces structured facts and uncertainties, while the website remains pre-release and does not establish a shipped Regex Lab or comprehensive Regex Reference. The report’s explanation schema is a research recommendation, not adopted architecture.

## Scope

Diagnostic versus explanation contracts; descriptive and causal claims; why-match and why-no-match; witnesses and counterexamples; evidence identity; uncertainty and refusal; provenance; remediation applicability and preservation; structured transport and progressive disclosure.

## Non-goals

This inquiry does not choose the derivative, automata, symbolic, abstract, empirical, or hybrid algorithms that generate facts. It consumes scoped results from [analysis techniques](../regex-analysis-techniques/README.md), [safety](../regex-safety-and-complexity/README.md), [equivalence](../regex-equivalence-and-rewrite-verification/README.md), validation, Knowledge, and Conformance.

## Research method

The deep-research report compared formal explanation, debugging, static-analysis usability, compiler diagnostics, structured result standards, solver uncertainty, and regex-repair work. The active synthesis checked downstream status and extracted a bounded explanation contract without adopting its candidate schema.

## Evidence and source quality

Pinned STRling and website documents support the current-state boundary. Official LSP, SARIF, Rust, solver, and language specifications provide useful structural precedents. The report’s human-factors and repair citations were not durably mapped, and no STRling user study validates its vocabulary or presentation choices.

## Findings

- A diagnostic states that a condition was detected; an explanation states why the condition holds, how evidence supports it, and where the reasoning stops.
- Descriptive paths and causal claims differ. A path that matches is not automatically the cause of target selection, and a local blocker is not automatically the complete reason for no-match.
- Why-match can cite a semantic derivation; why-no-match needs path-scoped blockers or, for a universal claim, a complete rejection cover within a declared envelope.
- Witnesses refute universal claims when valid in scope. Failure to find a witness proves nothing unless the search is complete.
- Evidence objects should retain type, provenance, profile, operation, assumptions, source/semantic ranges, and analysis identity rather than being flattened into prose.
- `proven`, `refuted`, `supported`, `possible`, `unknown`, `unsupported`, and `empirical only` must not collapse into a confidence score.
- Remediation applicability is separate from syntactic validity and semantic preservation.
- The design objective is calibrated reliance: explanations should expose analyzer limits, not maximize user confidence.

## Limits, uncertainty, and negative knowledge

No evidence establishes which wording, ordering, visual form, uncertainty vocabulary, or level of detail works best for STRling users. Causality for prioritized engines, complete why-no-match covers, minimal explanations, repair ranking, and profile-aware explanation remain open. Unsat cores are not inherently minimal causes; timeouts are not proof of catastrophic backtracking; example-consistent repairs are not proven-safe rewrites.

## Alternatives considered

Message-only diagnostics, raw traces, proof-object-only output, confidence scores, progressive structured explanations, descriptive versus causal accounts, counterexample-driven explanations, and automatic repairs were compared.

## Implications for STRling

A future compiler may expose a structured explanation result linked to canonical semantic nodes and exact evidence while adapters and products own presentation. Lab and Reference could consume the same contract without becoming analysis or evidence authorities.

## Recommendations

The report recommends a candidate structured explanation envelope carrying query, claim, scope, profile, operation, evidence, reasoning steps, uncertainty, witness, limitations, and remediation applicability. Downstream owners should first validate a small cross-surface contract and run user studies that measure task and repair correctness, scope comprehension, and appropriate reliance.

## Rejected or abandoned alternatives

Reject prose strings as semantic authority, confidence percentages without calibration, “minimal cause” without a minimization criterion, timeout-as-cause, engine-family claims without exact profile, scalar safe/unsafe labels, and auto-applicable repairs without preservation evidence.

## Downstream disposition

**Disposition:** none.

No explanation schema or vocabulary from this inquiry is recorded as adopted.

## Reports

| Report | Role | Current status |
| --- | --- | --- |
| [Trustworthy Regex Explanations for STRling](reports/evidence-aware-regex-explanation.md) | Modern primary research input | Active input; partially verified with unresolved literature citations. |

## Related inquiries

- [Regex analysis techniques](../regex-analysis-techniques/README.md)
- [Regex safety and complexity](../regex-safety-and-complexity/README.md)
- [Regex equivalence and rewrite verification](../regex-equivalence-and-rewrite-verification/README.md)
- [Regex validation testing methods](../regex-validation-testing-methods/README.md)
- [Regex Lab interaction model](../regex-lab-interaction-model/README.md)

## Sources

- [`strling` architectural invariants](https://github.com/strling-lang/strling/blob/9991575b347ac5f56108f18065c88b2b16a5065a/governance/architecture.md), reviewed commit `9991575`.
- [Language Server Protocol 3.17](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/).
- [SARIF 2.1.0](https://docs.oasis-open.org/sarif/sarif/v2.1.0/sarif-v2.1.0.html).
- [Rust compiler diagnostics guidance](https://rustc-dev-guide.rust-lang.org/diagnostics.html).
- [Z3 guide](https://microsoft.github.io/z3guide/).

[← Inquiries](../README.md)
