# Lab study moderator packet

```text
Role: Participant operations and study activation packet
Origin: Research Intelligence, prepared for STRL-2026-11-20-three-gap-closure
Current status: Prepared, pending authorization and matched build freeze
Participant count: 0
```

Use the [nine-task protocol](lab-task-success-and-evidence-interpretation.md), [A/B fixtures](../artifacts/lab-study/fixtures.json), and [activation and scoring guide](lab-study-activation-and-scoring.md). Keep the scoring key and `expected` fixture values on the moderator side. Only the synthetic task inputs and equal reference extracts go to participants.

Generate the participant-facing T1–T8 prompts and inputs from the repository root. Serve each form only to the people assigned to it. For T9, show the protocol's six pinned evidence payloads in the assigned order and presentation, withholding the answer key.

```sh
node inquiries/regex-cognitive-ergonomics/artifacts/lab-study/participant-form.mjs A --fresh-replay
node inquiries/regex-cognitive-ergonomics/artifacts/lab-study/participant-form.mjs B --fresh-replay
```

Omit `--fresh-replay` only for a separately qualified exact-replay condition.

## Before scheduling

1. Obtain study-owner approval for the named moderator and reviewer, contact channel, exact runnable build and baseline conditions, consent text, protected workspace, and deletion windows below. Record the approval and the functional contact address privately. Use an isolated study host and browser profile with account sync and saved credentials disabled.
2. Fill the build record below. Replay both forms in each assigned arm on the study host before recruitment. Record the observed outcome, support, status, engine identity and coordinate unit for each task. Label unavailable behavior and unobservable engine versions explicitly. A disagreement with the rubric or unequal task access blocks that paired task until the packet is re-frozen.
3. Rehearse the timing, stop, accessibility accommodations, withdrawal, and scored-only export with synthetic records. Verify that the reviewer can score the randomized export without seeing names, assignment, tool source, or raw recordings. If an answer itself reveals the condition, have the reviewer note that the blind was broken for that item.

| Build record | Freeze before scheduling |
| --- | --- |
| Lab arm | Website commit and build manifest SHA-256, compiler adapter identity and SHA-256, exact provider/profile IDs, browser build, feature flags, and sealed profile scope |
| T1–T4 | Raw RegEx Lab and the pinned regex101 editor when the necessary operation and comparable options are available. Record displayed flavor and editor version. Use the exact local runtime for claims where the editor cannot establish provider identity. |
| T5 | Shared version-evidence exercise with pinned 3.13 observation, 3.14 documentation, and separately marked 3.14 observation if the frozen build reproduces it |
| T6–T7 | STRling Lab or Raw RegEx Lab as specified by the protocol. Give the comparison arm VS Code and exact tested local runtimes and references for the same authoring, capture and profile jobs. |
| T8 | Use the fresh-run task below when the frozen candidate lacks native cursor resumption. Exact resumed and cross-Lab cursor replay remain a descriptive capability question. |
| T9 | Same six evidence payloads in both presentations. Record the view versions, rotate card order, and check class and scope separately before showing any feedback. |
| Instruments | A/B fixture and protocol digests, final participant cards, rubric, references, and the trial schedule |

### T8 when native cursor resumption is unavailable

Use the existing A/B replay inputs with the browser JavaScript provider and the **Find first** operation. Ask the participant to reopen an investigation, rerun it with the same source, subject, provider, operation and options, and identify whether the original cursor was resumed. Ask them to check redacted and altered-input variants without treating those as exact. Use the candidate's local JSON and the comparison arm's local source and run-state record. Use synthetic data only. Both arms must support reconstructing a fresh run before this task contributes to paired comparison.

Score 2 for finding `[0,2)` in the fresh run, explaining why the original `[4,6)` continuation is a distinct result, and correctly identifying both refusal conditions. Score 1 for a partial correct answer without claiming exact continuation and 0 otherwise. Use `replay_correct` for the correctly identified fresh run and `refusal_correct` for the unsupported and mismatched cases in this instrument revision. Label the resulting measure fresh-run reconstruction. H3's exact replay hypothesis stays untested. Keep the original task and scoring unchanged for any later exact-replay arm.

## Recruitment copy for an approved channel

> We are looking for 8–12 adult developers to try two ways of working with regular expressions and read short examples of tool feedback. We welcome people who use regex occasionally as well as people who use it frequently. No STRling experience is required. A remote session takes up to 100 minutes, including a short practice and a break. You will use supplied fictional examples. Taking part is voluntary, and you may skip questions or stop at any time. The study team will protect individual records and report findings in aggregate. If interested, use the private study contact listed below. Please leave employer information, code, and work samples out of your reply.

Propose a project community announcement and, if the study owner approves access, a developer group outside the project to reduce reliance on contributors. Ask privately whether the person is at least 18, their approximate regex use frequency, their prior exposure to the tools, and their availability. Give the approval and consent contact to the moderator before the copy is used. Do not record names or scheduling details in the task workspace.

## Session and consent script

| Minutes | Moderator actions |
| --- | --- |
| 0–10 | Confirm eligibility and approval, read the consent text, and offer accessibility accommodations. Allocate a study code and next assignment within the available frequency band. |
| 10–20 | Give both arms equal practice and answer process questions. Use the same host settings and reference time. |
| 20–85 | Run assigned tasks in the allocated form and arm order, with a break. Apply the protocol's four-minute task cap and two-minute neutral prompt. Record the first answer and confidence before help. Run T5 once. Track participant skips privately as missing and keep them out of paired scores. Record tool unavailability and task timeouts separately. |
| 85–100 | Run the evidence-card prompts and neutral debrief. Ask what was hard, where the participant was unsure, and what they would use again. Remind them of the withdrawal channel and date. |

> We are evaluating tools and wording, and we are interested in what is easy or difficult to do. You can skip any task or stop without giving a reason. We will use a study code and record your task answers, timing, confidence, and optional feedback. Use only the examples we supply. This study is planned without screen or audio recordings. Contact the moderator at [approved private contact] to withdraw your records by [date 14 days after the session]. Only authorized study staff can see individual data, with access limited by role. We will use de-identified aggregate findings. Contact and consent records are scheduled for deletion within 30 days after the last session. Coded task records are scheduled for deletion within 90 days after the last session. Do you agree to take part?

Fill the contact and withdrawal date before asking. Record the consent answer and packet version privately. Stop if the response is absent or negative. Keep the process recording-free unless the owner separately approves recording-specific consent and the participant opts in. Pause or terminate if identifying material enters the session, then remove it from study records before resuming. Supply the contact and withdrawal deadline in the participant's chosen approved private channel.

## Protected records and analysis handoff

| Record | Access and retention |
| --- | --- |
| Scheduling, coded identity key and consent | Moderator only, access-controlled encrypted workspace outside Git. Store separately from task records. Remove withdrawn data before aggregation. Delete by 30 days after the final session under the approved protocol. |
| Coded task records | Moderator and named scoring reviewer, access-controlled encrypted workspace outside Git. Keep the minimum text needed to score. No external sync of records unless the owner approved that storage. Delete by 90 days after the final session. |
| Score export | Randomize item IDs for blinded rubric scoring, then adjudicate and restore task, form and arm to scored rows in protected storage. Run `python -B inquiries/regex-cognitive-ergonomics/artifacts/lab-study/analyze-scored.py --scored-only <private-scored-json>` there, and retain only authorized aggregate results. |
| Research record | Commit de-identified aggregate results and synthetic reproductions only, after withdrawal windows close and disclosure review is complete. Combine or suppress cells that could identify a participant. |

The moderator checks permissions before the first session, logs the scheduled deletion dates in protected storage, and records deletion or applicable backup expiration. Use the [analysis plan](lab-task-success-and-evidence-interpretation.md#analysis-and-stopping-rule) for denominators, paired task eligibility, missing outcomes, and the required confidence and evidence-class breakdowns. Records marked as unavailable never count as failed user attempts.
