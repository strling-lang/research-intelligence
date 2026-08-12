# Semantic IR and Target-Specific Lowering for STRling Fourth Edition

Role: Research report
Origin: AI-assisted deep-research session commissioned for STRling Research Intelligence; the underlying sources, not the AI system, are the evidence authorities.
Generated: 2026-08-12
Imported: 2026-08-12
Source verification: Partially verified
Last reviewed: 2026-08-12
Current status: Active input

## Source verification gaps

Current STRling architecture and implementation status were rechecked at [`9991575`](https://github.com/strling-lang/strling/tree/9991575b347ac5f56108f18065c88b2b16a5065a), including the [architecture](https://github.com/strling-lang/strling/blob/9991575b347ac5f56108f18065c88b2b16a5065a/docs/architecture.md), [capability evaluation](https://github.com/strling-lang/strling/blob/9991575b347ac5f56108f18065c88b2b16a5065a/docs/capability-evaluation.md), and [portability planning](https://github.com/strling-lang/strling/blob/9991575b347ac5f56108f18065c88b2b16a5065a/docs/portability-planning.md) contracts. External architectural claims were partially checked against [MLIR dialect conversion](https://mlir.llvm.org/docs/DialectConversion/) and the [ECMAScript RegExp specification](https://tc39.es/ecma262/multipage/text-processing.html#sec-regexp-regular-expression-objects).

The original session markers did not preserve their token-to-source mapping. Unreconstructed markers now point here. Exact claims about other compilers' field placement, serialization practices, and campaign records remain provisional and are not treated as adopted STRling contracts.

## Executive conclusion

The architectural question is not “what nodes should STRling’s universal regex AST contain?” It is:

> **What facts must remain invariant while different target backends are free to choose different regex syntax, flags, auxiliary configuration, and legalization strategies?**

The strongest answer is that STRling’s canonical Semantic IR should preserve **observable matching intent and externally significant identities**, but should not preserve frontend spelling and should not prematurely encode how PCRE2, ECMAScript, Python `re`, or any future backend realizes that intent.

That leads to a relatively narrow Semantic IR.

It should preserve, at minimum:

**match structure** — sequencing, alternatives, repetition, assertions, matching units and character predicates;

**observable capture semantics** — which captures conceptually exist, their stable identities, their user-visible names or roles, and semantic references to them;

**matching context that changes meaning** — such as case sensitivity, dot/newline behavior, line-boundary interpretation, and the character domain in which predicates and anchors are interpreted;

**semantically meaningful distinctions that cannot safely be reconstructed later** — for example, whether an anchor means absolute input start or line start, rather than the source token that happened to express it;

**source provenance** sufficient to explain diagnostics through normalization and lowering;

and **stable semantic identity** sufficient to track one author-level entity even when it is duplicated, expanded, renumbered, or represented by several target-level constructs.

The Semantic IR should **not** contain PCRE2 option constants, ECMAScript flag letters, Python `re` flags, target escape choices, target capture numbering, serializer decisions, or backend workarounds. ECMAScript itself illustrates why that separation matters: its RegExp semantics explicitly carry state such as `IgnoreCase`, `Multiline`, `DotAll`, `Unicode`, and `UnicodeSets` during compilation/matching, rather than treating the corresponding surface flag characters as the semantics themselves. [source-verification note](#source-verification-gaps)

Likewise, the Semantic IR generally should not be burdened with a mutable set of “requires PCRE2 feature X” annotations. **Intrinsic semantic properties belong in the IR; target support judgments belong in analysis and planning.** The same semantic operation can become directly legal, legal only after lowering, or unsupported depending on the selected target profile. MLIR's conversion architecture provides a useful precedent: legality is defined relative to a conversion target, can even be dynamic per operation instance, and legalization rules transform illegal operations into legal ones. [source-verification note](#source-verification-gaps)

A useful Fourth Edition pipeline is therefore:

```text
frontend source
     │
     ▼
Source AST / frontend IR
     │  resolve + desugar + normalize semantic intent
     ▼
Canonical Semantic IR
     │
     ├──────────────► semantic-analysis facts
     │
     ├──────────────► requirements / portability planning
     │                         │
     │                         ▼
     └─────────────────► target legalization
                               │
                               ▼
                         Target IR
                               │
                        deterministic print
                               ▼
                       TargetArtifact
                 { pattern, options, metadata }
```

The important invariant is not that every stage retain the same tree shape. It is:

> **Every lowering step must be able to explain which semantic obligation it is implementing and which stable semantic entities it preserves.**

### Repository and campaign evidence boundary

There is an important limitation on the “current Fourth Edition architecture” portion of this report. I queried the `architecture/v4` repository branch through the GitHub integration, but the retrieved branch-tree response was not available in usable file-content form when this synthesis was finalized. Direct public opening of the branch also failed. The supplied Notion campaign URL likewise could not be retrieved through the completed public lookup. I therefore **cannot responsibly characterize particular Fourth Edition files, types, or passes as already implemented versus merely planned**.

Accordingly, references below to the “current architecture” mean the architecture stated in the research brief—frontend/source representations, canonical semantics, normalization, requirements, target profiles, portability planning, lowering, deterministic serialization, and `TargetArtifact`—not a claim that corresponding Rust implementations currently exist. That distinction is material and avoids doing exactly what the request warned against: confusing intended architecture with implemented architecture.

The compiler-design conclusions themselves are independent of that access limitation; repository-specific recommendations should be validated against the actual `architecture/v4` Rust types before being turned into refactoring work.

## The layer taxonomy STRling needs

Compiler terminology such as AST, HIR, MIR, semantic IR, and target IR is useful only if each layer has a specific information contract. STRling should define those contracts rather than adopting conventional names because other compilers use them.

The most useful taxonomy for this domain is six layers.

| Layer | Governing question | Information that belongs here | Information that does not |
|---|---|---|---|
| **Source AST / frontend IR** | What did this frontend say? | Source forms, syntactic grouping, aliases/macros, frontend-specific constructs, comments/doc associations, exact spans, parse-recovery state | Target support, target syntax, canonical capture numbering |
| **Semantic IR** | What matching behavior has the program asked STRling to compile? | Target-independent matcher structure, character predicates with defined semantic domains, assertions, quantification semantics, semantic mode/context, captures and references by stable identity, provenance | PCRE2/JS/Python spellings, backend flags, portability verdicts, target numbering |
| **Analysis facts** | What is true about this semantic program? | Derived properties, resolved references, nullable/width facts when useful, semantic requirements, feature facts, validation results | Target rewrites or serialization choices |
| **Portability plan** | Can this semantic program be realized under this target profile, and how? | Target-relative support/legalizability results, selected lowering strategies, diagnostics, relevant profile/version conditions | New canonical semantics or target syntax tree structure |
| **Target IR** | What target-native construction will implement the semantics? | Target grouping, target captures/numbers, target assertions, scoped/global options, emulation expansions, escape/literal strategy, target-only helper structures | Frontend syntax; unresolved portability questions |
| **TargetArtifact** | What must a consumer provide to the target runtime? | Deterministically serialized regex plus runtime/compiler options and necessary metadata | Semantic analysis or alternative lowering strategies |

This separation closely parallels the useful part of MLIR's legalization model without requiring STRling to imitate MLIR mechanically. MLIR separates the input operations from a **target-relative definition of legality** and from the rewrite patterns capable of producing legal forms. It supports full conversion, partial conversion, and analysis-only conversion, explicitly demonstrating that “what this operation means” and “whether this operation is legal for this destination” are different questions. [source-verification note](#source-verification-gaps)

### The placement test

For every proposed field or node, STRling should ask the following questions in order:

| Question | Placement |
|---|---|
| Would changing only the frontend spelling change this information while preserving meaning? | **Source AST**, not Semantic IR |
| Could two correct target backends choose different representations while implementing the same information? | **Semantic IR** if the information is an invariant; target representation itself belongs later |
| Is the value provably derivable from the Semantic IR and not required as its identity? | Usually **analysis fact** |
| Does the value depend on a target profile/version? | **Portability plan / target analysis** |
| Does it describe a particular realization chosen for one target? | **Target IR** |
| Is it required by the regex runtime but is not part of regex source text? | **TargetArtifact** |
| Is removing it liable to make two observably different author intentions indistinguishable? | Almost certainly **Semantic IR** |

A more stringent test is useful for controversial cases:

> **If the compiler threw this information away before target selection, could every backend still produce the right observable behavior, diagnostics, capture contract, and runtime configuration?**

If not, it belongs in the canonical semantics or canonical provenance/identity metadata.

Conversely:

> **Would putting this information in Semantic IR force the IR to know which backend was selected?**

If so, it almost certainly belongs later.

### AST, HIR, MIR, and Semantic IR are roles, not a required sequence

STRling does not inherently need separate data structures named AST, HIR, and MIR. Those names denote useful distinctions in many compilers, but multiplying IRs is justified only when a new representation establishes a meaningful invariant.

For STRling, a frontend AST plus one canonical Semantic IR plus target IRs may be enough.

A separate HIR-like layer becomes justified if frontend desugaring and name/reference resolution produce a substantially cleaner representation that still contains frontend concepts. A MIR-like canonical layer becomes justified only if STRling later needs a substantially more operational representation for sophisticated optimization or matching-machine compilation. Neither should be introduced simply to imitate general-purpose-language compilers.

This principle is especially important for regex compilation because a large “universal regex IR” can easily become nothing more than the union of PCRE, JavaScript, Python, .NET, Java, Ruby, and Oniguruma syntax. That is not a semantic IR. It is a compatibility catalog disguised as a type hierarchy.

## What the Semantic IR must preserve

A Semantic IR is genuinely semantic when two source forms with the same intended behavior are permitted to converge on the same canonical structure, while two source forms with observably different behavior cannot collapse merely because they look structurally similar.

Consider anchors. A weak IR might contain:

```text
Anchor("^")
Anchor("$")
```

That records syntax.

A semantic IR instead needs concepts closer to:

```text
Boundary(InputStart)
Boundary(InputEnd)
Boundary(LineStart)
Boundary(LineEnd)
```

subject to whatever exact boundary contracts STRling elects to support.

The reason is visible in ECMAScript's normative semantics: multiline state participates in the definition of assertions and matching behavior; it is not merely a pretty-printing choice. Likewise Unicode mode changes whether the input is interpreted in terms of code units or code points in relevant parts of RegExp matching. [source-verification note](#source-verification-gaps)

### Matching structure

The canonical representation should express only the behavioral combinators STRling actually promises.

Conceptually:

```text
Pattern
  └─ Expr
       ├─ Empty
       ├─ Sequence<Expr>
       ├─ Choice<Expr>
       ├─ Repeat { body, bounds, preference, ... }
       ├─ Capture { id, body }
       ├─ Assertion { ... }
       └─ CharacterPredicate { ... }
```

That is intentionally illustrative rather than an IR specification.

`Sequence` and `Choice` are semantic enough only if STRling defines the relevant choice/backtracking contract. `Repeat` is semantic only if its policy—greedy, reluctant, possessive, or some more abstract contract where applicable—is behaviorally relevant and preserved. Assertions should represent the condition being asserted, not the punctuation used by a particular regex grammar.

Some constructs resist clean unification. STRling should **retain such distinctions instead of inventing a false common denominator**. For example, a target feature whose behavior intrinsically depends on a particular engine's backtracking or capture model might have no honest target-independent operation. In that case the architectural answer may be to reject that construct from canonical portable semantics, expose it only through an explicitly target-bound facility, or defer support pending a sound semantic definition.

### Character semantics require more than a class-shaped node

A character predicate cannot be canonical merely because it has variants such as `Literal`, `Range`, and `Category`.

Its meaning depends on questions such as:

- What constitutes the matching unit: byte, Unicode scalar value/code point, UTF code unit, or something else?
- Which Unicode data/version defines properties?
- What does case-insensitive matching mean?
- What universe is being complemented by a negated class?
- What exactly does a named abstraction such as “word character” denote?
- Does “any character” include line terminators?

These are semantic questions because targets can disagree.

ECMAScript is an instructive example. Its specification distinguishes input characters as code units or code points depending on pattern mode, defines `CharSet` relative to that domain, and makes case canonicalization behavior mode-dependent. Its current RegExp record carries Unicode-related modes alongside ignore-case, multiline, and dot-all state. [source-verification note](#source-verification-gaps)

Therefore:

```text
CharacterClass("\w")
```

would be a poor canonical operation if `\w` means “whatever this backend calls word.”

A better canonical concept is an explicitly defined character predicate or a standardized STRling semantic class whose membership is part of STRling's contract.

Then:

```text
SemanticWordCharacter(...)
        │
        ├── PCRE2 lowering ─► native class under selected options
        ├── ECMAScript ─────► native class if semantics coincide
        └── Python re ──────► expansion/options/unsupported as needed
```

The backend is free to use a native shorthand only after proving, through its target profile and lowering rule, that the shorthand implements the canonical predicate under the selected configuration.

This is one of the clearest boundaries between semantic normalization and target lowering.

### Assertions and anchors

Assertions should likewise be semantic predicates over match position and surrounding input, rather than target syntax tokens.

A target-independent representation may reasonably distinguish concepts such as input boundaries, line boundaries, word/nonword transitions, positive/negative lookaround, and other assertions **only to the extent STRling has a clear behavioral contract for them**.

It should not assume that because two engines spell something similarly they implement identical semantics.

The Semantic IR's obligation is to say what position condition the author requested. The backend's obligation is to decide whether the target has:

1. an exact native realization;
2. a semantics-preserving expansion;
3. a realization requiring runtime options;
4. no supported realization under the selected target profile.

That decision belongs to legalization.

### Quantifiers

A canonical repeat operation should carry **behaviorally relevant parameters**, not spelling.

For example:

```text
Repeat {
    body: SemanticId,
    min: 2,
    max: Some(5),
    selection_policy: Greedy
}
```

might lower to whichever target syntax expresses `{2,5}` with the intended preference.

Whether an unbounded repetition was originally written with a frontend shorthand or an explicit range is normally frontend provenance, not semantics. Whether the author requested greedy versus reluctant behavior is potentially semantic because it can affect capture results and match selection even where accepted language is unchanged.

This points to an important principle:

> **Regex semantics cannot be reduced to the set of strings accepted.**

Capture results, selected spans, and sometimes match-search behavior are observable parts of the compilation contract. A Semantic IR that preserved only language recognition would be insufficient for a regex-intent compiler whose generated artifact is consumed through ordinary regex APIs.

### Modes are semantic context, target flags are not

Case-insensitive matching, multiline interpretation, dot/newline treatment, character-domain assumptions, and similar settings should be represented at the level where they alter the meaning of contained operations.

They need not necessarily be fields repeated on every node. They could be lexical semantic context, scoped operations, or normalized effective settings.

What should **not** appear in canonical semantics are strings such as:

```text
flags = "imsu"
pcre2_compile_options = PCRE2_UTF | PCRE2_UCP
python_flags = re.MULTILINE | re.IGNORECASE
```

Those are target realizations.

The distinction is not academic. ECMAScript defines a compilation/matching record whose boolean semantic state is then derived from surface flags; the specification separately defines production of flag characters for the `flags` property. That demonstrates the conceptual separation between matching state and its external serialization. [source-verification note](#source-verification-gaps)

A STRling pipeline should similarly be able to lower:

```text
Semantic mode:
    line_boundaries = enabled
```

into, hypothetically:

```text
Target A: inline scoped modifier
Target B: top-level compile option
Target C: expanded assertions
```

without changing the canonical program.

### Captures need first-class semantic identity

Captures deserve stricter treatment than ordinary structural nodes because they cross the compiler/runtime boundary.

Each user-observable capture should receive a stable semantic identity before target lowering:

```text
CaptureId
```

References—including semantic backreferences or future capture-related operations—should resolve to that identity, not to a numeric group position.

A capture can additionally have:

```text
CaptureMeta {
    id: CaptureId,
    public_name: Option<...>,
    provenance: ...,
}
```

The exact Rust representation is an implementation choice.

What matters is the invariant:

> `CaptureId` denotes the same semantic capture regardless of target numbering or structural rewriting.

Target lowering can then build a separate map:

```text
CaptureId("year")  → PCRE2 group 3
CaptureId("year")  → ECMAScript group 2
CaptureId("year")  → Python group 4
```

if lowering has introduced auxiliary groups or eliminated structurally unnecessary groups.

A serializer must never feed generated target group numbers backward into canonical semantics.

This is particularly important because target regex specifications frequently treat capture numbering as a syntactic structural property. ECMAScript, for example, explicitly records the count of left-capturing parentheses and models captures as input ranges. [source-verification note](#source-verification-gaps) STRling needs a semantic identity above that target-level numbering mechanism precisely so that its API contract survives structural lowering.

Where possible, lowering-generated parentheses should be noncapturing. Where an engine forces an auxiliary capturing construct, that target capture should be marked **synthetic** and excluded from STRling's semantic-capture map unless the runtime makes that impossible. Any unavoidable perturbation of the externally visible capture interface should be treated as a backend contract problem, not quietly accepted as “equivalent regex.”

### Provenance must survive normalization without dictating tree shape

Source locations should be metadata orthogonal to semantics.

Every semantically meaningful node should have enough provenance to answer:

- what author construct originated this operation?
- if several constructs contributed, what are they?
- if this node was synthesized, which semantic operation caused synthesis?
- if a diagnostic occurs during PCRE2 lowering, what source construct should the user see blamed?

A single `Span` field is sufficient for simple one-to-one transformations but becomes inadequate after:

```text
source construct A
       │
       ├────► semantic node X
       └────► semantic node Y

source constructs B + C
       └────► semantic node Z
```

A practical provenance model should therefore permit:

```text
PrimarySource(span)
DerivedFrom(origin_id)
CombinedFrom(origin_ids...)
Synthetic(reason, parent_origin)
```

without requiring every transformation to preserve source-tree topology.

Stable **semantic identity** and **source identity** should not be conflated. A transformed semantic operation can retain its semantic identity while accumulating derived provenance; conversely, several semantic operations can originate from one source construct.

This gives diagnostics a trace back to author intent without making normalization hostage to surface syntax.

## Analysis, requirements, and portability must remain outside canonical meaning

The most subtle boundary is between the semantic program and facts known about that program.

The key principle is:

> **The Semantic IR should contain facts necessary to state the program's meaning. Analysis should contain facts that can be derived from that meaning.**

For example:

```text
Repeat(body, 0..∞)
```

belongs in Semantic IR.

A calculated fact such as:

```text
body_is_nullable = true
```

normally belongs in analysis.

Likewise:

```text
Lookbehind { ... }
```

may belong in Semantic IR if STRling defines lookbehind semantically.

Facts such as:

```text
requires_lookbehind
maximum_lookbehind_width = ...
PCRE2_10_xx_can_lower = true
ECMAScript_profile_Y_can_lower = false
```

do not describe the same kind of information and should not all be stuffed onto that node.

### Requirements should normally be derived

The cleanest architecture is:

```text
Semantic IR
     │
     ▼
Requirement analysis
     │
     ▼
SemanticRequirements
```

where requirements form a derived summary of semantic obligations.

That summary can be cached if performance warrants, but the Semantic IR should remain the source of truth.

This prevents a classic compiler failure mode: the IR contains both the actual operation and an independently maintained `required_features` field, after which transformations update one but not the other.

Derived requirements also compose naturally. A sequence's requirements can be computed from its children plus any requirements imposed by its own semantics.

There are two exceptions.

First, if the **author explicitly requests a constraint**, such as “this must compile under profile X” or “this semantic mode is required,” that request is part of program/configuration intent and should survive as such. It is not the same as a compiler-inferred requirement.

Second, some semantic operations may deliberately encode a capability-like contract because the capability **is itself the meaning**. That should be rare and named semantically rather than after whichever target first motivated it.

### Capability and legality are target-relative

A semantic requirement is target-independent only when phrased as an obligation:

```text
needs an assertion with semantic property P
needs capture-reference behavior Q
needs character predicate C
```

The conclusion:

```text
PCRE2 profile 10.xx supports it directly
```

is target-relative.

That distinction maps very closely to MLIR's conversion architecture. MLIR does not require an operation to carry a declaration saying whether it is legal for every eventual backend. A `ConversionTarget` defines legal, illegal, and dynamically legal operations for the particular conversion, while rewrite patterns establish routes from currently illegal forms to legal ones. [source-verification note](#source-verification-gaps)

For STRling:

```text
Semantic operation
       │
       ▼
target profile + target semantic model
       │
       ├─ natively legal
       ├─ legalizable
       └─ unsupported
```

is a substantially healthier architecture than:

```text
SemanticOperation {
    works_in_pcre2: ...
    works_in_js: ...
    works_in_python: ...
}
```

The latter contaminates the canonical layer every time a target or target version is added.

### A PortabilityPlan should describe a decision, not become another IR

Given Fourth Edition's intended portability-planning stage, the most useful plan is a **side structure keyed by stable semantic IDs**:

```text
PortabilityPlan {
    target_profile,
    decisions: {
        SemanticId → LoweringDecision
    },
    required_runtime_configuration,
    diagnostics,
}
```

Possible decision categories could conceptually include:

```text
Native
Legalize(strategy)
Unsupported(reason)
```

The labels are less important than keeping the plan from duplicating the entire semantic tree.

That avoids a “shadow IR” in which Semantic IR and portability-plan tree must forever remain synchronized.

The plan may also be the right home for target-relative evidence:

```text
SemanticId #42
  obligation: absolute-end assertion
  target: ...
  chosen realization: ...
  profile condition: ...
```

This gives excellent diagnostics and explainability without inserting target knowledge into canonical semantics.

### Do not normalize away backend choices too early

Normalization should have a clear stopping rule:

> Normalize differences that are provably irrelevant to STRling semantics; preserve distinctions whose equivalence depends on target behavior or on a nontrivial rewrite.

Good canonical normalization might include:

```text
Sequence([Sequence([A, B]), C])
              ↓
Sequence([A, B, C])
```

assuming source provenance remains recoverable.

Similarly, frontend aliases can be resolved to their semantic definitions.

But an operation should **not** be replaced merely because one backend happens to implement it using another form.

For example:

```text
semantic assertion X
   ↓  [because PCRE2 can emulate X with construct Y]
semantic Y
```

is likely the wrong boundary.

It should instead be:

```text
semantic X
   ↓ target legalization
target construction Y
```

The distinction lets a future backend implement X directly and, more importantly, prevents PCRE2's available tricks from redefining what STRling considers canonical.

### Record expensive facts deliberately, not accidentally

Some derived facts may be expensive enough or foundational enough to retain between passes.

Examples could include resolved-reference tables, width/range analyses needed repeatedly, or normalized character sets.

The test should not be “is this semantic?” but:

1. Is it deterministically derivable from the canonical program?
2. What invalidates it?
3. Is recomputation cheap and less error-prone?
4. Will many downstream passes need exactly the same result?
5. Can it be represented as an analysis product keyed by semantic identity instead of mutating canonical nodes?

The default should be analysis side tables or immutable analysis results.

Attaching derived facts permanently to every node makes transformations responsible for cache coherency and encourages Semantic IR to become an omnibus structure.

## Legalization, Target IR, and artifacts

Target lowering should be understood as **legalization against a versioned target profile**, not primarily as pretty-printing.

That distinction is central.

MLIR's conversion framework explicitly distinguishes three useful modes: full conversion, which succeeds only when all input has been legalized; partial conversion, which allows appropriately classified operations to remain; and analysis conversion, which determines what could be legalized without committing the rewrites. [source-verification note](#source-verification-gaps) STRling can profit from the concepts even with a much smaller implementation.

### Profile before lowering

A target should not simply be:

```text
Target::Pcre2
```

if relevant semantics depend on engine version, bindings, compile configuration, or runtime assumptions.

The effective input to lowering should be a target profile:

```text
TargetProfile
    engine/family
    semantic version or compatibility level
    supported facilities
    runtime constraints
    option policy
```

The profile is not canonical semantics. It is the environment in which the semantic program is being legalized.

That produces a clean function boundary:

```text
plan(
    semantic_ir,
    target_profile
) -> Result<PortabilityPlan, Diagnostics>
```

followed by something like:

```text
lower(
    semantic_ir,
    portability_plan
) -> Result<TargetIR, Diagnostics>
```

Whether those are literally separate Rust functions is secondary. The conceptual split is valuable because **support analysis should be possible without mutating the program**.

### Legality should be defined over instances, not only feature names

A boolean table:

```text
lookbehind: supported
```

will often be too coarse.

MLIR explicitly supports **dynamic legality**, where legality depends on the operands, types, attributes, or other properties of a specific operation. [source-verification note](#source-verification-gaps) Regex lowering has the same architectural need.

Conceptually:

```text
legal(target, semantic_op, context) -> Legality
```

can account for constraints on a particular instance without baking them into the canonical operation taxonomy.

The exact predicates will differ by target and should be discovered through target-specific work rather than anticipated in a giant universal schema.

### Legalization should be monotonic

Once target lowering begins, the compiler should move toward a representation whose operations have progressively stronger target guarantees.

A useful phase contract is:

```text
Semantic IR
   ↓
Target legalization IR      // optional transitional mixture
   ↓
Fully legal Target IR
   ↓
Serialization
```

STRling may not need a distinct transitional data type. A lowering implementation can construct fully target-specific nodes directly.

The important property is that the serializer should **never be asked to discover how to implement semantics**.

A serializer should not contain logic such as:

```text
if this assertion unsupported:
    try rewrite ...
else if profile ...
```

By serialization time, those questions should be settled.

### Partial lowering is useful internally; partially legal artifacts are not

There is real value in partial legalization for diagnostics and development.

Suppose:

```text
Sequence
 ├─ A → directly legal
 ├─ B → legal through expansion
 └─ C → unsupported
```

The planner can still report that A and B are viable and identify C precisely. That is conceptually analogous to MLIR's partial or analysis conversion facilities. [source-verification note](#source-verification-gaps)

But normal production compilation should impose a stronger boundary:

> **No `TargetArtifact` unless the target IR is fully legal for the selected profile.**

An unsupported semantic operation should remain represented by its semantic identity plus a diagnostic; it should not be silently serialized into an approximation.

This keeps “unsupported” from becoming an accidental semantics-changing rewrite.

### The target IR should be unapologetically target-specific

Trying to make Target IR portable defeats its purpose.

For PCRE2, a Target IR may legitimately know about PCRE2-specific grouping forms, modifiers, compile options, escaping constraints, and any other details needed for deterministic emission.

An ECMAScript Target IR can legitimately model the pattern-plus-flags shape expected by that environment.

Python may need a representation corresponding to pattern text plus `re`-level flags/configuration.

The exact schemas should follow what each backend needs. They need not be isomorphic.

Canonical semantics gives backends a common input; it does **not** require the backends to converge again on a universal output representation.

### TargetArtifact must be wider than a string

A regex compiler is not finished merely because it has produced regex source.

ECMAScript's own semantics make the point clearly: mode state such as ignore-case, multiline, dot-all, Unicode, and Unicode Sets is carried separately from the pattern grammar and is observable through RegExp flags. [source-verification note](#source-verification-gaps)

So Fourth Edition's stated direction toward a structured `TargetArtifact` is architecturally sound.

Conceptually:

```rust
TargetArtifact {
    pattern_source: String,
    options: TargetOptions,
    metadata: ArtifactMetadata,
}
```

The crucial requirement is that `TargetOptions` be **typed target data**, not an unstructured string bag.

For example, an ECMAScript backend might eventually produce an artifact corresponding conceptually to:

```text
pattern: "..."
flags:   "imsu"
```

whereas an embedding of another engine might require integer compile options, match options, encoding assumptions, or host-library configuration.

These are target realization facts, so they belong in `TargetArtifact`, not Semantic IR.

The artifact should distinguish at least:

- options required for semantic correctness;
- options merely chosen as implementation defaults;
- optional metadata not required to execute the regex.

That distinction prevents a consumer from discarding an “optional-looking” flag that actually carries part of the compiled program's meaning.

### Deterministic serialization needs a stricter input contract

Determinism should be established before or at Target IR construction, not patched afterward by sorting arbitrary structures.

Given identical:

```text
Semantic IR
TargetProfile
compiler/lowering version
relevant compilation configuration
```

STRling should choose one canonical lowering and produce byte-identical target pattern/options unless nondeterminism is explicitly part of the API.

This means deterministic policies for:

- target capture numbering;
- traversal order;
- generated names;
- equivalent escape choices;
- option ordering;
- character-class serialization;
- helper-group ordering;
- diagnostic ordering where snapshots depend on it.

The strongest architecture is:

```text
legal Target IR
     │
     │ no semantic decision remaining
     ▼
pure deterministic serializer
     ▼
TargetArtifact
```

If two target spellings are semantically equivalent, the serializer should use a fixed canonical preference. It should not depend on hash-map iteration order or incidental construction history.

## Identity, evolution, and semantic-preservation testing

The principal long-term risk is not an insufficient number of node variants. It is losing the ability to tell what remained the same across stages.

### Use several kinds of identity

STRling should distinguish at least conceptually:

**source/provenance identity** — where author intent came from;

**semantic operation identity** — which canonical semantic entity this is;

**capture identity** — which externally observable capture this is;

**target-node identity**, if needed — an implementation-local identity useful during lowering.

Do not reuse tree position as any of these.

Tree positions are unstable under the exact operations compilers need: flattening, expansion, normalization, helper insertion, and target legalization.

A stable semantic-ID scheme does not mean IDs must be globally persistent UUIDs. They can be compilation-local opaque keys unless Fourth Edition needs cross-build identity for caching, IDE integration, or serialized IR. The architectural requirement is weaker and more important: **references and provenance relations must not depend on mutable structural position.**

### Preserve capture contracts explicitly through lowering

A useful target-lowering result should include a capture projection:

```text
SemanticCaptureMap {
    CaptureId → TargetCaptureBinding
}
```

Potential bindings could include:

```text
Named(...)
Numbered(...)
Derived(...)
Unavailable(...)
```

depending on what STRling actually supports.

This map is an important part of correctness because generated regex APIs expose more than a yes/no match.

Consider:

```text
Semantic IR

Capture #customer {
    Sequence(...)
}

             target lowering

        ┌───────────┴───────────┐
        ▼                       ▼

target group 1           synthetic helper group
maps to #customer        no semantic identity
```

The external result projection must know which group is the author's capture.

Backreferences should similarly refer to `CaptureId` through canonical stages and be translated only after target capture layout is finalized.

### IR compatibility should not become an accidental public API

Fourth Edition should distinguish:

1. **the internal Rust representation**;
2. **any debug/textual dump format**;
3. **any persisted or interchange format**.

Only the latter two need compatibility policies, and only if users/tools are expected to rely on them.

Changing an enum layout in Rust should not require an elaborate IR-version migration layer merely because the type is called “Semantic IR.”

But if Semantic IR is persisted—for caches, golden fixtures, language-server handoff, or inter-process compilation—it should carry an explicit schema/version boundary and have defined compatibility behavior.

The version should describe **representation compatibility**, not target capability.

Target profiles should evolve independently. Otherwise a new PCRE2 version risks forcing a Semantic IR version bump even when the canonical semantics are unchanged.

### Favor additive semantic evolution, but reject “miscellaneous feature” escape hatches

A Semantic IR inevitably evolves as STRling learns where its semantic boundaries really are.

Safer changes include:

```text
new clearly defined semantic operation
new optional metadata
new analysis result
new target-lowering strategy
```

More dangerous changes include:

```text
TargetExtension(String, Map<String, Any>)
RawRegex(String)
Feature { backend, code, args }
UniversalGroup { 27 boolean switches ... }
```

inside the canonical representation.

Such escape hatches make the type superficially extensible while destroying the compiler's ability to reason about meaning.

If STRling eventually needs target-specific escape syntax, it should be explicitly outside portable canonical semantics rather than smuggled through a supposedly target-independent node.

### Test stage contracts, not merely final strings

Golden tests for emitted PCRE2 are necessary but insufficient.

Fourth Edition should have distinct test layers.

**Frontend → Semantic IR tests** should prove that different source sugar normalizes to the intended canonical meaning and that provenance/capture identities survive.

```text
source spelling A ─┐
                   ├─► expected semantic structure
source spelling B ─┘
```

where A and B are intended aliases.

**Semantic analysis tests** should verify derived facts independently of lowering.

**Planner/legalization tests** should feed hand-constructed Semantic IR into target profiles and assert:

```text
native
legalizable by strategy X
unsupported with diagnostic Y
```

This isolates target reasoning from frontend behavior.

**Semantic IR → Target IR tests** should verify the exact selected realization and identity projection.

**Target IR → artifact tests** should be strict deterministic golden tests: pattern source, flags/options, capture maps where exposed, and relevant metadata.

**Runtime differential/conformance tests** should compile generated artifacts with the actual target runtime and compare observable outcomes against semantic expectations over curated cases. For regex compilation, the observable result should generally include match spans and capture results where relevant, not merely acceptance.

Testing should also exercise target-profile boundaries explicitly. The same Semantic IR should be compiled against multiple profiles without mutation:

```text
                 ┌─► PCRE2 profile A
Semantic IR ─────┼─► ECMAScript profile B
                 └─► Python profile C
```

If compiling target A mutates data subsequently seen by target B, the canonical representation has ceased to be canonical.

## Concrete Fourth Edition recommendations and open questions

Given the intended Fourth Edition architecture described in the brief, the following boundaries are the most consequential.

### Recommended architecture

The center of the compiler should look conceptually like this:

```text
┌───────────────────────────────────────────────────────────┐
│ Frontend                                                   │
│ syntax, sugar, declarations, author-facing constructs      │
└──────────────────────┬────────────────────────────────────┘
                       │ resolve / normalize
                       ▼
┌───────────────────────────────────────────────────────────┐
│ Semantic IR                                               │
│                                                           │
│ matcher behavior                                          │
│ semantic character predicates                            │
│ semantic boundaries/assertions                           │
│ repetition behavior                                      │
│ semantic mode/context                                     │
│ CaptureId / references                                    │
│ provenance                                                │
└──────────────┬──────────────────────────────┬──────────────┘
               │                              │
               ▼                              ▼
        analysis facts                requirement analysis
                                              │
                                              ▼
                                      TargetProfile
                                              │
                                              ▼
                                      PortabilityPlan
                                     / legalization
                                              │
                                              ▼
┌───────────────────────────────────────────────────────────┐
│ Target IR                                                 │
│ target syntax model, target captures, modifiers, helpers  │
└────────────────────────┬──────────────────────────────────┘
                         │ deterministic serialization
                         ▼
┌───────────────────────────────────────────────────────────┐
│ TargetArtifact                                            │
│ regex source + required runtime/compiler options          │
└───────────────────────────────────────────────────────────┘
```

### Information-placement matrix

For the Fourth Edition design review, this is the most useful concrete checklist.

| Information | Correct home | Reason |
|---|---|---|
| Original keyword/operator/token spelling | Source AST | Frontend fact |
| Exact source span | Provenance attached through canonical stages | Diagnostics |
| Macro/alias/sugar origin | Source/provenance | Not target semantics |
| Concatenation/sequence | Semantic IR | Matching intent |
| Choice/alternation | Semantic IR | Matching intent |
| Quantifier bounds | Semantic IR | Observable behavior |
| Greedy/reluctant/etc. policy, where STRling promises it | Semantic IR | Can affect observable result |
| User capture | Semantic IR with `CaptureId` | API-observable |
| Target capture number | Target IR | Chosen by lowering |
| User capture name/role | Semantic IR metadata | Author-visible identity |
| Generated helper capture | Target IR | Backend implementation |
| Reference to capture | Semantic IR by `CaptureId` | Must survive renumbering |
| Line-start vs input-start meaning | Semantic IR | Semantic distinction |
| `^` or `\A` spelling | Target IR/source AST depending direction | Syntax |
| Case-insensitive semantic scope | Semantic IR | Meaning |
| `i` flag / target option constant | Target IR / TargetArtifact | Realization |
| Unicode/character-domain contract | Semantic IR where meaningful | Determines character behavior |
| PCRE2 UTF/UCP-style implementation settings | TargetArtifact | Runtime/compiler configuration |
| Character predicate membership | Semantic IR | Meaning |
| Target character-class spelling | Target IR | Realization |
| “requires feature X” inferred from operations | Analysis facts | Derivable |
| “supported by target Y version Z” | Portability plan | Target-relative |
| Selected emulation strategy | Portability plan / Target IR | Target-relative choice |
| Unsupported-target reason | Plan/diagnostic | Not canonical semantics |
| Escaping strategy | Target IR / serializer | Target syntax |
| Serialization order | Target serializer | Representation choice |
| Compiler configuration necessary to execute artifact | TargetArtifact | Runtime contract |
| Semantic schema version, if persisted | IR envelope | Representation evolution |
| Target profile version | TargetProfile/artifact metadata | Target evolution |

### Risks of an under-specified Semantic IR

The largest risk is a canonical representation that says approximately what the author meant and relies on backends to fill gaps.

Typical warning signs are nodes such as:

```text
Anchor
CharacterClass("word")
CaseInsensitive
Group
```

without precise semantic definitions.

That architecture causes target backends to become de facto language specifications. PCRE2 lowering decides one interpretation, JavaScript another, Python another, and all appear “correct” because the Semantic IR never recorded which behavior was required.

An under-specified IR also makes portability diagnostics circular: the planner cannot determine whether a target preserves meaning because canonical meaning is not precise enough to compare with the target's behavior.

The ECMAScript specification demonstrates how subtle apparently simple regex settings can be: Unicode mode changes the input model, case canonicalization has defined behavior, and matching state explicitly includes multiline, dot-all, and case-related modes. [source-verification note](#source-verification-gaps) A portable compiler must be at least precise enough to avoid accidentally delegating these choices to the backend.

### Risks of an overstuffed universal IR

The opposite failure mode is more likely once PCRE2, ECMAScript, and Python backends are simultaneously active.

It looks like:

```text
enum SemanticRegex {
    ...
    PcreVerb(...),
    EcmaModifier(...),
    PythonFlag(...),
    JavaPossessiveMode(...),
    DotNetBalancingGroup(...),
    ...
}
```

or a generic node with enough switches to represent all of them.

That creates three problems.

First, target additions modify the canonical language even when STRling semantics have not changed.

Second, portability logic becomes encoded structurally: unsupported target constructs are present from the moment Semantic IR is created.

Third, “semantic normalization” becomes difficult because many operations represent target facilities rather than independently defined meanings.

The right question for every proposed operation is not:

> “Does some regex engine support this?”

It is:

> **“Can STRling define the observable intent of this operation independently enough that multiple implementations could realize it?”**

When the answer is no, postponing abstraction is better architecture than manufacturing one.

### Recommended legalization contract

A useful legalization API should conceptually distinguish:

```text
Native
Legalizable { strategy, conditions }
Unsupported { reason, semantic_origin }
```

and legality should be profile- and instance-sensitive.

The design lesson from MLIR is particularly strong here: legality can be static or dynamic, and conversion patterns need not lower an operation directly to final target form; legalization can pass through intermediate representations so long as the final conversion target is satisfied. [source-verification note](#source-verification-gaps)

STRling should borrow that **principle**, not necessarily its framework.

For an early implementation, an explicit Rust `match` over semantic operations plus profile-specific legalization routines may be much easier to understand and audit than building a general rewrite engine.

Do not create a generic conversion framework until actual backend complexity demonstrates that one is needed.

### Recommended invariant documentation

Every Semantic IR variant should be documented with four statements:

```text
Meaning:
    What observable intent does it represent?

Canonicalization:
    What frontend distinctions have already been erased?

Preservation:
    Which identity/provenance obligations survive rewrites?

Lowering obligation:
    What must a backend preserve, without specifying how?
```

Every Target IR variant should instead document:

```text
Target meaning:
    What target facility is represented?

Legality:
    Under which target profile is it valid?

Semantic origin:
    Which semantic operation(s) caused it?

Serialization:
    What deterministic output obligation does it impose?
```

This would do more to protect Fourth Edition's architecture than creating additional IR layers.

### Open questions requiring experimentation

Several questions should deliberately remain unresolved until PCRE2 implementation experience supplies evidence.

**Capture observation contract.** STRling needs to decide precisely what constitutes semantic equality for captures: group existence, names, matched substring, participating/nonparticipating state, capture span, behavior under repetition, and possibly all repeated captures versus final capture. This decision determines how much a backend is allowed to restructure captures. The fact that ECMAScript formally models captured ranges illustrates that capture behavior is part of runtime semantics, not merely output decoration. [source-verification note](#source-verification-gaps)

**Match-selection contract.** STRling should determine where greedy/lazy choice, ordered alternation, and engine backtracking behavior become part of portable intent. Some regex constructs share accepted languages while differing observably in selected spans or captures. Pretending all such behavior can be abstracted uniformly would be premature.

**Character-domain contract.** A prototype should establish whether canonical character predicates operate on Unicode scalar values/code points, another explicitly defined domain, or a mode-dependent abstraction. The choice must be made before character-class lowering can be considered semantics-preserving. ECMAScript's own distinction between code units and code points under Unicode mode shows why leaving this implicit is unsafe. [source-verification note](#source-verification-gaps)

**Mode scoping.** Experimentation should determine whether effective semantic modes are cleanest as an explicit scoped node, inherited context normalized during construction, or properties embedded only in affected operations. The answer should optimize semantic clarity rather than mirror inline regex modifiers.

**Requirements granularity.** Once real PCRE2 lowering exists, measure whether requirements are best represented as a compact program-level set, per-node analysis records, or both. Avoid fixing an elaborate capability lattice before actual legalization rules require it.

**Portability plan granularity.** Establish whether plans need one entry for every semantic node or only for nodes that require target-sensitive decisions. The latter is preferable unless diagnostics or tooling show a need for full coverage.

**Target IR granularity.** PCRE2 should be the experiment that determines whether a typed target tree materially improves lowering and deterministic serialization over a smaller structured emission model. Do not assume every backend needs a full second AST.

**Artifact execution contract.** The first production backend should prove that every runtime setting necessary for correctness is represented structurally in `TargetArtifact`, and that consuming only `pattern_source` is either impossible by type/API design or clearly documented as semantically incomplete.

**Persistent IR versioning.** Do not commit to cross-version Semantic IR compatibility until there is a concrete consumer that needs persisted IR. A debug dump can be intentionally unstable; an interchange format cannot.

**Repository alignment.** Because the actual `architecture/v4` source and Fourth Edition campaign content could not be fully inspected in the completed retrieval, the next architecture review should specifically compare existing Rust types against the placement matrix above before treating any recommendation here as a refactoring mandate.

### The governing answer

What, then, must STRling preserve between author intent and target lowering?

It must preserve **the complete observable matching contract that a target backend is not authorized to choose for itself**.

That means preserving:

```text
                    AUTHOR INTENT
                         │
            frontend syntax may disappear
                         │
                         ▼
              ┌──────────────────────┐
              │ canonical semantics  │
              │                      │
              │ match relationships  │
              │ character meaning    │
              │ assertion meaning    │
              │ repetition behavior  │
              │ semantic modes       │
              │ capture identities   │
              │ semantic references  │
              │ provenance           │
              └──────────┬───────────┘
                         │
             target may choose HOW,
             never WHAT
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
       PCRE2        ECMAScript      Python re
          │              │              │
          └──────────────┼──────────────┘
                         ▼
              target-native artifacts
```

The Semantic IR should therefore be **smaller than the union of regex features and more precise than normalized regex syntax**.

Everything that answers **“what behavior is required?”** belongs at or above the Semantic IR boundary.

Everything that answers **“what can we infer about that behavior?”** belongs in analysis.

Everything that answers **“can target/profile X realize it, and by which strategy?”** belongs in portability planning and legalization.

Everything that answers **“which target construct will implement it?”** belongs in Target IR.

Everything that answers **“what exact source and external configuration must the runtime receive?”** belongs in `TargetArtifact`.

That boundary gives PCRE2, ECMAScript, Python `re`, and future backends substantial freedom to compile differently without granting any of them authority to redefine what STRling was asked to compile. It is the essential architectural property Fourth Edition should protect.
