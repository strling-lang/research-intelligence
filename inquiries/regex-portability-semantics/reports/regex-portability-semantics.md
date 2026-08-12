# Regex Portability: A Formal Conceptual Framework for STRling Research Intelligence

Role: Research report
Origin: AI-assisted deep-research session commissioned for STRling Research Intelligence; the underlying sources, not the AI system, are the evidence authorities.
Generated: 2026-08-12
Imported: 2026-08-12
Source verification: Partially verified
Last reviewed: 2026-08-12
Current status: Active input

## Source verification gaps

The report's core semantic dimensions were partially checked against the [ECMAScript RegExp specification](https://tc39.es/ecma262/multipage/text-processing.html#sec-regexp-regular-expression-objects), [Unicode Technical Standard #18](https://www.unicode.org/reports/tr18/), [PCRE2 pattern documentation](https://www.pcre.org/current/doc/html/pcre2pattern.html), [Python `re` documentation](https://docs.python.org/3/library/re.html), [Java `Pattern`](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/regex/Pattern.html), [.NET regular-expression behavior](https://learn.microsoft.com/en-us/dotnet/standard/base-types/regular-expression-behavior), and [POSIX regular expressions](https://pubs.opengroup.org/onlinepubs/9799919799/basedefs/V1_chap09.html). Current STRling responsibility boundaries were checked at [`9991575`](https://github.com/strling-lang/strling/tree/9991575b347ac5f56108f18065c88b2b16a5065a).

The original research-session marker map is unavailable. Unreconstructed markers link here. Version-specific examples, host-operation edge cases, and the proposed portability tuple/verdict vocabulary require claim-level verification before normative use; the vocabulary remains a report recommendation.

## Executive conclusion and rigorous definition

The central finding is that **regex portability is not a property of a regex string in isolation**. It is a scoped equivalence claim about the observable behavior of one or more regex artifacts when executed under precisely identified execution profiles.

That conclusion fits the architecture STRling is already converging toward. STRling compiles a DSL through AST and target-independent IR to target regex artifacts, while its formal specification distinguishes syntax from semantics and already requires emitters to warn when target semantics may differ. [source-verification note](#source-verification-gaps) [source-verification note](#source-verification-gaps) The Regex Knowledge Program independently models engine family, dialect, implementation, host, execution profile, Unicode model, replacement behavior, and host API behavior as distinct subjects rather than collapsing them into an engine label. [source-verification note](#source-verification-gaps) Regex Conformance goes further: it explicitly says that execution profiles are “behaviorally relevant component graphs,” that native index units must be preserved, and that empirical observations describe what a precisely identified runtime did rather than automatically becoming standards guarantees. [source-verification note](#source-verification-gaps)

### Recommended formal model

Let an **execution profile** \(P\) identify the behaviorally relevant context for execution:

\[
P =
\langle
S,\ I,\ V,\ B,\ H,\ O,\ F,\ T,\ U,\ L,\ M,\ G,\ R,\ Q
\rangle
\]

where, conceptually:

| Component | Meaning |
|---|---|
| \(S\) | regex system or dialect |
| \(I\) | concrete implementation |
| \(V\) | implementation version |
| \(B\) | build/configuration features that affect behavior |
| \(H\) | host language, wrapper, API, or embedding environment |
| \(O\) | operation: search, prefix match, full match, iteration, split, replace, etc. |
| \(F\) | active options, flags, and modes |
| \(T\) | subject text representation and encoding model |
| \(U\) | Unicode data/version and Unicode-related semantic mode |
| \(L\) | locale/culture or other tailoring |
| \(M\) | match-selection and iteration policy where independently configurable |
| \(G\) | region/start-offset/bounds/global-state configuration |
| \(R\) | replacement language and replacement-operation configuration, when applicable |
| \(Q\) | implementation limits, resource controls, timeout/JIT/matcher choice, and other operationally relevant configuration |

This is deliberately richer than `engine + version`. PCRE2 alone demonstrates why: a build may be 8-, 16-, or 32-bit; UTF/UCP settings affect text semantics; the application can prohibit some facilities; and `pcre2_match()` and `pcre2_dfa_match()` execute the same compiled-pattern ecosystem with materially different matching and capture behavior. [source-verification note](#source-verification-gaps) Java likewise puts region bounds, anchoring bounds, transparent bounds, operation choice, and matcher state outside the pattern string. [source-verification note](#source-verification-gaps)

For a profile \(P\), artifact \(A\), and subject \(x\), let:

\[
E(P,A,x)
\]

denote execution, including its success/failure/error outcome and native result.

A **portability contract** \(C\) specifies:

\[
C = \langle D,\Omega,N,\Phi\rangle
\]

where:

- \(D\) is the domain of subjects and relevant environmental states to which the claim applies.
- \(\Omega\) is the set of observables that must be preserved: recognition, selected match, captures, iteration sequence, replacement result, and so forth.
- \(N_P\) is an explicitly permitted normalization from profile-native observations into a common comparison model, such as mapping byte offsets and UTF-16 code-unit offsets into code-point positions.
- \(\Phi\) is any required operational envelope: termination guarantee, timeout policy, complexity class, memory bound, absence of stack overflow, maximum supported subject/pattern sizes, and similar properties.

Then artifacts \(A_P\) and \(A_Q\) are **behaviorally portable under \(C\)** between profiles \(P\) and \(Q\) exactly when, for every \(x\in D\) for which the contract promises behavior,

\[
N_P(\Omega(E(P,A_P,x)))
=
N_Q(\Omega(E(Q,A_Q,x)))
\]

and every required condition in \(\Phi\) is satisfied.

This is a **definition of the semantic property**, not a claim that the equality is always decidable or practically provable. Regex dialects include facilities whose semantics go far beyond classical regular languages, implementations have incompletely specified behavior and resource limits, and an empirical campaign can normally sample only a finite subset of an unbounded input space. Regex Conformance's own authority model correctly separates observation from normative guarantee. [source-verification note](#source-verification-gaps)

For STRling, a pattern intent \(I\) adds another layer:

\[
\operatorname{emit}(I,P)=A_P
\]

Intent \(I\) is portable across \(P\) and \(Q\) when the **possibly different artifacts** produced for those profiles satisfy the same portability contract. This is the crucial reason STRling should not equate portability with “the same regex text works everywhere.”

### The answer to “what must agree?”

The most important qualification is:

> **Internal mechanisms do not have to agree; required observables do.**

Two implementations may use completely different automata, backtracking algorithms, optimizations, syntax, or internal encodings and still be semantically portable if they produce the same contractually relevant behavior. Conversely, identical syntax and nominally similar engines are non-portable as soon as a contractually relevant observable differs.

For example, greediness and backtracking order are not independently required to be algorithmically identical if they never alter a requested result. They become portability dimensions when they affect selected matches, captures, iteration, failure behavior, side effects, or the promised operational envelope. RE2's default matcher deliberately reproduces leftmost-first result semantics without implementing a conventional backtracking search, illustrating the distinction between **mechanism equivalence** and **observable equivalence**. Go's `regexp` documentation similarly describes leftmost-first selection while guaranteeing matching time linear in the size of the input. [source-verification note](#source-verification-gaps)

Accordingly, an unqualified statement such as **“this regex is portable between Python and JavaScript” is formally incomplete**. It does not identify versions, flags, host operations, Unicode/text semantics, result observables, replacement behavior, input domain, or evidence basis.

The recommended STRling principle is:

> **Portability is always portability of a declared semantic contract across declared execution profiles.**

And the recommended public meaning of an otherwise unqualified **“portable”** claim is stronger:

> **STRling has determined, to the stated evidence level, that its generated target artifacts preserve every developer-visible semantic observable required by the declared STRling intent and operation across the named execution profiles, subject only to the explicitly reported conditions and exclusions.**

That wording permits honest, useful claims without implying omniscient proof.

## Portability taxonomy and claim classes

A single Boolean cannot represent the relevant distinctions. The appropriate ontology is a **portability vector** whose dimensions may independently be equivalent, different, inapplicable, conditional, or indeterminate.

This is more rigorous than a scalar “compatibility percentage” and also avoids forcing every use case to care about every dimension. A validation pattern that returns only `true/false`, for example, does not require capture-history portability; a substitution operation does.

### Semantic dimensions

| Dimension family | Exact portability question | Representative observables |
|---|---|---|
| **Construction** | Can the required artifact be represented, parsed, and compiled with the intended interpretation? | lexical/syntax acceptance; escaping; grouping; quantifier parsing; property-name resolution; flag placement; duplicate-name rules; compile-time errors |
| **Recognition** | Does the pattern recognize the same subject set under the declared match scope? | full-match truth; prefix-match truth; existence of a search match |
| **Selection** | When multiple matches are possible, is the same one selected? | start position; end position; leftmost-first vs leftmost-longest; alternative priority; greedy/lazy consequences; backtracking-priority consequences |
| **Result and capture** | Does a successful match expose equivalent result data? | whole-match text; group values; participation vs nonparticipation; empty capture vs absent capture; repeated-capture result/history; group numbering; named-group lookup; duplicate names; spans |
| **Text semantics** | Are the units and character relationships against which the pattern operates equivalent? | code unit vs code point vs byte vs grapheme; Unicode version; properties/classes; case folding; locale; normalization; word boundaries; grapheme boundaries; newline set; dot; anchors |
| **Operation and iteration** | Does the host perform the same regex operation and enumerate results identically? | search vs prefix vs full-match; region behavior; start offsets; overlapping/non-overlapping policy; empty-match progression; global state; `lastIndex`-like state; split behavior |
| **Transformation** | Does replacement/substitution produce the same output? | replacement grammar; numbered/named interpolation; unmatched-group expansion; literal escaping; whole-match/prefix/suffix tokens; replacement callbacks; first/global replacement |
| **Operational** | Does execution satisfy the same nonfunctional contract? | termination; complexity guarantees; timeout behavior; memory/stack limits; maximum pattern size; capture limits; invalid-input handling; JIT/interpreter distinctions |

These dimensions are not merely theoretical. Existing standards and mainstream APIs deliberately expose variation along almost every axis.

POSIX defines a leftmost-longest model and applies longest-match rules recursively to subexpressions, making capture selection part of its semantic policy rather than merely an implementation detail. [source-verification note](#source-verification-gaps) Go's `CompilePOSIX`, despite using leftmost-longest whole-match selection, explicitly documents that its submatch tie-breaking diverges from POSIX. Thus even the label “POSIX matching” is insufficient to infer capture-result equivalence. [source-verification note](#source-verification-gaps)

Java exposes three different fundamental operations from one compiled pattern: `matches()` for the entire region, `lookingAt()` for a prefix, and `find()` for searching; matcher regions can separately affect anchors and lookaround visibility. [source-verification note](#source-verification-gaps) C++ similarly distinguishes `regex_match`, which considers only matches consuming the entire range, from `regex_search`, which seeks a matching subsequence. [source-verification note](#source-verification-gaps) Python separately exposes `search`, `match`, and `fullmatch`. [source-verification note](#source-verification-gaps) Therefore “the regex matches this string” is not even a complete proposition until the operation is specified.

### Recommended claim classes

STRling should support named **claim classes** as convenient projections over the vector, but they should not replace the underlying dimensions.

| Recommended term | Minimum meaning |
|---|---|
| **Source-portable** | The same regex artifact is accepted under both profiles with corresponding parse-level meaning and required options representable. |
| **Recognition-portable** | The relevant recognition predicate is equivalent over the declared domain. |
| **Match-result-portable** | Recognition plus selected whole-match identity and normalized span agree. |
| **Capture-portable** | Match-result equivalence plus the capture contract agrees: values, participation, naming/numbering, repeated-capture behavior, and any capture history that the intent exposes. |
| **Operation-portable** | The requested host operation, region/start behavior, zero-width progression, and result iteration are equivalent. |
| **Rewrite-portable** | The complete substitution/replacement result is equivalent under the requested replacement intent. |
| **Operationally portable** | The artifacts also satisfy the declared resource, termination, limit, and safety contract. |
| **Intent-portable** | The generated artifacts preserve every semantic dimension required by the specific STRling intent. |

“Behaviorally portable” is useful as an umbrella for match/capture/operation/rewrite semantics. “Fully portable” should be avoided unless it expands to an explicit portability contract; there is no sensible engine-independent maximum set of observables.

The classes also should **not be implemented as a simplistic ascending grade**. Capture portability usually presupposes match-result equivalence, but operational portability is partly orthogonal: two implementations can produce identical results while having very different time or memory guarantees. Likewise, a consumer may require replacement equivalence but never expose native match spans.

### Pattern portability versus execution-profile portability

Three different subjects must remain distinct.

**Pattern-text portability** asks whether the *same textual regex* can serve the required purpose under both profiles. This is the narrow traditional meaning people often intend by “portable regex.”

**Regex-artifact portability** is slightly broader: the pattern plus its required compile flags/options and other regex-local configuration are reusable. This matters because `(?i)` embedded in a pattern and an API-level ignore-case flag may represent the same intent but are not the same artifact.

**Pattern-intent portability** asks whether the same semantic intention can be realized by profile-specific artifacts. This is the concept STRling principally needs.

**Execution-profile portability** is a relation between profile behaviors for a specified contract. It can be discussed independently of any one source pattern: for example, two execution profiles might be interchangeable for STRling's “Unicode decimal digit search with capture extraction” subset while differing for lookbehind or replacement.

This distinction follows naturally from STRling's compilation architecture: STRling's IR is intended to be target-independent while emitters produce target-specific regex. [source-verification note](#source-verification-gaps) It also aligns with Unicode Technical Standard #18, which explicitly says its syntax/API are illustrative and that implementations may provide the required functionality using different syntax, optional modules, settings, or even facilities supplied by the surrounding system, provided the situation is documented. [source-verification note](#source-verification-gaps)

For STRling, therefore:

\[
\text{same syntax}
\not\Rightarrow
\text{portable semantics}
\]

and equally:

\[
\text{different syntax}
\not\Rightarrow
\text{non-portable semantics}.
\]

## Where portability fails despite identical syntax

The strongest evidence against Boolean engine-level compatibility is that many ordinary patterns compile unchanged in multiple systems yet produce materially different observable behavior.

### Same accepted pattern, different recognized strings

Consider `\w+`.

Python 3.14 Unicode `str` patterns define `\w` using Unicode alphanumeric characters plus underscore, unless the ASCII flag changes that behavior. [source-verification note](#source-verification-gaps) ECMAScript defines its base word-character set from ASCII word characters, with only a limited case-fold-derived extension under the relevant Unicode-and-ignore-case combination; it does not turn `\w` into the general set of Unicode letters and numbers. [source-verification note](#source-verification-gaps)

So the exact same source text can:

- parse successfully in both;
- look intuitively equivalent;
- agree on ASCII tests;
- and still recognize different sets of strings.

This is **source acceptance without recognition portability**.

The STRling semantics document already recognizes this issue in its discussion of Unicode word semantics and ECMAScript, which is precisely why treating “core syntax supported by every target” as a complete portability guarantee would be too coarse. [source-verification note](#source-verification-gaps)

### Same language, different selected match

Consider the pattern:

```regex
a|aa
```

on subject `aa`, under a search operation beginning at offset zero.

A leftmost-first policy can select `a`, because the first alternative succeeds. A leftmost-longest policy selects `aa`. Go documents both modes in the same library: ordinary `Compile` uses leftmost-first semantics, while `CompilePOSIX` uses leftmost-longest. [source-verification note](#source-verification-gaps) POSIX's own rules make longest selection semantically significant. [source-verification note](#source-verification-gaps)

Yet under a **full-match recognition** question, both alternatives collectively recognize the same set `{ "a", "aa" }`.

This demonstrates a fundamental hierarchy:

\[
\text{recognition equivalence}
\centernot\Rightarrow
\text{selected-result equivalence}.
\]

Any portability database whose unit is “alternation supported: yes” misses the relevant fact.

### Same whole match, different capture semantics

Captures create another independently observable layer.

Python reports `None` for a group that did not participate, distinguishes that from a group that successfully captured the empty string, and returns only the final iteration when one group matches repeatedly. [source-verification note](#source-verification-gaps) PCRE2 likewise returns the final capture for a repeated group, while documenting additional subtleties for nested repeated captures and explicit unset values in its native offset vector. [source-verification note](#source-verification-gaps)

POSIX goes further: subexpression selection participates in leftmost-longest resolution. Go's POSIX mode intentionally does *not* implement the same submatch resolution rule even when the whole selected match is the same. [source-verification note](#source-verification-gaps)

Therefore:

\[
\text{whole-match equivalence}
\centernot\Rightarrow
\text{capture equivalence}.
\]

A future STRling target could legitimately be marked recognition-portable but capture-nonportable for a particular construct or profile pair.

### Same match text, different span values

A matched substring can be identical while its returned coordinates differ.

ECMAScript match records expose positions as counts of string **code units**; even when Unicode matching causes the matcher itself to consume code points, the resulting indices are converted back to string code-unit positions. [source-verification note](#source-verification-gaps)

Rust's `regex` API reports match positions as **UTF-8 byte offsets**, guaranteed to fall on valid UTF-8 boundaries for string regexes. [source-verification note](#source-verification-gaps) Go likewise says its index-returning APIs identify matches by byte-index pairs. [source-verification note](#source-verification-gaps)

For ASCII, these values accidentally coincide. After non-ASCII characters, they need not.

Thus there are two legitimate contracts:

**Native-result portability** requires the APIs to expose matching coordinate semantics. These profiles would fail.

**Normalized semantic portability** can permit STRling to translate both into a declared common unit, such as Unicode code-point offsets, provided the conversion is exact and part of the API contract.

STRling must say which contract it is making. Regex Conformance's existing principle that observations preserve native index units is exactly right: conversion belongs in a derived interpretation layer, not in raw evidence. [source-verification note](#source-verification-gaps)

### Unicode is a configuration graph, not a Boolean

“Unicode support” cannot serve as a portability dimension by itself.

Unicode Technical Standard #18 distinguishes basic code-point behavior from higher-level facilities such as extended grapheme clusters, default word boundaries, case behavior, and canonical equivalence. It requires a conformance claim to identify both the UTS version and Unicode Standard version, explicitly noting that property-based regex results can change as Unicode evolves. [source-verification note](#source-verification-gaps)

Unicode Text Segmentation separately permits precisely declared profiles and tailoring for grapheme and word boundaries. It also stresses that a user-perceived “character” can comprise multiple code points. [source-verification note](#source-verification-gaps)

Consequently the text-semantic portion of a portability profile may need to distinguish at least:

\[
\begin{aligned}
&\text{storage encoding}\\
&\text{matching atom: byte/code unit/code point/string element}\\
&\text{Unicode database version}\\
&\text{property interpretation}\\
&\text{case-folding algorithm}\\
&\text{locale/culture tailoring}\\
&\text{normalization assumption}\\
&\text{grapheme segmentation}\\
&\text{word-boundary definition}\\
&\text{newline convention}.
\end{aligned}
\]

Java illustrates how much of this can vary inside one implementation. `CASE_INSENSITIVE` is ASCII-oriented by default; `UNICODE_CASE` changes case handling; `UNICODE_CHARACTER_CLASS` changes predefined classes and implies Unicode-aware case folding; `CANON_EQ` enables canonical-decomposition equivalence; and `UNIX_LINES` changes the line terminators recognized by `.`, `^`, and `$`. [source-verification note](#source-verification-gaps)

.NET similarly exposes options that can change search direction, ECMAScript behavior, cultural treatment, backtracking strategy, and newline semantics; current documentation includes `RightToLeft`, `ECMAScript`, `CultureInvariant`, `NonBacktracking`, and `AnyNewLine`. [source-verification note](#source-verification-gaps)

PCRE2 makes newline convention and UCP/UTF behavior configurable and also supports multiple code-unit widths and build-time configuration. [source-verification note](#source-verification-gaps)

The proper conclusion is not “Unicode differs between engines.” It is:

> **Unicode semantics are part of the execution profile and therefore part of every portability claim whose recognized text depends on them.**

### Anchors and “full match” expose the host boundary

It is unsafe to synthesize every full-match operation by mechanically adding `^` and `$`.

Anchor semantics can depend on multiline mode, newline convention, final-newline handling, regions, and host-level anchoring bounds. Java's matcher, for example, can treat the boundaries of a configured region as anchoring boundaries, and this is independently configurable. [source-verification note](#source-verification-gaps) PCRE2's `$` normally also has behavior before a terminating newline and can be changed by configuration. [source-verification note](#source-verification-gaps) Unicode's regex guidance itself notes several plausible end-of-line interpretations, including end of string, before a final newline, or before any newline. [source-verification note](#source-verification-gaps)

A dedicated host operation can therefore be semantically cleaner than anchor rewriting. Python `fullmatch()` explicitly asks whether the entire specified string or region matches; Java `matches()` does the same for its matcher region; C++ `regex_match` restricts consideration to whole-range matches. [source-verification note](#source-verification-gaps)

That leads to a useful STRling rule:

> **Search scope is semantic intent. Anchoring syntax is merely one possible lowering.**

### Empty matches make global behavior a separate semantic layer

Single-match equivalence is not enough to establish iteration equivalence.

Python's `findall` and `finditer` include empty matches and explicitly changed progression behavior in Python 3.7 so a non-empty match may begin immediately after a preceding empty match. [source-verification note](#source-verification-gaps)

Go's `FindAll` family describes successive non-overlapping matches but specifically ignores empty matches abutting a previous match. [source-verification note](#source-verification-gaps)

The C++ `regex_iterator` rules are more elaborate: following a zero-length match, it first attempts a non-empty continuous match at the same position before advancing the iterator. [source-verification note](#source-verification-gaps)

ECMAScript explicitly uses `AdvanceStringIndex` when iteration must move past a zero-width condition; that operation advances one UTF-16 code unit in non-Unicode mode but one encoded code point's code-unit count in Unicode mode. [source-verification note](#source-verification-gaps)

These behaviors mean:

\[
\text{one-match equivalence}
\centernot\Rightarrow
\text{global-iteration equivalence}.
\]

For global matching, replacement, tokenization, and split, **zero-width advancement belongs in the portability contract**.

### Replacement is a separate language

A replacement string is not “just another regex.”

Python replacement templates interpret backslash escapes and references such as `\1` and `\g<name>`, and its treatment of unmatched groups in replacement changed historically. [source-verification note](#source-verification-gaps) Go replacement templates instead recognize `$name`, `${name}`, numeric `$1`, and `$$`, with unmatched or absent references becoming empty. [source-verification note](#source-verification-gaps) Java replacement strings give special meaning to `$` and backslash and also supports replacement callback operations distinct from replacement-template interpretation. [source-verification note](#source-verification-gaps)

Consequently two targets can be:

- pattern-source portable;
- recognition portable;
- match-result portable;
- and **replacement-source nonportable**.

Yet the higher-level substitution **intent** can still be portable if STRling emits a different target replacement representation or uses the host's callback API.

The correct unit is therefore:

\[
\text{rewrite intent}
=
\text{matching semantics}
+
\text{iteration semantics}
+
\text{capture semantics}
+
\text{replacement semantics}.
\]

### Version is part of semantics, not metadata

Python 3.14 changed `\B` so that it now matches the empty input; Python documentation also records earlier changes to global empty-match progression and unmatched captures in replacements. [source-verification note](#source-verification-gaps) PCRE2 currently exposes versioned APIs such as `pcre2_next_match()` and has many version-dependent matching facilities; STRling's Knowledge Program already preserves unresolved version-boundary conflicts rather than guessing. [source-verification note](#source-verification-gaps) [source-verification note](#source-verification-gaps)

So:

> **A portability statement against an unversioned engine name is, at best, shorthand for a quantified statement over some explicitly declared version range.**

If STRling means “Python `re` 3.12 through 3.14,” then each version covered is logically part of the claim. If only 3.14 was researched, the statement must not silently generalize backward or forward.

## Why different syntax can still be genuinely portable

STRling's intended compiler architecture makes this half of the framework just as important as the failure cases.

A compiler for semantic intent should be allowed to emit different syntax, different flags, or even use a different host operation when those differences preserve the required observable contract. UTS #18 explicitly treats syntax as implementation-specific and allows system-level facilities or settings to satisfy a semantic requirement when documented. [source-verification note](#source-verification-gaps)

### Named captures

Suppose the STRling intent is conceptually:

```text
capture(name = "id", oneOrMore(decimalDigit))
```

One target may require a spelling in the `(?P<id>...)` family while another accepts `(?<id>...)`. The textual regex artifacts differ. What matters for intent portability is whether:

- the same substring is captured;
- under the same conditions;
- under the logical name `id`;
- with equivalent participation and repetition semantics;
- and the host lets STRling recover it as the same semantic field.

Python documents named groups using `(?P<name>...)` and maps them to numbered groups as well. [source-verification note](#source-verification-gaps) Other target systems use different spellings. The spelling difference is a **lowering difference**, not necessarily a portability failure.

### Full-match intent

Likewise:

```text
entire input satisfies I
```

could compile to a dedicated `fullmatch`/`matches` host operation on one target and to semantically exact anchoring on another where no full-match operation exists.

Python, Java, and C++ all expose dedicated whole-input or whole-region operations. [source-verification note](#source-verification-gaps) A STRling target adapter does not become less portable by choosing those operations instead of forcing identical anchors.

In fact, forcing the same anchors could reduce portability because anchor semantics vary.

### Unicode properties

An intent such as “Unicode Letter according to Unicode version \(U\)” might be represented directly by a property escape on one target and by another semantically equivalent construct on another.

The critical qualification is the **Unicode version and property definition**. UTS #18 explicitly observes that Unicode property membership changes across versions and requires implementations claiming conformance to identify their Unicode version. [source-verification note](#source-verification-gaps) Therefore expansion to a literal set can be equivalent only against the exact property snapshot from which it was generated; it must not be treated as timelessly equivalent to a dynamically updated `\p{...}`.

Different syntax can thus be recognition-portable while having different version-maintenance characteristics.

### Different algorithms, same developer behavior

Go's regular-expression engine describes leftmost-first semantics compatible with the result policy common in Perl/Python-style engines while guaranteeing linear running time in the input size. [source-verification note](#source-verification-gaps) PCRE2's standard matcher instead uses depth-first search with backtracking and stops at the first successful path; its alternative DFA matcher has different result behavior and does not provide normal captures. [source-verification note](#source-verification-gaps)

Therefore **backtracking itself is not a semantic requirement** for an intent whose only observables are recognition and selected result. An implementation can preserve those semantics with a different algorithm.

But once the contract adds a resource requirement, the difference becomes directly relevant.

This is why STRling should distinguish:

\[
\text{semantic portability}
\quad\text{from}\quad
\text{operational portability}.
\]

### Operational portability is not reducible to matching equivalence

Two regex artifacts may return the same match for every relevant input and still be unacceptable substitutes in production.

Go's standard `regexp` package documents a linear-time guarantee. [source-verification note](#source-verification-gaps) .NET's `NonBacktracking` option likewise promises linear-time processing in input length, while ordinary backtracking mode has different operational characteristics; .NET also supports explicit regex timeouts, and the default may be effectively infinite unless configured otherwise. [source-verification note](#source-verification-gaps) PCRE2 exposes match/depth/heap limits and distinguishes interpreter, JIT, and alternative matching modes whose limits do not all apply in the same way. [source-verification note](#source-verification-gaps)

Accordingly an operational portability contract might say:

> “For subjects up to \(n\) bytes, matching must terminate without resource-limit errors, without recursion-dependent stack exhaustion, and under the application's 50 ms timeout.”

That is a legitimate portability requirement even when the accepted strings and captures are identical.

Conversely, STRling should not implicitly promise identical wall-clock performance merely because it says a semantic pattern is portable. Hardware, JIT state, optimization, process load, allocation policy, and input distribution make such a promise far stronger than semantic equivalence.

A useful separation is:

- **semantic operational compatibility:** required termination/complexity/limit properties;
- **performance equivalence:** comparable measured latency/resource consumption under a stated benchmark environment.

The latter should normally be empirical and environment-specific, not part of ordinary “portable regex” wording.

## Evidence, uncertainty, and portability conclusions

The semantic definition and the **epistemic status of a portability claim** must remain separate.

This separation is already foundational in STRling's ecosystem. Regex Conformance distinguishes normative expectations, probes, observations, findings, and inferences; it explicitly refuses to turn a controlled observation into a standards guarantee. [source-verification note](#source-verification-gaps) The Regex Knowledge Program similarly requires claim-level evidence, preserves conflicts, and says `UNKNOWN` must never be silently converted into `UNSUPPORTED`. [source-verification note](#source-verification-gaps)

### Recommended evidence model

A durable portability claim should contain at least these fields:

| Claim field | Required content |
|---|---|
| **Claim subject** | STRling intent, source pattern, or concrete target artifacts being compared |
| **Profile scope** | exact stable IDs for every execution profile |
| **Version scope** | exact versions or explicitly bounded version range |
| **Operation** | search/full/prefix/global/split/replace/etc. |
| **Configuration** | all semantically relevant flags, modes, locales, Unicode settings, build modes, host settings, start regions, matcher choice |
| **Input domain** | all strings; Unicode scalar-value strings; valid UTF-8 only; ASCII only; bounded length; application-specific language; etc. |
| **Observable contract** | exact portability dimensions being asserted |
| **Normalization** | any permitted conversion of native output, especially spans |
| **Target artifacts** | exact emitted regex, flags, replacement template/callback strategy, and relevant host invocation |
| **Normative evidence** | controlling specifications, official documentation, and versioned release evidence for underlying semantics |
| **Empirical evidence** | exact Conformance observations supporting or challenging the claim |
| **Counterexamples** | known witnesses demonstrating failed dimensions |
| **Derivation** | how the portability conclusion follows from component claims |
| **Evidence status** | proven, normatively justified, empirically observed, inferred, disputed, unknown, etc. |
| **Conditions/gaps** | assumptions, exclusions, unresolved conflicts, and untested boundaries |

The Unicode standards provide an instructive precedent: conformance claims are expected to identify versions, clearly describe partial support, and document optional settings or profiles rather than hiding them. [source-verification note](#source-verification-gaps)

### Evidence strength must not be collapsed into the verdict

STRling should distinguish at least these evidence bases:

**Formally established** — a valid proof exists for the stated mathematical/model scope and assumptions. This report does not assert that such proof is always available; equivalence algorithms are explicitly outside its scope.

**Normatively established** — authoritative specifications make the relevant semantics sufficiently definite that the portability result follows for the stated profiles and conditions.

**Empirically exhaustive over a finite domain** — every member of a genuinely finite declared domain has been tested under adequately controlled profiles.

**Empirically confirmed on vectors** — controlled tests agree on a non-exhaustive test set.

**Inferred** — evidence supports the conclusion but leaves a logical or documentary gap.

**Conflicted or indeterminate** — primary authorities conflict, profile identity is incomplete, a necessary semantic detail is unspecified, or evidence is insufficient.

These statuses answer a different question from the semantic verdict.

A valid empirical counterexample is particularly important:

\[
\exists x\in D:
O_P(x)\ne O_Q(x)
\]

is sufficient to refute a universal portability claim over \(D\).

The reverse does not hold:

\[
\forall x\in C\subset D:
O_P(x)=O_Q(x)
\]

for a finite test corpus \(C\) ordinarily establishes only agreement on \(C\), not all of \(D\).

That distinction should be prominent in Regex Conformance-derived portability reporting. Passing 50,000 adversarial vectors may provide excellent confidence, but unless the declared domain is exactly those 50,000 cases or another valid argument closes the gap, it is not a universal proof.

### Recommended verdict vocabulary

A four-way semantic verdict is clearer than overloaded yes/no:

| Verdict | Meaning |
|---|---|
| **Portable** | All required dimensions in the stated contract are established equivalent for the stated scope to the required evidence standard. |
| **Portable with conditions** | Equivalent only when explicit profile/configuration/domain conditions hold. |
| **Non-portable** | At least one required dimension has an established semantic difference; ideally a counterexample is known. |
| **Indeterminate** | Available evidence cannot responsibly establish either portability or non-portability. |

The vector beneath the aggregate verdict should retain dimension-level states such as:

```text
construction       equivalent
recognition        equivalent
selection          different
captures           different
span-unit          different-native / normalizable
iteration          unknown
replacement        not-applicable
operational        unknown
```

This is much more informative than “72% compatible.”

“Partially portable” should generally be avoided as the final machine classification. It hides *which* dimensions are preserved. Human prose can say “portable for recognition but not capture extraction.”

### Conditions must be first-class

Consider a pattern that is semantically portable only when:

- both targets run in Unicode mode;
- PCRE2 has UCP enabled;
- .NET culture-dependent matching is disabled;
- the operation is full-match;
- the input is normalized to NFC;
- the application never inspects native span units.

That is not an embarrassing near-failure. It is a legitimate **conditional portability contract**.

UTS #18 explicitly accommodates functionality enabled by special settings and surrounding-system normalization, provided it is documented. [source-verification note](#source-verification-gaps) STRling should adopt the same discipline.

### Unspecified behavior must propagate uncertainty

Suppose one profile's specification does not define duplicate named-group behavior. An implementation test gives the desired answer today.

STRling should not silently upgrade that to an unconditional cross-version guarantee.

The correct conclusion may be:

> **Empirically portable for profile X version 4.2.1 under operation Y; normative portability across future versions is indeterminate because the behavior is not guaranteed by the controlling specification.**

Likewise, implementation-specific limits can turn a semantically valid target into a conditional one. PCRE2 exposes configurable matching and depth/heap limits; Java documents memory-risk implications for some canonical-equivalence cases. [source-verification note](#source-verification-gaps) Those conditions belong in the profile or portability contract when they can make valid subjects fail operationally.

## Recommended STRling model and ecosystem implications

The conceptual framework has direct consequences for every component named in the request.

### Recommended terminology

The following vocabulary would give STRling a precise language without forcing a compatibility database.

| STRling term | Recommended definition |
|---|---|
| **Regex system** | An identifiable regex language/dialect/semantic tradition, not necessarily one implementation. |
| **Execution profile** | The smallest versioned configuration bundle sufficient to determine behavior for the observations STRling models. |
| **Target profile** | A compiler-facing target specification constraining one execution profile or a declared set of execution profiles. |
| **Pattern artifact** | Concrete emitted pattern plus regex-local configuration necessary to interpret it. |
| **Operation profile** | Host operation and its relevant state/configuration: search, full-match, global iteration, replace, etc. This may be a component of the execution profile rather than a separate top-level entity. |
| **Text profile** | Encoding/unit model, Unicode version/data, normalization assumptions, locale/tailoring, newline and boundary policy. |
| **Replacement profile** | Replacement grammar and operation-specific substitution behavior. |
| **Portability dimension** | One independently observable semantic aspect whose equivalence may be claimed. |
| **Portability contract** | Profiles, domain, observables, normalization, conditions, and operational obligations defining what “portable” means for one claim. |
| **Portability claim** | A scoped proposition that a contract is satisfied. |
| **Intent portability** | Ability to lower one STRling semantic intent to artifacts satisfying the same contract across targets. |
| **Source portability** | Reusability of the same concrete regex source/artifact; narrower than intent portability. |
| **Semantic divergence** | Established difference in a portability dimension. |
| **Portability witness** | Input/configuration demonstrating a semantic divergence. |
| **Conditional portability** | Portability dependent on explicit configuration or domain predicates. |
| **Portability evidence status** | Epistemic classification of how strongly the claim has been established. |

The term **compatibility** should be retained for looser ecosystem relationships where appropriate, but STRling documentation should not use “compatible” as a synonym for rigorously established semantic portability.

### STRling target planning

Target planning should be based on **semantic preservation obligations**, not a list of supported tokens.

The current STRling specification distinguishes “core” features supported across targets from engine-specific extensions and tells emitters to warn when semantics may differ. [source-verification note](#source-verification-gaps) That is a useful starting point, but the formal framework suggests a refinement:

> **“Core” should identify target-independent semantic intent, not itself constitute proof that every profile realizes every observable identically.**

A core construct may have:

- a direct exact lowering on one target;
- a rewritten exact lowering on another;
- an exact lowering only under a required option on another;
- a recognition-exact but capture-inexact lowering elsewhere;
- or no valid lowering for the requested portability contract.

Thus an emitter decision should conceptually return more than “supported/unsupported.” It should be able to produce something equivalent to:

```text
lowering: exact
required_configuration:
  unicode_mode: true
preserved:
  recognition: yes
  selection: yes
  captures: yes
  iteration: yes
  replacement: not_applicable
native_span_model:
  unit: utf16_code_unit
normalization:
  available: code_point
conditions: [...]
evidence_refs: [...]
```

A target profile can therefore be eligible for one operation class and ineligible for another. PCRE2 is a particularly clear example: its alternative matching function can operate on the same general pattern ecosystem but does not provide ordinary capturing substrings and has different multiple-match behavior. [source-verification note](#source-verification-gaps) A blanket “PCRE2 target supported” loses that distinction.

A useful compiler artifact would be a **portability manifest** accompanying generated output. It need not expose every detail to casual users, but it could record the exact target profile, generated pattern, required host operation, flags, text assumptions, result normalization, semantic preservation class, warnings, evidence state, and excluded dimensions.

### Regex Knowledge

The Knowledge Program is already structurally close to what portability requires. It treats profiles, features, capabilities, Unicode behavior, host APIs, replacement behavior, version relations, evidence, and uncertainty as distinct facts. [source-verification note](#source-verification-gaps)

The key recommendation is **not to build an \(N^2\) pairwise portability table**.

Instead, Knowledge should hold atomic propositions from which scoped portability can be derived:

```text
profile A + feature F + condition C -> semantic behavior X
profile B + feature F + condition D -> semantic behavior X
```

alongside match-policy, operation, capture, text, iteration, replacement, and limit claims.

A portability relation should exist as a first-class researched or derived claim only when useful, and its identity should include at least:

\[
(\text{profile A},\text{profile B},\text{contract},\text{version scope})
\]

rather than merely:

\[
(\text{engine A},\text{engine B}).
\]

This avoids combinatorial database construction while still supporting Compare and compiler decisions.

The Knowledge Program's existing requirement that `UNKNOWN` remain distinct from `UNSUPPORTED`, and its explicit confidence vocabulary for confirmed/probable/possible/ambiguous/disputed/unresolved/unknown claims, are especially important for portability. [source-verification note](#source-verification-gaps)

### Regex Conformance

Regex Conformance should measure the **dimensions**, not try to own the conceptual portability verdict.

That respects its existing charter: reproduce exact profile executions and preserve observations without converting them into normative guarantees. [source-verification note](#source-verification-gaps)

Portability-oriented probe families should deliberately discriminate among:

- ambiguous alternation;
- greedy/lazy ambiguity;
- whole-match versus submatch tie-breaking;
- optional-group nonparticipation versus empty capture;
- repeated captures;
- duplicate/named capture behavior;
- supplementary Unicode code points;
- combining sequences and grapheme boundaries;
- Unicode property/version boundaries;
- case-fold corner cases;
- locale-sensitive matching;
- CR/LF/CRLF/NEL/LS/PS handling;
- `^`, `$`, absolute anchors, and region bounds;
- zero-width matches at beginning/end/interior positions;
- consecutive/global empty-match progression;
- native match-span units;
- replacement interpolation and unmatched captures;
- operation differences;
- configured resource/limit failures.

The raw observations should continue preserving native units and exact profile identity. Derived comparison can then normalize them explicitly. That is already consistent with the repository's stated governing principles. [source-verification note](#source-verification-gaps)

### Audit

An Audit surface should answer:

> **What exactly was promised, why did STRling believe it, and which assumptions can invalidate the promise?**

For every portability-sensitive artifact, Audit should expose:

- target profile identity;
- semantic contract;
- required options/configuration;
- exact lowering;
- dimensions preserved;
- dimensions intentionally unobserved;
- known divergences;
- evidence class;
- last applicable version;
- unresolved evidence conflicts;
- relevant Conformance observations.

The most important audit behavior is **downgrade visibility**. If a user intended capture portability but a target was only established recognition-portable, the audit should not bury that distinction inside a generic warning.

### Compare

Compare should primarily compare **semantic contracts**, not feature rows.

A useful profile comparison might read:

| Dimension | Profile A vs Profile B |
|---|---|
| Source syntax | accepted in both |
| Recognition | established equivalent under Unicode mode |
| Match selection | different on ambiguous alternatives |
| Optional captures | equivalent |
| Repeated capture history | API capabilities differ |
| Native spans | UTF-16 units vs UTF-8 bytes |
| Normalized code-point spans | equivalent |
| Empty global progression | different |
| Replacement template | different syntax; equivalent STRling rewrite lowering available |
| Complexity guarantee | materially different |
| Overall | intent-portable for full-match validation; not operation-portable for global extraction |

That communicates information a traditional green/red compatibility matrix cannot.

### Future public documentation

Public documentation should consistently complete the sentence:

> **Portable for what?**

Recommended examples include:

> “Portable for full-match validation across the selected profiles.”

> “Portable for search and capture extraction; native span units differ and STRling normalizes them to code-point offsets.”

> “Conditionally portable: Unicode property behavior requires the listed Unicode modes and is guaranteed only for the stated Unicode versions.”

> “Recognition-portable, but not global-iteration portable because empty-match progression differs.”

> “The intent is portable, but the generated regex text is target-specific.”

> “Observed equivalent on the current Conformance corpus; universal semantic equivalence has not been established.”

These are substantially more useful than “works in Python, JavaScript, and PCRE2.”

### Compact examples showing why yes/no fails

The following examples summarize the framework without becoming an engine database.

| Case | Simple compatibility answer | Rigorous answer |
|---|---|---|
| `\w+` in Python and ECMAScript | “Both support `\w`.” | Syntax accepted; recognized character set differs under common defaults. [source-verification note](#source-verification-gaps) |
| `a\|aa` under leftmost-first vs leftmost-longest | “Alternation supported.” | Same recognition set under full match, different selected search result. [source-verification note](#source-verification-gaps) |
| Go `CompilePOSIX` vs POSIX | “POSIX mode supported.” | Whole-match policy is leftmost-longest, but documented submatch tie-breaking differs. [source-verification note](#source-verification-gaps) |
| Match after non-ASCII prefix in JavaScript vs Rust | “Both found the same substring.” | Text value may agree while native offsets use UTF-16 code units versus UTF-8 bytes. [source-verification note](#source-verification-gaps) |
| Python vs Go global empty matches | “Both have find-all.” | Empty-match progression policies differ, potentially changing result sequence. [source-verification note](#source-verification-gaps) |
| PCRE2 `pcre2_match` vs `pcre2_dfa_match` | “Same engine/version.” | Operation changes selection capabilities, greediness relevance, captures, supported features, and performance properties. [source-verification note](#source-verification-gaps) |
| Java `find()` vs `matches()` | “Same regex.” | Search and entire-region recognition are different operations. [source-verification note](#source-verification-gaps) |
| Python replacement vs Go replacement | “Same captures.” | Pattern behavior may agree while replacement languages use different interpolation syntax and unmatched-reference rules. [source-verification note](#source-verification-gaps) |
| `.NET` default vs `RightToLeft` | “Same .NET regex.” | Search direction is configuration and can change selected-result semantics. [source-verification note](#source-verification-gaps) |
| Same Unicode property across releases | “Same `\p{...}`.” | Property membership is versioned; UTS #18 expressly requires Unicode-version identification. [source-verification note](#source-verification-gaps) |
| Same result in Go and a backtracking target | “Portable.” | Semantic result may be portable while operational guarantees differ; Go documents linear-time matching. [source-verification note](#source-verification-gaps) |

The recurrent lesson is that **feature availability is an input to portability analysis, not the portability result**.

## Open questions and the precise STRling promise

Several matters remain architectural or product-policy choices rather than questions with universal regex-industry answers.

| Open question | Why STRling must decide it |
|---|---|
| **What is STRling's canonical span unit?** | Native APIs return bytes, UTF-16 units, code-point-oriented positions, or iterator locations. If STRling exposes one normalized unit, that becomes part of its semantic specification. |
| **Are native spans still available?** | Hiding native units simplifies portability but may obstruct zero-copy host integration; exposing them creates an additional result contract. |
| **What is STRling's normalization policy?** | “Code-point intent” does not itself say whether canonically equivalent NFC/NFD strings should match equally. Unicode explicitly treats canonical equivalence as a separate facility. [source-verification note](#source-verification-gaps) |
| **Which Unicode version governs an intent?** | Target runtimes can ship different Unicode data. A moving “latest Unicode” contract and a pinned version contract have different portability properties. |
| **What exactly is STRling's word-boundary semantic?** | UAX #29 supports default and tailored profiles, while common regex `\b` definitions often differ. [source-verification note](#source-verification-gaps) |
| **Are capture histories part of STRling's model?** | Some APIs expose only a final capture; others can expose repeated-capture collections. The answer determines the capture-portability contract. |
| **What should duplicate named captures mean?** | This cannot safely be inferred from mere syntax support; STRling needs a canonical intent or should forbid ambiguous constructs in portable intent. |
| **Is overlap a first-class iteration policy?** | Many standard “global” operations are non-overlapping. An overlap-aware STRling operation would require explicit target lowering rather than relying on native defaults. |
| **Does portability include malformed text?** | UTF-8/UTF-16 implementations can differ substantially on ill-formed input; the input domain should say whether malformed encodings are excluded. PCRE2, for example, has explicit invalid-UTF-related options and matcher restrictions. [source-verification note](#source-verification-gaps) |
| **What operational guarantees belong to the language specification?** | A semantic DSL could promise only results, or additionally reject targets unable to meet a complexity/timeout/safety policy. Those are materially different portability products. |
| **How much evidence is required for the public word “portable”?** | STRling needs a certification threshold: normative reasoning, verified Conformance evidence, proof where available, or some combination. Passing probes alone should not imply unbounded proof. |
| **How are version ranges maintained?** | A claim verified for versions \(v_1\ldots v_n\) should not silently apply to \(v_{n+1}\). Release admission and regression policy therefore affect public portability guarantees. |
| **What is the default contract when the user does not request captures or replacement?** | Portability should be intent-sensitive: demanding irrelevant equivalence would unnecessarily reject good targets, while ignoring observable behavior that the API exposes could overclaim portability. |

The strongest recommended semantic rule is that **relevance is determined by the STRling intent and operation**.

Suppose the developer writes a boolean full-string validator with no capture access. Differences in repeated-capture history are irrelevant to that claim. But differences in Unicode classes, case folding, entire-input semantics, or resource failure can be highly relevant.

Suppose instead the developer requests global capture extraction with source locations. Recognition alone is nowhere near enough: selection, participation, repeated captures, span units, zero-width progression, and global iteration now enter the contract.

Suppose the developer requests substitution. Replacement semantics enter as well.

Thus portability should be expressed as:

\[
\operatorname{Portable}
(
I,
P_1,
P_2,
C,
\mathcal{E}
)
\]

where \(I\) is intent, \(P_1/P_2\) are exact profiles, \(C\) is the semantic contract, and \(\mathcal{E}\) is the evidence basis.

### Recommended normative definition for STRling

A concise definition suitable for a future STRling specification is:

> **Regex portability** is the preservation of a declared set of observable regex semantics across declared execution profiles for a declared input domain and operation. Two executions are portable with respect to a portability contract when their required observations are equivalent after only the explicitly permitted result normalization, and when any declared operational constraints are also satisfied. Portability does not require identical target syntax or implementation algorithms. It does require explicit treatment of every profile parameter capable of changing a required observable.

For a compiler, add:

> **STRling intent portability** is the ability to lower one STRling pattern intent to each selected target profile such that the resulting target artifacts satisfy the same portability contract. The emitted artifacts may differ syntactically, in flags, or in host invocation strategy.

And for pattern source:

> **Regex source portability** is the narrower property that the same source artifact is usable across the selected profiles under the required configurations. Source portability alone does not establish behavioral portability.

### What STRling is claiming when it says “portable”

The complete conceptual answer to the research question is therefore:

> **When STRling tells a developer that a pattern is portable, it should be claiming that, for the exact target execution profiles and version/configuration scope it names, the generated artifacts preserve the developer-observable semantics required by that STRling pattern intent and operation over the stated input domain.**
>
> **That claim includes recognition semantics and, where relevant, selected-match behavior, capture values and participation, repeated and named captures, span interpretation, Unicode/text semantics, anchors and boundaries, zero-width and global progression, host-operation behavior, and replacement output. It includes resource or performance properties only when the portability contract explicitly says it does.**
>
> **The claim does not mean that the target regex strings are identical, that the engines use the same matching algorithm, that every feature of the engines is mutually compatible, or that empirical agreement on a finite test corpus proves universal equivalence.**
>
> **Any required option, Unicode version, locale, runtime configuration, host operation, replacement profile, version bound, normalization step, limit, exclusion, unresolved conflict, or evidentiary weakness is part of the portability conclusion rather than incidental metadata.**
>
> **If a required observable is known to differ, the intent is non-portable for that contract. If the behavior can be preserved only under explicit conditions, it is conditionally portable. If the evidence is insufficient or conflicting, portability is indeterminate—not unsupported and not silently assumed.**

This model fits the existing division of authority in STRling's ecosystem: the formal STRling specification owns intent semantics; Regex Knowledge can own researched profile semantics and scoped portability propositions; Regex Conformance can supply reproducible observations without overclaiming what they prove; and Audit/Compare can expose the resulting contract, differences, conditions, and evidence transparently. [source-verification note](#source-verification-gaps) [source-verification note](#source-verification-gaps) [source-verification note](#source-verification-gaps)
