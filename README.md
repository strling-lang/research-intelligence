# STRling Research Intelligence

STRling Research Intelligence is the research synthesis and strategic reasoning layer of the STRling ecosystem. It investigates consequential unanswered questions, compares evidence and alternatives, preserves uncertainty and failed hypotheses, and produces non-normative recommendations.

> Research can recommend. Authority remains with the downstream repository, specification, evidence system, or product owner that accepts, rejects, or implements the recommendation.

## Mission

Research Intelligence connects standards, official documentation, implementation evidence, academic research, controlled observations, product context, and prior STRling work. It is designed for durable reasoning: not only conclusions, but also source conflicts, limits, counterexamples, abandoned approaches, and review triggers remain visible.

Read [Mission and Authority](docs/MISSION_AND_AUTHORITY.md) for the governing boundary.

## What Research Intelligence owns

- research questions and methods;
- synthesis across applicable evidence classes;
- comparisons, inferences, hypotheses, and recommendations;
- inquiry and report provenance;
- uncertainty, negative knowledge, and supersession; and
- traceable records of downstream disposition.

## What it does not own

This repository does not define STRling semantics or architecture, implement the compiler or public products, maintain a shadow engineering roadmap, duplicate canonical regex knowledge, or publish a competing conformance evidence store. A prototype here is only a small research artifact. A recommendation here is not an accepted product commitment.

## Ecosystem responsibility map

| System | Primary responsibility | Relationship to Research Intelligence |
| --- | --- | --- |
| [`strling-lang/strling`](https://github.com/strling-lang/strling) | Product repository: specification, architecture, implementation, campaign, tests, adapters, and tooling | Governs current STRling status and accepts or rejects implementation-facing recommendations. |
| [STRling Regex Knowledge Program](https://app.notion.com/p/3ba7d940647581a9b60dd76f67e5230e?pvs=204) | Canonical researched regex concepts, profiles, capabilities, relations, normative evidence, and gaps | Supplies knowledge context; is not duplicated here. |
| [`strling-lang/regex-conformance`](https://github.com/strling-lang/regex-conformance) | Reproducible controlled executions, observations, provenance, findings, and certification | Supplies empirical evidence; Research Intelligence may study method and implications. |
| [`strling-lang/website`](https://github.com/strling-lang/website) | Public organization, product, documentation, and interactive-tool surface | Owns implementation and publication of researched public experiences. |
| `strling-lang/.github` | Organization-level orientation and genuinely shared canonical material | Outside this repository's scope. |

## Research programs

[Programs](programs/README.md) are stable areas of investigation, not roadmap stages:

- [Fourth Edition Architecture](programs/fourth-edition-architecture/README.md)
- [Regex Knowledge Architecture](programs/regex-knowledge-architecture/README.md)
- [Regex Conformance Science](programs/regex-conformance-science/README.md)
- [Portability & Compatibility](programs/portability-compatibility/README.md)
- [Regex Analysis & Explanation](programs/regex-analysis-explanation/README.md)
- [Regex Reference](programs/regex-reference/README.md)
- [Regex Lab](programs/regex-lab/README.md)
- [Adoption & Ergonomics](programs/adoption-ergonomics/README.md)
- [Beyond Regex](programs/beyond-regex/README.md)

## Research inquiries

[Inquiries](inquiries/README.md) are durable investigations of specific questions. Each inquiry has a stable flat slug, lightweight metadata, active synthesis, links to supporting reports, negative knowledge, and downstream disposition. Reports are inputs; the inquiry README is the current synthesis.

## Horizons and maturity

Horizons are metadata: **Fourth Edition**, **Post-Fourth Edition**, or **Beyond Regex**. Maturity is separately epistemic: **Exploratory**, **Evidence-backed**, **Recommendation-ready**, **Resolved**, or **Superseded**. Neither implies engineering schedule or adoption. See [Horizons and Maturity](docs/HORIZONS_AND_MATURITY.md).

## Evidence

Evidence authority depends on the claim. Specifications govern normative claims; certified controlled observations govern what exact executions observed; the active STRling repository governs current implementation status; original papers govern their published scientific results. AI may assist discovery, but generated reports are not evidence authorities. See [Evidence Standard](docs/EVIDENCE_STANDARD.md).

## Negative knowledge

Unknowns, conflicts, unsupported assumptions, counterexamples, failed hypotheses, anomalies, limitations, and evidence that could change a conclusion are first-class research output.

> Unknown is not unsupported.

See [Negative Knowledge](docs/NEGATIVE_KNOWLEDGE.md).

## Repository structure

```text
research-intelligence/
├── README.md
├── docs/                 # Mission, method, evidence, maturity, and authoring guidance
├── programs/             # Stable areas of investigation
│   └── <program>/README.md
├── inquiries/            # Flat, question-centered research
│   ├── README.md
│   └── <stable-slug>/
│       ├── README.md      # Active synthesis
│       ├── reports/       # Optional research inputs
│       └── artifacts/     # Optional small reproducible support
└── templates/            # Inquiry and report metadata templates
```

Optional directories appear only when they contain material. Production code, canonical knowledge databases, conformance observations, and roadmaps belong to their owners.

## How recommendations reach downstream projects

An inquiry identifies the owning downstream authority and makes a scoped recommendation. The owner evaluates it through its own decision process. Research Intelligence then records none, accepted, partially accepted, rejected, implemented, or superseded downstream, linked to the actual decision or implementation. Publication here never substitutes for that decision.

## Research framework

- [Research Method](docs/RESEARCH_METHOD.md)
- [Documentation Guide](docs/DOCUMENTATION_GUIDE.md)
- [Inquiry template](templates/inquiry-template.md)
- [Research report metadata](templates/research-report-metadata.md)

## Historical redesign note

The repository originally organized every topic as a representability-focused node intended to feed a Universal Pattern Engine roadmap. That material remains accessible as historical research input, but its terminology and proposed architectures no longer carry active authority. Current inquiry READMEs identify obsolete assumptions and the focused revalidation still required.
