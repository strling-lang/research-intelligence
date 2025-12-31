# STRling Inquiry: The Validation Taxonomy & Semantic Registry

**Tags:** `#logic` `#ux` `#architecture`  
**Status:** 🟠 IN-PROGRESS

---

[← Back to Inquiries](../index.md)

---

## Description

> **The Representability Gap:** The concept of "Valid" is treated as a binary boolean in traditional regex validation. A pattern can match the _syntax_ of an email (`user@domain.com`) but fail the _semantics_ (domain lacks MX records) or _existence_ (mailbox doesn't exist). Current regex-based validation conflates these distinct layers, leading to brittle systems. Furthermore, validation logic is fragmented across ad-hoc patterns copied from Stack Overflow, lacking a centralized authority for distributing verified patterns.

**Heuristic Boundaries:** This inquiry focuses on architecting the STRling Standard Library's validation framework and the global pattern registry. It addresses the stratification of validity into discrete, composable layers and the distribution of semantic patterns as managed dependencies.

---

## Table of Contents

- [1. Objective & Hypothesis](#1-objective--hypothesis)
- [2. Co-located Research Reports](#2-co-located-research-reports)
- [3. Pattern Synthesis](#3-pattern-synthesis)
- [4. Architectural Recommendations](#4-architectural-recommendations)

---

## 1. Objective & Hypothesis

### Primary Inquiry

1. How should the STRling Standard Library structure its validators to accurately represent the **spectrum of validity**—from syntactic conformance to semantic correctness to existential verification?
2. How can STRling become the **Source of Truth** for validation patterns through a global, versioned registry?

### Hypothesis

We hypothesize that:

1. Validity should be modeled as a **Taxonomy of Three Layers** (Syntactic, Semantic, Existential), each with increasing computational cost
2. A **decentralized, package-manager-native registry** leveraging NPM/PyPI can distribute "Validator Packages" as managed dependencies
3. **Falsehood-aware contracts** with strictness tiers (Lax, Standard, Strict) provide deterministic mappings to external formats like JSON Schema

**Optimal State:** A developer writes `s.email(mode='strict', verify=true)` and receives graduated validation with clear documentation of what each layer guarantees.

---

## 2. Co-located Research Reports

This inquiry synthesizes findings from the following research dossiers:

| Report                                                                                             | Focus                     | Key Contribution                                                                          |
| -------------------------------------------------------------------------------------------------- | ------------------------- | ----------------------------------------------------------------------------------------- |
| [STRling Standard Library Specification](STRling%20Standard%20Library%20Specification.md)          | Validation Framework      | Falsehoods Audit; Validation Taxonomy (Syntactic/Semantic/Existential); Mode parameters   |
| [STRling Evolution: Registry & Structure](STRling%20Evolution%20-%20Registry%20%26%20Structure.md) | Distribution Architecture | Rosie Pattern Language analysis; Validator Package format; Structural matching extensions |

---

## 3. Pattern Synthesis

### Key Observations

**The Validity Spectrum:**

| Layer           | Definition                      | Example                             | Domain       |
| --------------- | ------------------------------- | ----------------------------------- | ------------ |
| **Syntactic**   | Does it conform to the grammar? | `a@b.c` matches email pattern       | Pure Regex   |
| **Semantic**    | Is it logically coherent?       | `2023-02-30` fails (no Feb 30th)    | Computation  |
| **Existential** | Does it exist in reality?       | `user@ghost.invalid` (no MX record) | External I/O |

**The Falsehoods Audit—Email Example:**

| Falsehood                            | Reality                           | Implication               |
| ------------------------------------ | --------------------------------- | ------------------------- | ------------------------------------- |
| "Only letters, numbers, punctuation" | RFC allows `!#$%&'\*+/=?^\_{      | }~-`                      | Strict mode must accept special chars |
| "Exactly one @ symbol"               | Local part may contain quoted `@` | Split on _last_ `@`       |
| "Domain must have a dot"             | `admin@localhost` is valid        | Intranet-aware validation |

**The Mode Taxonomy:**

| Level | Mode Name  | Description                 | Use Case                              |
| ----- | ---------- | --------------------------- | ------------------------------------- |
| **1** | Strict     | RFC Compliance              | Interoperability, compliance gateways |
| **2** | Lax        | User-Centric (HTML5/WHATWG) | User-facing forms, web applications   |
| **3** | Structural | Noise Filter                | Log scanning, preliminary filtering   |

**The Registry Architecture:**

STRling will distribute patterns via existing package ecosystems (NPM, PyPI) with:

- **Source Patterns (.strl)**: Normative DSL definitions
- **Compiled Artifacts (.json)**: Pre-compiled for target engines
- **Manifest (strling.yaml)**: Version, dependencies, strictness contracts

### Representability Gap

Current regex libraries lack:

- Graduated validation modes
- Centralized, versioned pattern distribution
- Semantic layer integration (Luhn, date math)

---

## 4. Architectural Recommendations

### Proposed Language Evolution

1. **Three-Tier Validation API**: `s.email(mode='lax')`, `s.uuid(mode='strict')`
2. **Verify Blocks**: `verify { ... }` DSL construct for semantic checks
3. **Registry CLI**: `strling install @strling/iso-standards`
4. **Import Directive**: `import @strling/net as net`

### Justification

This architecture resolves the tension between "correctness" and "usability" by:

- Defaulting to Pragmatic mode (user-centric)
- Providing strict mode for compliance requirements
- Distributing verified patterns as managed dependencies

### Complexity Reduction Model

$$\text{False Rejection Rate: } \frac{1}{N_{\text{falsehoods}}} \rightarrow 0$$

By auditing falsehoods and providing graduated modes, STRling minimizes both false positives and false negatives.

---

**Status:** 🟠 IN-PROGRESS

**Related Focus Nodes:** [real-time-redos](../real-time-redos/index.md), [adoption-psychology](../adoption-psychology/index.md)

**Main Repo Impact:** Standard Library Implementation / Registry Infrastructure / New DSL Constructs
