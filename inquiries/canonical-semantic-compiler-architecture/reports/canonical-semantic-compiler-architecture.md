# Canonical Semantics Across Many Frontends: Architectural Research for STRling Fourth Edition

Role: Research report
Origin: AI-assisted deep-research session commissioned for STRling Research Intelligence; the underlying sources, not the AI system, are the evidence authorities.
Generated: 2026-08-12
Imported: 2026-08-12
Source verification: Partially verified
Last reviewed: 2026-08-12
Current status: Active input

## Source verification gaps

Repository-state claims were rechecked against the STRling `architecture/v4` branch at commit [`9991575`](https://github.com/strling-lang/strling/tree/9991575b347ac5f56108f18065c88b2b16a5065a), including its [architecture guide](https://github.com/strling-lang/strling/blob/9991575b347ac5f56108f18065c88b2b16a5065a/docs/architecture.md). The report's external precedent set was partially reconstructed from primary documentation for [GCC front ends](https://gcc.gnu.org/onlinedocs/gccint/Front-End.html), [MLIR language and locations](https://mlir.llvm.org/docs/LangRef/#locations-and-locations), [Clang attributes](https://clang.llvm.org/docs/InternalsManual.html#how-to-add-an-attribute), [Roslyn architecture](https://github.com/dotnet/roslyn/blob/main/docs/wiki/Roslyn-Overview.md), [rustc queries](https://rustc-dev-guide.rust-lang.org/query.html), and [libclang](https://clang.llvm.org/docs/LibClang.html).

The imported research-session tokens did not retain a durable token-to-URL map. Markers that could not be reconstructed claim by claim were replaced with links to this note. Those claims remain discovery material, particularly campaign-status assertions sourced only from the research session, exact compiler-paper result counts, and claims about the reversibility of particular precedent transformations. They are not load-bearing evidence for the active inquiry.

## Executive assessment and architectural problem

The central architectural problem is not merely how to route several parsers or APIs into a shared backend. It is how to make **semantic authority singular while allowing authoring syntax, ergonomics, source recovery, and host-language presentation to vary**.

A compiler can have many frontends and still have many languages. GCC is the clearest precedent: its frontends may use completely different private source representations and eventually translate them to language-independent representations such as GIMPLE. That architecture successfully shares a middle end, but it does not imply that C, C++, Fortran, and other GCC languages share semantics. [source-verification note](#source-verification-gaps) Roslyn makes the same distinction from another direction: its platform exposes common compiler/workspace infrastructure for syntax trees, semantic models, diagnostics, and IDE services, but its own architecture documentation explicitly says that C# and Visual Basic have distinct compiler APIs. Shared infrastructure therefore does not, by itself, establish one language. [source-verification note](#source-verification-gaps)

For STRling, the governing invariant should be stronger:

> **For a fixed STRling semantic-specification version, two supported frontend expressions designated as expressing the same intent must, after frontend interpretation and canonical normalization, denote the same semantic program and therefore produce the same target-neutral semantic facts. Differences in syntax trees, host objects, source spans, prose diagnostics, formatting, or transport representation are not semantic differences unless the specification explicitly makes them so.**

That formulation is deliberately narrower than “all frontends produce identical data.” STRling's own canonical contract already states that semantic equality ignores node-ID spelling, consistent capture-ID renaming, and source origin; provenance is attribution rather than meaning. [source-verification note](#source-verification-gaps) That is a sound foundation: a TypeScript builder, a future textual DSL, and an imported regex should not need identical source structure or identical synthetic node identities to be the same program.

The strongest architecture for this problem is therefore:

```text
     Semantic STRling DSL          Simply / builder APIs          Regex-compatible import
              │                            │                              │
       frontend syntax AST           host-neutral semantic         regex source model
       + source recovery             construction mapping          + source recovery
              │                            │                              │
              └──────────────┬─────────────┴───────────────┬──────────────┘
                             │
                  semantic-construction boundary
                             │
                  canonical Rust semantic compiler
                             │
               validation → normalization → analysis
                             │
                 one canonical semantic result
                             │
        ┌────────────────────┼─────────────────────────┐
        │                    │                         │
      CLI/LSP            host adapters            target planning
      editors/APIs       native/WASM/FFI          and downstream backends
```

The important boundary is the horizontal one. **Frontend freedom ends there.** Lexing, parsing, API shape, syntax sugar, error recovery, comments, source locations, and host idioms may live above it. Meaning, semantic defaulting, canonicalization, cross-node validation, semantic analysis, capability requirements, and downstream compilation policy must live at or below it.

This conclusion is strongly consistent with STRling's present Fourth Edition direction but should not be read as blanket validation of every current design choice. The current contracts and campaign contain several unusually strong decisions, while the sequencing of the migration creates one significant risk: **the regex-compatibility frontend is becoming operational before the flagship semantic authoring surfaces exist**, making accidental regex-first semantic bias the most important architecture hazard to guard against.

There is also an important evidence caveat about “current state.” The connected GitHub `architecture/v4` branch I inspected pointed to `9991575b347ac5f56108f18065c88b2b16a5065a`, whose commit is dated August 12, 2026 and titled `docs(core): define PCRE2 target serialization`. [source-verification note](#source-verification-gaps) [source-verification note](#source-verification-gaps) The Notion campaign, however, contains later August 12 status evidence—for example, it reports P11 ECMAScript work complete at a later SHA and keeps P11 itself in progress pending Python work. [source-verification note](#source-verification-gaps) Consequently, this report treats **GitHub-observed content as repository evidence** and **Notion as authoritative campaign-plan/status evidence**, but does not assume every campaign-reported later commit was already visible on the connected GitHub branch during this investigation.

## Compiler precedents and a taxonomy of multi-frontend architectures

The most useful precedents are not systems identical to STRling—few mature compilers deliberately provide multiple syntactic frontends for *one* small semantic language—but systems that separately demonstrate the necessary properties.

| Architecture pattern | Mature precedent | What it demonstrates | Suitability for STRling |
|---|---|---|---|
| Different source representations → shared language-independent middle end | GCC | Frontends need not share a syntax AST; each may lower its own representation into a common compiler representation. [source-verification note](#source-verification-gaps) | Necessary idea, but insufficient by itself because GCC's frontends are different languages. |
| Several spellings → one semantic construct | Clang attributes | GNU, C++11, Microsoft, and other attribute spellings first become `ParsedAttr`, then semantic attributes handled by Sema. [source-verification note](#source-verification-gaps) | Excellent small-scale analogy for STRling sugar and frontend syntax. |
| Generic and custom syntax for the same semantic operation | MLIR assembly forms | MLIR deliberately offers generic and custom textual forms while keeping the underlying operation semantics common. [source-verification note](#source-verification-gaps) | Strong precedent for multiple surface representations without multiple meanings. |
| Semantically interchangeable forms with explicit generalization/specialization | MLIR Linalg | Named, category, and generic Linalg forms can be semantically equivalent and transformed between forms; representability in the reverse direction may be partial. [source-verification note](#source-verification-gaps) | Strong model for frontend representability domains and explicit convergence. |
| Compiler semantics exposed to IDE/tooling | Roslyn | Workspaces expose source, syntax trees, semantic models, and compilations so IDE features consume compiler knowledge rather than rebuilding it. [source-verification note](#source-verification-gaps) | Strong precedent for STRling CLI/LSP/editor architecture. |
| Demand-driven shared compiler facts | rustc | Core compiler processes are modeled as key→value queries with caching and dependency-graph integration. [source-verification note](#source-verification-gaps) | Useful later for editor/query architecture, but not a prerequisite for semantic correctness. |
| Stable high-level foreign-language facade | libclang | Clang recommends libclang when clients need a high-level, comparatively stable, backward-compatible interface from languages other than C++. [source-verification note](#source-verification-gaps) | Strong precedent for thin bindings that do not expose compiler internals. |

From those examples, five architecture families are relevant.

**Shared-backend architecture.** Each frontend performs most language semantics itself and merely lowers to a common IR. GCC is broadly in this family. It provides outstanding code-generation reuse, but it is the wrong semantic guarantee for STRling: two frontends can disagree before lowering and still successfully use the same backend. [source-verification note](#source-verification-gaps)

**Canonical-semantic architecture with frontend-specific syntax models.** Each textual frontend owns the representation necessary for its grammar, error recovery, source fidelity, and formatting, then crosses a narrow semantic-construction boundary into one compiler. This is the best match for STRling. GCC's permission for private frontend representations supports the first half of the pattern, while Clang's attribute conversion and MLIR's multiple assembly forms demonstrate the stronger “different syntax, one semantic construct” property. [source-verification note](#source-verification-gaps)

**Universal syntax-AST architecture.** All source forms are forced into one supposedly frontend-neutral syntactic tree before semantics. This can work when forms are syntactically close, but with a textual intent language, a regex import dialect, and builder APIs it tends either to become a union of every frontend's syntax or to destroy source-specific information. STRling has already reconsidered this: campaign task P05-T02 is marked **Adapted**, recording the architectural decision to reject a universal frontend-neutral syntax AST and instead let frontend-specific syntax representations converge on Semantic IR while source/provenance contracts preserve tooling information. [source-verification note](#source-verification-gaps) **Recommendation:** retain that decision.

**Semantic-construction frontend.** An API frontend does not need a conventional parser at all. A builder can invoke a host-neutral construction algebra that describes literals, composition, captures, repetitions, assertions, and so forth, with the core validating and canonicalizing what it constructs. This is the appropriate model for Simply. The key requirement is that the host-language method names and overloads are ergonomics, not semantic authority.

**Parallel semantic implementations behind a common facade.** TypeScript, Python, Rust, Java, etc. each implement validation, normalization, compilation, or target behavior and merely promise compatibility. This is precisely the architecture STRling should eliminate. Differential testing can reduce divergence but cannot turn separately evolving semantic engines into a strong one-language invariant.

A subtle but important external warning comes from GCC itself: its shared tree infrastructure historically acquired assumptions influenced by the frontends for which it was first designed. GCC documentation also permits language-specific nodes temporarily, but requires frontends to convert them before the common GIMPLE world and warns that generic optimizers cannot be expected to understand such nodes. [source-verification note](#source-verification-gaps) This is directly relevant to STRling: **a common model can still be frontend-biased even if only one copy exists.**

For Fourth Edition, that means “implemented in Rust” is not enough. The semantic core must also be **syntax-agnostic in its concepts**.

## Frontend-to-core contract and semantic-convergence verification

The frontend/core contract is where the one-language claim becomes enforceable.

**Recommendation:** define frontend ownership negatively as well as positively. A frontend may own lexical syntax, parsing, source-specific AST/CST structure, comments/layout, syntactic error recovery, source provenance, and the mechanically specified desugaring of its constructs. It must not own target capability decisions, semantic normalization rules, global validation, capture/reference meaning, cross-node analysis, safety conclusions, portability policy, target lowering, or semantic defaults that differ by host.

STRling's current protocol is already close to this separation. A `CompileRequest` accepts exactly one of a source document or semantic input. A source document names its frontend explicitly; the compiler does not guess a frontend from filename, media type, content, or caller. The current documented kernel recognizes the explicit `strling.regex-compat` frontend and routes successful source lowering through the same normalization, analysis, diagnostics, portability, and resource-limit stages as semantic input. [source-verification note](#source-verification-gaps) That is strongly supported by the precedents above.

One boundary should be tightened conceptually:

> **No frontend should be required to independently implement canonical normalization in order to call the core.**

A source parser or builder must obviously construct semantically meaningful nodes, but there should be exactly one owner for flattening, canonical ordering where appropriate, literal coalescing, canonical identity treatment, and other normalization rules. If frontend A “normalizes before it hands off” while frontend B performs a different equivalent transformation, normalization logic has already been duplicated. STRling's contract describes canonical normalization centrally and the Rust kernel exposes `normalization::normalize`, which is the right ownership direction. [source-verification note](#source-verification-gaps) [source-verification note](#source-verification-gaps)

This implies a useful architecture rule without dictating Semantic IR internals: **frontend construction state and canonical normalized state should be distinguishable in the Rust type/API boundary**, even if they serialize through related contracts. Invalid or noncanonical frontend output should never be accepted merely because it came from a trusted first-party adapter.

### What semantic convergence should actually test

Pairwise golden tests are necessary but not sufficient. The verification strategy should be layered:

| Verification layer | Required assertion | Why it matters |
|---|---|---|
| Frontend contract | Each supported surface construct has a specification-owned semantic mapping. | Prevents the implementation from becoming the de facto semantics. |
| Canonical normalization | Equivalent frontend programs normalize to semantic equality, not byte-for-byte object equality. | Ignores legitimate IDs/provenance differences while detecting actual meaning drift. |
| Derived facts | Equivalent programs produce identical target-neutral semantic/structural facts and requirements. | Detects bugs hidden by superficially similar trees. |
| Semantic diagnostics | Equivalent semantic errors produce the same canonical diagnostic identity and severity basis. | Prevents each frontend from inventing its own semantic validation. |
| Downstream invariance | Once canonical semantics are equal, planning and target compilation receive the same semantic input. | Proves downstream behavior cannot depend on which frontend happened to create it. |
| Source projection | Each frontend maps canonical findings back to its own correct source locations. | Tests presentation independently from meaning. |
| Adapter parity | A host adapter request and a direct canonical request yield equivalent canonical results. | Detects semantic code in wrappers. |

The test oracle should not principally be “frontend A agrees with frontend B.” Two wrong frontends can agree. The strongest oracle is **specification-authored canonical semantic cases**, from which representable expressions are projected into each frontend and then reconstructed. STRling's existing contract design already distinguishes specification-authored conformance material from generated fixtures and historical goldens, explicitly keeping implementation snapshots and historical evidence non-normative unless the specification delegates authority to them. [source-verification note](#source-verification-gaps) This distinction is excellent and should govern frontend convergence as well.

A high-value property test is therefore:

```text
canonical semantic program P
        │
        ├─ render/construct in frontend A ─ parse/build ─┐
        ├─ render/construct in frontend B ─ parse/build ─┤
        └─ render/construct in frontend C ─ parse/build ─┘
                                                        │
                                                  normalize
                                                        │
                                             semantic-equality with P
```

This needs a **representability predicate**. Not every regex-import expression needs a Semantic DSL spelling, and not every future semantic feature must necessarily be importable from regex. MLIR's Linalg rationale is instructive here: some semantically equivalent forms can be converted in both directions, while a more generic form may have no corresponding named form. [source-verification note](#source-verification-gaps) STRling should therefore maintain an authoritative feature × frontend matrix with states such as `representable`, `intentionally unavailable`, `compatibility-only`, and perhaps `deferred`. “No test exists” must never be confused with “not expressible.”

Other essential properties are metamorphic:

`desugar(sugar(x)) ≡ x`; parse → format → parse preserves meaning; builder serialization → reconstruction preserves meaning; syntactically irrelevant layout/comment changes preserve meaning; renaming internal node identities preserves meaning; and source-origin changes do not change semantic equality. These test the actual invariants of a canonical semantic architecture rather than snapshots of one implementation.

Published compiler-testing research strongly supports systematic generated and differential testing rather than relying solely on handwritten examples. Csmith's authors report finding hundreds of serious bugs in production compilers by generating valid programs designed to exercise compiler behavior. [source-verification note](#source-verification-gaps) Equivalence-Modulo-Inputs research likewise demonstrated that semantics-preserving program transformations can expose previously unknown compiler defects; the published PLDI work reported large numbers of confirmed GCC/LLVM bugs. [source-verification note](#source-verification-gaps) The direct lesson for STRling is not “randomly fuzz regexes,” but that **semantic transformations with a known invariant are particularly powerful compiler oracles**.

A serious Fourth Edition release gate should consequently require:

**Recommendation:** for every frontend version and every semantic-specification version it claims to implement, all constructs in its declared representability domain must participate in canonical convergence testing. A frontend feature is not complete when its unit tests pass; it is complete when equivalent construction through at least one independent path reaches the same semantic result.

This should begin with P13-T01, not wait until a phase-closing convergence task. The P13 campaign phase currently says its phase gate is that Rust/TypeScript/Python Simply and Semantic DSL converge on equivalent Semantic IR, with regex treated as an import frontend. [source-verification note](#source-verification-gaps) That is the correct final gate, but semantic-convergence assertions should be incremental hardgates during every P13 implementation task so divergence cannot accumulate until P13-T06. The campaign explicitly includes a P13-T06 task named “Certify frontend convergence and replace canonical tutorials.” [source-verification note](#source-verification-gaps)

## Provenance, diagnostics, and shared compiler intelligence

Source provenance must be **orthogonal to semantic equality but structurally preserved through semantic processing**.

This is one of the strongest parts of STRling's current contract. `SourceDocument` separates source identity from any frontend parse representation. Source ranges use an explicit `utf8-bytes` coordinate system and half-open offsets. `SourceOrigin` can carry multiple source spans and prior node identities, while constructed/source-less semantic nodes can simply lack source attribution. Semantic equality explicitly excludes origin. [source-verification note](#source-verification-gaps)

MLIR provides strong external validation for this style of design. Its IR treats source location as an integral property and supports several location forms, including call-site locations and `FusedLoc`. `FusedLoc` exists specifically because compiler transformations can merge constructs and would otherwise partially or completely lose their source attribution. [source-verification note](#source-verification-gaps) MLIR's diagnostic infrastructure likewise treats source locations as foundational compiler data rather than something reconstructed by a command-line frontend. [source-verification note](#source-verification-gaps)

The important STRling invariant should be expressed as a provenance law:

> **Every semantic node produced from authored source either retains a valid origin, inherits a documented union/derivation of parent origins when normalization combines nodes, or is explicitly classified as compiler-generated. Origin loss must never occur implicitly.**

When normalization coalesces two literals, for example, the right semantic result may be one literal node, but the source origin may need two contributing spans. When a source construct expands into multiple semantic operations, each generated operation should retain derivation from the originating construct. This is analogous to MLIR's fused and nested location machinery. [source-verification note](#source-verification-gaps)

This should be property-tested independently of semantic equality. A useful pattern is:

```text
semantic equality:
    ignore source origin

provenance conformance:
    require every retained/derived node to satisfy origin-preservation rules

presentation conformance:
    require diagnostics to project those origins correctly into each source language
```

That separation prevents a common mistake: keeping source syntax embedded inside the semantic model merely because diagnostics need it.

STRling's diagnostic contract is also well aligned with mature compiler architecture. It defines one diagnostic shape for compiler APIs, CLI, LSP, editors, bindings, and conformance assertions. `code`, `phase`, and `category` supply stable machine identity; English messages are presentation text; severity ownership is explicit; and diagnostic ordering is deterministic. [source-verification note](#source-verification-gaps) This mirrors an important compiler principle: **diagnostic identity is compiler semantics; diagnostic rendering is client presentation.**

A multi-frontend system needs two diagnostic classes:

**Frontend diagnostics** concern malformed tokens, invalid grammar, frontend-only directives, or ambiguous source syntax. Their codes can be frontend-namespaced because equivalent syntax does not exist across every authoring language.

**Canonical semantic diagnostics** concern things such as invalid semantic references, contradictory semantic requirements, or other target-neutral semantic violations. Once semantic construction has succeeded, their machine identity should not depend on whether the semantic program came from DSL, Simply, regex import, or source-less canonical input.

That distinction means “all frontends have the same diagnostics” is too strong. A Python builder cannot reasonably receive the same parse error as malformed DSL punctuation. The required invariant is instead: **same successfully constructed semantic problem → same canonical semantic diagnostic; different source syntax → presentation and source-local syntax diagnostics may differ.**

Clang's architecture again provides a useful small-scale analogy: multiple attribute spellings are parsed into `ParsedAttr` and converted into semantic attributes before semantic handling. [source-verification note](#source-verification-gaps) STRling should likewise avoid letting an imported regex spelling survive into later diagnostics as semantic authority. The core can diagnose “backreference to unavailable capture identity”; a regex presenter may then say where the `\1` came from while a Simply presenter points at the builder call that created the reference.

The same architecture should power tooling. Roslyn's Workspace model provides IDE clients direct access to compiler-layer source, syntax, semantic models, and compilation snapshots instead of asking tooling authors to reproduce those facts. [source-verification note](#source-verification-gaps) STRling's P16 campaign phase states the same goal explicitly: editors, CLI, and libraries should share the same parsing, diagnostics, analysis, and source semantics; its phase gate rejects Python/TypeScript shadow parsers or compilers and requires standalone and embedded STRling to receive identical diagnostics. The phase is currently marked **Not Started**. [source-verification note](#source-verification-gaps)

That is strongly supported by research, with one refinement: **share semantic intelligence, not UI lifecycle.** LSP/editor layers legitimately own document versions, cancellation, debounce, caching policy, coordinate conversion, editor configuration, and rendering. Those are host concerns. Parsing meaning, semantic facts, diagnostic identity, navigation identity, explanations, and feature availability should be compiler/query concerns.

rustc's demand-driven query architecture demonstrates a scalable way to expose compiler facts: compiler computations are keyed functions whose results can be cached and connected in a dependency graph. [source-verification note](#source-verification-gaps) **Recommendation, not a requirement:** STRling should eventually expose compiler intelligence through stable fact/query APIs rather than making every editor request execute an all-or-nothing “compile everything” operation. But adopting a full Salsa/rustc-style incremental database before real P16 latency measurements justify it would be premature. Purity and canonical ownership matter first; sophisticated invalidation can come later.

## Host adapters, compatibility, and semantic leakage

A thin binding is not defined by line count. It is defined by **what decisions it is allowed to make**.

A host package may legitimately own idiomatic names, classes versus records, exceptions versus result objects, sync/async wrappers, ownership/lifetime wrappers, native-library loading, serialization, language-specific type conversions, and convenience methods whose expansion is mechanically specified.

It must not own:

```text
parse meaning
semantic validation
semantic defaults
normalization
capture/reference resolution
analysis
safety or portability authority
target feature tables
target lowering
emitter decisions
stdlib semantic definitions
diagnostic classification
```

The strongest acceptance criterion is:

> **Adding a new semantic feature to STRling should require zero semantic implementation changes in existing host adapters.**

That is also the stated phase gate of STRling P17: all supported packages are to delegate semantics to the Rust core so that a compiler feature requires no semantic ports to host bindings. P17 is presently **Not Started** in the campaign. [source-verification note](#source-verification-gaps)

Libclang is a useful mature precedent for the interface boundary. Clang's tooling documentation recommends libclang for clients in languages other than C++ that need a stable, high-level, backwards-compatible interface rather than direct coupling to Clang's internal C++ AST APIs. [source-verification note](#source-verification-gaps) Libclang's own stability documentation nevertheless warns that APIs can evolve, deprecated interfaces can eventually disappear, and behavior can change as compiler bugs are fixed. [source-verification note](#source-verification-gaps) The lesson for STRling is that **thin adapters need a deliberately designed public compiler protocol; exposing Rust internal types via FFI is not a substitute.**

The current STRling protocol is particularly strong here: `CompileRequest` and `CompileResult` are defined as transport-independent data, not as an RPC mechanism or Rust ABI. They can be used in-process, over FFI, or over another transport, while correlation IDs, host exceptions, streams, and host objects remain outside compiler semantics. [source-verification note](#source-verification-gaps) This is exactly the right abstraction boundary for a seventeen-language ecosystem.

The versioning model is likewise research-aligned. STRling currently separates:

| Version identity | What it should govern |
|---|---|
| Semantic specification | Meaning of STRling programs |
| Frontend/dialect version | Syntax or API-to-semantic mapping |
| Compiler release | Implementation capabilities and bug fixes |
| Canonical contract/schema version | Serialized request/result interoperability |
| Adapter/package version | Host API and packaging compatibility |
| Native/WASM/ABI protocol version | Foreign-function interoperability |
| Target-profile version | Facts about a particular target-engine/runtime version |

STRling's versioning document already establishes the first five conceptual separations: semantic-specification versions are independent of compiler, package, binding, schema, and target-profile versions; compiler releases must declare the exact specification versions they implement; host packages can version independently but must identify the compiler/spec support they expose; and target profiles are independently versioned and prohibited from redefining STRling semantics. [source-verification note](#source-verification-gaps)

**Recommendation:** P13 and P17 should turn that conceptual separation into an executable compatibility handshake. Every adapter/compiler interaction should be able to establish at least:

```text
contract versions accepted
semantic specification versions supported
frontend versions supported
compiler implementation/version identity
requested optional capabilities
```

No binding should implement “fallback to the latest semantics I understand.” STRling's existing specification already prohibits silently selecting another semantic specification version, which is the correct rule. [source-verification note](#source-verification-gaps)

Three safeguards are especially important.

First, **semantic defaults must not be replicated in generated wrappers**. An omitted argument such as repetition mode, text mode, case behavior, or validation policy can be just as semantic as an explicit operation. Host-language default arguments are therefore dangerous unless generated directly from the specification and proven invariant across adapters.

Second, **bindings must not deserialize Semantic IR and interpret it semantically** merely because doing so is convenient for local APIs. They may project data into host objects; they should not perform analysis over it.

Third, architecture fitness tests should operate structurally. Search-based checks for suspicious words are useful but insufficient. The dependency graph should make it impossible for bindings to import target emitters or internal semantic implementation modules, and conformance should prove that host calls serialize to the same canonical operations as direct core calls.

## Evaluation of STRling Fourth Edition

### What is actually implemented, planned, and unverified

The investigation supports the following status distinction.

| Capability | Assessment | Evidence |
|---|---|---|
| Canonical specification/contract boundary | **Repository-observed** | `spec/contracts/1.0` defines source, Semantic IR, diagnostics, analysis, compile request/result, portability, and related schemas. [source-verification note](#source-verification-gaps) |
| Explicit source identity/provenance and UTF-8 spans | **Repository-observed** | Canonical contract separates source identity, frontend identity, spans, provenance, and semantic equality. [source-verification note](#source-verification-gaps) |
| Rust canonical compiler kernel | **Repository-observed, deliberately bounded** | `core/` identifies itself as the reference Rust implementation of the contracts and describes deterministic normalization, analyses, diagnostics, capability evaluation, and planning. [source-verification note](#source-verification-gaps) |
| Regex-compatible frontend | **Repository-observed** | Protocol says the current kernel implements explicit `strling.regex-compat@1.0.0`, performs no frontend guessing, and then uses the common semantic pipeline. [source-verification note](#source-verification-gaps) |
| Regex migration differential/provenance completion | **Campaign-reported complete** | Campaign P08 is described as complete, with its parser and provenance/diagnostics work represented as completed tasks. [source-verification note](#source-verification-gaps) [source-verification note](#source-verification-gaps) |
| Simply semantic frontend | **Planned, not started** | P13 is marked Not Started; its objective is to keep Simply and the Semantic DSL as thin frontends over one compiler. [source-verification note](#source-verification-gaps) |
| Semantic STRling textual DSL | **Planned, not started** | Same P13 phase; convergence is the phase gate rather than an implemented current capability. [source-verification note](#source-verification-gaps) |
| Full CLI/LSP/editor rebase | **Planned, not started**, though a low-level canonical JSON compile transport already exists | P16 is Not Started, while the current protocol already defines a transport-only `./strling compile` JSON boundary. [source-verification note](#source-verification-gaps) [source-verification note](#source-verification-gaps) |
| Thin host-language migration | **Planned, not started** | P17 is Not Started and explicitly targets adapters rather than independent compilers. [source-verification note](#source-verification-gaps) |
| Multi-engine downstream work | **Campaign-reported in progress** | P11 is In Progress; its campaign record reports completed ECMAScript work but an open phase gate and subsequent Python work. [source-verification note](#source-verification-gaps) |
| Latest campaign-reported commits present on connected GitHub branch | **Not independently established** | GitHub branch inspection showed `9991575...`; Notion reports later P11 SHAs. [source-verification note](#source-verification-gaps) [source-verification note](#source-verification-gaps) |

The last distinction matters. A migration tracker can legitimately be ahead of a remote integration branch, but architecture certification should ultimately be reproducible from an immutable repository revision. The Fourth Edition campaign itself emphasizes committed/checkpoint evidence; therefore tracker-to-branch synchronization should be treated as a release-evidence concern, not merely administrative metadata.

### Architectural choices strongly supported by research

**One semantic implementation in Rust is strongly supported.** The important qualifier is that Rust is an implementation choice; the architectural virtue is a singular semantic authority. GCC, Roslyn, Clang, and MLIR all demonstrate the long-term leverage gained when downstream analysis and tooling depend on shared compiler representations rather than repeating knowledge in clients. [source-verification note](#source-verification-gaps)

**Rejecting a universal syntax AST is strongly supported.** Different frontends should preserve syntax representations appropriate to their authoring form. GCC explicitly permits frontends to use completely different representations before entering language-independent compilation. [source-verification note](#source-verification-gaps) STRling's P05-T02 adaptation is therefore a sound correction rather than a retreat from canonical architecture. [source-verification note](#source-verification-gaps)

**Separating provenance from semantic equality is strongly supported.** MLIR's first-class location machinery and fused locations validate the idea that source attribution can be preserved through transformations without being confused with semantic meaning. [source-verification note](#source-verification-gaps)

**A canonical diagnostic envelope with presentation-independent identity is strongly supported.** It allows APIs, CLI, LSP, conformance tests, and language adapters to share compiler facts while presenting them differently. STRling's current diagnostic protocol already embodies this split. [source-verification note](#source-verification-gaps)

**Explicit frontend selection is strongly supported.** A compiler whose meaning depends on guessing whether an input is regex-compatible, Semantic DSL, or some host-generated form will eventually make context-sensitive compatibility decisions. STRling's current refusal to infer the frontend is architecturally preferable. [source-verification note](#source-verification-gaps)

**Separately versioning semantic rules, transport contracts, packages, and target profiles is strongly supported.** MLIR's bytecode documentation makes the related point that serialized-format stability does not magically make evolving dialect semantics immutable; dialect evolution needs its own version handling and upgrade process. [source-verification note](#source-verification-gaps) STRling's versioning design explicitly makes these identities independent, which is the correct approach. [source-verification note](#source-verification-gaps)

**P16's “compiler intelligence as shared service” direction is strongly supported.** Roslyn shows the payoff of making compiler syntax/semantic models available to workspaces and IDE features, rather than implementing a second understanding of the language in the editor. [source-verification note](#source-verification-gaps)

**P17's thin-adapter direction is strongly supported.** libclang demonstrates why a stable, high-level foreign-language interface should stand between client ecosystems and compiler internals. [source-verification note](#source-verification-gaps)

### Areas requiring additional safeguards or reconsideration

The most important concern is **regex-first semantic bias**.

GCC illustrates that an ostensibly common representation can retain biases from the languages for which it was initially designed; GCC's own internals also retain carefully quarantined frontend-specific tree concepts before common lowering. [source-verification note](#source-verification-gaps) STRling has implemented the regex-compatible path before Simply and the Semantic DSL. [source-verification note](#source-verification-gaps) [source-verification note](#source-verification-gaps)

**Inference:** this sequencing creates a risk that concepts convenient for regex syntax will become mistaken for fundamental STRling semantics simply because they are the first concepts exercised end to end.

**Recommendation:** before ratifying P13 semantics, conduct a “frontend neutrality audit” of every public semantic concept. For each one, require answers to:

```text
Can this concept be constructed naturally without regex syntax?
Is its identity defined semantically rather than by regex spelling?
Does any default originate in regex conventions rather than the STRling spec?
Would a builder API need to expose target punctuation to construct it?
Does its analysis require consulting its original regex syntax?
```

Any “yes” to the latter questions is evidence of leakage.

A second safeguard concerns **sugar**. Clang's attributes show the desirable model: several syntax spellings become one semantic attribute before semantic handling. [source-verification note](#source-verification-gaps) STRling should codify the analogous rule:

> A frontend feature is sugar only if its entire semantic expansion is specification-owned, deterministic, and expressible using already existing semantic constructs.

If a frontend-specific construct needs a permanent tag in the canonical model so later analyses can treat it differently, it was probably not sugar. It is either a real semantic feature that deserves specification/versioning treatment or a presentation annotation that belongs in provenance.

A third concern is **frontend-owned defaulting**. Builder APIs are especially prone to this. In TypeScript, Python, Rust, Java, etc., optional parameters can silently make different semantic decisions because different maintainers implement “sensible defaults.” P13's host-neutral builder protocol should therefore own all semantic defaults before any language facade is implemented. The phase's current intention that Simply remain a thin frontend over one compiler is correct, but the defaulting rule must be an explicit hardgate, not merely an API-design convention. [source-verification note](#source-verification-gaps)

A fourth is **convergence certification timing**. P13's end-of-phase convergence gate is good. [source-verification note](#source-verification-gaps) **Recommendation:** require convergence continuously for each frontend feature from its first implementation. A phase-closing corpus then certifies completeness, rather than discovering months of drift.

A fifth is **public interchange contract versus internal compiler representation**. The serialized Semantic IR can be a stable canonical interchange format without requiring every future internal optimization or analysis representation to become public ABI. Clang's stable high-level libclang interface deliberately insulates clients from more volatile compiler internals. [source-verification note](#source-verification-gaps) **Recommendation:** STRling should explicitly state that serialized semantic contracts define external meaning and interoperability, while Rust's internal representation is free to evolve so long as it preserves those contracts. Do not expose Rust enum layout or internal node ownership through native bindings.

A sixth is **false confidence from downstream equivalence**. Two frontends emitting the same regex for a few targets does not prove they mean the same thing. A target may collapse distinctions, the test corpus may fail to exercise a distinction, or two independent bugs may happen to generate the same output. The primary frontend-convergence oracle must remain target-neutral semantic equality and derived semantic facts. Target execution is valuable supplementary evidence, not the definition of frontend equivalence.

A seventh is **architecture leakage into “convenience” packages**. P17 should not accept adapters merely because their main compile call delegates to Rust. A wrapper that locally resolves capture names, selects flags, validates repeat bounds, expands standard-library helpers, or classifies diagnostics is already a partial compiler. P17's phase gate should be supplemented by static dependency rules and cross-adapter construction traces proving that supported calls produce equivalent canonical requests. [source-verification note](#source-verification-gaps)

## Rejected alternatives and unresolved questions

Several alternatives should be rejected explicitly so they do not reappear as local optimizations during the migration.

**Independent semantic compilers per host language — reject.** Testing can detect drift but cannot eliminate the governance and release burden of N implementations. It also makes each new semantic feature an N-way migration.

**One universal source AST for regex, Semantic DSL, and builder APIs — reject.** It forces unrelated authoring structures into a union syntax model or discards source fidelity. STRling has already made the correct adaptation here. [source-verification note](#source-verification-gaps)

**Treat regex-compatible syntax as the semantic reference implementation — reject.** Regex import is an interoperability frontend; its historical behavior is useful migration evidence, not semantic authority. STRling's own protocol/specification hierarchy already points in this direction. [source-verification note](#source-verification-gaps)

**Have Simply generate Semantic DSL text and feed the textual parser — reject as the canonical path.** That would convert structured intent into escaped text only to parse it back, introduce unnecessary diagnostics/source questions, and make the textual language indirectly authoritative over the programmatic API. Both should construct the same semantic language independently through core-owned construction facilities.

**Permit frontend-specific semantic extension nodes “temporarily” — reject by default.** GCC documents the maintenance constraints created by language-specific tree nodes and requires conversion before common compiler passes. [source-verification note](#source-verification-gaps) In STRling, a frontend-only semantic node should be considered an architecture exception requiring explicit specification review.

**Use emitted regex or runtime matches as the definition of frontend equivalence — reject.** Those are target-dependent observations and are incapable of proving target-neutral semantic identity.

**Let each tool consume serialized compiler output and reconstruct higher-level intelligence independently — reject.** Roslyn's model shows the more sustainable direction: reusable syntax and semantic compiler models should directly serve IDE/workspace features. [source-verification note](#source-verification-gaps)

Several questions remain genuinely unresolved and should be closed before frontend convergence can be considered a hard architectural guarantee.

**Semantic equality needs one executable authority.** The current contract already says which classes of data do not affect equality, including source origins and appropriate identity renaming. [source-verification note](#source-verification-gaps) What remains to be made unmistakable is whether one core function/fingerprint is the sole executable definition used by conformance, builders, migration, and frontend tests. No adapter or test suite should reimplement equality.

**The pre-normalization boundary needs an explicit contract.** Does a frontend emit an unnormalized semantic-construction structure that only Rust can canonicalize, or is every frontend expected to produce an object already satisfying canonical Semantic IR invariants? The latter would duplicate normalization obligations and should be avoided.

**Semantic defaults need a named owner.** Every omitted option in DSL and every optional builder argument needs a specification-owned resolution rule. This deserves a compatibility test matrix across versions and frontends.

**Provenance propagation needs algebraic invariants.** The existing data model is capable of representing multiple contributing spans and derived node identities. [source-verification note](#source-verification-gaps) The compiler still needs exhaustive laws for merge, split, synthetic construction, recovery, and deletion so normalization never loses locations accidentally.

**Diagnostic namespaces need a precise frontend/core rule.** Syntax errors should remain naturally frontend-specific; semantic diagnostic identities should converge. That ownership boundary should be documented before the Semantic DSL and Simply adapters begin defining their own error APIs.

**Representability must be explicit.** “All frontends mean the same thing” must not mutate into “all frontends can express every thing.” The correct condition is equality **within the shared representable semantic domain**, plus explicit unavailable states elsewhere. MLIR's treatment of semantically equivalent but not universally reversible forms is a useful precedent. [source-verification note](#source-verification-gaps)

**Cross-version convergence needs a policy.** Equivalent forms should only be compared under an explicitly selected semantic-specification version. STRling's existing ban on implicit latest-version fallback provides the right base. [source-verification note](#source-verification-gaps) Frontend packages that support multiple spec versions will need version-qualified conformance corpora.

**Partial/recovery semantics must remain quarantined.** The current protocol already says partial semantic data is diagnostic recovery material and cannot feed analysis, portability, lowering, or emission. [source-verification note](#source-verification-gaps) That rule is especially important once an editor parser exists; error-tolerant IDE trees must never silently become executable semantic programs.

**The stable adapter substrate needs to be chosen without exposing Rust internals.** P17's native/WASM direction is sound. [source-verification note](#source-verification-gaps) The open design decision is how much of the stable surface is serialized protocol versus opaque native operations. Whichever path is chosen, both must be proven semantically equivalent.

**The P16 intelligence API needs a granularity decision.** A pure `CompileRequest → CompileResult` boundary is excellent for interoperability, but diagnostics, completion, navigation, hover, formatting, and rapid editing may benefit from finer-grained compiler queries. rustc demonstrates that demand-driven fact computation can scale well. [source-verification note](#source-verification-gaps) This should be treated as an engineering decision informed by P16 latency and caching requirements, not as a new semantic architecture.

The overarching recommendation is therefore:

> **STRling should define “one language semantically” as an enforceable convergence contract, not merely as an implementation topology.** Frontends may differ radically above the semantic-construction boundary, but each supported frontend must be specification-mapped, core-normalized, independently provenance-preserving, and continuously certified against canonical semantic cases. The compiler core must own all meaning-bearing defaults, validation, normalization, analysis, and diagnostic identity. Tooling and bindings must consume those facts rather than reconstruct them.

On that standard, Fourth Edition's present architectural direction is fundamentally well supported. Its rejection of a universal syntax AST, explicit frontend identity, specification sovereignty, target-neutral canonical semantics, first-class provenance, stable diagnostic envelope, independent version dimensions, common compiler protocol, P16 shared-intelligence plan, and P17 thin-adapter plan all align with mature compiler precedent. [source-verification note](#source-verification-gaps) [source-verification note](#source-verification-gaps) [source-verification note](#source-verification-gaps) [source-verification note](#source-verification-gaps) [source-verification note](#source-verification-gaps)

The architecture will become materially stronger, however, if Fourth Edition adds four explicit hard guarantees before P13 and P17 close: **one core-owned normalization boundary; one executable semantic-equality oracle; per-feature frontend convergence from the moment each feature lands; and architecture-enforced prohibition of semantic defaults or analysis in host adapters.** Combined with a frontend-neutrality audit designed specifically to counter regex-first bias, those safeguards turn “many authoring surfaces over one Rust compiler” from a structural aspiration into a testable semantic invariant.
