# STRling Inquiry: Real-Time ReDoS Detection via Symbolic Derivatives

**Inquiry ID:** INQ-SAF-001  
**Category:** Safety & Security  
**Status:** 🟠 IN-PROGRESS

## Description

> **The Representability Gap:** Current regex engines (NFA-based backtracking) cannot intrinsically "know" if they are safe without runtime execution. Traditional static analysis methods—building full Nondeterministic Finite Automata (NFAs) and inspecting graph topology—impose computational overhead (latency >100ms) that violates the real-time feedback requirements of modern IDE environments (LSP). The developer cannot receive safety guarantees at the speed of thought.

**Heuristic Boundaries:** This inquiry focuses exclusively on the static detection of exponential ambiguity in regular expressions at compile time. It does not address runtime mitigations (timeouts, sandboxing) or semantic validation concerns. The scope is limited to patterns that can be statically analyzed without execution.

---

## Table of Contents

- [1. Objective & Hypothesis](#1-objective--hypothesis)
- [2. Methodology](#2-methodology)
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

## 2. Methodology

### Knowledge Sources

| Source Type     | Reference                                               | Key Contribution                                                  |
| --------------- | ------------------------------------------------------- | ----------------------------------------------------------------- |
| Research Report | `STRling Linter Architecture_ Derivatives vs. Graph.md` | Feasibility analysis of Symbolic Derivative-based static analysis |
| Research Report | `Regex Backtracking and ReDoS Vulnerabilities.md`       | Taxonomy of vulnerable patterns (NQ, QOD, QOA)                    |
| Academic        | Brzozowski (1964)                                       | Original derivative calculus for regular expressions              |
| Academic        | Sulzmann & Lu (2016)                                    | Derivative-based ambiguity diagnosis                              |
| Industry        | Microsoft RE# / SRM Engine                              | Symbolic derivatives for Unicode handling                         |

### Tooling Considerations

- **STRling IR Classes:** `IRSeq`, `IRAlt`, `IRQuant`, `IRLit`, `IRClass` (isomorphic to derivative algebraic terms)
- **Derivative Scanner Prototype:** Visitor pattern implementation over IR nodes
- **State Budget Parameters:** Depth Limit (~50 transitions), State Limit (~200 unique states)

### Limitations

1. **Backreferences:** Non-regular; require abstract interpretation (over-approximation via macro expansion)
2. **Full DFA Worst-Case:** Theoretical $O(2^m)$ complexity; mitigated by lazy exploration with resource budgets
3. **Lookarounds:** Handled as Boolean constraints on nullability (RE# approach)

---

## 3. Pattern Synthesis

### Key Observations

**The Mechanics of Catastrophe:**

The ReDoS vulnerability arises from **Exponential Ambiguity**—when a pattern structure allows $2^{n-1}$ distinct parse paths for an input of length $n$. The canonical example:

$$\text{Pattern: } (a+)+ \quad \Rightarrow \quad \text{Compositions of } n = 2^{n-1}$$

The backtracking engine must explore every partition of the input string, resulting in effectively infinite runtime for modest inputs.

**The Taxonomy of Evil Regexes:**

| Pattern Type                             | Complexity | Example   | Mechanism               |
| ---------------------------------------- | ---------- | --------- | ----------------------- |
| Nested Quantifiers (NQ)                  | $O(2^n)$   | `(a+)+`   | Cyclic ambiguity        |
| Quantified Overlapping Disjunction (QOD) | $O(2^n)$   | `(a\|a)+` | Overlapping alternation |
| Quantified Overlapping Adjacency (QOA)   | $O(n^2)$   | `\d+\d+`  | Suffix/prefix overlap   |

**The Derivative Insight:**

Unlike NFA construction (graph building), differentiation is an **algebraic transformation**:

$$\partial_a(R) = \{ s \mid as \in L(R) \}$$

The set of all unique derivatives of a regular expression $R$ corresponds to the states of its minimal DFA. Crucially, we can detect ambiguity by observing the **accumulation of identical terms in the union operator**:

- If $\partial_a(R)$ yields $E \cup E$ → Two paths lead to the same state
- If this structure persists through a loop → **Infinite Ambiguity**
- If multiplicity grows exponentially → **Catastrophic Backtracking Detected**

### Representability Gap

The current STRling DSL lacks:

1. **Safety Annotations:** No mechanism to request compile-time safety verification
2. **Ambiguity Diagnostics:** Error messages reference abstract concepts, not user-defined constructs
3. **Proactive Guidance:** No automatic suggestions for refactoring dangerous patterns

### Correlations

| Related Node                              | Correlation                                               |
| ----------------------------------------- | --------------------------------------------------------- |
| `INQ-STD-001` (Validation Taxonomy)       | Safety guarantees are prerequisite for library validators |
| `INQ-ARCH-001` (Goal-Directed Evaluation) | Generator semantics may interact with ambiguity detection |

---

## 4. Architectural Recommendations

### Proposed Language Evolution

#### 4.1 New Component: `SafetyCompiler` Phase

Insert a new phase in the STRling compilation pipeline between IR generation and Emitter:

```
[Parser] → [IR Generator] → [SafetyCompiler] → [Optimizer] → [Emitter]
```

The `SafetyCompiler` implements a **Symbolic Ambiguity Inspector (SAI)** using:

- **Lazy Symbolic Exploration:** Derivatives computed on-demand
- **Resource Budgets:** Abort with "Complexity Unknown" if limits exceeded (graceful degradation)
- **Ambiguity Tracking:** Disabled simplification for $R \cup R \equiv R$ to detect duplicate paths

#### 4.2 New Attribute: `#[safe]`

Introduce a decorator/attribute that triggers mandatory safety verification:

```strling
#[safe]
pattern user_input = s.one_or_more(s.alpha()) + "@" + s.one_or_more(s.alpha())
```

**Semantics:**

- ✅ **Compile Success:** Pattern proven to have $O(n)$ worst-case complexity
- ❌ **Compile Failure:** Diagnostic identifies the ambiguous construct with refactoring suggestions

#### 4.3 Educational Error Messages

Leverage IR preservation to generate context-aware diagnostics:

```
error[SAF001]: Exponential ambiguity detected in pattern `user_input`
  --> src/validators.strl:15:10
   |
15 |   s.one_or_more(s.any_of(s.alpha(), s.digit(), "-"))
   |   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
   |
   = note: The character class `s.alpha()` overlaps with itself under nested repetition
   = help: Consider using `s.atomic(...)` to prevent backtracking, or restructure the pattern
```

### Justification

1. **Structural Alignment:** STRling IR is isomorphic to derivative algebraic terms—no translation layer required
2. **Performance:** Lazy exploration with budgets guarantees sub-100ms response, even for complex patterns
3. **Semantic Preservation:** Errors reference `user_input` and `s.alpha()`, not "State 42"
4. **Graceful Degradation:** "Complexity Unknown" is acceptable for edge cases; "Safe" is a strong guarantee

### Complexity Reduction Model

The expected improvement in "Pattern Wieldability" can be represented as:

$$W_{safety} = \frac{T_{debug}^{runtime}}{T_{compile}^{static}} \approx \frac{O(\infty)}{O(1)} \rightarrow \infty$$

Where:

- $T_{debug}^{runtime}$ = Time to diagnose ReDoS in production (potentially infinite hang)
- $T_{compile}^{static}$ = Time to receive safety feedback at compile (constant, <100ms)

**The ROI is effectively infinite:** A single prevented production incident justifies the entire investment.

---

## 5. Strategic Delta Summary

| Delta Type            | Specification                                             | Priority      |
| --------------------- | --------------------------------------------------------- | ------------- |
| **New Component**     | `SafetyCompiler` phase with Symbolic Ambiguity Inspector  | P0 (Critical) |
| **New Attribute**     | `#[safe]` decorator for compile-time safety guarantees    | P0 (Critical) |
| **Diagnostic System** | Context-aware error messages with refactoring suggestions | P1 (High)     |
| **LSP Integration**   | Real-time safety feedback on keypress                     | P1 (High)     |

---

**Status:** 🟠 IN-PROGRESS

**Related RI Nodes:** `INQ-STD-001`, `INQ-ARCH-001`

**Main Repo Impact:**

- New compiler phase required (`SafetyCompiler`)
- New DSL attribute (`#[safe]`)
- LSP extension for real-time diagnostics
- Documentation: Safety guarantees and limitations
