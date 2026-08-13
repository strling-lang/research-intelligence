# Projecting Canonical STRling Compiler Intelligence into Host-Language Source

Role: Research report
Origin: OpenAI deep-research session commissioned for STRling Research Intelligence
Generated: 2026-08-12
Imported: 2026-08-12
Source verification: Partially verified
Last reviewed: 2026-08-12
Current status: Active input

## Source verification gaps

The imported report contained opaque research-session citation markers without a durable marker-to-source table. The markers were removed; unresolved claim-level citations, external comparisons, and proposed models require verification. Current-state claims were checked against the downstream authorities linked by the active inquiry.

## Executive architecture finding

The central answer is:

> **STRling should standardize one projection-and-provenance contract, not one embedding mechanism.** Host integrations should use the host language's own syntax/semantic machinery to identify candidate STRling regions and recover host-defined string values; a shared projection layer should represent the relationship between host text, decoded pattern text, semantic compiler input, and editor coordinates; and the canonical STRling compiler should remain the sole authority for STRling/regex syntax, semantics, diagnostics, analysis, normalization, and target behavior.

This is materially different from the historical STRling island-grammar proposal. That report is explicitly marked as historical, unreviewed input and makes virtual-document projection plus whitespace masking the normative mechanism. The newer canonical-compiler research establishes the stronger and more durable invariant: authoring syntax, source recovery, and presentation may vary by frontend, while meaning, semantic defaults, normalization, cross-node validation, analysis, and downstream policy belong to one canonical compiler. It also rejects forcing every frontend through a universal syntax AST.

That newer principle should govern embedded tooling as well. The integration architecture should therefore be:

```text
              HOST SOURCE SNAPSHOT
         Python / TS / C# / Rust / ...
                       │
                       │ host-owned parsing / PSI / AST / tokens
                       ▼
             HOST DETECTOR / EXTRACTOR
        "this expression denotes STRling/regex"
                       │
                       │ host syntax + literal-decoding evidence
                       ▼
          PROJECTION + PROVENANCE LAYER
        ┌────────────────────────────────┐
        │ HOST SOURCE                    │
        │          ↕                     │
        │ DECODED PATTERN SOURCE         │
        │          ↕                     │
        │ SEMANTIC SOURCE / NODE ORIGINS │
        └────────────────────────────────┘
                       │
                       ▼
             CANONICAL STRling COMPILER
       parsing · validation · normalization
       analysis · diagnostics · completion facts
                       │
                  canonical findings
             source ranges / provenance IDs
                       │
                       ▼
          PROJECTION + PROVENANCE LAYER
                       │
             host source ranges / edits
                       ▼
             EDITOR / LSP / IDE API
```

LSP is a transport and editor-integration standard, not an answer to the embedding problem. Its job is to standardize operations such as completion, hover, diagnostics, navigation, and edits between a language server and clients. Likewise, a virtual document is an implementation technique, not a semantic architecture.

VS Code's own embedded-language documentation is particularly instructive. It documents both embedded language services and request-forwarded virtual documents, uses whitespace-preserving virtual content in cases such as CSS embedded in HTML, but explicitly identifies difficult cases involving formatting, rename, stateful language services, and host/embedded encoding differences. As of its current documentation, VS Code recommends embedded language services where practical and notes that request forwarding cannot itself obtain pull diagnostics through the relevant VS Code provider mechanism.

The historical STRling proposal's key assumption—

> preserve source width, mask host interpolations with spaces, and thereby make host and virtual offsets identical

—is therefore useful only for a restricted class of embeddings. It fails as a universal invariant once the **semantic pattern is the decoded value of a host-language literal rather than its spelling**. Python escape sequences, Java text-block indentation removal, C# raw/interpolated strings, C/C++ translation and concatenation, Unicode encodings, and generated builder nodes all destroy the assumption that one host character corresponds to one compiler character. Python, for example, decodes ordinary string escapes and can delete a backslash-newline pair entirely; f-strings also have runtime replacement fields. Java text blocks strip incidental indentation and trailing whitespace before escape processing, so even a visually “raw-looking” multiline construct is not position-preserving. Clang goes so far as to provide a dedicated `StringLiteral::getLocationOfByte` facility because C/C++ strings can involve multiple concatenated tokens, escapes, escaped newlines, and other translation effects.

The architectural consequence is decisive:

**The invariant STRling needs is not “virtual offset equals host offset.” It is “every semantic finding carries enough provenance to be conservatively mapped back to the immutable host snapshot from which it was derived.”**

That also answers the report's governing question:

> **How can one compiler point at exactly the right characters in arbitrary host source without the integration becoming another compiler?**

By making the host adapter authoritative only for **host syntax and host decoding**, the canonical compiler authoritative only for **STRling meaning**, and a non-semantic **provenance relation** authoritative for translating ranges between them.

## Embedded-language taxonomy and host-source classification

There are two separate dimensions that should not be conflated: **how an editor integration obtains host-language structure**, and **how STRling compiler services are presented back to the editor**.

The mature systems surveyed demonstrate that no single mechanism spans all hosts and IDEs. TypeScript explicitly offers language-service plugins that can add errors or completions inside string literals for custom embedded languages, while stating that such plugins cannot change TypeScript syntax or type checking and are not loaded by `tsc`. JetBrains exposes PSI/UAST-oriented integration; its own guidance says physical `sourcePsi` should be used for source text ranges and specifically recommends `UInjectionHost`, rather than generic literal nodes, for string evaluation and language injection because interpolation complicates literal structure. C# tooling already uses `StringSyntaxAttribute` and `// lang=regex` cues to provide regex validation and highlighting in strings, including raw strings. Clang directly represents decoded string bytes and their source-token locations. Go's standard parser intentionally accepts a broader syntax than strictly valid Go in order to remain useful around errors and returns bad AST nodes during recovery. rust-analyzer similarly treats malformed source as a normal IDE condition: parsing produces a tree plus errors rather than failing, its syntax layer is full-fidelity and error tolerant, and its incremental architecture separates syntax, semantic analysis, IDE services, and LSP transport.

### Architecture taxonomy

| Architecture | What it actually provides | Strongest use | Fundamental limitation for STRling | Recommendation |
|---|---|---|---|---|
| **Virtual documents** | A projected standalone document consumed by another language service/compiler | Textual embedded language with simple, mostly position-preserving regions | Projection still needs extraction and source mapping; escaping, holes and multi-origin strings destroy offset identity | Supported implementation technique, never canonical architecture |
| **Direct host AST/PSI extraction** | Host compiler/parser tells STRling exactly what expression/token it is looking at | Literal decoding, call resolution, tagged templates, concatenation, annotations | APIs differ radically across languages and IDEs | Preferred host acquisition mechanism where available |
| **Editor language injection API** | IDE knows that a host range should receive another language's tooling | JetBrains injection, syntax coloring, editor-native UX | Editor-specific and often presentation-oriented | Use as an optimized presentation path |
| **Compiler/language-service plugin** | Runs inside or beside the host's canonical language service | TypeScript, Roslyn-style analyzers | Host-specific; may not run in build/CLI paths | Best option for first-class integrations |
| **Explicit STRling files** | No host projection | Canonical authoring, fixtures, debugging, mapping oracle | Does not solve embedded authoring | Keep as baseline and conformance reference |
| **Build-time extraction** | Analyze saved host files in CI/build | Repository-wide validation | Poor interactive behavior; malformed/incomplete source differs | Reuse the same extraction/projection library, not a separate implementation |
| **Hybrid** | Common projection contract with different host acquisition and editor presentation strategies | Multi-language STRling | More architectural upfront work | **Recommended universal model** |

VS Code itself essentially reaches the same conclusion for embedded languages: language services and request forwarding have different tradeoffs, and cross-region features and escaping can require special handling. Virtual resources can also reduce the richness available from language extensions; VS Code distinguishes basic, single-file, and workspace-aware behavior, and some rich extensions deliberately provide less functionality for virtual resources.

### Host-source classification

STRling should classify an embedding before attempting analysis. That classification determines whether exact decoding, semantic compilation, refactoring, or only presentation features are sound.

| Class | Example shape | Can exact decoded text be recovered statically? | Source relation | Recommended intelligence |
|---|---|---:|---|---|
| **Direct literal** | `"abc"`, raw literal, regex literal | Yes | Usually one origin, transformation may still be non-identity | Full |
| **Transformed literal** | escaped string, Java text block | Yes | Many-to-one, elisions, expansion possible | Full with explicit map |
| **Static concatenation** | `"ab" + "cd"`, adjacent C++ literals | Yes when host semantics prove constness | Many disjoint host origins → one decoded source | Full analysis; conservative edits |
| **Interpolated static skeleton** | template/f-string with holes | Only static fragments | Decoded regions plus unknown holes | Partial only under a compiler-supported hole/recovery model |
| **Tagged/injected template** | known STRling tag | Usually static fragments recoverable | Same as interpolation plus tag context | Good detection; semantics depends on hole policy |
| **Canonical Simply construction** | builder calls creating semantic nodes | Often no textual decoded pattern exists | Host syntax → semantic nodes | Compiler analysis through construction provenance |
| **Statically traceable composition** | builder variables/constants | Sometimes | Graph of multiple origins | Analyze only when host semantic model proves identity |
| **Dynamic construction** | arbitrary calls, runtime concatenation | No | Runtime-dependent | Do not invent a pattern |
| **Macro/generated source** | C++ macro, Rust macro | Depends on host expansion facilities | Spelling origin + expansion origin, often many-to-many | Analysis with dual provenance; edits restricted |
| **Malformed/partial source** | unfinished literal/call/template | Maybe | Uncertain boundaries | Recovery-mode features only |

This classification prevents a crucial architecture failure: confusing **detection confidence** with **semantic confidence**. A detector may know with near certainty that an expression is intended to be STRling even though its runtime pattern cannot yet be determined. The correct response is “embedded STRling, currently not fully projectable,” not to synthesize an approximate regex and pass it to the compiler as though it were real.

The four requested source concepts should consequently be treated as separate first-class objects:

| Layer | Definition | Owner |
|---|---|---|
| **HOST SOURCE** | Exact immutable source snapshot the developer typed, including delimiters, escapes, operators, interpolation syntax and comments | Host adapter/editor |
| **DECODED PATTERN SOURCE** | Host-defined resulting pattern text after lexical decoding and any statically defined literal transformation | Projection layer, using host semantics |
| **SEMANTIC SOURCE** | Input consumed by the canonical STRling frontend/compiler; it may be decoded text, a canonical semantic construction, or another officially supported frontend representation | Canonical compiler contract |
| **EDITOR COORDINATES** | Ranges expected by the editor/IDE/LSP client | LSP/editor adapter |

**Decoded pattern source must be optional.** A raw regex string clearly has one. A Simply expression that constructs canonical semantic nodes need not have a meaningful textual regex representation at all. STRling's current public architecture describes Simply as a semantic abstraction that constructs compiler representation rather than merely being an alternative spelling of a regex string, while the newer compiler research more generally places builder frontends above a single semantic-construction boundary.

That distinction matters for tooling. A duplicate-capture diagnostic caused by:

```ts
s.capture("name", ...)
 .then(s.capture("name", ...))
```

should point to the relevant builder argument/call sites through **semantic-node provenance**. It should not require generating a fake regex string, diagnosing the generated regex, and reverse-engineering which builder invocation produced it.

TextMate or grammar injection should have an intentionally smaller role. VS Code describes TextMate grammars as lexical tokenization based on regex rules, whereas semantic tokens derive from language-service knowledge and are applied as an additional contextual layer. Thus:

**TextMate/injection grammars may discover or color STRling-looking regions, but they must never become semantic evidence authoritative enough to produce canonical STRling diagnostics.**

## Projection, provenance, coordinates, and round-trip guarantees

This is the architectural core.

A flat source-map of the form:

```text
embedded offset + constant delta = host offset
```

is insufficient.

Even the standardized source-map format, despite explicitly supporting generated-to-original and bidirectional debugging use cases, represents position mappings rather than a complete reversible edit algebra; it allows generated regions with no original source and multiple original positions associated with a generated position. STRling needs an analogous concept, but tailored to **embedded-source provenance and safe editing**, not JavaScript debugging.

### The required provenance object

Each recognized embedding should produce an immutable `ProjectedUnit` conceptually like:

```text
ProjectedUnit
    id
    hostSnapshotId
    hostLanguage
    embeddingKind
    detectionEvidence
    decodedSource?          // absent for pure semantic builders
    semanticInput
    mapSegments[]
    hostConfigFingerprint
```

Each map segment should express a **relation**, not merely an offset:

```text
MapSegment
    semanticRange
    decodedRange?
    origins[]
        hostDocument
        hostRange
        role
        originKind
    transform
    editability
```

Useful transform kinds are:

```text
Exact
Escape
Elision
ConcatenationBoundary
InterpolationHole
SyntheticSemanticNode
MacroExpansion
MacroSpelling
HostNormalization
Unknown
```

Most ordinary raw text can be stored as large `Exact` runs, so this need not be expensive. Only unusual sections need explicit boundary tables.

The mapping should operate on **absolute boundaries** within immutable snapshots, not persist line/column pairs as the canonical internal identity of a character. Line/column coordinates are presentation formats that can be regenerated from the snapshot's line index.

LSP makes that requirement especially important. Current LSP supports negotiated position encoding, with negotiation added in 3.17; incremental document synchronization is part of the protocol, and UTF-16 remains the compatibility/default encoding when another encoding is not negotiated. The implementation cannot assume that “column 17” means the seventeenth Unicode scalar or seventeenth byte. gopls's architecture illustrates the practical solution: its protocol layer contains a mapper among UTF-8, UTF-16 and Go's `token.Pos`, while document snapshots carry identity, content and version information.

Python demonstrates why this conversion belongs at explicit boundaries. Python AST source columns are UTF-8 byte offsets because Python's parser operates internally in UTF-8. An editor speaking default LSP UTF-16 may therefore describe exactly the same source location using a different integer.

For example, with:

```text
🚀\d
```

a source representation can simultaneously involve:

- one Unicode scalar for 🚀;
- four UTF-8 bytes for 🚀;
- two UTF-16 code units for 🚀;
- one visible editor grapheme in most rendering contexts.

No component should silently relabel one of these coordinate systems as another.

### Non-bijective mappings are normal

The projection model must expect all of these:

**Many host characters → one decoded character.**

```python
"\\"
```

Two source backslashes denote one decoded backslash. Python explicitly defines `\\` that way. A diagnostic about that decoded backslash must generally highlight **the complete source escape**, not one of its two source characters.

**Many host characters → zero decoded characters.**

Python's backslash-newline escape is ignored. Java text-block incidental indentation is removed. Delimiters themselves also have no decoded pattern origin.

**One conceptual decoded character → several encoded units.**

A single non-BMP Unicode scalar can occupy four UTF-8 bytes and two UTF-16 code units. LSP's negotiated encoding and Python's UTF-8 AST offsets consequently cannot be translated by constant arithmetic.

**Several disjoint source regions → one decoded sequence.**

C and C++ concatenate string-literal tokens; Clang's AST records the number and locations of contributing literal tokens and exposes decoded bytes. Its dedicated byte-location routine exists specifically to cross escapes and concatenated tokens correctly.

**No decoded character → a semantic node.**

A Simply `.repeat(3, 5)` call can create semantic repetition structure without requiring textual `{3,5}` source. The relevant source provenance is the method invocation and its arguments, not generated regex characters. This follows directly from STRling's canonical-frontends principle that source origin is attribution rather than semantic meaning.

**One semantic fact → several host origins.**

A duplicate-name diagnostic, reference-resolution diagnostic, or composition error may naturally concern two builder calls or two concatenated fragments. LSP diagnostics can use one primary range plus related information; the projection layer should preserve the multiplicity rather than manufacture a giant source range covering unrelated operators and code.

**Macro source → multiple notions of origin.**

rust-analyzer explicitly models macro spans with hygiene context, and its architecture discusses syntax-to-semantic mappings that are not necessarily one-to-one. C/C++ likewise distinguishes token spelling and expansion through its source-management machinery; even ordinary strings can require translation-aware source recovery. STRling should retain both a user-facing expansion anchor and, where available, a spelling origin.

### Diagnostic mapping rule

A canonical diagnostic should conceptually be:

```text
CanonicalDiagnostic {
    diagnosticId
    sourceId | semanticNodeId
    primaryRange?
    relatedOrigins[]
    severity
    structuredArguments
    suggestedTransform?
}
```

It should **not** contain Python line/column, VS Code `Range`, Roslyn `TextSpan`, or Clang `SourceLocation`.

Projection then follows this rule:

> Find the smallest set of host-source spans whose provenance covers the compiler's semantic range without including unrelated source characters. If that set is one contiguous editable host range, use it as the primary range. If it is disjoint, choose the most causally relevant origin as primary and expose the remaining origins as related locations. If it is ambiguous or synthetic, widen to the smallest honest syntactic anchor rather than pretending character precision.

That gives intuitive results:

```python
rx("\\d{")
```

If the canonical compiler diagnoses the decoded `\d{`, the mapper can highlight the appropriate encoded source spelling even though the decoded backslash came from two source characters.

For:

```cpp
make_regex(
    "[a-"   // first literal
    "z"     // second literal
)
```

a finding crossing the concatenation boundary must be represented by two host origins; it must not highlight the comment/operator/gap between them merely to produce a single rectangular source range. Clang's own representation of concatenated literals strongly validates treating this as a first-class mapping problem rather than pretending the literal is one source token.

For a builder:

```csharp
s.Capture("x", ...)
 .Then(s.Capture("x", ...))
```

the canonical duplicate-capture fact should map through node-construction origins to the two `"x"` arguments. No regex source map is needed.

### Required round-trip guarantees

The following should become normative tooling conformance rules.

| Guarantee | Requirement |
|---|---|
| **Snapshot identity** | Every projection and every compiler result is tied to an immutable host-document version/content identity. A result from version *n* must never be applied blindly to version *n+1*. |
| **Boundary correctness** | Every mapped range begins and ends on valid boundaries for its own coordinate system. UTF-8 byte offsets, UTF-16 units and Unicode scalar boundaries are never conflated. |
| **Exact-origin round trip** | For an `Exact` segment, host boundary → decoded boundary → host boundary returns the same host boundary. |
| **Escape conservatism** | A decoded range inside an escape maps to the complete source escape or another explicitly defined indivisible edit unit. |
| **No fabricated contiguity** | Disjoint origins remain disjoint. Concatenation, interpolation or macro expansion must not be represented as one misleading contiguous span. |
| **Safe-edit invertibility** | A compiler text edit may be automatically projected only when the affected projection region has an unambiguous inverse host encoding. |
| **Revalidation after encoding** | A projected code fix must be re-extracted from the modified host source and verified to yield the compiler-requested semantic text before it is exposed as a safe automatic action. |
| **Staleness rejection** | Diagnostics, semantic tokens, completions and edits carrying obsolete projection versions are discarded or recomputed. |

The safe-edit rule is stricter than the diagnostic rule. Diagnostics can safely **widen** to an enclosing source construct. Automatic edits cannot safely guess.

For example, replacing one decoded newline in:

```python
"\n"
```

requires rewriting two host characters, while replacing a newline in a triple-quoted literal may use a physical newline. The canonical compiler should say what semantic/source replacement it wants; the **host encoder** determines whether and how that replacement can be represented in that particular host literal.

Formatting must obey the same boundary. STRling's formatter may format canonical STRling source. The host adapter owns re-encoding into a quoted/raw/text-block form and must not rewrite interpolation expressions, quote delimiters, surrounding host indentation, concatenation operators, or macro structure unless a host-specific refactoring explicitly owns those transformations.

This is also why a standard JavaScript source-map file should not simply be adopted as STRling's internal model. The current TC39 source-map specification is optimized around mapped positions in generated/original sources, permits unmapped generated content, and supports lookups that can produce multiple original positions. Those ideas are useful precedents, but STRling additionally needs explicit **transform kind, editability, host literal codec, synthetic semantic origins, holes, snapshot identity, and edit verification**.

## Host-specific constraints and why no universal integration mechanism exists

A universal **data model** is realistic. A universal **host integration** is not.

### JavaScript and TypeScript

This is the strongest first pilot.

TypeScript's documented language-service plugin mechanism is almost a purpose-built precedent: plugins can add diagnostics and completions inside custom-language string literals while leaving TypeScript syntax and type checking unchanged. The plugin wraps the host language service and is supplied the host's TypeScript instance, avoiding the need for STRling to build another TypeScript parser.

The adapter should recognize at least:

```ts
/regex/u

strling("...")

strling(`...`)

strling`...`

s.someSimplyCall(...)
```

Detection should be AST/type-aware where possible. A package imported under an alias is still STRling; an unrelated local function named `strling` is not. That is precisely the kind of question the host semantic service—not a STRling scanner—should answer.

Template literals create a semantic split between static segments and substitutions. STRling should never use the historical “replace `${expr}` with spaces and compile as though it were an ordinary regex” rule unless the canonical frontend has a formally defined opaque-hole recovery mechanism. Spaces can change regex meaning, can accidentally satisfy syntax, and provide a false claim that a dynamic runtime pattern was statically known.

A TypeScript plugin is **editor intelligence only**: Microsoft's documentation explicitly says language-service plugins are not loaded by normal `tsc` type checking or emission. Therefore the exact same TypeScript extraction/projection package should also be consumable by the STRling CLI/build checker when CI diagnostics are desired.

### C#

C# is the strongest second pilot because the ecosystem already demonstrates the desired product shape. Current Microsoft documentation says Visual Studio and C# Dev Kit can identify regex/JSON strings, accept `// lang=regex`, and use `StringSyntaxAttribute` to identify formatted arguments for validation and code suggestions.

A STRling package should therefore be able to annotate appropriate APIs with a STRling/regex string-syntax contract or use equivalent analyzer metadata, letting Roslyn supply syntax and semantic identity.

C# is also an excellent torture test for the projection model. It has escaped regular strings, verbatim strings, raw strings, and interpolated raw strings where the count of leading `$` characters changes how many braces constitute interpolation. A solution that remains correct across these forms is much more convincing than a virtual-document demonstration using only raw literal content.

Roslyn-style analyzer architecture is also a natural fit for canonical diagnostics: analyzers consume compiler syntax/semantic models and report diagnostics against source spans rather than requiring a second C# grammar. Microsoft tooling's existing regex-in-string behavior shows that language injection does not require making the embedded analyzer authoritative for C# itself.

### Python

Python should be the first **hard mapping** pilot, but not necessarily the first product integration.

Python ordinary strings, raw strings, triple-quoted strings and f-strings have materially different decoding rules. Ordinary escapes are decoded; a backslash-newline pair can disappear; raw strings leave backslashes largely literal; f-strings contain runtime expressions; doubled braces in f-string literal portions collapse to single braces.

Its standard AST also illustrates the coordinate mismatch directly: AST columns use UTF-8 byte offsets. An LSP client may be using UTF-16. A Python adapter that “adds the string-start column to the regex diagnostic column” will therefore be wrong for non-ASCII source even before escaping is considered.

The adapter should use Python's own AST/tokenization behavior for valid or recoverable forms rather than implement a STRling-owned Python string parser. Where the standard AST cannot provide a useful tree for severely incomplete source, the product has three honest options:

1. obtain a tolerant syntax tree from the active Python language service/editor integration;
2. depend on a maintained fault-tolerant **Python syntax** parser whose only authority is locating host constructs;
3. degrade STRling features until the host construct is sufficiently well formed.

The third option is preferable to a bespoke “good enough Python scanner.” A maintained host parser dependency duplicates parsing implementation at deployment level, but it does **not** create a second STRling semantic authority. A home-grown scanner that tries to understand nested f-strings, quoting, comments, and incomplete expressions will become a shadow Python parser in practice.

### C and C++

C/C++ is the clearest evidence that direct compiler integration can outperform generic virtual-document logic.

Clang's `StringLiteral` retains the number and source locations of concatenated string-literal tokens, exposes the actual decoded bytes, and implements `getLocationOfByte` specifically to locate a byte through multiple tokens, escapes, trigraph/escaped-newline processing and related complexity. `StringLiteralParser` performs escape decoding and translation-phase concatenation and has `getOffsetOfStringByte` specifically for translating decoded bytes back into token spelling.

STRling should use those facilities where Clang tooling is available.

Reimplementing this mapping in an editor extension would not merely be wasteful; it would create exactly the host shadow parser the architecture is supposed to avoid.

Macros make C++ a later product pilot. A pattern may originate in a macro spelling, a macro expansion, or several concatenated tokens, and compilation flags affect parsing. Accurate C++ tooling therefore needs compilation-database context and Clang source-management concepts. The architecture should support it, but C++ should not define the minimum viable design.

### Rust

Rust adds two important requirements: malformed-source tolerance and macro provenance.

rust-analyzer's syntax library explicitly promises fast incremental reparsing, graceful error handling, and full-fidelity representation of arbitrary text. Its architecture treats parsing as a function returning a tree plus errors rather than a success/failure result; syntax trees may be incomplete, small source changes are incrementally propagated, and the IDE should remain partially usable while a build is broken. That is a good model for STRling's interactive behavior.

Rust macros prevent raw-source offsets from being the only provenance concept. rust-analyzer records token identity through macro transformations, and its architecture explicitly treats syntax-to-HIR correspondence as potentially one-to-many. Procedural macros are sufficiently risky that rust-analyzer runs expansion in a separate process, noting that bad macros can panic or segfault and may be nondeterministic.

STRling should therefore **not execute arbitrary Rust macros just to discover an embedded pattern**. When rust-analyzer or another trusted host service has already produced expansion/source mappings, STRling may consume them. Otherwise it should restrict analysis to source-level constructs whose meaning is statically available.

### Java and JVM languages

Java ordinary strings are straightforward relative to some hosts, but text blocks are not. Java strips incidental indentation and trailing whitespace from text blocks and processes escapes in an ordered transformation. Again, source width and decoded width are not equivalent.

The other complication is tooling plurality. A Java integration might encounter javac-oriented tooling, Eclipse/JDT, VS Code language servers, or JetBrains PSI. There is no single editor plugin API analogous to TypeScript's `tsserver` plugin that governs the ecosystem.

JetBrains offers a particularly strong IDE-native option. UAST abstracts several JVM languages, but support itself varies—Java and Kotlin are fully supported while other languages have different coverage—and JetBrains explicitly warns that UAST and PSI tree structures may diverge. It says physical `sourcePsi` is the correct source anchor for highlighting, and `UInjectionHost` should be used for strings/injection because generic literal abstractions do not handle cases such as Kotlin interpolation adequately.

That is almost a direct statement of STRling's architectural need: abstract semantics where possible, but preserve physical source provenance underneath.

### Go

Go is attractive as a **headless extractor/conformance pilot** even if it is not the first editor pilot.

The standard `go/parser` produces an AST and deliberately accepts some otherwise-invalid syntax to improve robustness in the presence of syntax errors, emitting `BadExpr`, `BadStmt`, and related recovery structures. Go's standard `strconv.Unquote` defines host-owned conversion from quoted or backquoted literal spelling to resulting string value.

That allows a Go adapter to remain very thin:

```text
go/parser → identify BasicLit / call
source slice → strconv decoding
projection map → canonical compiler
```

No STRling-owned Go grammar or Go string decoder is necessary.

The editor limitation is architectural rather than semantic: STRling cannot assume every host language server exposes a third-party in-process plugin mechanism. Where such an API does not exist, the same Go host adapter can run in a STRling LSP sidecar that observes the host document independently. That is still a host parser dependency, not a semantic fork.

### Other hosts

The extension rule should be:

> **A new host adapter must name the authoritative host-syntax implementation it relies on, the host transformations it supports, its malformed-source behavior, and its projection precision.**

It must never earn support status merely because someone wrote a regex capable of finding `strling("...")`.

This leads to the broader architectural result:

**One architecture can serve every host only if “architecture” means the common provenance/compiler boundary. One parser, one injection mechanism, one virtual-document strategy, or one editor API cannot realistically serve every host.**

## Compiler boundary, editor responsibilities, and interactive behavior

The modern STRling compiler research gives the correct boundary rule: frontend syntax, source recovery, syntactic error recovery and provenance may vary; meaning, normalization, global validation, capture/reference meaning, semantic analysis, portability and target policy must remain canonical. The existing STRling architecture documentation likewise identifies the parser/compiler side as the authority for syntax/semantics and assigns editor/LSP layers protocol and presentation responsibilities.

That should be refined into the following tooling contract.

| Component | Owns | Must not own |
|---|---|---|
| **Host detector/extractor** | Host parsing; literal/call/template identification; symbol-resolution evidence; host string decoding; static concatenation proof; malformed-host recovery | Regex grammar, STRling validation, capture semantics, portability rules |
| **Projection/provenance layer** | Source identities; transform segments; coordinate conversion; semantic-node origins; editability; host re-encoding | Deciding whether a regex construct is valid or what it means |
| **Canonical STRling compiler** | STRling/regex parsing; canonical diagnostics; semantic facts; completion knowledge; hover facts; references within semantic language; normalization; analysis | VS Code ranges, Python AST offsets, Roslyn spans, quoting policy |
| **LSP middleware/server** | Request lifecycle; document versions; cancellation; capability negotiation; UTF coordinate conversion; result aggregation | Reinterpreting compiler diagnostics or independently validating patterns |
| **Editor extension/injection** | Registration; presentation; editor-specific injection/highlighting; commands; Workspace Trust; UX | Semantic authority |

A host adapter may perform the mechanically specified lowering needed to construct canonical semantic input. The modern canonical report explicitly permits frontends to own syntactic parsing and mechanically specified desugaring while reserving semantic normalization and validation to the core. That is how Simply tooling can remain legitimate without becoming “another compiler.”

For example, an adapter may know that a resolved `s.capture(name, body)` invocation constructs a capture-construction request because that fact is generated from the official Simply binding contract. It must **not** independently decide:

- whether the capture name is legal;
- whether two captures conflict;
- which target engines support some capture behavior;
- whether nested constructs are semantically valid;
- how canonical capture identity is assigned.

Those are canonical compiler questions.

### Feature ownership

**Diagnostics.** The compiler produces canonical diagnostic identity, severity basis, arguments, and semantic range/origins. Projection maps them to host spans. LSP/editor code changes presentation only.

**Completion.** The host layer first decides whether the cursor is in a projectable STRling context and maps the cursor into semantic coordinates. The compiler returns language-semantic completion candidates. The host encoder then transforms inserted source text into the proper host spelling. A completion containing `\` may require `\\` in one string form and `\` in another.

**Hover.** The compiler owns explanation of a regex/STRling construct. Projection owns finding the semantic entity at the cursor and returning the host range to highlight.

**Navigation.** Canonical semantic references should carry semantic source IDs/provenance. Cross-host navigation is possible only where semantic origins exist. Host symbol navigation remains the host language service's job.

**Refactoring.** Refactor intent belongs to the canonical compiler when it changes STRling semantics or syntax; applying it to embedded source requires the source map's invertibility test. Refactors touching host-language expression structure require a host-specific rewrite.

**Semantic highlighting.** Compiler semantic classifications map to host ranges and then to editor semantic tokens. VS Code explicitly supports semantic tokens whose classification can identify embedded-language content and applies semantic tokens over lexical TextMate highlighting. TextMate injection is therefore an optional fast lexical layer, not the canonical highlighting authority.

**Formatting.** The compiler may format standalone semantic source. The host adapter determines whether that formatted source can be safely re-encoded. No formatter should casually cross an interpolation hole or join separate host literals.

### Malformed and partially typed source

Interactive tooling must consider malformed source normal.

rust-analyzer is the strongest architecture precedent here: parsing never fails in the conventional sense, syntax trees deliberately do not enforce complete well-formedness, IDE state is snapshot-based, and stale computations are canceled when source revisions change. Go's standard parser likewise implements synchronization and recovery rather than abandoning the entire AST on every syntax error.

STRling projection should classify each candidate unit as:

```text
Exact
Recoverable
Uncertain
Unavailable
```

An **Exact** unit has trustworthy host boundaries and decoding.

A **Recoverable** unit may be missing a closing quote or parenthesis, but the host parser has a stable enough island to expose useful content. It may receive compiler syntax recovery, completion, and hover.

An **Uncertain** unit has ambiguous boundaries—for example, an unfinished interpolation that could still change whether following text is host expression or literal content. STRling should suppress precise semantic diagnostics rather than generate false red squiggles.

An **Unavailable** unit is dynamically constructed or otherwise not statically recoverable.

Importantly, host malformed-source recovery and STRling malformed-source recovery are different jobs. The host parser answers:

> “Where is the string/template/call?”

The canonical STRling frontend answers:

> “Given these pattern characters, what incomplete STRling program do they denote?”

Neither should substitute for the other.

### Incremental state and cancellation

LSP supports incremental text-document synchronization, and its cancellation protocol allows clients to send `$/cancelRequest`; the specification advises dealing explicitly with stale requests and document modifications. STRling should carry those concepts all the way into projection and compiler queries.

A host document update should proceed approximately as:

```text
host edit
   │
   ├─ update immutable host snapshot / line index
   │
   ├─ ask host syntax system for changed syntax
   │
   ├─ rediscover only affected embedded units
   │
   ├─ preserve stable unit IDs where syntax identity survives
   │
   ├─ rebuild changed projections
   │
   ├─ cancel compiler work for obsolete projection versions
   │
   └─ reuse compiler results for unchanged semantic inputs
```

Do not identify embedded units as “the 42nd string literal in the file,” as the historical virtual-document proposal suggested. Inserting one unrelated string near the top of the file would then invalidate every later identity. Stable IDs should instead derive from host syntax identity where available, or from a structural anchor plus content/version reconciliation.

A cache key should include at minimum:

```text
canonical compiler/spec version
canonical frontend mode
decoded/semantic input hash
compiler configuration / target context
relevant static semantic environment
```

Host-source position should **not** be part of the semantic-result cache key. The exact same regex moved from line 20 to line 200 should reuse compiler semantic results; only its projection must change. That is an important consequence of keeping provenance separate from meaning, consistent with the canonical compiler research.

Two cache layers therefore emerge naturally:

```text
Projection cache
    HostSnapshot + syntax anchor → ProjectedUnit

Semantic cache
    SemanticInput + compiler configuration → CanonicalResult
```

A third presentation cache may retain converted LSP semantic tokens or diagnostics for a particular host snapshot.

rust-analyzer provides a strong precedent for lazy, incremental facts and aggressively canceling results made stale by a new source revision rather than letting old computations block new input. STRling does not need to reproduce rust-analyzer's database architecture to adopt those principles.

Provisional interactive SLOs worth testing—not protocol requirements—would be:

| Operation | Initial engineering target |
|---|---:|
| Re-extract one changed embedded unit | low single-digit milliseconds where host AST is already available |
| Cached hover / lightweight completion | < 50 ms median |
| Normal interactive completion | < 150 ms p95 |
| Diagnostics after a short typing pause | visible within roughly 250 ms |
| Cancellation recognition | before obsolete result publication |

These should be validated by prototypes rather than treated as specification constants.

## Verification, security, architecture hazards, and conformance

Source mapping must be treated as compiler-grade infrastructure. It is not utility code that can be validated with a handful of ASCII examples.

### Mapping conformance

The most important oracle is the host language itself.

For each supported literal form, tests should establish:

```text
HOST LANGUAGE'S DECODED VALUE
              ==
STRLING PROJECTOR'S DECODED PATTERN SOURCE
```

Then, for every meaningful decoded boundary:

```text
decoded boundary
      ↓ map
host source boundary/range
      ↓ host decoding
same intended semantic character/boundary
```

Where no inverse exists, the test must assert that the map says **non-editable** rather than inventing one.

Clang provides an unusually valuable differential oracle because it already implements decoded-string-byte to source-location translation across escapes and concatenated tokens. Python provides an independent UTF-8-offset oracle through its AST and lexical decoder. Go provides its standard parser plus standard string unquoting. Java's text-block specification provides authoritative expected decoded content for indentation and escape cases.

A conformance matrix should cross at least:

```text
host language
× literal form
× quote delimiter
× raw/non-raw
× one-line/multiline
× CRLF/LF
× escape form
× ASCII/BMP/non-BMP Unicode
× combining characters
× interpolation boundaries
× static concatenation boundaries
× malformed states
× macro/source expansion states
× compiler range shapes
× insertion/replacement/deletion edits
```

High-value Unicode fixtures include characters immediately before and inside diagnostic ranges so that an accidental UTF-8/UTF-16/code-point assumption cannot remain hidden.

Property tests should verify at least:

**Decode equivalence**

```text
hostDecode(source) == projectedDecodedText
```

**Exact boundary round trip**

```text
host → decoded → host == original
```

for boundaries marked exact.

**Conservative non-exact mapping**

```text
semantic finding origin ⊆ reported host construct
```

and no unrelated construct is silently selected.

**Edit round trip**

```text
canonical edit
→ host encode
→ modify source
→ re-extract
→ decoded result
== desired canonical result
```

before the edit is classified as automatically safe.

**Staleness**

A result produced for snapshot `S1` must never produce an edit against `S2` unless an explicit transformation/rebase proves validity.

**Canonical parity**

The same semantics expressed through a standalone STRling source, regex-compatible source, and a supported Simply construction should reach equivalent canonical semantic facts; only their source projections may differ. That directly extends the convergence testing recommended by STRling's modern compiler research.

### Malformed-source fuzzing

Projection tests need mutation-based fuzzing:

```text
delete quote
insert quote
delete brace
insert interpolation
split string
join strings
insert emoji
change line ending
insert backslash
truncate escape
break surrounding host syntax
move through macro/template boundary
```

The core invariant is not “always produce diagnostics.” It is:

> **Never report a precise STRling source location unless the integration can prove where that semantic text came from in the current host snapshot.**

False negatives during severely malformed host syntax are acceptable degradation. Confidently wrong source ranges are architectural defects.

### Security and trust

Embedded language tooling processes untrusted source code merely because a file is opened. The base feature set should therefore require **no execution of host program code**.

VS Code's current Workspace Trust model exists specifically because extensions, tasks, language tooling, configuration and other developer features may otherwise execute workspace-controlled code; Restricted Mode disables or limits such capabilities. STRling integrations should be fully useful in restricted/untrusted mode for source-only operations whenever possible.

The default security contract should be:

```text
Allowed without workspace trust:
    read editor-provided text
    parse with bundled/safe host parser
    decode literals
    invoke canonical STRling compiler
    show diagnostics/hover/highlighting
    propose source-only edits after mapping verification

Requires stronger trust or should be avoided:
    execute host modules
    import application code
    invoke arbitrary build scripts
    run user-provided compiler plugins
    expand arbitrary executable macros
    load project-specified native libraries
    run project-specified formatter binaries
```

rust-analyzer's process isolation for procedural macros is an important warning: its own architecture notes that bad proc macros can panic, segfault, or be nondeterministic and therefore runs them separately. STRling should consume already-available host macro-expansion evidence where trusted tooling provides it; it should not introduce macro execution merely to improve regex completion.

The canonical compiler service should additionally impose resource budgets, support cancellation, reject pathological oversized inputs, and avoid unbounded caches. Diagnostic payloads and telemetry should not transmit source patterns externally by default; embedded patterns can contain proprietary syntax fragments, names, URLs, paths, or other application-specific information even when they are “just regex.”

Any automatic edit must also pass a trust boundary: only edit the document version from which the suggestion was derived, and preferably revalidate the encoded result before application.

### Architecture anti-patterns

The following should be explicitly prohibited by architecture review.

| Anti-pattern | Why it fails |
|---|---|
| **Regex-based parsing of the host language** | Breaks on nesting, comments, interpolation, escapes and malformed source; becomes a shadow host parser |
| **Whitespace masking as universal source mapping** | Valid only when host spelling and semantic text have the required width relationship; false for escape decoding and other transformations |
| **One global coordinate type named `offset`** | Guarantees eventual UTF-8/UTF-16/code-point bugs |
| **Constant-delta range translation** | Cannot represent escapes, multiline transformations, concatenation or macros |
| **Decoding strings independently of the host toolchain** | Creates a second implementation of host lexical semantics |
| **Host adapter emits semantic STRling errors** | Creates a second STRling compiler |
| **TextMate grammar as detector of semantic truth** | Lexical highlighting lacks project/type/semantic context; VS Code itself distinguishes it from semantic-token knowledge. |
| **Name-only API detection** | `strling(...)` can be shadowed or aliased; use host symbol information where possible |
| **Executing builders to discover their result** | Turns opening a source file into arbitrary code execution |
| **Flattening interpolation holes into benign characters** | Can change or accidentally validate the pattern |
| **Flattening multiple host origins into one source range** | Produces misleading diagnostics and unsafe fixes |
| **Synthetic regex generation for Simply solely to obtain positions** | Loses the native provenance of semantic builder nodes |
| **Virtual URI identity based on ordinal string number** | Harmless host edits cause widespread identity/cache churn |
| **Reimplementing compiler diagnostics in the extension for latency** | Semantic divergence becomes inevitable |
| **Compiling every embedded unit after every keystroke** | Ignores incremental syntax identity and semantic caching |
| **Applying code actions to stale snapshots** | Source maps no longer describe the edited document |
| **Making editor APIs part of the canonical compiler** | Couples semantic authority to VS Code/Roslyn/JetBrains/LSP |

The historical STRling report was correct about one essential point: extraction and mapping must be deterministic and independently testable. Its mistake is elevating one specific projection trick—width-preserving virtual content—to the universal architecture. The modern compiler architecture gives the stronger abstraction needed to correct that.

## Recommended pilots, prototype program, and architecture decision

The implementation sequence should be designed to **try to falsify the architecture**, not merely demonstrate an easy happy path.

### Host pilot sequence

**JavaScript/TypeScript should be Pilot A.**

It has the best integration leverage. TypeScript's official language-service plugin contract explicitly supports custom errors and completions inside string literals while leaving core language semantics alone. It can therefore demonstrate:

```text
host AST detection
tagged/template embedding
ordinary escaped strings
regex literals
Simply call recognition
completion
hover
diagnostics
safe fixes
semantic tokens
incremental changes
```

without building a JavaScript/TypeScript shadow parser.

The prototype should deliberately support both:

```ts
strling("\\d+")
strling`...${expr}...`
```

because the first tests host escaping while the second tests interpolation holes. A prototype that only handles a simple backtick literal would prove very little.

**C# should be Pilot B.**

It is the best independent confirmation because Roslyn/editor tooling already has a product precedent for recognizing regex syntax via `StringSyntaxAttribute` and `lang=regex`. It also stresses:

```text
ordinary escaped literals
verbatim literals
raw multiline literals
interpolated raw strings
host semantic attributes
code fixes
source spans
```

This demonstrates that the projection core is not merely TypeScript-shaped.

**Python should be Pilot C, the adversarial mapping pilot.**

Python combines UTF-8 AST source columns with escape decoding, ignored line continuations, raw/triple strings, and f-string replacement fields. It should be used to determine whether the projection API genuinely models coordinates and partial source rather than accidentally relying on UTF-16/JavaScript assumptions.

Product rollout for Python can follow once a satisfactory malformed-source acquisition strategy is demonstrated.

**Go should be an early headless conformance adapter.**

Its standard parser's error recovery and standard string decoder provide a comparatively clean environment for validating the HostAdapter contract without editor-specific complexity.

**C/C++ and Rust should come later as provenance stress tests.**

C/C++ validates multi-token string origins and compiler-defined byte mapping through Clang. Rust validates macro provenance, full-fidelity malformed syntax and incremental analysis assumptions. They are extremely valuable conformance targets, but unnecessarily difficult starting points.

**Java/JetBrains should then validate IDE-native injection.**

The objective is not merely Java support. It is to prove that the same canonical projection model can sit beneath an IDE-native `UInjectionHost`/PSI integration rather than an LSP or virtual-document path. JetBrains's distinction between physical `sourcePsi`, virtual UAST elements and injection-oriented string hosts makes this a particularly valuable architectural test.

### Experimental prototypes required before implementation commitment

Six prototypes should be architecture gates.

| Prototype | Question it must answer | Commitment gate |
|---|---|---|
| **Projection Core** | Can one segment/provenance model represent exact text, escapes, elisions, disjoint concatenations, synthetic nodes, holes and multiple coordinate encodings without host semantics leaking into the compiler? | Required before editor work becomes production |
| **TypeScript native-host spike** | Can diagnostics, completion and one safe edit flow through a TS LS plugin using the host AST and canonical compiler with no regex semantic duplication? | Validates primary integration path |
| **C# Roslyn spike** | Does the same projection model survive ordinary/verbatim/raw/interpolated strings and Roslyn-style source spans? | Validates cross-host generality |
| **Python hostile-coordinate spike** | Can UTF-8 AST positions, UTF-16 LSP positions, escapes, triple strings and partial f-strings map correctly? | Validates coordinate architecture |
| **Clang mapping oracle** | Does STRling's generic provenance representation reproduce Clang's decoded-byte-to-source behavior for escapes and concatenated string tokens? | Validates non-bijective mapping |
| **Virtual-document A/B spike** | On identical features, what does virtual-document transport simplify or complicate compared with direct canonical compiler invocation? | Determines where virtual docs are worth retaining |

The Projection Core prototype should exist entirely outside any editor. Give it fixtures such as:

```text
host text
host syntax metadata
expected decoded text
semantic diagnostic range
expected host ranges
candidate semantic edit
expected encoded host edit / "not invertible"
```

That makes the hardest architecture independently testable.

The virtual-document experiment should be especially disciplined. It should compare:

```text
Direct:
host adapter
→ projection
→ compiler API
→ projection
→ editor

Virtual:
host adapter
→ projection
→ virtual STRling document
→ STRling LSP/compiler
→ virtual range
→ projection
→ editor
```

If the latter buys useful protocol reuse, debugging visibility, or process isolation, keep it behind the projection abstraction. If it merely adds another synchronization/version/URI layer, do not make every host pay that cost.

VS Code's documented virtual-content approach remains highly useful for cases where position-preserving embedded regions genuinely exist, but its own documentation shows why it is not a complete solution for encoding differences, diagnostics, state sharing, formatting, and cross-language behavior.

### Recommended architecture decision

The Fourth Edition tooling architecture should adopt the following normative decision:

> **STRling embedded tooling is a provenance-preserving multi-frontend system. Host integrations recover host syntax and statically knowable values using authoritative host-language machinery, then lower them through a shared projection contract into the canonical STRling compiler. Compiler results are returned in canonical source/node coordinates and are projected back into immutable host snapshots through explicit, bidirectional provenance mappings. Editor transports, language injection APIs, virtual documents and host-language plugins are replaceable presentation/integration mechanisms rather than semantic authorities.**

The corresponding component model is:

```text
┌────────────────────────────────────────────────────────────┐
│                         EDITOR                             │
│ VS Code | JetBrains | Visual Studio | Neovim | others     │
└──────────────────────────┬─────────────────────────────────┘
                           │ editor requests / host snapshots
                           ▼
┌────────────────────────────────────────────────────────────┐
│                 EDITOR / LSP ADAPTER                      │
│ request routing · cancellation · UTF position conversion  │
│ semantic tokens · diagnostics presentation                │
└──────────────────────────┬─────────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────────┐
│                     HOST ADAPTER                           │
│ authoritative host AST/PSI/tokens                         │
│ STRling-site detection                                    │
│ host literal decoding                                     │
│ static composition proof                                  │
│ malformed-host recovery                                   │
│                                                            │
│ TS plugin | Roslyn | Python parser | Clang | Go parser ... │
└──────────────────────────┬─────────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────────┐
│                PROJECTION / PROVENANCE CORE               │
│                                                            │
│ HostSnapshot                                               │
│    ↕ exact / escape / elision / hole / macro / synthetic  │
│ DecodedPatternSource?                                      │
│    ↕ frontend construction provenance                     │
│ SemanticSource / SemanticNodeOrigins                       │
│                                                            │
│ mapping · coordinate conversion · safe edit inversion      │
└──────────────────────────┬─────────────────────────────────┘
                           │ canonical request
                           ▼
┌────────────────────────────────────────────────────────────┐
│              CANONICAL STRling COMPILER                   │
│                                                            │
│ syntax · semantics · diagnostics · analysis                │
│ normalization · canonical completion facts                 │
│ semantic navigation/refactoring facts                      │
│                                                            │
│          THE ONLY STRling/regex SEMANTIC AUTHORITY         │
└────────────────────────────────────────────────────────────┘
```

This architecture preserves the most important direction already established by STRling's modern compiler research: **source provenance varies; semantic authority does not.**

It also improves on the historical island-grammar proposal without discarding the useful part of it. Virtual documents remain available when they are the most convenient transport. Whitespace masking remains available where it is demonstrably semantics-preserving. TextMate injection remains useful for immediate lexical coloring. JetBrains injection remains useful for IDE-native embedded experiences. TypeScript plugins and Roslyn analyzers remain preferable when their host compiler can provide richer source knowledge. Explicit STRling files remain the simplest canonical editor surface. None of these mechanisms is required to pretend to be universal.

The architectural invariant is instead simple enough to enforce:

> **Host tooling is allowed to know how the host program spells and constructs a STRling program. It is not allowed to decide what that STRling program means.**

And the source-location invariant is equally explicit:

> **A canonical compiler diagnostic points into host source through provenance, never through coincidence of offsets.**

That combination is what allows a single canonical STRling compiler to diagnose raw regex literals, escaped strings, templates, multiline text, static concatenations, Simply builders, and eventually macro-generated constructs without turning every editor integration into another regex compiler.

**Present research stage complete.**