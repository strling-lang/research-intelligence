# STRling Research Intelligence (RI)

### The strategic engine for knowledge-driven pattern discovery and language evolution.

## 1. Overview

Research Intelligence (RI) is the "Think Tank" of the STRling ecosystem. It is a dedicated environment where we "brain-storm" the next architectural requirements for the STRling language.

By utilizing **Inquiry-Based Versioning**, we ensure that every feature added to the STRling core is a direct response to a real-world research necessity.

## 2. The Strategic Loop

We drive the evolution of the **Universal Pattern Engine** through a recursive intelligence cycle:

1. **Inquire**: Specific questions regarding pattern representability are tracked as **Flat Focus Nodes** in `/inquiries/[focus-name]/`.
2. **Research**: High-level technical/academic reports are **co-located** within their respective focus nodes, directly adjacent to the `index.md` that synthesizes them.
3. **Prototype**: Theoretical pattern structures are validated in `/pattern-libraries`.
4. **Strategize**: Research conclusions are converted into Feature Proposals for the main `strling` repository.

**Key Principle:** Research reports and inquiry synthesis live together. This eliminates "Categorization Debt" and ensures that navigating to a focus node gives you complete context.

## 3. Repository Structure

Explore the centralized [Research Inquiry Hub](inquiries/index.md) for more details.

### 📂 /inquiries/[focus-name]/

**Purpose**: The atomic unit of research organization. Each folder is a **Flat Focus Node** containing both the inquiry synthesis and its co-located research reports.

**Structure**:

```
/inquiries/
├── real-time-redos/
│   ├── index.md                                    # Synthesizes the focus
│   ├── Regex Backtracking and ReDoS Vulnerabilities.md
│   └── STRling Linter Architecture_ Derivatives vs. Graph.md
├── goal-directed-search/
│   ├── index.md
│   ├── STRling Pattern Evolution Research.md
│   └── STRling Grammar Evolution Research.md
├── validity-taxonomy/
│   ├── index.md
│   ├── STRling Standard Library Specification.md
│   └── STRling Evolution - Registry & Structure.md
├── tooling-void/
│   ├── index.md
│   ├── STRling LSP Island Grammar Research.md
│   └── Regex Maintainability and Cognitive Cost.md
├── adoption-psychology/
│   ├── index.md
│   └── RegEx vs. STRling Developer Adoption.md
└── upe-roadmap/
    ├── index.md
    └── STRling as the Universal Pattern Engine (UPE).md
```

**Hybrid Tagging**: Each `index.md` contains metadata tags (e.g., `#safety`, `#ux`, `#ai`) for multi-domain categorization without hierarchical nesting.

### 📂 /pattern-libraries

**Purpose**: The experimental proving ground for complex data structures.
**Substructure**: Organized via **Recursive Abstraction Layers**.

- This is where the "Master Wielder" techniques are first drafted.
- It maps high-level research (from `/inquiries`) into concrete STRling code blocks to test for "Wieldability" and "Maintainability."

### 📂 /strategic-alignment

**Purpose**: The bridge between research and the project roadmap.
**Substructure**: Contains Feature Specifications and Roadmap Proposals.

- When an inquiry proves that a new language feature (e.g., fuzzy matching) is required for a domain, the formal proposal is drafted here before being moved to the core `strling` repository.

## 4. Identifying Gaps

The structure is designed to visualize where human knowledge is currently "unwieldable":

- **Intelligence Gaps**: Focus nodes in `/inquiries` without sufficient co-located research reports.
- **Representability Gaps**: Inquiries that have identified a pattern we cannot yet represent in `/pattern-libraries`.
- **Architectural Gaps**: Pattern-libraries that prove a concept but lack a corresponding feature in the **STRling Core**.

## 5. Hybrid Tagging System

Focus nodes use **metadata tags** for multi-domain categorization:

| Tag             | Domain                            | Example Focus                           |
| --------------- | --------------------------------- | --------------------------------------- |
| `#safety`       | Security & Reliability            | real-time-redos                         |
| `#logic`        | Pattern Theory & Formal Methods   | goal-directed-search, validity-taxonomy |
| `#ux`           | Developer Experience              | tooling-void, adoption-psychology       |
| `#ai`           | AI Integration & Interpretability | upe-roadmap, tooling-void               |
| `#architecture` | System Design                     | Most focus nodes                        |

Tags enable cross-cutting queries without hierarchical folder nesting.

## 6. Documentation Standards

_**To simplify research report standards, we use Gemini or ChatGPT Deep Research reports.**_

Reports are co-located with their synthesizing `index.md` in the relevant focus node.

## 7. Research Constraints

Unlimited potential! You can be as creative as you want in proposing new pattern structures. However, all proposals must be grounded in real-world research needs documented in `/inquiries/*.md` reports.
