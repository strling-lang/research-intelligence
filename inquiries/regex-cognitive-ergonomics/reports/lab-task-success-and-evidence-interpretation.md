# Lab task success and evidence interpretation

```text
Role: Experiment report and study protocol
Origin: Research Intelligence, generated with Codex and checked against pinned sources and local runtime results
Published/Generated: 2026-11-20
Source verification: Scoped compiler and runtime claims verified; baseline capabilities checked in owner documentation
Last reviewed: 2026-11-20
Current status: Active input
```

## Decision and evidence

Which workflows should receive evidence labels, localized explanations, and cross-Lab replay affordances? The technical dry run verified two task forms, six evidence classes, and scoring of overclaims. The dry run used fixed tasks and constructed answers with zero participants. User performance, product preference, and repeated use remain untested.

**Established downstream.** At Website `3187d307e1d4707d706b1a7508f0cc5c067cadac`, RegEx Docs is available, RegEx Lab has a gated workspace, and STRling Lab routes to a pending page. The study uses frozen representations of the proposed raw and semantic workflows. A comparative session needs an authorized, versioned study build with the functions below. [Surface definitions](https://github.com/strling-lang/website/blob/3187d307e1d4707d706b1a7508f0cc5c067cadac/src/data/surfaces.ts), [RegEx Lab route](https://github.com/strling-lang/website/blob/3187d307e1d4707d706b1a7508f0cc5c067cadac/src/pages/regex/lab.astro), [STRling Lab route](https://github.com/strling-lang/website/blob/3187d307e1d4707d706b1a7508f0cc5c067cadac/src/pages/lab.astro).

**Established downstream.** STRling `eba5dad3de3fa620eb1ea13e0514d02f4b23e288` defines semantic explanation 1.0 as a concise summary and detail graph with `semantic_fact`, `target_plan`, `diagnostic_advice`, and `uncertainty` attachments. Bounded no-match explanation 1.0 separates `matched`, `no_match`, `unknown`, and `unavailable` from the localized cause disposition. A completed no-match can have a likely cause. Exhaustion can leave the outcome unknown. Subject spans are half-open UTF-8 bytes into the identified subject, and explanation results carry a digest instead of echoing the subject. These scoped contracts coexist with the unratified broad specification. [Semantic explanation](https://github.com/strling-lang/strling/blob/eba5dad3de3fa620eb1ea13e0514d02f4b23e288/spec/explanations/semantic/1.0/README.md), [no-match explanation](https://github.com/strling-lang/strling/blob/eba5dad3de3fa620eb1ea13e0514d02f4b23e288/spec/explanations/no-match/1.0/README.md), [specification hub](https://github.com/strling-lang/strling/blob/eba5dad3de3fa620eb1ea13e0514d02f4b23e288/spec/README.md).

Two primary studies motivate inheritance, validation, and maintenance tasks. Chapman, Wang, and Stolee compared selected syntax pairs in a comprehension study. Michael IV et al. report a regex workflow survey and interviews. Their samples, tasks, and stimuli establish their own results. STRling, evidence labels, and both Labs need direct evaluation. [Chapman et al., ASE 2017 author paper](https://kstolee.github.io/papers/ase2017.pdf), [Michael IV et al., ASE 2019 paper, DOI 10.1109/ASE.2019.00047](https://doi.org/10.1109/ASE.2019.00047).

## Conditions and baselines

| Comparison | Task allocation and controls |
| --- | --- |
| Raw RegEx Lab candidate vs regex101 | Inheritance, diagnosis, capture change, substitution, profile selection, and raw replay. Provide match details, explanation, unit tests, local save/reopen or supported revision workflow, the same reference extracts, and the same profile details. Record regex101 build if exposed, edition/tier, browser build, flavor, options, and runtime identity when observable. Record unobservable identities as unknown. Include PCRE2 debugger if testing a matched PCRE2 profile with that capability. |
| Raw RegEx Lab candidate and VS Code + exact local runtimes | Test version comparison and native host reproductions. Provide Regex Find and Replace, capture substitutions, preview, local files or Git revisions, and runnable Node and Python snippets with operator-level documentation. VS Code editor output is useful for editing, while the named runtime supplies the exact recorded result. |
| STRling Lab candidate vs well-tooled regex | Give both conditions equal orientation and the same host behavior specification, positive and negative fixtures, exact target identity when applicable, and API reference extracts. Use a short literal task and a named intent/capture extension. Compare equivalent jobs using each tool’s supported authoring workflow. Score the behavior and the requested capture rather than whether the participant chose semantic syntax. |
| Explanation views within the candidate Labs | Same structured contract data and underlying output in both versions. Compare explicit evidence class and scope presentation against a concise view with expandable scope details. In both versions, preserve actual result statuses and keep the underlying evidence accessible. This isolates presentation from notation and engine behavior. |

regex101 documents flavor selection, operations, explanation, capture details, repeatable tests, and hosted workspace sharing. VS Code documents regular-expression Find and Replace and revision comparison. These are credible active-tool baselines. Feature availability, build identity, consent, and exact operation behavior must be checked when preparing a human session. Hosted saves send workspace contents to regex101. For these tasks keep a local snapshot or use only the synthetic example with separate permission for hosted saving. [regex101 introduction](https://support.regex101.com/application/), [tool actions](https://support.regex101.com/editor/shortcuts/), [regex101 privacy](https://support.regex101.com/application/privacy/), [VS Code Basic Editing](https://code.visualstudio.com/docs/editing/codebasics#_find-and-replace).

## Falsifiable hypotheses and allocation

- **H1, repair correctness.** A candidate Lab’s diagnosis with linked evidence and localized spans increases correctly repaired no-match cases versus the active regex baseline. Flat or worse correctness, longer blocked periods, or newly introduced negative-fixture matches count against the hypothesis.
- **H2, calibrated reliance.** Explicit class and scope cues yield more answers with both evidence class and claim scope correct, and fewer high-confidence overclaims, than the expandable concise view. Better label recall with unchanged or increased overclaims leaves the presentation hypothesis unresolved or contradicted.
- **H3, reproducible continuation.** Cross-Lab handoff increases exact replay and correct refusal when provenance is missing, relative to saving equivalent source/testing state manually. A superficially successful replay with a different profile or cursor is a failure.
- **H4, task-dependent notation.** After equivalent practice, named semantic composition improves successful extension and capture preservation on a multi-part job; a simple literal can be completed faster with familiar regex. Analyze each direction by task. Simpler direct regex completing both jobs faster at equal accuracy is a genuine negative outcome.

Recruit 8–12 consenting adult developers for formative work across occasional and frequent regex maintainers. Record approximate use frequency, experience with each tool and dialect, STRling exposure, and a three-item unscored practice check. Recruit across familiarity bands where feasible. Report the realized strata and any gaps, especially a sample dominated by STRling contributors. Assign within each available expertise stratum in rotating order to candidate/form A then baseline/form B, baseline/form A then candidate/form B, candidate/form B then baseline/form A, and baseline/form B then candidate/form A. Record assignment, allow the same reference materials and study hardware, and disable extra generative assistance across arms. Allocate an equal time box and skip or stop at the participant’s request. Randomize card ordering by fixed rotation per assignment. Collect confidence before showing corrections. Use the capture-extension task as the longer matched task and the single literal as the short control. Treat A/B form comparability as a pilot question. The identical Python version question is asked once, with runtime evidence available in both conditions.

Candidate state that does not yet exist can be evaluated in an explicitly marked walkthrough with the data and task sequence below. Record which tasks were interactive, facilitator-driven, or unavailable. Show the same manual affordances in comparable presentation conditions. A comparison of real interaction effort or time requires both runnable conditions and matching operations.

## Task materials and scoring key

Use [the A/B fixtures](../artifacts/lab-study/fixtures.json) to populate participant cards. Hide expected fields, sources marked as scoring keys, and the arms’ hypotheses during tasks. Ask the participant for an answer, a supporting observation or reference, a 1–5 confidence rating, and one remaining uncertainty. Record elapsed seconds and first unprompted outcome before any optional prompting.

| ID | Participant prompt | Score 2 for all criteria, 1 for partial correct work without a harmful assertion, 0 otherwise |
| --- | --- | --- |
| T1 inherited pattern | You are reviewing a teammate's rule. Describe its intended records and determine the ID for each provided sample. | Exact alternatives, two ASCII digits, whole subject in these examples, correct capture and rejecting cases. |
| T2 no-match diagnosis | The new plural row should pass while unrelated and prefixed rows still fail. Diagnose the existing rule, change it, check all rows, and say what the result establishes. | Identify the extra suffix and end boundary; repair passes the changed requirement and retains both negative controls. Distinguish the actual fixture observation from a complete causal guarantee. |
| T3 capture change | The downstream consumer needs the existing `rank` group to participate even when the digit is missing. Preserve accepted subjects and compare prior and changed captures. | Correct capture participation, including empty label on empty input; passes all before/after rows and explains the difference between empty and nonparticipating. |
| T4 substitution | Change the marked amounts into dollar-prefixed amounts while retaining leading zeroes and untouched text. Provide the replacement and resulting text. | Correct text and two substitutions with a literal dollar plus captured ID. Scope the template to the given operation and engine. |
| T5 version comparison | On an empty subject, what does Python’s `re.search(r'\B', '')` return in the recorded 3.13 profile? What does 3.14 documentation say? Which was executed? | 3.13 has no match, 3.14 documents a zero-width match at `[0,0)`; accurately record observed vs documented for the provided setup. If both exact versions are available later, score both observations separately. |
| T6 semantic authoring | Author a case-sensitive full match for the literal, then extend it to allow its alternate and preserve the original. Keep the two negative controls. In a follow-up, preserve the captured value when wrapping the authored choice in `capture code { … }`. | Valid authored intent and correct old/new behaviors with both negatives and the expected `code` capture. Literal source starts with `semantic strling 1.0;` and `case sensitive;`, followed by `pattern text "AX";` for form A. The extension uses `pattern choice { text "AX"; text "AY"; }`. The capture extension wraps that choice. Exact compilation/capture execution needs a pinned study build. |
| T7 profile choice | The source program searches for a decimal digit in the supplied text. Choose the runtime matching Python Unicode-string defaults and distinguish the two other profiles. | Python default finds the shown digit at `[1,2)` in Python string positions. Python ASCII mode and ECMAScript `\d/u` yield no match for this input. Identify why a flavor label alone cannot pin behavior. |
| T8 replay | Save the investigation, reopen it in the other Lab, and continue from the recorded cursor. Repeat with metadata omitted and with altered input. | Restore the subject or verified attachment, source/frontend, exact runtime, operation, options, cursor, and native range unit; obtain `[4,6)` in the fixture and identify the failure conditions. Match at `[0,2)` after cursor reset is a changed run. Preserve the chosen raw or semantic workflow and record any unsupported transfer. |
| T9 evidence interpretation | For each provided item, name the evidence class, state its strongest supported claim, and report confidence. | Use the per-card key below. The result can be complete while the localized cause remains likely. |

For T3, `null` in the answer key means the group did not participate. An empty string means the group participated with a zero-length capture. For T8 the modeled handoff is a local literal fixture with exact engine and cursor metadata. It exercises replay mechanics on two known sources. Live cross-Lab persistence, compiler integration, and privacy affordances remain untested. The common contract trial is tracked by the [Lab interaction inquiry](../../regex-lab-interaction-model/README.md).

### Evidence interpretation cards

Show the underlying excerpt or pinned JSON and the scope cues in each assigned presentation, using only the synthetic examples. Ask for class and scope separately. Award one point only when both are correct. Apply the confidence rating after each card, with 1 meaning guessing and 5 meaning very certain.

| Card | Stimulus | Correct scope |
| --- | --- | --- |
| F — semantic fact | Source-less literal explanation, including `program.evidence_class` and the literal node. | A fact about the canonical program. The excerpt alone leaves target execution and cross-engine behavior untested. |
| S — sample observation | First raw replay result for one subject, cursor, and exact Node/native V8 runtime. | An observed span for the identified input and runtime. A wider language or profile claim requires other evidence. |
| P — bounded proof | No-match example with a localized `proven` literal mismatch under canonical search. | A bounded proof recorded for the stated semantic program, subject, mode, and completed limits. |
| L — likely explanation | Complete no-match example with multiple possible blockers. | The canonical no-match outcome is complete within scope; the proposed localized cause remains likely. |
| U — unknown | The one-step limit example. | Evaluation stopped at the limit; match/no-match remains undecided. |
| C — certified evidence | STRling P15-T04 migration/explanation certification manifest, with its named denominator and scope. | Campaign certification is scoped to the recorded compiler and evidence obligations. It grants no certification to a Lab session or to a Regex Conformance compatibility claim. |

In this rubric, “sample observation” and “certified evidence” are study classifications. They are separate from the compiler’s schema enums. Report optional target-plan/advice misreadings in the qualitative error log. [P15-T04 certification record](https://github.com/strling-lang/strling/blob/eba5dad3de3fa620eb1ea13e0514d02f4b23e288/docs/migration/migration-explanation-certification.md), [scoped manifest](https://github.com/strling-lang/strling/blob/eba5dad3de3fa620eb1ea13e0514d02f4b23e288/tests/certification/migration-explanation/1.0/manifest.json).

## Moderator script, consent, and recording

1. Before recruitment, obtain study-owner authorization for the environment, protected storage, consent text, contact route, and retention window. Generate synthetic tasks from the versioned packet. Confirm profile availability and dry-replay both arms. Match output displays to actual inputs, statuses, and identities.
2. Read this consent template with the study contact, storage, and withdrawal dates completed from the approved protocol. “We are evaluating tools and wording used for pattern work. Participation is voluntary. You may skip any task, stop, or request withdrawal until the stated date using the study contact. We will record the task answers, confidence ratings, timing, and optional feedback under a study code. If you choose separate recording consent, we may also record the session for scoring. Use the supplied examples and avoid work material, client data, accounts, or secrets. The study team will restrict access and report de-identified findings.” Record yes/no for participation and separately for recording. Stop data collection if participation consent is absent.
3. Run one untimed practice task in each tool, then show the assigned cards with the same brief references. Begin timing when the participant opens a task. Prompt only with “What would you try next?” after the same two-minute mark in both arms. Save first answer, then assisted outcome. Cap each scored task at four minutes for the formative session and code timeout separately. Offer breaks, collect confidence before explanation, and end with a neutral debrief about tooling, terminology, and preferred workflow.
4. Store the study code mapping and any consent separately with role-limited access. Delete recordings when scoring is complete or at the approved deadline, whichever comes first. Keep individual records out of Git. Remove names, employer, exact time, unique identifiers, URLs containing inputs, and incidental screen content before considering any quote for release. Report small strata together if reporting them would make individuals recognizable. If withdrawal is possible from a protected raw log before aggregation, remove the row and rerun the aggregate.

Record one row per task or evidence card with these fields:

```text
study_code, expertise_band, prior_tools, dialect_familiarity, strling_exposure,
assignment, form, condition, tool_build, runtime_profile, task_id, card_id,
start_offset_s, elapsed_s, first_answer, first_score, assisted_score,
attempt_count, hint_count, outcome, debug_attempted, debug_success,
evidence_class_answer, claim_scope_answer, confidence_1_to_5, overclaim_code,
input_or_provenance_error, workload_1_to_5, debrief_code
```

Use `outcome` values `completed`, `timed_out`, `withdrew`, or `unavailable`. Mark unshown answers and unavailable tasks missing, separately from failed answers. Capture usability defects with a synthetic reproduction ID. A correct raw-regex-only workflow and a supported refusal count as successes when they accomplish the specified job.

## Analysis and stopping rule

Before the first real session, freeze the packet, task conditions, thresholds, reference and build identities, and assignment roster. First compare paired 2-point successes, median elapsed time on comparable completed tasks, capped timeout rates, debugging success, and correct refusal. Report denominators and missing reasons by task, condition, form, and familiarity where ethical. Separate assisted from unassisted outcomes. A score-independent reviewer blinded to condition grades de-identified answers with the rubric. Reconcile disagreements against a documented rule and report both agreement and revisions.

For evidence interpretation, report class/scope confusion counts and the ratio of incorrect high-confidence responses (ratings 4 or 5) to all answered cards, plus counts by card. Avoid collapsing confidence or evidence classes into one certainty metric. A form imbalance, apparently faster work with more incorrect answers, or harmful overclaims despite label improvement triggers review of the relevant instrument or feature. A pair with missing execution in either arm is descriptive only. With this small sample, use counts, within-participant changes, and counterexamples. The procedure does not support population estimates.

For a formative design decision, require a directionally favorable paired correctness result and no increase in high-confidence overclaims on the relevant tasks. Inspect every harmful error before proposing a presentation change. Keep any recommendation conditional if the result reverses by expertise or form. Optional follow-up requires consent and an identical synthetic follow-up task; repeat use or adoption cannot be inferred from stated preference.

## Technical pilot and replay

```text
node inquiries/regex-cognitive-ergonomics/artifacts/lab-study/dry-run.mjs
node inquiries/regex-cognitive-ergonomics/artifacts/lab-study/dry-run.mjs ../strling
```

The first command runs on a clean Research Intelligence checkout with Node `24.4.1` / V8 `13.6.233.10-node.17` and CPython `3.13.5` available on PATH. No third-party libraries, downloads, editable provider input, secrets, or random seed are used. The successful reference run used Windows x64. The second command also reads six compiler inputs from the pinned Git revision using `git show`, with no checkout mutation or network. Without that sibling revision the first command reports source extraction as unrun. Checks use fixed small inputs and five-second child-process limits. The Python 3.14 result remains documented-only. [CPython 3.14 re syntax for `\B`](https://docs.python.org/3.14/library/re.html#regular-expression-syntax), [CPython 3.13 re syntax for `\d`](https://docs.python.org/3.13/library/re.html#regular-expression-syntax), [ECMAScript 2025 CharacterClassEscape and GetSubstitution](https://tc39.es/ecma262/2025/multipage/text-processing.html).

| Check | Result |
| --- | --- |
| Both runtime forms | Passed inheritance, positive/negative diagnosis cases, capture participation changes, substitution, the CPython 3.13.5 baseline, and the Python/ECMAScript digit distinction. |
| Semantic task | Pinned frontend fixtures contain the relevant literal/alternation mappings. The local full-match expectation model for both forms passed. Semantic compilation, capture extension, and its execution remain untested in this pilot. |
| Replay | Both forms reproduced the second occurrence through fixed literal representations. Resetting the cursor selected the first occurrence. Missing runtime, omitted cursor, changed option flags, and changed subject digest were refused. |
| Card sources | Five anchored card excerpts and the positive authoring fixture were extracted and inspected from compiler Git objects. |
| Scoring and missing cases | Constructed correct answers scored 6/6 with zero high-confidence errors. A constructed set containing a missing answer, two wrong-class responses, an uncertainty overclaim and an all-target extrapolation scored 1/6 with three high-confidence errors. These are instrument checks. |

Replaying both commands twice from fresh fixture copies gave stable output for each mode. [Raw pinned-source run](../artifacts/lab-study/dry-run-results.json) records the two forms, source hashes, exact runtimes and exclusions. Its SHA-256 is `e2a2c2b65c156a7b6152d817255ef0a95ce835c00238019c04ddb39453a69bb2`.

**Research disposition.** The procedures and answer keys are ready for a formative human pilot after an authorized matched build, qualified providers for the selected tasks, and consenting participants are available. Keep existing explanation models as evidence sources. Evaluate presentation and replay before inferring a usage effect or changing either model. Ordinary Lab capabilities and raw regex success belong in scope regardless of the outcome. No owner adoption decision is recorded.
