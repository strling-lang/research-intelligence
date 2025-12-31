# STRling Inquiry: Goal-Directed Evaluation

**Inquiry ID:** INQ-ARCH-001  
**Category:** Core Architecture  
**Status:** 🟠 IN-PROGRESS

## Description

> **The Representability Gap:** Modern Regular Expressions operate on an "All-or-Nothing" paradigm. A pattern attempts to match and returns either a boolean result or a captured string. There is no mechanism for **Goal-Directed Search**—the ability to generate a result, suspend execution, and retry with different parameters if a later condition fails. This forces developers to write imperative loops around regex calls to enumerate alternatives, breaking the declarative elegance of pattern matching.

**Heuristic Boundaries:** This inquiry focuses on the architectural evolution of STRling from a "Matcher" to a "Generator" paradigm. It draws on the archaeological record of SNOBOL4 and Icon to recover lost semantics. This inquiry does NOT address runtime implementation details for specific target engines, but rather the DSL-level abstractions that would enable generator-style pattern evaluation.

---

## Table of Contents

- [1. Objective & Hypothesis](#1-objective--hypothesis)
- [2. Methodology](#2-methodology)
- [3. Pattern Synthesis](#3-pattern-synthesis)
- [4. Architectural Recommendations](#4-architectural-recommendations)

---

## 1. Objective & Hypothesis

### Primary Inquiry

Can STRling transcend the limitations of traditional regex by adopting **Goal-Directed Evaluation** semantics from the Icon programming language—treating patterns as **Generators** that produce sequences of results rather than singular matches—while still targeting modern regex engines (PCRE2, RE2)?

### Hypothesis

We hypothesize that the SNOBOL4/Icon paradigm of first-class patterns and generators offers superior expressiveness for complex text processing tasks. By introducing generator semantics at the DSL level, STRling can:

1. Enable patterns to **produce multiple results** (all matches, all parse trees)
2. Allow **suspended execution** with automatic backtracking on failure
3. Unify pattern matching with control flow (eliminating the "Two Languages" problem)

**Optimal State:** A developer writes:

```strling
every match in pattern.generate(text) {
    if semantic_check(match) {
        suspend match
    }
}
```

And receives a lazy sequence of all valid matches, with the pattern engine handling backtracking transparently.

---

## 2. Methodology

### Knowledge Sources

| Source Type     | Reference                                            | Key Contribution                                                        |
| --------------- | ---------------------------------------------------- | ----------------------------------------------------------------------- |
| Research Report | `STRling Pattern Evolution Research.md`              | SNOBOL4/Icon archeology, first-class patterns, goal-directed evaluation |
| Historical      | SNOBOL4 Language Reference                           | Pattern primitives (ARB, FENCE, FAIL), deferred evaluation              |
| Historical      | Icon Language Reference                              | Generators, `every`, `suspend`, reversible assignment                   |
| Academic        | Griswold & Griswold, "The Icon Programming Language" | Formal semantics of goal-directed evaluation                            |

### Archaeological Methodology

The analysis follows a **three-epoch framework**:

1. **SNOBOL4 Paradigm:** Patterns as first-class data types, dynamic composition, explicit backtracking control
2. **Icon Revolution:** Unification of success/failure with control flow, generators as primary abstraction
3. **STRling Synthesis:** Adaptation of these semantics to static compilation and modern engine constraints

### Limitations

1. **Target Engine Constraints:** PCRE2/RE2 do not natively support generators; implementation requires compilation strategies
2. **Performance Trade-offs:** Generator semantics may introduce overhead compared to single-match operations
3. **Semantic Gap:** Full Icon-style goal-directed evaluation requires runtime support beyond regex engines

---

## 3. Pattern Synthesis

### Key Observations

**The SNOBOL4 Legacy—First-Class Patterns:**

SNOBOL4 elevated patterns to first-class citizens, enabling:

| Feature               | SNOBOL4 Syntax           | Modern Regex Equivalent | Gap                         |
| --------------------- | ------------------------ | ----------------------- | --------------------------- | -------------- |
| Pattern assignment    | `PAT = "a"               | "b"`                    | String literal only         | No composition |
| Pattern concatenation | `PAT1 PAT2` (whitespace) | String concatenation    | Loses structure             |
| Deferred evaluation   | `*P` (unary star)        | N/A                     | No dynamic parameterization |
| Recursive patterns    | `P = 'a' *P 'a'`         | Limited (subroutines)   | Not truly recursive         |

**Key Primitive: `FENCE`** (ancestor of atomic groups):

```snobol
PAT = P1 FENCE P2
```

Once `P1` matches and `FENCE` is crossed, backtracking cannot revisit `P1`. This provides explicit control over the backtracking stack—a solution to ReDoS avant la lettre.

**The Icon Revolution—Generators:**

Icon unified pattern matching with general computation through **Result Sequences**:

| Concept           | Definition                            | Example                                                           |
| ----------------- | ------------------------------------- | ----------------------------------------------------------------- |
| **Result**        | Value + Signal (Success/Failure)      | `find("x", s)` → index or Failure                                 |
| **Generator**     | Expression producing multiple results | `find("x", s)` generates ALL indices                              |
| **Goal-Directed** | Backtracking driven by failure        | `if find("x", s) > 5` backtracks to next index if condition fails |

**The `every` Control Structure:**

```icon
every i := find("abc", s) do
    write(i)
```

Forces the generator to produce ALL results. The `find` function generates each index, suspends, and resumes on demand.

**The "Two Languages" Problem:**

SNOBOL4 suffered from a schism between its pattern sub-language and procedural code. Icon solved this by making generators a universal language feature—not just for strings, but for all expressions:

```icon
every i := (1 to 10) * (1 to 10) do write(i)
# Generates: 1, 2, 3, ..., 10, 2, 4, 6, ..., 100
```

### Representability Gap

Current STRling lacks:

1. **Generator Semantics:** No way to express "all matches" vs "first match"
2. **Suspension Points:** No mechanism to yield intermediate results
3. **Goal-Directed Conditionals:** No integration of match failure with control flow
4. **Reversible State:** No automatic rollback of assignments on backtracking

### Correlations

| Related Node                        | Correlation                                                               |
| ----------------------------------- | ------------------------------------------------------------------------- |
| `INQ-SAF-001` (ReDoS Detection)     | Generator semantics must respect safety guarantees; lazy evaluation helps |
| `INQ-STD-001` (Validation Taxonomy) | Generators enable multi-candidate semantic validation                     |

---

## 4. Architectural Recommendations

### Proposed Language Evolution

#### 4.1 New Paradigm: Patterns as Generators

Shift STRling's conceptual model from "Matcher" to "Generator" in Beta/Gamma phase:

| Current (Alpha)                         | Proposed (Beta)                                    |
| --------------------------------------- | -------------------------------------------------- |
| `pattern.match(text)` → `Match \| None` | `pattern.find(text)` → `Match \| None` (first)     |
| N/A                                     | `pattern.generate(text)` → `Iterator<Match>` (all) |
| N/A                                     | `pattern.scan(text)` → `ScanContext` (stateful)    |

**Generator Contract:**

- Lazy evaluation: matches produced on-demand
- Suspendable: internal state preserved between yields
- Composable: generators can be chained and filtered

#### 4.2 New DSL Keyword: `every`

Introduce the `every` control structure for exhaustive generation:

```strling
# Find all email addresses in a document
every match in std.syntax.email().generate(document) {
    print(match.value)
}
```

**Semantics:**

1. The generator produces matches one at a time
2. The loop body executes for each match
3. Backtracking occurs automatically if the body requests "next"

**Conditional Generation:**

```strling
# Find all emails from a specific domain
every match in std.syntax.email().generate(document) {
    if match.groups.domain == "company.com" {
        yield match  # Passes to outer consumer
    }
    # Implicit: continue to next match
}
```

#### 4.3 New DSL Keyword: `suspend`

Enable patterns to yield intermediate results and resume:

```strling
pattern balanced_parens =
    "(" +
    suspend  # Yield partial match here
    + s.lazy(s.any()) +
    ")"
```

**Use Case—Streaming Parser:**

```strling
# Parse a large file, yielding each complete record
every record in record_pattern.generate(stream) {
    suspend record  # Yield to consumer
    # Resume here when consumer requests next
}
```

#### 4.4 Compilation Strategy

Since target engines (PCRE2) don't natively support generators, STRling must compile to:

**Option A: Offset Continuation**

```python
# Compiled Python (conceptual)
def generate_matches(pattern, text):
    offset = 0
    while True:
        match = pattern.search(text, pos=offset)
        if not match:
            return
        yield match
        offset = match.end()  # Or match.start() + 1 for overlapping
```

**Option B: Global Flag Wrapping**

```javascript
// Compiled JavaScript
function* generateMatches(pattern, text) {
  const globalPattern = new RegExp(pattern.source, "g");
  let match;
  while ((match = globalPattern.exec(text)) !== null) {
    yield match;
  }
}
```

**Option C: Native Generator Compilation (Future)**

For engines that support it, compile directly to streaming/lazy match APIs.

#### 4.5 String Scanning Environment

Introduce Icon-style scanning context for stateful parsing:

```strling
scan document {
    # Implicit: &subject = document, &pos = 0

    while not at_end() {
        if match_header() {
            suspend current_section
            reset_section()
        }
        advance(1)
    }
}
```

**Keywords:**

- `&subject` — Current string being scanned
- `&pos` — Current cursor position
- `tab(n)` — Move to absolute position, return skipped text
- `move(n)` — Move relative, return skipped text

### Justification

1. **Expressiveness:** Icon's generators solved problems that regex still struggles with
2. **Composability:** Generators chain naturally with filters, maps, and folds
3. **Lazy Efficiency:** Only compute matches as needed
4. **Unified Semantics:** Eliminates the "Two Languages" problem by making patterns behave like iterators

### Complexity Reduction Model

The improvement in expressing "find all X that satisfy Y":

$$C_{imperative} = \text{while loop} + \text{finditer} + \text{manual offset tracking} + \text{conditional filtering}$$

$$C_{generator} = \texttt{every match in pattern.generate(text) \{ if condition \{ yield \} \}}$$

$$\Delta_{loc} = \frac{LOC_{imperative}}{LOC_{generator}} \approx 3\text{-}4\times \text{ reduction}$$

More importantly, the **cognitive model** shifts from "managing iteration state" to "declaring what to find"—aligning with the declarative philosophy of pattern matching.

---

## 5. Strategic Delta Summary

| Delta Type                | Specification                               | Priority      | Phase |
| ------------------------- | ------------------------------------------- | ------------- | ----- |
| **Paradigm Shift**        | Patterns as Generators (lazy, suspendable)  | P0 (Critical) | Beta  |
| **New DSL Keyword**       | `every` for exhaustive generation           | P0 (Critical) | Beta  |
| **New DSL Keyword**       | `suspend` for yielding intermediate results | P1 (High)     | Beta  |
| **Compilation Strategy**  | Offset continuation / global flag wrapping  | P1 (High)     | Beta  |
| **Scanning Environment**  | `scan { }` blocks with `&subject`, `&pos`   | P2 (Medium)   | Gamma |
| **Reversible Assignment** | `<-` operator with automatic rollback       | P3 (Low)      | Gamma |

---

## 6. Appendix: Icon Semantic Reference

### Generator Examples

| Expression              | Result Sequence                    |
| ----------------------- | ---------------------------------- |
| `1 to 5`                | 1, 2, 3, 4, 5                      |
| `find("a", "banana")`   | 2, 4, 6 (1-indexed)                |
| `(1 to 3) + (10 to 12)` | 11, 12, 13, 12, 13, 14, 13, 14, 15 |
| `!["a", "b", "c"]`      | "a", "b", "c" (element generator)  |

### Control Structures

| Structure            | Behavior                                          |
| -------------------- | ------------------------------------------------- |
| `every expr do body` | Force all results from generator                  |
| `if expr then ...`   | Succeed on first result                           |
| `expr1 & expr2`      | Conjunction (both must succeed)                   |
| `expr1 \| expr2`     | Alternation (try expr2 if expr1 fails)            |
| `\expr`              | Succeed if expr succeeds, producing expr's result |
| `/expr`              | Succeed if expr fails, producing null             |

### Reversible Assignment

```icon
x := 10
if (x <- 20) & (x > 15) then write(x)  # Writes 20
# If condition failed, x would revert to 10
```

---

**Status:** 🟠 IN-PROGRESS

**Related RI Nodes:** `INQ-SAF-001`, `INQ-STD-001`

**Main Repo Impact:**

- Major architectural shift to generator paradigm (Beta phase)
- New DSL keywords (`every`, `suspend`)
- Compilation strategies for non-generator target engines
- Documentation: Generator semantics, scanning environments
- Future: Native generator support for streaming engines
