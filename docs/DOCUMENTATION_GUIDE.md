# STRling-RI Documentation Guide

## 1. Philosophical Foundation: Representability Abstraction

STRling-RI operates on the principle of **Representability Abstraction**. We document the "Patterns of the World" by decomposing complex research domains into increasingly **concretionary** (atomic) logic nodes.

We reject numerical indexing in favor of a **Fractal Hierarchy**. The filesystem itself reflects the structural complexity of the patterns we study, ensuring that our documentation remains as modular and maintainable as the STRling DSL.

---

## 2. Research Inquiries (`/inquiries/[focus-name]/`)

Inquiry nodes are the primary driver of project evolution. They use a **Flat Focus Node** pattern where research reports are **co-located** with their synthesizing `index.md`.

### The Flat Focus Node Architecture

Every folder directly under `/inquiries/` represents a specific research focus and **must** contain:

1. An `index.md` based on the `inquiry-index-template.md`
2. All research reports that inform the inquiry (co-located, not in a separate `/reports/` directory)

**Key Principle:** No hierarchical nesting. Use **Metadata Tags** for multi-domain categorization.

### The Index Pattern

- **Breadcrumbs:** A link to the repository root (`[← Back to Inquiries](../README.md)`).
- **Tags:** Metadata tags at the top of the file (e.g., `#safety`, `#logic`, `#ux`, `#ai`, `#architecture`).
- **Co-located Reports Table:** A table listing all research reports in the folder with their focus and key contribution.
- **The "Why" (Remarks):** The technical or scientific justification for the inquiry.
- **Representability Gap:** A clear statement of the structural logic that current STRling or RegEx cannot elegantly describe.
- **Strategic Delta:** A list of proposed changes to the **STRling Core** (e.g., new DSL keywords or emitter logic).

---

## 2.1 Tagging Standards

Focus nodes use **hybrid metadata tags** to enable cross-cutting queries without folder nesting.

### Standard Domain Tags

| Tag             | Domain                            | Description                                                   |
| --------------- | --------------------------------- | ------------------------------------------------------------- |
| `#safety`       | Security & Reliability            | ReDoS detection, input sanitization, vulnerability prevention |
| `#logic`        | Pattern Theory & Formal Methods   | Automata theory, grammar construction, formal specifications  |
| `#ux`           | Developer Experience              | IDE integration, cognitive cost reduction, adoption barriers  |
| `#ai`           | AI Integration & Interpretability | Symbolic bridging, neural pattern auditing, hybrid logic      |
| `#architecture` | System Design                     | Compiler passes, IR extensions, module specifications         |

### Usage Guidelines

1. **Header Placement:** Tags appear immediately after the title in the `index.md`
2. **Format:** Backtick-wrapped tags separated by spaces: `` `#safety` `#logic` ``
3. **Multiple Tags:** A focus node can have multiple tags (most have 2-3)
4. **No Hierarchies:** Tags are flat; do not create sub-tags like `#safety/redos`

---

## 3. Pattern Libraries (`/pattern-libraries`)

This directory serves as the "Operational Source of Truth" for complex pattern representation. It utilizes **Fractal Organization** to mirror the modularity of the STRling language.

- **Recursive Layers:** Folders represent pattern domains (e.g., `biology/genomics/markers`).
- **The Index Pattern:** Every folder must contain an `index.md` that synthesizes the patterns at that level. Every sub-pattern listed in the index **must** correspond to a sub-folder.
- **Wieldability Testing:** Every pattern library must include a `validation.strl` file to verify that the logic is parsable by the STRling Core.
- **Source Reference:** Pattern libraries should reference the `/inquiries/[focus-name]/` node that provided the research foundation.

---

## 4. Strategic Alignment (`/strategic-alignment`)

This is the bridge between **Research Intelligence** and the **STRling Roadmap**.

- **Formal Proposals:** Once an inquiry node identifies a critical need, a **Feature Specification** is drafted here.
- **Traceability:** Every proposal must link directly back to the `/inquiries/[focus-name]/` node that provided the empirical evidence for the change.

---

## 5. Identifying Gaps (Negative Knowledge)

The STRling-RI structure is designed to surface what we _cannot_ yet do:

1. **Intelligence Gaps:** A focus node in `/inquiries/` that lacks sufficient co-located research reports.
2. **Representability Gaps:** An inquiry that identifies a pattern structure without a corresponding solution in `/pattern-libraries`.
3. **Architectural Gaps:** A proven pattern library that lacks a corresponding feature implementation in the **STRling Core**.

---

## 6. Syntax & Technical Standards

- **Junior First Voice:** Write for smart developers who are new to pattern theory. Define academic terms (e.g., "Stochastic Pattern," "Unification") upon first use.
- **Visual Logic:** Use Mermaid.js to illustrate state machines or AST transitions.
- **Mathematical Formalism:** Use LaTeX for metrics regarding pattern efficiency or complexity reduction:

---

## 7. The Evolutionary Cycle (No Archive)

We utilize Git version history as the temporal record of our research. **Do not create "Archive" or "Legacy" folders.**

- If a pattern logic is refined, overwrite the current documentation.
- If a research focus is concluded, mark the `index.md` as `🟢 CONCLUDED` but leave the folder in its natural place in the hierarchy to maintain context.

---

## 8. Gemini Deep Report Formatting (Anchor Integrity)

Deep Research exports often insert horizontal rules (`---`) that break hyperlink anchors. After importing a report, run the following regex replacement to collapse these dividers and keep headings anchorable:
`(?<=##)\s---\n\n(?!#)` → `' '` (a single space).

---

## 9. Copilot Prompt for Inquiry Synthesis

When a research focus generates actionable intelligence, use the following prompt to scaffold the `index.md` in accordance with the `inquiry-index-template.md`:

```
Generate an index.md for the {focus_name} inquiry. The focus node is located at /inquiries/{focus-name}/.
Include:
1. Hybrid tags at the top (e.g., `#safety` `#logic`)
2. A table of co-located research reports with hyperlinks using '[Report Name](Report%20File.md)' syntax
3. Synthesized findings from all co-located reports
4. Architectural recommendations for the STRling Core
```
