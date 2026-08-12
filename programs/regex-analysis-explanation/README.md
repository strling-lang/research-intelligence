# Regex Analysis & Explanation

## Purpose

Research static and dynamic analysis, safety, complexity, equivalence, containment, witnesses, counterexamples, migration, repair, structured explanation, and why-no-match reasoning for regex and regex-intent systems.

## Important research questions

- Which analyses are sound, complete, useful, or necessarily heuristic for which feature subsets?
- How can tools explain findings with evidence, uncertainty, witnesses, and remediation choices?
- How should complexity and exploitability remain distinct?
- Which equivalence, containment, differential, derivative, graph, symbolic, or runtime methods combine effectively?

## Relationship to STRling

Research can inform compiler analyses, diagnostics, Audit, Evaluate, Compare, and editor intelligence. The product repository and website decide and implement accepted behavior.

## Current evidence boundary

Existing reports discuss ReDoS, derivatives, graph analysis, maintainability, validation, and AI verification, but broad guarantees and architecture selections have not been revalidated. Active STRling safety analysis is implementation evidence, not proof of universal immunity or performance.

## Related existing inquiries

- [Regex safety and complexity](../../inquiries/regex-safety-and-complexity/README.md)
- [Regex analysis techniques](../../inquiries/regex-analysis-techniques/README.md)
- [Regex cognitive ergonomics](../../inquiries/regex-cognitive-ergonomics/README.md)
- [Semantic validation and domain libraries](../../inquiries/semantic-validation-and-domain-libraries/README.md)
- [AI-assisted pattern synthesis and verification](../../inquiries/ai-assisted-pattern-synthesis-and-verification/README.md)

## Future research opportunities

Soundness envelopes, exploitability context, minimal witnesses, why-no-match explanations, repair ranking, equivalence evidence, and human evaluation of explanations.

## Explicit non-goals

This program does not promise universal safety or performance, select an analysis architecture, or implement production analysis services.

[← Programs](../README.md)
