# Evidence standard

## Principle

Use the strongest evidence applicable to the claim. “Primary” does not mean universally controlling: authority depends on what is being asserted, for which version or profile, and under which conditions.

## Preferred source classes

1. normative standards and specifications;
2. official implementation or runtime documentation and release notes;
3. official source code and test suites;
4. peer-reviewed primary research and associated artifacts;
5. reproducible empirical evidence;
6. authoritative technical publications;
7. secondary synthesis; and
8. AI-assisted discovery or provisional synthesis.

Lower-numbered classes are a discovery preference, not a mechanical ranking for every claim. A controlled observation may refute an assumption about what one runtime did without changing the normative standard. Official source can clarify implementation behavior without redefining an external specification.

## Claim-specific precedence

- A controlling specification governs a normative claim within its defined scope.
- Official documentation and release notes govern what an implementation publicly documents or promises for an identified version.
- Official source and tests are primary implementation evidence, subject to branch, build, configuration, and reachability.
- Certified Regex Conformance evidence governs what an exact controlled runtime execution observed. It does not become a normative guarantee.
- The active STRling repository, authority hierarchy, and campaign govern current architecture and implementation status.
- An original research paper governs what that paper reports as its method and scientific result; replication and later work may qualify the result.
- A user study governs observations about its sampled participants and method, not developers universally.

When sources conflict, first test whether version, profile, API, host, configuration, terminology, or claim type explains the conflict. Preserve unresolved conflict if no defensible precedence resolves it.

## Epistemic categories

| Category | Meaning |
| --- | --- |
| Normative | Required or defined by a controlling authority within scope. |
| Observed | Recorded through a stated empirical method and environment. |
| Published result | Reported by an identifiable research publication. |
| Inference | Reasoned from cited evidence. |
| Recommendation | Proposed action based on findings and values. |
| Hypothesis | Testable but not yet established explanation or prediction. |
| Speculation | Possibility with limited evidence. |

Labels are tools for ambiguity, not mandatory sentence prefixes.

## Applicability and provenance

For consequential claims, record source identity and durable location; author or responsible organization; publication, release, or access date; version, profile, commit, standard edition, or environment; method, sample, inputs, and exclusions when empirical; whether the source is direct, quoted, translated, archived, or AI-discovered; and known corrections, retractions, supersession, or conflicts.

Do not cite a whole standard, repository, or database when a narrower section, file, commit, or record controls the claim.

## Empirical claims

Reproducibility requires more than a script. Record the question, exact inputs, applicability rule, runtime profile, environment, attempt status, outputs, provenance, and interpretation boundary. Infrastructure failure is not evidence of regex behavior. Repeated attempts are not independent replications unless relevant sources of dependence are controlled.

Research Intelligence may retain small supporting artifacts or links to certified evidence. Authoritative conformance observations remain in Regex Conformance's designated evidence system.

## AI-assisted work

AI tools may assist discovery, extraction, translation, comparison, or provisional synthesis. Generated reports are not evidence authorities. Verify every consequential claim against an appropriate source, verify that cited sources exist and say what is claimed, and disclose material AI origin in report metadata.

If an AI report is the only available input, classify it as provisional discovery material and do not elevate the inquiry to evidence-backed on that basis.

## Review quality

Ask whether the source is the right authority for the claim, whether version and scope are exact enough, whether the method supports the conclusion, whether counterexamples and conflicts are represented, whether inference and recommendation are separated from evidence, and which new event should trigger review.
