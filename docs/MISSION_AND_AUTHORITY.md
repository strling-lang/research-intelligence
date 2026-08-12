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

The active Fourth Edition direction has multiple authoring frontends converging on canonical semantics through a Rust semantic compiler path. The product repository distinguishes the normative specification from its Rust reference implementation. Exact implemented-versus-planned status must be taken from that repository and its current campaign, not frozen into a research conclusion.

### Regex Knowledge

The [STRling Regex Knowledge Program](https://app.notion.com/p/3ba7d940647581a9b60dd76f67e5230e?pvs=204) owns the operational researched-knowledge model for the regex ecosystem: canonical concepts and ontology, engines and dialects, versioned profiles, capabilities, APIs, Unicode, replacement behavior, normative primary-source evidence, relations, and explicit gaps. Research Intelligence may study the architecture and implications of that knowledge. It must not create a competing knowledge database or copy its records as an alternative authority.

### Regex Conformance

[`strling-lang/regex-conformance`](https://github.com/strling-lang/regex-conformance) is the empirical foundation for exact controlled regex-system behavior. It separates profiles, probes, applicability, logical executions, physical attempts, observations, infrastructure failure, provenance, derived findings, reproducibility, and certification. Research Intelligence may study experimental method and implications. It must not publish a competing conformance result store or call literature review an execution observation.

### Website and product surfaces

[`strling-lang/website`](https://github.com/strling-lang/website) owns the public organization, product, documentation, and interactive-tool surface. Research Intelligence may investigate information architecture and experiences such as Regex Reference or Regex Lab. It neither implements those products nor promises that researched concepts currently exist.

### Experimental prototypes

Small reproducible artifacts may test a research hypothesis here. They are evidence aids, not production implementations, reference architectures, supported APIs, or prototypes with implied adoption. Production work belongs in its owning repository.

### Engineering roadmaps

Research programs are areas of investigation, not roadmap stages. Inquiries may inform engineering decisions, but implementation sequencing, commitments, and tracking belong to the downstream owner. Research Intelligence does not maintain a shadow roadmap.

## Authority test

Before making a claim, ask what kind of claim it is and which system controls it. Use the product repository for current STRling status, Regex Knowledge for canonical researched knowledge, Regex Conformance for certified observations, original publications for their scientific results, and public product repositories for what is actually shipped. Use Research Intelligence for synthesis, inference, hypotheses, and recommendations across those sources.
