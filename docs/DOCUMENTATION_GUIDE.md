# STRling-RI Documentation Guide

## 1. Philosophical Foundation: Representability Abstraction

STRling-RI operates on the principle of **Representability Abstraction**. We document the "Patterns of the World" by decomposing complex research domains into increasingly **concretionary** (atomic) logic nodes.

We reject numerical indexing in favor of a **Fractal Hierarchy**. The filesystem itself reflects the structural complexity of the patterns we study, ensuring that our documentation remains as modular and maintainable as the STRling DSL.

---

## 2. Research Inquiries (`/inquiries`)

Inquiry nodes are the primary driver of project evolution. They use a **Focus-Based Inquiry** pattern to identify where existing technology fails to capture human knowledge.

### The Inquiry Node Pattern

Every folder in `/inquiries` represents a specific research focus and **must** contain an `index.md` based on the `inquiry-index-template.md`.

- **Breadcrumbs:** A link to the parent node for upward traversal (`[← Back to Inquiries](../index.md)`).
- **The "Why" (Remarks):** The technical or scientific justification for the inquiry.
- **Representability Gap:** A clear statement of the structural logic that current STRling or RegEx cannot elegantly describe.
- **Strategic Delta:** A list of proposed changes to the **STRling Core** (e.g., new DSL keywords or emitter logic).

---

## 3. Pattern Libraries (`/pattern-libraries`)

This directory serves as the "Operational Source of Truth" for complex pattern representation. It utilizes **Fractal Organization** to mirror the modularity of the STRling language.

- **Recursive Layers:** Folders represent pattern domains (e.g., `biology/genomics/markers`).
- **The Index Pattern:** Every folder must contain an `index.md` that synthesizes the patterns at that level. Every sub-pattern listed in the index **must** correspond to a sub-folder.
- **Wieldability Testing:** Every pattern library must include a `validation.strl` file to verify that the logic is parsable by the STRling Core.

---

## 4. Strategic Alignment (`/strategic-alignment`)

This is the bridge between **Research Intelligence** and the **STRling Roadmap**.

- **Formal Proposals:** Once an inquiry node identifies a critical need, a **Feature Specification** is drafted here.
- **Traceability:** Every proposal must link directly back to the `/inquiries` node that provided the empirical evidence for the change.

---

## 5. Identifying Gaps (Negative Knowledge)

The STRling-RI structure is designed to surface what we _cannot_ yet do:

1. **Representability Gaps:** An inquiry that identifies a pattern structure without a corresponding solution in `/pattern-libraries`.
2. **Architectural Gaps:** A proven pattern library that lacks a corresponding feature implementation in the **STRling Core**.
3. **Intelligence Gaps:** A core language feature (e.g., Lookarounds) that lacks deep research into its optimal multi-modal application.

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
Generate an index.md for the {focus_name} inquiry. Summarize the findings of the research files and include hyperlinks to the exact data locations using '[name_of_section](file_name.md#anchor)' syntax to scaffold the `index.md` in accordance with the `inquiry-index-template.md`.
```
