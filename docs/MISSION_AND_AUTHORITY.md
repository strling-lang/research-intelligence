# Mission and authority

## Mission

STRling Research Intelligence is the research synthesis and strategic reasoning layer of the STRling ecosystem. It investigates consequential unanswered technical and product questions; synthesizes standards, official documentation, implementation evidence, academic research, empirical evidence, and existing STRling context; compares competing approaches; preserves uncertainty and failed reasoning; and produces research-backed recommendations.

Research Intelligence may explore possible futures without committing STRling to them.

## Governing principle

> Research can recommend. Authority remains with the downstream repository, specification, evidence system, or product owner that accepts, rejects, or implements the recommendation.

A conclusion published here is non-normative. It does not by itself change architecture, specifications, implementation, product commitments, release status, or roadmap.

## What Research Intelligence owns

This repository owns its research questions, methods, syntheses, comparisons, uncertainty, recommendations, report provenance, program and inquiry organization, negative knowledge, supersession history, and records of downstream disposition. It does not gain authority over a subject merely by researching it.

## Responsibility boundaries

### STRling implementation and specification

[`strling-lang/strling`](https://github.com/strling-lang/strling) is the product repository. Its authority hierarchy, specifications, ratified architecture, active campaign, implementation, tests, and compatibility evidence govern STRling behavior and current implementation status. Research Intelligence may analyze or recommend changes; it does not define compiler semantics, target support, APIs, or release readiness.

Fourth Edition 4.0.3 ships a canonical Rust compiler path with scoped, versioned contracts for its authoring frontends and serialized data. The [decision evidence register](DECISION_EVIDENCE_2026-11-20.md) distinguishes the published product from the unratified broad semantic draft and pins the contracts used by current research.

### Researched regex semantics and legacy knowledge work

Regex Conformance owns the [canonical researched taxonomy and source-claim bindings](https://github.com/strling-lang/regex-conformance/blob/3285cc9fa8310df0af00fa50724d65531e0695d9/README.md#authority-boundaries). External standards and official specifications govern their own normative claims. The [legacy STRling Regex Knowledge Program](https://app.notion.com/p/3ba7d940647581a9b60dd76f67e5230e?pvs=204) remains historical context for research proposals. Its current workspace remit was not verified. The separate Conformance program hub coordinates program work under its own governance.

### Regex Conformance

[`strling-lang/regex-conformance`](https://github.com/strling-lang/regex-conformance) governs the scientific pipeline for exact controlled regex-system behavior. It separates profiles, applicability, executions and attempts, observations, infrastructure failure, provenance, adjudication, certification, and immutable checkpoint publication. Research Intelligence studies methods and implications. The [current-state ledger](CURRENT_STATE_2026-11-20.md) distinguishes acceptance of the machinery from full-data evidence coverage.

### Website and product surfaces

[`strling-lang/website`](https://github.com/strling-lang/website) owns the public organization, product, documentation, and interactive-tool surface. Research Intelligence may investigate information architecture and experiences such as Regex Reference or Regex Lab. It neither implements those products nor promises that researched concepts currently exist.

### Experimental prototypes

Small reproducible artifacts may test a research hypothesis here. They are evidence aids, not production implementations, reference architectures, supported APIs, or prototypes with implied adoption. Production work belongs in its owning repository.

### Engineering roadmaps

Research programs are areas of investigation, not roadmap stages. Inquiries may inform engineering decisions, but implementation sequencing, commitments, and tracking belong to the downstream owner. Research Intelligence does not maintain a shadow roadmap.

## Authority test

Before making a claim, ask what kind of claim it is and which system controls it. Use the compiler repository for STRling semantics and product status, the Conformance semantic corpus for researched regex knowledge, exact certified observations and adjudicated findings for empirical claims, original publications for their scoped scientific results, and the website repository for public surface contracts. Research Intelligence synthesizes and tests hypotheses across those sources.
