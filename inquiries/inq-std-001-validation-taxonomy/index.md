# STRling Inquiry: The Validation Taxonomy

**Inquiry ID:** INQ-STD-001  
**Category:** Standard Library  
**Status:** 🟠 IN-PROGRESS

## Description

> **The Representability Gap:** The concept of "Valid" is treated as a binary boolean in traditional regex validation. A pattern can match the _syntax_ of an email (`user@domain.com`) but fail the _semantics_ (domain lacks MX records) or _existence_ (mailbox doesn't exist). Current regex-based validation conflates these distinct layers, leading to brittle systems that either over-reject legitimate input or under-validate dangerous payloads.

**Heuristic Boundaries:** This inquiry focuses on architecting the STRling Standard Library's validation framework. It addresses the stratification of validity into discrete, composable layers. It does not prescribe specific pattern implementations for each validator, but rather the structural taxonomy and DSL extensions required to support multi-layer validation.

---

## Table of Contents

- [1. Objective & Hypothesis](#1-objective--hypothesis)
- [2. Methodology](#2-methodology)
- [3. Pattern Synthesis](#3-pattern-synthesis)
- [4. Architectural Recommendations](#4-architectural-recommendations)

---

## 1. Objective & Hypothesis

### Primary Inquiry

How should the STRling Standard Library structure its validators to accurately represent the **spectrum of validity**—from syntactic conformance to semantic correctness to existential verification—while maintaining the DSL's elegance and the principle of "Pragmatic Empathy"?

### Hypothesis

We hypothesize that validity should be modeled as a **Taxonomy of Three Layers**, each with increasing computational cost and external dependency:

1. **Syntactic Validity:** Pure pattern matching (STRling's core domain)
2. **Semantic Validity:** Logical correctness requiring computation beyond regex (Luhn, date math)
3. **Existential Validity:** Real-world existence checks (DNS, API calls)

By structuring the Standard Library around this taxonomy and introducing a `verify { ... }` DSL construct for semantic checks, STRling can provide **graduated validation** that empowers developers to choose the appropriate level of strictness for their use case.

**Optimal State:** A developer writes `s.email(mode='strict', verify=true)` and receives:

- Syntactic validation via compiled regex
- Semantic validation via inline logic blocks
- Clear documentation of what each layer guarantees

---

## 2. Methodology

### Knowledge Sources

| Source Type       | Reference                                   | Key Contribution                                |
| ----------------- | ------------------------------------------- | ----------------------------------------------- |
| Research Report   | `STRling Standard Library Specification.md` | Falsehoods Audit, Validation Taxonomy framework |
| Industry Standard | RFC 5322 (Email), RFC 4122 (UUID)           | Formal syntax specifications                    |
| Industry Standard | WHATWG HTML5 Email Specification            | Pragmatic "willful violation" of RFC 5322       |
| Pattern Library   | "Falsehoods Programmers Believe About..."   | Empirical catalog of validation assumptions     |

### Analytical Framework

The **Falsehoods Methodology** was applied: cataloging misconceptions programmers hold about common data formats, then auditing these against regex capabilities to identify friction points requiring flexibility.

**Case Studies Analyzed:**

- Email addresses (RFC 5322 paradox: comments, IP literals, quoted strings)
- UUIDs (version/variant bits, braces, nil UUID)
- Phone numbers (international formats, extensions)
- Dates/Times (ISO 8601 variants, timezone handling)

### Limitations

1. **Regex Ceiling:** Certain semantic validations (leap years, Luhn algorithm) exceed regex's formal power (Regular Languages)
2. **Existential Dependency:** DNS/API checks require runtime, network access—outside compiler scope
3. **Internationalization:** Human name validation is culturally dependent and largely unvalidatable

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

| Falsehood                            | Reality                              | Implication                            |
| ------------------------------------ | ------------------------------------ | -------------------------------------- | -------------------------------------------------- |
| "Only letters, numbers, punctuation" | RFC allows `!#$%&'\*+/=?^\_{         | }~-` and quoted strings                | Strict mode must accept `"john smith"@example.com` |
| "Exactly one @ symbol"               | Local part may contain quoted `@`    | Split on _last_ `@`, not first         |
| "Domain must have a dot"             | `admin@localhost` is valid           | Intranet-aware validation              |
| "Comments are impossible"            | `john(comment)@example.com` is valid | Comments can be nested (context-free!) |

**The Mode Taxonomy:**

| Level  | Mode Name       | Description                                | Use Case                            |
| ------ | --------------- | ------------------------------------------ | ----------------------------------- |
| **L1** | `strict`        | Full RFC compliance, all edge cases        | Legacy interop, compliance gateways |
| **L2** | `lax` (default) | WHATWG-style, rejects theoretical oddities | User-facing forms, modern web apps  |
| **L3** | `structural`    | Minimal noise filtering                    | Log scanning, bulk extraction       |

### Representability Gap

The current STRling architecture lacks:

1. **Library Stratification:** No separation between pure-regex validators and computational validators
2. **Semantic Blocks:** No DSL construct for inline non-regex validation logic
3. **Mode Parameters:** No standardized way to select validation strictness
4. **Composition:** No clear pattern for combining syntactic + semantic checks

### Correlations

| Related Node                              | Correlation                                                                 |
| ----------------------------------------- | --------------------------------------------------------------------------- |
| `INQ-SAF-001` (ReDoS Detection)           | Complex strict-mode patterns may trigger ambiguity; safety must be verified |
| `INQ-ARCH-001` (Goal-Directed Evaluation) | `verify` blocks may benefit from generator semantics for multiple checks    |

---

## 4. Architectural Recommendations

### Proposed Language Evolution

#### 4.1 Library Structure: `std.syntax.*` and `std.logic.*`

Split the Standard Library into two namespaces reflecting the validity taxonomy:

```
std/
├── syntax/          # Pure regex validators (Syntactic Layer)
│   ├── email.strl
│   ├── uuid.strl
│   ├── url.strl
│   ├── phone.strl
│   └── ...
└── logic/           # Computational validators (Semantic Layer)
    ├── luhn.strl    # Credit card checksum
    ├── dates.strl   # Leap year, day-of-month bounds
    ├── isbn.strl    # ISBN check digit
    └── ...
```

**Rationale:**

- `std.syntax.*` patterns are pure, composable, and guaranteed safe (via `#[safe]`)
- `std.logic.*` validators may include procedural logic and should be clearly distinguished
- Developers can import only what they need, understanding the capability boundary

#### 4.2 New DSL Keyword: `verify { ... }` Blocks

Introduce a semantic verification construct that runs _after_ syntactic pattern matching:

```strling
#[safe]
pattern credit_card = s.digits(13, 19)
    verify {
        luhn_checksum(matched) == true
    }
```

**Semantics:**

1. The regex pattern matches first (syntactic validation)
2. If matched, the `verify` block executes with `matched` bound to the captured string
3. The block must return a boolean; `false` causes overall validation failure
4. Multiple `verify` blocks are AND-composed

**Extended Example—Date Validation:**

```strling
pattern iso_date =
    s.group("year", s.digits(4)) + "-" +
    s.group("month", s.digits(2)) + "-" +
    s.group("day", s.digits(2))
    verify {
        let m = int(groups.month)
        let d = int(groups.day)
        m >= 1 && m <= 12 && d >= 1 && d <= days_in_month(m, int(groups.year))
    }
```

#### 4.3 Mode Parameter Standardization

All `std.syntax.*` validators accept a `mode` parameter:

```strling
import std.syntax.email

# Default: pragmatic validation
let user_email = email()

# Strict: RFC 5322 compliance
let legacy_email = email(mode='strict')

# Structural: noise filtering for log parsing
let log_extractor = email(mode='structural')
```

**Implementation:** Each mode maps to a different internal pattern construction, potentially with different performance and safety characteristics.

#### 4.4 Validation Pipeline Composition

Provide a `validate` combinator for chaining layers:

```strling
let full_email_check = validate(
    syntax: std.syntax.email(mode='strict'),
    semantic: std.logic.email_domain_format,
    existential: external.dns.mx_lookup  # Optional, requires runtime
)
```

### Justification

1. **Clarity of Contract:** Developers immediately understand what each layer guarantees
2. **Pragmatic Empathy:** Default `lax` mode aligns with real-world usage
3. **Composability:** Semantic checks can be added without modifying core patterns
4. **Safety Boundary:** `std.syntax.*` remains pure regex; computational escape hatches are explicit

### Complexity Reduction Model

The expected improvement in validation code clarity:

$$C_{traditional} = \text{regex} + \text{post-hoc imperative checks (scattered)}$$

$$C_{strling} = \text{pattern} + \text{verify} \{ \text{co-located semantic checks} \}$$

$$\Delta_{clarity} = \frac{C_{traditional}}{C_{strling}} \approx 3\text{-}5\times \text{ reduction in cognitive overhead}$$

The co-location of syntactic and semantic validation in a single construct eliminates the "two places to look" anti-pattern common in traditional validation code.

---

## 5. Strategic Delta Summary

| Delta Type                | Specification                                                        | Priority      |
| ------------------------- | -------------------------------------------------------------------- | ------------- |
| **Library Restructure**   | Split into `std.syntax.*` and `std.logic.*` namespaces               | P0 (Critical) |
| **New DSL Keyword**       | `verify { ... }` blocks for semantic validation                      | P0 (Critical) |
| **Mode Parameter**        | Standardized `mode='strict'\|'lax'\|'structural'` for all validators | P1 (High)     |
| **Validation Combinator** | `validate(syntax, semantic, existential)` pipeline                   | P2 (Medium)   |
| **Documentation**         | Per-validator Falsehoods Audit and layer guarantees                  | P1 (High)     |

---

## 6. Appendix: Falsehoods Quick Reference

### Email (`std.syntax.email`)

| Falsehood                | Strict Mode Handles | Lax Mode Handles |
| ------------------------ | ------------------- | ---------------- |
| Quoted local parts       | ✅                  | ❌ (rejected)    |
| IP literal domains       | ✅                  | ❌               |
| Comments in address      | ✅                  | ❌               |
| Plus addressing (`+tag`) | ✅                  | ✅               |
| Dotless domains          | ✅                  | ❌               |

### UUID (`std.syntax.uuid`)

| Falsehood                 | Strict Mode Handles | Lax Mode Handles |
| ------------------------- | ------------------- | ---------------- |
| Non-v4 versions (v1, v7)  | ✅                  | ✅               |
| Braces/parentheses (GUID) | ❌                  | ✅               |
| Compact/no-hyphen format  | ❌                  | ✅               |
| Nil UUID (all zeros)      | ✅                  | ✅               |
| Case sensitivity          | Case-insensitive    | Case-insensitive |

---

**Status:** 🟠 IN-PROGRESS

**Related RI Nodes:** `INQ-SAF-001`, `INQ-ARCH-001`

**Main Repo Impact:**

- Library restructuring (`std.syntax.*`, `std.logic.*`)
- New DSL keyword (`verify`)
- Mode parameter implementation across all validators
- Comprehensive documentation with Falsehoods Audit for each validator
