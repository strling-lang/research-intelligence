# Methodology for Durable Empirical Evidence in STRling Regex Conformance

Role: Research report
Origin: AI-assisted deep-research session commissioned for STRling Research Intelligence; the underlying sources, not the AI system, are the evidence authorities.
Generated: 2026-08-12
Imported: 2026-08-12
Source verification: Partially verified
Last reviewed: 2026-08-12
Current status: Active input

## Source verification gaps

Current Regex Conformance status and architecture were rechecked at commit [`f8c603a`](https://github.com/strling-lang/regex-conformance/tree/f8c603a1a4f5f827247f8a5bed61c85f483857f8): repository bootstrap is certified, the Control Plane foundation is under implementation, and no repository observation is a certified conformance result. External methodology was partially checked against [W3C PROV](https://www.w3.org/TR/prov-overview/), the [FAIR principles](https://doi.org/10.1038/sdata.2016.18), [RFC 8785 JCS](https://www.rfc-editor.org/rfc/rfc8785), and [SLSA provenance](https://slsa.dev/spec/v1.2/provenance).

The original research-session marker map is unavailable. Unreconstructed markers link here. The E0-E5 ladder, evidence envelope, replication-independence descriptor, correction-impact graph, and checkpointing proposals are report recommendations; their empirical value and operational cost have not been validated in a production campaign.

## Executive conclusion

The scientifically defensible unit in STRling Regex Conformance should **not** be “a test result.” It should be a versioned evidence package establishing, with machine-verifiable lineage, **what question was asked, what exact software and environment actually executed it, what happened during each attempt, which facts were directly observed, how those facts were normalized and interpreted, whether the observation was reproduced, and what later corrections or certifications affect its standing**.

That conclusion is strongly supported by reproducible computational science, scientific-provenance practice, software artifact evaluation, benchmark programs, reproducible-build methodology, and standards-conformance programs. W3C PROV treats provenance as information about entities, activities, and responsible agents that enables judgments about quality, reliability, and trustworthiness; FAIR calls for persistent identifiers, rich metadata, qualified relationships, detailed provenance, and preservation of metadata even after the underlying object becomes unavailable. The National Academies distinguishes computational reproducibility from independent replication and explicitly warns that reproducibility alone is neither necessary nor sufficient to establish scientific validity. ACM artifact evaluation similarly distinguishes artifact availability/functionality from **independent reproduction of results**. [source-verification note](#source-verification-gaps)

STRling's existing architecture is already unusually strong on these epistemic distinctions. Its controlling specification separates normative knowledge from empirical evidence, preserves observations immutably, separates logical executions from physical attempts, separates environment recipes from realized environments, prohibits infrastructure failure from masquerading as regex non-conformance, and makes corrections append-only rather than destructive. [source-verification note](#source-verification-gaps) [source-verification note](#source-verification-gaps) The repository architecture encodes those boundaries explicitly: matrix coordinates are not attempts, scheduler assignments are not evidence, warehouse rows do not outrank observations, and the verifier may not mutate published observations. [source-verification note](#source-verification-gaps)

The important caveat is that **the architecture is ahead of the empirical system**. The repository currently says that no observation in it is yet a certified conformance result and no production evidence campaign has been authorized. Current `main` contains bootstrap identity profiles such as `logical-execution.v1` and `evidence-manifest.v1`, plus machine-inventory infrastructure, but the repository tree does not yet contain the complete production physical-run, observation, realized-environment, correction, and certification evidence schemas implied by the Notion architecture. [source-verification note](#source-verification-gaps) [source-verification note](#source-verification-gaps) [source-verification note](#source-verification-gaps) [source-verification note](#source-verification-gaps)

The central methodological answer is therefore:

> **A regex observation becomes durable empirical evidence only when the observation is immutable; its logical question and every physical attempt are separately identified; the exact inputs, runtime artifacts, dependencies, adapter, realized environment, execution conditions, raw record, normalization, integrity digests, provenance, eligibility, discrepancy state, correction history, and certification policy are recoverable; and its claimed reproducibility level is supported by actual rerun evidence rather than by the existence of a recipe.**

A single clean run can be a legitimate **observation**. It ordinarily should not, by itself, become a strong long-lived compatibility claim.

## Evidence object model and provenance

The most important epistemic discipline is to prevent information from changing type merely because it agrees with something else. Documentation does not become an observation; an observation does not become a normative promise; a computed aggregation does not become raw evidence; and an inference does not become empirical fact. This is consistent with STRling's adopted evidence model and with PROV's explicit separation of entities, activities, derivations, and responsible agents. [source-verification note](#source-verification-gaps) [source-verification note](#source-verification-gaps)

### Recommended evidence-object taxonomy

| Object | Scientific meaning | Authority and lifecycle |
|---|---|---|
| **Source proposition** | A statement made by an identified external primary or secondary source. | Knowledge authority. Preserve source identity, version/date, excerpt locator and scope. Never rewritten by empirical evidence. |
| **Researched claim** | STRling's synthesized proposition based on one or more sources. | Knowledge authority. Versioned and independently traceable to its sources. |
| **Normative expectation** | A scoped proposition describing what an applicable specification or authoritative source says should happen. | Knowledge authority. Must remain separate from the probe and from the observed answer. |
| **Probe / vector** | An executable question posed to a target. | Repository authority. Immutable versioned definition with inputs, operation and observation request. It asks; it does not prove. |
| **Logical execution** | One frozen intended empirical experiment: exact profile, vector, operation, environment requirement, applicability and execution policy. | Content-identified repository/campaign object. Retried attempts do not multiply the logical denominator. |
| **Physical attempt** | One actual effort to satisfy a logical execution. | Immutable empirical authority. Operational identity; records where, when and how execution was attempted. |
| **Observation segment** | Directly recorded facts from an attempt: target response, process state, infrastructure event, raw protocol response, etc. | Immutable empirical authority. Content-addressed where appropriate. Must not contain post-hoc compatibility judgment. |
| **Attempt disposition** | Qualification of whether an attempt is scientifically usable: valid target observation, infrastructure failure, corrupted, wrong environment, protocol violation, etc. | Derived verification state that references immutable attempt/observation objects. Changes create new disposition records rather than editing the observation. |
| **Reconciliation / discrepancy** | Relationship between empirical observation and normative expectation, or among conflicting empirical observations. | Conformance evidence authority. Agreement and disagreement are relationships, not mutations of either side. |
| **Replication relation** | A qualified relationship saying that another attempt or logical execution was intended to reproduce or independently replicate earlier evidence. | Immutable relation with an explicit independence class and comparison outcome. |
| **Derived empirical finding** | A deterministic result computed from an identified evidence set. | Derived-data authority only. Must carry complete lineage, transformation identity and evidence snapshot. |
| **Inference** | A conclusion that goes beyond what cited observations directly establish. | Authority belongs to the authoring analytical artifact, not to raw evidence. Must be labeled as inference. |
| **Correction / invalidation / supersession event** | A later assertion changing how prior evidence should be selected or interpreted. | Append-only. Never changes the historical bytes of the earlier object. |
| **Evidence certificate** | An attestation that a precisely identified evidence set satisfied a precisely identified methodology at a given time. | Certification authority. It certifies process/integrity/scope—not metaphysical truth. |

This extends, rather than contradicts, the existing STRling model. The project already distinguishes normative evidence, researched claims, probes, expectations, observations, findings and inference; it further defines agreement, disagreement, ambiguous expectation, absent expectation and inconclusive observation as reconciliation states, and separates `unsupported`, `not observed`, `not tested`, `unknown`, `not applicable`, `unreproducible` and `ambiguous`. [source-verification note](#source-verification-gaps)

The additional methodological refinement I recommend is an explicit **attempt disposition object**. Today the architecture conceptually recognizes valid and invalid attempts, infrastructure failure and certification eligibility, but making disposition a first-class immutable/versioned relation would prevent the verifier from silently changing the semantic content of an observation. An observation should say, in effect, “process exited this way and adapter emitted these bytes”; a disposition should say “this observation is eligible evidence of target regex behavior.” That separation is scientifically useful because verification logic can later be corrected without falsifying what was originally recorded.

### Minimum provenance graph

A durable evidence object should be representable as a small domain-specific provenance graph:

`source/expectation → probe → logical execution → physical attempt → raw observation → normalized observation → disposition → finding → publication/certificate`

with parallel edges from profile, artifact, environment recipe, environment realization, adapter/protocol, campaign policy and responsible agents.

W3C PROV provides an appropriate **conceptual crosswalk**, not necessarily an implementation requirement: vectors, profiles, artifacts, observations and certificates are PROV-like entities; environment construction, execution, normalization, verification and analysis are activities; operators, builders, runners and certifiers are agents; and correction, derivation and revision relations are qualified edges. PROV also explicitly supports provenance of provenance through bundles. [source-verification note](#source-verification-gaps)

STRling should retain its domain-native schemas and merely provide a PROV mapping/export. Requiring every execution to be stored internally as generic RDF/PROV would buy little scientific value while sacrificing schema clarity and operational efficiency.

### What an evidence record must carry

At minimum, an evidence package should bind:

| Provenance dimension | Required evidence |
|---|---|
| **Question identity** | Logical-execution ID; campaign manifest; profile/release ID; vector ID and revision; operation; semantic obligations; applicability proof; declared relevant dimensions. |
| **Target identity** | Intended target plus realized runtime/artifact identifiers; build/version identity; component graph when behavior is supplied by embedded or delegated components. |
| **Construction provenance** | Environment recipe, exact input artifacts, source revisions, patches, compiler/toolchain, dependency closure, build/install/config steps and output digests. |
| **Realized environment** | Realized-environment fingerprint and instance ID; OS/guest/kernel/ABI; architecture; compatibility/emulation layer; relevant dynamic dependencies, locale, encoding and Unicode data; relevant environment/configuration. |
| **Execution context** | Physical-attempt ID, purpose and ordinal; worker/provider; isolation/resource limits; clock provenance; network/randomness policy; adapter session and negotiated protocol; start/end times and supervisor events. |
| **Raw empirical record** | Exact protocol request and raw response or their immutable digests; process termination facts; native target output; diagnostics required to independently check the interpretation. |
| **Normalization lineage** | Normalized outcome, normalization schema/version, adapter/protocol version and transformation implementation identity. |
| **Integrity** | Canonical serialization policy, content IDs, byte lengths/digests, shard/manifest digest and storage integrity verification. |
| **Scientific qualification** | Trust class, environment verification, eligibility/disposition, infrastructure-failure classification, discrepancy state and reproducibility level. |
| **Lifecycle** | Retry/audit/replication relations, corrections, invalidations, supersession, certification withdrawal/replacement and current-selection status. |
| **Custody** | Producer/operator identity or pseudonymous trusted principal, attestation/signature where warranted, publication event and evidence-store location/identifier. |

This is consistent with both scientific-data practice and software-supply-chain provenance. FAIR calls for globally persistent identifiers, rich metadata, qualified references, detailed provenance and retention of metadata when data disappear. SLSA's provenance model similarly separates build definition from a particular run, identifies builders and invocations, records resolved dependencies and execution metadata, and treats provenance integrity separately from artifact identity. [source-verification note](#source-verification-gaps)

STRling's environment designs already cover much of this. Its recipe is explicitly a digest-pinned construction/provenance graph, and its artifact node records digest, size, type, origin locators, publisher, signatures/attestations where available, licensing/access information and derivation edges. Crucially, URLs, tags and package versions are treated only as locators rather than sufficient identity. [source-verification note](#source-verification-gaps)

## Environment identity and execution semantics

### Recipe is not realization

The distinction between an **environment recipe** and a **realized environment** should remain absolute.

A recipe says what should be fetched, built, installed and configured. The realized environment records what was actually present at execution. Reproducible-build practice makes the same important distinction: reproducibility depends on the source, build instructions **and build environment**, including dependency versions, build flags and behaviorally relevant environment variables such as locale; verification is ultimately against produced artifacts, commonly by cryptographic digest. [source-verification note](#source-verification-gaps)

STRling has already adopted the right architecture. Its realized fingerprint includes actual image/base/artifact/runtime/adapter digests, runtime build/configuration, OS/kernel/ABI, architecture, emulation or compatibility layer, dynamic dependencies, locale/timezone/encoding/Unicode data, relevant configuration and environment, capabilities, and relevant isolation/network/clock/randomness policy. It deliberately excludes ephemeral paths, instance timestamps, worker pseudonyms and similar operational details from equivalence identity. [source-verification note](#source-verification-gaps)

That distinction should be strengthened with one additional rule:

> **The set of environment fields considered behaviorally relevant for a logical execution should be frozen before the result is inspected.**

Otherwise, environmental equivalence can be rationalized after an inconvenient result: two environments agree, so a difference is declared irrelevant; they disagree, so a previously ignored difference is retrospectively promoted into the fingerprint. Relevant-dimension policy should therefore be identified by version and included in the logical execution or environment requirement. Later evidence may show that the policy was incomplete, but that discovery should create a new policy/version and potentially new logical coordinates rather than rewriting the earlier experiment.

“Unknown” is also a scientifically meaningful state. STRling already specifies that an unknown relevant fingerprint field fails Ready/certification rather than being silently ignored. That is exactly the correct conservative rule. [source-verification note](#source-verification-gaps)

### Runtime identity must bottom out in artifacts, not labels

A version string is useful metadata, but it is insufficient identity. Two builds with the same displayed version can contain different patches, compilers, linked libraries, embedded engine revisions or vendor modifications. STRling's environment architecture correctly makes byte/build differences produce separate realized fingerprints unless a reviewed equivalence relation says otherwise. [source-verification note](#source-verification-gaps)

For every runtime for which the underlying bytes are obtainable, durable evidence should therefore bind cryptographic digests of the executable/library/container/package actually used and, where practical, the loaded dependency closure. For source-built targets, the source tree/revision, patches, compiler/toolchain, flags and output digest should additionally be bound. Reproducible-build methodology makes precisely this distinction between declaring a source/configuration and proving the resulting artifact. [source-verification note](#source-verification-gaps)

For source code, persistent intrinsic references such as SWHIDs are worth adopting alongside origin URLs. SWHIDs identify content, directories, revisions, releases and snapshots from intrinsic content rather than depending on a mutable hosting location; they can be locally computed and independently verified. [source-verification note](#source-verification-gaps) The repository URL should still be retained as provenance, but it must not be the sole historical identity.

### Logical executions and physical attempts

STRling's `logical-execution` / `physical-run` split is one of the most important design choices in the program.

Its adopted model defines a logical execution as the frozen intended experiment, a physical run as one actual attempt, observations as immutable facts, and explicit run relations for retry, audit, correction, replication and derivation. Its worked example correctly keeps an initial infrastructure failure, successful retry, audit and independent replication as four distinct physical runs under one logical execution, without inflating the logical coverage denominator. [source-verification note](#source-verification-gaps)

The governing rule should be:

**Same logical execution:** only when changing attempts leaves every scientific input and requirement defining the intended question unchanged.

**New logical execution:** whenever the vector, profile, operation, applicability, behavior-relevant environment requirement, adapter semantics, resource/timeout policy where behavior-affecting, or other scientific input changes.

Thus:

`retry because upload failed` → same logical execution, new attempt.

`rerun on a fresh instance satisfying exactly the same frozen requirements` → same logical execution, new attempt and potentially a reproduction relation.

`increase the target timeout because the first timed out` → new logical execution if the timeout is part of the tested semantics.

`move from Linux/glibc to Windows because platform may matter` → new logical execution if platform is a declared matrix dimension; the cross-execution relationship can then support replication/generalization.

`rerun only because the target gave an unexpected answer` → new attempt is allowed, but the reason must be recorded and the original preserved; certification selection must not simply discard the inconvenient result.

The current repository's logical-execution identity profile already binds profile, vector, environment, operation and dimensions. [source-verification note](#source-verification-gaps) The full conceptual logical payload in Notion is richer—campaign, matrix coordinate, obligations, applicability proof, environment requirements, adapter/protocol, limits and trust/completion policy—so the eventual wire schema and identity projections should make it unambiguous which of those fields change logical identity and which are non-identity provenance. [source-verification note](#source-verification-gaps)

### Commit observations before reconciliation

I recommend a further scientific safeguard: **where practical, execution should be blind to the normative expected answer, and the raw observation should be committed before expectation reconciliation occurs.**

STRling already conceptually separates probe and expectation. [source-verification note](#source-verification-gaps) Operationally enforcing that separation would reduce opportunities for confirmation bias, special-case adapters, or retry behavior that accidentally depends on whether an answer is “right.” The runner needs the probe; it generally does not need to know what the Knowledge Program expects. Once raw evidence is committed, the verifier can reconcile it with the identified normative expectation.

That is stronger than merely promising that the objects are separate.

## Reproducibility, replication, and anomaly methodology

Terminology needs to be explicit because scientific communities use “reproducibility” and “replication” inconsistently. The National Academies defines computational reproducibility as obtaining consistent computational results with the same data, computational steps, methods, code and analytical conditions, while replication asks the same scientific question using newly obtained data. For STRling, the closest analogue is to reserve **reproduction** for rerunning the frozen experiment and **replication** for a meaningfully independent empirical realization of the same behavioral proposition. [source-verification note](#source-verification-gaps)

### Recommended reproducibility levels

These levels should qualify evidence without turning them into a simplistic truth score.

| Level | Name | Required demonstration | Appropriate downstream interpretation |
|---|---|---|---|
| **E0** | Traceable observation | Immutable raw observation, logical/attempt identity, sufficient provenance to audit what occurred. | “This recorded execution observed X.” No rerun claim. |
| **E1** | Re-executable | E0 plus complete recipe/artifact provenance believed sufficient to construct the execution context. | Others have the materials needed to attempt reproduction; reproduction has not yet been demonstrated. |
| **E2** | Repeated | Additional predeclared attempts in the same verified realized context give a consistent eligible target outcome. | Evidence against immediate nondeterminism, but still dependent on one physical realization. |
| **E3** | Reconstructed reproduction | A fresh environment instance independently reconstructed from the frozen recipe/materials reproduces the outcome. | Strong evidence that the result is not peculiar to one environment instance. |
| **E4** | Independent replication | An independently operated runner or execution authority, with separately realized context and independent evidence capture, confirms the scoped proposition. | Suitable default evidentiary level for durable public exact-profile behavioral claims. |
| **E5** | Scoped robustness | Replications across every environment/profile stratum covered by the claim produce compatible results. | Supports a broader proposition such as “this behavior holds across the named platform set.” |

This borrows two useful distinctions from ACM artifact evaluation: having an artifact available is not the same as proving it works, and neither is the same as another team successfully reproducing the main results. [source-verification note](#source-verification-gaps)

E1 is therefore **not** “reproduced.” A perfect container definition that nobody has successfully rerun is reproducibility material, not reproducibility evidence.

Similarly, E4 does not mean “true forever.” The National Academies emphasizes that neither a successful replication proves an original study correct nor a single failed replication conclusively refutes it. [source-verification note](#source-verification-gaps) STRling should treat replication as additional evidence whose scope and differences remain visible.

### Replication should have explicit independence dimensions

“Replicated” is too coarse unless the evidence says *independent in what sense*. Record at least:

| Independence dimension | Examples |
|---|---|
| **Attempt** | Different process invocation. |
| **Instance** | Fresh VM/container/native installation. |
| **Worker** | Different physical host. |
| **Operator / authority** | Different trusted operator or automated trust principal. |
| **Provider** | Different environment or infrastructure provider. |
| **Construction path** | Vendor binary versus independently built source, where scientifically appropriate. |
| **Verification implementation** | Independent parser/canonicalizer/verifier implementation. |
| **Platform stratum** | Different OS/ABI/architecture deliberately representing a broader claim. |

Two attempts on the same process are weakly independent. Two attempts on separate VMs built from the same corrupted base image are more operationally independent but not artifact-independent. Two operators both using the same defective adapter are not adapter-independent. An evidence certificate should therefore state the independence actually demonstrated rather than attaching an undifferentiated `replicated=true`.

STRling's independent Node.js JCS oracle alongside the Python schema implementation is already a good example of deliberate implementation diversity for a critical identity function. [source-verification note](#source-verification-gaps) Its canonicalization design further requires independent languages to produce byte-identical envelopes and IDs. [source-verification note](#source-verification-gaps) That principle should extend to sampled verification of evidence normalization and certification.

### Retries must not erase anomalies

Flaky software research shows why “just rerun it” is scientifically dangerous. Empirical studies find flakiness caused by order, infrastructure, networking and randomness, and low-probability flakes can require very large rerun counts to discover. [source-verification note](#source-verification-gaps)

For STRling:

A failure caused demonstrably by evidence-storage upload, worker loss, orchestration crash or another infrastructure event is an **inconclusive attempt** about regex behavior. STRling already adopts this rule. [source-verification note](#source-verification-gaps) It should be retried according to predeclared infrastructure policy, and the failed attempt remains in history.

By contrast, if the target process executed normally but different identical attempts produce different regex answers, the system has observed **behavioral variability**. The right result is not “retry until one wins.” Every target outcome remains evidence, and the logical execution becomes nondeterministic/disputed pending characterization.

Where randomness is controllable, record the seed and entropy policy. Where scheduling, clocks, external services or system randomness are possible causes, record their control policy and relevant realized state. A fixed seed should itself be part of the logical input if it can change behavior.

For deterministic conformance claims, STRling should never translate “we ran it N times and all passed” into “this is deterministic.” Finite runs establish only that no variability was observed in that sample. The current decision not to invent numerical confidence scores without a defensible statistical methodology is therefore sound. [source-verification note](#source-verification-gaps)

### Anomaly and discrepancy treatment

A useful triage matrix is:

| Observation pattern | Scientific treatment |
|---|---|
| Attempt never reaches target because worker/network/storage/orchestrator fails | Infrastructure failure; attempt preserved; logical obligation unsatisfied until eligible attempt exists. |
| Target runs but adapter violates protocol or cannot parse output | Measurement-system failure; do not convert to target non-conformance. Preserve raw material for diagnosis. |
| Same logical execution and strict environment yields differing target outcomes | Nondeterministic/flaky empirical result. Preserve all outcomes; block deterministic certification. |
| Different realized fingerprints disagree | Empirical discrepancy. Investigate hidden environment dimensions before selecting a winner. |
| Empirical result conflicts with clear applicable documentation | Normative/empirical disagreement. Both survive unchanged; reconciliation record explains status. |
| Empirical result exercises behavior for which no authoritative expectation exists | Observed behavior with no normative expectation—not documented support and not “conforming.” |
| Historical record later shown to use wrong runtime | Preserve it, invalidate its eligibility, link correction/replacement and propagate certification impact. |
| Newer version behaves differently | Version differential, not correction of old evidence. |

This matches the program's existing epistemic scenarios almost exactly, including its requirement that platform disagreement may demand scope expansion rather than arbitrary winner selection. [source-verification note](#source-verification-gaps)

### When is a claim strong enough for downstream use?

Evidence strength must be relative to the **scope of the claim**, not a universal badge.

An E0 observation can legitimately support a forensic statement: “Attempt R observed outcome X under realized environment F.”

A durable public statement about **one exact profile under one exact environment contract** should ordinarily require at least E3 reconstructed reproduction, complete provenance, no unresolved eligibility defect and an explicit current correction state.

A claim intended to feed durable compatibility/reference data should normally require E4 independent replication—or be visibly marked as single-laboratory evidence until replication occurs.

A claim generalizing over environments, platforms, releases or a profile family requires E5 evidence covering the dimensions named by the claim. One Linux observation cannot scientifically establish “the engine behaves this way” across all supported systems.

A normative conformance statement additionally requires an applicable normative expectation and resolved reconciliation. Empirical acceptance alone establishes observed acceptance, not a standards guarantee. That distinction is central to the project's charter. [source-verification note](#source-verification-gaps)

The practical admission rule I recommend for downstream systems is:

> **No downstream claim may be broader in system, release, profile, environment, operation, semantic obligation, or time than the evidence and normative propositions from which it is derived.**

## Correction, lineage, certification, and historical durability

### Correction must change selection, not history

STRling's correction model is already aligned with mature scholarly recordkeeping. Crossref recommends that editorially significant corrections and retractions be represented as separate linked records rather than modifying the original work in place; DataCite likewise recommends separate persistent identifiers for major versions and explicit `IsNewVersionOf` / `IsPreviousVersionOf` relationships. [source-verification note](#source-verification-gaps)

For empirical evidence, the distinction should be even stricter because the original observation is a historical fact about what the measurement system recorded.

Recommended lifecycle semantics:

**Invalidation** means an observation or attempt is no longer eligible to support the claimed empirical proposition—for example, the runtime was misidentified or the record is corrupt. The original bytes remain.

**Supersession** means a newer object is preferred for some current purpose, without implying that the older historical observation was false. A later run of version 2 does not invalidate a valid version-1 observation.

**Certification withdrawal/revocation** means an evidence set no longer satisfies the certification state under which it was published. The underlying observations may remain valid.

**Corrected replacement** is a qualified relation linking an invalid or defective item to newly generated evidence intended to replace it for current selection.

**Reinstatement** should be possible if later evidence shows that an invalidation itself was erroneous; this too should be another event rather than deletion.

A correction record should carry the affected object IDs; event type; stated reason and reason code; evidence supporting the correction; responsible authority; issue time; scope; replacement IDs if any; governing-policy version; and the certificate/finding/publication dependencies known to be affected.

### Corrections must propagate through lineage

Append-only correction at the observation layer is not sufficient if a compatibility table, warehouse snapshot and certificate continue silently consuming invalid evidence.

Every derived object therefore needs exact input lineage. When evidence is invalidated, the system should compute its dependency closure and mark affected derived findings/certificates as requiring reevaluation. It should then produce new derived versions from the corrected evidence set. The prior derived dataset remains historically addressable.

This follows directly from FAIR's qualified-reference/provenance principles and PROV's derivation model. [source-verification note](#source-verification-gaps) It also matches STRling's rule that warehouse projections are regenerable and never outrank their immutable inputs. [source-verification note](#source-verification-gaps)

### Derived-data authority rules

A derived compatibility finding should be admissible only when it identifies:

the exact immutable evidence-set manifest; the transformation/query implementation and version/content identifier; analytical parameters; ontology/profile snapshot; policy/rule versions; creation time; output object digest; and any exclusions or unresolved states.

A hand-edited warehouse row is therefore never corrective authority. A discovered error must become either a correction to an authoritative input or a new version of the derivation logic followed by regeneration.

The useful analogy from ACM SIGMOD artifact review is that reproducibility packages include not merely data and code but the system configuration, workload/measurement protocol and scripts transforming raw experimental data into published graphs. [source-verification note](#source-verification-gaps) STRling's analytical findings need the same end-to-end lineage.

### Certification should certify a proposition about evidence

The current campaign certification architecture is conceptually excellent: the immutable manifest binds registry, universe/profile/feature definitions, vectors, adapters, environments, scheduler/shard plan, trust and certification rules; logical executions and shards must be deterministic and non-overlapping; only committed integrity-valid evidence satisfies coverage; and C1–C7 must hold conjunctively rather than being hidden behind an aggregate percentage. [source-verification note](#source-verification-gaps)

The methodological refinement is to make the certificate's **predicate explicit**. A certificate should say something like:

> “Evidence set E, evaluated under certification rules C at time T, completely satisfies declared campaign scope S at reproducibility level R, with discrepancy state D.”

It should **not** be semantically equivalent to “all these software behaviors are eternally true.”

This is how mature benchmark and conformance programs work. SPEC requires publicly used benchmark results to follow a versioned run methodology and disclose configuration information sufficient for independent reproduction; current SPEC CPU rules explicitly tie a test to the rule version applicable at the date of testing. [source-verification note](#source-verification-gaps) The Open Group similarly identifies exact test-suite versions authorized for formal certification rather than treating “the POSIX test suite” as a timeless object. [source-verification note](#source-verification-gaps) Khronos conformance programs require implementations to pass defined CTS criteria and record conformance-version information. [source-verification note](#source-verification-gaps)

STRling should therefore bind every certificate to exact versions of:

campaign manifest; certification rule set; schema/identity policy; environment-equivalence policy; evidence-selection/disposition policy; discrepancy policy; replication requirement; and any verifier implementation/attestation relied upon.

A later policy change creates a new certification evaluation. It never changes whether the old evidence passed the old policy. The Foundation Specification already adopts exactly this principle for certification gates. [source-verification note](#source-verification-gaps)

### Long-term disappearance must reduce reproducibility, not erase history

The current stable-denominator policy is scientifically strong. It retains known stable releases even when they are yanked, deleted, inaccessible, license-blocked, platform-blocked or retired; it separately classifies present reproducibility, and later discoveries generate new assessments rather than rewriting old ones. [source-verification note](#source-verification-gaps)

That policy should extend into preservation:

For every obtainable historical release, archive or escrow lawful copies of the exact artifacts and their digests where licensing permits. Preserve source revisions in durable archives and record intrinsic content identifiers such as SWHIDs as well as original origins. [source-verification note](#source-verification-gaps)

When bytes cannot legally or technically be retained, preserve **tombstone metadata**: identities, provenance, digests if known, source locators, expected construction procedure, access restriction, historical execution records and evidence of disappearance. FAIR explicitly calls for metadata to remain accessible when the underlying data are unavailable. [source-verification note](#source-verification-gaps)

Do not fabricate a historical result from a successor version. A modern reconstruction that is believed equivalent is a new empirical context linked to the historical target by an equivalence proposition.

If a historical observation was well-provenanced when produced but its software later disappears, the observation does **not** become invalid. Its current reproducibility grade decreases or becomes “historically evidenced, reproduction presently unavailable.” Conversely, if original provenance was insufficient to establish what actually ran, the evidence was weak all along; disappearance merely makes that weakness harder to repair.

STRling's existing historical-unreproducibility dossier—identity, reason, source evidence, artifact information, attempted reconstruction methods, required hardware/software, assessment time, responsible authority and review trigger—is a good implementation basis. [source-verification note](#source-verification-gaps)

## Assessment of the current STRling design

The current design should be judged at two different layers: **methodological architecture** and **implemented evidence machinery**. Conflating them would itself be an epistemic mistake.

| Area | Assessment | Research-grounded judgment |
|---|---|---|
| Evidence-type separation | **Very strong** | Probe, expectation, observation, finding and inference are explicitly distinct, as are absence and reconciliation states. This is better disciplined than many empirical software systems. [source-verification note](#source-verification-gaps) |
| Authority boundaries | **Very strong** | Normative research, machine definitions, raw evidence, derived warehouse data, local state and public output each have one primary authority. This greatly reduces silent truth duplication. [source-verification note](#source-verification-gaps) |
| Logical vs physical execution | **Very strong** | Retries, audits and replications preserve separate run identities while one logical experiment retains one coverage obligation. [source-verification note](#source-verification-gaps) |
| Environment recipe vs realization | **Very strong** | The architecture distinguishes desired construction, physical instance, realized fingerprint, verification and explicit equivalence. [source-verification note](#source-verification-gaps) |
| Runtime/artifact provenance | **Strong** | Digest-pinned construction graph, source/build paths, dependency/toolchain provenance and byte/build-sensitive fingerprints align well with reproducible-build and supply-chain practice. [source-verification note](#source-verification-gaps) [source-verification note](#source-verification-gaps) |
| Canonical identity | **Very strong conceptually** | Domain-separated JCS/SHA-256 identities, explicit value classes, collision handling, metamorphic tests and cross-language oracle requirements are particularly rigorous. [source-verification note](#source-verification-gaps) |
| Raw versus derived authority | **Strong** | Warehouse and reports are explicitly regenerable and subordinate to immutable observations. [source-verification note](#source-verification-gaps) |
| Corrections/supersession | **Very strong conceptually** | Append-only invalidation/supersession/replacement mirrors mature scholarly correction practice. [source-verification note](#source-verification-gaps) [source-verification note](#source-verification-gaps) |
| Historical unreproducibility | **Very strong** | Vanished software remains in scope and is classified, preventing survivorship bias from inflating coverage. [source-verification note](#source-verification-gaps) |
| Campaign certification | **Strong** | Exact immutable input manifest and conjunctive C1–C7 certification avoid denominator drift and misleading aggregate success. [source-verification note](#source-verification-gaps) |
| Infrastructure-failure semantics | **Strong** | Explicitly inconclusive about target behavior, which is methodologically essential. [source-verification note](#source-verification-gaps) |
| Reproducibility grading | **Incomplete** | `development`, `trusted` and `replicated` are useful production-integrity qualifications, but the design lacks a sufficiently expressive ladder separating availability, repetition, fresh reconstruction, independent replication and generalization. |
| Replication independence | **Incomplete** | Replication exists as a relation, but what independence must mean—worker, operator, provider, environment, adapter, verifier—is still underspecified. The program itself leaves replication sampling open. [source-verification note](#source-verification-gaps) |
| Flakiness methodology | **Incomplete** | Nondeterminism is conceptually recognized, but repeat budgets, outcome-independent rerun rules and certification treatment require a formal methodology before empirical campaigns. |
| Correction propagation | **Partially specified** | Append-only correction is defined; systematic dependency propagation from invalidated evidence into findings, reports and certificates should become an explicit contract. |
| Environment relevance | **Potential methodological risk** | The fingerprint correctly includes fields “where relevant,” but evidence should identify the pre-run relevance-policy version to prevent post-hoc equivalence decisions. |
| Attestation/authenticity | **Open** | Provenance semantics are strong, but public certification will eventually need a clear authenticity/trust-root model. Supply-chain practice demonstrates why a digest alone proves integrity, not who produced the evidence. [source-verification note](#source-verification-gaps) |
| Operational evidence implementation | **Not yet validated** | Current README explicitly says no production certified evidence exists yet. Thus none of the correction, reproduction, long-term storage or campaign-integrity claims has yet been validated under production empirical load. [source-verification note](#source-verification-gaps) |

The repository layout itself is appropriately conservative. `schemas/` owns identity and contracts; `environments/` owns recipes rather than realized installations; `matrix/` owns logical scope; `scheduler/` may retry but not overwrite; `verifier/` checks evidence without mutating it; `warehouse/` is derived; and `certification/` owns gates and revocation rather than mutable evidence. [source-verification note](#source-verification-gaps)

The current `evidence-manifest.v1` identity projection is deliberately compact—campaign, shards, root digest and issuance time—and `logical-execution.v1` binds profile, vector, environment, operation and dimensions. [source-verification note](#source-verification-gaps) [source-verification note](#source-verification-gaps) That is suitable for **identity projection**, provided the eventual full evidence wire schemas retain all of the provenance described in the controlling design. Identity minimalism should not become evidence minimalism.

## Recommended refinements and anti-bureaucracy

The architecture does not need wholesale redesign. It needs a relatively small number of methodological contracts before production evidence should be called certified.

| Refinement | Recommendation | Why it matters |
|---|---|---|
| **Evidence envelope** | Define one normative evidence-envelope schema connecting logical execution, physical attempt, raw observation segments, realized environment, normalization, disposition, trust, provenance and lifecycle relations. | Gives downstream consumers one independently verifiable entry point without flattening the underlying objects. |
| **Attempt disposition** | Make evidence eligibility a first-class immutable/versioned relation rather than a mutable flag on the observation. | Allows verifier mistakes to be corrected without rewriting what the runtime actually emitted. |
| **Reproducibility levels** | Adopt a graded scheme comparable to E0–E5 above and include the demonstrated level in evidence/certification metadata. | Prevents “recipe exists,” “reran once” and “independently replicated” from being collapsed into one term. |
| **Replication independence descriptor** | Record the dimensions in which the replicate is independent. | “Replicated” otherwise overstates evidence from correlated infrastructure. |
| **Replication sampling policy** | Before setting a universal percentage, conduct early campaigns and estimate discrepancy/flakiness rates. Require replication of discrepancies, high-impact findings and fragile historical targets, plus a genuinely random baseline sample. | Avoids both unbounded cost and arbitrary evidentiary theater. |
| **Predeclared rerun policy** | Freeze retry conditions, maximum attempt policy and any repeat schedule in campaign methodology. Separate infrastructure-triggered retries from scientific repeats. | Prevents rerunning inconvenient target outcomes until the preferred answer appears. |
| **Expectation-blind execution** | Do not expose expected normative answers to adapters/runners when unnecessary; commit raw observations before reconciliation. | Strengthens the empirical/normative separation already present in the ontology. |
| **Environment relevance policy** | Freeze the versioned rule determining which environment dimensions are identity-bearing for each execution class before results are examined. | Reduces post-hoc explanation of discrepancies. |
| **Calibration/control evidence** | Before a worker/environment becomes eligible, run non-conformance calibration checks that validate adapter transport, encoding/index handling, runtime identity and basic execution isolation. | Distinguishes a broken measuring instrument from unexpected target behavior. |
| **Correction impact graph** | Maintain machine-readable reverse dependencies from evidence to findings, datasets, reports and certificates. On invalidation, automatically identify affected descendants. | Append-only raw history is not enough if public derivatives remain stale. |
| **Evidence-set snapshots** | Every analytical publication binds an immutable evidence-set manifest rather than querying an unversioned “current” warehouse. | Makes old findings recomputable after the database evolves. |
| **Independent verifier path** | For certification and a sample of observations, run an implementation-independent evidence parser/canonicalizer/normalizer/verifier. | Addresses correlated bugs in the measurement system itself; the existing JCS oracle provides a useful precedent. |
| **Archival identity and escrow** | Record intrinsic source IDs, artifact digests and multiple provenance locators; preserve lawful historical artifacts in archival storage; retain tombstone metadata when bytes cannot be preserved. | Protects evidence against repository, package-registry and vendor disappearance. [source-verification note](#source-verification-gaps) |
| **Authenticated certification** | Sign or otherwise attest published campaign/evidence certificates from a controlled certifying authority, while keeping cryptographic authenticity distinct from scientific validity. | A hash says “unchanged”; it does not say “issued by STRling's trusted evidence system.” SLSA makes the same distinction between artifact identity and trustworthy provenance production. [source-verification note](#source-verification-gaps) |
| **Append-only public checkpointing** | Periodically publish signed Merkle-root or equivalent checkpoints over issued certificates, revocations and corrections. A blockchain is unnecessary. | Content-addressed objects prevent mutation, but checkpointing additionally provides evidence against silent omission or rollback of the public history. |

The system should also adopt a **claim-admission matrix** in its downstream contract. The consumer should specify the minimum evidence level and discrepancy status for each use class: forensic display, internal analysis, public exact-runtime observation, public compatibility assertion, compiler-target assumption, or normative conformance claim. This prevents a future UI or compiler team from implicitly deciding that “one trusted PASS” is good enough for every downstream purpose.

### Practices worth deliberately avoiding

Scientific rigor is not proportional to metadata volume.

A full internal W3C PROV/RDF representation of every low-level event is unnecessary. A compact domain schema with explicit relations and a PROV export provides the methodological value without turning evidence production into ontology administration. PROV itself is designed to be domain-agnostic and extensible, not to require one physical storage representation. [source-verification note](#source-verification-gaps)

Do not hash volatile details merely because they are measurable. Hostnames, temporary file paths, log locations and ephemeral addresses should remain provenance when useful but should not fragment environment identity unless they can affect semantics. STRling's current fingerprint design gets this right. [source-verification note](#source-verification-gaps)

Do not preserve unlimited telemetry indefinitely. Durable evidence needs the raw target/protocol record and enough diagnostic material to independently verify interpretation; high-volume scheduling traces, performance telemetry and debugging logs may have retention policies when they are not part of the certified proposition. FAIR calls for appropriate reusable metadata, not indiscriminate retention of every byte ever generated. [source-verification note](#source-verification-gaps)

Do not assign heavyweight external persistent identifiers such as DOIs to every physical attempt. Internal content/operational IDs plus immutable manifests are sufficient. DOI-like identifiers are more appropriate for published evidence releases or datasets.

Do not require bit-for-bit reproducible **builds** as a universal precondition for behavioral evidence. When exact vendor runtime bytes are preserved and identified, replaying those bytes in a verified environment may be scientifically better than rebuilding them. Reproducible builds are an excellent analogy for artifact provenance, but behavioral reproducibility and build reproducibility are distinct properties. [source-verification note](#source-verification-gaps)

Do not mandate independent replication of every execution at the same rate. Replicate systematically where consequences, novelty, anomalies or environment sensitivity justify it, and sample the remainder under an explicit policy. The project is correct to leave the rate unresolved rather than invent one. [source-verification note](#source-verification-gaps)

Do not use majority vote to make flaky evidence look deterministic. Preserve the distribution of observed outcomes and classify the result accordingly.

Do not invent numerical “confidence” merely because a dashboard wants a score. Numerical probabilities only become meaningful after STRling has defined a statistical estimand, sampling process, independence assumptions and stopping rule. The existing qualitative vocabulary is safer until then. [source-verification note](#source-verification-gaps)

Do not require human approval for every retry, shard or deterministic derivation. Human authority should govern policy changes, disputed corrections and certification exceptions; mechanical evidence integrity should be automated. This is consistent with the project's existing consequence-based governance model. [source-verification note](#source-verification-gaps)

Finally, do not create a “certified” override that lets an authorized person waive failed evidence criteria. STRling's current rule that certification gates pass by evidence rather than declaration is exactly right. [source-verification note](#source-verification-gaps)

## Residual risks and governing answer

Even after these refinements, important methodological risks remain.

**Environment completeness is inherently open-ended.** No fingerprint can prove in advance that every behavior-affecting factor has been captured. Kernel updates, CPU features, Unicode libraries, libc behavior, JIT state, locale data, compatibility layers and hidden system policy can reveal previously unknown dimensions. Disagreement must therefore be allowed to teach the ontology that the environment model was incomplete; it must not be forced into an existing equivalence class. Computational-reproducibility research continues to find missing dependencies, obsolete software and heterogeneous systems to be major obstacles even when source code and data remain available. [source-verification note](#source-verification-gaps)

**Managed services are intrinsically weaker historical targets.** A public API can expose regex semantics while its backend version, patches or configuration change invisibly. Service epochs can preserve what was observed at a time, but they may never attain the same artifact-level reproducibility as preserved binaries. STRling's existing treatment of evidence-grade service epochs and retired services is appropriately conservative. [source-verification note](#source-verification-gaps)

**Runtime self-identification can be wrong or incomplete.** A target claiming to be version X is evidence, not proof. Artifact digests, packaging provenance and independent probes of build identity reduce this risk but cannot always eliminate it.

**The measurement system can share a systematic defect across every run.** Repeating an execution through the same adapter, canonicalizer and verifier may perfectly reproduce a measurement bug. Independent verifier implementations, adapter conformance testing and selective alternative execution paths are therefore more scientifically valuable than raw rerun count.

**Replication can be only nominally independent.** Two cloud runners may share an image, kernel build, package mirror or orchestration defect. Independence dimensions need to remain visible instead of being compressed into a boolean.

**Flakiness is unbounded by finite observation.** No practical rerun budget proves determinism. STRling can report observed stability under a declared sampling policy, not absolute absence of nondeterminism. Flaky-test studies demonstrate that rare failures can remain invisible under ordinary rerun budgets. [source-verification note](#source-verification-gaps)

**Artifact preservation faces legal as well as technical limits.** Proprietary runtimes, redistribution restrictions and expired licensing infrastructure may prevent archival reproduction. Tombstone metadata and historical observations remain valuable, but “currently unavailable for lawful independent rerun” must remain visible rather than being treated as a technical failure. STRling's existing denominator policy already recognizes this. [source-verification note](#source-verification-gaps)

**Cryptographic and attestation mechanisms age.** SHA-256 and contemporary signatures are sensible current choices, but long-lived evidence needs algorithm/version agility and possibly future re-attestation of old content under new trust mechanisms without changing historical identities. STRling's hash-policy token and explicit rule that a changed identity policy creates new IDs with crosswalks is a strong foundation. [source-verification note](#source-verification-gaps)

**Corrections can invalidate a large graph of downstream conclusions.** Without automated dependency tracking, append-only evidence can coexist with silently stale “current” findings. Correction propagation therefore deserves the same design priority as evidence ingestion.

**Certification can drift semantically.** A certificate only remains intelligible if the exact certification predicate and policy are frozen with it. SPEC's versioned run rules and formal conformance programs' suite-version controls demonstrate why “passed the test suite” is inadequate without “which suite, which rules, and under which disclosed configuration.” [source-verification note](#source-verification-gaps)

The strongest governing formulation is:

> **Before STRling treats a regex observation as durable empirical evidence, it must be possible for a skeptical third party—without trusting current project state, mutable databases, human memory, package tags, or a compatibility table—to reconstruct the exact empirical question; identify the exact target and behaviorally relevant realized environment; inspect the immutable raw observation and every attempt that led to it; distinguish target behavior from infrastructure and measurement failure; verify object integrity and transformation lineage; determine whether and how the result was independently reproduced; see all discrepancies, corrections and superseding records; and establish which exact evidence and certification rules authorize the present claim.**

The decisive methodological hierarchy should therefore be:

**observation < qualified evidence < reproduced evidence < independently replicated evidence < scoped derived claim < certified evidence set.**

None of those stages should erase the preceding one, and none should be allowed to claim a broader scope than its inputs establish.

That is the distinction that keeps Regex Conformance from becoming merely a compatibility database: **it preserves not just answers, but the evidentiary conditions under which those answers are entitled to be believed, challenged, reproduced, corrected and reused.**
