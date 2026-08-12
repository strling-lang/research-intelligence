# STRling Regex Lab: Product Architecture and Developer-Tooling Research

Role: Research report
Origin: AI-assisted deep-research session commissioned for STRling Research Intelligence; the underlying sources, not the AI system, are the evidence authorities.
Generated: 2026-08-12
Imported: 2026-08-12
Source verification: Partially verified
Last reviewed: 2026-08-12
Current status: Active input

## Source verification gaps

Current website state was checked at [`7c7042f`](https://github.com/strling-lang/website/tree/7c7042f3d4418533f5dc0283537546529633b081), where no dedicated Regex Lab, Inspect, Run, Compare, or Compose product surface exists. Current STRling compiler status was checked at [`9991575`](https://github.com/strling-lang/strling/tree/9991575b347ac5f56108f18065c88b2b16a5065a), and current Conformance status at [`f8c603a`](https://github.com/strling-lang/regex-conformance/tree/f8c603a1a4f5f827247f8a5bed61c85f483857f8). Selected tool precedents were checked against [regex101](https://regex101.com/), [RegexPlanet](https://www.regexplanet.com/), and [Compiler Explorer](https://github.com/compiler-explorer/compiler-explorer).

The original research-session marker map is unavailable. Unreconstructed markers link here. Usability claims, competitive comparisons, privacy expectations, and schema details need direct user and security research. Inspect/Run/Compare/Compose, LabSession/ProfileRef, result schemas, and the proposed architecture remain candidate models.

## Executive conclusion

The strongest product model is **not four independent regex tools sharing a page**. It is a single **versioned investigation session** with a shared set of subjects, profiles, operations, data, compiler/knowledge pins, witnesses, and provenance—projected into several purpose-specific workflows whose evidence classes remain deliberately separate.

The recommended public capability names are:

| Proposed concept | Recommended product label | Core question |
|---|---|---|
| AUDIT | **Inspect** | “What is this regex, what does it appear to mean, and what assumptions or risks does it carry?” |
| EVALUATE | **Run** | “What did this identified runtime actually do with this pattern, operation, and input?” |
| COMPARE | **Compare** | “What changed when one controlled dimension changed, and what evidence demonstrates the difference?” |
| PLAYGROUND | **Compose** | “How does my STRling semantic intent compile, plan, and emit across targets?” |

**Regex Lab** should remain the umbrella. “Playground” is a poor child capability name because mature developer products use “playground” to mean the entire interactive environment; inside something already called a Lab, it communicates almost no purpose. **Compose** makes the STRling-specific authoring responsibility explicit. “Audit” has a different problem: in a product adjacent to an actual certification/conformance program, it can suggest compliance, security assurance, or certification. **Inspect** makes its static and advisory character clearer.

The deeper architectural distinction is:

> **Inspect predicts and explains. Run observes. Compare relates. Compose derives. Regex Conformance certifies controlled empirical evidence.**

Those verbs should remain visible in the data model, APIs, provenance, and user-facing result language. STRling Regex Conformance already explicitly distinguishes normative expectations, empirical probes, physical attempts, observations, derived findings, and inferences, and requires certification to pass through controlled evidence rather than declaration. It also defines an execution profile as a behaviorally relevant component graph, not merely an engine name. [source-verification note](#source-verification-gaps)

The proposed Lab fits STRling's existing compiler architecture unusually well. STRling already separates Parse → Compile to target-independent IR → Emit, mandates deterministic side-effect-free emitters, treats grammar and semantics as normative, and defines the parser as the authority for syntax/semantics behind a binding-independent diagnostics layer. Its Simply API is also intended as a semantic abstraction whose operations map to IR concepts. [source-verification note](#source-verification-gaps) The Lab should expose and combine those capabilities rather than creating a second regex-semantic implementation in the website.

It should **not**, however, force all four workflows to equal prominence. The strongest information architecture is contextual:

**Inspect** and **Run** are the natural primary workflows for developers arriving with an existing regex. **Compose** is the natural primary workflow for someone starting with STRling intent. **Compare** is an advanced transition available whenever the user has a meaningful second subject, profile, version, or observation; making it an equal empty tab would encourage exactly the “two copies of another tool” failure mode the question warns against.

The current website reinforces the need for this architectural separation. It identifies itself as the user surface while compiler implementation/specification remains in the STRling repositories, and it is presently a static Astro/Netlify deployment with no application backend or functions. [source-verification note](#source-verification-gaps) Therefore remote runtime execution is conceptually a **new service and trust boundary**, not merely another website component. That is an architectural fact even if the implementation mechanism remains undecided.

## Capability contracts and boundaries

### Inspect

**Inspect is a non-executing investigation of a regex artifact.**

Its minimum input is a subject plus its source format. A profile or target scope may be supplied to obtain more precise findings, but Inspect must remain useful without a runnable profile or test string.

Its responsibility should include:

| Inspect concern | Intended output |
|---|---|
| Syntax and structure | Parsed structure, groups, assertions, quantifiers, captures, flags, source ranges |
| Semantic interpretation | Meaning attached to constructs under explicitly stated assumptions |
| Feature inventory | Features/extensions used and relevant semantic dependencies |
| Profile assumptions | Dialect/runtime/version assumptions required to interpret the pattern |
| Portability | Supported, conditional, unsupported, unknown, or semantically divergent target facts |
| Uncertainty | Ambiguous syntax, unknown version dependencies, knowledge gaps, unresolved host escaping |
| Static safety | Rule-based findings such as suspicious constructs, without implying that execution was measured |
| Explanation | Knowledge-backed explanation connected to source ranges and findings |

STRling's semantics already demand target-aware behavior: unsupported extensions must error, semantically variable constructs may require warnings, and Unicode, word-boundary, line-terminator, escape, and flag behavior varies across targets. [source-verification note](#source-verification-gaps) Its TargetArtifact base schema already has flags, typed IR nodes, diagnostics, compatibility information, warnings/errors, emitter identity, and source ranges, making it a useful seed for this static side of the Lab. [source-verification note](#source-verification-gaps)

Inspect must **not**:

- require a test string;
- produce “matched / did not match” as an analysis conclusion;
- imply that a portability prediction is an observed fact;
- infer certification from knowledge or static reasoning;
- execute a regex merely to make its explanation look more authoritative.

A good handoff is **“Run this case”**, which copies the subject and assumptions into a Run task. The resulting observation is new evidence, not an enrichment that retroactively turns Inspect into an execution tool.

### Run

**Run is the empirical, operation-specific execution capability.**

Run requires four things that Inspect does not:

**a runnable profile, an operation, input data, and an execution provider.**

For replacement operations it additionally requires replacement data and its replacement syntax.

Its primary result is not “an explanation of the regex.” It is a normalized record of **what a specified runtime did**:

```text
RunObservation
    subject
    execution profile
    operation contract
    pattern/options actually supplied
    input identity/content
    replacement specification, if any

    outcome
        completed | compile-error | runtime-error |
        timeout | resource-limit | unsupported

    results
        matches
            full-match span
            captures
            named captures
            participation/nonparticipation
            native offsets/index units
        replacement output, if applicable
        split output, if applicable

    execution provenance
        runtime/profile identity
        adapter version
        execution provider
        environment identity where material
        resource policy
        timestamp
```

Native indices are important. Regex Conformance explicitly requires native index units to be preserved in observations. [source-verification note](#source-verification-gaps) Regex Lab should follow the same principle: a JavaScript result measured in UTF-16 code units should not silently be rewritten to a Unicode-code-point span. A normalized span may be added as a **derived convenience**, but the native span remains the observation.

Operation must also be an explicit coordinate. Avoid a universal button called only “Match.” Regex APIs use that word differently. A Lab-level operation vocabulary should instead define contracts such as `search`, `full-match`, `scan/find-all`, `replace`, and `split`, with profile adapters stating whether and how each maps to the native API. A profile-specific “native operation” escape hatch can exist when no portable abstraction is honest.

This separation is strongly supported by mature tools. regex101 exposes regex **flavor** independently from **function**—Match, Substitution, List, and Unit Tests—and keeps explanation, detailed match information, debugger, benchmark, and code generation as distinct tool concerns. [source-verification note](#source-verification-gaps) Compiler Explorer similarly represents source, compiler identity, compiler options, libraries, tools, stdin, execution arguments, and an explicit execution switch as independent request coordinates; compilation and execution are not inferred from the presence of input. [source-verification note](#source-verification-gaps)

The PostgreSQL `EXPLAIN` / `EXPLAIN ANALYZE` distinction is an especially useful structural precedent: plain `EXPLAIN` presents planner reasoning, while `EXPLAIN ANALYZE` actually executes the query and adds observed runtime data; PostgreSQL prominently warns that execution therefore has real effects. [source-verification note](#source-verification-gaps) Regex Lab needs the same conceptual honesty between Inspect and Run even though the particular risks differ.

Run must **not**:

- promote one example to a universal semantic claim;
- call an engine portable because a supplied test case happened to pass;
- call a timeout regex “non-conforming” without distinguishing execution failure from semantic failure;
- treat performance from an interactive request as a benchmark/certification result;
- turn an ad hoc execution into Regex Conformance evidence.

### Compare

**Compare is a controlled-difference investigation, not a two-pane renderer.**

Every Compare task should be required to state:

1. **what varies**;
2. **what is held constant**;
3. **what kind of difference is being asked about**;
4. **what evidence scope supports the answer**.

Its core output is therefore a `ComparisonFinding`, not two `AnalysisReport`s.

For example:

> Pattern changed from A to B; profile P, operation `search`, options O, and witness set W were held constant. On witness `w3`, A captures `[1,4)` while B captures `[1,3)`. Static inspection also shows the changed quantifier at source range R. No claim is made outside the supplied witness set.

That is useful Compare behavior. “Here is Audit A; here is Audit B” is not.

Compare may consume Inspect findings, Run observations, Compose artifacts, Regex Knowledge facts, and imported Conformance evidence, but it should preserve the provenance and evidence class of every input.

### Compose

**Compose is the STRling-authoring capability.**

Its subject is **semantic intent**, rather than an existing target regex. The intended workflow is:

```text
Semantic STRling / Simply intent
              ↓
          diagnostics
              ↓
        canonical IR
              ↓
     portability planning
              ↓
   target-specific artifacts
```

That is directly aligned with STRling's Parse → Compile(IR) → Emit architecture and with its design principle that Simply concepts map to IR nodes. [source-verification note](#source-verification-gaps)

Compose should show:

- syntax/semantic diagnostics;
- an inspectable semantic/IR structure where useful;
- target selection and exact profile assumptions;
- portability decisions, warnings, and unsupported constructs;
- generated target artifacts;
- provenance connecting each generated target regex back to the source intent and compiler/emitter versions.

It should **not execute generated regexes by default**. “Run generated artifact” is a deliberate transition to Run. That transition keeps the generated-artifact provenance but adds a runtime profile, operation, data, and execution observation.

Nor should Compose become a generic code playground for arbitrary JavaScript/Python/etc. The current Simply concept is a semantic API, but executing arbitrary host-language source merely to obtain a Simply pattern would radically widen the sandbox boundary. The initial product should prefer Semantic STRling source or a constrained Simply-intent representation rather than arbitrary user code.

There is an important current-repository constraint here. STRling's TypeScript compiler utility says compilation runs locally in browser or Node, but `compileNode` currently accepts only the `pcre2` target; the same convenience module's `toRegExp` then constructs a JavaScript `RegExp` from emitted text. [source-verification note](#source-verification-gaps) The broader architecture and semantics anticipate multiple targets, but **Regex Lab should not make this convenience layer its universal execution API**. Compose should call canonical compiler/planner/emitter contracts; Run should call independently defined runtime adapters.

## Common state and shared intelligence

The four capabilities should share **domain coordinates and intelligence**, not a universal input form or universal result object.

The recommended common root is a versioned `LabSession`:

```text
LabSession
    schemaVersion

    subjects{}
    profiles{}
    dataSets{}
    witnesses{}

    pins
        strlingCompiler
        emitterSet
        regexKnowledgeSnapshot
        profileRegistrySnapshot
        operationModelVersion

    task
        InspectTask
      | RunTask
      | CompareTask
      | ComposeTask

    recordedResults[]       // optional frozen snapshots
    sharingPolicy
```

### Subjects

A first-class `Subject` avoids assuming that everything is already a raw regex:

```text
Subject
    id
    kind
        regex
      | strling-intent
      | simply-intent

    source
        format
        content/model
        encoding

    regexOptions?           // when applicable
    origin?                 // generated, pasted, imported, prior revision
    derivation?             // links generated output to STRling source
```

**Source format needs to be explicit.** A regex engine pattern, `/pattern/flags`, a JavaScript string literal containing regex text, and a STRling/Simply source artifact are not interchangeable representations. Host-language escaping and regex escaping must not be silently collapsed. “What text was pasted?” and “What pattern was passed to the engine?” are separate questions.

The same subject identity can travel from Compose → Inspect → Run → Compare without losing provenance.

### Profiles

Profile is the most important shared abstraction after subject.

Regex Conformance defines profiles as **behaviorally relevant component graphs rather than simple engine labels**, and its profile registry is intended to own systems, releases, profile families, component graphs, concrete profiles, material facets, and platform policies. [source-verification note](#source-verification-gaps) [source-verification note](#source-verification-gaps)

Regex Lab should build on that conceptual identity model.

A useful `ProfileRef` would distinguish at least:

```text
ProfileRef
    stableId
    family
    release/version
    components[]
    materialFacets{}
    capabilities{}
    sourceSnapshot

    resolvability
        exact
      | alias-resolved
      | assumed
      | partial
      | unknown

    executable: boolean
```

This supports an important difference:

- Inspect can say “assume ECMAScript semantics” or “profile unresolved” and report uncertainty.
- Run may require a profile resolvable to an actual executable runtime.
- Compare can explicitly change only the profile release.
- Compose can target one or many profile references.

The public UI may offer friendly aliases such as “JavaScript / Node,” but the saved session should retain the exact resolved identity. Compiler Explorer's API follows the same broad structural idea by saving/compiler-requesting a concrete compiler ID alongside options, libraries, and tools rather than merely naming a programming language. [source-verification note](#source-verification-gaps)

### Operations and data

Operation is its own versioned domain object rather than a boolean execution flag:

```text
Operation
    contractId
    contractVersion

    kind
        search
      | full-match
      | scan
      | replace
      | split
      | profile-native

    operationOptions{}
```

Input and replacement data belong in separately referenceable datasets so one subject can be tested against multiple cases without duplicating pattern state.

Replacement in particular needs a format marker. A literal replacement string, a `$1`-style engine-native replacement template, and executable replacement callback are materially different things. The initial Run design should support data/templates, not executable callbacks.

### What should be shared

All capabilities benefit from the same:

- subject/source-format parser and identity;
- profile registry/resolution;
- compiler and IR;
- diagnostics vocabulary;
- Regex Knowledge lookup;
- source-location model;
- operation definitions;
- witness representation;
- provenance vocabulary;
- session serialization;
- content identity/hashing;
- explanation machinery.

This is analogous to the Language Server Protocol's architectural lesson: language-specific intelligence can sit behind a structured, tool-independent contract rather than being reimplemented in each editor surface. [source-verification note](#source-verification-gaps) STRling already follows that pattern for parser diagnostics: its CLI diagnostics layer is explicitly binding-agnostic and normalizes parser errors into structured diagnostic data. [source-verification note](#source-verification-gaps)

### What must not be shared

The following should **never be normalized into one undifferentiated “result” concept**:

| Distinction | Why it must survive |
|---|---|
| Static finding vs runtime observation | One is derived reasoning; the other records what a runtime did |
| Compiler artifact vs runtime result | Generated regex text is not evidence that the target runtime accepted or behaved as intended |
| Knowledge fact vs observation | Documentation/normative research answers a different question from empirical execution |
| Lab observation vs Conformance evidence | Provenance, environment control, campaign authorization, immutability, and certification differ |
| Inspect report vs Compare result | Compare must describe a relationship and controlled delta |
| User witness vs certified vector/evidence | An input may be useful without being authoritative |
| Unknown vs unsupported vs failed | Missing knowledge, negative support, and infrastructure failure are not equivalent |
| Native span vs normalized span | A normalization must not overwrite what the runtime actually reported |

A shared intelligence core is therefore desirable; a shared **truth type** is not.

## Evidence, results, explanation, and Conformance

The most important architecture decision is to model evidence provenance explicitly.

### An evidence-class model

Regex Lab should recognize at least these classes:

```text
KnowledgeFact
    researched / normative contextual information
    source: Regex Knowledge snapshot

StaticFinding
    deterministic or heuristic conclusion
    source: parser / compiler / static analyzer

GeneratedArtifact
    deterministic compiler or emitter output
    source: STRling compiler + emitter

LabObservation
    empirical result of an interactive execution
    source: execution provider + exact runnable profile

ComparisonFinding
    relation derived from other findings/observations
    source: Compare engine
    evidenceRefs: [...]

ConformanceEvidenceRef
    read-only reference to externally governed evidence
    source: Regex Conformance evidence infrastructure
```

These are **not a simple ranking from weakest to strongest**. A normative knowledge fact and an empirical observation answer different questions. The important rule is that the system never silently converts one class into another.

Regex Conformance's existing authority model is almost tailor-made for this separation. Regex Knowledge owns canonical researched knowledge, terminology, feature ontology, and normative primary-source evidence; the Conformance repository owns machine-operational profiles, vectors, applicability, environments, campaigns, schemas, and related definitions; immutable evidence infrastructure owns observations, attempts, provenance, environment fingerprints, diagnostics, and certified evidence objects. It explicitly says local Control Plane state is not canonical scientific evidence. [source-verification note](#source-verification-gaps)

Regex Lab should therefore be a **consumer** of both Knowledge and Conformance, not an alternate authority for either.

### Relationship to Regex Knowledge

Regex Knowledge should act as a **versioned read-only knowledge dependency** for the Lab.

Inspect can use it to say:

> This construct has semantics S under profile family P; target Q has a documented condition C; this conclusion comes from Knowledge fact K at snapshot V.

Compose can use those same facts to explain target-planning decisions. Compare can use them to explain why two profiles are expected to differ. Run may annotate an observation with an expected behavior, but the expected behavior and observed result remain separate records.

A compatibility model should also avoid flat booleans. MDN Browser Compatibility Data is instructive here: its machine-readable support data distinguishes release/version information, partial implementation, flags and notes, and specifically requires explanation when support is partial. [source-verification note](#source-verification-gaps) Regex Knowledge can support an analogous richer vocabulary for regex features:

```text
supported
unsupported
conditional
partial
semantically-divergent
unknown
not-applicable
```

That is substantially more useful to Inspect and Compose than a green/red matrix.

### Relationship to Regex Conformance

Regex Lab should have a **one-way read boundary for authoritative evidence**.

A certified or otherwise published Conformance observation may be attached to a Lab session by reference. A developer can then replay the same vector interactively. But there are now **two distinct things**:

```text
Imported Conformance evidence E
    controlled provenance
    immutable evidence identity
    conformance trust/certification metadata

Lab replay observation L
    interactive environment
    Lab execution provider
    current session provenance
    no certification
```

Even when `E` and `L` use identical pattern, input, operation, and apparent runtime version, **L is not E**.

This follows directly from Regex Conformance's governing principles: exact vectors run against exact reproducible profiles; published evidence is immutable and traceable; logical executions are distinguished from physical attempts; trusted self-hosted execution does not run arbitrary public code; and certification passes through evidence gates. [source-verification note](#source-verification-gaps)

Therefore there should be **no normal Lab API such as**:

```text
run() -> certifiedEvidence
```

and no UI action equivalent to “Certify this run.”

A useful future integration can instead be:

```text
Lab witness
   ↓ explicit export
Candidate conformance vector
   ↓ separate ingestion/review
Conformance definitions
   ↓ authorized campaign
Controlled execution
   ↓ immutable evidence
Certification gate
```

The Lab export is a candidate input, not evidence.

That distinction matters particularly because the Conformance repository currently describes itself as still building its Control Plane foundation and states that no observation in the repository is yet a certified conformance result. [source-verification note](#source-verification-gaps) The product architecture should nevertheless enforce the future boundary from the beginning rather than retrofitting it after certification exists.

### Result versus explanation

Results and explanations should not be the same object.

A **result** is machine-readable fact:

```text
Finding
    ruleId
    severity
    category
    messageKey
    sourceLocation
    relatedLocations[]
    assumptions[]
    evidenceRefs[]
    remediation?

Observation
    outcome
    matches[]
    captures[]
    spans[]
    nativeIndexUnit
    runtimeDiagnostics[]
    executionProvenance
```

An **explanation** is a human-readable projection over those facts:

```text
ExplanationItem
    subjectRef
    fact/result refs
    why this matters
    knowledge refs
    assumptions
    confidence/uncertainty
    related source ranges
```

This gives the UI freedom to provide concise, detailed, or educational explanations without making prose the canonical result format.

SARIF offers several mature structural lessons for Inspect findings: results have stable rule identity, severity/kind, messages, locations, related locations, fingerprints, and run/tool provenance. SARIF also explicitly treats invocation details as useful for reproducibility while acknowledging that invocation strings may contain secrets and need redaction; it warns against automatically executing commands obtained from untrusted result files. [source-verification note](#source-verification-gaps) Regex Lab need not adopt SARIF as its native protocol, but it should adopt those principles.

STRling's current TargetArtifact `Diagnostic` already provides a useful smaller kernel—code, message, severity, location, and hint. [source-verification note](#source-verification-gaps) Lab findings should evolve from that vocabulary rather than introducing a competing error model.

Crucially, explanation should preserve uncertainty. The system needs discrete states such as:

> **not tested**, **unknown**, **unsupported**, **not applicable**, **execution failed**, and **observed different**.

Collapsing any of those to “fail” would violate the same distinction Regex Conformance makes when it says infrastructure failure must never silently be reported as regex non-conformance. [source-verification note](#source-verification-gaps)

## Compare, witnesses, and reproducible sessions

### Useful Compare dimensions

Compare becomes useful when exactly one meaningful axis changes—or when the user explicitly asks for a multidimensional matrix.

| Compare dimension | Hold constant | Change | Best use |
|---|---|---|---|
| **Pattern / revision** | profile, operation, flags, witness set | pattern A → B | Find behavior or diagnostic regressions during regex editing |
| **Runtime profile** | pattern, operation, data | engine/profile A → B | Portability investigation |
| **Runtime version** | pattern, operation, data, profile family | release N → N+1 | Upgrade/regression investigation |
| **Options / flags** | pattern, profile, operation, input | flag/options set | Isolate option-sensitive semantics |
| **Operation** | pattern, profile, input | search → full-match, scan, replace, etc. | Explain API-operation differences |
| **Target/emitter** | STRling intent | target profiles or emitters | Inspect generated artifacts and portability planning |
| **Compiler version** | STRling intent, target | compiler/emitter build | Identify compiler-output/diagnostic regressions |
| **Expectation vs observation** | semantic coordinates | evidence source | Investigate a runtime disagreeing with Knowledge or Conformance evidence |

Not everything that varies deserves to be a Compare axis. Running the same regex over ten independent inputs is normally a **Run test set**, not a comparison. The inputs become Compare material when they are **witnesses of a specific difference**.

### Comparison result model

A comparison finding should say exactly what it knows:

```text
ComparisonFinding
    dimension
    baseline
    candidate

    invariants[]
    scope
        static
      | supplied-witnesses
      | imported-evidence-set

    classification
        same
      | different
      | inconclusive
      | not-comparable

    deltas[]
    witnessRefs[]
    sourceFindingRefs[]
    observationRefs[]
    assumptions[]
```

For dynamic pattern/profile comparison, `same` means **same on the stated evidence set**, not semantically equivalent in general. This stays within the requested product boundary without pretending the Lab performs formal equivalence proof.

### Witnesses and counterexamples

Witness should be a shared first-class object:

```text
Witness
    id
    input
    operation
    replacement?          // if material

    demonstrates
        claim / comparison refs

    provenance
        user
      | lab-generated
      | imported-vector

    minimizationStatus?    // descriptive only
    sourceEvidenceRef?
```

A witness turns “these profiles differ” into “these profiles differ **here**.”

Compare should prioritize witnesses for behavioral deltas because they are actionable and replayable. A profile comparison might say:

> Divergence found on W7. Profile A returns capture `name=[2,5)` in native unit U1; Profile B reports the group unmatched. Static explanation points to feature F. A related certified Conformance observation exists at evidence reference E.

That is dramatically more useful than two pages of profile feature lists.

Imported Conformance vectors should retain their conformance identity. Running one in Regex Lab creates another `LabObservation`; it does not mutate or reproduce the certification state of the imported evidence.

### Sharing and permalinks

A serious Regex Lab needs **semantic reproducibility**, not merely “the pattern text is in the URL.”

A reproducible session should pin:

| State | Why |
|---|---|
| Session schema version | Decode old sessions deterministically |
| Exact source and source format | Avoid escaping/serialization ambiguity |
| Flags/options | Part of regex semantics |
| Exact resolved profile IDs/components | Engine name alone is insufficient |
| Operation contract + version | `match`/search semantics otherwise drift |
| Input and replacement data | Necessary to replay observations |
| STRling compiler build | Compose/Inspect results can change with compiler |
| Emitter versions | Generated artifacts can change |
| Regex Knowledge snapshot | Compatibility/explanation facts can evolve |
| Profile-registry snapshot | Aliases and metadata can evolve |
| Runtime adapter/provider version | Execution normalization can change |
| Material environment identity | Needed when behavior depends upon it |
| Compare axis/invariants | Otherwise the comparison question itself is lost |
| Witness/evidence references | Reconnect results to demonstrations and provenance |

Compiler Explorer provides a useful precedent: compilation requests explicitly encode source, compiler ID, arguments, compiler options, tools, library versions, execution arguments, and stdin; its short-link information endpoint exposes source, compiler settings, and libraries. [source-verification note](#source-verification-gaps) Its main project also treats URL shortening as a replaceable state-storage service rather than assuming every session fits cleanly in a literal URL. [source-verification note](#source-verification-gaps)

Rust Playground adds another lesson: it can save/share source via GitHub Gist while letting users choose stable/beta/nightly, debug/release, Clippy, formatting, IR, MIR, or assembly. [source-verification note](#source-verification-gaps) For Regex Lab, however, “current stable” is not enough for rigorous replay; a shared session should record the concrete runtime/compiler resolved at save time.

I recommend two related share artifacts:

**Session permalink** — canonical inputs/configuration sufficient to reconstruct/recompute the investigation.

**Recorded snapshot** — the same semantic state plus frozen result envelopes, hashes, producer/runtime provenance, and creation time.

A replay can then honestly report:

> “Recorded result from profile P at snapshot time”
> versus
> “Fresh replay under profile P' today.”

A canonical serialized session should be content-addressable or at least content-hashed. UI layout can be saved as optional convenience state, but it is **not part of semantic reproducibility**.

Sensitive input complicates sharing. Test strings may contain credentials, personal information, proprietary logs, or production payloads. The sharing model should therefore explicitly distinguish:

- share pattern/configuration only;
- share complete reproducible data;
- keep session local/private.

It should never silently publish test input for the sake of reproducibility. SARIF's treatment of invocation data demonstrates the general tradeoff: complete invocation data improves replayability but can reveal credentials or paths, so redaction must be possible and the resulting reproducibility limitation must be visible. [source-verification note](#source-verification-gaps)

Finally, **opening a shared link should never automatically execute it**. It may reconstruct the session and perform safe local parsing, but Run requires an explicit user action. An untrusted URL must not be an invocation mechanism.

## Compiler APIs, execution boundary, and recommended architecture

### Relationship to STRling compiler APIs

The Lab should treat STRling's compiler core as the semantic authority for STRling constructs and reusable regex analysis where appropriate.

The existing architecture provides excellent boundaries:

```text
Parse
  ↓
AST
  ↓
Compile
  ↓
Target-neutral IR
  ↓
Emit
  ↓
Target artifact
```

and specifically says emitters should be deterministic, side-effect-free consumers of a canonical model. [source-verification note](#source-verification-gaps)

For Regex Lab, the conceptual compiler API should evolve toward operations resembling:

```text
parse(source, sourceFormat)
    -> ParsedSubject

diagnose(subject, assumptions)
    -> Finding[]

analyze(subject, semanticProfiles, knowledgeSnapshot)
    -> StaticAnalysis

compile(strlingIntent)
    -> CanonicalIR

plan(ir, targetProfiles, knowledgeSnapshot)
    -> PortabilityPlan

emit(ir, targetProfile)
    -> GeneratedArtifact
```

These are architectural contracts, not assertions that those exact function names exist today.

**Runtime execution should not be added to this compiler interface.**

Instead:

```text
execute(
    generatedOrRawPattern,
    exactExecutionProfile,
    operation,
    data,
    executionPolicy
)
    -> LabObservation
```

belongs behind a runtime-adapter/execution boundary.

This distinction is particularly important given the present TypeScript convenience implementation: it advertises browser-local compilation, currently restricts `compileNode` to PCRE2, and separately constructs JavaScript `RegExp` instances in `toRegExp`. [source-verification note](#source-verification-gaps) That is useful application convenience code, but it is not the exact-profile execution abstraction required by Regex Lab.

The existing CLI diagnostic service is similarly a starting point, not the whole Lab API. It currently calls the parser and normalizes parser failures into an LSP-style `{success, diagnostics, version}` contract. [source-verification note](#source-verification-gaps) Regex Lab needs a broader domain protocol that includes findings, assumptions, compiler artifacts, observations, comparisons, and provenance. LSP-style diagnostics remain one projection of that intelligence.

### Recommended product architecture

The conceptual architecture should be:

```text
                         ┌──────────────────────────┐
                         │      Regex Lab Shell     │
                         │ Inspect / Run / Compare  │
                         │        / Compose         │
                         └────────────┬─────────────┘
                                      │
                         Versioned Lab Session Model
                                      │
             ┌────────────────────────┼───────────────────────┐
             │                        │                       │
             ▼                        ▼                       ▼
   ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
   │ Intelligence Core│    │  Compare Engine  │    │ Session / Sharing│
   │ parser/compiler  │    │ deltas/witnesses │    │ codec/snapshots  │
   │ IR/diagnostics   │    │ evidence scopes  │    │ redaction/hashes │
   └────────┬─────────┘    └────────┬─────────┘    └──────────────────┘
            │                       │
      ┌─────┴────────┐              │
      ▼              ▼              │
 Regex Knowledge  Profile           │
 snapshot         Resolver           │
      │              │               │
      └───────┬──────┘               │
              │                      │
              ▼                      ▼
       static findings       normalized evidence
                                     ▲
                                     │
                         ┌───────────┴────────────┐
                         │   Execution Broker     │
                         │ profile/runtime adapters│
                         └───────────┬────────────┘
                                     │
                         isolated disposable workers
                                     │
                                     ▼
                              LabObservation

          Regex Conformance evidence/registries
                    │
                    └──── read-only references ───► Lab
```

The important architectural properties are:

**The session model is the integration point.** Not shared UI widgets and not a mega-endpoint.

**The intelligence core is mostly deterministic.** Inspect and Compose should be capable of operating without crossing the regex-execution boundary.

**Compare consumes results; it does not own another regex parser or runtime.**

**Execution is brokered and profile-specific.** Every runtime adapter reports what profile was actually executed and normalizes only representational structure, not away semantic differences.

**Knowledge and Conformance are external authorities.** Lab carries their IDs and snapshots; it does not duplicate their datasets as untraceable application constants.

**Conformance evidence access is read-only.** Conformance runners, evidence publication credentials, campaign orchestration, and certification do not live in Regex Lab.

### Execution trust and security

The browser/compiler side and runtime-execution side should be treated as different threat classes.

Rust Playground demonstrates the mature pattern for untrusted execution: it uses Docker to isolate compiler/tool execution, removes outside network access, and constrains memory and total compilation/execution time. [source-verification note](#source-verification-gaps) Compiler Explorer likewise notes that its compilation nodes have no internet access and refuses an external-header mechanism in its compilation API for security reasons. [source-verification note](#source-verification-gaps)

Regex Run workers should conceptually have:

- no production or Conformance credentials;
- no network by default;
- no persistent writable workspace;
- killable CPU/wall-clock limits;
- memory limits;
- pattern/input/replacement/output size limits;
- bounded match/result counts;
- bounded concurrent work;
- immutable/pinned runtime environments;
- explicit runtime adapter identity;
- separate handling for timeout, worker crash, unsupported operation, regex compile error, and semantic result.

This is sufficient at the product-architecture level; detailed ReDoS detection algorithms are unnecessary to establish the boundary.

The initial Run feature should also refuse executable replacement callbacks or arbitrary host-language eval. Replacement **templates/data** are reasonable regex operations; arbitrary code creates a substantially different sandbox product.

Profile execution may eventually occur in different locations—browser/WASM, remote workers, or profile-specific infrastructure. The session/result model should not care. It should record:

```text
executionProvider
runtimeProfile
adapterVersion
resourcePolicy
environmentIdentity
```

so provenance remains stable whichever provider is chosen.

The current website's static/no-backend architecture makes this separation particularly valuable: a remote executor can remain an isolated service instead of turning the documentation/user-surface application itself into an arbitrary-computation host. [source-verification note](#source-verification-gaps)

Above all, **the Regex Lab executor must not share the Regex Conformance trusted execution plane**. Regex Conformance explicitly states that trusted self-hosted execution never runs arbitrary public fork or pull-request code and that public validation operates without trusted evidence credentials or publication permission. [source-verification note](#source-verification-gaps) An internet-facing Lab is inherently ad hoc/untrusted; maintaining separate credentials, environments, and evidence types is the cleanest defense against accidental authority escalation.

## Lessons from mature tools and remaining product decisions

### Structural lessons from mature developer tools

The surveyed tools converge on several patterns that fit STRling particularly well.

| Tool / system | Structural lesson for Regex Lab |
|---|---|
| **Compiler Explorer** | Treat source, exact tool/compiler identity, arguments, libraries, tools, stdin, and execution as orthogonal state. Multiple result projections can share those coordinates without becoming the same feature. [source-verification note](#source-verification-gaps) |
| **Rust Playground** | Toolchain/channel, build mode, formatter/linter/compiler output, sharing, and actual execution can coexist while the backend applies a separate execution sandbox. [source-verification note](#source-verification-gaps) |
| **regex101** | Regex flavor, operation/function, explanation, match information, debugger, benchmark, code generation, and saved regex revisions are distinct concepts. The product does not need to pretend “regex input + text box” is the only state model. [source-verification note](#source-verification-gaps) |
| **PostgreSQL EXPLAIN** | Static/estimated reasoning and real execution deserve explicit different modes because “show what would happen” and “actually do it and report observations” have different evidence and risk. [source-verification note](#source-verification-gaps) |
| **SARIF** | Findings should have stable identity, severity/kind, locations, related evidence, fingerprints, and producer/invocation provenance; reproducibility data can contain secrets and must support redaction. [source-verification note](#source-verification-gaps) |
| **Language Server Protocol** | Put domain intelligence behind structured, presentation-independent contracts so different interactive surfaces reuse the same semantics. [source-verification note](#source-verification-gaps) |
| **MDN Browser Compatibility Data** | Compatibility is a versioned factual model with partial/conditional cases and notes, not a permanent yes/no bit. [source-verification note](#source-verification-gaps) |

Compiler Explorer provides perhaps the closest overall architectural analogy, but Regex Lab should **not visually imitate it**. Its important contribution is the coordinate model: inputs and configuration are stable state, while compiler output, tools, execution, and views are projections/actions around that state. [source-verification note](#source-verification-gaps)

PostgreSQL provides the most important evidence lesson: execution deserves an unmistakable boundary. [source-verification note](#source-verification-gaps)

SARIF provides the most important result-model lesson: structured identity and provenance survive across UIs and runs better than prose does. [source-verification note](#source-verification-gaps)

Regex Conformance itself provides the most important STRling-specific lesson: **do not erase distinctions between expectations, probes, attempts, observations, findings, and certification.** [source-verification note](#source-verification-gaps)

### Recommended product shape

Taken together, the recommended product is:

> **Regex Lab is an evidence-aware regex investigation environment centered on one versioned session model. Inspect performs non-executing analysis; Run obtains ad hoc runtime observations; Compare explains controlled differences and their witnesses; Compose turns STRling semantic intent into diagnostics, portability plans, and target artifacts. All four share compiler intelligence, profile identity, Regex Knowledge, provenance, and session state, but they do not share evidence authority.**

Its likely workflow graph is more important than four equal navigation items:

```text
                       existing regex
                         /       \
                        ▼         ▼
                    Inspect ───► Run
                       │          │
                       │          │
                       └────┬─────┘
                            ▼
                         Compare
                            ▲
                            │
STRling / Simply ─► Compose │
                    │   │   │
                    │   └───┘
                    │ generated artifact
                    └────────────► Inspect / Run

Regex Knowledge ───────────► explanation / planning
Regex Conformance ─────────► read-only evidence / vectors
```

The key architecture rule is that transitions **copy coordinates and retain derivation**, rather than changing what an existing result means.

A generated PCRE2 artifact moved from Compose to Run remains a compiler artifact **and acquires** a new Lab runtime observation. An Inspect warning followed by a successful Run does not disappear; one is a static finding and one is a concrete observation. A Conformance vector replayed in Run retains its imported vector/evidence link while the replay remains ad hoc.

That is how the tools can “share intelligence” without becoming redundant: **they share nouns and references, while keeping different verbs and evidence contracts.**

### Unresolved product questions

Several decisions remain legitimately product-level rather than architectural inevitabilities.

| Question | Recommended starting position |
|---|---|
| **How granular should users see profiles?** | Show friendly family/release aliases, but resolve and persist exact profile/component identities whenever possible. |
| **Should Inspect require an engine/flavor?** | No. Allow profile-neutral inspection with explicit assumptions/unknowns; more profiles increase precision. |
| **What is the portable operation vocabulary?** | Define a small versioned core—search, full-match, scan, replace, split—and permit explicit profile-native operations where semantics cannot honestly be normalized. |
| **Should Run benchmark regexes?** | Not initially. Ordinary run telemetry can diagnose limits, but performance benchmarking has enough environmental sensitivity that it deserves a separate later contract rather than becoming accidental “performance evidence.” |
| **Should Simply mean executable TypeScript/Python builder code?** | Initially no. Prefer a constrained semantic representation or syntax; arbitrary host-language execution would turn Compose into a general code sandbox. |
| **May Compare automatically generate counterexamples?** | The data model should support generated witnesses now, but automatic generation can arrive later. Compare remains useful with user inputs and imported vectors. |
| **Should Compare claim two patterns are “equivalent”?** | Not from finite Lab executions. Say “no difference observed over W” or “same under this static dimension.” Reserve stronger claims for evidence capable of supporting them. |
| **Can an interactive run become a Conformance candidate?** | It may explicitly export a candidate vector/specification later, but never evidence or certification. |
| **Where should execution happen?** | Keep provider-neutral architecture. Browser/WASM and isolated remote execution can coexist if their provenance is explicit. |
| **What should a public share link include?** | Pattern/configuration by default; require explicit consent to include test/replacement data. Recorded observations should identify whether sensitive fields were omitted/redacted. |
| **Should all four capabilities appear as primary tabs?** | No. Promote Inspect and Run for regex investigation; Compose for STRling authoring; reveal Compare contextually once a meaningful second axis exists. |
| **Should “Audit” remain the public name?** | Prefer **Inspect**. “Audit” suggests a completeness or assurance level that conflicts with the deliberately bounded, uncertain, non-certified nature of the capability. |
| **Should “Evaluate” remain the public name?** | Prefer **Run**. It makes the execution boundary unmistakable. “Evaluate” can remain the internal concept if it may later include specialized evaluation providers. |
| **Should “Playground” remain the public name?** | Prefer **Compose**. “Playground” describes the overall interactive setting and therefore weakens rather than clarifies the capability boundary. |

The resulting conceptual state machine is compact:

```text
SUBJECT
  + PROFILE ASSUMPTIONS
  + OPTIONS
        │
        ├── Inspect ──► STATIC FINDINGS
        │
        ├── Compose ──► COMPILER ARTIFACTS
        │
        └── + OPERATION + DATA + EXECUTOR
                │
                └── Run ──► LAB OBSERVATION

ANY TWO CONTROLLED STATES / RESULTS
        + explicit comparison question
                │
                └── Compare ──► DELTAS + WITNESSES

REGEX KNOWLEDGE
        └──► contextual facts / explanations / planning

REGEX CONFORMANCE
        └──► immutable external evidence references
             (never produced implicitly by Lab)
```

That model answers the primary architectural question: **share the coordinates, compiler intelligence, profile ontology, knowledge facts, source identity, witness representation, and provenance machinery; do not share purpose, evidence class, execution authority, or certification semantics.**
