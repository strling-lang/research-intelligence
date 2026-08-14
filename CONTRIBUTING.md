# Contributing to STRling Research Intelligence

The organization-wide
[contribution principles](https://github.com/strling-lang/.github/blob/main/CONTRIBUTING.md)
apply alongside this repository-specific research guide.

## Start with scope and authority

Read the [mission and authority](docs/MISSION_AND_AUTHORITY.md),
[research method](docs/RESEARCH_METHOD.md),
[evidence standard](docs/EVIDENCE_STANDARD.md),
[documentation guide](docs/DOCUMENTATION_GUIDE.md), and
[negative-knowledge policy](docs/NEGATIVE_KNOWLEDGE.md).

Research Intelligence owns questions, methods, synthesis, uncertainty,
recommendations, and downstream-disposition records. It does not define STRling
semantics, compiler architecture, canonical regex knowledge, empirical
conformance observations, website behavior, or downstream acceptance.

## Evidence and claims

- Use the strongest source applicable to the exact claim. Prefer standards,
  official documentation, source and tests, original research, and reproducible
  evidence over unsourced summaries.
- Cite the source that actually supports a consequential claim. Record versions,
  profiles, dates, environments, methods, and exclusions when they affect
  applicability.
- Distinguish normative requirements, documented behavior, observations,
  published results, inference, recommendation, hypothesis, and speculation
  wherever readers could confuse them.
- Treat AI output as discovery or provisional synthesis, never as authority for
  its underlying claims.
- Preserve source conflicts, uncertainty, unsupported assumptions,
  counterexamples, failed hypotheses, anomalies, limitations, and evidence that
  could change a conclusion.
- Keep `unknown` distinct from evidence establishing `unsupported`.

## Inquiries, reports, and artifacts

Create inquiries from [`templates/inquiry-template.md`](templates/inquiry-template.md)
and keep their slugs question-centered and stable. An inquiry README is the
active synthesis; reports are bounded inputs and do not outrank their sources.

Small artifacts may support reproducibility, but production implementations,
canonical knowledge tables, conformance result stores, and engineering roadmaps
belong to their downstream owners. Link every inquiry, report, and artifact from
the appropriate index and containing inquiry.

## Supersession and downstream disposition

Do not silently rewrite a materially changed conclusion. Preserve the prior
reasoning, create or identify the successor, and link both directions. Routine
factual corrections may be made in place when they do not change the identity
of the conclusion.

A recommendation remains non-normative until the owning downstream authority
accepts or implements it. Record disposition only with a traceable decision,
specification change, issue, campaign record, or implementation commit; never
declare acceptance on another owner's behalf.

## Review checklist

Before proposing a change:

- verify citations, quotations, dates, and implementation claims;
- check scope, non-goals, authority, maturity, horizon, and review triggers;
- seek serious alternatives and disconfirming evidence;
- preserve negative knowledge and limitations;
- update navigation and historical-migration records when applicable;
- run the repository's link validation or otherwise verify local links; and
- inspect the complete diff for unrelated edits or imported sensitive material.

All participation follows the organization
[Code of Conduct](https://github.com/strling-lang/.github/blob/main/CODE_OF_CONDUCT.md).
Use the [security policy](https://github.com/strling-lang/.github/blob/main/SECURITY.md)
for private vulnerability reporting and the
[support guide](https://github.com/strling-lang/.github/blob/main/SUPPORT.md)
for cross-repository routing.
