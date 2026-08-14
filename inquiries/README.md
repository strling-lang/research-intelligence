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
| [Canonical semantic compiler architecture](canonical-semantic-compiler-architecture/README.md) | Fourth Edition | Exploratory | Singular semantic authority across frontends, adapters, and tooling. |
| [Semantic IR and target lowering](semantic-ir-and-target-lowering/README.md) | Fourth Edition | Exploratory | Information placement, legalization, Target IR, and artifacts. |
| [Regex portability semantics](regex-portability-semantics/README.md) | Fourth Edition | Exploratory | Observable, profile-bound meaning of portability claims. |
| [Regex equivalence and rewrite verification](regex-equivalence-and-rewrite-verification/README.md) | Fourth Edition | Exploratory | Typed relations, containment, witnesses, bounded verification, and proof provenance. |
| [Regex safety and complexity](regex-safety-and-complexity/README.md) | Fourth Edition | Exploratory | Complexity, runtime sensitivity, exploitability, and bounded safety claims. |
| [Regex execution and target profiles](regex-execution-and-target-profiles/README.md) | Fourth Edition | Exploratory | Exact execution identity and compiler-facing target contracts. |
| [Regex validation testing methods](regex-validation-testing-methods/README.md) | Fourth Edition | Exploratory | Generators, oracles, properties, differential testing, and reduction. |
| [Regex operation and result semantics](regex-operation-and-result-semantics/README.md) | Fourth Edition | Exploratory | Operations, state, captures, spans, iteration, replacement, and outcomes. |
| [Unicode and text semantics](unicode-and-text-semantics/README.md) | Fourth Edition | Exploratory | Text domains, Unicode policies, boundaries, malformed input, and index units. |
| [Regex analysis techniques](regex-analysis-techniques/README.md) | Fourth Edition | Exploratory | Derivative, graph, symbolic, empirical, and hybrid analysis methods. |
| [Embedded regex tooling](embedded-regex-tooling/README.md) | Fourth Edition | Exploratory | Host embedding, projection, coordinates, and compiler-backed editor intelligence. |
| [Semantic validation and domain libraries](semantic-validation-and-domain-libraries/README.md) | Fourth Edition | Exploratory | Validation guarantees, domain helpers, provenance, registry, and distribution. |
| [Regex cognitive ergonomics](regex-cognitive-ergonomics/README.md) | Post-Fourth Edition | Exploratory | Measurable comprehension and maintenance costs. |
| [Developer adoption pathways](developer-adoption-pathways/README.md) | Post-Fourth Edition | Exploratory | Task-specific adoption, coexistence, migration, and trust. |
| [Evidence-aware regex explanation](evidence-aware-regex-explanation/README.md) | Fourth Edition | Exploratory | Why-match/no-match, evidence, uncertainty, witnesses, and remediation communication. |
| [Regex Conformance evidence methodology](regex-conformance-evidence-methodology/README.md) | Post-Fourth Edition | Exploratory | Provenance, attempts, reproducibility, replication, correction, and certification method. |
| [Regex Reference information architecture](regex-reference-information-architecture/README.md) | Post-Fourth Edition | Exploratory | Public organization and projection of authoritative regex knowledge. |
| [Regex Lab interaction model](regex-lab-interaction-model/README.md) | Post-Fourth Edition | Exploratory | Typed interactive capabilities, sessions, evidence boundaries, and execution trust. |
| [AI-assisted pattern synthesis and verification](ai-assisted-pattern-synthesis-and-verification/README.md) | Post-Fourth Edition | Exploratory | Bounded AI assistance under deterministic verification authority. |
| [Regex Knowledge–Conformance architecture](regex-knowledge-conformance-architecture/README.md) | Post-Fourth Edition | Exploratory | Authority-preserving linkage among claims, expectations, observations, and discrepancies. |
| [Goal-directed pattern evaluation](goal-directed-pattern-evaluation/README.md) | Beyond Regex | Exploratory | Resumable search, generators, state restoration, and first-class patterns. |
| [Recursive pattern and grammar systems](recursive-pattern-and-grammar-systems/README.md) | Beyond Regex | Exploratory | Recursive patterns, PEGs, tree captures, and grammar interoperability. |
| [Non-text sequence patterns](non-text-sequence-patterns/README.md) | Beyond Regex | Exploratory | Bits, bytes, structured sequences, biological alphabets, and symbolic numeric sequences. |
| [Weighted and approximate patterns](weighted-and-approximate-patterns/README.md) | Beyond Regex | Exploratory | Distance, weights, scoring, probability, and calibrated confidence. |
| [Neuro-symbolic pattern systems](neuro-symbolic-pattern-systems/README.md) | Beyond Regex | Exploratory | Whether broader neuro-symbolic models add value beyond tool orchestration. |
| [Symbolic attribute models for generalized pattern recognition](symbolic-attribute-models-for-generalized-pattern-recognition/README.md) | Beyond Regex | Exploratory | Observations, typed projections and claims, grouping, ambiguity, context, and provenance. |
| [Symbolic equivalence, confusability, and human-interpretable representation](symbolic-equivalence-confusability-and-human-interpretable-representation/README.md) | Beyond Regex | Exploratory | Identity, equivalence, confusability, transformation, span correspondence, and uncertain substitution. |
| [Phonetic, graphemic, and linguistic pattern domains](phonetic-graphemic-and-linguistic-pattern-domains/README.md) | Beyond Regex | Exploratory | Layered linguistic projections, profiles, alignments, and specialized provider boundaries. |
| [Relational pattern algebra for sequences and structured values](relational-pattern-algebra-for-sequences-and-structured-values/README.md) | Beyond Regex | Exploratory | Structure, relations, views, captures, weave, correspondence, and the boundary before general programming. |
| [Weighted symbolic similarity and evidence combination](weighted-symbolic-similarity-and-evidence-combination/README.md) | Beyond Regex | Exploratory | Typed evidence vectors, normalization, aggregation, weighting, thresholds, and calibration. |
| [Automatic discovery of symbolic patterns in data](automatic-discovery-of-symbolic-patterns-in-data/README.md) | Beyond Regex | Exploratory | Bounded hypothesis search, proposal portfolios, residual discovery, and independent verification. |
| [Meaningfulness, compression, recurrence, and false discovery](meaningfulness-compression-recurrence-and-false-discovery/README.md) | Beyond Regex | Exploratory | Compression, significance, prediction, stability, novelty, and claim boundaries for discovered patterns. |
| [Computational models and complexity limits of symbolic matching and discovery](computational-models-and-complexity-limits-of-symbolic-matching-and-discovery/README.md) | Beyond Regex | Exploratory | Computational classes, algorithm dispatch, tractability, budgets, and refusal boundaries. |
| [Symbolic pattern architecture synthesis](symbolic-pattern-architecture-synthesis/README.md) | Beyond Regex | Exploratory | Cross-report convergence, analogies, domain specialization, conflicts, and a bounded shared-framework hypothesis. |
| [Universal Pattern Engine hypothesis](universal-pattern-engine-hypothesis/README.md) | Beyond Regex | Superseded | Historical universal-engine hypothesis; superseded by the bounded architecture synthesis. |

## Expectations

Use [the inquiry template](../templates/inquiry-template.md) and follow [the documentation guide](../docs/DOCUMENTATION_GUIDE.md). Imported reports are evidence inputs, not automatic authority. Historical language may remain inside a report because every report now carries a visible provenance banner and its active inquiry identifies obsolete assumptions.

The [historical migration ledger](../docs/HISTORICAL_MIGRATION.md) records the disposition of every file present before this redesign.

[← Research Intelligence](../README.md)
