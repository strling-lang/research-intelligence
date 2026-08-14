# Agent navigation

## Repository ownership

This repository owns research questions, methods, synthesis, uncertainty,
negative knowledge, recommendations, provenance, supersession, and downstream
disposition. Research here is not automatically normative product authority.
`strling` owns language contracts and implementation; `regex-conformance` owns
controlled observations and evidence; `website` owns public presentation;
`.github` owns organization defaults.

## Authority and entrypoints

- Start with [README.md](README.md) and
  [docs/MISSION_AND_AUTHORITY.md](docs/MISSION_AND_AUTHORITY.md).
- Follow [docs/RESEARCH_METHOD.md](docs/RESEARCH_METHOD.md),
  [docs/EVIDENCE_STANDARD.md](docs/EVIDENCE_STANDARD.md), and
  [docs/NEGATIVE_KNOWLEDGE.md](docs/NEGATIVE_KNOWLEDGE.md).
- Use [docs/HORIZONS_AND_MATURITY.md](docs/HORIZONS_AND_MATURITY.md) for
  metadata and [docs/DOCUMENTATION_GUIDE.md](docs/DOCUMENTATION_GUIDE.md) for
  artifact roles.
- Read [inquiries/AGENTS.md](inquiries/AGENTS.md) before changing an inquiry or
  report.

Use the strongest authority applicable to each claim. Distinguish normative
requirements, documented behavior, controlled observations, published results,
inference, recommendation, hypothesis, and speculation. AI output may support
discovery, but it is not evidence authority. Preserve conflicts, limitations,
counterexamples, failed hypotheses, and unknowns; `unknown` is not the same as
evidence establishing `unsupported`.

## Validation and working safely

Use proportionate review:

```text
changed source, citation, metadata, and local-link inspection
→ inquiry-level evidence audit
→ supersession and downstream-disposition review
→ repository navigation and consistency review
```

This repository has no canonical executable validation command. Do not invent
one. Verify material citations against their controlling sources and verify
local links. A downstream architecture or implementation change may trigger
review, but it must not silently rewrite research history or imply acceptance.

Inspect branch, status, staged changes, and recent history before editing.
Preserve concurrent work, stage exact paths only, and never publish, merge,
reset, clean, or rewrite history without explicit authorization.

Copilot file scopes live in [.github/instructions](.github/instructions) and
reusable prompts in [.github/prompts](.github/prompts).
