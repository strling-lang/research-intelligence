# Regex Analysis & Explanation

## Purpose

Research static and dynamic analysis, safety, complexity, equivalence, containment, witnesses, counterexamples, migration, repair, structured explanation, and why-no-match reasoning for regex and regex-intent systems.

## Important research questions

- Which analyses are sound, complete, useful, or necessarily heuristic for which feature subsets?
- How can tools explain findings with evidence, uncertainty, witnesses, and remediation choices?
- How should complexity and exploitability remain distinct?
- Which equivalence, containment, differential, derivative, graph, symbolic, or runtime methods combine effectively?
- How should migration and repair preserve semantics across exact target profiles?

## Relationship to STRling

Research can inform compiler analyses, diagnostics, Audit, Evaluate, Compare, and editor intelligence. The product repository and website decide and implement accepted behavior.

## Current evidence boundary

Existing reports discuss ReDoS, derivatives, graph analysis, maintainability, and AI verification, but their broad guarantees and architecture selections have not been revalidated under the current evidence standard. Active STRling safety analysis is implementation evidence, not proof of universal immunity or performance.

## Related existing inquiries

Historical regex safety, analysis-technique, and semantic-validation material is being migrated into focused inquiries and will be linked after their active syntheses are established.

## Future research opportunities

- soundness envelopes for safety and complexity analyses;
- exploitability evidence and runtime context;
- minimal witnesses, counterexamples, and why-no-match explanations;
- repair ranking and equivalence evidence; and
- human evaluation of explanation usefulness.

## Explicit non-goals

This program does not promise universal safety, universal linear time, or complete decidability; select an analysis architecture; or implement production analysis services.

[← Programs](../README.md)
