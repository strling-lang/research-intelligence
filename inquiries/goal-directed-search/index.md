# STRling Inquiry: Goal-Directed Search & Generator Semantics

**Tags:** `#logic` `#architecture` `#ux`  
**Status:** 🟠 IN-PROGRESS

---

[← Back to Inquiries](../README.md)

---

## Description

> **The Representability Gap:** Modern Regular Expressions operate on an "All-or-Nothing" paradigm. A pattern attempts to match and returns either a boolean result or a captured string. There is no mechanism for **Goal-Directed Search**—the ability to generate a result, suspend execution, and retry with different parameters if a later condition fails. This forces developers to write imperative loops around regex calls to enumerate alternatives, breaking the declarative elegance of pattern matching.

**Heuristic Boundaries:** This inquiry focuses on the architectural evolution of STRling from a "Matcher" to a "Generator" paradigm, drawing on the archaeological record of SNOBOL4 and Icon. It also addresses the evolution toward first-class grammar construction via Raku-style "braiding" and LPeg-style virtual machines.

---

## Table of Contents

- [1. Objective & Hypothesis](#1-objective--hypothesis)
- [2. Co-located Research Reports](#2-co-located-research-reports)
- [3. Pattern Synthesis](#3-pattern-synthesis)
- [4. Architectural Recommendations](#4-architectural-recommendations)

---

## 1. Objective & Hypothesis

### Primary Inquiry

Can STRling transcend the limitations of traditional regex by adopting:

1. **Goal-Directed Evaluation** semantics from the Icon programming language—treating patterns as **Generators** that produce sequences of results rather than singular matches?
2. **First-Class Grammar Architecture** enabling Island Grammars, algebraic pattern composition, and deterministic virtual machine execution?

### Hypothesis

We hypothesize that synthesizing the structural elegance of Raku with the execution safety of LPeg, and recovering the semantic richness of SNOBOL4/Icon, will enable STRling to:

1. Enable patterns to **produce multiple results** (all matches, all parse trees)
2. Allow **suspended execution** with automatic backtracking on failure
3. Define **Island Grammars** (nested languages like SQL within Python strings)
4. Guarantee **linear-time execution** regardless of input complexity

**Optimal State:** A developer writes generator-style patterns that lazily enumerate all valid matches while the engine handles backtracking transparently.

---

## 2. Co-located Research Reports

This inquiry synthesizes findings from the following research dossiers:

| Report                                                                            | Focus                 | Key Contribution                                                          |
| --------------------------------------------------------------------------------- | --------------------- | ------------------------------------------------------------------------- |
| [STRling Pattern Evolution Research](STRling%20Pattern%20Evolution%20Research.md) | Historical Archeology | SNOBOL4/Icon paradigms; first-class patterns; FENCE/FAIL/ABORT primitives |
| [STRling Grammar Evolution Research](STRling%20Grammar%20Evolution%20Research.md) | Grammar Architecture  | Raku cursor model; LPeg VM; Grammar braiding; Island resolution           |

---

## 3. Pattern Synthesis

### Key Observations

**The SNOBOL4 Legacy—First-Class Patterns:**

SNOBOL4 elevated patterns to first-class citizens with capabilities missing from modern regex:

| Feature              | SNOBOL4 Syntax     | Modern Regex Gap            |
| -------------------- | ------------------ | --------------------------- |
| Pattern assignment   | `PAT = "a" \| "b"` | No composition              |
| Deferred evaluation  | `*P` (unary star)  | No dynamic parameterization |
| Recursive patterns   | `P = 'a' *P 'a'`   | Not truly recursive         |
| Backtracking control | `FENCE` primitive  | Atomic groups only (recent) |

**The Icon Revolution—Generators:**

Icon unified pattern matching with control flow through the `every`/`suspend` paradigm:

```icon
every match in pattern.generate(text) {
    if semantic_check(match) {
        suspend match
    }
}
```

**The Raku Synthesis—Grammar Braiding:**

Raku's **Cursor** architecture enables Island Grammar resolution through `subparse` coordinate handover between nested language contexts.

### Representability Gap

Current STRling cannot:

- Return multiple matches lazily
- Handle recursive grammars natively
- Switch parsing contexts for embedded languages

---

## 4. Architectural Recommendations

### Proposed Language Evolution

1. **Shadow Cursor Implementation**: Track line/column numbers, grammar stack context, and lazy state generation
2. **Generator Semantics**: Introduce `yield` and iteration constructs at the DSL level
3. **Island Grammar Delegation**: Implement `s.delegate(target=grammar, terminator=pattern)` for context switching
4. **LPeg-Style VM**: Transition from NFA string emission to bytecode generation for a deterministic virtual machine

### Justification

These features address fundamental limitations in regex expressiveness while maintaining STRling's commitment to safety and portability.

### Complexity Reduction Model

$$\text{Expressiveness: Regular Languages} \rightarrow \text{Context-Free Languages}$$

By adopting recursive patterns and grammar braiding, STRling transcends the theoretical limits of Regular Expressions.

---

**Status:** 🟠 IN-PROGRESS

**Related Focus Nodes:** [tooling-void](../tooling-void/index.md), [upe-roadmap](../upe-roadmap/index.md)

**Main Repo Impact:** Parser Redesign / VM Implementation / New DSL Keywords
