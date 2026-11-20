---
title: Regex safety and complexity
programs:
  - Fourth Edition Architecture
  - Regex Analysis & Explanation
horizon: Fourth Edition
maturity: Exploratory
last-reviewed: 2026-11-20
review-triggers:
  - Change to structural fact or safety finding premises
  - Qualified provider exposes a resource or termination decision
  - A verified case contradicts a structural classification
---

# Regex safety and complexity

## Research question

How should STRling reason about computational, resource, and security risk across pattern structure, operation, engine profile, configuration, input bounds, resource policy, and deployment context without collapsing partial analysis into a universal safety claim?

## Motivation / decision informed

The answer may inform compiler safety facts, diagnostics, target-aware explanations, resource contracts, repair suggestions, and public Audit behavior.

## Current state

The 4.0.3 compiler derives structural safety findings and separate typed uncertainty over normalized canonical IR. The stage proves configured structural conditions under exact input identities. It does not evaluate an execution path, public provider or exploitability. Its present limits and evidence are documented in S6 of the [decision evidence register](../../docs/DECISION_EVIDENCE_2026-11-20.md).

## Scope

Matching and compilation hazards, ambiguity, search/iteration amplification, counted repetition, automata/state growth, memory, advanced constructs, engine mitigations, resource exhaustion, exploitability boundaries, evidence strength, and semantics-preserving repair obligations.

## Non-goals

This inquiry does not certify an engine, promise universal ReDoS immunity or linear execution, select one analyzer, run a Conformance campaign, or authorize automatic rewrites. Rewrite preservation belongs to [Regex equivalence and rewrite verification](../regex-equivalence-and-rewrite-verification/README.md), and generated defect discovery belongs to [Regex validation testing methods](../regex-validation-testing-methods/README.md).

## Research method

The modern report updated the historical ReDoS framing through current literature and official engine documentation, compared static, dynamic, and hybrid techniques, and assessed STRling's target-profile boundary. This synthesis also refreshed current compiler status; it did not repeat the literature review or create execution evidence.

## Evidence and source quality

Selected official engine documentation and the current STRling repository were verified. Important literature claims—including the scope and quantitative results of recent systematizations and emerging backreference analyses—still require claim-level source review because the imported marker map was not durable. No certified Regex Conformance observations support this inquiry yet.

## Findings

- “Safe” is not a scalar property of a pattern; meaningful claims bind a pattern, operation, engine/version/mode, input and pattern bounds, resource policy, and deployment scope.
- Structural risk, asymptotic complexity, concrete runtime behavior, resource exposure, and practical exploitability are distinct.
- Nonbacktracking execution removes some backtracking hazards but does not eliminate compilation, determinization, memory, counted-repetition, or operation-level costs.
- Static methods can provide exact results for declared fragments and conservative or heuristic results elsewhere; unknown is a legitimate outcome.
- Engine mitigation is profile- and configuration-specific evidence, not a language property.
- Runtime caps bound failure modes but do not prove low complexity or successful completion.
- Automatic repair has a higher evidence burden than warning: it must preserve the exact observable semantics and avoid introducing another resource hazard.

## Limits, uncertainty, and negative knowledge

No reviewed evidence establishes one analyzer that proves all supported patterns safe, one target-independent safety vocabulary, or a universal semantics-preserving repair. The effect of optimizers, advanced constructs, and runtime upgrades is incompletely modeled. Exploitability often depends on application facts outside a compiler. Analyzer false-positive/negative rates and explanation usefulness have not been evaluated for STRling.

## Alternatives considered

Structural heuristics, ambiguity and automata analyses, derivative/symbolic methods, abstract interpretation, bounded dynamic tests, adversarial fuzzing, target runtime limits, nonbacktracking modes, safer subsets, isolation, repair suggestions, and layered combinations.

## Implications for STRling

A downstream safety contract can preserve multidimensional results, exact evidence class, target scope, resource assumptions, and unknown states. Target-profile facts may refine a source-level finding, but must not erase its provenance or be generalized across versions.

## Recommendations

Present structural premises and uncertainty explicitly. Assess runtime resource behavior separately with a qualified provider, exact operation and bounded method. Base repair suggestions on the observable relation required by the user and the governing target profile.

## Rejected or abandoned alternatives

The categorical claim that STRling eliminates ReDoS is abandoned. Nested quantifiers alone are neither necessary nor sufficient evidence of vulnerability. A timeout, nonbacktracking label, or atomic-group insertion is not treated as a universal safety proof or repair.

## Downstream disposition

**Disposition:** none. Existing compiler safety work is independent downstream authority and does not prove acceptance of either report.

## Reports

| Report | Role | Current status |
| --- | --- | --- |
| [Regular-Expression Computational Safety for STRling](reports/regex-safety-and-complexity.md) | Modern active research input | Partially verified; supersedes obsolete technical conclusions in the historical report for current synthesis. |
| [Regex Backtracking and ReDoS Vulnerabilities](reports/backtracking-redos-vulnerabilities.md) | Historical research input | Preserved for historical methods and references; runtime and categorical conclusions require revalidation. |
| [Legacy inquiry synthesis](reports/legacy-inquiry-synthesis.md) | Historical synthesis | Superseded by this README; obsolete guarantees remain non-authoritative. |

## Sources

- [STRling architecture at `9991575`](https://github.com/strling-lang/strling/blob/9991575b347ac5f56108f18065c88b2b16a5065a/docs/architecture.md)
- [STRling safety analysis source at `9991575`](https://github.com/strling-lang/strling/blob/9991575b347ac5f56108f18065c88b2b16a5065a/core/src/safety_analysis.rs)
- [PCRE2 performance](https://www.pcre.org/current/doc/html/pcre2perform.html)
- [Rust `regex` crate](https://docs.rs/regex/latest/regex/)
- [V8 non-backtracking RegExp engine](https://v8.dev/blog/non-backtracking-regexp)
- [.NET regular-expression options](https://learn.microsoft.com/en-us/dotnet/api/system.text.regularexpressions.regexoptions)
- [Fourth Edition Architecture program](../../programs/fourth-edition-architecture/README.md)
- [Regex Analysis & Explanation program](../../programs/regex-analysis-explanation/README.md)

[← Inquiries](../README.md)
