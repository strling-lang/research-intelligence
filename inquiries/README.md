# Research inquiries

Research inquiries are durable investigations of consequential questions. They may concern architecture, semantics, correctness, compatibility, portability, evidence, conformance, safety, performance, validation, product design, human factors, adoption, standards, uncertainty, or future capabilities.

## Structure

```text
inquiries/<stable-slug>/
├── README.md
├── reports/      # optional
└── artifacts/    # optional
```

The structure is flat. Programs and metadata classify inquiries without duplicating reports or building category nesting. `artifacts/` is limited to small reproducible research support; production implementations belong to their downstream owner.

## Current inquiries

The repository's historical inquiries are being represented by active question-centered syntheses. Each current inquiry is listed here once its active README and report links are in place:

- Developer adoption and ergonomics: adoption barriers, cognitive cost, and embedded tooling.
- Regex and compiler intelligence: safety, analysis techniques, and semantic validation.
- Beyond Regex: goal-directed evaluation, grammar systems, non-text sequences, weighted patterns, AI assistance, neuro-symbolic systems, and the universal engine hypothesis.

Program READMEs provide cross-cutting navigation and future questions without creating empty inquiry directories.

## Expectations

Use [the inquiry template](../templates/inquiry-template.md) and follow [the documentation guide](../docs/DOCUMENTATION_GUIDE.md). Every substantive inquiry covers the research question, decision informed, current state, scope and non-goals, method, evidence quality, findings, uncertainty and negative knowledge, alternatives, implications, recommendations, rejected approaches, downstream disposition, and sources.

Imported reports are evidence inputs, not automatic authority. Historical language may remain inside a report when its metadata and inquiry framing make that status clear.

[← Research Intelligence](../README.md)
