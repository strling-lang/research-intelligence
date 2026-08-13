# Authority-Preserving Architecture for STRling Regex Knowledge and Regex Conformance

Role: Research report
Origin: OpenAI deep-research session commissioned for STRling Research Intelligence
Generated: 2026-08-12
Imported: 2026-08-12
Source verification: Partially verified
Last reviewed: 2026-08-12
Current status: Active input

## Source verification gaps

The imported report contained opaque research-session citation markers without a durable marker-to-source table. The markers were removed; unresolved claim-level citations, external comparisons, and proposed models require verification. Current-state claims were checked against the downstream authorities linked by the active inquiry.

## Executive finding and authority model

The central architectural answer is that STRling should **not** try to reconcile Regex Knowledge and Regex Conformance into a single hierarchy of truth**.** It should instead maintain **two epistemic authorities connected by typed, versioned, provenance-bearing relations**:

**Regex Knowledge is authoritative for what researched primary sources document, specify, promise, leave ambiguous, or fail to establish. Regex Conformance immutable evidence is authoritative for what an exactly identified runtime profile did in an exactly identified controlled execution.** Neither authority is entitled to silently rewrite the other. STRling's own current constitutional material already states essentially this division: Knowledge owns canonical concepts, normative primary-source evidence, documented capability claims, version and compatibility research, and unresolved questions; Conformance owns controlled probes, profiles, executions, observations, provenance, empirical differentials, and discrepancy evidence. Their relationship is explicitly bidirectional but non-destructive.

The most important refinement is to make this separation structural rather than merely procedural. An authority should be understood as **authority for a question**, not as a globally ranked dataset:

| Question being asked | Primary authority | What the other side may contribute |
|---|---|---|
| What is this feature/system/profile concept? | Regex Knowledge | Conformance may reference the concept but must not redefine it. |
| What do authoritative sources document for profile P under scope S? | Regex Knowledge | An observation cannot turn undocumented behavior into documented behavior. |
| What exact runtime behavior occurred in execution E? | Conformance evidence | Documentation cannot change the recorded observation. |
| Does observation O agree with expectation E? | Neither underlying authority alone | A derived comparison can answer this while retaining both inputs. |
| Why did E and O disagree? | A derived, evidence-backed finding | It may lead to a Knowledge correction, an evidence invalidation, a scope refinement, or remain unresolved. |
| What should a public Reference display now? | No new truth authority | A deterministic projection over selected Knowledge and Conformance versions. |

This is a **non-total authority model**. “Primary” does not mean “more true.” It means “the authoritative record for this class of proposition.” W3C PROV is useful precisely because it models entities, activities, derivations, revisions, qualified relations, generation, and invalidation without requiring all derived entities to become interchangeable with their inputs. PROV also distinguishes enduring entities from their revisions and specializations.

The desired architecture can therefore be summarized as:

```text
                     DOCUMENTED / RESEARCHED DOMAIN
┌────────────────────────────────────────────────────────────────────┐
│ Regex Knowledge                                                    │
│                                                                    │
│ Source edition ──supports/challenges──> Claim revision             │
│                                          │                         │
│                                          └──derives──> Expectation │
│                                                                    │
│ Authority: documented meaning, ontology, source interpretation     │
└──────────────────────────────┬─────────────────────────────────────┘
                               │ exact external ID +
                               │ revision + snapshot
                               ▼
┌────────────────────────────────────────────────────────────────────┐
│ Regex Conformance operational definitions                          │
│                                                                    │
│ Knowledge snapshot -> Expectation projection -> Vector / probe     │
│                                                │                   │
│                                                ▼                   │
│                                         Logical execution          │
└───────────────────────────────────────────────┬────────────────────┘
                                                │
                                                ▼
                         EMPIRICAL DOMAIN
┌────────────────────────────────────────────────────────────────────┐
│ Immutable Conformance evidence                                     │
│                                                                    │
│ Physical attempt ──generates──> Observation                        │
│                                                                    │
│ Authority: exact observed runtime behavior and provenance          │
└──────────────────────────────┬─────────────────────────────────────┘
                               │
                 ┌─────────────┴───────────────┐
                 ▼                             ▼
        Qualified comparison            Knowledge feedback
        / discrepancy                   / evidence association
                 │                             │
                 └─────────────┬───────────────┘
                               ▼
                    REGENERABLE PROJECTION
              documented / observed / conflicting
                     / ambiguous / unknown
                 (never a third source of truth)
```

That architecture is also consistent with the existing Research Intelligence work rather than duplicating it. The Conformance evidence-methodology inquiry has already concluded that raw observations, qualified evidence, derived findings, and certification are separate layers, and that corrections should preserve previous records and propagate explicitly. The Reference information-architecture inquiry separately concluded that current, historical, unknown, conflicting, normative, and observed information need distinct presentation and that the Reference should remain a projection rather than an authority. This report takes those conclusions as constraints and focuses only on the bridge between the two authorities.

### Structural lesson from external precedents

Several mature systems converge on the same architectural idea without providing a pattern that should simply be copied.

Wikidata treats a statement as something richer than a subject–value tuple: statements can carry qualifiers, references, and ranks, and historical or alternative values can remain present instead of being overwritten. Its documentation explicitly recognizes multiple values arising from history, alternative perspectives, and differing methods, while qualifiers contextualize statements and references identify their supporting sources. The lesson for STRling is not to import Wikidata ranks; it is that **the claim itself must be addressable and qualifiable**.

ClinVar is an even closer scientific precedent for disagreement. It assigns accession identities to submitted assertions, aggregates related submissions, retains conflicting classifications, exposes those conflicts, and states that it does not independently modify a submitter's classification absent an explicit submission. In other words, disagreement is represented as data rather than resolved by corrupting one contributor's assertion. STRling should apply the same structural principle to documentation claims and observations.

The FAIR principles reinforce persistent identifiers, qualified references to other digital objects, and detailed provenance rather than copy-based integration. DataCite similarly distinguishes an enduring resource from version-specific resources and provides explicit relations such as `IsVersionOf`, `HasVersion`, `IsNewVersionOf`, and `IsPreviousVersionOf`; this is a strong precedent for separating durable semantic identity from immutable historical versions.

Web-platform-tests demonstrates another useful distinction: a test has an identity and can target specification material, while expected outcomes can be stored separately and qualified by environment. WPT metadata can even express different expected outcomes by operating system or version. STRling should **not** copy WPT's exact expectation semantics—the WPT metadata can represent implementation-specific expected failures—but it confirms that test identity, expected outcome, execution context, and observed result are separate things.

Finally, MDN's BCD ecosystem shows both the value and the danger of empirical feedback. The BCD collector executes feature-detection tests to inform curated browser-compatibility data, but its own documentation explicitly says the collector is not intended to replace BCD and notes that some features cannot be automatically tested reliably. BCD itself also requires qualifications such as notes for partial implementations. The STRling architecture should go one step further by permanently preserving the raw observation and the researched statement as separate authorities rather than allowing the curated compatibility representation to obscure where each conclusion came from.

**Research finding:** STRling's existing constitutional direction is already sound. The missing work is mostly not a new ontology. It is an explicit **claim-level bridge contract, version semantics, and reconciliation relation model** that makes violating the authority boundary difficult.

## Claim–expectation–observation relationship model

The fundamental data model should contain three first-class epistemic objects—**Claim, Normative Expectation, and Observation**—plus explicitly derived relation objects. They are related, but none is a subtype or replacement for another.

### The researched claim

A **Research Claim** is an atomic, truth-apt STRling interpretation of one or more sources, scoped to explicitly identified subjects and conditions. It is not the source itself. The current Regex Knowledge Program already declares this distinction: a source says something; a researched claim records STRling's normalized interpretation of what that source supports, contradicts, or leaves unresolved.

A claim therefore needs, conceptually:

```text
Claim
  durable claim ID
  immutable claim-revision ID
  subject concept/profile/capability
  predicate
  asserted value/proposition
  applicability scope
  source-evidence references
  source interpretation / rationale
  epistemic status
  effective historical scope
  assertion/research time
  supersession/conflict relations
```

The key architectural distinction is between **claim identity and claim record revision**.

A durable claim ID should identify **the same proposition** even if STRling later improves its wording, adds another supporting source, changes a confidence annotation, or corrects metadata that does not alter the proposition. An immutable claim-revision ID should identify exactly what the Knowledge corpus said about that proposition at a given state.

If the proposition itself changes, it is **not the same claim**. For example:

```text
C1: Profile P supports feature F for all modes.
C2: Profile P supports feature F only when mode M is enabled.
```

C2 must not be a mutable edit to C1 that destroys C1's history. C2 is a new proposition and should explicitly `supersede`, `refine`, or `narrow` C1.

It is useful—but not mandatory—to maintain a separate **claim-family/question key** representing the question being answered, such as:

```text
(profile P, feature F, capability.availability)
```

That grouping lets conflicting propositions C1 and C2 be queried together without treating them as the same claim. This closely follows the structural lesson of Wikidata's multiple qualified statements, while avoiding a generic “preferred value” mechanism that could conceal unresolved source disagreement.

### The normative expectation

A **Normative Expectation** is not simply a field on a test and not merely another name for a claim.

It is a **scoped, operationally comparable consequence of one or more qualified Knowledge claims**.

For example, documentation might establish:

```text
Claim C:
  In profile P, construct F is valid when option U is enabled.
```

An expectation could operationalize one consequence:

```text
Expectation E:
  For profile P + option U,
  compiling pattern X must succeed.
```

Another expectation derived from the same claim might concern matching behavior rather than compilation. Conversely, one expectation might require several claims—for example, one about feature availability, another about default Unicode mode, and another about host API behavior.

This separation matters because translating normative prose into an exact observable outcome is itself an interpretive step. The expectation must therefore preserve the exact claim revisions from which it was derived. The current Foundation already insists that normative expectations, probes, observations, findings, and inferences are distinct classes.

The durable expectation identity should follow the same dual-identity pattern:

| Identity | Meaning |
|---|---|
| `expectation_id` | Enduring semantic identity of one precise expected observable under one precise scope. |
| `expectation_revision_id` | Immutable state identifying the exact derivation, claim revisions, qualifiers, and expected representation used at a particular time. |
| `expectation_projection_id` | Conformance-owned immutable executable representation projected from that Knowledge expectation revision. |

An improved citation or added supporting source may produce a new expectation revision while retaining the expectation ID. Changing “compile succeeds” to “compile fails,” changing the operation under test, or materially changing the applicable profile scope requires a new expectation ID.

Crucially, the current Conformance identity namespace already reserves a content-derived `expectation-projection` identity, as well as `ontology-snapshot`, `ontology-projection`, `crosswalk-revision`, `finding-revision`, and `reconciliation-set`. That is strong evidence that the repository's current direction is compatible with this model.

### The probe and vector

A probe asks a question. It does not become normative because it knows which answer would satisfy an expectation.

Conceptually:

```text
Vector V
    targets ExpectationProjection EP
    asks executable question Q

ExpectationProjection EP
    projectedFrom Knowledge ExpectationRevision ER

V itself does not become ER.
```

A vector can also be exploratory and have **no normative expectation**. This is important when documentation is missing or ambiguous. Such an execution can discover behavior, but its result cannot honestly be labeled a normative pass or failure.

WPT's separation between tests and separate expectation metadata demonstrates the general utility of this separation, even though STRling's normative semantics are stronger than WPT's implementation-specific expected-status metadata.

### The observation

An observation describes what happened in a controlled execution. Its identity and content must not depend on what STRling currently thinks the documentation means.

That leads to an important invariant:

> **Changing a Knowledge claim, expectation, or claim-to-observation interpretation must never change the identity or contents of the original observation.**

An observation can therefore be associated with zero, one, or many knowledge propositions over time without being rewritten. Its exact scientific identity and execution provenance belong to the Conformance methodology already researched elsewhere; this report does not redefine that mechanism. The current Conformance README states that published observations belong in immutable evidence infrastructure and that corrections preserve prior evidence through invalidation, supersession, or replacement rather than rewriting it.

### The bridge is a qualified many-to-many relation

The most important concrete recommendation is:

**A capability record should not contain a canonical list of Conformance observation IDs.**

Instead, the relationship should be represented through qualified first-class associations. A bare list cannot express why an observation is relevant, whether its scope matches, whether it supports or challenges a claim, whether the association was predeclared or discovered afterward, or whether that interpretation was later superseded.

The bridge should distinguish at least two different meanings:

```text
TEST INTENT
Vector ──targets──> ExpectationProjection
ExpectationProjection ──projectedFrom──> Knowledge ExpectationRevision

RESEARCH INTERPRETATION
ClaimEvidenceAssociation
    knowledge claim / expectation ref
    conformance observation ref
    relation: supports | challenges | qualifies | exposes_scope_gap |
              insufficient | not_comparable
    basis: predeclared_target | posthoc_relevance
    scope assessment
    rationale
    association revision
    supersession status
```

This is directly analogous to the reason PROV and Wikidata support qualified relations rather than forcing every relationship into a naked binary edge. PROV provides qualified derivation, revision, attribution, generation, and invalidation structures; Wikidata attaches qualifiers and references to the statement rather than to the underlying item globally.

For STRling, the authoritative owner depends on **what the relation asserts**:

| Relation | Owner | Reason |
|---|---|---|
| `projection projectedFrom Knowledge revision` | Conformance operational definitions | It states exactly what input generated an executable projection. |
| `vector targets expectation` | Conformance operational definitions | It records predeclared test intent. |
| `observation generatedBy execution` | Conformance evidence | It is empirical provenance. |
| `observation bears on Knowledge claim` | Knowledge research layer, when human/analytic interpretation is involved | It is an interpretation of the empirical result's relevance to a researched proposition. |
| `comparison mismatch between O and E` | Conformance-derived finding/discrepancy | It records the result of comparing two exact inputs under a specified comparison rule. |
| `later documentation explains discrepancy D` | Knowledge-derived research relation | It is a source interpretation, not a retroactive observation. |

This resolves both many-to-many questions naturally. **One expectation may be targeted by indefinitely many vectors/executions/observations across releases and campaigns. One observation may bear on several claims or expectations through several qualified association records.** There is no reason to duplicate either side's object.

### How Conformance should reference Knowledge without copying its ontology

Regex Conformance should consume four things from Knowledge:

```text
owner namespace
stable external object ID
exact external revision ID
exact Knowledge snapshot / manifest identity
```

Conformance may materialize the minimum executable representation needed by its machinery, but that representation must be explicitly labeled a **projection**, not a canonical semantic entity. This is already exactly the declared intention of the current `ontology/` area: snapshots identify exact owner-qualified source state, crosswalks map durable local and external references, and projections materialize executable feature/expectation representations without owning the semantic taxonomy.

A useful rule is:

> **Copy bytes when reproducibility requires a frozen snapshot; never copy authority.**

A projection may therefore contain a normalized feature key, expected value, and scope needed for execution. But the authoritative feature definition and normative claim remain the Knowledge objects referenced by that projection.

### How Knowledge should reference Conformance without copying observations

Knowledge should store an **external evidence reference**, not an empirical result replica.

That reference should be sufficient to resolve:

```text
observation_id
evidence manifest / evidence-set identity where useful
association relation
scope qualification
research rationale
association revision
```

It should not copy `Observed Result`, runtime provenance, physical-attempt details, or a Conformance-generated pass/fail verdict into an editable Knowledge record.

For presentation, Knowledge tooling may cache resolved display data, but such cache fields must be explicitly non-authoritative and regenerable.

This architecture gives a precise answer to one of the user's core questions: **capabilities may expose computed backlinks to observations for navigation, but those backlinks are a view over association records, not canonical observation arrays stored on the capability.**

## Identity, versioning, discrepancy, and correction semantics

### Durable identities

STRling should use a **dual-identity pattern wherever an object both endures conceptually and changes historically**. DataCite's canonical-resource versus version-resource distinction and PROV's revision/specialization model provide useful structural precedent for this.

A recommended identity model is:

| Object | Durable identity | Immutable historical identity | Identity-breaking change |
|---|---|---|---|
| Feature/system/profile concept | Existing Knowledge stable ID | Snapshot/revision identity where required | Concept's meaning changes into a different concept. |
| Research claim | `claim_id` | `claim_revision_id` | Proposition value or material applicability scope changes. |
| Normative expectation | `expectation_id` | `expectation_revision_id` | Observable expected outcome or material target scope changes. |
| Knowledge snapshot | — | content-derived snapshot ID | Any included revision changes. |
| Conformance expectation projection | optional logical family | existing content-derived projection ID | Any identity-bearing projected content changes. |
| Vector | stable vector/family ID | vector revision ID | Test semantics change. |
| Observation | permanent observation ID | content identity/evidence identity as defined by Conformance | Never mutated; correction creates relations/new evidence. |
| Claim–evidence association | permanent association ID | association revision ID | A materially different relevance assertion should be a new association or superseding revision. |
| Discrepancy | durable case ID | immutable comparison/finding revisions | Underlying comparison inputs change; that is a new comparison even if grouped under the same case. |

The exact lexical form—dot-separated Knowledge IDs, UUID-based RCIDs, or another representation—is secondary to these invariants. The current Knowledge Program already requires stable IDs independent of Notion row identifiers, while Conformance already distinguishes UUID-like durable object namespaces from hash/content-derived revision namespaces.

### Time cannot be represented by one “last verified” date

The bridge needs at least four distinguishable temporal notions:

```text
effective scope time/version
    When is the proposition supposed to apply?
    e.g. runtime release 5.2 through 5.4

Knowledge assertion time
    When did STRling's Knowledge corpus adopt this claim/revision?

observation event/admission time
    When did the empirical event occur and when did it enter evidence?

reconciliation time
    When did STRling conclude that the observation supports, challenges,
    or is explained by a claim?
```

This is a **multi-temporal query requirement**, not a mandate for a particular temporal database.

It allows STRling to answer two questions that are otherwise easily confused:

> “What does STRling currently understand the documentation for runtime v5.2 to mean?”

and:

> “What did STRling understand that documentation to mean on March 1, before later release notes were discovered?”

Wikidata's retention of historical statements and DataCite's explicit version relations illustrate the utility of keeping current selection separate from historical identity.

### Source editions are historical evidence

Official documentation should not be treated as an eternally mutable URL.

Knowledge should identify the relevant **source edition or source state**, including enough version, release, locator, and retrieval/provenance information to establish what source state supported a historical claim. The current Knowledge constitution already says newer official documentation does not erase historically applicable documentation and that conflicting primary-source propositions should remain represented until scope or precedence resolves them.

This matters when an official documentation page is silently corrected. The correct model is not:

```text
C1 now points at altered page => history says C1 was always corrected
```

It is:

```text
Source edition S1 -> Claim C1
Source edition S2 -> Claim C2
C2 supersedes/refines C1
```

### Disagreement is an object, not a Boolean on either side

A discrepancy should never be stored as `Observation.failed = true` or `Claim.false = true`.

A discrepancy is a relationship between **specific immutable versions**:

```text
Discrepancy D
  compared expectation_revision ER7
  with observation O41
  under comparison_policy CP3
  outcome = mismatch
```

Whether D indicates an implementation defect, a documentation error, an under-specified profile, a flawed probe, or an incorrect expectation is a **later interpretation**.

The discrepancy model should therefore use orthogonal dimensions:

| Dimension | Recommended states |
|---|---|
| Comparison outcome | `match`, `mismatch`, `indeterminate`, `not_comparable` |
| Investigation lifecycle | `detected`, `qualified`, `open`, `explained`, `resolved`, `superseded` |
| Explanation/cause, when established | `implementation_deviation`, `expectation_scope_error`, `documentation_ambiguity`, `documentation_gap`, `profile_dimension_missing`, `probe_defect`, `evidence_invalidated`, `version_boundary`, `unknown` |

Do not encode the third dimension prematurely. An initial mismatch should normally begin with cause `unknown`.

ClinVar's treatment of conflicting submitted classifications provides the same structural lesson: conflict can be surfaced as an aggregate condition while the original assertions remain intact.

### Ambiguous documentation

Ambiguity should remain **inside Knowledge**, because ambiguity about what a source means is researched knowledge, not a runtime observation.

For example:

```text
Source S1 -> Claim A: "F behaves as X"
Source S2 -> Claim B: "F behaves as Y"
A conflictsWith B
Conflict group G = unresolved documentation ambiguity
```

Knowledge may decline to select either proposition as a normative expectation. Conformance may still execute exploratory probes. If an observation produces X, STRling may say:

```text
Observation O is consistent with Claim A
Observation O is inconsistent with Claim B
Documentation ambiguity remains unresolved
```

It must **not** say that O proves A is the normative truth. Runtime behavior can identify what an implementation did; it cannot determine which text was normatively controlling unless STRling has an independent source-authority rule.

Wikidata's ability to retain multiple values with qualifiers and sources rather than forcing a single fact is a useful precedent, though STRling should preserve a more explicit source-authority and scope model.

### When an observation exposes a missing profile dimension

This is one of the strongest tests of the architecture.

Suppose Knowledge currently has:

```text
C1: Profile P supports feature F.
```

Conformance executes apparently equivalent instances and finds:

```text
O1 under environment condition Z=A -> behavior X
O2 under environment condition Z=B -> behavior Y
```

The correct response is **not** to edit O1/O2, average the results, or simply mark C1 “partial.”

The lifecycle should be:

```text
O1 + O2
   │
   └──> empirical finding:
        behavior covaries with previously unmodeled dimension Z
             │
             ├──> discrepancy classified:
             │    profile_dimension_missing
             │
             └──> Knowledge research task
                     │
                     ├── establish what Z actually means
                     ├── add/refine profile dimension if justified
                     └── supersede broad C1 with scoped C2/C3
```

Once the missing dimension is understood, Conformance can define more exact future profiles. Existing observations remain valid descriptions of their original runs; whether they qualify for a particular certification or generalized comparison may change.

This is precisely why Conformance's current design defines execution profiles as behaviorally relevant component graphs rather than merely engine labels.

### When Conformance reveals that a Knowledge capability was scoped too broadly

A broad capability statement should be **superseded through proposition refinement**, not overwritten:

```text
Old:
C1 = P supports F.

New:
C2 = P supports F when mode M.
C3 = P does not support F when mode M is absent.

C2 refines/supersedes C1 for scope M.
C3 refines/supersedes C1 for scope not-M.
```

The observation that triggered the investigation stays unchanged. The old C1 remains queryable as “what STRling previously believed.” Any expectation E1 derived from C1 remains historically meaningful because previous campaigns actually compared against it.

### When later official documentation explains an old discrepancy

This is a particularly important historical case:

```text
t1:
  Claim C1 -> Expectation E1
  Observation O1
  comparison(E1,O1) = mismatch
  Discrepancy D = open

t2:
  newly discovered/released official source S2
  -> Claim C2 with narrower historical version boundary

  C2 supersedes/refines C1
  E2 derived from C2

  D resolution:
     explained_by C2
     resolution = expectation_scope_error / version_boundary

  O1 remains unchanged
  E1 remains historically queryable
  original mismatch remains a true statement about E1 versus O1
```

Current public views may no longer display “conflicting” if E2 is now the current applicable expectation, but an as-of query must show that the discrepancy existed and why it was later resolved.

This follows the provenance principle that a revision is a new entity related to the previous entity rather than a time-travel edit of the old one. W3C PROV explicitly models revision and invalidation as provenance relations.

### Correction and supersession rules

The governing rule should be:

> **Correct interpretations by replacement and linkage; correct evidence by invalidation/supersession and linkage; never correct either by rewriting the opposite authority.**

The resulting behavior is:

| Event | Action |
|---|---|
| Typo/non-semantic metadata correction to a Knowledge claim | New claim revision, same claim ID. |
| Material Knowledge proposition change | New claim ID or proposition revision that clearly supersedes the prior proposition; old proposition remains. |
| Better source discovered supporting same proposition | New claim revision; claim identity stays. |
| Observation shown to have invalid provenance/harness defect | Preserve observation/evidence; attach invalidation/correction and replacement evidence where available. |
| New observation disagrees with old observation | Preserve both; investigate profile, environment, nondeterminism, or implementation-version dimensions. |
| Derived discrepancy explanation changes | New discrepancy/finding revision; old analytical state remains reconstructable. |
| Public projection was wrong because its algorithm was wrong | Fix projection policy/version and regenerate; never rewrite Knowledge or observations to match the display. |

The current Conformance repository already reserves identities for `evidence-correction`, `finding`, `finding-revision`, `discrepancy`, and `reconciliation-set`, which provides the right primitives for this pattern.

## Information flows, derived views, completeness, and queries

### Knowledge to Conformance is a snapshot-and-projection flow

The forward flow should be strictly authority-preserving:

```text
Knowledge canonical objects
       │
       │ select exact qualified inputs
       ▼
Knowledge Snapshot K27
       │
       │ deterministic transform
       ▼
Conformance Expectation / Ontology Projection P91
       │
       ├── external Knowledge IDs retained
       ├── exact Knowledge revision IDs retained
       ├── snapshot identity retained
       └── projection-generator identity retained
       │
       ▼
Vector / campaign definitions
```

There should be no freehand re-authoring of Knowledge semantics inside Conformance. If Conformance needs a machine-friendly representation, it generates it.

This is already the declared role of the Conformance `ontology/snapshots`, `crosswalks`, and `projections` areas.

The ETL principle is:

> **Projection may denormalize representation; it may not transfer semantic authority.**

A frozen projection is authoritative only for the statement “this is what this campaign executed against.” It is not authoritative for the statement “this is what regex feature F canonically means.”

### Conformance to Knowledge is evidence feedback, not reverse synchronization

The reverse path is fundamentally different:

```text
Conformance Observation / Finding
             │
             ▼
     candidate evidence link
             │
             ▼
Knowledge research assessment
             │
      ┌──────┼──────────┐
      ▼      ▼          ▼
   supports challenges scope-gap
      │      │          │
      └──────┴──────────┘
             │
             ▼
 possibly new/revised Knowledge claim
```

A Conformance mismatch must therefore **open a research question**, not execute a database update that flips `SUPPORTED` to `UNSUPPORTED`.

This is consistent with the existing Regex Knowledge constitution, which says empirical evidence may confirm, challenge, or refine researched claims without silently replacing them.

A useful conceptual rule is:

```text
Observation -> suggestion/evidence -> research judgment -> Knowledge revision
```

never:

```text
Observation -> automatic overwrite of Knowledge
```

### Public Reference states must be calculated from independent axes

A public product should not maintain a single canonical “compatibility state.” The public model should retain at least three axes:

```text
Documented state
Observed state
Reconciliation state
```

For example:

| Axis | Example values |
|---|---|
| Documented | `supported`, `unsupported`, `partial`, `ambiguous`, `unknown`, `not_applicable` |
| Observed | `qualifying_evidence_present`, `mixed`, `no_qualifying_evidence`, `inconclusive`, `not_applicable` |
| Reconciliation | `consistent`, `conflicting`, `not_comparable`, `insufficient`, `unresolved` |

A product may then calculate convenience labels:

| Conditions | Derived display label |
|---|---|
| Documented known; no qualifying empirical evidence | **Documented** |
| Documentation unknown; sufficiently scoped empirical evidence exists | **Observed** |
| Documented and qualifying evidence agree | **Documented + observed** or **corroborated** |
| Documentation and eligible observations disagree | **Conflicting** |
| Documentation itself has unresolved competing interpretations | **Documented: ambiguous** |
| Neither authoritative documentation nor qualifying empirical evidence establishes the question | **Unknown** |
| Empirical runs disagree with one another | **Observed: mixed** rather than manufacturing a majority answer |

These labels must be understood as output of a function:

```text
PublicState =
    reconcile(
        KnowledgeSnapshot,
        ConformanceEvidenceSet,
        ReconciliationPolicyRevision,
        QueryScope,
        AsOfTime
    )
```

They are not canonical records to feed back into either source.

This aligns with the existing Reference research conclusion that public surfaces should remain generated projections with visible provenance and distinct normative/observed/conflicting states. MDN likewise renders compatibility tables from its separately maintained machine-readable BCD rather than making the rendered documentation table a separate compatibility authority.

There is one crucial restriction on the word **observed**: an individual passing probe is not automatically evidence that an entire feature is “supported.” Any feature-level empirical aggregation must declare the evidence-coverage policy by which a set of observations is judged sufficient. The BCD collector's own documentation notes that automatic feature detection is incomplete for some classes of browser behavior, illustrating why an execution result and a generalized compatibility conclusion must remain distinct.

### Materialized views are caches with lineage

Materialization is entirely compatible with the authority model provided every materialized record declares:

```text
knowledge_snapshot_id
conformance_evidence_set_id
reconciliation_policy_revision
projection/generator_revision
generated_at
query scope
```

A materialized row can then be deleted and rebuilt without epistemic loss.

The anti-corruption invariant is:

> **If deleting every public compatibility row would destroy information that cannot be reconstructed from canonical Knowledge, canonical Conformance evidence, and the declared reconciliation rules, the derived layer has become an illicit third authority.**

FAIR's insistence on qualified references and provenance supports precisely this kind of reconstructable research-data linkage.

### Completeness must remain multidimensional

Regex Knowledge completeness and Regex Conformance completeness answer different questions and therefore must never share a single denominator.

For Knowledge, at least two measures are useful:

\[
K_{\text{research}} =
\frac{\text{applicable research obligations assessed, including explicit gaps}}
{\text{applicable research obligations}}
\]

\[
K_{\text{resolved}} =
\frac{\text{applicable obligations with adequately sourced resolved claims}}
{\text{applicable research obligations}}
\]

The distinction matters because an explicit, well-researched “documentation does not establish this” can make research coverage complete while resolved knowledge remains incomplete. The current Knowledge Program already treats explicit gaps and unknowns as legitimate states and says completeness should be based on research facets rather than mere row presence.

Conformance should independently report measures such as:

\[
C_{\text{execution}} =
\frac{\text{applicable logical verification obligations with qualifying observations}}
{\text{applicable logical verification obligations}}
\]

and, if certification is required,

\[
C_{\text{certified}} =
\frac{\text{applicable obligations satisfied by admitted/certified evidence}}
{\text{applicable verification obligations}}
\]

The exact evidence-admission and certification mechanics belong to the prior Conformance methodology research, not this report.

A third **derived linkage metric** can be useful:

\[
B_{\text{verification}} =
\frac{\text{Knowledge expectations requiring empirical verification with qualifying evidence}}
{\text{Knowledge expectations requiring empirical verification}}
\]

But it must remain explicitly a bridge metric—not an “overall STRling completeness” score. Combining Knowledge and Conformance into one percentage would erase the fact that research completeness and empirical coverage fail for different reasons.

### Required cross-authority queries

The architecture should make the following questions first-class rather than expensive forensic exercises:

| Query | Required answer characteristics |
|---|---|
| “What did official sources say about feature F in profile P?” | Current or historical Knowledge claims, source editions, scope, ambiguity, supersession. |
| “What did exact profile P actually do?” | Conformance observations with exact vector/execution/evidence provenance, including invalidated evidence on request. |
| “What empirical evidence bears on claim C?” | Claim–evidence associations, not copied result fields. |
| “Which Knowledge claims was observation O intended to test?” | Vector target → expectation projection → exact Knowledge expectation/claim revisions. |
| “Which claims is O now considered relevant to?” | Current and historical post-hoc evidence associations. |
| “Where do normative expectations and eligible observations disagree?” | Exact expectation and observation versions plus comparison/discrepancy state. |
| “Why is this public row labeled conflicting?” | Full lineage from public projection through policy, Knowledge snapshot, observations, and discrepancy. |
| “What did STRling believe as of date T?” | Knowledge transaction-time selection plus historically applicable source/profile scope. |
| “What conflicts existed at T but are now resolved?” | Historical discrepancy revisions and resolution relations. |
| “Which current Knowledge claims have never been empirically tested?” | Knowledge evidence requirements left-joined against qualifying Conformance associations. |
| “Which observed behaviors have no corresponding researched claim?” | Observations/findings with no applicable Knowledge association—the strongest discovery queue for research gaps. |
| “What changed because of correction X?” | Dependency graph across claim revisions, expectation projections, discrepancies, derived findings, and materialized views. |

These queries require first-class relation records and exact revisions; naked foreign-key arrays and mutable summary flags are insufficient.

### Schema evolution rules

The Conformance repository already has a strong basis here: certified artifacts name exact schema revisions, mutable `latest` aliases are explicitly excluded from certification inputs, and scientific identity profiles are separately versioned.

The cross-system contract should add the following principles:

**Semantic identities outlive schemas.** A feature or claim's durable identity must not change merely because a serialization adds a field.

**Historical records retain the schema under which they were created.** A new schema does not reinterpret old objects in place.

**Identity-bearing changes are explicit.** If the identity projection itself changes, a new identity-profile revision is required; old IDs remain resolvable.

**Crosswalk changes are versioned.** Remapping a Knowledge concept to a Conformance projection is not a silent metadata edit. The existing `crosswalk-revision` identity class is therefore exactly the right primitive.

**Relation vocabulary changes are non-retroactive.** If `supports` later becomes too coarse and is replaced by more precise relations, historical `supports` assertions remain queryable under the old vocabulary.

**Projection-policy versions are preserved.** A public state generated under reconciliation policy R3 must remain explainable after R4 exists.

## Assessment of the current STRling designs and recommended refinements

### What is already architecturally right

The current STRling design is substantially closer to the recommended architecture than a greenfield review might suggest.

The Knowledge Program explicitly says the eventual corpus is generated from verified knowledge rather than from prose research reports, models canonical semantic features and versioned profiles separately from capabilities, distinguishes primary-source documentation from empirical observations, recognizes explicit unknowns, and makes stable IDs independent of Notion row IDs. It also assigns the Evidence & Verification database responsibility for sources, normalized researched claims, normative expectations, evidence requirements, and proposed probes while saying published runtime observations belong to Conformance.

The Conformance Foundation and repository independently establish the reciprocal boundary: exact machine-operational definitions live in Git; immutable empirical evidence lives in evidence infrastructure; warehouse outputs are regenerable; public products are downstream; and an observation is not transformed into a standards guarantee.

The strongest sign of architectural alignment is the actual Conformance namespace registry. It already anticipates:

`ontology-snapshot`, `ontology-projection`, `crosswalk-revision`, `expectation-projection`, `observation`, `observation-content`, `discrepancy`, `finding`, `finding-revision`, `reconciliation-set`, and `evidence-correction`.

In other words, STRling does **not** need a wholesale redesign. It needs to sharpen contracts around concepts already latent in the architecture.

### The biggest current risk is the surviving legacy empirical vocabulary in Knowledge

The present Regex Capabilities schema still contains fields such as `Empirical State` with values including `EXECUTED_PASS` and `EXECUTED_FAIL`, plus a generic `Confidence` field and evidence-status summaries.

The Evidence & Verification schema goes further: it currently has `Expected Result`, `Observed Result`, `Observed Runtime / Build`, an `Empirical State` enum, `Source Type = Empirical Observation`, `Verification Test`, `Conflicts With IDs`, and `Supersedes IDs`, alongside genuine source and claim fields.

The Knowledge Program text itself already recognizes the problem and declares the old empirical/pass/fail/confidence fields to be historical research metadata rather than current Conformance verdicts or canonical confidence.

**Recommendation:** do not delete those fields if they are needed for historical preservation, but **quarantine them as legacy and prohibit new authoritative writes**. They should be excluded from canonical JSON generation and public compatibility projections except as explicitly labeled historical metadata.

The long-term replacement should not be another scalar `Empirical State`. It should be:

```text
Evidence requirement / proposed probe
        +
external Conformance evidence reference
        +
qualified ClaimEvidenceAssociation
```

This is a genuinely missing structural concept, but it can live inside the **existing Evidence & Verification database**. It does not justify a seventh Regex Knowledge database.

### Claims need stronger identity/version semantics

The Evidence & Verification database already has a `Stable ID`, `Claim Kind`, subject/capability/profile/feature references, source metadata, conflict IDs, and supersession IDs.

What is not yet evident from the schema is a formal distinction between:

```text
logical claim ID
immutable claim revision ID
```

nor a similarly explicit:

```text
normative expectation ID
immutable expectation revision ID
```

**Recommendation:** introduce this semantic distinction even if its physical representation remains within the current database. A claim's stable ID must not double as the identifier of every historical state of that claim.

This is where Conformance's existing separation of durable UUID-like identities and hash/content-derived revision identities provides a good ecosystem-level pattern.

### Capability records should remain aggregation subjects, not evidence containers

The Capability database already represents profile × feature researched facts and links to evidence records. That is appropriate.

What should be avoided is evolving this into:

```text
Capability
    observation_ids = [O1,O2,O3,...]
    empirical_state = PASS
```

A capability can encompass many independently testable propositions—availability, compilation behavior, matching semantics, Unicode interaction, host API behavior, replacement semantics, constraints, and version transitions. Direct observation attachment to the aggregate capability loses which proposition the evidence actually bears upon.

**Recommendation:** observations should attach through **claim/expectation-level association objects**. Capability-level evidence counts or backlinks may be calculated as convenience views.

### “Conflict” needs typed meaning

The current Knowledge schemas expose `Conflicting Evidence`, `Verification Status = CONFLICTING`, and `Conflicts With IDs`.

That vocabulary is useful but presently broad enough to conflate:

```text
source contradicts source
claim contradicts claim
observation contradicts expectation
observation contradicts observation
```

These are epistemically different phenomena.

**Recommendation:** preserve a generic relationship if useful for search, but introduce typed conflict categories. At minimum, distinguish **documentation conflict**, **empirical inconsistency**, and **normative–empirical discrepancy**. The latter should not set the Knowledge claim's source-evidence status to “conflicting” as though the official documents contradicted one another.

### Conformance's projection architecture should be formalized before production evidence begins

The current repository README says no published observation is yet a certified Conformance result, and the repository tree currently contains scaffolding and identity/schema infrastructure rather than a production evidence corpus.

That is an advantage: the authority bridge can be locked down before empirical records accumulate.

The current `ontology/README` already specifies exact owner-qualified snapshots, crosswalks, and content-derived executable projections.

**Recommendation:** make the following mandatory properties of every expectation projection before the first production campaign:

```text
knowledge_owner
knowledge_snapshot_id
knowledge_expectation_id
knowledge_expectation_revision_id
source claim revision IDs
projection schema revision
projection-generator revision
projection content identity
```

No Knowledge concept should acquire an independent Conformance semantic identifier except where Conformance genuinely owns a different operational concept.

### A discrepancy identity should have immutable state history

The Conformance namespace registry has a durable `discrepancy` identity and content/revision identities for findings and reconciliation sets, but no obvious `discrepancy-revision` identity in the inspected namespace list.

Two designs are valid:

```text
A. discrepancy ID + explicit immutable discrepancy revisions
```

or:

```text
B. discrepancy ID +
   immutable comparison record +
   immutable finding/reconciliation records representing lifecycle changes
```

The second may already fit the existing model and would avoid adding another identity family. What must not happen is silently mutating the discrepancy's interpretation from “runtime deviation” to “documentation scope error” with no historical record.

### Public reconciliation policy deserves a versioned identity, not a truth table

The architecture will eventually need rules such as:

```text
Which observations are eligible?
What exact scope counts as comparable?
How much evidence is required before feature-level "observed" is shown?
How are mixed observations displayed?
How are superseded expectations selected?
What invalidation statuses exclude evidence by default?
```

Those rules are important, but their output is not a third authority. The rule set should itself be versioned so any generated public state is reproducible.

The existing Conformance registry's `reconciliation-set`, `metric-calculation`, and policy revision concepts offer plausible homes for machine-identifiable reconciliation inputs without turning their calculated output into canonical regex knowledge.

### Current-state investigation limitation

The Program page and database schemas were directly inspected, as were the current Conformance repository structure, identity registry, ontology projection documentation, and relevant Research Intelligence material. A further row-level Notion query of Evidence & Verification records could not run because the connected Notion query allowance had been exhausted. That row-level inspection can be retried after the allowance resets or made available through a higher Notion connector plan. Consequently, the current-design assessment above is a **schema- and governing-document assessment rather than an exhaustive audit of every Knowledge row**. This limitation does not affect the authority-model recommendation, but it means this report does not assert that every existing record already follows—or violates—the proposed claim-level rules.

## Anti-patterns, unresolved questions, and final answer

### Anti-patterns that would create duplicate truth

The following designs should be treated as architectural failures, not conveniences.

| Anti-pattern | Why it corrupts authority |
|---|---|
| `Capability.empirical_state = EXECUTED_PASS` as current canonical Knowledge | Collapses one or more Conformance comparisons into a researched capability fact. |
| Copying Conformance `Observed Result` into editable Knowledge rows | Produces two mutable homes for the same observation. |
| Conformance defining its own feature taxonomy instead of owner-qualified Knowledge refs | Creates competing semantic identities. |
| Embedding an expected result directly in a vector without an expectation-revision reference | Makes the test file an undocumented normative authority. |
| Treating an observation as a normative pass/fail object | Pass/fail only exists relative to a specific expectation and comparison policy. |
| Automatically flipping Knowledge `SUPPORTED` to `UNSUPPORTED` after a failing run | Allows empirical evidence to rewrite documentation rather than challenge it. |
| Editing an observation after discovering a harness problem | Destroys scientific history instead of invalidating evidence. |
| Rewriting a broad claim in place when a missing profile dimension is discovered | Makes old expectations and campaigns impossible to interpret historically. |
| Picking whichever official source agrees with empirical behavior | Uses observation to determine source authority. |
| Treating ambiguous documentation as `UNKNOWN` | Loses the fact that evidence exists but has multiple plausible interpretations. |
| Treating `UNKNOWN` as `UNSUPPORTED` | Converts absence of established knowledge into a negative proposition. |
| Storing `documented`, `observed`, or `conflicting` as canonical compatibility facts | Creates a third source of truth whose meaning depends on changing inputs. |
| One universal completeness percentage | Conceals whether a gap is research incompleteness, unresolved documentation, missing execution coverage, or missing evidence linkage. |
| Silent crosswalk remapping | Retroactively changes what historical Conformance artifacts meant. |
| Using `latest` Knowledge or schema state to interpret an old certified campaign | Breaks reproducibility by substituting present semantics for the campaign's actual inputs. |

These failures are exactly what qualified-statement, provenance, and version-aware systems are designed to avoid: PROV keeps derivation and revision explicit; Wikidata preserves qualified sourced statements; ClinVar exposes conflicting assertions; FAIR requires persistent identification and provenance; and DataCite uses explicit version relations.

### Recommended refinements in one view

The research does **not** support redesigning the six Regex Knowledge databases. It supports a relatively narrow set of architectural refinements:

| Refinement | Priority |
|---|---|
| Define claim ID versus immutable claim-revision ID. | Essential |
| Define normative expectation ID versus immutable expectation-revision ID. | Essential |
| Require owner-qualified, revision-qualified Knowledge refs in every Conformance expectation projection. | Essential |
| Introduce a qualified claim/expectation ↔ observation association concept in existing Evidence & Verification. | Essential |
| Quarantine legacy Knowledge empirical pass/fail/result fields from new canonical use. | Essential |
| Represent normative–empirical discrepancy separately from source-source conflict. | Essential |
| Define source-edition/historical-scope semantics explicitly. | Essential |
| Version reconciliation policies and public projection inputs. | Essential |
| Make public compatibility state reconstructable and disposable. | Essential |
| Keep separate Knowledge research, Knowledge resolved, Conformance verification, and bridge-verification coverage metrics. | Essential |
| Decide whether discrepancy history uses explicit discrepancy revisions or immutable finding/reconciliation events. | Design choice |
| Add a claim-family/question key if query and conflict grouping warrant it. | Useful, not required |
| Expose computed capability-level observation backlinks for navigation. | Optional derived convenience |

### Unresolved implementation questions

Several questions legitimately remain below the architecture layer.

**Claim-family identity.** STRling needs to decide whether a separate stable “question” or assertion-slot identity is worth materializing, or whether subject + predicate + scope can be calculated as a grouping key. The architecture requires distinct proposition identities but does not require a stored claim-family entity.

**Revision identity mechanics in Knowledge.** Conformance already has a natural UUID/content-derived split. Knowledge currently uses deterministic dot-separated stable IDs. The exact mechanism for immutable Knowledge revision identity—content hash, allocated revision ID, snapshot-contained identity, or a combination—remains an implementation choice. What is mandatory is that immutable historical revisions are addressable.

**Source snapshot policy.** Official documentation is not uniformly version-addressable. STRling must decide when a source URL plus retrieval date is sufficient and when the source content itself or an archival digest must be retained to make historical claims reproducible. FAIR and PROV establish the provenance need but do not determine this domain policy.

**Post-hoc association authority.** A predeclared vector target is clearly Conformance operational metadata. A later judgment that an observation also bears on an unrelated Knowledge claim is a research interpretation and should therefore live under Knowledge authority. The exact workflow for proposing, reviewing, and accepting such associations remains to be established.

**Observed feature-level aggregation.** STRling still needs a policy for when a set of exact observations is sufficient to support a public feature-level phrase such as “observed supported.” The architecture strongly recommends avoiding such generalization unless a defined evidence requirement has been satisfied; the threshold itself belongs to future domain policy.

**Discrepancy revision representation.** The current `discrepancy`, `finding-revision`, and `reconciliation-set` primitives appear sufficient, but the first implemented lifecycle should determine whether an additional explicit discrepancy-revision type would materially improve historical querying.

**Historical projection retention.** Derived Reference views do not need permanent truth status, but STRling must decide whether important released public snapshots should be archived for citation even though they remain reproducible derivatives.

**Cross-system resolver contract.** Stable IDs need a durable machine-level mechanism for resolving an owner, object class, logical ID, revision, and snapshot. The current Conformance namespace and crosswalk architecture provides the ingredients; the exact URI/URN/JSON representation is intentionally outside this report.

### The resulting epistemic contract

The relationship can be reduced to twelve rules:

1. **Sources are not claims.**
2. **Claims are not expectations.**
3. **Expectations are not probes.**
4. **Probes are not observations.**
5. **Observations are not pass/fail judgments.**
6. **Comparisons are not corrections.**
7. **Discrepancies are not corruption.**
8. **Findings do not silently replace their evidence.**
9. **New Knowledge revisions do not rewrite historical expectations.**
10. **New observations do not rewrite documented meaning.**
11. **Public compatibility states are functions over versioned inputs, not stored truth.**
12. **Every cross-authority statement must be reconstructable from typed identities, exact revisions, scope, provenance, and a declared relation.**

The first six rules are already strongly aligned with STRling's present Foundation and Research Intelligence material. The remaining rules make that epistemic separation durable under correction, version change, public projection, and long-term corpus growth.

### Final answer

STRling can know both **what a regex system is documented to mean** and **what it was empirically observed to do** by refusing to make either fact a property of the other.

A documented fact should exist as an independently identified, versioned, source-backed Knowledge claim. When necessary, that claim should generate a separately identified normative expectation. Conformance should consume an immutable projection of that expectation while retaining its Knowledge IDs and snapshot lineage. A controlled execution should generate an independently identified immutable observation whose scientific identity does not depend on whether it agrees with the expectation.

The relationship between those objects should itself be first-class:

```text
official source
     │
     ▼
research claim ──derives──> normative expectation
                                 │
                       immutable projection
                                 │
                                 ▼
                              probe
                                 │
                                 ▼
                            observation
                                 │
           ┌─────────────────────┴────────────────────┐
           ▼                                          ▼
     comparison / discrepancy                  evidence association
           │                                          │
           └─────────────────────┬────────────────────┘
                                 ▼
                         researched finding
                                 │
                       may motivate revision
                                 │
              ┌──────────────────┴───────────────────┐
              ▼                                      ▼
        Knowledge revision                    Conformance correction
        (if interpretation                    (if evidence was
         or scope changes)                     scientifically invalid)

              Neither revision rewrites the other side.
```

The deepest principle is therefore not merely “keep two databases separate.” It is:

> **Keep propositions separate by epistemic role, give every proposition and observation durable historical identity, make every cross-boundary relationship qualified and traceable, and allow reconciliation only to produce derived explanations—not replacement truth.**

With that model, an apparent contradiction such as “the documentation says X, but runtime P version V was observed doing Y” becomes a perfectly valid STRling knowledge state rather than a database inconsistency. STRling can preserve X as researched documentary evidence, Y as empirical evidence, D as the discrepancy between them, and any later explanation as a fourth, explicitly derived and historically situated object. That is how disagreement becomes evidence instead of corruption.

The workflow or present stage is complete.