# Research Intelligence documentation guide

This guide explains how to create and maintain Research Intelligence artifacts. The governing authority and method are defined in [Mission and Authority](MISSION_AND_AUTHORITY.md), [Research Method](RESEARCH_METHOD.md), [Evidence Standard](EVIDENCE_STANDARD.md), [Horizons and Maturity](HORIZONS_AND_MATURITY.md), and [Negative Knowledge](NEGATIVE_KNOWLEDGE.md).

## Artifact roles

- A **program** is a stable area of investigation. Its README maps questions, boundaries, existing inquiries, and future work. It is not a roadmap stage.
- An **inquiry** is the durable synthesis for one consequential question. Its `README.md` is the active interpretation of the evidence.
- A **research report** is a bounded input to an inquiry. A report may be imported, historical, superseded, or provisional; it does not outrank its sources or the inquiry synthesis.
- A **research artifact** is a small reproducible file directly supporting an inquiry, such as a probe, fixture, analysis script, or compact result. Production code belongs in its owning repository.
- A **recommendation** is non-normative until a downstream authority accepts or implements it.

## Creating an inquiry

Create `inquiries/<stable-slug>/README.md` from [the inquiry template](../templates/inquiry-template.md). Keep inquiries flat: programs and metadata provide classification, so do not add category directories below `inquiries/`.

Use `reports/` only when the inquiry has supporting reports. Use `artifacts/` only for small, directly reproducible research material. Do not create empty inquiry directories for future questions; list those questions in the relevant program README instead.

Choose a slug that describes the question rather than a proposed solution, implementation, campaign, or temporary status. A material change of question usually merits a new inquiry with explicit supersession rather than silently changing the old inquiry's meaning.

## Framing the research question

A useful research question is consequential, answerable enough to investigate, and explicit about the decision it could inform. Questions may concern architecture, semantics, correctness, compatibility, portability, evidence, conformance, safety, performance, validation, product design, human factors, adoption, standards, uncertainty, or future capabilities.

State the question, why it matters, current state, scope, and non-goals. A representability gap is one possible subject, not a required framing.

## Method

Select methods that fit the claim. Examples include standards analysis, source and test inspection, literature review, controlled experiment, differential or metamorphic testing, prototype evaluation, usability study, interview, survey, comparative analysis, threat modeling, or formal reasoning.

Record enough detail for another researcher to understand selection criteria, versions, environments, exclusions, and analytical steps. Separate what the method can establish from what it cannot.

## Source discovery and evidence quality

Begin with the strongest applicable sources, not the easiest summary. Search standards bodies, official documentation, release notes, source repositories, test suites, original research, and reproducible evidence systems. Use secondary sources and AI tools to discover terminology, sources, and counterarguments, then verify consequential claims against the appropriate authority.

Evidence precedence is claim-specific. Follow [the evidence standard](EVIDENCE_STANDARD.md); do not collapse documented behavior, observed execution, published scientific results, and STRling implementation status into one generic notion of “proof.”

## Citations

Cite the source that actually supports the claim, preferably at the point of use. Include stable titles, authors or organizations, publication or release dates when available, exact versions or profiles when material, and durable links. For source code, tests, and repository evidence, identify the repository, path, and commit or tag when stability matters.

Do not cite an AI-generated report as authority for its underlying claims. Cite the primary or otherwise controlling source found through it. If only provisional discovery material exists, say so.

Imported reports should start with the fields in [research report metadata](../templates/research-report-metadata.md). Metadata describes provenance and review state; it does not certify the report.

## Epistemic categories

Use these labels when they materially improve clarity:

- **Normative** — required or defined by a controlling standard, specification, or authority within its scope.
- **Observed** — recorded by a stated empirical method in a stated environment.
- **Published result** — a result reported by an identifiable publication and bounded by that work.
- **Inference** — reasoning from cited facts.
- **Recommendation** — a proposed course of action.
- **Hypothesis** — a testable explanation or prediction not yet established.
- **Speculation** — a possibility with limited supporting evidence.

Do not label every sentence. Make category transitions visible where a reader might otherwise mistake one kind of claim for another.

## AI-assisted research

AI may help discover sources, generate search terms, compare drafts, extract candidate claims, or produce provisional synthesis. Record material AI involvement in report metadata when it affects provenance.

AI output is not authoritative evidence. Verify citations, quotations, technical claims, dates, and implementation statements independently. Preserve prompts or generated output only when it is necessary to understand a report's origin; do not treat fluency as source quality.

## Uncertainty and negative knowledge

Every substantive inquiry must report limits and uncertainty. Preserve unknowns, source conflicts, unsupported assumptions, counterexamples, failed hypotheses, abandoned approaches, empirical anomalies, and evidence that could change the conclusion. Follow [Negative Knowledge](NEGATIVE_KNOWLEDGE.md).

`Unknown` means the evidence does not establish the answer. `Unsupported` means evidence establishes that a capability or proposition does not hold in the stated scope. They are not interchangeable.

## Programs, horizons, and maturity

Assign one or more programs in inquiry frontmatter. Link the inquiry from each assigned program README, and link back to those programs from the inquiry. Programs organize investigation; they do not commit STRling to a roadmap.

Choose exactly one horizon based on relevance: **Fourth Edition**, **Post-Fourth Edition**, or **Beyond Regex**. Reassess it when the active architecture or evidence changes.

Choose the honest epistemic state: **Exploratory**, **Evidence-backed**, **Recommendation-ready**, **Resolved**, or **Superseded**. Historical imported reports do not make an inquiry evidence-backed unless their sources and claims have been reviewed under the current standard.

Record downstream disposition separately: none, accepted, partially accepted, rejected, implemented, or superseded downstream. A recommendation-ready inquiry with no disposition is valid; a downstream implementation does not retroactively strengthen weak evidence.

## Supersession and downstream disposition

When a materially important conclusion changes, create or identify the successor, set `superseded-by` on the old inquiry, set `supersedes` on the new inquiry, and add a visible explanation. Do not erase the old reasoning. Correct broken facts in place only when the change does not alter the conclusion's identity or historical meaning.

Historical reports may retain obsolete language when their metadata and containing inquiry make their status unmistakable. Active synthesis must use current terminology and authority boundaries.

Recommendations reach their owning downstream project through that project's decision process. Link to the accepted specification change, issue, decision record, campaign task, implementation commit, or product decision when one exists. Research Intelligence records the disposition but does not declare acceptance on behalf of another owner.

## Optional artifacts and navigation

Artifacts must be small, reproducible, directly support the inquiry, and be linked from its README. Do not place production implementations, canonical knowledge tables, or conformance result stores here.

- Link every inquiry from [the inquiry hub](../inquiries/README.md).
- Link every inquiry from each program named in its frontmatter.
- Link every report and artifact from its inquiry README.
- Prefer relative repository links and percent-encode spaces in Markdown destinations.
- Update filesystem diagrams when paths change.
- Run the repository link check before committing and manually inspect external authority links.
- Keep every active file reachable from the root README, a framework document, a program, an inquiry, or a template index.
