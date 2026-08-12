# STRling Inquiry: Stochastic Pattern Logic

**Tags:** `#probability` `#logic` `#fuzzy-matching` `#math`  
**Status:** 🟠 IN-PROGRESS

---

[← Back to Inquiries](../index.md)

---

## Description

> **The Representability Gap:** Classical pattern matching operates on a rigid boolean determinism—a string either matches or it does not. This binary paradigm creates a catastrophic "cliff of failure" when applied to stochastic realities: OCR outputs, speech recognition, degraded telemetry, and biological sequences. The gap exists between the _semantic intent_ of a query (find meaningful patterns despite noise) and the _expressive capability_ of the tool (which demands morphological perfection).

**Heuristic Boundaries:** This inquiry focuses exclusively on extending the STRling DSL and IR to support probabilistic matching semantics. It does not extend to general machine learning model integration, real-time streaming architectures, or domain-specific noise profiles beyond proof-of-concept demonstrations.

---

## Table of Contents

- [1. Objective & Hypothesis](#1-objective--hypothesis)
- [2. Co-located Research Reports](#2-co-located-research-reports)
- [3. Pattern Synthesis](#3-pattern-synthesis)
- [4. Architectural Recommendations](#4-architectural-recommendations)

---

## 1. Objective & Hypothesis

**Probabilistic Sovereignty: Patterns That Return Confidence**

- **Primary Inquiry:** How can STRling evolve from a boolean match engine to a probabilistic reasoning system that returns _confidence scores_ rather than binary verdicts, enabling graceful degradation in noisy environments?

- **Hypothesis:** By grounding the execution engine in **Weighted Finite Automata (WFA)** and **Semiring Algebra**, we can:
  1. Transform "Syntax Error" into "Best Guess: 87.5% Confidence"
  2. Enable domain-specific error weighting via confusion profiles
  3. Resolve ambiguity using prior probabilities encoded in weighted branches
  4. Provide N-best result lists with full traceback for downstream decision-making

The optimal state is a pattern function that returns not a boolean predicate $M(s, p) \to \{0, 1\}$, but a probabilistic function $M(s, p) \to \mathbb{R} \times \mathbb{R}$, yielding both a confidence score and a deviation cost.

## 2. Co-located Research Reports

| Report                                                                                | Focus                                      | Key Contribution                                                                                                                                    |
| ------------------------------------------------------------------------------------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Stochastic Pattern Language Research](Stochastic%20Pattern%20Language%20Research.md) | WFA Theory & Fuzzy Matching Implementation | Comprehensive analysis of semiring algebra, Levenshtein automata compilation, weighted branching semantics, and confidence normalization strategies |

## 3. Pattern Synthesis

### Key Observations

The research identifies four atomic components for stochastic pattern matching:

1. **Weighted Automata Core:** Transition weights governed by semiring algebra
2. **Fuzzy Syntax Layer:** High-level constructs that compile to Levenshtein subgraphs
3. **Weighted Branch Resolution:** Prior probabilities encoded in alternation operators
4. **Confidence API:** Normalized output scores with N-best result lists

### The Semiring Foundation

The choice of [algebraic semiring](Stochastic%20Pattern%20Language%20Research.md#22-algebraic-semirings-the-logic-of-weights) determines the entire behavior of the stochastic engine:

| Semiring        | Operations                         | Use Case                                     |
| --------------- | ---------------------------------- | -------------------------------------------- |
| **Boolean**     | $\oplus = \lor$, $\otimes = \land$ | Standard RegEx (no stochasticity)            |
| **Probability** | $\oplus = +$, $\otimes = \times$   | Total probability calculation (HMMs)         |
| **Log**         | $\oplus_{\log}$, $\otimes = +$     | Underflow-safe probability (production HMMs) |
| **Tropical**    | $\oplus = \min$, $\otimes = +$     | **Edit Distance semantics** (primary target) |

The **Tropical Semiring** provides the intuitive "cost accumulation" semantics required for fuzzy matching: perfect matches cost 0, errors accumulate via addition, and the best path is selected via minimum.

### Fuzzy Distance Compilation

The [fuzzy matching syntax](Stochastic%20Pattern%20Language%20Research.md#3-fuzzy-syntax-and-distance-metrics-codifying-ambiguity) compiles high-level constructs into Levenshtein Automata:

| Operation        | WFA Edge                                             | Weight    |
| ---------------- | ---------------------------------------------------- | --------- |
| **Match**        | $q_i \xrightarrow{c:c} q_{i+1}$                      | $0$       |
| **Substitution** | $q_i \xrightarrow{\Sigma \setminus \{c\}:c} q_{i+1}$ | $C_{sub}$ |
| **Deletion**     | $q_i \xrightarrow{\epsilon:c} q_{i+1}$               | $C_{del}$ |
| **Insertion**    | $q_i \xrightarrow{\Sigma:\epsilon} q_i$              | $C_{ins}$ |

Advanced metrics like [Damerau-Levenshtein](Stochastic%20Pattern%20Language%20Research.md#33-advanced-metrics-damerau-levenshtein-and-jaro-winkler) require auxiliary states for transposition, while Jaro-Winkler is implemented as a rescoring function over N-best lists.

### Weighted Branches and Prior Resolution

The research demonstrates how [weighted alternation](Stochastic%20Pattern%20Language%20Research.md#4-weighted-branches-expressing-priors-and-alternatives) resolves ambiguity using domain knowledge:

- Input "invo" matching against `("invoice" @ 0.8) | ("inv" @ 0.1)`
- Path A ("invoice"): Prior 0.22 + Deletion(3) = **3.22**
- Path B ("inv"): Prior 2.30 + Insertion(1) = **3.30**
- **Result:** Engine selects "invoice" because prior probability outweighs edit cost

### Correlations

This inquiry directly enables noise-tolerant matching for [real-time-redos](../real-time-redos/index.md) analysis and provides the mathematical foundation for [goal-directed-search](../goal-directed-search/index.md) optimization via weighted path selection.

## 4. Architectural Recommendations

### Proposed Language Evolution: New DSL Keywords

We recommend introducing three new DSL constructs to expose stochastic capabilities:

```python
# 1. Confidence threshold specification
pattern = s.match("invoice", %confidence(0.75))

# 2. Optional/uncertain elements with soft matching
pattern = s.merge(
    s.digit(3),
    maybe("-"),        # Zero-cost optional element
    s.digit(4)
)

# 3. Weighted alternatives with explicit priors
pattern = s.choice(
    weight("invoice", 0.8),
    weight("inv", 0.1),
    weight("bill", 0.1)
)

# 4. Fuzzy matching with configurable costs
pattern = s.fuzzy("pattern",
    max_cost=3.0,
    insertion_cost=2.0,
    deletion_cost=0.5,
    substitution_cost=1.0
)
```

**Keyword Semantics:**

| Keyword          | Purpose                             | IR Mapping                          |
| ---------------- | ----------------------------------- | ----------------------------------- |
| `%confidence(θ)` | Sets rejection threshold            | `IRConfig.confidence_threshold = θ` |
| `maybe(x)`       | Zero-cost optional wrapper          | `IRQuant(x, min=0, max=1, cost=0)`  |
| `weight(x, w)`   | Assigns prior probability to branch | `IRAlt.weights[x] = -log(w)`        |

### IR Requirement: Weighted State Transitions

The Intermediate Representation must be extended to support [WFA serialization](Stochastic%20Pattern%20Language%20Research.md#24-intermediate-representation-ir-for-the-dsl):

```
# Source  Dest  Input  Output  Weight
0         1     I      I       0.0     # Match 'I' with cost 0
0         1     l      I       1.5     # Match 'l' as 'I' with cost 1.5 (Substitution)
1         2     N      N       0.0
2         3     V      V       0.0
3                              0.0     # Final state 3 with exit cost 0
```

**IR Node Extensions:**

```typescript
interface IRWeightedTransition {
  source: StateId;
  dest: StateId;
  input: Symbol | Epsilon;
  output: Symbol | Epsilon;
  weight: number; // Cost in Tropical semiring
  semiring: "boolean" | "tropical" | "log" | "probability";
}

interface IRConfidenceConfig {
  threshold: number; // Rejection cutoff (0.0 - 1.0)
  normalization: "ratio" | "softmax";
  beamWidth?: number; // For real-time pruning
}
```

### Compiler Pipeline Extension

The [implementation architecture](Stochastic%20Pattern%20Language%20Research.md#71-compiler-pipeline) requires a multi-stage extension:

```
┌─────────────────────────────────────────────────────────────────┐
│                 STOCHASTIC COMPILER PIPELINE                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [DSL Code] ──► [Parser] ──► [AST] ──► [Expansion] ──► [NWFA]   │
│                                              │                  │
│                              ┌───────────────┴───────────────┐  │
│                              │  • fuzzy() → Levenshtein      │  │
│                              │  • weight() → ε-transitions   │  │
│                              │  • maybe() → zero-cost quant  │  │
│                              └───────────────────────────────┘  │
│                                              │                  │
│  [NWFA] ──► [Optimization] ──► [WDFA] ──► [Execution Engine]    │
│                  │                              │               │
│      ┌───────────┴───────────┐      ┌───────────┴───────────┐   │
│      │  • ε-removal          │      │  • Viterbi Algorithm  │   │
│      │  • Determinization    │      │  • Beam Search        │   │
│      │  • Minimization       │      │  • N-best extraction  │   │
│      └───────────────────────┘      └───────────────────────┘   │
│                                                 │               │
│                                    [Confidence API Result]      │
└─────────────────────────────────────────────────────────────────┘
```

### Justification

The transition from boolean to stochastic logic is demanded by modern data realities:

- OCR error rates of 1-5% render exact matching useless
- ASR word error rates of 5-15% require fuzzy tolerance
- Legacy data formats exhibit systematic drift patterns

The [Viterbi Algorithm](Stochastic%20Pattern%20Language%20Research.md#61-the-viterbi-algorithm) provides $O(T \times |S|^2)$ complexity, while [Beam Search](Stochastic%20Pattern%20Language%20Research.md#62-beam-search-for-real-time-performance) enables sub-50ms latency for production workloads.

### Mathematical Delta: Noise-Tolerance Improvement

The transition from deterministic to stochastic matching provides a quantifiable improvement in noise tolerance:

$$
\Delta_{\text{noise-tolerance}} = \frac{P(\text{correct extraction} | \text{noisy input})_{\text{stochastic}}}{P(\text{correct extraction} | \text{noisy input})_{\text{deterministic}}}
$$

For a pattern of length $L$ with per-character error rate $\epsilon$:

**Deterministic (Boolean):**

$$
P_{\text{det}} = (1 - \epsilon)^L
$$

**Stochastic (Fuzzy with threshold $k$):**

$$
P_{\text{stoch}} = \sum_{i=0}^{k} \binom{L}{i} \epsilon^i (1-\epsilon)^{L-i}
$$

**Example:** For $L = 10$, $\epsilon = 0.05$, $k = 2$:

- $P_{\text{det}} = 0.95^{10} \approx 0.599$ (59.9%)
- $P_{\text{stoch}} = \sum_{i=0}^{2} \binom{10}{i} (0.05)^i (0.95)^{10-i} \approx 0.988$ (98.8%)

$$
\Delta_{\text{noise-tolerance}} = \frac{0.988}{0.599} \approx \mathbf{1.65\times} \text{ improvement}
$$

Additionally, the confidence normalization transforms raw costs into actionable metrics:

$$
\text{Confidence} = \max\left(0, 1 - \frac{C_{\text{total}}}{L_{\text{pattern}} \times W_{\text{max\_error}}}\right)
$$

---

**Status:** 🟠 IN-PROGRESS

**Related Focus Nodes:** [real-time-redos](../real-time-redos/index.md) | [goal-directed-search](../goal-directed-search/index.md) | [validity-taxonomy](../validity-taxonomy/index.md)

**Main Repo Impact:** IR Extension Required (Weighted Transitions) / New DSL Keywords (`%confidence`, `maybe`, `weight`, `fuzzy`) / Runtime Algorithm Addition (Viterbi, Beam Search)
