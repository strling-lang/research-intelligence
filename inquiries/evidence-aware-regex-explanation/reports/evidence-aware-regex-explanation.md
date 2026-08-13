# Trustworthy Regex Explanations for STRling: A Semantic and Epistemic Contract

Role: Research report
Origin: OpenAI deep-research session commissioned for STRling Research Intelligence
Generated: 2026-08-12
Imported: 2026-08-12
Source verification: Partially verified
Last reviewed: 2026-08-12
Current status: Active input

## Source verification gaps

The imported report contained opaque research-session citation markers without a durable marker-to-source table. The markers were removed; unresolved claim-level citations, external comparisons, and proposed models require verification. Current-state claims were checked against the downstream authorities linked by the active inquiry.

## Executive conclusion and governing contract

The central finding is that STRling should treat an explanation as **a scoped, evidence-bearing claim**, not as prose generated after an analyzer emits a result. The human-readable sentence should be a rendering of a structured object that records what is being claimed, under which regex semantics and operation, what evidence justifies the claim, whether the evidence is complete, what causal strength is warranted, and where the conclusion stops. This is consistent with the direction already established inside Research Intelligence: its Regex Analysis & Explanation program explicitly asks how findings should carry evidence, uncertainty, witnesses, and remediation, while distinguishing sound, complete, useful, and heuristic analyses.

That distinction fits STRling's architecture particularly well. STRling already separates Parse → target-independent IR → Emit, treats its grammar and semantics as normative artifacts, and puts parser diagnostics behind a binding-independent CLI/LSP normalization boundary. The architecture therefore has natural places to attach source identity, semantic-node identity, and target-lowering provenance rather than reconstructing explanations later from target regex text. The current parse-error object, however, is much thinner: it principally carries a message, one position, source text, an optional hint, and an LSP diagnostic generated from those fields. The research implication is not that this simple parse-error representation is wrong; it is that **diagnostics and deep explanations should be distinct contracts**, linked rather than collapsed into one message string.

STRling's existing research already demonstrates why this discipline is necessary. The safety report argues that a regex cannot responsibly be labeled simply “safe” or “unsafe”: conclusions depend on pattern, operation, target engine and version, configuration, resource limits, and deployment conditions. The equivalence report similarly concludes that an equivalence claim is meaningful only after fixing the semantic profile, the observable being preserved, and the input domain, and that one concrete counterexample can refute a universal claim while failure to find one proves nothing unless the search was complete. Those are not merely requirements on analysis algorithms. They are requirements on **what an explanation is allowed to say**.

The same separation is supported by adjacent developer-tooling practice. PostgreSQL deliberately distinguishes `EXPLAIN`, which exposes planner estimates, from `EXPLAIN ANALYZE`, which actually executes a query and adds observed values; estimates and observations remain visibly different evidence classes. Research on static-analysis explanation found that exposing selected analysis rules through “rule graphs” improved users' understanding relative to simple warning traces and helped them identify causes of false positives. STRling's own Regex Lab research reaches essentially the same architectural conclusion in domain language: **Inspect predicts and explains; Run observes; Compare relates; Compose derives; controlled conformance evidence certifies.**

The recommended governing rule is therefore:

> **Every STRling explanation should be able to answer six questions independently: what is the claim; what is its semantic scope; what evidence supports it; how complete is that evidence; what causal strength follows from it; and what remains unknown?**

That produces several important consequences.

| Contract rule | What STRling should mean |
|---|---|
| **Scope before conclusion** | A conclusion belongs to a semantic profile/version, operation, flags/configuration, and—where relevant—input or input domain. |
| **Evidence retains its type** | Normative documentation, static inference, proof, runtime observation, trace, witness, and heuristic evidence must not become interchangeable merely because they agree. |
| **Location is not causation** | A source range identifies where relevant semantics arise. It does not by itself establish that the source text is the root cause of an outcome. |
| **Trace is not explanation** | An engine trace can document one implementation's search behavior. It becomes a semantic explanation only through an explicit mapping and a justified scope. |
| **No-match requires universal care** | Explaining one failed candidate path is not equivalent to explaining why the complete operation has no match. |
| **“Minimal” requires a metric** | Shortest witness, subset-minimal blocker, cardinality-minimal reason, earliest failure, and minimum edit distance are different properties. |
| **Severity is not certainty** | Impact/urgency, epistemic confidence, proof status, causal strength, and repair applicability are separate dimensions. |
| **Repair is a new claim** | “Change X to Y” requires its own goal, preconditions, predicted effect, preservation claim, and supporting verification. |

The provenance research in STRling's conformance work strongly supports keeping evidence classes separate: it distinguishes source propositions, researched claims, expectations, probes, executions, raw observations, normalized observations, derived findings, inferences, corrections, and certification rather than allowing one kind of evidence to silently turn into another. That principle should become the foundation of the explanation system as well.

**Recommendation:** STRling should define explanation as a semantic service independent of presentation. CLI text, LSP messages, Inspect results, Compare findings, and Reference material should all render from the same explanation records, but they should be free to reveal different depths. This avoids a dangerous architecture in which each surface independently converts analyzer facts into potentially inconsistent natural-language causality. This recommendation follows directly from STRling's existing centralized parser/diagnostic architecture and its deterministic emitter model.

## Explanation taxonomy and the diagnostic boundary

A useful taxonomy begins with the **question a developer is asking**, because different questions require different evidence. The same AST or runtime trace cannot legitimately answer all of them.

| Developer question | Explanation class | Minimum evidence for a strong answer | Strongest defensible wording |
|---|---|---|---|
| “What does this construct mean?” | **Construct semantics** | Semantic node + versioned normative semantic proposition + active profile/options | “Under profile P, this construct means …” |
| “What does this complete regex do?” | **Compositional semantics** | Semantic tree/IR + operation + profile + assumptions | “For operation O under P, this pattern recognizes/selects …” |
| “Why did this input match?” | **Successful derivation** | Input, selected match/span, semantic derivation or validated runtime observation, selection policy | “This input matched because these obligations were satisfied …” within declared scope |
| “Which part matched?” | **Alignment/provenance** | Node-to-input span mapping and capture observations | “Node N consumed/asserted this portion …” |
| “Why is this capture empty?” | **Capture-state explanation** | Capture node, selected derivation, participation state and span | “The group participated and captured the empty span at …” |
| “Why is this capture unmatched?” | **Capture nonparticipation** | Selected alternative/repetition/assertion semantics proving nonparticipation | “The group did not participate in the selected match …” |
| “Why did it not match?” | **Rejection/contrastive explanation** | Candidate scope + failed semantic obligations; global claim requires coverage of all candidates | “At this candidate …”; or, only with complete evidence, “No candidate can succeed because …” |
| “Why did this target behave differently?” | **Cross-profile contrast** | Two exact profiles, held-constant operation/input, paired observations or semantic derivations, divergent semantic node | “The targets differ on X because their profiles assign different semantics to N …” |
| “Why is it not portable?” | **Capability/semantic portability** | Declared target set + versioned capability/semantic knowledge + implicated semantic nodes | “This construct is unsupported/divergent on target P …” |
| “Why is this a safety risk?” | **Risk-chain explanation** | Static finding + modeled complexity/risk relation + target/operation assumptions; exploitability needs environment evidence | “Analysis establishes/suggests risk R under assumptions A …” |
| “Why is this rewrite safe?” | **Preservation explanation** | Named preserved relation, profiles, operation/observable, domain, proof/check result | “The rewrite is proven to preserve O over D under P …” |
| “Why can't STRling prove this?” | **Analysis-limit explanation** | Proof attempt/status + unsupported construct/resource bound/solver result/completeness boundary | “The result is unresolved because …”; never “probably equivalent” merely from proof failure |
| “What input demonstrates the difference?” | **Witness/counterexample** | Concrete input + paired expected/actual observations + validation + scope | “Input w refutes relation R under profiles P₁/P₂ …” |
| “What should I change?” | **Remediation/repair** | Goal + edit + applicability + preconditions + post-edit verification/preservation evidence | “This change achieves G under conditions C …” |

The first important distinction is therefore **diagnostic versus explanation**.

A **diagnostic** is an attention-management object. It says that something at a location deserves developer consideration: an error, warning, informational finding, compatibility issue, or actionable hint. Its primary responsibilities are prioritization, stable identity, location, concise summary, and policy consequences such as whether compilation may continue.

An **explanation** is a justification object. It answers why a proposition is believed, what evidence supports it, how the evidence relates to the proposition, and what limitations apply. An explanation may exist without any diagnostic at all: Reference can explain `\b`; Inspect can explain capture behavior in a perfectly valid pattern; Compare can explain a target difference that is intentional rather than erroneous.

This separation matters because human-factors research repeatedly finds that warning presentation is part of static-analysis usefulness. Interviews reported by Johnson et al. identified false positives and the way warnings are presented as barriers to adoption, with the authors arguing for more interactive support for fixing reported defects. A Microsoft multi-method study likewise found poorly expressed warning messages among adoption barriers and emphasized workflow and reporting requirements as part of useful program analysis, not incidental interface polish. Security-oriented static-analysis user studies similarly found workflow and interface issues substantial enough to contribute to tool abandonment.

STRling should consequently **not put all semantic information into diagnostic prose**. The current parse diagnostic can remain compact, but a future rich diagnostic should contain a stable explanation reference plus a small summary of certainty. STRling's semantics already define stable classes such as syntax errors, unsupported features, engine incompatibility, ambiguous semantics, and ReDoS risk, along with source ranges and severity classes. Those codes are a more appropriate durable identity than English prose. In particular, the current Python implementation derives an LSP `code` mechanically from the message text; that is acceptable as an implementation convenience today but is too fragile for long-lived suppression, analytics, cross-surface linking, or versioned explanation semantics.

The second distinction is **meaning versus outcome**. A semantic explanation such as “`(?=x)` asserts `x` without consuming it” comes from the language/profile definition. “On this input, that assertion succeeded at offset 7” is an input-specific semantic or runtime fact. “The engine first attempted three other paths and then retried the assertion” is implementation behavior. All three may be true, but they answer different questions.

The third distinction is **correctness versus usefulness**. Type-error research is instructive here. Conventional type checking often identifies the point at which checking first fails, but that location may not be the actual root cause. SMT-based type-error localization therefore considers alternative error sources and applies an explicit usefulness criterion, separating the heuristic notion of “most useful error” from the underlying satisfiability problem. STRling should adopt the same intellectual discipline: **“first failure,” “smallest explanation,” “most actionable explanation,” and “cause” are not synonyms.**

The fourth distinction is **static prediction versus observation**. PostgreSQL's `EXPLAIN`/`EXPLAIN ANALYZE` split is a particularly clean precedent because it preserves estimates and actual execution measurements side by side rather than allowing execution to retroactively reclassify an estimate. STRling's own Lab model already embodies the same separation between Inspect and Run. Thus a static portability result can be supported by semantic knowledge; a runtime result can show what a particular engine instance actually did; neither should silently be rendered as the other.

This yields a recommended diagnostic contract:

> **A diagnostic says what requires attention. An explanation says why the underlying proposition is justified. An observation says what happened. A proof says what follows universally within a declared model/domain. A remediation says what change is proposed and what separate evidence supports that change.**

## Causality, why-match, and why-no-match

The most dangerous vocabulary in developer diagnostics is causal vocabulary. “Because,” “caused by,” “the reason,” and “root cause” imply considerably more than “this node was involved” or “this was the first failure our implementation encountered.”

Database provenance research provides a useful formal warning. Meliou et al. developed causality specifically because ordinary provenance and lineage do not automatically provide the contrastive causal explanation users are asking for; their framework distinguishes explanations of answers and non-answers and allows causes to be ranked by responsibility. In debugging, the Whyline similarly made “why did?” and “why didn't?” explicit questions and used program-analysis machinery such as static/dynamic slicing and reachability reasoning to answer them rather than merely exposing an execution transcript. Rule-graph research goes further in the static-analysis setting: developers understood warnings more accurately when shown relevant analysis-rule relationships than when shown simple warning traces.

For STRling, a causal explanation should therefore have an explicit **contrast**. “Why did `abc` match?” is incomplete until the scope is fixed: instead of failing at the selected start? instead of another branch being selected? instead of capturing something different? “Why did JavaScript differ from PCRE2?” requires an exact version/profile and a controlled statement of what remained constant. STRling's existing Compare research already requires precisely that: state what varies, what is held constant, the kind of difference being examined, and the evidence scope.

A causal-strength vocabulary should distinguish at least four cases:

| Causal strength | Meaning | Appropriate wording |
|---|---|---|
| **Decisive** | Evidence establishes that the identified condition determines the scoped result under the declared semantics. | “The match fails because assertion A is false for every candidate.” |
| **One sufficient reason** | This condition alone suffices to produce the scoped result, but alternatives may also suffice. | “One sufficient reason for rejection is …” |
| **Contributing / dependency** | The result depends on the condition in the observed/derived path, without showing it alone is decisive. | “This outcome depends on capture C because …” |
| **Candidate / possible** | Evidence makes the condition plausible but does not exclude other explanations. | “One possible cause is …” |

STRling should reserve naked **“because”** for the first two categories and qualify the second when multiple sufficient explanations exist. A ranking heuristic should never silently upgrade “candidate” into “cause.”

**Why-match** is the easier side of the problem because a successful regex outcome normally has at least one successful semantic derivation. Under a declared operation and profile, STRling can explain the selected match as a tree or DAG of satisfied semantic obligations: literal/class consumption, zero-width assertions, quantifier iterations, branch selection, captures, backreference comparisons, anchors, and operation-level match-selection rules. STRling already defines leftmost-first behavior, greediness, assertions, captures, and target-sensitive semantics in its normative semantics, so the explanation should map those semantic concepts back to AST/IR nodes and input intervals.

For example, a why-match record should conceptually preserve:

`input → selected candidate start → selected semantic branch → obligations satisfied → selected whole-match span → capture participation/spans`.

That is different from saying:

`engine called state X → pushed backtracking frame Y → popped frame Z`.

The latter may be useful debugging telemetry. It is not, without additional reasoning, the semantic justification for the match. Two conforming implementations can arrive at the same leftmost-first result using very different algorithms, and STRling's own safety research explicitly warns that real engines may memoize, optimize, auto-possessify, JIT, or switch matching strategies in ways that differ from an abstract search model.

A good why-match answer should therefore say, conceptually:

> **Observed/derived outcome:** input positions 5–12 form the selected match.
> **Semantic reason:** branch B satisfied the sequence of obligations N₁…N₅; the greedy repetition consumed positions 6–10 and then retained that extent because the following obligation also succeeded.
> **Selection reason:** under profile P's leftmost-first policy, this successful candidate precedes alternatives that could otherwise match.
> **Evidence:** semantic replay / runtime observation / both.
> **Limit:** this explains the selected result for this operation and input, not the engine's internal execution cost.

“Which part matched?” should use the same derivation but answer a narrower provenance question. Nodes that **consume** input should be distinguished from nodes that **assert** a property at a position. Otherwise users will reasonably misunderstand zero-width anchors and lookarounds as having “matched” characters they only constrained.

Capture explanation deserves a particularly strict state model. At minimum STRling should distinguish:

| Capture status | Semantic meaning |
|---|---|
| **Participated, non-empty** | The group was part of the selected derivation and captured a non-empty span. |
| **Participated, empty** | The group was part of the selected derivation but its selected span has zero length. |
| **Did not participate** | The selected derivation did not execute/select that capture in a way that produces a value. |
| **Unavailable/indeterminate** | The current profile, observation source, or analysis cannot establish the capture state. |

Rendering both the second and third cases as “empty” destroys semantic information. STRling's equivalence research already treats capture participation and capture spans as observables stronger than mere language acceptance.

**Why-no-match is fundamentally harder.** For a search-like operation, “no match” is not merely one failed path. It means that **every semantic candidate allowed by the operation fails**. Informally:

\[
\mathrm{NoMatch}(r,P,O,x)
\iff
\forall c \in \mathrm{Candidates}(r,P,O,x),\;
\mathrm{Reject}(c)
\]

where the candidate set is defined by the regex semantics and operation, not by whichever internal states a particular backtracking engine happened to visit.

This distinction should drive the entire `whyNoMatch` contract.

A useful exact abstraction is a **rejection cover**. Each reported blocker has a scope—the candidate starts, branches, or semantic configurations it rules out. A global no-match explanation is complete only when the union of the reported blocker scopes covers every semantically relevant candidate. This allows STRling to report a concise global explanation without pretending that there must be one unique “first failing character.”

The resulting explanation levels should be explicit:

| `whyNoMatch` level | What has been established | What STRling may say |
|---|---|---|
| **Exact global** | All semantic candidates are covered by valid rejection evidence under the profile/operation. | “The input cannot match because …”; completeness can be claimed. |
| **Exact path-specific** | One specified candidate/start/branch has a proven failing obligation. | “At candidate start 4, this branch fails because …” |
| **Minimal blocker / cover** | Exact rejection evidence has additionally been minimized under a declared metric. | “This is subset-minimal/cardinality-minimal/shortest under metric M.” |
| **Heuristic diagnosis** | Analysis ranks plausible blockers or near misses but lacks complete rejection reasoning. | “A likely/supported blocker is …” only when that ranking is justified; otherwise “one possible blocker.” |
| **Unresolved** | Current evidence cannot responsibly identify a useful blocker or establish completeness. | “No match was observed/established, but STRling cannot determine a reliable explanation because …” |

Work on explaining failures of program analyses shows that it is possible in suitable analysis structures to derive necessary and sufficient reasons and that small reasons can be useful interactively, but that is a property of the explanation method and model—not something that should be assumed about every warning or trace. STRling should expose such strength when available while retaining weaker statuses elsewhere.

The specific candidate outputs in the research brief should be classified as follows:

| Candidate `whyNoMatch` output | Legitimate interpretation | Main risk |
|---|---|---|
| **Earliest failing semantic obligation** | Exact for a declared semantic candidate and ordering when derived correctly. | Calling it *the* cause of global failure when another start/branch failed differently. |
| **Expected character/class** | Exact local statement: at position p, obligation N requires a member of set S. | Suggesting that changing this character alone will make the whole regex match. |
| **Failed assertion** | Exact if the assertion's truth at the specified position is known. | Treating a failure in one candidate as decisive for every candidate. |
| **Alternative exhaustion** | Strong global evidence when every semantic alternative under the relevant candidate is demonstrably rejected. | Confusing engine backtracking exhaustion with semantic completeness. |
| **Capture/backreference dependency** | Strong when the semantic constraint tying a backreference to capture participation/value is established. | Presenting an inferred dependency from partial traces as proof. |
| **Mismatch witness** | Concrete evidence of a particular contradiction or differential result. | Assuming one local contradiction is a full no-match certificate. |
| **Edit suggestion** | A proposed repair intended to alter the outcome. | Treating a repair proposal as an explanation of the original failure. |
| **Nearest accepted string** | Optimization result under an explicit distance metric and semantic scope. | Presenting “nearest” as “what you intended.” |

The **earliest failure** is thus useful but must be carefully named. Type-error localization research provides the relevant analogy: the location where an algorithm detects inconsistency first may be a poor root-cause explanation, and usefulness ranking is a separate problem. STRling should label this output “first failing obligation for this candidate,” not “reason for no match,” unless completeness evidence upgrades it.

“Expected character/class” should likewise be constrained. For pattern `ab?c`, encountering `x` after `a` does not necessarily mean “expected `b`”; `b` may be optional and the relevant decisive expectation might instead be `c`. Explanations must arise from semantic obligations after nullable/alternative possibilities are accounted for, not from a token-by-token cursor metaphor.

Assertions need an analogous distinction. “Positive lookahead `(?=foo)` failed at input position 8 because `foo` does not match there” is an exact local explanation. It is a global no-match explanation only if STRling additionally establishes that every candidate reaching a possible overall match requires that assertion at a position where it fails.

Backreferences require still more discipline. A useful explanation may say that a selected candidate requires the forthcoming subject text to equal capture `name`, show the capture's value/span and the conflicting input, and link both to the semantic backreference node. But if STRling's analysis cannot fully model the relevant backreference behavior, it should downgrade the finding to path-specific or unresolved rather than filling the gap with a plausible narrative. STRling's equivalence research already identifies backreferences as an important boundary where general proof obligations become much harder or undecidable.

A “nearest accepted string” can be highly useful as a debugging aid but is not intrinsically causal. “Nearest” is undefined until STRling fixes an edit model: insert/delete/substitute cost, Unicode unit, normalization policy, whether edits to the pattern are allowed, whether start position matters, and how tied optima are handled. An exact nearest-string explanation additionally requires evidence that a global optimum was found. Otherwise it should be called a **nearby accepted candidate**, not the nearest one.

The design should thus make `whyNoMatch` deliberately two-layered:

> **Summary layer:** the most useful truthful blocker, clearly marked global/path-specific/heuristic.
> **Evidence layer:** candidate scope, semantic obligation, input location, completeness evidence, alternatives ruled out, minimality criterion if any, and unresolved regions.

That is substantially more trustworthy than either “expected X at position Y” unconditionally or dumping a backtracking trace and asking the developer to infer semantics.

## Witnesses, uncertainty, provenance, and the structured explanation schema

Witnesses and counterexamples are unusually valuable because they turn abstract claims into concrete discriminating cases, but their epistemic meaning must remain precise.

For equivalence or portability, a concrete input with different observable behavior is a powerful **refutation**. STRling's existing equivalence report correctly notes the asymmetry: a single valid counterexample refutes universal equivalence, whereas failure to discover a counterexample establishes equivalence only when the search procedure was complete for the declared relation, profile, and domain. This distinction should be visible every time Compare or a rewrite verifier presents a witness.

A witness record should therefore contain at least the input, both compared subjects/profiles, operation, observable being compared, each resulting observation, validation state, and a minimality criterion if one was requested. “`abc` is a counterexample” is insufficient if the actual distinction is, for example, capture participation under first-match search on PCRE2 10.x versus ECMAScript. The counterexample refutes only the declared relation.

Counterexample-guided verification adds another caution: an abstract counterexample may be **spurious** if it exists in the abstraction but cannot be realized in the concrete system; CEGAR-style workflows explicitly check candidate counterexamples and refine an abstraction when they are spurious. STRling should therefore distinguish at least:

| Witness state | User-visible meaning |
|---|---|
| **Validated concrete witness** | Reproduces the claimed difference in the declared concrete semantics/runtime evidence. |
| **Semantic-model witness** | Valid in STRling's declared formal semantic model; concrete target validation may or may not have occurred. |
| **Abstract witness candidate** | Produced by an over-approximation or abstraction and still needs concretization/validation. |
| **Heuristic candidate** | Generated to help investigation; not evidence of the universal claim. |

SMT evidence needs comparable discipline. Z3 explicitly returns `sat`, `unsat`, or `unknown`; after relevant checks it can expose models, proofs when enabled, unsatisfiable cores, and a reason for `unknown`. A model demonstrates satisfiability of the **encoded constraints**. It becomes a regex witness only when STRling can justify the mapping between that encoding and the relevant regex semantics. An unsat core identifies a sufficient conflicting subset of tracked constraints but should not automatically be labeled “the minimal reason”: Z3's own Programming Z3 documentation states that cores are not minimal by default, and minimization support has conditions.

This suggests four independent status axes rather than one overloaded “confidence” field.

**Epistemic status** should answer, “How strongly is the proposition itself supported?”

| Status | Contract |
|---|---|
| **Established** | The proposition follows from proof/complete analysis under its declared scope, or is a direct observation explicitly scoped to that execution. The rendering must say which. |
| **Supported** | Evidence materially favors the proposition but does not entail it or exclude relevant alternatives. |
| **Possible** | The proposition is consistent with available evidence and has some identified basis, but competing explanations remain. |
| **Unresolved** | Available analysis cannot responsibly select or establish an explanation. A reason should be given where known. |

STRling should use the word **“likely”** only when the ranking or probability has an empirically meaningful calibration. Without calibration, “supported” is more honest than pseudo-probabilistic language. Human-factors work makes this important because the goal is calibrated reliance, not merely persuasive messages: false positives and confusing presentation directly affect whether developers use static-analysis results.

**Proof/check status** should independently answer what verification activity occurred:

`proven`, `refuted`, `observed`, `bounded-checked`, `inconclusive`, `not-attempted`, `not-applicable`.

A runtime observation should never become `proven` merely because it agrees with static analysis. STRling's conformance evidence methodology explicitly argues that observations, derived findings, normative expectations, and inference must retain their evidence types.

**Causal strength** should use the decisive/sufficient/contributing/candidate distinctions described above.

**Remediation applicability** should be independent yet again. Rust provides a strong industry precedent: compiler suggestions carry an `Applicability` classification such as `MachineApplicable`, `MaybeIncorrect`, `HasPlaceholders`, or `Unspecified`, and tools use that classification to decide whether automation is appropriate. STRling needs a regex-specific analogue, extended with explicit semantic-preservation evidence because a syntactically valid regex edit can easily change accepted language, match selection, or captures.

“Why can't STRling prove this?” should be a first-class explanation rather than a generic “unknown.” The record should state the limiting condition when known:

> unsupported semantic feature; analysis soundness envelope exceeded; target semantics insufficiently specified; incomplete knowledge profile; finite resource budget exhausted; solver returned unknown; bounded check completed but domain remains larger; runtime observation available but no formal relation established; or conflicting evidence remains unresolved.

Z3's explicit `reason_unknown` facility is a useful precedent for treating inability to decide as information rather than failure to produce a user experience.

STRling also has a concrete internal reason to preserve exact profile/version in every explanation. Its equivalence research found semantic-profile drift between checked-in STRling semantics and current engine behavior for lookbehind, demonstrating that “PCRE2” or “JavaScript” alone is not a durable semantic identity. The normative semantics themselves already expose many target-sensitive dimensions—Unicode shorthand behavior, newline behavior, free-spacing support, assertions, extensions, and compatibility diagnostics. An explanation whose evidence says only `target: "pcre2"` is therefore epistemically incomplete.

The same applies to operation. Safety research notes that search, anchored matching, iteration, replacement, and other operations can have materially different computational behavior. Equivalence research similarly distinguishes language acceptance, selected span, captures, iteration, and complete operation behavior. `operation` is therefore part of an explanation's **claim scope**, not optional display metadata.

At the conceptual level, the recommended explanation object is:

```text
Explanation
    identity
        schemaVersion
        explanationId
        ruleOrQuestionKind
        explanationKind

    subject
        subjectId
        sourceRanges[]
        semanticNodeIds[]
        derivedArtifactNodeIds[]

    context
        semanticProfile
        targetFamily
        targetVersion
        configuration / flags
        Unicode / newline / index conventions
        operation
        input? / inputDomain?
        comparisonBaseline?
        assumptions[]

    claim
        proposition
        scope
        epistemicStatus
        proofStatus
        causalStrength

    reasoning
        obligations[]
        relationships[]
        candidateScope
        completeness
        minimalityCriterion?
        alternativesConsidered[]
        unresolvedRegions[]

    evidence[]
        normativeSource
        staticAnalysis
        proofOrCertificate
        runtimeObservation
        trace
        witnessOrCounterexample
        sourceMapping

    witnesses[]
        input
        expectedObservation
        actualObservation
        validationState
        minimalityCriterion?

    uncertainty
        knownLimits[]
        unknownReason?
        competingExplanations[]
        unsupportedDimensions[]

    remediation[]
        goal
        edit
        applicability
        preconditions[]
        claimedPreservations[]
        verificationEvidence[]
        knownTradeoffs[]

    provenance
        analyzer / compiler / emitter versions
        knowledgeSnapshot
        profileSnapshot
        evidence identities
        derivation timestamps where relevant
```

This is intentionally not a UI schema and not a choice of analysis algorithm. It is the **semantic boundary that any analysis backend must satisfy to make a particular kind of explanatory claim**.

The distinction between `sourceRanges` and `semanticNodeIds` is important. The source range answers “where in the artifact did this come from?” The semantic node answers “which semantic concept does the claim concern?” Transformations through AST → IR → target artifact should carry derivation links rather than attempting to recover source meaning from emitted regex strings afterward. STRling's compiler architecture is already structured around exactly that separation.

Evidence objects should be typed rather than flattened into strings. STRling's conformance methodology provides a strong model: provenance should preserve the question, target identity, construction/normalization lineage, actual execution context, raw record, scientific qualification, and later corrections as distinct entities and relationships. An interactive STRling explanation does not need every field of a scientific conformance package, but it should obey the same principle that **derived interpretation must remain traceable to immutable or reproducible evidence of the appropriate class**.

A useful evidence-strength table is:

| Evidence kind | What it can establish | What it cannot establish by itself |
|---|---|---|
| **Normative semantic source** | Meaning/capability promised by a specified profile/version. | What an unidentified runtime actually did. |
| **Sound complete static proof** | The declared theorem over its modeled domain. | Correctness outside the model/profile/domain. |
| **Sound incomplete static result** | Properties entailed by that result; possibly an explicit unknown elsewhere. | Completeness or absence of unreported problems. |
| **Heuristic static finding** | A reason to investigate under the rule's known evidence basis. | Definitive causality or universal safety. |
| **Runtime observation** | What the identified execution did on identified input/configuration. | Universal behavior over other inputs, versions, or configurations. |
| **Engine trace** | Internal path/events recorded for that implementation and run. | Denotational semantics, universal cause, or minimal explanation. |
| **Validated counterexample** | Refutation of the exact universal relation it violates. | General characterization of all differences. |
| **Bounded search** | Result over the declared finite bound/domain. | The same result outside the bound. |
| **SMT model/core** | Facts about the declared encoding and solver result. | Concrete regex behavior unless the encoding-to-semantics correspondence is justified. |

This table is the practical answer to the question “where does certainty end?” Certainty ends exactly where the evidence type, semantic model, input domain, profile, or completeness claim ends.

## Remediation, warning priority, and developer trust

Remediation should be modeled as a **second-order claim**. Detecting a problem does not automatically justify a repair, and identifying an edit that makes one test case pass does not establish that the edit preserves other desired behavior.

Every repair proposal should therefore answer:

| Repair field | Required meaning |
|---|---|
| **Goal** | What outcome is being changed: parse successfully, accept this input, reject another, increase portability, preserve captures, mitigate safety risk, etc. |
| **Edit** | Exact source transformation with affected semantic nodes/ranges. |
| **Preconditions** | Profiles, operations, assumptions, or domain restrictions under which the proposal is valid. |
| **Expected semantic effect** | What semantic behavior intentionally changes. |
| **Preservation obligation** | What must *not* change: accepted language, selected span, captures, iteration behavior, target behavior, etc. |
| **Applicability** | Whether automation is safe, review is required, placeholders remain, or intent is uncertain. |
| **Verification** | Proof, bounded comparison, witness tests, target execution, or no verification. |
| **Tradeoffs** | Lost portability, changed captures, narrower/wider language, runtime assumptions, readability, etc. |

This requirement is especially important for regex repair. RFixer, for example, frames regex repair from positive and negative examples and seeks a close expression consistent with those examples; that is useful program-repair evidence but does not turn a finite example set into a proof of the developer's complete intent. STRling should therefore describe an example-driven repair as “consistent with the supplied examples” unless an independent preservation proof supports a stronger claim.

For a rewrite verification explanation, the strongest output should be something like:

> **Proven preservation:** rewrite R₂ is capture-equivalent to R₁ for operation `search` under profile P and domain D.
> **Evidence:** complete procedure/certificate E.
> **Changed source:** ranges A and B.
> **Preconditions:** profile version P, flags F, input domain D.
> **Outside scope:** replacement behavior and profile Q were not proved.

That is much safer than “This rewrite is safe.” STRling's own equivalence research emphasizes that language equivalence, match selection, spans, captures, iteration, and operation behavior are different relations.

For a safety remediation, “make this safe” is similarly too strong. STRling's safety report already establishes that theoretical complexity, concrete engine behavior, resource limits, and exploitability are separate questions. A proposed atomic grouping, bounded quantifier, alternative refactor, input limit, timeout, or engine-mode change should therefore identify **which risk dimension it addresses** and which assumptions remain. A runtime timeout alone should not be narrated as proof of catastrophic backtracking; official .NET regex guidance, for example, cautions that a timeout can arise from timeout configuration or runtime conditions and is not by itself a proof of a particular complexity cause.

Rust's suggestion applicability model demonstrates the benefit of separating “we have a suggestion” from “this may be automatically applied.” STRling should go one step further and separate **syntactic applicability** from **semantic preservation**:

| Suggested STRling repair class | Automation contract |
|---|---|
| **Verified-preserving** | May be automatable when exact edit application is also mechanically safe; preservation relation and scope are recorded. |
| **Mechanically safe, intentional semantic change** | Auto-application should require that the requested goal makes the semantic change explicit. |
| **Candidate repair** | Valid candidate supported by evidence/examples, but user intent or preservation remains uncertain. |
| **Placeholder/template** | Requires user completion. |
| **Unverified** | Advice only; no automation. |

Warning prioritization should also avoid the common mistake of using a single `severity` number to represent everything. A high-impact but uncertain security finding and a certain but low-impact style issue have different decision profiles. The warning model should keep at least these dimensions independent:

**Impact**, **evidence strength**, **relevance to declared targets/operations**, **actionability**, and **remediation cost/applicability**.

Developer attention can then be prioritized using those dimensions without changing the epistemic wording of the result. For example, a possible but potentially high-impact ReDoS condition may deserve prominent investigation while still being labeled “possible” rather than “confirmed.”

Industrial static-analysis experience supports this emphasis on actionable, understandable findings. Google's Tricorder work reports a program-analysis ecosystem designed around developer workflow and empirically evaluated in situ, while earlier Google research identified false positives and warning presentation as major barriers. Microsoft's empirical work similarly emphasizes what issues developers care about, how analyzers fit development workflows, and how results are reported. The implication for STRling is that warning ranking is not merely “sort by theoretical severity”; the strongest warning is one whose consequence, evidentiary status, and next action are all understandable.

The rule-graph study adds an especially important human-factors result: explanations of **why the analyzer believes a warning** can help developers reason not only about their own code but also about weaknesses in the analysis itself. STRling should make that possible. A user looking at `REDOS_RISK` should be able to distinguish:

> Pattern fact → analysis rule → modeled risk implication → target assumptions → unmodeled deployment factors.

That lets an expert correctly challenge a premise rather than being forced either to trust or dismiss the final prose.

The human-factors objective should consequently be **calibrated trust**, not maximum confidence in STRling. A trustworthy explanation succeeds when developers know both when a finding should guide action and when it should not. This is especially important because static-analysis usability studies show that false positives, poor warning expression, and workflow mismatches can lead developers to ignore or abandon otherwise useful tools.

The Whyline research offers another useful direction: developers naturally ask contrastive behavioral questions—why did something happen and why did it not happen—and a tool can do work to bridge those questions to program-analysis evidence instead of making users manually reverse-engineer traces. For STRling, `whyMatch`, `whyNoMatch`, “why this capture?”, and “why target A rather than target B?” should therefore be treated as **first-class semantic queries**, not merely prose templates layered over a debugger.

Progressive explanation is likely to matter as well. Simple cases should not force users through a proof object, but hard cases need access to assumptions, candidate paths, analysis rules, witnesses, and limitations. The existing evidence suggests that sophisticated explanatory structure can improve understanding relative to raw traces, particularly when underlying analysis is complex. This is a semantic requirement—preserve the detail so a surface can progressively disclose it—not a prescription for specific UI pixels.

## Surface implications and failure modes to prohibit

STRling's current architecture already has a useful separation of responsibility: the parser is the source of truth, the CLI server normalizes diagnostics, and the LSP server handles protocol/editor concerns. The explanation contract should preserve that layering. No frontend should have to infer certainty, causality, or repair applicability from message strings.

| Surface | Explanation responsibility |
|---|---|
| **CLI** | Default to a compact finding with stable code, source range, scoped claim, and essential epistemic qualifier. Machine-readable output should contain the complete explanation record. Deeper human-readable explanation should render evidence, assumptions, witness, limits, and remediation without changing the underlying claim. |
| **LSP** | Keep diagnostics concise and stable; attach explanation identity/structured data, related ranges, and remediation applicability. Code actions should arise only from remediation objects whose applicability/preconditions permit them. The editor should not reconstruct semantic reasoning from prose. |
| **Audit / Inspect** | Be the principal static explanation surface: meaning, semantic dependencies, portability, profile assumptions, static risk findings, proof status, and uncertainty. It must state when no runtime evidence exists. |
| **Run / execution evidence** | Produce scoped observations for concrete profile + operation + input. Those observations can support explanations elsewhere but do not become universal claims. |
| **Compare** | Produce one contrastive finding: what changed, what remained fixed, where semantics diverge, paired observations/proofs, and a counterexample when available. It should not merely show two independent reports and leave causal comparison to the user. |
| **Reference** | Supply versioned semantic propositions and definitions that explanation records can cite. It explains what constructs/profiles mean in general; it should not silently infer facts about a user's particular pattern or run. |
| **Compose / compiler workflow** | Explain derivation from source intent through semantic IR to target artifacts, retaining provenance for target-specific lowering and any emitted compatibility findings. |

This division agrees with the existing Regex Lab research, which explicitly characterizes Inspect as static, Run as empirical, and Compare as a controlled-difference investigation. It also parallels PostgreSQL's strong distinction between predicted planning information and actually executed analysis.

For CLI/LSP interoperability, STRling should treat prose as presentation and structured fields as authority. The Language Server Protocol exists to standardize communication between language servers and editors; it should therefore transport a STRling semantic contract rather than become the place where STRling defines one. SARIF provides a broader static-analysis precedent for machine-readable results that can carry locations, related execution/code-flow information, provenance, fixes, rankings, and other structured result data instead of relying solely on human text. STRling need not copy SARIF's schema, but the design lesson is sound.

For **Inspect**, an explanation should explicitly label its evidence as static or knowledge-derived. For example:

> **Portability finding — established for declared profiles.**
> Node N uses semantic feature F. Profile P supports F with behavior S₁; profile Q either does not support it or assigns S₂.
> Source: versioned profile knowledge K.
> No target runtime was executed.

This prevents a compatibility table from masquerading as empirical conformance evidence. STRling's conformance methodology explicitly distinguishes normative expectations from execution observations and derived findings.

For **Compare**, the unit should be a contrast, not two panes. A strong target-difference explanation should look conceptually like:

> Profile A and profile B were compared with subject, operation, flags, and input held constant. Their first semantic divergence is node N, where A interprets property X as S₁ and B as S₂. Witness W produces observation O₁ under A and O₂ under B. Therefore W refutes cross-profile equivalence for observable C. No conclusion is made about other observables.

That directly applies both STRling's existing Compare principle and the equivalence report's demand to name the preserved observable/profile/domain.

For **Reference**, explanations should carry references to knowledge propositions rather than copying unversioned text into analyzer logic. This is especially important given the semantic-profile drift already discovered in STRling research. If a Reference proposition is corrected for a new PCRE2 release, old explanation records should still be able to say which knowledge snapshot supported their original conclusion.

The following should be treated as semantic **anti-patterns**, not merely suboptimal writing:

| Anti-pattern | Why it violates the contract | Correct replacement |
|---|---|---|
| **Confident prose from heuristic evidence** | Linguistic fluency launders uncertainty. | Carry `supported`/`possible` status into the sentence. |
| **“It failed because this was the first error”** | Detection order is not root-cause evidence. | “First failing obligation for candidate C …” |
| **Backtracking trace presented as `whyNoMatch`** | One implementation path does not establish semantic rejection completeness. | Map trace to semantic obligations and declare path/completeness scope. |
| **“This range caused the warning”** | Location is provenance, not causation. | Separate source mapping from causal relation. |
| **Unsat core called “the minimal cause”** | Cores are sufficient conflicting subsets and are not minimal by default. | Say “an unsatisfiable core”; state minimization criterion if separately established. |
| **“No counterexample found, therefore equivalent”** | Only valid for a complete decision procedure over declared scope. | “No counterexample found within search scope B,” or `proven` when completeness justifies it. |
| **Abstract counterexample presented as target behavior** | Abstraction may produce spurious witnesses. | Mark abstract candidate; concretize/validate before definitive presentation. |
| **One passing runtime case presented as portability** | Observation is input/profile-specific. | Present it as a scoped observation. |
| **Engine family without version/profile** | Behaviorally material semantics can change by release/configuration. | Bind every claim to resolved profile/version or disclose unresolved identity. |
| **Scalar “safe” / “unsafe”** | Collapses complexity, runtime mitigation, resource exposure, and exploitability. | State the exact safety property and assumptions. |
| **Timeout = catastrophic backtracking** | Timeout is evidence of exceeded runtime limit, not by itself of a particular computational cause. | “Execution exceeded limit L”; add causal classification only with separate evidence. |
| **Empty capture = unmatched capture** | Participation and zero-length capture are different observable states. | Preserve explicit participation/span state. |
| **Nearest string = intended string** | Distance is not user intent. | “Nearest under metric M” or “nearby accepted candidate.” |
| **Example-consistent repair = safe rewrite** | Examples provide bounded behavioral constraints, not general preservation. | State example consistency separately from proof status. |
| **Severity = confidence** | Impact and epistemic strength are independent. | Carry both fields. |
| **Machine-fixable = semantically safe** | Mechanical application and preservation of intended regex behavior differ. | Separate applicability and verification/preservation. |
| **Unknown omitted from the result** | Makes incomplete analysis resemble a negative finding. | First-class unresolved/unknown status with reason where available. |

One particularly important anti-pattern is **causality laundering through natural language**. Consider a static rule that notices nested quantifiers. The analyzer's real evidence may be:

`structure observed → structural risk rule matched → known risk pattern under matcher model M`.

Rendering that as:

> “Your regex is vulnerable because these quantifiers cause exponential backtracking.”

would have silently upgraded a structural heuristic into a model-specific complexity theorem and then again into a vulnerability/exploitability claim. STRling's safety research expressly distinguishes these levels. The correct explanation should preserve every step and use only the strongest wording justified by the weakest unresolved link.

The inverse anti-pattern also matters: overly defensive vagueness. A parser does not need to say “this might perhaps be invalid” when the normative grammar proves the construct cannot parse. Exact facts should be stated exactly. The purpose of uncertainty vocabulary is **calibration**, not hedging.

Thus the core rendering rule should be:

> **Be categorical about established facts, conditional about scoped theorems, explicit about observations, qualified about heuristic inference, plural about unresolved competing causes, and silent about causality that the evidence does not support.**

## Open empirical questions and final recommendations

The literature is strong enough to justify the architecture above, but it does **not** establish which regex explanations developers will understand best. Static-analysis and debugging studies show that presentation, interactivity, actionability, and explanation structure materially affect use and understanding, but STRling's domain has distinctive complications: ambiguous matching policies, zero-width assertions, captures, target profiles, and the universal nature of no-match explanations. The remaining questions should therefore be treated as empirical product-research questions rather than decided by intuition.

| Study question | Conditions worth comparing | Primary outcome to measure |
|---|---|---|
| **Does an exact semantic `whyNoMatch` outperform a backtracking trace?** | Rejection summary + certificate vs engine trace vs generic expected-token message | Correct diagnosis and correct subsequent edit, not preference alone |
| **Which no-match summary is most useful?** | First failing obligation vs minimal blocker vs rejection cover vs near accepted string | Fix correctness, explanation comprehension, time, overgeneralization |
| **Do developers understand global versus path-specific explanations?** | Explicit scope labels vs unlabeled explanations | Ability to state what has and has not been proved |
| **How should uncertainty be worded?** | Established / supported / possible / unresolved versus probability-like or conventional confidence language | Calibration: appropriate reliance and appropriate skepticism |
| **How much evidence should be surfaced by default?** | Claim only vs claim+warrant vs claim+warrant+assumptions vs full certificate | Task time without sacrificing correctness or trust calibration |
| **Which witness is best for Compare?** | Shortest witness, nearest-to-current-input witness, semantically simplest witness, earliest divergence | Understanding of the actual semantic difference and ability to transfer it to new cases |
| **Do node-to-input mappings improve match/capture comprehension?** | Plain text description vs semantic-node alignment | Correct understanding of lookarounds, repetition, empty versus nonparticipating captures |
| **Does explicit target/profile provenance prevent false generalization?** | “JavaScript” label vs exact runtime/profile/version and assumptions | Ability to predict whether claim transfers to another version/configuration |
| **Does separating complexity from exploitability improve safety decisions?** | Scalar warning vs evidence-chain explanation | Correct remediation choice and reduced inappropriate dismissal/alarm |
| **How should repairs communicate applicability?** | Unqualified fix vs Rust-like applicability vs applicability + preservation evidence | Incorrect auto-application rate and correctness after repair |
| **Does contrastive Compare outperform two independent reports?** | Controlled-difference explanation vs side-by-side Inspect results | Correct identification of what changed and what remained invariant |
| **How do expertise levels interact with evidence depth?** | Regex novices, experienced developers, regex experts, engine specialists | Whether progressive disclosure needs different defaults without changing underlying semantics |

The most important dependent variable should not be “did users like the explanation?” A pleasant explanation can still be dangerous if it induces unjustified confidence. Studies should measure at least **task correctness, repair correctness, time, comprehension of scope, appropriate reliance, inappropriate generalization, dismissal/action reasons, and recognition of unresolved uncertainty**. That follows from the broader static-analysis evidence that adoption depends on usable, actionable warnings and from explanation research showing that richer reasoning representations can improve accurate understanding and false-positive diagnosis.

The `whyNoMatch` study should receive priority. It contains the largest gap between what developers naturally ask and what a regex engine naturally exposes. The main experimental comparison should test whether developers can correctly distinguish:

**“this path failed here”**
from
**“this obligation is one sufficient blocker”**
from
**“these blockers collectively prove that every match candidate fails.”**

That distinction is the semantic heart of trustworthy no-match explanation. Type-error research warns against conflating first-detected inconsistency with best root-cause localization, while Whyline and causality work show the value of explicitly supporting why-not questions rather than making users infer them from low-level behavior.

A second priority should test whether the proposed uncertainty vocabulary is actually calibrated. “Supported” versus “possible” may be semantically cleaner than arbitrary confidence percentages, but only user research can establish whether developers consistently interpret those labels as intended. The study should deliberately include cases in which the analyzer is wrong or incomplete and measure whether users appropriately challenge it. Static-analysis adoption research makes clear that user trust deteriorates when warning quality and presentation are poor; the target is therefore **trustworthiness and calibration**, not unconditional trust.

A third priority should test remediation. Regex repair is unusually prone to “fixing the example while breaking the language.” The experiment should compare a bare proposed edit, an edit labeled with applicability, and an edit that additionally states what has been proven or merely tested to be preserved. Rust's compiler tooling demonstrates that suggestion confidence can be made an explicit machine-consumable property, while regex-repair research demonstrates the usefulness—and bounded evidentiary scope—of repairs derived from examples.

The final recommended semantic contract can be stated compactly:

> **STRling should never generate an explanation stronger than its evidence.**
>
> A semantic source can justify meaning.
> A static analysis can justify only the properties its model establishes.
> A runtime observation can justify only what happened in that execution.
> A witness can refute exactly the relation it violates.
> A complete proof can justify exactly the theorem, profile, observable, and domain it covers.
> A trace can describe a path without becoming a cause.
> A repair can be recommended only with separate claims about intent, applicability, and preservation.
> An inability to prove should become an explicit, reasoned `unresolved` result rather than confident prose or silent absence.

This contract is also the cleanest way to integrate the work already done elsewhere in Research Intelligence. Safety analysis may decide that a structural or formal risk fact exists; equivalence analysis may produce a proof or counterexample; Semantic IR can identify the construct; conformance can supply runtime evidence; Reference can supply a versioned semantic proposition. **This explanation layer should not redo any of those analyses. Its responsibility is to preserve their identities, scopes, assumptions, and epistemic strength while translating them into a developer-facing justification.** That is directly aligned with the Research Intelligence program's stated boundary: explanation, evidence, uncertainty, witnesses, remediation, and soundness envelopes belong here; technique selection does not.

The answer to the governing question—*How can STRling explain a regex conclusion in a way that tells the developer not only what it believes, but why that belief is justified and where its certainty ends?*—is therefore:

> **Make every explanation a typed argument rather than a sentence: claim + semantic scope + warrant + evidence provenance + completeness + causal strength + uncertainty + remediation conditions. Render that argument concisely for ordinary use, but never discard the structure needed to audit it.**

With that contract, STRling can say **“established” when it has a theorem or scoped observation, “supported” when evidence is persuasive but incomplete, “possible” when alternatives remain, and “unresolved” when analysis reaches its boundary**. It can explain a match through a semantic derivation, a no-match through path-specific blockers or a complete rejection cover, a target difference through a controlled contrast, a safety finding through an explicit evidence chain, and a rewrite through the exact preservation relation that was actually proved. The result is not merely better diagnostic copy; it is a system in which developer trust can be grounded in inspectable evidence and deliberately stops at the boundary of what STRling knows.
