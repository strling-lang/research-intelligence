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

| Inquiry | Horizon | Maturity | Focus |
| --- | --- | --- | --- |
| [Regex safety and complexity](regex-safety-and-complexity/README.md) | Fourth Edition | Exploratory | Complexity, runtime sensitivity, exploitability, and bounded safety claims. |
| [Regex analysis techniques](regex-analysis-techniques/README.md) | Fourth Edition | Exploratory | Derivative, graph, symbolic, empirical, and hybrid analysis methods. |
| [Embedded regex tooling](embedded-regex-tooling/README.md) | Fourth Edition | Exploratory | Host embedding, projection, coordinates, and compiler-backed editor intelligence. |
| [Semantic validation and domain libraries](semantic-validation-and-domain-libraries/README.md) | Fourth Edition | Exploratory | Validation guarantees, domain helpers, provenance, registry, and distribution. |
| [Regex cognitive ergonomics](regex-cognitive-ergonomics/README.md) | Post-Fourth Edition | Exploratory | Measurable comprehension and maintenance costs. |
| [Developer adoption pathways](developer-adoption-pathways/README.md) | Post-Fourth Edition | Exploratory | Task-specific adoption, coexistence, migration, and trust. |
| [AI-assisted pattern synthesis and verification](ai-assisted-pattern-synthesis-and-verification/README.md) | Post-Fourth Edition | Exploratory | Bounded AI assistance under deterministic verification authority. |
| [Goal-directed pattern evaluation](goal-directed-pattern-evaluation/README.md) | Beyond Regex | Exploratory | Resumable search, generators, state restoration, and first-class patterns. |
| [Recursive pattern and grammar systems](recursive-pattern-and-grammar-systems/README.md) | Beyond Regex | Exploratory | Recursive patterns, PEGs, tree captures, and grammar interoperability. |
| [Non-text sequence patterns](non-text-sequence-patterns/README.md) | Beyond Regex | Exploratory | Bits, bytes, structured sequences, biological alphabets, and symbolic numeric sequences. |
| [Weighted and approximate patterns](weighted-and-approximate-patterns/README.md) | Beyond Regex | Exploratory | Distance, weights, scoring, probability, and calibrated confidence. |
| [Neuro-symbolic pattern systems](neuro-symbolic-pattern-systems/README.md) | Beyond Regex | Exploratory | Whether broader neuro-symbolic models add value beyond tool orchestration. |
| [Universal Pattern Engine hypothesis](universal-pattern-engine-hypothesis/README.md) | Beyond Regex | Exploratory | Falsifiable long-range hypothesis, not a roadmap. |

## Expectations

Use [the inquiry template](../templates/inquiry-template.md) and follow [the documentation guide](../docs/DOCUMENTATION_GUIDE.md). Imported reports are evidence inputs, not automatic authority. Historical language may remain inside a report because every report now carries a visible provenance banner and its active inquiry identifies obsolete assumptions.

The [historical migration ledger](../docs/HISTORICAL_MIGRATION.md) records the disposition of every file present before this redesign.

[← Research Intelligence](../README.md)
