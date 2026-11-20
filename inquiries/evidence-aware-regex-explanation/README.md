---
title: Evidence-aware regex explanation
programs:
  - Regex Analysis & Explanation
  - Fourth Edition Architecture
  - Regex Lab
  - Regex Reference
horizon: Fourth Edition
maturity: Exploratory
last-reviewed: 2026-11-20
review-triggers:
  - STRling revises either versioned explanation contract or the bounded evaluator
  - Analysis produces new proof, witness, or uncertainty results suitable for presentation
  - Consented Lab studies identify evidence-scope or remediation-interpretation errors
---

# Evidence-aware regex explanation

## Research question

How should STRling distinguish diagnostics from explanations and communicate why-match, why-no-match, evidence, causality, uncertainty, witnesses, and remediation without overstating what an analyzer knows?

## Motivation / decision informed

The answer may inform future structured compiler outputs and downstream CLI, editor, Lab, and Reference presentation while preserving the epistemic limits of contributing analyses.

## Current state

STRling `eba5dad3` establishes versioned semantic explanation and bounded no-match explanation contracts. Semantic explanation offers concise and detailed representations with typed evidence. No-match separates evaluation outcome from the strength of a localized cause, and explicitly represents resource exhaustion and unavailable target context. Each contract has scoped authority while the broader semantic specification remains draft. RegEx Docs is available at Website `3187d307`, and both Labs remain coming soon. [Semantic explanation model](https://github.com/strling-lang/strling/blob/eba5dad3de3fa620eb1ea13e0514d02f4b23e288/spec/explanations/semantic/1.0/README.md), [no-match model](https://github.com/strling-lang/strling/blob/eba5dad3de3fa620eb1ea13e0514d02f4b23e288/spec/explanations/no-match/1.0/README.md), [Website surface definitions](https://github.com/strling-lang/website/blob/3187d307e1d4707d706b1a7508f0cc5c067cadac/src/data/surfaces.ts).

## Scope

Diagnostic versus explanation contracts; descriptive and causal claims; why-match and why-no-match; witnesses and counterexamples; evidence identity; uncertainty and refusal; provenance; remediation applicability and preservation; structured transport and progressive disclosure.

## Non-goals

This inquiry does not choose the derivative, automata, symbolic, abstract, empirical, or hybrid algorithms that generate facts. It consumes scoped results from [analysis techniques](../regex-analysis-techniques/README.md), [safety](../regex-safety-and-complexity/README.md), [equivalence](../regex-equivalence-and-rewrite-verification/README.md), validation, Knowledge, and Conformance.

## Research method

The historical report compared explanation, debugging, diagnostics, structured result standards, solver uncertainty, and repair work. This review checked the versioned contracts and their authored result fixtures. A [task-based study packet](../regex-cognitive-ergonomics/reports/lab-task-success-and-evidence-interpretation.md) uses those fixtures to test the interpretation of evidence and scope.

## Evidence and source quality

Pinned source and authored examples establish the distinction between semantic facts, sample executions, a bounded proof, likely localized cause, unknown, and scoped campaign evidence. These are study categories and controlling source fields where applicable. The report’s older human-factors and repair citations lack durable mappings for material claims beyond this study’s scope. The dry run validated fields and the scoring key, with zero participant observations.

## Findings

- A diagnostic states that a condition was detected; an explanation states why the condition holds, how evidence supports it, and where the reasoning stops.
- Descriptive paths and causal claims differ. A path that matches is not automatically the cause of target selection, and a local blocker is not automatically the complete reason for no-match.
- Why-match can cite a semantic derivation; why-no-match needs path-scoped blockers or, for a universal claim, a complete rejection cover within a declared envelope.
- Witnesses refute universal claims when valid in scope. Failure to find a witness proves nothing unless the search is complete.
- Evidence objects should retain type, provenance, profile, operation, assumptions, source/semantic ranges, and analysis identity rather than being flattened into prose.
- `proven`, `refuted`, `supported`, `possible`, `unknown`, `unsupported`, and `empirical only` must not collapse into a confidence score.
- Remediation applicability is separate from syntactic validity and semantic preservation.
- The design objective is calibrated reliance: explanations should expose analyzer limits, not maximize user confidence.
- The pinned no-match fixtures include completed no-match with a likely localized cause and a step-exhausted unknown. The dry-run scoring detected constructed confusion between those outcomes, an all-target extrapolation, and a sample mistaken for certification.

## Limits, uncertainty, and negative knowledge

No evidence establishes which wording, ordering, visual form, uncertainty vocabulary, or level of detail works best for STRling users. Causality for prioritized engines, complete why-no-match covers, minimal explanations, repair ranking, and profile-aware explanation remain open. Unsat cores are not inherently minimal causes; timeouts are not proof of catastrophic backtracking; example-consistent repairs are not proven-safe rewrites.

## Alternatives considered

Message-only diagnostics, raw traces, proof-object-only output, confidence scores, progressive structured explanations, descriptive versus causal accounts, counterexample-driven explanations, and automatic repairs were compared.

## Implications for STRling

The compiler already supplies structured explanations linked to semantic program and source evidence. Presentation can consume those scoped results. The Lab and Docs owners control any presentation changes.

## Recommendations

Use the versioned models as the study inputs. Compare presentations of identical evidence and measure debugging correctness, class-and-scope interpretation, and harmful high-confidence answers before changing either model.

## Rejected or abandoned alternatives

Reject prose strings as semantic authority, confidence percentages without calibration, “minimal cause” without a minimization criterion, timeout-as-cause, engine-family claims without exact profile, scalar safe/unsafe labels, and auto-applicable repairs without preservation evidence.

## Downstream disposition

**Disposition:** none.

The compiler contracts are independently related downstream work. There is no recorded acceptance of the historical research schema or of the presentation intervention.

## Reports

| Report | Role | Current status |
| --- | --- | --- |
| [Trustworthy Regex Explanations for STRling](reports/evidence-aware-regex-explanation.md) | Modern primary research input | Active input; partially verified with unresolved literature citations. |
| [Lab task success and evidence interpretation](../regex-cognitive-ergonomics/reports/lab-task-success-and-evidence-interpretation.md) | Experiment report and study protocol | Pinned examples and instrument dry-run verified; participant outcomes open. |

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
