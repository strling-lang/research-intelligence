# STRling Inquiry: Real-Time ReDoS Detection

**Tags:** `#safety` `#logic` `#architecture`  
**Status:** 🟠 IN-PROGRESS

---

[← Back to Inquiries](../README.md)

---

## Description

> **The Representability Gap:** Current regex engines (NFA-based backtracking) cannot intrinsically "know" if they are safe without runtime execution. Traditional static analysis methods—building full Nondeterministic Finite Automata (NFAs) and inspecting graph topology—impose computational overhead (latency >100ms) that violates the real-time feedback requirements of modern IDE environments (LSP). The developer cannot receive safety guarantees at the speed of thought.

**Heuristic Boundaries:** This inquiry focuses exclusively on the static detection of exponential ambiguity in regular expressions at compile time. It does not address runtime mitigations (timeouts, sandboxing) or semantic validation concerns. The scope is limited to patterns that can be statically analyzed without execution.

---

## Table of Contents

- [1. Objective & Hypothesis](#1-objective--hypothesis)
- [2. Co-located Research Reports](#2-co-located-research-reports)
- [3. Pattern Synthesis](#3-pattern-synthesis)
- [4. Architectural Recommendations](#4-architectural-recommendations)

---

## 1. Objective & Hypothesis

### Primary Inquiry

How can the STRling compiler mathematically prove pattern safety (linear time complexity) or detect vulnerability (exponential ambiguity) **at compile time** without the prohibitive cost of full NFA construction—all within a latency budget suitable for "calculation-on-keypress" IDE feedback?

### Hypothesis

We hypothesize that **Brzozowski Derivatives** (specifically, their modern Symbolic extensions) can replace graph-based static analysis for ReDoS detection. By shifting from graph topology inspection to algebraic exploration, we can:

1. Achieve sub-100ms analysis times suitable for real-time LSP integration
2. Operate directly on STRling's Intermediate Representation (preserving semantic context)
3. Provide educational, context-aware error messages that reference the user's code constructs (not abstract NFA states)

**Optimal State:** A STRling pattern decorated with `#[safe]` either compiles successfully (with a mathematical guarantee of $O(n)$ execution time) or fails compilation with a precise diagnostic identifying the ambiguous construct.

---

## 2. Co-located Research Reports

This inquiry synthesizes findings from the following research dossiers:

| Report                                                                                                                | Focus                 | Key Contribution                                                                       |
| --------------------------------------------------------------------------------------------------------------------- | --------------------- | -------------------------------------------------------------------------------------- |
| [Regex Backtracking and ReDoS Vulnerabilities](Regex%20Backtracking%20and%20ReDoS%20Vulnerabilities.md)               | Threat Landscape      | Taxonomy of vulnerable patterns (NQ, QOD, QOA); mechanics of catastrophic backtracking |
| [STRling Linter Architecture: Derivatives vs. Graph](STRling%20Linter%20Architecture_%20Derivatives%20vs.%20Graph.md) | Solution Architecture | Feasibility analysis of Symbolic Derivative-based static analysis; SAI specification   |

---

## 3. Pattern Synthesis

### Key Observations

**The Mechanics of Catastrophe:**

The ReDoS vulnerability arises from **Exponential Ambiguity**—when a pattern structure allows $2^{n-1}$ distinct parse paths for an input of length $n$. The canonical example:

$$\text{Pattern: } (a+)+ \quad \Rightarrow \quad \text{Compositions of } n = 2^{n-1}$$

**The Taxonomy of Evil Regexes:**

| Pattern Type                             | Complexity | Example   | Mechanism               |
| ---------------------------------------- | ---------- | --------- | ----------------------- |
| Nested Quantifiers (NQ)                  | $O(2^n)$   | `(a+)+`   | Cyclic ambiguity        |
| Quantified Overlapping Disjunction (QOD) | $O(2^n)$   | `(a\|a)+` | Overlapping alternation |
| Quantified Overlapping Adjacency (QOA)   | $O(n^2)$   | `\d+\d+`  | Suffix/prefix overlap   |

**The Derivative Insight:**

Unlike NFA construction (graph building), differentiation is an **algebraic transformation**:

$$\partial_a(R) = \{ s \mid as \in L(R) \}$$

The set of all unique derivatives of a regular expression $R$ corresponds to the states of its minimal DFA. We can detect ambiguity by observing the **accumulation of identical terms in the union operator**.

### Representability Gap

Current STRling lacks compile-time safety verification. Patterns are emitted to target engines without proof of linear-time execution.

---

## 4. Architectural Recommendations

### Proposed Language Evolution

Implement the **Symbolic Ambiguity Inspector (SAI)** as a core compiler pass:

1. **Lazy Symbolic Exploration**: Explore derivative state space on-demand with resource budgets (depth ~50, states ~200)
2. **IR-Native Operation**: Operate directly on `IRSeq`, `IRAlt`, `IRQuant` nodes—no lossy NFA conversion
3. **Instructional Diagnostics**: Error messages reference user's code constructs, not abstract automaton states

### Justification

The Symbolic Derivative approach is architecturally superior for STRling because:

- Preserves semantic richness of the IR for educational error messages
- Handles boolean operations (intersection, complement) natively
- Achieves sub-100ms latency suitable for LSP integration

### Complexity Reduction Model

$$\text{Latency Reduction: } \frac{O(m^3)_{\text{graph}}}{O(m \cdot k)_{\text{derivative}}} \approx 10\text{x-100x improvement}$$

---

**Status:** 🟠 IN-PROGRESS

**Related Focus Nodes:** [validity-taxonomy](../validity-taxonomy/index.md), [tooling-void](../tooling-void/index.md)

**Main Repo Impact:** Compiler Pass Required / SAI Module Implementation
