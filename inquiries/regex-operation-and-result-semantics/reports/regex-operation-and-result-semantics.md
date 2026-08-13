# What It Means to “Run a Regex”: An Engine-Independent Model of Regex Operations and Observable Results

Role: Research report
Origin: OpenAI deep-research session commissioned for STRling Research Intelligence
Generated: 2026-08-12
Imported: 2026-08-12
Source verification: Partially verified
Last reviewed: 2026-08-12
Current status: Active input

## Source verification gaps

The imported report contained opaque research-session citation markers without a durable marker-to-source table. The markers were removed; unresolved claim-level citations, external comparisons, and proposed models require verification. Current-state claims were checked against the downstream authorities linked by the active inquiry.

## Executive finding and semantic kernel

The phrase **“I ran this regex” does not identify a well-defined semantic event**. A pattern and a subject are insufficient. The observable event also depends on the host operation invoked, the execution profile, the subject representation, compile and run-time options, bounds or start positions, mutable matcher state, match-selection and iteration policy, requested result projection, replacement or split semantics where applicable, and operational limits such as timeouts or resource ceilings. This is consistent with STRling Research Intelligence’s existing portability work, which already treats operation, host, text representation, selection/iteration policy, region/global state, replacement configuration, and resource controls as components of the execution profile rather than properties of the regex text alone.

That direction also matches the current STRling knowledge architecture. The Regex Knowledge Program explicitly keeps engine, dialect, implementation, host, execution profile, Unicode model, replacement behavior, and host API behavior distinct, and makes Matching & Execution Semantics, Host API Behavior, Replacement Behavior, and Performance & Safety separate research facets. Regex Conformance likewise defines execution profiles as behaviorally relevant component graphs, requires native index units to be preserved, separates logical executions from physical attempts, and says infrastructure failure must never silently become regex non-conformance.

The correct abstraction is therefore **an operation over an execution configuration that produces an operation-specific observation and a state transition**:

\[
\operatorname{Execute}
(
A,\ X,\ O,\ S_{\text{pre}},\ Q
)
\rightarrow
\operatorname{Outcome}
(
R_{\text{native}},
R_{\text{derived}},
S_{\text{post}}
)
\]

where:

- \(A\) is a compiled regex artifact, or enough source/configuration to obtain one;
- \(X\) is the exact subject and its representation;
- \(O\) is the requested operation contract;
- \(S_{\text{pre}}\) is the execution state before invocation;
- \(Q\) is the operational/resource policy;
- \(R_{\text{native}}\) is what the real API natively exposed;
- \(R_{\text{derived}}\) contains explicitly derived or normalized observations;
- \(S_{\text{post}}\) is any observable state after the invocation.

Compilation is a related but separate transition:

\[
\operatorname{Compile}
(
P,\ C
)
\rightarrow
\operatorname{CompiledArtifact}
\quad\text{or}\quad
\operatorname{CompileFailure}
\]

where \(P\) is pattern source and \(C\) includes dialect, flags, encoding mode, build features, and other compilation context.

**The principal recommendation is that STRling adopt `search`, `full-match`, `prefix-match`, `scan`, `split`, and `replace` as its public operation core, while treating `compile` as an explicit construction operation and retaining an internal `match-at`/exact-cursor selector primitive.** Boolean testing, first-match extraction, and most “find-all” APIs should normally be modeled as **projections** of those operations rather than separate matching relations. This is not merely aesthetic: Java exposes `matches()`, `lookingAt()`, and `find()` as three explicitly different operations over the same matcher and pattern; Python similarly separates `fullmatch`, `match`, and `search`; ICU exposes the same full/prefix/find distinction.

The resulting conceptual answer to the report’s governing question is:

> **When a developer says “I ran this regex,” a particular host took a pattern artifact and a particular subject representation, in a particular pre-execution state, invoked a particular regex-related operation under particular bounds, selection, iteration, transformation, and resource rules, and either completed that operation with operation-specific observations and possibly a new state, or terminated with a distinct failure/status outcome.**

A “match” is therefore **one possible observation within one family of regex operations**, not the universal meaning of regex execution.

## Operation taxonomy and execution state

### The operation vocabulary

The proposed six-operation public core is defensible, but only if its terms have precise contracts rather than being aliases for whichever native method happens to look similar.

| Conceptual operation | Semantic question | Normal successful result |
|---|---|---|
| `search` | Select one match occurring at or after an eligible search position. | One selected match, or completed/no-match. |
| `full-match` | Does a match consume the entire effective matching domain? | One full match, or completed/no-match. |
| `prefix-match` | Does a match begin at the effective domain start, without requiring its end? | One prefix match, or completed/no-match. |
| `scan` | Enumerate a sequence of selected matches according to an iteration policy. | Ordered sequence, possibly empty. |
| `split` | Partition a subject according to delimiter-match semantics. | Sequence of fields and possibly delimiter/capture material. |
| `replace` | Select matches and transform the subject according to replacement semantics. | Transformed subject plus applicable metadata. |

**`compile`** should exist alongside the core but should not be categorized as a matching operation. It creates or validates an executable pattern artifact and can fail before a subject exists. Mainstream APIs reinforce that lifecycle distinction: Python `re.compile()` returns a compiled `Pattern`; Java `Pattern` is the compiled representation used to create stateful `Matcher` objects; ICU similarly separates `RegexPattern` from `RegexMatcher`; PCRE2 has explicit compile and match phases.

**Boolean test is best modeled as a result projection, not a new selector.** For example, Java’s three match methods all return Boolean values while updating matcher state from which detailed match information can subsequently be queried. ECMAScript `RegExp.prototype.test()` delegates to `RegExpExec` and returns whether the resulting value is non-null; with global or sticky built-in regexes, however, this Boolean projection still participates in `lastIndex` state changes. Thus “test = search and throw away the match” is semantically adequate only if the state transition is retained.

Likewise, **first-match extraction** is normally `search` plus a detailed match projection. **Find-all** is normally `scan` plus a projection rule. Python demonstrates why projection must be explicit: `findall()` changes the shape of its result according to the number of capturing groups, whereas `finditer()` yields match objects; both enumerate non-overlapping matches but expose different observables. Go similarly has families such as `Find`, `FindIndex`, `FindString`, `FindSubmatch`, and their `All` variants: the selector/iterator relationship is shared while the native result projection varies.

Internally, STRling should additionally recognize an **exact-cursor selector**, here called `match-at`. It asks whether the pattern matches starting at exactly a specified position. This makes sticky execution, `\G`-style behavior, lower-level match APIs, and scan iteration easier to describe without pretending they are identical to ordinary prefix matching. ECMAScript sticky (`y`) execution is tied to `lastIndex`; RE2 distinguishes beginning-anchored `Consume` from unanchored `FindAndConsume`; ICU’s lower-level looking-at functions accept native start-index state.

### State is part of the operation

The minimum useful abstract execution state is substantially richer than “current offset”:

```text
ExecutionState
    profile_identity
    compiled_artifact
    subject_identity
    subject_representation

    effective_domain
        subject_extent
        search_start
        search_end
        region
        region_boundary_policy

    cursor_state
        cursor
        direction
        sticky_or_exact_start
        previous_match
        zero_width_progress_state
        host_global_state

    match_policy
        selection_policy
        iteration_policy

    transformation_state
        replacement_config
        split_config
        append_position

    resource_policy
        timeout
        match_or_step_limit
        depth_or_stack_limit
        heap_or_memory_limit
        cancellation
```

This is not hypothetical complexity. Java explicitly describes `Matcher` as stateful: its explicit state includes the most recent match and capture boundaries, while its implicit state contains the input and replacement append position. `reset()` discards match state and resets append state; `find()` continues after the previous match. ECMAScript built-in global and sticky regexes read and modify `lastIndex`; non-global/non-sticky execution instead begins at zero, while sticky failure has defined `lastIndex` consequences. Perl scalar `/g` uses `pos` as persistent iteration state, while `/gc` modifies failure/reset behavior. ICU matchers are likewise reusable state-bearing objects.

A major modeling mistake would therefore be to regard state as an adapter implementation detail. **Where a host exposes or semantically depends on state, the pre-state and post-state are part of the observable execution.**

### Search start, region, slice, and end bound are different concepts

STRling should not have a single ambiguous `offset` parameter. At least four semantic notions must remain distinguishable.

**A search start** means “do not consider candidate matches before this position,” while preserving the original subject and, depending on the API, allowing constructs to observe context before that position. Python documents this directly: the `pos` parameter to `Pattern.search()` is not equivalent to slicing because `^` continues to refer to the real beginning of the string rather than automatically treating `pos` as a new beginning. PCRE2 likewise accepts a `startoffset` into the original subject, with lengths and offsets expressed in the library’s native code units; preceding subject material may remain semantically relevant to constructs such as lookbehind.

**A region** is a restricted matching domain with boundary semantics. Java is particularly revealing: `Matcher.region(start,end)` limits candidate matches, but transparent versus opaque bounds control whether lookaround and boundary constructs can see beyond the region, while anchoring bounds separately determine whether region edges behave as anchors. A neutral model that records only `[start,end)` loses those behaviors.

**A slice** creates a different subject. Its beginning, end, indexing coordinate space, anchors, available lookbehind context, and potentially encoding validity can differ from a search started inside the original subject. Python’s documented `pos` distinction demonstrates why slicing cannot be the universal implementation of offsets.

**An end bound** restricts the eligible domain beyond some point. It should be represented separately because native APIs assign their own semantics to it. Python’s `endpos`, for example, makes the searched string behave for matching purposes as though it ended at that position.

The abstract operation should therefore distinguish at least:

\[
\text{subject}
\neq
\text{search-start}
\neq
\text{region}
\neq
\text{slice}
\neq
\text{end-bound}.
\]

### Selection and direction belong to execution semantics

“Search” also does not completely specify **which** match is chosen when multiple matches are viable. POSIX defines earliest-start selection followed by longest matching, with additional longest-match rules applying to subexpressions. Perl-style and many modern backtracking systems normally expose ordered-alternative/leftmost-first behavior instead. RE2 intentionally reproduces leftmost-first-style match results using an implementation strategy that does not require conventional recursive backtracking, illustrating that selection policy is an observable contract independent of implementation mechanism. Go additionally exposes `Longest`, changing its selection behavior.

Direction is another independent dimension. .NET supports `RegexOptions.RightToLeft`, under which matching proceeds from right to left. A core `scan` contract that silently assumes forward iteration would therefore be narrower than the actual host ecosystem.

A robust operation contract should consequently identify:

```text
selector:
    full | prefix | search | at

direction:
    forward | reverse

selection_policy:
    profile-native or explicitly requested semantic policy

projection:
    boolean | match-detail | text | spans | captures | host-native

iteration:
    single | sequence
```

The public names can remain simple; the semantic kernel must not be.

## Result, capture, and span semantics

### The identity of a regex result

A regex result is not semantically identified by its matched substring alone. Even the pair `(matched text, span)` is insufficient, because the same whole-match span can carry different captures, capture participation, name resolution, capture histories, matcher diagnostics, or state transitions.

A suitable conceptual match observation is:

```text
MatchObservation
    execution_id
    occurrence_ordinal

    whole_match
        text_or_native_value
        native_span

    groups
        declared_group_identity
        participation
        value
        native_span
        capture_history_if_native

    named_group_observation
        native_name_lookup_semantics
        native_named_result

    native_result_shape
    native_diagnostics
```

And the enclosing execution result adds:

```text
ExecutionObservation
    operation_contract
    execution_profile
    subject_identity
    subject_representation
    pre_state
    completion_status

    native_observation
    derived_observation

    post_state
```

This distinction matters because APIs sometimes separate “match state” from the Boolean operation that produced it. Java’s `matches`, `lookingAt`, and `find` all return a Boolean but install detailed explicit matcher state after success; `toMatchResult()` can snapshot that state independently of later matcher activity. ECMAScript instead materializes an Array-like match result with whole match, capture entries, `index`, `input`, a `groups` object for named captures, and—with the indices flag—capture indices. Those are different native result shapes for observations that can partially normalize to common concepts.

**Native result shape itself should remain observable.** Normalization should add a common interpretation; it should not pretend that a Java mutable matcher, an ECMAScript Array, a Python `Match`, a PCRE2 ovector, and POSIX `regmatch_t[]` were literally the same host object.

### Capture participation must be distinct from empty capture

This distinction is fundamental and should be non-negotiable in STRling’s normalized model.

For a group occurrence:

```text
participated = false
value        = absent
span         = absent
```

is different from:

```text
participated = true
value        = ""
span         = [k, k)
```

Java makes the distinction explicit: `group()` returns `null` when the group failed to participate, but returns the empty string when a group successfully matched an empty sequence. PCRE2 represents unset groups by `PCRE2_UNSET`, distinct from a participating capture whose start and end offsets are equal. Rust’s `Captures::get` returns `None` for a group that did not participate, whereas a participating empty group is a match value with a zero-length span.

Therefore a normalized model must never encode both conditions as a bare empty string, zero length, null span, or falsy value.

A useful abstract capture record is:

```text
CaptureResult
    group_id

    participation:
        participated | absent

    value:
        present string/bytes/native value
        only when participated

    span:
        present NativeSpan
        only when participated

    history:
        present sequence<CaptureOccurrence>
        unavailable
        not-requested
```

“Unavailable” and “absent” are especially important to keep separate: an engine that exposes only the last repeated capture has not established that earlier captures did not occur.

### Repeated captures are not one universal observable

For a capturing group under repetition, mainstream ecosystems expose materially different information. .NET preserves the successive successful captures through `Group.Captures`/`CaptureCollection`, while the group’s ordinary value corresponds to its most recent successful capture. Duplicate named groups similarly accumulate captures, with the named `Group` reflecting the last successful one. PCRE2’s ordinary output vector instead records the final value of a group after repeated matching rather than providing a general history of every repetition.

STRling should consequently define two independent observations:

\[
\text{final capture}
\quad\text{and}\quad
\text{capture history}.
\]

Capture history should be an **optional native capability**, not synthesized from the final group result. A target that does not expose history should report `history = unavailable`, not a one-element history and not an empty history.

For operation/result comparison, a practical definition of **capture-equivalent observations** is: the requested group identities have the same participation states, values, and requested span observations, plus the same repeated-capture history only when history is part of the requested observable contract. This defines what must be observed; it does not prescribe an equivalence algorithm.

### Named groups and duplicate names require a multimap model

A normalized representation such as:

```text
name -> group
```

is too restrictive.

.NET explicitly permits repeated use of the same group name and exposes accumulated captures, with the last successful capture determining the ordinary named group value. Current ECMAScript permits duplicate named groups in specified disjoint-alternative circumstances and defines how the resulting named-group object is populated from successful captures. Other regex families apply different restrictions and lookup rules.

The declaration model should therefore be closer to:

```text
GroupDeclaration
    stable_group_id
    numeric_index?        # where the host has one
    declared_names[]      # zero or more

NamedCaptureNamespace
    name -> [group_id, ...]
    native_lookup_policy
```

The **native name lookup result** should be retained independently. STRling may offer a normalized group identity layer, but it should not silently resolve ambiguous duplicate names according to one ecosystem’s policy.

### Native spans need an explicit unit and coordinate space

A span should not be represented as two unqualified integers.

Recommended form:

```text
NativeSpan
    start
    end
    unit
    coordinate_space
    subject_id
    end_convention
```

The ecosystem demonstrates why every field matters.

ECMAScript Match Records define indices in **UTF-16 code units** and use an exclusive end. Its `AdvanceStringIndex` also operates in terms of string indices/code units, advancing differently when Unicode-aware matching requires moving across a surrogate pair. Java `String` indexing is based on UTF-16 `char` positions, so supplementary characters occupy two indexed positions. .NET `String` is likewise a sequence of UTF-16 code units, and regex `Capture.Index` reports a zero-based position in the input.

PCRE2’s index unit depends on the library width: its 8-, 16-, and 32-bit APIs use corresponding code units, and subject lengths/start offsets and output-vector positions are expressed in those units. POSIX `regmatch_t.rm_so` and `rm_eo` are byte offsets, with `rm_eo` identifying the byte offset immediately after the matched substring. Rust’s Unicode-string `regex` API deliberately returns byte offsets—at UTF-8 code-point boundaries for string regexes—while its byte-oriented API may return positions that are not valid UTF-8 boundaries. ICU’s `UText` abstraction goes further: native indices can use a provider-specific native coordinate system rather than one globally fixed UTF-16 representation.

This validates Regex Conformance’s existing requirement that **native index units be preserved in observations**.

### Normalized spans are useful, but only as derived observations

STRling can and should add normalized spans when they are exactly derivable, but the proper relationship is:

\[
\text{native span}
\rightarrow
\text{derived normalized span}
\]

not:

\[
\text{native span}
\rightarrow
\text{replacement normalized span}.
\]

For example:

```text
derived_span:
    unit = unicode_scalar_index
    start = ...
    end = ...
    derived_from = native_span
    conversion = exact
```

is useful for cross-profile comparison.

But normalization may be undefined. A Rust byte regex may report offsets through arbitrary bytes that have no Unicode scalar coordinate. An ECMAScript non-Unicode match can operate at UTF-16-code-unit granularity where an observed boundary lies inside a surrogate pair; such a boundary cannot truthfully become an integer Unicode-scalar boundary without changing what was observed. ECMAScript’s specification explicitly models its string positions as code-unit indices. ICU `UText` further demonstrates that even “native index” cannot always be inferred solely from the engine name.

An even stronger pathological case exists in PCRE2: when its compatibility option allowing `\K` in lookarounds is used, documented execution can yield a reported whole-match start offset greater than its end offset. That is a legitimate native observation but not a conventional half-open interval. STRling must preserve such an observation as a non-canonical native offset pair instead of coercing it into `[min,max)`.

The rule should be:

> **Normalized spans may be added only as lossless, provenance-bearing derived observations. A normalized coordinate that cannot represent the native result is unavailable, not approximated.**

## Iteration, zero-width behavior, replacement, and split

### A scan is a state machine, not “search repeatedly” in the abstract

A useful scan contract is:

```text
ScanPolicy
    initial_cursor
    direction
    selector
    selection_policy

    overlap_policy
    next_cursor_after_nonempty
    next_cursor_after_empty

    maximum_matches
    failure_state_policy
    native_global_state_policy
```

The default forward non-overlapping policy in many APIs can be summarized as “select a match, emit it, resume at or after its end,” but zero-width matches prove that this is incomplete. If a match starts and ends at the same location, blindly resuming from the end would resume at the same location forever.

Modern systems solve this differently.

**ECMAScript.** Built-in `RegExpExec` updates `lastIndex` for global or sticky regexes to the successful match end. For an empty match, start and end coincide, so `exec` itself does not introduce a separate beyond-the-empty-match bump. Higher-level global algorithms such as `RegExp.prototype[@@match]` explicitly detect an empty match and apply `AdvanceStringIndex`; its advance is one code unit in ordinary mode but respects the code-unit width of a Unicode code point under the applicable Unicode-aware modes. That is a crucial example of **the higher-level host operation adding iteration semantics not contained in a single match call**.

**Python.** `findall()` and `finditer()` enumerate non-overlapping matches and include empty matches; Python explicitly changed its iteration behavior so that a non-empty match can begin immediately after an empty match.

**Go.** The `All` family returns successive non-overlapping matches but ignores an empty match that abuts the preceding match. That is observably different from simply returning every mathematical zero-length match candidate.

**Perl.** Stateful `/g` tracks its position through `pos`; its zero-length-match machinery prevents repeatedly accepting the same empty match at the same location and can consider a non-empty alternative there before moving onward. `/c` separately controls whether failure resets the global position.

**PCRE2 substitution/global-iteration machinery** has its own empty-match progression rules, including attempts to obtain a non-empty alternative at the same position before advancing when required.

These differences mean **empty-match advancement must be part of the scan/replacement operation contract or explicitly delegated to `profile-native` behavior**. “Non-overlapping” alone is not enough.

Overlap must also be modeled as an iteration policy rather than inferred from the regex language. Most convenience `find-all` APIs are defined around non-overlapping matches, but callers can implement overlap by choosing different candidate progression; pathological PCRE2 `\K` results can even violate assumptions that successive reported spans will be monotonically ordered conventional intervals. A Boolean field `overlap=true` is consequently useful but insufficient by itself; the exact **next-candidate rule** is the deeper semantic property.

### Sticky and stateful matching are selector plus cursor semantics

Sticky matching should not be collapsed into ordinary search with a starting offset. In ECMAScript, `y` requires matching at `lastIndex`, and failure resets the built-in regex’s state according to the specification; ordinary unanchored global matching may search forward from `lastIndex`. Perl’s `\G` and `/g` similarly interact with persistent `pos`. Ruby documents `\G` in stateful operations such as `scan`/`gsub`, where its effective anchor advances with iteration rather than simply representing the start of the original subject.

The engine-independent primitive should therefore be:

\[
\operatorname{matchAt}(cursor)
\]

combined with an explicitly modeled cursor lifecycle, rather than treating “sticky” as a regex syntax feature alone.

### Replacement is one public operation but a semantic composition

Replacement should remain a first-class public operation because developers experience it as one action and because native APIs often expose it as one action. Semantically, however, it is a pipeline:

\[
\text{replace}
=
\text{match selection}
+
\text{iteration}
+
\text{replacement evaluation}
+
\text{output assembly}.
\]

A complete replacement contract needs at least:

```text
ReplacementContract
    match_selector
    first_or_global
    iteration_policy

    replacement_kind
        literal
        template
        callback

    replacement_language
    callback_environment

    unmatched_group_policy
    invalid_reference_policy

    zero_width_policy
    maximum_replacements

    assembly_policy
```

ECMAScript makes that decomposition explicit in specification algorithms. Global replacement repeatedly obtains match results, has explicit empty-match advancement, evaluates either a replacement callback or the `GetSubstitution` replacement-template language, and assembles the result from the original string. A callback receives the whole match, captures, source position, original string, and named-group object where applicable.

.NET has a distinct replacement language with tokens for numbered and named captures and also constructs such as the entire match, text before the match, text after the match, the last captured group, and the entire input. The prefix/suffix forms are particularly important because their semantics refer to the original input rather than merely to a running output buffer.

Java likewise demonstrates that callback replacement is not simply “callback returns literal bytes.” `Matcher.replaceAll(Function<MatchResult,String>)` scans matches, calls the function for each result, and then treats the returned string as a replacement string in which capture references retain replacement-language meaning; callback exceptions propagate, and detected mutation of matcher state can itself cause an error.

PCRE2’s substitution API defines first versus global substitution, capture interpolation and error behavior, and specific behavior for unset groups and zero-length global matches. ICU also has first/all replacement and incremental `appendReplacement`/`appendTail` machinery.

The conclusion is important for STRling:

> **Replacement is not “a regex match with a replacement string attached.” The replacement language, iteration policy, callback contract, source-coordinate semantics, and assembly procedure are independent first-class semantics.**

That also means matching support does not imply replacement support. PCRE2 documents matching configurations involving unusual `\K` result offsets whose results are unsuitable for assumptions made by substitution machinery. An adapter must be allowed to say “search is supported but this replacement contract is not.”

### Split is also a composite regex operation

The right model for split is:

\[
\text{split}
=
\text{delimiter scan}
+
\text{field extraction}
+
\text{delimiter/capture emission policy}
+
\text{edge-empty policy}
+
\text{limit policy}.
\]

A split contract needs to specify at least:

```text
SplitContract
    delimiter_scan_policy
    include_delimiter
    include_delimiter_captures

    nonparticipating_capture_representation
    leading_empty_policy
    trailing_empty_policy
    zero_width_boundary_policy

    limit
    meaning_of_limit
```

The host ecosystem shows why these cannot be defaults hidden behind a generic `split`.

ECMAScript `RegExp.prototype[@@split]` uses a dedicated split algorithm, inserts capturing-group results into the output—including `undefined` for nonparticipating captures—and has special zero-width handling. Perl’s `split` similarly inserts capturing-parenthesis results, represents nonparticipating captured separators as `undef`, gives its limit argument field-count semantics, and has explicit rules for trailing empties and zero-width matches at the beginning. ICU regex split can also return captured delimiter material.

Java `Pattern.split`, by contrast, describes the matches as delimiters and normally returns the fields rather than captured delimiter material; it also distinguishes a positive-width match at the beginning—which can produce an initial empty field—from a zero-width match there, which does not. Its `limit` controls the number of applications/result elements according to Java-specific rules. Python’s `re.split()` injects captured separator groups when the separator pattern contains capturing parentheses.

Therefore `split(pattern, subject)` with no split policy is no more semantically complete than an unspecified “match.”

## Outcomes, native API mappings, and unsafe normalization

### No-match is a successful execution outcome

The most important outcome-taxonomy rule is:

> **No-match is not an error.**

Python `search()` returning `None` expressly means that execution completed without finding a matching position, and its documentation distinguishes that state from successfully finding a zero-length match. ECMAScript `exec()` similarly returns `null` for the ordinary no-match outcome. PCRE2 uses a negative native result code for `PCRE2_ERROR_NOMATCH`, illustrating why **native encoding of a status must not dictate its normalized semantic category**.

The normalized execution outcome should therefore be a discriminated taxonomy along these lines:

| Outcome | Meaning |
|---|---|
| `completed` | The requested operation ran to semantic completion. Its payload may contain a match, Boolean false, zero scan results, an unchanged replacement result, etc. |
| `compile-error` | Pattern construction/compilation was rejected. |
| `runtime-error` | Execution began but the host/engine reported an execution/API error unrelated to ordinary no-match. |
| `timeout` | An explicit execution deadline/time limit terminated the operation. |
| `resource-exhausted` | A match/step/depth/heap/stack/memory or similar resource limit terminated execution. |
| `unsupported-operation` | The target/adaptor cannot honestly realize the requested operation contract. |
| `unsupported-observable` | The operation can run, but a required observation—capture history, for example—is not available. |
| `engine-specific-status` | A meaningful native state such as specialized partial matching has no safe generic equivalent. |
| `infrastructure-failure` | The intended engine execution was not reliably observed because the harness/process/container/transport/adaptor infrastructure failed. |

A completed selection operation then has its own payload discriminator:

```text
completed:
    selected-match
    no-match
```

while scan simply completes with `matches = []` when nothing is found. Replace may complete with zero substitutions; split may complete with a single untouched field. Those are all normal successful operation executions.

Timeout and resource exhaustion deserve separate categories. .NET’s regex APIs support configured match timeouts and throw a dedicated timeout exception when the limit is exceeded. ICU offers time and stack-related safeguards. PCRE2 exposes independent controls such as match/depth/heap limits and distinct native failure codes including heap-limit exhaustion. Treating all three as generic “runtime error” would erase operationally meaningful behavior.

`unsupported-operation` is also different from a native compile error. A target adapter may know in advance that no faithful implementation exists for the requested operation. Conversely, a host may have the operation but reject this particular pattern at compile time. Those facts answer different questions.

Finally, infrastructure failure belongs outside regex semantics. Regex Conformance’s present constitutional model explicitly requires empirical attempts, observations, and infrastructure outcomes to remain distinct and states that infrastructure failure must not be silently reported as regex non-conformance.

### Representative real APIs as decompositions

The following are **semantic decompositions, not an engine compatibility matrix**. Their purpose is to show how actual APIs map into the abstract vocabulary without pretending that similarly named methods are identical.

**ECMAScript.** A built-in `RegExp` construction produces the regex object/configuration. `exec()` is a detailed-result selector implemented through `RegExpExec`; for a built-in regex, `g` and `y` make `lastIndex` state relevant, with `y` requiring an exact-position match while `g` permits forward search. `test()` is essentially the Boolean projection of `RegExpExec`, preserving its state effects. String/RegExp `@@search` is a separate host operation that saves the prior `lastIndex`, runs from zero, and restores the prior state. Global `@@match` is scan-like and contains its own empty-match advancement. `matchAll` constructs a matcher through the species mechanism and copies relevant state into the iterator. Replacement and split have separate specification algorithms.

There is an additional ECMAScript complication that should remain visible in target profiles: `RegExpExec` first checks whether the object has a callable custom `exec` method and invokes it when present. Thus the general ECMAScript RegExp protocol can execute user-supplied behavior rather than only the built-in regex matcher. A “JavaScript RegExp protocol object” and a “built-in RegExp engine execution” should not be silently conflated.

**Python `re`.** `re.compile()` maps naturally to compile. `Pattern.search()` maps to first unanchored search; `Pattern.match()` is prefix matching from the supplied position; `Pattern.fullmatch()` requires the full effective range; `finditer()` is detailed-result scan; `findall()` is scan plus a capture-count-dependent projection; `sub()`/`subn()` are replacement operations; and `split()` has its own delimiter/capture projection. `pos`/`endpos` belong to execution bounds rather than to the pattern artifact.

**Java.** `Pattern.compile` and `Pattern.matcher` separate compiled pattern from execution state. `Matcher.matches()` is full-match over the current region; `lookingAt()` is prefix-match at the region start; `find()` is stateful next-search. Region, anchoring bounds, transparent bounds, previous match state, and replacement append state all participate in execution. `replaceFirst`, `replaceAll`, callback variants, and incremental append replacement are transformation operations over that state.

**.NET.** `Regex.IsMatch` is principally an existence/Boolean projection; `Match` extracts one selected result; `Matches` enumerates results; `Replace` and `Split` are transformations. `RightToLeft` adds an execution-direction dimension. .NET’s `CaptureCollection` additionally provides native repeated-capture history that should not be discarded merely because another engine exposes only one capture value.

**PCRE2.** `pcre2_compile()` and `pcre2_match()` cleanly expose compile versus execution. `pcre2_match()` operates on a compiled code object, a subject and subject length, a start offset, options, match data, and context. Ordinary captures are exposed through output offsets. `pcre2_next_match()` provides library support for successive matching, while `pcre2_substitute()` is a distinct transformation operation. `pcre2_dfa_match()` cannot safely be treated as merely another implementation of ordinary `search`: it uses a different matching algorithm and can return multiple possible match lengths at a start position without ordinary backtracking capture semantics.

**Perl.** `qr//` can construct reusable pattern artifacts; ordinary `m//` performs matching but its returned projection depends strongly on context. `/g` in scalar context acts as a stateful “next match” iteration operation tied to `pos`, while list context collects results; `/c` affects failed-global-match state. `s///` combines match iteration and Perl replacement semantics; `split` has a separate field/capture policy. This is a strong reason not to infer operation semantics from syntax such as `/g` alone.

**Ruby.** `Regexp` is the compiled/pattern object; `match?` is an existence-oriented unanchored test and `match` returns detailed result state. Ruby string scanning and substitution facilities build higher-level iteration/transformation over regexes, and `\G` has state-sensitive meaning in operations such as scanning and substitution. Ruby’s match data also distinguishes character-oriented offsets from byte-oriented offsets through separate APIs, reinforcing the need to record the native index observable actually requested.

**Go `regexp`.** Compile produces a `Regexp`; Boolean `Match` operations answer existence; `Find*` methods select the first match with different projections; `FindAll*` methods enumerate successive non-overlapping results under Go’s documented empty-match suppression rule; `Split` and `ReplaceAll*` are transformations. `Longest()` changes match selection, so it is execution/artifact state relevant to result identity rather than a mere performance switch.

**Rust `regex`.** `Regex::new` compiles; `is_match` projects existence, `find` extracts the first selected match, `find_iter` enumerates non-overlapping matches, `captures`/`captures_iter` project groups, and split/replacement methods are transformations. Its standard string regex reports positions as byte offsets while guaranteeing UTF-8 boundaries, unlike `bytes::Regex`, where returned byte offsets need not form Unicode boundaries.

**RE2.** C++ `FullMatch` naturally corresponds to full-match and `PartialMatch` to search, but `Consume` and `FindAndConsume` combine matching with mutation of the caller-visible `StringPiece`, advancing it past the consumed match. The state transition is therefore part of the native operation. RE2’s typed extraction overloads add another host-level concern: conversion into requested result types can make the composite API call fail even though regex recognition itself succeeded, so a raw Boolean from such a call cannot always be normalized to “regex no-match” without preserving the extraction step.

**POSIX.** `regcomp()` maps to compile and `regexec()` to a selected match/search result, with POSIX’s leftmost-longest rules governing selection and `regmatch_t` exposing byte offsets. POSIX’s core regex interface does not itself establish a universal split or substitution contract; higher-level utilities/languages can layer their own iteration and transformation semantics on POSIX-style matching. This is exactly the distinction between **engine/profile capability** and **operation contract** that STRling needs to retain.

**ICU.** `RegexPattern` and `RegexMatcher` separate compiled expression from mutable matching state. `matches()` corresponds to full-match, `lookingAt()` to prefix-match, and `find()` to stateful search/scan progression. ICU also exposes regex split and replacement operations, time/stack controls, regions, and both UnicodeString-oriented and UText-oriented subject/index behavior.

### Native operations that cannot be forced safely into the core

The six-operation vocabulary should be **open**, not exhaustive. Some native operations are genuinely specialized.

**Rust `shortest_match`** is a clear example. Its documentation describes an end position at which the underlying engine can determine that a match exists; it is not guaranteed to identify the ordinary leftmost-first selected match, nor the mathematically shortest possible match. Mapping it to `search` with a strange span would invent semantics. It belongs in a specialized observation namespace.

**PCRE2 DFA matching** can report multiple candidate ending positions at the same start and differs fundamentally in capture behavior. Its result should be represented as a specialized result type rather than coerced into one conventional `MatchObservation`.

**PCRE2 partial matching** is another engine-specific completion status: it conveys that the current subject may be a prefix of something that could match with additional input. That is not the same as ordinary no-match and should remain a specialized status.

**RE2 `Consume`/`FindAndConsume`** can be decomposed into prefix/search plus input-view advancement, but only if the mutation remains part of the result. Dropping the mutation would cease to model the real call.

**Incremental replacement primitives** such as Java and ICU `appendReplacement`/`appendTail` manipulate a replacement-machine append position. They can explain one-shot replace semantics, but they should not themselves be mislabeled one-shot `replace` unless that state machine is composed through completion.

**Java `hitEnd()` and `requireEnd()`** are additional diagnostics about the previous execution—whether the engine hit the input end and whether additional input could invalidate a positive result. They are not ordinary captures or match spans and should survive as optional native diagnostics.

The general rule should be:

> **Normalize only when there is a semantics-preserving projection. Otherwise expose a target-specific extension rather than manufacturing a false common denominator.**

## Implications for STRling, Conformance, Lab, and Reference

### Target artifacts and adapters

STRling describes itself as a compiler for portable regex intent producing target-specific regular expressions. The operation/result findings imply that a target artifact sufficient for execution cannot always be only:

```text
pattern + flags
```

The semantic execution artifact is closer to:

```text
TargetExecutionArtifact
    emitted_pattern
    compile_options

    operation_contract_id
    adapter_strategy

    required_execution_state
    requested_observables

    replacement_artifact?   # when applicable
    split_policy?           # when applicable

    expected_native_index_model
    resource_policy?
```

This does **not** mean every pattern file has to embed all of that metadata. It means the target system must have a known association between generated regex and the operation semantics under which STRling claims it should be used.

In particular, STRling should prefer a host’s genuine operation when that operation represents the intent rather than implementing everything by rewriting the regex. Java `matches()` versus `lookingAt()` versus `find()` and Python `fullmatch()` versus `match()` versus `search()` demonstrate that anchoring scope exists at the API layer as well as in regex syntax. Automatically lowering every `full-match` into syntactic `^...$` would risk importing target-specific anchor/newline/region behavior that the native full-match operation does not require.

Adapters should be permitted to classify realization as conceptually:

- native faithful realization;
- faithful composition/emulation;
- partial realization with unavailable observables;
- unsupported;
- specialized/native-only operation.

That status is distinct from whether the regex syntax itself compiles.

Most importantly, an adapter should return **native observations first**. Normalized observations should be derived alongside them:

```text
native:
    span: { start: 4, end: 6, unit: utf16-code-unit }
    native_group_shape: ...

derived:
    scalar_span:
        { start: 3, end: 4 }
        derivation: exact
```

If conversion is impossible:

```text
derived:
    scalar_span:
        unavailable:
            reason: native boundary is not a Unicode-scalar boundary
```

That policy directly complements Regex Conformance’s existing principle of preserving native index units.

### Operation contracts versus target profiles

The boundary should be explicit.

| Operation contract owns | Target profile/adaptor owns |
|---|---|
| What operation the caller is asking for. | Which native APIs can implement it. |
| Full/prefix/search/exact-cursor scope. | Native region/start semantics and reset behavior. |
| Required iteration direction/progression. | Native global/sticky/empty-match rules. |
| Requested observables. | Which observables exist natively. |
| Required capture participation/history semantics. | Native group representation and history capability. |
| Requested coordinate normalization. | Native index units and conversion constraints. |
| Replacement semantic intent. | Native replacement grammar/callback behavior. |
| Split semantic intent. | Native split/capture/edge-empty/limit behavior. |
| Resource requirements. | Available timeout/resource controls and failure signals. |

The Knowledge Program’s current architecture already gives host API behavior and replacement behavior their own profile-level identity rather than folding them into a generic engine label. This research suggests extending that principle rigorously to operation realization: **the contract says what was requested; the profile says what this target actually does and how the adapter realizes the request.**

A profile should not silently redefine `scan` to mean whatever that target calls `findAll`. Conversely, the neutral operation contract should not contain “Java behavior” or “JavaScript behavior” as its semantics. When the requested policy is `profile-native`, the profile supplies it explicitly.

### Regex Conformance vectors

Without prescribing an evidence schema, the semantic consequences for Conformance are clear.

A probe about observable execution needs to identify the **operation**, not merely pattern and subject. The same pattern/subject pair can legitimately produce different observations under search, prefix, full, sticky, scan, split, or replacement operations. Java’s documented three-way operation distinction alone is sufficient to demonstrate this.

Where relevant, a vector also needs conceptually controlled **pre-state**: region or search start, global cursor, sticky state, direction, previous-match state, and transformation settings. ECMAScript `lastIndex`, Perl `pos`, Java matcher state, and ICU matcher state all make a stateless vector inadequate for some behavior.

Zero-width iteration vectors must observe a **sequence**, not merely prove that an empty match exists. ECMAScript, Go, Perl, Python, and PCRE2 have enough variation in progression to make a single expected match record insufficient.

Capture probes should distinguish nonparticipation from empty participation and should test repeated capture history only where that observable is in scope. Native offsets need their native units preserved, with normalized offsets treated as derived. This is already consistent with Conformance’s stated native-index principle.

Split probes need operation-level output expectations—including injected delimiter captures, edge empties, zero-width behavior, and limit semantics—rather than merely recording delimiter matches. Replacement probes similarly need the final transformed subject and replacement-language behavior, not only the sequence of source matches.

Finally, the normalized outcome category must stay separate from harness mechanics. A compile error, ordinary no-match, engine runtime error, timeout, resource limit, unsupported operation, and infrastructure failure are all scientifically different observations or non-observations. That follows directly from Regex Conformance’s authority model, which preserves empirical execution provenance and forbids silently treating infrastructure failure as regex behavior.

### Regex Lab Run and Compare

The prior conclusion that Regex Lab should not expose a vague “Match” action is strongly confirmed.

At the semantic level, a Run request needs an identifiable operation such as `search`, `full-match`, `prefix-match`, `scan`, `split`, or `replace`. For state-sensitive targets, Run also needs a defined initial execution state—even if product defaults eventually make common cases convenient. This is a semantic requirement, not a UI prescription.

Compare should compare **operation observations**, not just accepted regex strings or matched text. Relevant comparison dimensions include:

```text
completion status
selected whole-match identity
capture participation and values
capture history where requested
native spans and units
derived normalized spans
match sequence
zero-width progression
post-execution state
split result
replacement result
native diagnostics
```

This does not mean every comparison must display every dimension. It means omitted observables must be deliberately out of scope rather than accidentally discarded.

The distinction between native and derived results is especially useful for Compare. Seeing “both matched Unicode scalar positions 3–4 after normalization” can be useful, while simultaneously preserving that one host reported UTF-16 offsets `4–6` and another reported UTF-8 byte offsets `5–9`. The underlying units across ECMAScript/Java, Rust, PCRE2, POSIX, and ICU are demonstrably heterogeneous.

### Regex Reference

Regex Reference should treat **host operations and result behavior as first-class semantic reference material**, not as footnotes attached to regex syntax.

For each execution profile, the Reference ultimately needs to answer questions such as:

- Which selection operations exist natively?
- What does a starting position mean?
- Are there real regions, and how do their boundaries interact with anchors/lookaround?
- Is the matcher stateful?
- What advances the global cursor?
- What happens after an empty match?
- Are repeated capture histories observable?
- How are duplicate names represented?
- What are the native span units?
- What are the split semantics?
- What replacement language and callback contract apply?
- What errors, timeouts, or resource statuses can execution produce?

Those are profile facts, not regex-language syntax facts. The Knowledge Program’s current requirement to study host API and replacement behavior separately gives the Reference the right authority boundary for storing that knowledge. Public Reference material should then be a derived publication surface backed by canonical researched knowledge and identified empirical evidence, exactly as the Regex Conformance Foundation currently requires.

## Unresolved STRling semantic decisions

The investigation narrows the remaining choices substantially. These are genuine STRling semantic-policy decisions rather than facts that can be settled by surveying another engine.

| Decision STRling must make | Recommended resolution |
|---|---|
| **Whether the six requested operations are sufficient as the public core** | **Yes:** `search`, `full-match`, `prefix-match`, `scan`, `split`, `replace`. Add `compile` as a construction operation. Keep the operation type extensible. |
| **Whether exact-position matching deserves a public operation** | Keep **`match-at` as an internal selector primitive** initially. Promote it publicly only when sticky/parser-oriented use cases justify it. |
| **Whether Boolean `test` is an operation** | Treat Boolean as a **projection of a selector**, while allowing profiles to name native test calls and preserving their state side effects. |
| **Whether first-match extraction is separate from search** | No. Model it as `search + detailed-result projection`. |
| **Whether find-all is separate from scan** | No. Model it as `scan + projection`; preserve native projection peculiarities separately. |
| **What `scan` means by default** | Define direction, overlap/progression, zero-width advancement, and maximum-count policy explicitly. Never leave empty-match advancement implicit. |
| **Whether profile-native iteration is allowable** | Yes, as an explicit policy value such as `profile-native`; it must never masquerade as a universal STRling rule. |
| **How offsets are expressed** | Native span is mandatory and fully qualified by unit/coordinate space. Optional normalized scalar/code-point spans are derived and may be unavailable. |
| **Whether normalized spans replace native ones** | **No. Never.** They are provenance-bearing secondary observations. |
| **What constitutes capture participation** | A first-class state. `absent` and `participated-empty` must be distinct. |
| **Whether repeated-capture history is synthesized** | **No.** Preserve native histories where available; otherwise report unavailable. |
| **How duplicate names normalize** | Use stable group identities plus a name-to-groups multimap. Preserve native name-resolution behavior separately. |
| **Whether regions and start offsets are the same** | **No.** Model search start, end bound, hard region, region-boundary semantics, and slicing independently. |
| **Whether mutable matcher state belongs in results** | Record relevant pre/post state wherever it affects or is affected by execution. |
| **Whether RightToLeft/other direction modes fit the core** | Yes, as selection/iteration direction, not as a separate operation. |
| **Whether replacement is primitive** | Publicly yes; semantically **composite**: matching + iteration + replacement-language/callback evaluation + assembly. |
| **Whether STRling can define one universal replacement-template syntax by normalization alone** | Not safely. A common semantic replacement IR is possible, but native template syntax/results must remain target-specific observations. |
| **Whether split is reducible to scan** | It can be explained in terms of delimiter scanning but remains a first-class public operation because field, capture, empty-edge, and limit semantics are separately observable. |
| **Where operation-specific target behavior belongs** | Target profiles/adapters own native behavior, support, units, state, and realization strategy; operation contracts own requested semantics. |
| **How unsupported is represented** | Distinguish unsupported operation from unsupported observable and from a particular pattern’s native compile/runtime rejection. |
| **How specialized native APIs are represented** | Through an extensible `specialized` operation/result namespace, not by coercing them into one of the six core contracts. |
| **Whether result identity can be reduced to text/span** | No. It should be scoped to the execution plus selected occurrence, captures, native coordinate system, requested observables, and relevant state. |

The largest architectural choice is whether STRling wants its operation layer to describe **only native host behavior** or also to define higher-level execution contracts that adapters may faithfully emulate. The evidence favors supporting both, but marking the distinction explicitly:

```text
realization = native
```

versus

```text
realization = composed/emulated
```

A native Java `full-match`, for example, is a direct `Matcher.matches()` realization, while a target lacking such an API might require a more elaborate adapter strategy. Because regions, anchors, Unicode indexing, zero-width progression, and state can all affect equivalence, emulation should never be inferred merely from superficially similar regex rewrites. Java, Python, ECMAScript, PCRE2, and ICU all expose enough API-level behavior to make that caution necessary.

The resulting unified conceptual model can be summarized as:

\[
\boxed{
\text{Regex Execution}
=
\text{Artifact}
+
\text{Subject}
+
\text{Operation}
+
\text{Pre-State}
+
\text{Bounds}
+
\text{Selection Policy}
+
\text{Iteration Policy}
+
\text{Projection}
+
\text{Transformation Semantics}
+
\text{Resource Policy}
}
\]

producing:

\[
\boxed{
\text{Outcome}
=
\text{Completion Category}
+
\text{Native Observation}
+
\text{Derived Observation}
+
\text{Post-State}
}
\]

This model answers the original question without erasing host APIs. It does not claim that Python `search`, Java `find`, JavaScript `exec`, PCRE2 `pcre2_match`, POSIX `regexec`, Rust `find`, or ICU `find` are identical. Instead, it provides a vocabulary for saying **which part of their behavior corresponds**, **which additional state or observables each carries**, and **where normalization must stop**. The differences documented across start/region semantics, global state, zero-width advancement, repeated captures, duplicate names, native index units, split policies, replacement languages, directionality, resource controls, and specialized matchers show that this preservation layer is necessary rather than optional.

So, **what exactly has happened when a developer says “I ran this regex”?**

A precise answer is:

> **A specific regex artifact was constructed under a specific profile; a specific host operation was invoked on a specific subject representation from a specific execution state and effective domain; that operation applied a particular match-selection and, where relevant, iteration policy; it produced either normal completion or a precisely classified exceptional outcome; normal completion exposed a host-specific projection of selected matches, captures, spans, transformation output, diagnostics, and state changes; and any cross-engine normalized representation of those observations is a derived interpretation that must retain provenance to the native result.**

That is the abstraction STRling needs: **not “pattern + string → match,” but “profiled operation over state → observable outcome.”**

This research stage is complete.