# STRling Inquiry: Multi-Modal Ingestion

**Tags:** `#genomics` `#telemetry` `#binary` `#data-streams` `#performance`  
**Status:** 🟠 IN-PROGRESS

---

[← Back to Inquiries](../index.md)

---

## Description

> **The Representability Gap:** The contemporary "String-First" paradigm assumes the atomic unit of information is a character (8-bit ASCII or variable-width UTF-8). This assumption is catastrophically invalid for high-throughput environments where data is natively structural, numeric, or packed. When binary telemetry, genomic sequences, or numeric tensors are forced through a text-based regex engine, the system incurs a massive computational penalty—often orders of magnitude higher than the pattern matching itself.

**Heuristic Boundaries:** This inquiry focuses on extending the STRling parser to accept arbitrary data streams (bytes, bits, floats, structs) without text conversion. It does not extend to semantic interpretation of domain-specific protocols, real-time alerting systems, or hardware accelerator integration beyond proof-of-concept abstractions.

---

## Table of Contents

- [1. Objective & Hypothesis](#1-objective--hypothesis)
- [2. Co-located Research Reports](#2-co-located-research-reports)
- [3. Pattern Synthesis](#3-pattern-synthesis)
- [4. Architectural Recommendations](#4-architectural-recommendations)

---

## 1. Objective & Hypothesis

**Protocol Sovereignty: Matching at the Bit and Element Level**

- **Primary Inquiry:** How can STRling evolve from a text-centric pattern engine to a _protocol-sovereign_ system that matches patterns directly on raw binary streams, packed genomic data, numeric tensors, and network headers—without incurring the overhead of string conversion?

- **Hypothesis:** By decoupling the "Alphabet" from the "Byte" and introducing a generic `Sequence<T>` abstraction, we can:
  1. Eliminate the 200-400% memory expansion caused by text encoding
  2. Match bit-level patterns without byte-alignment constraints
  3. Process numeric trends as symbolic sequences via streaming discretization
  4. Achieve true zero-copy operation on memory-mapped files and network ring buffers

The optimal state is a **Stream-Agnostic Parser** where the atomic unit of matching is not a "character" but an _element_—which might be a bit, a byte, a 32-bit integer, a struct field, or a geometric trend symbol.

## 2. Co-located Research Reports

| Report                                                                                | Focus                                          | Key Contribution                                                                                                                                                   |
| ------------------------------------------------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Stream-Agnostic Parser Deep Research](Stream-Agnostic%20Parser%20Deep%20Research.md) | Zero-Copy Architecture & Multi-Modal Alphabets | Comprehensive analysis of Hyperscan/Ragel streaming models, SAX discretization for numerics, bit-parallel genomic algorithms, and the `Sequence<T>` IR abstraction |

## 3. Pattern Synthesis

### Key Observations

The research identifies four critical inefficiencies in the String-First paradigm:

1. **Transcoding Overhead:** [Deserialize-then-scan](Stream-Agnostic%20Parser%20Deep%20Research.md#11-the-computational-cost-of-transcoding-and-deserialization) models introduce latency orders of magnitude higher than matching itself
2. **Null-Byte Fallacy:** Binary protocols treat [0x00 as valid data](Stream-Agnostic%20Parser%20Deep%20Research.md#12-the-null-byte-fallacy-and-encoding-constraints), breaking C-string assumptions and forcing costly escape encoding
3. **Structural Flattening:** Regex cannot express [offset-based field access](Stream-Agnostic%20Parser%20Deep%20Research.md#13-structural-vs-linear-representation), requiring complex workarounds for simple binary queries
4. **Memory Wall:** Genomic data expands [400% when converted to ASCII](Stream-Agnostic%20Parser%20Deep%20Research.md#14-comparison-of-representational-efficiency), saturating memory controllers before CPUs reach throughput limits

### The Sequence<T> Abstraction

The [Sequence<T> Intermediate Representation](Stream-Agnostic%20Parser%20Deep%20Research.md#31-the-sequencet-intermediate-representation) decouples pattern logic from data encoding:

| Stream Type     | Element Type       | Example Alphabet                      |
| --------------- | ------------------ | ------------------------------------- |
| **Text**        | `Sequence<char>`   | UTF-8 codepoints                      |
| **Network**     | `Sequence<Header>` | Protocol states, flags                |
| **Time Series** | `Sequence<Symbol>` | SAX symbols (a, b, c...)              |
| **Genomics**    | `Sequence<2-bit>`  | Packed bases (A=00, C=01, G=10, T=11) |

The state machine logic (transitions, accepts) remains identical—only the **alphabet** and **transition predicates** change.

### Zero-Copy Ingestion

The research validates three zero-copy architectures:

| Engine        | Key Capability                                                                                                               | STRling Integration                                            |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| **Hyperscan** | [Vectored Mode](Stream-Agnostic%20Parser%20Deep%20Research.md#211-streaming-block-and-vectored-modes) for scatter-gather I/O | Match patterns spanning non-contiguous buffers without copying |
| **Ragel**     | [Embedded Actions](Stream-Agnostic%20Parser%20Deep%20Research.md#221-embedding-actions-in-transitions) in state transitions  | Parse length-prefixed binary structures                        |
| **Wuffs**     | [Compile-time bounds checking](Stream-Agnostic%20Parser%20Deep%20Research.md#23-wuffs-verified-safety-in-untrusted-parsing)  | Zero-copy slice access with memory safety                      |

### Bit-Parallel Genomic Algorithms

For packed genomic data, [Myers Algorithm and BitPal](Stream-Agnostic%20Parser%20Deep%20Research.md#52-bit-parallel-algorithms-myers--bitpal) enable massive parallelism:

- Myers encodes edit-distance computation into bit vectors
- BitPal processes packed words directly, achieving 7-25× speedup
- A 64-bit word can compare 64 bases (at 2 bits/base) in a single cycle

### Correlations

This inquiry directly enables the performance requirements for [real-time-redos](../real-time-redos/index.md) stream analysis and provides the ingestion layer for [stochastic-pattern-logic](../stochastic-pattern-logic/index.md) fuzzy matching on noisy binary data.

## 4. Architectural Recommendations

### Proposed Language Evolution: Stream-Agnostic Parser

We recommend a fundamental update to the STRling Core introducing binary-native matching constructs:

```python
# 1. Bit-level pattern matching
pattern = s.bit_match(0b10110011)           # Match exact bit pattern
pattern = s.bit_mask(0b11110000, 0b10100000) # Match with mask (high nibble = 1010)

# 2. Struct field matching with endianness
pattern = s.struct_match(
    s.u32_le("length"),          # Little-endian 32-bit field
    s.bytes("payload", ref="length"),  # Variable length based on field
    s.u16_be("checksum")         # Big-endian 16-bit field
)

# 3. Genomic sequence matching (2-bit packed)
pattern = s.gene_seq("ACGTACGT", encoding="2bit")
pattern = s.gene_fuzzy("ACGTACGT", hamming_dist=2)

# 4. Numeric trend matching via SAX discretization
pattern = s.trend_match(
    "rise", "rise", "fall",      # Symbolic pattern
    window=10,                    # PAA window size
    alphabet_size=3               # SAX alphabet cardinality
)

# 5. Network predicate matching (NetKAT-style)
pattern = s.packet_seq(
    s.field_eq("ip.src", "10.0.0.0/8"),
    s.field_set("tcp.flags.syn"),
    s.field_eq("tcp.dport", 443)
)
```

**Keyword Semantics:**

| Keyword                 | Purpose                       | IR Mapping                           |
| ----------------------- | ----------------------------- | ------------------------------------ |
| `bit_match(pattern)`    | Exact bit pattern             | `IRBitLiteral(bits, width)`          |
| `bit_mask(mask, value)` | Masked bit comparison         | `IRBitPredicate(mask, expected)`     |
| `struct_match(...)`     | Fixed/variable struct parsing | `IRStruct([IRField...])`             |
| `u32_le(name)`          | Little-endian 32-bit integer  | `IRField(name, type=u32, endian=LE)` |
| `gene_seq(seq)`         | 2-bit packed genomic literal  | `IRPackedSeq(bases, pack=2bit)`      |
| `trend_match(...)`      | SAX-discretized numeric trend | `IRSAXPattern(symbols, config)`      |

### The Stream-Agnostic Parser Architecture

Building on the [architectural synthesis](Stream-Agnostic%20Parser%20Deep%20Research.md#6-synthesis-the-strling-stream-agnostic-parser-architecture), we propose:

```
┌────────────────────────────────────────────────────────────────┐
│              STREAM-AGNOSTIC PARSER ARCHITECTURE               │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  INGESTION LAYER (Zero-Copy)                            │   │
│  │  • Lock-free Ring Buffer (DPDK, io_uring)               │   │
│  │  • Vectored View (struct iovec)                         │   │
│  │  • Wuffs-style Bounds Checking                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                            │                                   │
│                            ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  TOKENIZER/PREPROCESSOR (Stream-Agnostic)               │   │
│  │  ┌─────────────┬─────────────┬─────────────────────┐    │   │
│  │  │ Binary Mode │ Numeric Mode│ Genomic Mode        │    │   │
│  │  │ (No-op /    │ (SAX/PAA    │ (Bit-pack /         │    │   │
│  │  │ Endian-Swap)│ Windowing)  │ Unpack Stride)      │    │   │
│  │  └─────────────┴─────────────┴─────────────────────┘    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                            │                                   │
│                            ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  UNIFIED AUTOMATA ENGINE                                │   │
│  │  ┌───────────────┬───────────────┬─────────────────┐    │   │
│  │  │ Literal Engine│ NFA Engine    │ Predicate Engine│    │   │
│  │  │ (SIMD Teddy)  │ (State Track) │ (Ragel/NetKAT)  │    │   │
│  │  └───────────────┴───────────────┴─────────────────┘    │   │
│  │  ┌─────────────────────────────────────────────────┐    │   │
│  │  │ Bit-Parallel Kernel (Myers/BitPal for Genomics) │    │   │
│  │  └─────────────────────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                            │                                   │
│                            ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  MATCH-ACTION INTERFACE                                 │   │
│  │  • Callback on match                                    │   │
│  │  • Safe action primitives (tag, extract, alert)         │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### IR Extensions for Binary Matching

The Intermediate Representation requires new node types:

```typescript
// Binary field types with endianness awareness
interface IRField {
  name: string;
  type:
    | "u8"
    | "u16"
    | "u32"
    | "u64"
    | "i8"
    | "i16"
    | "i32"
    | "i64"
    | "f32"
    | "f64";
  endian: "LE" | "BE" | "native";
  offset?: number | FieldRef; // Fixed or dynamic offset
}

// Bit-level matching
interface IRBitPattern {
  bits: bigint; // The bit pattern to match
  width: number; // Pattern width in bits (not byte-aligned!)
  mask?: bigint; // Optional don't-care mask
}

// Genomic packed sequence
interface IRPackedSeq {
  bases: string; // "ACGT..."
  packing: "2bit" | "4bit"; // Encoding scheme
  fuzzy?: {
    algorithm: "myers" | "bitpal";
    maxDistance: number;
  };
}

// SAX-discretized numeric pattern
interface IRSAXPattern {
  symbols: string[]; // ["rise", "rise", "fall"]
  windowSize: number; // PAA window
  alphabetSize: number; // Discretization granularity
  breakpoints: number[]; // Gaussian-derived thresholds
}
```

### Justification

The String-First paradigm imposes unconscionable overhead on modern data pipelines:

- Genomic processing wastes 75% of memory bandwidth on ASCII expansion
- Binary protocol parsing requires brittle escape-encoding workarounds
- Numeric trend matching is impossible without external preprocessing

The [Hyperscan Vectored Mode](Stream-Agnostic%20Parser%20Deep%20Research.md#211-streaming-block-and-vectored-modes) proves that high-performance engines can operate on non-contiguous memory. The [Ragel action model](Stream-Agnostic%20Parser%20Deep%20Research.md#221-embedding-actions-in-transitions) proves that FSMs can handle context-sensitive binary structures. STRling must synthesize these capabilities into a unified, accessible DSL.

### Mathematical Delta: UTF-8 Overhead Elimination

The transition from string-encoded to native binary matching provides a quantifiable performance gain:

**Memory Bandwidth Improvement:**

For a data stream of $N$ elements with native representation $B_{\text{native}}$ bytes per element and string representation $B_{\text{string}}$ bytes per element:

$$
\Delta_{\text{bandwidth}} = \frac{B_{\text{string}}}{B_{\text{native}}}
$$

**By Data Type:**

| Data Type      | Native              | String               | $\Delta_{\text{bandwidth}}$ |
| -------------- | ------------------- | -------------------- | --------------------------- |
| Genomic (DNA)  | 0.25 bytes/base     | 1 byte/base          | **4.0×**                    |
| u32 Integer    | 4 bytes             | 1-10 bytes (decimal) | **1.0× - 2.5×**             |
| Binary Flags   | 0.125 bytes (1 bit) | 4-5 bytes ("true")   | **32× - 40×**               |
| Network Header | $H$ bytes           | $2H$ bytes (hex)     | **2.0×**                    |

**Throughput Model:**

Given memory bandwidth $B_{\text{mem}}$ (bytes/sec) and CPU processing rate $P$ (elements/sec):

$$
\text{Throughput}_{\text{string}} = \min\left(\frac{B_{\text{mem}}}{B_{\text{string}}}, P\right)
$$

$$
\text{Throughput}_{\text{native}} = \min\left(\frac{B_{\text{mem}}}{B_{\text{native}}}, P\right)
$$

For memory-bound workloads (common in genomics and telemetry):

$$
\text{Speedup} = \frac{\text{Throughput}_{\text{native}}}{\text{Throughput}_{\text{string}}} = \frac{B_{\text{string}}}{B_{\text{native}}} = \Delta_{\text{bandwidth}}
$$

**Genomic Example:**

Processing 1TB of genomic data at $B_{\text{mem}} = 50 \text{ GB/s}$:

- **String (ASCII):** $\frac{50 \text{ GB/s}}{1 \text{ byte/base}} = 50 \text{ Gbases/s}$ → **20 seconds**
- **Native (2-bit):** $\frac{50 \text{ GB/s}}{0.25 \text{ bytes/base}} = 200 \text{ Gbases/s}$ → **5 seconds**

$$
\text{Speedup} = \frac{20}{5} = \mathbf{4×}
$$

Additionally, zero-copy ingestion eliminates the allocation overhead entirely:

$$
T_{\text{total}} = T_{\text{copy}} + T_{\text{match}} \xrightarrow{\text{zero-copy}} T_{\text{match}}
$$

For systems where $T_{\text{copy}} \gg T_{\text{match}}$ (typical for simple patterns on large datasets), this can yield **10×-100× improvement** in end-to-end latency.

---

**Status:** 🟠 IN-PROGRESS

**Related Focus Nodes:** [stochastic-pattern-logic](../stochastic-pattern-logic/index.md) | [real-time-redos](../real-time-redos/index.md) | [validity-taxonomy](../validity-taxonomy/index.md)

**Main Repo Impact:** Parser Rewrite Required (Stream-Agnostic Core) / New IR Node Types (`IRField`, `IRBitPattern`, `IRPackedSeq`, `IRSAXPattern`) / New DSL Keywords (`bit_match`, `struct_match`, `gene_seq`, `trend_match`)
