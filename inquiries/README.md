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

## Fourth Edition and regex intelligence

| Inquiry | Horizon | Maturity | Focus |
| --- | --- | --- | --- |
| [Regex safety and complexity](regex-safety-and-complexity/README.md) | Fourth Edition | Exploratory | Complexity, runtime sensitivity, exploitability, and bounded safety claims. |
| [Regex analysis techniques](regex-analysis-techniques/README.md) | Fourth Edition | Exploratory | Derivative, graph, symbolic, empirical, and hybrid analysis methods. |
| [Embedded regex tooling](embedded-regex-tooling/README.md) | Fourth Edition | Exploratory | Host embedding, virtual projection, coordinates, and compiler-backed editor intelligence. |
| [Semantic validation and domain libraries](semantic-validation-and-domain-libraries/README.md) | Fourth Edition | Exploratory | Validation guarantees, domain helpers, provenance, registry, and distribution questions. |
| [Regex cognitive ergonomics](regex-cognitive-ergonomics/README.md) | Post-Fourth Edition | Exploratory | Measurable comprehension and maintenance costs. |
| [Developer adoption pathways](developer-adoption-pathways/README.md) | Post-Fourth Edition | Exploratory | Task-specific adoption, coexistence, migration, and trust. |

## Beyond Regex

Historical Beyond Regex research is retained in its original inquiries until the dedicated active syntheses and report moves are committed. The final hub links each successor inquiry directly.

## Expectations

Use [the inquiry template](../templates/inquiry-template.md) and follow [the documentation guide](../docs/DOCUMENTATION_GUIDE.md). Every substantive inquiry covers the research question, decision informed, current state, scope and non-goals, method, evidence quality, findings, uncertainty and negative knowledge, alternatives, implications, recommendations, rejected approaches, downstream disposition, and sources.

Imported reports are evidence inputs, not automatic authority. Historical language may remain inside a report when its containing inquiry makes that status clear.

[← Research Intelligence](../README.md)
