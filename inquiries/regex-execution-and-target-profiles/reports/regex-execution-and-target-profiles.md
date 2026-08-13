# Execution and Target Profile Architecture for a Version-Aware Portable Regex System

Role: Research report  
Origin: OpenAI deep-research session commissioned for STRling Research Intelligence  
Generated: 2026-08-12  
Imported: 2026-08-12  
Source verification: Partially verified  
Last reviewed: 2026-08-12  
Current status: Active input

## Source verification gaps

The imported report contained opaque research-session citation markers without a durable marker-to-source table. The markers were removed; unresolved claim-level citations, external comparisons, and proposed models require verification. Current-state claims were checked against the downstream authorities linked by the active inquiry.

## Executive findings and formal model

The central architectural conclusion is:

> **When STRling says that it targets or reasons about a regex system, the statement should ultimately resolve either to an exact concrete execution-profile revision, or to a versioned target-profile contract whose current resolution is a closed set of exact concrete execution-profile revisions plus explicit operation and configuration constraints.**

An engine, dialect, major runtime line, or convenience label is not sufficient. `pcre2`, `javascript`, `.NET`, `Node 22`, `Java`, or `ICU` can identify useful families or selectors, but none by itself identifies the runtime conditions needed either for reproducible empirical claims or for a compiler guarantee.

The empirical side of this problem is substantially more settled in Regex Conformance than the initial question might suggest. The completed dimensionality work and accepted D054/D055 decisions establish profile families as typed executable-surface component-graph templates and concrete profiles as exact release assignments plus persistent behaviorally material facets. They deliberately leave ordinary per-probe flags, operations, input values, regions, and many environmental variables outside durable profile identity.

This is also consistent with the current Conformance identity model: its logical-execution identity separately requires a **profile**, **environment**, **operation**, **dimensions**, and **vector** rather than conflating all execution conditions into one profile identifier. The Conformance foundation likewise says that systems, components, releases, profile families, concrete profiles, adapters, runtimes, artifacts, platforms, and material environmental dimensions are separate first-class concerns, while historical but no-longer-reproducible profiles remain represented.

The remaining architectural gap is therefore chiefly the **compiler-facing layer**: how STRling can name one runtime or a set of runtimes, constrain the execution modes under which its output is valid, quantify what the compiler may assume about that set, and keep such a contract reproducible as runtime release lines continue to evolve.

A useful model has six concepts:

| Concept | Formal role | What it answers |
|---|---|---|
| **Regex system / dialect authority** | Normative or conceptual identity | “What language or system is this associated with?” |
| **Profile family** | Versioned graph template for one externally meaningful executable regex surface | “What public runtime surface and component roles are involved?” |
| **Concrete execution profile** | Exact durable assignment of releases and persistent material facets to a family revision | “Which reproducible executable surface is this?” |
| **Environment realization** | Physical/runtime realization satisfying that concrete profile | “Which binary/container/OS/provider/configuration actually instantiated it?” |
| **Execution coordinate** | Profile + realization + operation + invocation-specific behavioral settings | “Under exactly what conditions was this observation made?” |
| **Target profile** | Compiler-facing contract selecting admissible profiles and the assumptions STRling may make about them | “Against which runtime population and semantic envelope may STRling compile?” |

This separation reconciles two apparently competing requirements. An **execution profile must be exact enough to be scientifically meaningful**, but it must not explode into a new durable entity for every pattern flag, start offset, timeout, input string, or call to `find()` versus `matches()`. Conformance's accepted derivation model explicitly makes this distinction.

Formally, let a concrete execution profile be:

\[
E =
\langle
F^r,\,
R,\,
P,\,
D,\,
A
\rangle
\]

where:

- \(F^r\) is one exact revision of a profile-family graph;
- \(R\) is the exact release assignment for the root surface and every required behaviorally relevant component node;
- \(P\) is the assignment of persistent material facets, such as a fixed code-unit width or matcher backend;
- \(D\) contains resolved persistent defaults whose effective values are material;
- \(A\) identifies qualified authority/data snapshots where these form part of the executable surface, such as a fixed Unicode-data provider.

This closely matches the ratified Conformance derivation model, which binds exact graph releases, persistent material facets/defaults, operation-surface revision, external authorities where needed, derivation policy, lifecycle, and reproducibility state.

An actual environment realization \(\rho\) satisfies that profile:

\[
\rho \models E
\]

A complete empirical execution coordinate is then:

\[
X =
\langle
E^r,\,
\rho,\,
o,\,
\delta
\rangle
\]

where \(o\) is the requested operation and \(\delta\) contains invocation-scoped dimensions such as flags, region, start position, replacement input, and resource limits. The existing Conformance logical-execution schema already expresses essentially this decomposition.

A compiler-facing target profile should instead be modeled as a **predicate and contract**, not as a synonym for \(E\):

\[
T =
\langle
Q,\,
\Gamma,\,
\Omega,\,
\Pi,\,
K
\rangle
\]

where:

- \(Q\) is a selector over admissible concrete profiles;
- \(\Gamma\) is the required execution/configuration envelope;
- \(\Omega\) is the operation scope for which the target is meaningful;
- \(\Pi\) is the set of semantic/capability propositions the compiler is permitted to rely on;
- \(K\) is the support, evidence, and freshness policy governing those propositions.

Because \(Q\) can describe a moving support line, compilation and certification need an additional immutable closure:

\[
\Theta =
Resolve(T^r,\ Registry^r,\ cutoff)
=
\langle T^r,\ S^r \rangle
\]

with:

\[
S^r = \{E_1^r,E_2^r,\ldots,E_n^r\}
\]

an immutable support-set revision.

For a compiler strategy that emits one artifact without runtime dispatch, the governing requirement is:

\[
\forall E \in S^r:
\quad
E \models \Gamma
\;\land\;
E \models \Pi
\]

within the operation scope \(\Omega\).

This is deliberately **not a redefinition of regex portability**. It is the compiler-selection rule that follows once the prior Research Intelligence work has already defined portability formally and established that target-specific legality and planning belong downstream of canonical semantic representation.

The most important materiality principle is therefore:

> **Behaviorally material is not synonymous with profile-identifying.**

A flag can alter behavior while remaining invocation-scoped. A timeout can alter whether execution completes while remaining a vector or execution setting. An operating system can be essential provenance without defining a new regex profile. Conversely, a host API that looks like a thin wrapper can become profile-identifying if it changes index units, pattern preprocessing, option mapping, errors, replacement syntax, or backend selection. Conformance's six-part materiality test already captures this distinction by considering persistence, behavioral materiality, breadth, evidentiary/contractual basis, reproduction relevance, and bounded derivability.

That separation is the foundation on which both empirical execution identity and compiler target contracts should be built.

## Behavioral dimensions and materiality taxonomy

A dimension should enter **stable concrete-profile identity** when its value is persistent across the surface being named, can materially affect observable regex behavior or capability, is necessary to distinguish reproducible configurations, and can be resolved to a bounded value. That rule is already implicit in D055: exact component releases and persistent material facets affect the profile coordinate, while local operation/flag/input choices and most environmental stratifiers do not.

The practical taxonomy should therefore classify each potential dimension into one of four locations:

1. **Profile identity** — persistent property of the executable surface.
2. **Execution coordinate/vector** — behaviorally material but selected per compilation, matcher, operation, or invocation.
3. **Environment stratification** — recorded because it may explain differences or capability availability, but not presumed semantic identity.
4. **Provenance-only** — needed for audit/reproduction logistics but not behavioral identity.

Conformance's completed dimensionality task already uses the closely related `profile`, `vector`, `environment-execution`, `analysis-only`, and `unresolved` classifications.

The following taxonomy is the recommended common conceptual model for STRling, Regex Knowledge, and Regex Conformance:

| Dimension | Default placement | Materiality rule |
|---|---|---|
| Regex system / dialect | Family authority or classification | Identifies a language/authority relationship, not an executable runtime by itself. |
| Implementation | Profile-family graph | A component role; exact executable identity requires a release or other exact realization. |
| Implementation release | **Profile** | Exact root release belongs in concrete identity. |
| Embedded/delegated engine | **Profile graph node** when behaviorally required | Bind exact release when it can affect the root surface. Do not infer host semantics from engine identity alone. |
| Host language/runtime | **Profile** when it exposes or constrains the public regex surface | Exact release matters when regex behavior changes with the host runtime. |
| Wrapper/library/binding | **Profile** when it transforms the observable surface | Identity-significant when it changes inputs, options, backend selection, results, errors, indices, replacement, or defaults. |
| Matcher API | Family/profile surface | API identity belongs in the public executable surface when APIs expose materially different contracts. |
| Operation | **Execution coordinate**, normally | `search`, `match`, `fullmatch`, `split`, and `replace` generally should not mint profiles. |
| Compile configuration | Profile if persistent; otherwise vector | Build/runtime-fixed options versus per-pattern compile choices must be distinguished. |
| Match configuration | **Vector/execution coordinate**, normally | Per-match options, positions, limits, contexts, and similar controls. |
| Flags/modes | **Vector**, normally | Promote only when a persistent mode defines a durable execution surface. |
| Unicode provider/data version | **Profile** if runtime-bound | Exact provider/data matters where behavior depends on it. |
| Unicode mode | Vector/configuration when selectable | `UTF`, Unicode-property, ECMAScript-Unicode-like modes are invocation/compile settings unless the surface fixes them. |
| Encoding/code-unit width | **Profile** if fixed by API/build | Per-input text type may instead be a vector dimension. |
| Index units | **Profile/API contract** | Result semantics such as bytes, code units, code points, or characters are part of the observable host surface. |
| Locale/culture | Vector/environment by default | Profile only where fixed, broadly material, and contractually part of the surface. |
| Newline policy | Resolved configuration | Profile if build/API-fixed; otherwise invocation setting. Record effective value either way. |
| Matcher algorithm/backend | **Profile/family** when it is a persistent distinct surface | Ordinary backtracking versus DFA/non-backtracking can qualify; transient internal strategy need not. |
| JIT/interpreter | Environment/execution stratifier by default | Promote only if it defines a required public contract or produces stable semantic differences. |
| Fallback behavior | Profile if persistent/observable | Particularly important when one mode silently delegates to another backend. |
| Replacement language | Profile/API surface for replacement-capable targets | Replacement syntax is distinct from pattern grammar and should be scoped to replacement operations. |
| Region/start offset | **Execution coordinate** | Normally invocation-specific even though behaviorally significant. |
| Resource limits | Vector or execution policy | Fixed public-service limits may become profile material; per-call limits do not. |
| Relevant build features | **Profile** when semantically material | Examples include code-unit width or disabling syntax/features; arbitrary build metadata does not. |
| OS/platform/architecture | Environment stratification by default | Promote when there is evidence or a contract that it changes semantics or required capabilities. |
| Artifact digest | Environment/provenance normally | Useful for exact reproduction; only semantic identity when an otherwise unversioned artifact is the sole exact discriminator. |
| Cache path, process ID, timestamps, worker IDs | Provenance only | They should not create behavioral identities. |

This last distinction is reflected in Conformance's environment-fingerprint work: the fingerprint is designed to bind recipe revisions, target coordinates, artifacts, provider implementations and capabilities, runtime/configuration facts, isolation/network policy, and verification data while excluding physical transaction identifiers, cache paths, provider handles, and timestamps from scientific identity.

PCRE2 demonstrates why the taxonomy cannot be flattened into `engine + version`. Its official build documentation describes separate 8-, 16-, and 32-bit libraries; optional Unicode property support; runtime selection of UTF processing; build-time ability to prohibit `\C`; selectable default newline conventions that applications can subsequently override; and optional JIT support. These occupy different modeling levels: code-unit library and a fixed prohibition can be profile facets, whereas UTF/UCP and an overridable newline convention may be compile/invocation settings unless a wrapper fixes them.

Similarly, .NET's `NonBacktracking` option is not merely an implementation optimization: Microsoft documents that it uses a different non-backtracking engine and that it does not support all features of the default engine. Thus it is unquestionably **behaviorally material**, but whether it creates another concrete profile depends on persistence: when a STRling target fixes “all compiled expressions use NonBacktracking,” it can form part of the target execution contract; when an individual regex opts into it, it can remain an execution/compiler coordinate rather than multiplying the underlying `.NET Regex` profile.

### The rule for defaults

Defaults require special treatment because the word *default* describes **selection provenance**, not an effective semantic value.

Every material default should conceptually record both:

\[
selection\_origin
\in
\{
explicit,\ inherited,\ default,\ negotiated,\ auto\mbox{-}detected
\}
\]

and:

\[
effective\_value = v
\]

A profile or observation must be behaviorally scoped to \(v\), not merely to the statement “uses default.”

PCRE2 is a concrete illustration: its default newline convention can be selected at build time and subsequently overridden by an application. Two observations both labeled `newline = default` could therefore execute with different newline semantics.

The compiler-facing corollary is stronger: a target should constrain **effective semantics** wherever the compiler depends on them. `newline = default`, `culture = default`, `Unicode = runtime default`, or `backend = automatic` is unsuitable as a durable compiler assumption unless the target profile also binds the mechanism that deterministically resolves that default.

Defaults also need to retain their origin because testing the host's *default behavior* is itself useful. The right record is effectively:

> selected by default; effective value = X; default authority = Y.

That preserves both empirical meaning and semantic exactness.

### Build identity is not artifact identity

A binary checksum should not automatically enter profile identity. Two independently built artifacts can satisfy one concrete profile if all persistent material facets are identical. Conversely, two binaries with the same nominal upstream version may belong to different profiles when they were compiled with behaviorally material build features.

Thus:

\[
same\ release \not\Rightarrow same\ profile
\]

and:

\[
different\ artifact \not\Rightarrow different\ profile
\]

PCRE2's build-selectable code-unit and Unicode/newline characteristics demonstrate the first point. Conformance's existing separation among profile coordinates, environment fingerprints, artifacts, and provider/runtime facts supports the second.

This prevents a profile registry from degenerating either into coarse marketing-version labels or into an inventory of every binary ever produced.

## Families, versions, embedded engines, aliases, and unknowns

A **profile family** should remain deliberately weaker than a behavior claim. Its purpose is to express identity continuity and the topology of an executable surface across releases.

Conformance D054 already establishes exactly the right abstraction: a family is a durable assigned entity for one externally meaningful regex execution surface, whose immutable revisions describe a typed graph template. Potential node roles include host/runtime, regex facility, engine/backend, wrapper/binding, dialect authority, Unicode/text provider, matching backend, replacement subsystem, result/error adapter, service provider, and relevant platform dependency. Edges express relationships such as exposing, embedding, delegating, binding, selecting a backend, transforming input/options/results/errors, supplying Unicode data, or providing replacement behavior.

A **concrete profile** instantiates one such graph with exact releases and persistent material facet values.

The distinction is:

\[
Family = executable\ surface\ topology
\]

\[
ConcreteProfile = exact\ executable\ realization\ class
\]

A family therefore **must not imply that capabilities are inherited uniformly across all releases**. Regex Knowledge's existing program model likewise keeps engine family, engine, dialect, implementation, host, execution profile, Unicode model, replacement behavior, and host API distinct, and explicitly treats unsupported, unknown, and evidence-backed claims separately rather than inheriting capability merely through lineage.

### Why “Node 22” is not an execution profile

Node illustrates the versioning problem exceptionally well. The current Node archive treats v22 as a release line containing many concrete releases, not one executable version. Node also exposes `process.versions`, which reports not only the Node version but dependency versions including V8, ICU, Unicode data, and other bundled components.

Consequently:

```text
node-22
```

is suitable as a **family selector, support policy, or alias**, but not as an empirical concrete-profile identity.

A sound graph is conceptually:

```text
Node.js regex surface
    │
    ├── exposes ECMAScript RegExp API
    │
    ├── embeds exact V8 release
    │       └── provides RegExp implementation
    │
    └── runtime release may expose/bind other material data providers
```

The concrete profile binds the exact Node release and the exact relevant embedded engine/data components. That need not mean manually duplicating information which the Node release uniquely determines; derivation can infer those releases from a trustworthy release manifest. But **the profile coordinate must resolve them**, so the claim remains meaningful even when a major-line label hides dependency changes.

This gives a general rule:

> **A host release is enough to identify an embedded component only when the host release deterministically identifies the relevant embedded release and build configuration. Otherwise the embedded component must be bound independently.**

Node's ability to report dependency versions at runtime is particularly useful for verifying that derivation.

### Embedded engines do not replace host profiles

MySQL demonstrates why an embedded engine is a graph node, not an alternate name for the public regex surface. MySQL 8.0 implements its regex support with ICU, but MySQL itself determines the SQL operations presented to users, resource controls, input and option handling, and result/index semantics. Its documentation notes both the ICU backend and that ICU regex functions operate on UTF-16 with positional indexes based on 16-bit chunks; it also exposes `regexp_stack_limit` and `regexp_time_limit`. Earlier MySQL 8.0 releases before 8.0.4 instead used the Henry Spencer implementation.

Therefore neither:

```text
engine = "icu"
```

nor:

```text
dialect = "icu-regex"
```

is an exact identity for “MySQL regular expressions.”

The root of an empirical profile should be **the surface actually observed**. Embedded engines are components of its causal graph. D054's rule that backend lineage does not automatically confer root-surface capabilities is therefore crucial.

A wrapper or host creates a behaviorally meaningful profile boundary when it can do any of the following:

| Wrapper behavior | Why it matters |
|---|---|
| Preprocess or escape patterns | Changes accepted grammar or meaning. |
| Translate flags/options | Alters effective modes or can lose capabilities. |
| Select/fallback among engines | Engine behavior is conditional on the wrapper. |
| Convert text representation | Changes code-unit, encoding, or invalid-text behavior. |
| Transform captures/results | Alters observable match semantics. |
| Convert result indices | Changes span/index contracts. |
| Translate or normalize errors | Changes observable failure behavior. |
| Supply its own replacement grammar | Replacement semantics no longer equal the backend's. |
| Fix locale/newline/resource defaults | Creates a persistent surface-level contract. |
| Impose region/lifecycle behavior | Can alter anchors, continuation, or matcher state. |

A truly transparent binding may remain a graph node without forcing a new semantic family, but “transparent” should be established by contract or evidence rather than assumed from implementation thinness. This follows the current Conformance materiality standard, under which components that transform input, options, results, errors, or otherwise alter a broad reproducible execution surface are identity-relevant.

### Exact release, family line, and support range are different things

The registry should distinguish at least:

```text
ProfileFamily
    node-regexp

ConcreteProfile
    node-regexp @ exact Node release + exact relevant component assignment

TargetProfile
    node22-supported

TargetResolution
    node22-supported resolved at registry revision R
    -> {E1, E2, E3, ...}
```

The phrase **“works on every supported patch release in family X”** should never become an unqualified property of a mutable family.

At time \(t\), construct:

\[
S_{X,t} =
\{
E \mid E\ belongs\ to\ family\ X
\land
supportPolicy_t(E)
\}
\]

and make the claim:

\[
\forall E \in S_{X,t}: C(E)
\]

The set \(S_{X,t}\) receives an immutable support-set identity/revision. When another patch release enters the supported line, that produces \(S_{X,t+1}\); it does **not** retroactively add the new profile to the earlier certification.

This is analogous to compatibility modeling elsewhere. Python wheel compatibility tags intentionally describe compatibility classes such as interpreter/ABI/platform combinations rather than one physical installation. TLS version negotiation similarly distinguishes a client's supported set from the particular version selected for a connection. The useful architectural lesson is that **a set-valued compatibility contract and an exact realized endpoint are different entities**.

### Aliases must never become semantic identity

Aliases should be resolver inputs only:

```text
"node22"
"pcre2"
"dotnet-regex"
"current-node-lts"
"latest"
```

They resolve, under an explicit registry revision and context, to a typed canonical entity:

```text
alias
   -> profile-family
   -> concrete-profile
   -> target-profile
   -> support-set
```

The resolver should reject ambiguous cross-type resolution instead of quietly choosing an interpretation.

Conformance's schema policy already establishes the corresponding reproducibility rule: mutable `latest` aliases are not valid certification inputs; certified artifacts name exact schema revisions. The same rule should apply to STRling target resolution.

Thus a user may request:

```text
--target node22
```

but the resulting compiler artifact should record something equivalent to:

```text
target-profile-revision = ...
support-set-revision = ...
profile-registry-revision = ...
knowledge/capability-snapshot = ...
```

An alias can change what it resolves to tomorrow without changing yesterday's compiled artifact.

### Unknown material dimensions must fail closed

An exact profile cannot contain an unresolved **required material identity dimension** and still claim exactness.

Conformance's completed derivation work already adopts this rule: an unresolved required component release, backend, or persistent material facet becomes an unresolved derivation obligation rather than a partially specified concrete profile. Regex Knowledge likewise treats `UNKNOWN` as a legitimate knowledge state rather than silently converting missing evidence to `UNSUPPORTED`.

The architecture should therefore distinguish at least conceptually:

```text
known(value)
not-applicable
unresolved
opaque
conflicted
```

An *opaque* hosted service, for example, may be known to use “some PCRE2-compatible service” without exposing backend version. That is useful discovery information, but it is not a certified exact execution profile if backend version is known to be materially relevant.

A separate provisional/discovery entity may be worthwhile, but it should never be allowed to masquerade as a concrete exact profile.

## Target profiles as compiler contracts over profile sets

The cleanest distinction is:

> **Execution profiles classify reproducible runtime surfaces. Target profiles constrain what STRling promises to work against.**

They solve different questions.

An execution profile asks:

> *What exact persistent runtime configuration produced or could reproduce this behavior?*

A target profile asks:

> *Which runtime configurations are admissible for this compilation, and what common semantic/capability contract may the compiler rely on across them?*

A target may therefore denote one execution profile:

\[
|S|=1
\]

or many:

\[
|S|>1
\]

There is no reason to assume one-to-one correspondence.

### Target identity should describe a contract, not runtime provenance

A target-profile revision should contain conceptually:

| Target facet | Purpose |
|---|---|
| **Surface/family scope** | Identifies the kind of runtime being targeted. |
| **Membership policy** | Which exact execution profiles may satisfy the target. |
| **Operation scope** | Match/search/fullmatch/split/replace/etc. for which the target contract is asserted. |
| **Required effective modes** | Compile/match settings the runtime must use for STRling's assumptions to hold. |
| **Excluded modes** | Configurations under which the target guarantee does not apply. |
| **Capability/semantic contract** | Facts the compiler may rely on while selecting a lowering. |
| **Text/index contract** | Required encoding/code-unit/index behavior where relevant. |
| **Unicode contract** | Required provider/data envelope if compilation depends on Unicode data. |
| **Resource envelope** | Operational constraints that are material to generated expressions. |
| **Support lifecycle policy** | Which upstream releases are currently in scope. |
| **Evidence/freshness policy** | How capability assertions become valid, stale, or unknown. |
| **Dispatch policy** | Whether heterogeneous members may receive runtime-specific variants. |

Evidence proving those statements is **not itself target identity**. Otherwise every additional test result would mint a new target. Instead, target contract, resolved member set, and capability/evidence snapshot should be independently versioned.

The useful separation is:

```text
TargetProfileRevision
   immutable compiler contract + membership policy

TargetResolution / SupportSetRevision
   immutable exact set of concrete profiles selected from that policy

CapabilitySnapshot
   derived assessment of which target propositions currently hold
   over that exact support set, based on a defined Knowledge/Conformance cut
```

This solves a subtle versioning problem particularly well. A human-facing target such as:

```text
node22-supported
```

can keep the same contract while the upstream set of *currently supported Node 22 releases* changes. Each compiler invocation nevertheless resolves it to an immutable set. Since Node's v22 archive is a release line with many concrete releases, treating the major line itself as the empirical identity would discard exactly the dependency/version distinctions that Node exposes.

### Two different runtimes may safely satisfy one target

This should be explicitly supported.

Suppose two exact profiles \(E_1\) and \(E_2\) differ in JIT availability, platform, implementation patch, or some feature irrelevant to the target contract. They can both satisfy \(T\) when:

\[
E_1 \models T
\quad\land\quad
E_2 \models T
\]

It is unnecessary—and usually wrong—to assert:

\[
E_1 = E_2
\]

or even global behavioral equivalence.

The target merely states that their differences are outside what STRling needs to assume for this target.

This is one of the most valuable benefits of separating target profiles from execution profiles: **runtime distinction can be preserved without forcing the compiler to expose every distinction as a separate user-facing target.**

### Common-denominator and dispatched targets

For a single emitted regex and runtime configuration, the compiler may rely only on propositions valid for every member of the resolved set:

\[
AllowedAssumptions(T,S)=
\bigcap_{E\in S} Contracts(E\mid\Gamma,\Omega)
\]

If STRling later supports explicit runtime-conditioned artifacts, a target could instead partition the support set:

\[
S=S_1\cup S_2\cup\cdots\cup S_n
\]

and compile a separate variant for each subset, provided runtime dispatch can soundly determine which subset the executing runtime belongs to.

That is a compiler strategy issue downstream of the profile model; the important profile requirement is simply that the set membership and runtime discriminators be explicit. This preserves the existing Research Intelligence boundary that Semantic IR remains canonical while legality and target planning happen downstream.

### Why analogous systems point toward set-valued targets

Several mature ecosystems independently converge on the same separation:

| Analog | Relevant modeling lesson |
|---|---|
| **Rust compiler targets** | Target descriptions encode structured machine/runtime properties rather than a single marketing name; custom target JSON compatibility is coupled to the compiler version, reinforcing the need to pin the interpreting schema/compiler revision. |
| **Python wheel tags** | Compatibility is represented as interpreter–ABI–platform tags that describe classes of acceptable environments, rather than exact installations. |
| **TLS negotiation** | One endpoint advertises a supported version set and a concrete connection selects an exact member; “supports these” and “executed this” are separate facts. |
| **MDN Browser Compatibility Data** | Compatibility data is version-scoped and can represent partial support rather than treating a browser family name as one timeless capability bundle. |
| **Vulkan conformance** | Conformance records bind concrete product/driver/platform/CTS combinations, showing the value of exact realized configuration beneath a broader API target. |
| **SPEC benchmarking** | Reproducibility depends on disclosing performance-relevant configuration instead of pretending a nominal machine/compiler label completely defines the result. |

The synthesis is not that regex profiles should copy any one of these schemas. It is that all distinguish **human-facing compatibility categories** from **exact realized conditions**, and all need some mechanism to pin the version of the model or evidence used to interpret those categories.

### Compiler selection requirements

STRling's target-selection pipeline should conceptually be:

```text
user target selector / alias
          │
          ▼
exact TargetProfileRevision
          │
          ▼
resolve membership policy
against exact profile-registry revision
          │
          ▼
immutable SupportSetRevision
{E1, E2, ... En}
          │
          ▼
join Regex Knowledge + Conformance evidence
at explicit snapshot/revision
          │
          ▼
derive target-wide capabilities
under Γ and Ω
          │
          ▼
compiler may rely only on
VALID universal propositions
          │
          ▼
output records target + support set
+ capability/knowledge snapshot
```

Three constraints are essential.

First, **resolution must close an open selector**. `Node 22`, `>= PCRE2 10.x`, `current LTS`, or `latest .NET` may be accepted as user intent, but no emitted artifact should retain an unbounded future quantification.

Second, **unknown blocks reliance rather than implying lack of support**. If one member's required capability is `UNKNOWN`, the compiler cannot use that capability as a universal target assumption. It may use a strategy that does not require the proposition, narrow the target, or use explicit runtime dispatch; it should not silently convert uncertainty into either support or nonsupport. That is consistent with Regex Knowledge's established treatment of unknown evidence.

Third, **the support set and capability snapshot must be reproducible compiler inputs**. Rust's warning that custom target JSON definitions are not a stable cross-compiler interface illustrates the general danger of recording a target descriptor without the version of the system interpreting it.

One terminology issue should be addressed before the systems converge: Regex Conformance's current environment-fingerprint schema already contains a `target_profile` field. A new STRling compiler-facing concept called **Target Profile** could therefore create an accidental namespace collision. The conceptual distinction should remain explicit at system boundaries, for example as `execution_profile`/`conformance_profile` versus `compiler_target_profile`, even if shorter local names are retained internally.

## Host APIs, operations, Unicode, resources, and platform sensitivity

The execution-profile architecture becomes most useful at the boundaries where seemingly incidental runtime choices alter what a user can observe.

### Operation should normally remain separate from profile identity

The correct default is:

\[
ExecutionCoordinate =
Profile
\times
Operation
\times
InvocationDimensions
\times
Environment
\]

rather than:

\[
Profile =
Runtime
\times
Operation
\times
EveryFlag
\times
EverySetting
\]

The current Conformance schema already independently identifies `profile`, `operation`, `dimensions`, `vector`, and `environment`, which strongly supports this design.

Thus:

```text
Python-regex-profile-X + search
Python-regex-profile-X + match
Python-regex-profile-X + fullmatch
```

should normally be three executions against one profile, not three profiles.

The profile family should instead expose a **versioned operation surface** describing which operations exist and what APIs implement them. The concrete profile binds the relevant API/release. Conformance's concrete-profile derivation work already carries an operation-surface revision while treating requested operations as vector/execution dimensions unless they select a genuinely separate matcher API or family.

An operation should cross into profile identity only when it actually selects a distinct durable execution surface. PCRE2's ordinary matcher and DFA matcher are the canonical shape of this exception: the accepted Conformance design already treats ordinary versus DFA matching as capable of forming distinct profiles/families rather than pretending they are merely equivalent operation names.

This prevents Cartesian explosion without discarding actual matcher-backend distinctions.

### Replacement belongs to the operation surface, not “regex grammar” generally

Replacement requires separate modeling because its mini-language is often supplied by the host or wrapper rather than by the matching engine.

A match-only target does not need replacement capabilities. A replace target does.

The appropriate structure is therefore:

```text
profile
  ├── matching operation surface
  └── replacement operation surface
       └── replacement-language authority/version/defaults
```

A fixed replacement subsystem should be represented in the family/component graph and concrete profile. Replacement strings and call-specific replacement options belong to the operation vector. Conformance's dimensionality decision makes the same distinction: the subsystem/default can be profile-level where fixed, while replacement inputs are operation/vector data.

### Unicode needs provider identity and mode identity separately

“Unicode support” is much too coarse for target identity.

At minimum, the architecture must distinguish:

```text
Unicode provider / data version
Unicode-enabled build capability
Unicode interpretation mode
Unicode-property mode
input encoding / code-unit model
index units
```

These do not necessarily live at the same layer.

PCRE2's build documentation illustrates the distinction: Unicode property support is a build capability, while UTF processing and UCP semantics can be requested separately by applications/patterns.

Node demonstrates that a host runtime can expose its precise V8, ICU, and Unicode versions through `process.versions`, making those embedded-data coordinates inspectable rather than forcing them to be inferred from a major line.

MySQL demonstrates that a host can impose its own text/index surface over an embedded engine: its ICU regex operations use UTF-16 internally and positional indexes are documented in 16-bit chunks.

The rule should therefore be:

> **A runtime-bound Unicode provider/data version belongs to the concrete profile whenever differences in that data can alter the exposed regex surface; per-pattern Unicode modes remain execution/configuration dimensions unless the target fixes them.**

For target profiles, Unicode requirements should be contractual. A compiler that relies on a particular Unicode property membership needs one of three things:

1. a target set whose members all provide the required membership;
2. a target constrained to a specific provider/data version;
3. runtime-specific variants.

It should not rely on the word “Unicode” as a capability.

### Index units are surface semantics

Index units should be treated as part of the host API/result contract whenever match spans, group boundaries, start positions, or replacement APIs expose them.

This is exactly why `engine = ICU` cannot fully describe MySQL regex behavior: MySQL's documented UTF-16 positional behavior is part of the observable SQL surface.

A profile family should therefore state the index model expected from each operation surface, and a concrete profile should bind any release/component changes capable of altering that model.

This does not mean every start offset is profile identity. The **unit** is persistent surface semantics; the **offset value** is execution data.

### Locale and culture require effective-value treatment

Locale/culture should default to execution/environment state, not profile identity, because it may be selected by the caller or inherited from ambient runtime state. It moves into profile identity when a public surface fixes it and it can broadly change regex behavior.

A compiler target that depends on culture-independent semantics should encode the effective constraint directly instead of depending on the machine's ambient default.

The same rule applies to newline behavior: the material fact is the **effective matcher rule**, while selection origin records whether that value came from a build default, runtime default, wrapper policy, or explicit option. PCRE2's build-selectable and application-overridable newline configuration shows why these two facts cannot be collapsed.

### Resource limits belong to an operational envelope

Resource constraints need three different treatments.

A **compile-time or implementation limit that changes accepted regexes** is part of capability/profile semantics.

A **per-invocation timeout, match limit, depth limit, stack limit, or heap limit** is normally an execution dimension.

A **fixed hosted-service quota** may become profile material when it is a persistent contractual property of the public regex surface.

MySQL exposes system-level regex stack and step/time controls, showing that resource policy can be part of a host's observable execution environment even when the underlying engine is ICU.

For STRling, the target profile may additionally need an **operational envelope**:

\[
resources \ge R_{minimum}
\]

when correctness of the generated artifact in practice depends on a minimum allowed matcher resource budget. That is different from treating one arbitrary timeout value as part of regex semantic identity.

### JIT and architecture should start as stratifiers, not presumed identities

A particularly damaging design would classify either:

```text
JIT = always profile identity
```

or:

```text
JIT = never semantically relevant
```

Both encode an empirical conclusion into the ontology.

Conformance's existing decision is better: when JIT and interpretation are intended to be semantically equivalent, JIT is initially an **environment/execution stratifier**; if evidence reveals a stable semantic difference, it can be promoted into the profile model.

The same applies to OS and architecture.

PCRE2's build system demonstrates that build/runtime capabilities can vary independently of the regex family label. The profile model should therefore keep platform/architecture available as material dimensions without assuming that every `linux-x86_64` and `linux-aarch64` runtime is a separate semantic profile.

A target can nevertheless impose:

```text
requires JIT available
requires architecture in {...}
```

when JIT availability itself is part of the compiler's operational contract. That is a **target constraint** even when architecture is not a regex semantic identity.

This is an important recurring theme:

\[
TargetConstraint \not\Rightarrow ProfileIdentityDimension
\]

A compiler may care about a property that empirical regex semantics do not use to distinguish profiles.

## Equivalence, evolution, retirement, and evidence staleness

The profile system should recognize three very different notions of “same.”

### Structural profile identity

Two records represent the same concrete profile when their canonical profile coordinates are the same:

\[
coord(E_1)=coord(E_2)
\Rightarrow
E_1=E_2
\]

Conformance D055 already specifies this distinction: a concrete profile has an assigned stable entity identity plus a content-derived coordinate; a coordinate-changing semantic change creates a new concrete profile, whereas a correction to nonidentity metadata creates a new revision of the existing entity. The identity namespace design likewise distinguishes assigned identities for profiles/families/releases from hash-derived revision and coordinate identities.

This gives the registry both a durable reference and deterministic deduplication.

### Scoped behavioral equivalence

Different profile identities can be behaviorally equivalent over a specified domain:

\[
E_1 \equiv_C E_2
\]

iff, for every operation/configuration/input in scope \(C\), their designated observable projections are equal.

The domain \(C\) must be explicit. It might constrain:

```text
operations
flag combinations
text types
Unicode modes
error outcomes
captures
span/index results
replacement results
resource envelope
```

A global statement that two nonidentical regex implementations are behaviorally equivalent for *all possible regex behavior* is generally far stronger than an empirical campaign can establish. Conformance's mission is exact empirical observation rather than converting runtime observations into timeless normative guarantees.

Accordingly, an equivalence certificate should bind:

- the exact profiles and realizations compared;
- the operation/configuration domain;
- the observable projection used for equality;
- any implementation/specification guarantees assumed when treating dimensions as nonmaterial;
- differential evidence intended to falsify the equivalence hypothesis;
- the evidence and registry revisions supporting the conclusion.

This stays within the boundary of the existing equivalence/rewrite work: the point here is not to redefine equivalence logic, but to specify **which profile identities the relation is between**.

### Target indistinguishability

The compiler needs a weaker relation:

\[
E_1 \approx_T E_2
\]

meaning that both profiles satisfy target \(T\)'s contract:

\[
E_1\models T
\quad\land\quad
E_2\models T
\]

They may differ dramatically outside \(T\)'s required capabilities and operation/configuration envelope.

This is what allows, for example, two patch releases or two platform realizations to satisfy one STRling target without erasing their empirical identities.

Target indistinguishability should therefore **never deduplicate concrete profiles**.

### New evidence can split a profile

The hardest evolution case is discovering that a dimension previously considered nonmaterial actually produces reproducible semantic differences.

Suppose historical profile \(E\) implicitly pooled JIT and interpreter execution because JIT was classified as an environment stratifier. Later evidence establishes a stable semantic distinction.

The correct evolution is not to rewrite \(E\)'s identity retroactively.

Instead:

```text
E
├── superseded/split-by --> E_jit
└── superseded/split-by --> E_interpreter
```

The previously omitted dimension becomes profile-identifying prospectively.

Existing evidence remains immutably attached to the profile/environment against which it was recorded, consistent with Conformance's principle that empirical evidence is immutable and historical execution conditions remain represented.

Historical observations can be reassigned or projected to a child profile **only when their environment fingerprint contains enough information to discriminate the child**. Otherwise they remain valid evidence for the historical composite identity but are **ambiguous with respect to the new split**.

That distinction is crucial. Rewriting all old JIT-unspecified evidence as interpreter evidence because most installations probably used the interpreter would manufacture certainty that the experiment did not record.

A split should therefore trigger:

```text
old profile:
    superseded / composite / legacy-ambiguous

new profiles:
    exact material facet added

old evidence:
    preserved

child evidence:
    inherited only when discriminator is known

target capability snapshots:
    stale until reconciled
```

Conformance's completed dimensionality task explicitly anticipates this pattern: JIT can remain execution stratification until semantic evidence justifies prospective promotion/splitting.

Conversely, observing no difference in a finite test corpus is not sufficient to merge profile identities. The conclusion should remain “no material difference established within scope \(C\),” not “identical.”

### Family evolution and profile evolution should not be conflated

A graph-template change does not automatically require a new family.

If one host release changes its embedded engine from component A to component B while preserving the externally meaningful regex surface, the family graph can receive a new revision and concrete releases can bind different graphs.

MySQL's transition from the Henry Spencer implementation to ICU before/at the 8.0.4 boundary illustrates why underlying engine lineage can change inside a continuous host product surface while producing substantially different regex behavior.

A **new family** should be reserved for a new externally meaningful execution-surface identity. A **new family revision** expresses topology evolution within that identity. A **new concrete profile** expresses a new exact release/material-facet realization. This matches D054's accepted distinction.

### Retirement must preserve historical identity

Profiles should have lifecycle state separate from identity, conceptually along lines such as:

```text
active
supported
deprecated
retired
unreproducible
superseded
invalidated
```

The exact vocabulary can be settled later; the invariant matters more.

Retiring a profile means removing it from current support policy. It must **not** mean deleting its registry identity, aliasing it to a nearby release, or rewriting historical evidence.

Conformance already explicitly requires representation of stable historical releases even when they can no longer be reproduced, and its foundation separates lifecycle/reproducibility from the existence of the profile itself.

Thus:

\[
retired(E) \not\Rightarrow nonexistent(E)
\]

and:

\[
unreproducible(E) \not\Rightarrow replace\ with\ nearest(E')
\]

Historical target resolutions should likewise continue to point at their original support sets even after those members retire.

### Target capability evidence has its own staleness model

Target-wide capability assertions are derived facts.

Suppose target \(T\) resolves today to:

\[
S_1=\{E_a,E_b,E_c\}
\]

and the Knowledge/Conformance evidence establishes capability \(C\) for all three:

\[
\forall E\in S_1:C(E)
\]

Later a supported patch \(E_d\) enters the release family. The new support set is:

\[
S_2=S_1\cup\{E_d\}
\]

The earlier statement remains true about \(S_1\), but it does **not** establish:

\[
\forall E\in S_2:C(E)
\]

until \(C(E_d)\) is established.

The new target resolution should therefore see the derived capability as something like:

```text
STALE_MEMBERSHIP
or
PENDING_NEW_MEMBER
or
UNKNOWN_MEMBER
```

rather than inheriting `SUPPORTED`.

Likewise, a profile split can produce:

```text
STALE_PROFILE_SPLIT
```

and conflicting new evidence can produce:

```text
CONFLICTED
```

The exact enum names are implementation details. The architectural requirement is that **exact-profile evidence and target-wide quantified claims have different freshness domains**.

This is analogous to browser compatibility datasets being independently revised as support knowledge changes rather than treating a browser-family claim as permanent. MDN Browser Compatibility Data maintains version-scoped support information and versions the compatibility-data package separately from the browsers themselves.

The clean dependency graph is:

```text
Exact Profile Facts
        │
        ├──────────────┐
        ▼              ▼
Knowledge Snapshot   Conformance Evidence Cut
        │              │
        └──────┬───────┘
               ▼
       SupportSetRevision
               │
               ▼
       CapabilitySnapshot
               │
               ▼
       Compiler Target Resolution
```

A capability snapshot should therefore be conceptually keyed by at least:

\[
CapabilitySnapshot =
f(
TargetProfileRevision,\,
SupportSetRevision,\,
KnowledgeRevision,\,
EvidenceCut
)
\]

Changing evidence alone may update the snapshot without changing the target contract. Changing which concrete profiles are admitted changes the support-set revision. Changing what the target promises or how membership is selected changes the target-profile revision.

This three-axis versioning avoids a major anti-pattern: silently changing the meaning of “STRling supports Node 22” whenever a new Node 22 patch appears.

## Consequences for STRling, Regex Knowledge, and Regex Conformance

The recommended architecture gives each program a sharply different responsibility while preserving a shared identity vocabulary.

### STRling

STRling should consume **compiler target profiles**, not raw engine names.

The externally significant compilation input should resolve to:

```text
CompilerTargetProfileRevision
+
SupportSetRevision
+
Capability/Knowledge Snapshot
```

The target contract should tell lowering/planning which semantic and capability propositions may safely be assumed over its resolved member set. Target-specific legality remains downstream of Semantic IR, consistent with the existing Research Intelligence architecture.

A compiled target artifact should preserve enough of that resolved contract to answer:

> “Exactly which runtime population was this compiler output intended for?”

An unbounded alias or release-line name is insufficient.

STRling should allow both narrow and broad targets:

```text
exact:
    one concrete execution profile

release-set:
    all currently supported exact profiles in Node 22 at resolution R

constrained:
    exact family subset + Unicode/matcher/config contract

baseline:
    a heterogeneous set satisfying a common capability contract

dispatched:
    a union of exact sets for which STRling emits differentiated variants
```

This gives users ergonomic target names without weakening compiler reproducibility.

### Regex Knowledge

Regex Knowledge should describe the claims needed to evaluate those target contracts.

Its existing canonical model is already graph-oriented and separates systems, dialects, implementations, hosts, execution profiles, Unicode models, host APIs, replacement behavior, capabilities, lineage, and verification status. It also already treats `UNKNOWN` as meaningful and avoids capability inheritance based solely on lineage.

The new requirement is mainly relational: Knowledge needs claims whose subject can be an **exact execution-profile revision or a family/profile relation**, and it needs enough scope metadata for STRling to ask questions like:

\[
Does\ capability\ C\ hold
\ for\ every\ E\in S
\ under\ \Gamma,\Omega?
\]

A target-wide capability should normally be derived from profile-scoped knowledge and evidence, not manually asserted as a timeless property of an engine family.

Knowledge should also represent scoped equivalence or nonmateriality claims without collapsing identities. For example:

```text
JIT and interpreter are equivalent
for observable domain C
on profile release R
```

is useful evidence for keeping JIT outside profile identity, while still allowing future evidence to overturn the classification.

### Regex Conformance

Regex Conformance should remain the authority for **empirical execution identity** and exact profile derivation.

Its current design already has most of the necessary pieces: system/component/release registries; profile families and concrete profiles; exact profile-coordinate derivation; versioned identity projections; environment fingerprints; logical execution that separately identifies profile/environment/operation/dimensions/vector; immutable evidence; and historical representation of unreproducible releases.

The key cross-program contract should be:

```text
Regex Conformance
    answers:
    "What exact profile was realized and observed?"

Regex Knowledge
    answers:
    "What is known or claimed about that profile,
     and with what confidence/scope?"

STRling Target Profiles
    answer:
    "Which such profiles are admissible,
     and what may the compiler rely on across them?"
```

This avoids making Regex Conformance define compiler policy and avoids making STRling invent a second execution identity system.

The one naming problem worth resolving early is the existing Conformance `target_profile` field in environment fingerprints versus the proposed compiler-facing “Target Profile.” They should be explicitly namespaced before the two concepts spread through APIs and persisted artifacts.

### Architectural anti-patterns

The following patterns should be rejected at the model boundary rather than compensated for later:

| Anti-pattern | Failure |
|---|---|
| `engine = "pcre2"` | Omits release, code-unit/build facets, modes, host/wrapper surface, and other relevant components. PCRE2 itself exposes build/runtime distinctions that defeat this simplification. |
| `runtime = "Node 22"` as empirical identity | A release line contains many exact releases and embedded dependency versions; Node exposes those versions separately. |
| `backend = ICU`, therefore host supports ICU behavior | Wrapper/host can alter API, text/index representation, errors, flags, resource policy, and replacement behavior; MySQL is a concrete example. |
| `latest`, `current`, or `LTS` persisted as a target | Future membership silently changes old compiler/evidence claims. Conformance already disallows mutable `latest` schema aliases in certification inputs. |
| Every flag/operation creates a profile | Produces combinatorial explosion and confuses execution state with persistent surface identity. |
| `newline = default` as semantic identity | “Default” may resolve differently by build/wrapper; PCRE2 explicitly supports build defaults and application overrides. |
| Missing dimension silently ignored | Creates falsely exact profiles. Required unresolved material dimensions must block exact derivation. |
| Unknown capability treated as unsupported | Converts absence of evidence into a semantic conclusion, contrary to Regex Knowledge's existing model. |
| OS/architecture always defines a profile | Explodes identity for differences with no demonstrated semantic significance. |
| OS/architecture can never define a profile | Prevents evidence-driven promotion when a platform difference becomes material. |
| JIT always defines a profile | Treats an implementation strategy as semantic before evidence warrants it. |
| JIT can never define a profile | Prevents profile splitting when stable divergence is discovered. |
| Sparse differential tests establish global equivalence | Confuses absence of observed differences with universal behavioral identity. |
| New patch automatically inherits family capabilities | Makes target-wide universal claims without evidence for the new member. |
| Old evidence rewritten after profile split | Destroys the historical meaning of what was actually recorded. Conformance requires immutable empirical evidence. |
| Alias used as database identity | Makes identity dependent on mutable naming policy rather than the represented entity. |
| Target profile contains capabilities but no resolvable member population | Makes it impossible to know what the compiler guarantee quantifies over. |
| Binary digest always defines profile identity | Confuses physical artifact identity with semantic execution-profile identity. |
| Exact release alone always defines profile | Ignores behaviorally material build features and component graphs. |

### Open empirical profile-discovery questions

The conceptual model can be decided before these questions are answered, but their answers determine where real systems split into concrete profiles. They should be treated as empirical discovery obligations rather than guessed into the ontology.

| Discovery question | Evidence-driven consequence |
|---|---|
| Does a wrapper preprocess patterns, options, text, results, errors, or replacement strings? | If persistent and observable, wrapper/component release becomes profile material. |
| Which component actually supplies Unicode property data, and can its exact version be observed? | Determines whether Unicode provider/version is a required graph node, derived facet, or unresolved obligation. |
| Can one nominal runtime release ship with materially different embedded regex-engine builds? | If yes, host release alone cannot determine profile identity. |
| Do JIT and interpreter ever diverge semantically for the same public surface? | Stable divergence promotes the execution stratifier to a profile dimension and triggers a split. |
| Does architecture or OS change exposed semantics rather than only performance? | Proven semantic differences promote platform dimensions; otherwise retain environmental stratification. |
| Which “defaults” originate in engine build, wrapper, host runtime, locale, or API call? | Determines both effective-value resolution and profile/vector placement. |
| Is a nominal non-backtracking/DFA mode a persistent distinct matcher surface or merely a per-pattern option? | Determines family/profile split versus target/vector constraint. |
| Can a managed or hosted service reveal an exact backend/build? | If not, exact concrete derivation may remain unresolved even if the service has a useful family identity. |
| Are resource limits fixed contracts, ambient deployment settings, or per-request values? | Determines profile, environment, or vector placement. |
| Do major runtime lines such as Node or browser release trains change embedded regex/Unicode dependencies within the supported line? | Determines exact member sets and how quickly target capability evidence becomes stale. |
| Does a wrapper expose backend-native indices or transform them into another unit? | Determines host API profile semantics. |
| Can backend fallback occur dynamically and is the selected backend observable? | May require a persistent backend facet, execution discriminator, or unresolved profile status. |

The profile ontology should not pre-answer these questions. Its job is to have an unambiguous place to put the answer when Conformance establishes it.

### Final architectural answer

The exact runtime STRling is talking about should be expressible at four successive levels of precision:

```text
System / Dialect
    "ECMAScript regex"
        │
        │ conceptual authority / family
        ▼
Profile Family
    "Node.js RegExp execution surface"
        │
        │ exact graph realization
        ▼
Concrete Execution Profile
    exact Node release
    + exact relevant V8/backend release
    + exact persistent material build/runtime facets
    + exact host/API/index/Unicode surface
        │
        │ actual test invocation
        ▼
Execution Coordinate
    concrete profile
    + environment realization
    + operation
    + flags/modes
    + text/input configuration
    + region/offset
    + resources
    + other per-execution material values
```

Compiler targeting adds a separate projection:

```text
Compiler Target Profile
    "Node 22 supported baseline"
        │
        │ resolved at exact registry/support-policy revision
        ▼
Closed Support Set
    { exact-profile-A,
      exact-profile-B,
      exact-profile-C, ... }
        │
        │ universally validated target contract
        ▼
Capabilities and semantics
STRling is permitted to rely upon
```

The decisive rules are therefore:

**Concrete execution profile identity consists of the exact persistent executable surface, not every variable involved in a run.** This means an exact family revision, exact required component releases, and exact persistent behaviorally material facets/defaults. Conformance's accepted D054/D055 model already establishes this foundation.

**Operation and ordinary per-call configuration belong outside durable profile identity.** They form the complete execution coordinate with profile and environment, as the existing Conformance logical-execution schema already reflects.

**Embedded engines are component nodes, not substitutes for host identity.** A public wrapper/runtime is the profile root when that is the surface being observed; exact embedded releases are bound wherever they are behaviorally relevant. MySQL/ICU and Node/V8 demonstrate why this distinction is necessary.

**A compiler target is a contract over execution profiles, not another execution profile.** It may admit one exact profile or a heterogeneous set, provided every admitted member satisfies the capabilities and configuration assumptions on which compilation relies.

**Ranges and mutable release policies must close to immutable sets before they participate in compilation or certification.** “Node 22” can be an ergonomic selector; the emitted artifact must bind the concrete support-set revision. Node's own release archive and dependency version reporting illustrate why the major line alone does not define one execution condition.

**Aliases never carry semantic identity.** `latest`, `current`, `LTS`, `pcre2`, and `node22` are resolver inputs whose resolutions can evolve; persisted artifacts bind canonical revisions. This parallels Conformance's existing rejection of mutable `latest` aliases for certification.

**Unknown required material dimensions prevent an exact profile from being minted.** Unknown target-member capability prevents the compiler from relying on that capability universally; neither case should be silently translated into `UNSUPPORTED`.

**Behavioral equivalence is scoped evidence, not identity.** Two exact profiles can remain separate yet satisfy the same target. This is the normal way for multiple realized configurations to support one STRling compiler contract.

**New materiality evidence splits prospectively rather than rewriting history.** Old profile/evidence identities remain intact; child profiles are minted, ambiguous historical evidence stays ambiguous, and dependent target capability snapshots become stale until reconciled. This is consistent with Conformance's immutable-evidence and profile-dimensionality principles.

**Retirement changes support policy, not history.** Unsupported or unreproducible historical profiles remain addressable and old target resolutions retain their exact original populations.

Ultimately, STRling should be able to answer its own target claim in a mechanically auditable sentence of this form:

> **“This artifact was compiled against target-profile revision T, resolved under registry revision R to exact execution-profile set S, under operation/configuration contract Γ, using capability/knowledge snapshot K; every compiler assumption used for this artifact is established over every admissible profile in S.”**

That sentence is the architectural replacement for **“this regex targets PCRE2,” “this works on Node 22,” or “this engine supports feature X.”** It retains the usability of named targets while grounding every compiler guarantee in the exact executable surfaces that Regex Conformance can observe and Regex Knowledge can reason about.
