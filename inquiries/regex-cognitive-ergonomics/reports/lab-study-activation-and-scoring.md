# Lab study activation and scoring

```text
Role: Study readiness and technical validation report
Origin: Research Intelligence, prepared with Codex for STRL-2026-11-20-three-gap-closure
Last reviewed: 2026-11-20
Current status: Participant sessions blocked
```

## Frozen stimulus set

Use the [nine-task protocol and scoring rubric](lab-task-success-and-evidence-interpretation.md) from Research Intelligence `dfa8ede1e30607511fc333ad039a9898e22df972`. The [two forms](../artifacts/lab-study/fixtures.json) and six evidence cards remain the instrument baseline. The LF-normalized SHA-256 of the protocol is `4049f2470a274b131d365109a467dc9f9778d080f19b2b93d8cc3612144efa6d`. The form fixture SHA-256 is `937e36fe059c3419839323a0ce74cc6ee9da6957d2c083627e3dc889af4c43b5`. The [source-pinned dry run](../artifacts/lab-study/dry-run-results.json) has SHA-256 `e2a2c2b65c156a7b6152d817255ef0a95ce835c00238019c04ddb39453a69bb2`. These are technical artifacts from work with zero participants.

Use the same synthetic subjects, task objectives, time limits, rubric and equal practice in both conditions. Rotate forms and arm order using the existing four assignments. Freeze the browser build, Lab source and artifact digests, runtime identity and option defaults, comparator access/tier, selected task conditions and consent text before scheduling sessions. A change in tool access, task equivalence, or provenance requires a new instrument revision and rehearsal.

| Task | Preflight check before scoring |
| --- | --- |
| T1–T4 | Reproduce both forms with an exact runtime, tested operation, expected captures, replacements, and negative examples. In regex101 verify the usable editor flavor and comparable controls. A flavor name alone cannot establish runtime identity. |
| T5 | Retain the CPython 3.13.5 observation in the shared evidence task. Display 3.14 documentation as documentation. If an exact 3.14 runtime is exercised, save it as a separate observation with version and runtime evidence. |
| T6 | Use the authorized compiler build to compile and execute both the literal and the capture extension. Give the comparator equivalent accepted/rejected subject and capture requirements. Score task success in either authoring workflow. |
| T7 | Record the behavior of Python Unicode, Python ASCII mode, and ECMAScript in the exact identified hosts. Mark an unavailable option or runtime as unavailable in that arm. |
| T8 | Verify a positive replay with the original input, profile, provider, option and cursor bindings. Verify redacted and mismatched history separately. The reviewed Website request shape starts a fresh operation and has no saved native cursor. Exact cursor resumption is currently unavailable. Keep that condition descriptive until both arms can perform an equivalent replay, or revise and re-freeze the task before recruitment. |
| T9 | Use the same evidence payloads with the two assigned presentations and rotate card order. Withhold correctness feedback until both arms finish. Preserve the distinction between the canonical no-match result and a likely cause. |

The source-pinned rehearsal reproduced Node 24.4.1 and CPython 3.13.5 task expectations and compiler evidence cards. The [live stimulus preflight](../artifacts/lab-study/live-stimulus-preflight-results.json) extends that evidence. Both T6 forms compiled through the installed 4.0.3 Wasm package and the local Website compiler client. Six generated patterns gave the expected full-match and capture results across 24 subject cases on Node/V8. For T5, the installed Pyodide artifact executed CPython 3.14.2 and returned `[0,0)` for `re.search(r'\B', '')`. For T7 both forms reproduced the distinction among Python Unicode, Python ASCII, and ECMAScript modes. This scope is the named Node host with fixed inputs and local WebAssembly bytes. It leaves participant interaction and browser qualification separate.

Reproduce with the [stimulus preflight script](../artifacts/lab-study/live-stimulus-preflight.mjs) from Research Intelligence using `node --experimental-strip-types inquiries/regex-cognitive-ergonomics/artifacts/lab-study/live-stimulus-preflight.mjs ../website`. The argument identifies a local Website source tree with installed lockfile dependencies, including the Lab source modules and the compiler and Pyodide packages. No network fetch is needed for this run. The checked record identifies exact loaded compiler and Pyodide Wasm bytes, selected source modules, and the execution host.

On 2026-11-20, the live regex101 v14.6.2 editor in its displayed PCRE2 (PHP) flavor with `gm` returned two matches for `(?<id>[A-Z]{2})-[0-9]+` over `AB-7 CD-42 stray`. Its capture inspector displayed `AB` at `[0,2)` and `CD` at `[5,7)`. The engine patch was unavailable in the observed view. RegExr displayed its maintenance page. VS Code 1.147.0 was installed, and its owner documentation confirms regex editing controls. Treat these observations as comparator access and stimulus checks. Preflight the exact arms and access tiers before study activation. [regex101 editor](https://regex101.com/), [RegExr](https://regexr.com/), [VS Code basic editing](https://code.visualstudio.com/docs/editing/codebasics#_regular-expressions), [CPython 3.14 regex reference](https://docs.python.org/3.14/library/re.html#regular-expression-syntax).

## Participant and evidence handling

Activation needs a study owner to approve a named moderator, exact study build, approved channel for 8–12 adult developers, consent text, protected storage, and retention and withdrawal dates. Use occasional and frequent regex users and record the order and familiarity conditions privately. No sessions have occurred and no participant records were collected. Keep any eventual contact details, consent receipts, identifiable notes and optional separately consented recordings outside Git. Keep the key linking study codes to individuals in a separate protected location. Complete removals under the approved withdrawal policy before running analysis.

The moderator exports a scored-only JSON list from protected storage after independent scoring and adjudication. Each row carries `code` (a study code shaped like `p001`), `band` (`occasional` or `frequent`), `task`, `form`, `arm` (`candidate` or `baseline`, and `shared` for T5), `status`, and `elapsed_s`. For tasks T1–T8 include `first`, `assisted`, `debug_success`, `replay_correct`, and `refusal_correct`. Use a null mark when the field was unscored or inapplicable. Score first completed answers on the existing 0–2 scale. Record a timeout at 240 seconds and leave its first score null. For T9 include `card`, `classification`, `scope_correct`, and `confidence` per answered card. For interrupted cards keep only the card ID and outcome. Use separate `withdrew` or `unavailable` marks so these cases do not enter paired correctness or time estimates. Omit all raw answers, URLs, exact session timestamps and identifiers from this export.

```sh
python -B inquiries/regex-cognitive-ergonomics/artifacts/lab-study/analyze-scored.py --self-test
python -B inquiries/regex-cognitive-ergonomics/artifacts/lab-study/analyze-scored.py --scored-only <private-scored-json>
```

The [scoring script](../artifacts/lab-study/analyze-scored.py) reports availability, first and assisted outcomes, paired successes, time differences for two completed arms, and evidence-class confusion and confidence counts. Its output is for the protected analysis workspace. Review small cells, denominators, rubric disagreements, and the form and familiarity breakdown before reporting deidentified aggregates. Record accessibility issues and task defects using synthetic reproductions. Use paired contrasts only where both arms were available. Count timed-out eligible responses as unsuccessful and keep missing or unavailable comparisons separate. The synthetic checks exercise those distinctions, capture/replay marks, and the rejection of extraneous fields and duplicate or mismatched scores.

Retain the exploratory maturity of user-effect conclusions. A plausible benefit, no material difference, and an observed regression are each legitimate outcomes. Before accepting wording or UX changes, review paired correctness, high-confidence errors, any reversal by familiarity or form, and whether each proposed fix has a synthetic reproduction and retest.
