# Regular-Expression Computational Safety for STRling: A Modern ReDoS and Complexity Review

Role: Research report
Origin: AI-assisted deep-research session commissioned for STRling Research Intelligence; the underlying sources, not the AI system, are the evidence authorities.
Generated: 2026-08-12
Imported: 2026-08-12
Source verification: Partially verified
Last reviewed: 2026-08-12
Current status: Active input

## Source verification gaps

Current STRling safety-analysis and target-planning status was checked at [`9991575`](https://github.com/strling-lang/strling/tree/9991575b347ac5f56108f18065c88b2b16a5065a). Selected engine and standards claims were checked against [PCRE2 performance](https://www.pcre.org/current/doc/html/pcre2perform.html), [RE2 syntax and guarantees](https://github.com/google/re2/wiki/Syntax), [Rust `regex` documentation](https://docs.rs/regex/latest/regex/), [.NET `RegexOptions.NonBacktracking`](https://learn.microsoft.com/en-us/dotnet/api/system.text.regularexpressions.regexoptions), [V8's non-backtracking engine](https://v8.dev/blog/non-backtracking-regexp), and [Ruby Regexp](https://docs.ruby-lang.org/en/master/Regexp.html).

The original research-session marker map is unavailable. Unreconstructed markers link here. Exact results attributed to the 2025 ReDoS systematization, emerging 2026 backreference work, analyzer precision/recall, and version-specific mitigation eligibility need claim-level verification. The proposed safety-result vocabulary remains a candidate model.

## Executive conclusion and modern threat model

The central conclusion is that **STRling should not offer a scalar claim that a regex is simply “safe” or “unsafe.”** Modern regular-expression safety is a property of a *system configuration*: the source pattern, semantic feature set, matching operation, target engine and version, engine mode and optimizations, subject-input bounds, pattern trust, resource limits, and deployment context. The 2025 ASIA CCS systematization of ReDoS research reached essentially the same engineering conclusion: many mainstream runtimes have acquired partial or full defenses, making older threat models based only on “backtracking engine + ambiguous regex” obsolete, while the remaining defenses are heterogeneous and often incomplete. [source-verification note](#source-verification-gaps)

For STRling, that conclusion is especially important because the project describes itself as a compiler with a target-independent IR that emits target-specific patterns for engines including PCRE2, JavaScript, and Python. That architecture means the same logical STRling expression may be executed by materially different algorithms after lowering. [source-verification note](#source-verification-gaps) A safety conclusion therefore belongs naturally to a **target profile**, not merely to the source AST.

A rigorous conceptual model is:

\[
\text{Safety Result} =
f(P,\;O,\;T,\;V,\;C,\;I,\;B_P,\;B_I,\;B_R,\;D)
\]

where \(P\) is the pattern, \(O\) the operation such as anchored match/search/find-all/replace, \(T\) the target engine, \(V\) its version, \(C\) its configuration/mode, \(I\) the subject input, \(B_P\) and \(B_I\) pattern/input bounds, \(B_R\) runtime resource limits, and \(D\) the deployment context. This is a synthesis of what current engine documentation and recent ReDoS research imply: matching algorithm, operation, and resource policy can independently change the practical result. [source-verification note](#source-verification-gaps)

### The modern threat model

A current threat model should distinguish **two independent attacker-control axes**.

The traditional case is **trusted pattern, attacker-controlled subject**. A developer writes a pathological pattern and an attacker chooses a string that drives the matcher into its worst case. Classical catastrophic backtracking belongs here. Backtracking implementations can explore a polynomial or exponentially growing number of paths on near-matching or failing inputs. A simple model gives quadratic behavior for constructions such as adjacent ambiguous repetitions and exponential behavior for nested ambiguous repetition. [source-verification note](#source-verification-gaps)

The second case is **attacker-controlled pattern**, with either trusted or attacker-controlled subject. This is increasingly relevant to search APIs, glob-to-regex compilers, filtering systems, IDEs, query languages, and any future STRling functionality that accepts generated or runtime patterns. Here, execution-time ReDoS is only one hazard: parsing, counted-repetition expansion, DFA determinization, Unicode-class expansion, compilation memory, generated-code size, and matcher-state memory can themselves become denial-of-service vectors. RE2 explicitly designs its parser, compiler, and execution engines to operate within memory budgets; Rust's `regex` documentation separately warns that untrusted patterns need pattern-size and compiled-size limits; and explicit DFA construction can take exponential time and space in the pattern size. [source-verification note](#source-verification-gaps)

A third dimension is **system reachability and exploitability**. A mathematically superlinear pattern is not automatically a remotely exploitable ReDoS vulnerability. An adversary must be able to reach it with an appropriate input, at a feasible payload size and rate, without upstream length limits, rate limiting, timeouts, process isolation, engine fallbacks, or other controls neutralizing the asymmetry. The 2025 SoK found that only a minority of the research it surveyed modeled these application-level conditions explicitly, and that end-to-end weaponization was evaluated far less frequently than isolated regex slowdown. [source-verification note](#source-verification-gaps) A black-box study of live services illustrates the distinction: it found services publishing structurally unsafe regexes, but only a subset were actually exploitable through their APIs. [source-verification note](#source-verification-gaps)

Consequently, STRling should distinguish at least four questions that historical ReDoS discussions often collapse:

| Question | What it actually asks |
|---|---|
| **Theoretical complexity** | What asymptotic behavior follows from a formal matcher model and pattern family? |
| **Implementation complexity** | What does this concrete engine/version/mode actually execute after optimizations, memoization, fallback, JIT, etc.? |
| **Resource exposure** | Is execution or compilation bounded by timeout, step count, memory, pattern size, input size, or isolation? |
| **Exploitability** | Can an adversary reach the operation with a practical payload and cause meaningful service degradation? |

The most useful top-level promise for STRling is therefore:

> **STRling can provide evidence-qualified safety intelligence: formal guarantees for explicitly modeled subsets, conservative risk findings where sound analysis is possible, engine-aware mitigation status, empirical characterization on concrete targets, and an explicit `unknown` result where the evidence does not justify a stronger claim.**

That promise is stronger and more defensible than either “we detect dangerous regexes” or “we prove regexes safe.”

## Computational hazard taxonomy

“Catastrophic backtracking” is an important hazard, but it is not synonymous with regex computational risk. Modern safety analysis needs to cover at least the following classes.

### Backtracking path explosion

A traditional Perl-style matcher recursively or iteratively explores alternatives in priority order. When multiple paths consume the same portions of a subject and a later component fails, the engine may reconsider enormous numbers of decompositions. Classical examples include nested ambiguous repetitions and overlapping alternatives. The 2025 SoK illustrates both polynomial and exponential behavior in simple backtracking models: repeated overlapping pieces can yield \(n^2\)-type behavior, while nested ambiguity can yield \(2^n\)-type behavior on a failing suffix. [source-verification note](#source-verification-gaps)

It is useful to distinguish:

**Exponential ambiguity.** The number of relevant paths grows exponentially with subject length. Patterns analogous to `(a+)+`, `(a|aa)+`, or ambiguous repetitions nested under another repetition are the canonical family. Such behavior can become catastrophic at surprisingly short inputs if the engine actually enumerates those paths. PCRE2's own performance documentation warns about nested indefinite repeats and explains why a repeated group can admit rapidly growing numbers of decompositions. [source-verification note](#source-verification-gaps)

**Polynomial ambiguity.** The number of alternatives may grow as \(n^2\), \(n^3\), or higher rather than \(2^n\). This is not a benign category. Ecosystem research found polynomial cases to be a major part of the superlinear regex population, and modern ReDoS work explicitly treats both polynomial and exponential behavior as security relevant. [source-verification note](#source-verification-gaps) A quadratic matcher processing megabyte-scale data at high request concurrency can be more operationally important than an exponential pattern whose attack family requires conditions never reached in production.

### Restart and operation-level amplification

Complexity is not only a property of a single anchored attempt. Search APIs may repeatedly restart matching at successive positions. OpenJDK's still-draft predictable-regex proposal explicitly notes that `Matcher.find()` introduces an implicit scan over candidate start positions and can turn otherwise costly matching into \(O(N^2)\)-style search behavior. [source-verification note](#source-verification-gaps)

Rust provides an even clearer current example. Its `regex` crate guarantees worst-case \(O(mn)\) for operations such as one `find` or `captures`, where \(m\) reflects regex size and \(n\) input size, but documents \(O(mn^2)\) worst-case behavior for `find_iter` and `captures_iter` because multiple searches may scan the haystack repeatedly. [source-verification note](#source-verification-gaps)

STRling should therefore analyze or at least record the **operation**. A statement about an anchored validation match cannot silently be reused for global extraction, repeated search, split, or replacement.

### Bounded-repetition and counting hazards

A major obsolete assumption is that eliminating backtracking automatically eliminates all computational hazards. Turoňová et al.'s USENIX Security 2022 work demonstrated that bounded quantifiers can create expensive behavior in nonbacktracking matchers and developed adversarial inputs specifically for such engines. Their experiments included production-grade nonbacktracking technologies and showed that counted repetition is a meaningful distinct attack surface. [source-verification note](#source-verification-gaps)

Counted repetition also creates **compile-time** hazards. PCRE2 documents that bounded repetitions of groups can be expanded in compiled code; its example `(abc|def){2,4}` is represented by repeated copies of the group. [source-verification note](#source-verification-gaps) Rust similarly explains that counted repetitions are expanded during compilation before its NFA size limit is enforced. [source-verification note](#source-verification-gaps)

This class matters because a source expression can have tiny textual size while implying a much larger automaton or compiled representation.

### Automaton and determinization explosion

Thompson-style NFA simulation avoids exponential backtracking over the *subject*, but converting an NFA to a full DFA can require exponentially many states in the *pattern*. Rust's `regex-automata` documentation gives a concrete family, `[01]*1[01]{N}`, whose explicit DFA has approximately \(2^{N+2}\) states. It consequently warns against compiling untrusted patterns directly into that DFA representation. [source-verification note](#source-verification-gaps)

This yields an important rule:

> **Execution-time linearity in \(n\) does not imply compile-time linearity in \(m\), bounded memory, or safety for attacker-controlled patterns.**

OpenJDK's predictable-regex design discussion independently highlights exactly this tradeoff: linear matching algorithms can require exponential compilation resources unless an implementation imposes resource checks or uses lazy/bounded representations. [source-verification note](#source-verification-gaps)

### Memory amplification

Memoization, active-state simulation, DFA caches, capture tracking, and backtracking stacks trade CPU for memory. A runtime may eliminate catastrophic recomputation while becoming vulnerable to excessive state retention. Ruby's documentation is unusually explicit: `Regexp.linear_time?` can report that its memoization optimization applies, but Ruby still warns that an untrusted pattern may consume large amounts of memory even when matching is linear in input length. [source-verification note](#source-verification-gaps)

PCRE2 separately provides heap, match, and depth limits because time and memory are not interchangeable resources; moreover, some limits apply differently or not at all under JIT. [source-verification note](#source-verification-gaps)

A useful STRling safety model therefore needs at least **time**, **memory**, and **compiled representation size** as separate dimensions.

### Advanced-feature hazards

Backreferences, recursive subpatterns, conditionals, lookaround, balancing groups, callouts, and engine-specific control verbs alter either the recognized language, the machine state required for matching, or both.

Backreferences are the clearest boundary. They make practical regex languages strictly more expressive than regular languages; recent theoretical work continues to characterize that additional expressive power. [source-verification note](#source-verification-gaps) A 2026 study of backreference-induced ReDoS developed a memory-automaton model and found superlinear cases even where conventional sink-ambiguity analysis would regard the underlying ambiguity as linear, demonstrating a concrete blind spot in older analyzers. [source-verification note](#source-verification-gaps)

By contrast, **lookaround should not simply be classified as “non-regular.”** Symbolic-derivative research has shown that useful forms of lookaround can be given regular-language semantics and matched without backtracking; RE# reports input-linear matching for a language that includes restricted lookarounds. [source-verification note](#source-verification-gaps) Yet .NET's production `NonBacktracking` mode rejects lookarounds, and V8's documented fallback excludes lookahead/lookbehind. [source-verification note](#source-verification-gaps) Thus “regular in theory” and “supported by this engine's safe mode” are different facts.

### Limit-exhaustion hazards

A timeout, match-step limit, or backtracking cap changes an unbounded computation into a bounded failure mode. That is useful, but it is not equivalent to proving that matching has acceptable asymptotic complexity.

PCRE2's match limit, for example, bounds an internal work counter and returns an error when exhausted; its semantics differ across interpreted, DFA, and JIT matching. [source-verification note](#source-verification-gaps) The 2026 backreference ReDoS study is a particularly important warning: it reports attacks in which hitting PCRE's matching limit could be used not just for slowdown but to bypass expected intrusion-detection behavior. [source-verification note](#source-verification-gaps)

Therefore STRling should never translate:

`has a backtracking limit`

into:

`safe`.

The truthful statement is:

`resource-capped under configuration X; exceeding the cap produces outcome Y`.

## Analytical techniques and strength of evidence

There is no single universally superior ReDoS detector. The strongest practical strategy is a **portfolio of analyses with explicit epistemic status**.

### Structural and heuristic analysis

The simplest analyzers search the AST for patterns historically associated with bad backtracking: nested quantifiers, overlapping alternatives, adjacent repetitions, nullable bodies under repetition, or ambiguous quantified subexpressions.

Their strengths are excellent scalability and understandable diagnostics. Their weakness is that syntax is only a proxy for runtime behavior. Nested repetition can be harmless when alphabets do not overlap or an engine's optimizer proves failure early; conversely, important polynomial cases, restart amplification, backreferences, or generated-pattern hazards need not resemble the textbook nested-quantifier shape. PCRE2 itself demonstrates why structural rules alone are insufficient: it automatically possessifies some repetitions and performs start optimizations that eliminate backtracking paths in cases that would look hazardous under a naïve syntax rule. [source-verification note](#source-verification-gaps)

The 2025 SoK's comparison of detector families likewise found substantial precision/recall variation among heuristic tools. [source-verification note](#source-verification-gaps)

For STRling, structural checks are excellent as **fast first-pass diagnostics**, not as universal proof certificates.

### Ambiguity and automata analysis

For ordinary regular languages, a pattern can be translated into an automaton and its possible paths studied. Ambiguity theory is considerably richer than the popular binary distinction between “ambiguous” and “unambiguous.” Classical automata research showed that infinite ambiguity can be recognized and that polynomial ambiguity growth can be characterized algorithmically; Weber and Seidl gave polynomial-time methods for key ambiguity properties of NFAs. [source-verification note](#source-verification-gaps)

ReDoS work adapted this insight to regex backtracking. Weideman et al. modeled matching-time behavior through NFA ambiguity, while other static work identifies a prefix, a pumpable ambiguous core, and a rejecting suffix that forces exploration. The modern SoK groups such NFA/pNFA analyses among the main formal ReDoS techniques. [source-verification note](#source-verification-gaps)

This is powerful because it can distinguish **polynomial versus exponential ambiguity** and can often synthesize a witness family. But there is a qualification that matters for STRling:

> An ambiguity result is exact only relative to the chosen automaton and matcher semantics.

A production engine may auto-possessify, memoize, cache repeated states, switch engines, apply prefix search, JIT-compile the pattern, or represent captures in ways not reflected in the abstract automaton. Conversely, an abstract NFA may fail to model costs introduced by backreferences or other stateful extensions. The 2026 backreference work demonstrates the latter explicitly. [source-verification note](#source-verification-gaps)

### Tree and abstract-interpretation approaches

Another class models the actual search tree rather than only the language accepted by the regex. Parolini and Miné's sound static analysis constructs a tree semantics and overapproximates dangerous words. Their reported analysis is deliberately conservative: within its model it is designed to cover attacks at the price of possible false positives. On a 74,669-regex evaluation corpus, the authors reported fast termination for nearly all cases and no observed false negatives versus the evaluated ground truth. [source-verification note](#source-verification-gaps)

This distinction is crucial:

**“Sound within the modeled language and matcher” does not mean “complete for every regex engine.”**

STRling could truthfully label such a result as a **sound conservative result for model M**, but should not erase the model name or supported feature boundary.

### Linearity checking

There is also research aimed at establishing a positive property rather than merely finding attacks. Sugiyama and Minamide model a backtracking match as a tree transducer and reduce linear matching to a linear-size-increase property. [source-verification note](#source-verification-gaps) This is conceptually important for STRling: a compiler is not limited to reporting “I found a known bad shape.” For carefully defined semantic subsets, it can sometimes establish a positive complexity result.

Again, the certificate must name the matcher model.

### Thompson and automata-based execution

For classical regular expressions, Thompson NFA simulation follows all active NFA states in lockstep rather than recursively revisiting path choices. This removes the catastrophic backtracking mechanism and gives input-linear behavior for a fixed automaton. The 2025 SoK contrasts this model with Spencer-style depth-first backtracking precisely on that basis. [source-verification note](#source-verification-gaps)

Production libraries following this design include Go's `regexp`, whose current documentation guarantees execution time linear in input size, and RE2, which guarantees linear match time while using configurable memory budgets. [source-verification note](#source-verification-gaps)

The caveat is pattern size: implementations commonly have an \(m\) factor or resource bound that popular descriptions suppress. Rust states its guarantee explicitly as \(O(mn)\) for common single-search operations. [source-verification note](#source-verification-gaps) STRling should preserve that distinction rather than colloquially turning every automata guarantee into “O(n).”

### Derivative and symbolic approaches

Brzozowski derivatives conceptually compute the language that remains after consuming an input prefix; derivative states correspond naturally to automaton states. Derivative construction is an old formal technique, while symbolic representations avoid enumerating large concrete alphabets such as Unicode code points. [source-verification note](#source-verification-gaps)

Modern work shows that this is not merely theoretical. Microsoft's symbolic-regex work uses symbolic derivatives over character sets, and RE# extends the approach to Boolean regex operators and restricted lookaround while proving input-linear matching for its supported language. [source-verification note](#source-verification-gaps) The .NET nonbacktracking engine is closely related to this line of work, and Microsoft's formalization research explicitly describes an extension of the ideas behind .NET's `NonBacktracking` engine. [source-verification note](#source-verification-gaps)

For STRling, the important conclusion is not “use derivatives.” It is:

> **Automata, derivatives, symbolic automata, and tree semantics are alternative proof/execution frameworks whose guarantees depend on the feature set and representation. None is a universal oracle for the full union of PCRE2, JavaScript, Java, .NET, Python, Ruby, and other extended dialects.**

### Dynamic, fuzzing, and hybrid approaches

Dynamic techniques execute patterns against generated candidates and use runtime behavior as fitness or feedback. ReScue used a gray-box genetic process to seed, evolve, and pump candidate strings. [source-verification note](#source-verification-gaps) Regulator instruments a backtracking engine and fuzzes for costly inputs, increasing syntax coverage compared with many purely formal analyzers. [source-verification note](#source-verification-gaps) SlowFuzz and related work generalize the concept to inputs that maximize execution cost, and the SoK categorizes dynamic techniques as a distinct branch of ReDoS detection. [source-verification note](#source-verification-gaps)

Hybrid systems combine structural localization with dynamic confirmation or attack-string construction. ReDoSHunter, for example, uses vulnerability patterns together with dynamic validation and classifies findings as polynomial or exponential. [source-verification note](#source-verification-gaps)

Recent work continues to push toward more practical attack strings. PufferDoS appeared at IEEE Symposium on Security and Privacy 2026 and explicitly targets the gap between abstract adversarial strings and payloads that remain effective at realistic application-level budgets. [source-verification note](#source-verification-gaps)

The epistemic rule STRling should adopt is simple:

> **A successful dynamic witness is strong evidence that the tested engine/configuration/input is expensive. Failure to discover one is not proof that no worst case exists.**

Likewise, fitting measured timings to \(n^2\) or \(2^n\) is an empirical characterization, not an asymptotic proof. Hardware noise, JIT thresholds, caching, engine fallback thresholds, timeout activation, garbage collection, and optimizer phase changes can all alter a short benchmark series. The SoK notes that even the literature lacks a uniform operational threshold for deciding when measured slowdown becomes a vulnerability. [source-verification note](#source-verification-gaps)

### Exact, conservative, and heuristic results

STRling should make this distinction first-class:

| Evidence class | Meaning | Legitimate wording |
|---|---|---|
| **Exact / proven** | A theorem or exact decision procedure establishes the result for a clearly named semantic model and assumptions. | “Proven input-linear under target profile X.” |
| **Sound conservative** | The analysis overapproximates risk; a negative result is meaningful within its scope, while positives can include false alarms. | “No superlinear behavior exists in model M” or “Potentially superlinear”; exact wording depends on analysis direction. |
| **Necessary-condition analysis** | Failure of the condition can rule something out, but satisfying it does not prove vulnerability. | “Necessary condition present.” |
| **Sufficient-condition analysis** | Matching the condition proves a property, but unmatched patterns remain unresolved. | “Superlinear witness class proven.” |
| **Heuristic structural** | Known hazardous shape or empirical rule; neither sound nor complete. | “Risk pattern detected.” |
| **Empirical** | Actual target execution exhibits measured behavior. | “Empirically superlinear on V/config C over tested range.” |
| **Hybrid** | Formal candidate generation plus target execution, or structural localization plus fuzzing. | Report both components separately. |
| **Unknown** | Feature, configuration, analysis budget, or semantics lie outside the model. | “Complexity not established.” |

This table is more important than choosing any one static algorithm. The 2025 SoK's central methodological finding is precisely that static, dynamic, hybrid, heuristic, and newer methods trade soundness, precision, syntax coverage, and cost differently. [source-verification note](#source-verification-gaps)

## Engine and mitigation landscape

As of August 2026, there is no meaningful single category called “the backtracking engines.” Major runtimes now occupy different points on a spectrum.

| Engine / ecosystem | Current computational-safety picture | What STRling may truthfully infer |
|---|---|---|
| **RE2** | Designed for untrusted regexes; guarantees input-linear match time and operates within configurable memory budgets; deliberately omits backreferences and lookaround. [source-verification note](#source-verification-gaps) | Strong target-level guarantee for supported syntax, subject to pattern/compiler/resource bounds. |
| **Go `regexp`** | Current package documentation explicitly guarantees time linear in input and uses RE2-style syntax. [source-verification note](#source-verification-gaps) | `PROVEN_LINEAR_INPUT` is supportable for documented matching API semantics, while pattern/resource limits still matter. |
| **Rust `regex`** | Omits backreferences and lookaround; common one-search APIs are worst-case \(O(mn)\); all-match iterators can be \(O(mn^2)\); compilation and regex size are explicitly bounded/configurable. [source-verification note](#source-verification-gaps) | Do not reduce this to universal `O(n)`. Result must name operation and account for \(m\). |
| **.NET** | Default engine backtracks. `RegexOptions.NonBacktracking`, available since .NET 7, is designed for time proportional to input length but rejects atomic groups, backreferences, balancing groups, conditionals, lookarounds and `\G`; Microsoft's current docs also state that patterns are assumed trusted. [source-verification note](#source-verification-gaps) | Exact profile eligibility can be checked. “Linear-time target mode” is valid only for the supported subset and operation assumptions. |
| **.NET timeout** | Explicit timeouts are available, but absent a configured application-wide value, default behavior is `InfiniteMatchTimeout`. Microsoft recommends a timeout for untrusted inputs when not using `NonBacktracking`. [source-verification note](#source-verification-gaps) | Report timeout as a resource policy, never as proof of linear complexity. |
| **Ruby** | Modern Ruby can memoize eligible patterns; `Regexp.linear_time?` exposes implementation-specific eligibility. Ruby documents exclusions including backreferences, subexpression calls and some nested constructs. It also offers global/per-regex timeouts, but the default timeout is `nil`, and it warns that memoization can consume large memory. [source-verification note](#source-verification-gaps) | Excellent example of an engine-specific predicate STRling can surface, but the result must be version/runtime-specific. |
| **V8 / JavaScript** | V8 documents an alternative nonbacktracking engine/fallback with a configurable excessive-backtracking threshold, but eligibility excludes backreferences, lookaround, some large/deep finite repetitions, and certain flag combinations. Ordinary Irregexp remains capable of backtracking pathologies. [source-verification note](#source-verification-gaps) The 2025 SoK classifies the defense as partial/opt-in rather than universal. [source-verification note](#source-verification-gaps) | A JavaScript pattern cannot be labeled safe merely because V8 has a fallback. Profile must know deployment flags and eligibility. |
| **Java `java.util.regex`** | JDK 26 still documents `Pattern` as traditional NFA-based ordered matching and supports backreferences and other advanced constructs. [source-verification note](#source-verification-gaps) OpenJDK's proposal for a predictable/linear regex mode remained a Draft in the source retrieved, while documenting the existing engine's remaining superlinear risks. [source-verification note](#source-verification-gaps) | Treat default Java as engine-dependent backtracking for strict safety purposes; do not assume a standardized nonbacktracking mode. |
| **Python stdlib `re`** | Python's current documentation exposes ordinary backtracking behavior and since Python 3.11 supports atomic groups and possessive quantifiers that programmers may use to suppress particular backtracking paths. [source-verification note](#source-verification-gaps) The current standard API does not document a per-match timeout analogous to .NET/Ruby; the 2025 engineering survey found no built-in ReDoS defense for Python's standard engine. [source-verification note](#source-verification-gaps) | Atomic/possessive constructs are local controls, not a global safety guarantee. A strict untrusted-input profile needs stronger external bounds or analysis. |
| **PCRE2 standard matcher** | PCRE2 explicitly documents a depth-first tree-search/backtracking default with worst-case exponential time. It has automatic optimizations, JIT, match/depth/heap limits and configurable compilation/runtime controls. [source-verification note](#source-verification-gaps) | Engine optimization and resource caps must be modeled separately from structural complexity. |
| **PCRE2 DFA matcher** | `pcre2_dfa_match` uses different matching semantics, can find multiple/longest alternatives, and does not support all PCRE2 constructs. PCRE2 describes its worst-case match behavior as polynomial, not as a drop-in replacement with identical Perl-style semantics. [source-verification note](#source-verification-gaps) | Never silently reinterpret a standard PCRE2 target as DFA-safe; that is a semantic/profile change. |

The 2025 SoK additionally reports partial defenses in Perl and PHP through caching and/or execution counters. [source-verification note](#source-verification-gaps) Those mechanisms strengthen the general conclusion: **engine name alone is insufficient; build, mode, limits, and invocation semantics matter.**

### Engine optimization is evidence, not a language property

PCRE2 illustrates why a source-only detector can disagree with observed execution. It automatically converts patterns such as `a+b` to possessive equivalents where backtracking into `a+` can never help; it can also infer anchoring and required-character conditions that cause early failure. [source-verification note](#source-verification-gaps)

Such optimizations are good defenses, but STRling should avoid treating them as permanent semantic laws. They are implementation decisions and can vary with engine version, options, JIT status, callouts, flags, surrounding pattern structure, or future compiler changes.

A useful separation is:

**engine-independent structural fact:** “this AST has exponentially many equivalent decompositions in matcher model M.”

**engine-dependent implementation fact:** “PCRE2 version/profile P eliminates those decompositions through optimization O.”

Both facts can be true simultaneously.

### Memoization

Memoization prevents a backtracking matcher from reevaluating the same state/input combinations repeatedly. Ruby's modern implementation is the prominent production example and documents a linear-time predicate for eligible expressions. [source-verification note](#source-verification-gaps)

Memoization does not make arbitrary modern regex features easy. Capture-state differences, backreferences, recursion, and assertions can make apparently identical positions semantically different. Nor does CPU linearity imply constant memory. Ruby explicitly cautions about the latter. [source-verification note](#source-verification-gaps)

STRling should therefore label memoization as a **mitigation property**, unless the engine itself exposes a stronger documented complexity guarantee for the actual pattern.

### Timeouts and counters

Timeouts and counters are operationally valuable because they cap a single match's ability to monopolize resources. .NET provides time-based match deadlines, whereas PCRE2's primary match limit counts implementation work rather than wall-clock time. [source-verification note](#source-verification-gaps) Ruby exposes configurable match timeouts but intentionally leaves them unset by default. [source-verification note](#source-verification-gaps)

These mechanisms must be reported with their **failure semantics**. A match that throws, returns a limit error, drops an IDS rule, aborts validation, or causes a caller retry is not equivalent to a correct successful match completed in bounded time. The 2026 backreference work makes this distinction security-critical by showing limit exhaustion involved in Snort alert bypasses. [source-verification note](#source-verification-gaps)

### Nonbacktracking modes

Nonbacktracking modes offer the strongest production guarantees when the feature set fits.

RE2 and Go make that design the default. [source-verification note](#source-verification-gaps) .NET makes it opt-in and rejects unsupported constructs. [source-verification note](#source-verification-gaps) V8 provides a documented alternate engine/fallback only under eligibility and configuration constraints. [source-verification note](#source-verification-gaps) Rust's design combines multiple internal automata techniques while retaining explicit worst-case bounds for its public APIs. [source-verification note](#source-verification-gaps)

These should become separate STRling target capabilities rather than a generic boolean `nonBacktracking = true`.

## Advanced constructs, theoretical limits, and the meaning of “safe”

### Backreferences create a real semantic boundary

Backreferences are not merely a performance-unfriendly convenience. They extend regexes beyond regular languages by requiring the engine to remember and compare previously captured strings. [source-verification note](#source-verification-gaps)

Formal work published at IEEE CSF 2025 studies ReDoS both with and without backreferences using automata augmented with memory. It derives ambiguity-based sufficient conditions and also establishes a sharp difference between the ordinary-regex and backreference cases for universally converting patterns into backtracking-safe forms, subject to stated complexity assumptions. [source-verification note](#source-verification-gaps)

The February 2026 backreference ReDoS study goes further operationally. It reports that backreferences can induce superlinear backtracking even where traditional sink-ambiguity analysis is linear, identifies three new vulnerability patterns, and found 45 previously unknown quadratic-or-worse cases in the studied Snort ruleset. [source-verification note](#source-verification-gaps)

An even newer 2026 line of theory studies the fine-grained matching complexity of regexes with restricted numbers and uses of backreferences, finding both hard regions and subclasses with substantially better algorithms. [source-verification note](#source-verification-gaps) The lesson for STRling is that **“contains a backreference” is too coarse to mean “unsafe,” but “backreference complexity proven safe by classical NFA ambiguity” is unsound.** Backreferences require a different analytical model or an `unknown` result.

### JavaScript shows how complex full dialects become

A March 2026 preprint gives a particularly strong warning against universal claims. It proves PSPACE-hardness for JavaScript regex matching and gives finer results for subsets involving lookarounds and quantifier forms, with core proofs mechanized in Rocq. Because this is recent preprint work rather than a settled universal statement about all regex implementations, it should be treated as evidence about the formal difficulty of JavaScript's full semantics, not as a runtime benchmark for V8. [source-verification note](#source-verification-gaps)

For STRling's purposes, it supports a conservative design principle: **the full union of modern regex dialect features is not a realistic domain for one complete, exact, cheap static complexity classifier.**

### Lookaround is subtle rather than inherently unsafe

Positive and negative lookaround are zero-width contextual tests. In practical backtracking engines they can interact with captures and surrounding repetition in expensive ways, and production safe modes often reject them. .NET's `NonBacktracking` mode rejects lookaround; V8's fallback eligibility also excludes it. [source-verification note](#source-verification-gaps)

But symbolic-derivative work shows that lookaround itself does not force backtracking. RE# supports restricted lookarounds with a formally input-linear matcher, while Lean formalization work has mechanically verified matching semantics for related derivative algorithms. [source-verification note](#source-verification-gaps)

Thus STRling should distinguish:

`FEATURE_REGULAR_OR_ANALYZABLE`

from

`SUPPORTED_BY_TARGET_SAFE_MODE`.

Those are not synonyms.

### Atomic groups and possessive quantifiers are controls, not universal repairs

Atomic groups and possessive quantifiers prune backtracking points. Python's documentation explicitly demonstrates that a possessive repetition refuses to relinquish characters after failure, and PCRE2 recommends atomic/possessive constructions for many expensive cases. [source-verification note](#source-verification-gaps)

The same semantics explain why these constructs cannot be blindly inserted as an “optimization.” Removing a backtracking alternative can change whether the regex matches, which span wins, or what captures contain. The fact that an engine itself performs auto-possessification only when it proves that backtracking cannot help is exactly the standard STRling should adopt for automatic rewriting. PCRE2 documents this optimization criterion directly. [source-verification note](#source-verification-gaps)

### Recursion, subroutine calls, conditionals, balancing groups, and callouts

These constructs need an explicit analysis boundary. .NET's linear mode refuses balancing groups and conditionals. [source-verification note](#source-verification-gaps) Ruby's memoized optimization excludes subexpression calls. [source-verification note](#source-verification-gaps) PCRE2's alternate DFA matcher has distinct feature restrictions, and its own depth-limit documentation notes internal recursion used for pattern recursion, lookaround, and atomic groups. [source-verification note](#source-verification-gaps)

For a compiler spanning dialects, “unsupported by safety analysis” is not a weakness; it is a necessary honest state.

### Compilation safety is independent of execution safety

A production safety contract should separately ask:

1. Can parsing and semantic validation be bounded?
2. Can normalization or repetition expansion be bounded?
3. Can NFA/IR construction be bounded?
4. Can determinization or specialization be bounded?
5. Can emitted regex size be bounded?
6. Can target compilation be bounded?
7. Can execution be bounded?

Rust's docs show why: the ordinary `regex` crate uses a compiled-size limit and warns users to restrict untrusted pattern lengths, while the lower-level explicit-DFA API can exhibit exponential construction. [source-verification note](#source-verification-gaps) PCRE2 documents compiled-code expansion from bounded repetitions. [source-verification note](#source-verification-gaps) Java 26's documentation even warns that its `CANON_EQ` compilation mode can create a moderate memory-exhaustion risk and can throw `OutOfMemoryError` for extreme combining-mark cases. [source-verification note](#source-verification-gaps)

So a pattern can be **match-time safe but compile-time unsafe**.

### What can truthfully be called “safe”

The unqualified word **safe** should be avoided in STRling safety results.

A defensible qualified form is:

> **Safe under profile P**: for the stated target/version/mode/operation and semantic subset, under specified pattern and subject bounds and runtime resource assumptions, the required computational-safety properties have been established.

There are several legitimate subclaims:

**Input-linear:** a supported matcher is formally/documentedly linear in subject length for a fixed compiled pattern. Go and RE2 support this type of claim. [source-verification note](#source-verification-gaps)

**\(O(mn)\)-bounded:** the complexity explicitly includes pattern size. Rust's one-search guarantee is the model example. [source-verification note](#source-verification-gaps)

**Resource-capped:** execution cannot exceed a configured timeout, work limit, or memory budget without terminating with a specified error. .NET and PCRE2 support variants of this claim. [source-verification note](#source-verification-gaps)

**Structurally proven non-superlinear in model M:** a static theorem establishes the result for a particular backtracking or automata model. [source-verification note](#source-verification-gaps)

**Empirically bounded over tested domain:** measured execution remained below a threshold for stated input lengths, workloads, and target build. This is useful evidence, but not a mathematical guarantee. The methodological limitations documented by the SoK make the qualifier essential. [source-verification note](#source-verification-gaps)

What STRling should **not** claim from any of those alone is “ReDoS immune,” “always linear,” “zero risk,” or “safe on all engines.”

## STRling safety contract, diagnostics, rewriting, and target profiles

STRling's compiler architecture provides an opportunity that ordinary regex linters do not have: it can retain source-level intent, target-independent structure, and target capabilities before emission. [source-verification note](#source-verification-gaps) The recommendation is to use that information to produce a structured **safety evidence record**, not a binary lint bit.

### Recommended safety-result vocabulary

The following vocabulary is intentionally explicit about what has actually been established.

| STRling result | Required meaning |
|---|---|
| `PROVEN_LINEAR_INPUT` | A proof or authoritative target guarantee establishes linearity in subject length for this operation and supported feature subset. Pattern-size qualification should be included when relevant. |
| `PROVEN_COMPLEXITY_BOUND` | A stronger or different formal bound is known, such as \(O(mn)\), bounded polynomial degree, or a finite bound derived from explicit input/resource limits. |
| `PROVEN_SUPERLINEAR` | Static analysis proves a superlinear family for the specified matcher model, preferably with degree/class and witness schema. |
| `POTENTIALLY_SUPERLINEAR` | A conservative or heuristic analysis found a hazardous condition but did not establish actual superlinear target execution. |
| `EMPIRICALLY_SUPERLINEAR` | Measurements on a named target/version/configuration show superlinear growth over a stated range. This is not an asymptotic proof. |
| `ENGINE_MITIGATED` | The target implementation has a mechanism that neutralizes or bounds the identified hazard under stated eligibility/configuration. |
| `RESOURCE_CAPPED` | Timeout/work/memory/input limits bound resource use; include the cap and limit-exceeded behavior. |
| `SAFE_MODE_ELIGIBLE` | The expression can execute in a target's documented bounded/nonbacktracking mode. |
| `SAFE_MODE_INELIGIBLE` | A specific construct prevents use of that target mode. |
| `COMPILE_RESOURCE_RISK` | Pattern expansion, determinization, Unicode processing, generated size, or target compilation presents a resource concern. |
| `EXPLOITABILITY_NOT_ESTABLISHED` | A regex-level issue exists, but application reachability or practical DoS has not been demonstrated. |
| `ANALYSIS_UNKNOWN` | Available analyses cannot establish a result for the feature set/configuration or exhausted their analysis budget. |
| `SAFE_UNDER_PROFILE` | Optional umbrella term, permitted only when a profile explicitly states every required guarantee and assumption. |

The distinction between `PROVEN_SUPERLINEAR`, `EMPIRICALLY_SUPERLINEAR`, and `EXPLOITABILITY_NOT_ESTABLISHED` is particularly important. Recent research emphasizes that theoretical slowdown, measured engine slowdown, and practical ReDoS are different levels of evidence. [source-verification note](#source-verification-gaps)

### Safety should be multidimensional

A result record should contain separate fields rather than reducing everything to a severity:

| Dimension | Example |
|---|---|
| Feature class | `classical-regular`, `lookaround`, `backreference`, `recursive` |
| Static model | `prioritized-NFA`, `tree-semantics`, `target-safe-mode`, `unsupported` |
| Match-time result | `linear`, `quadratic`, `exponential`, `potential`, `unknown` |
| Pattern-size dependence | `O(mn)`, compiled-size limit, unknown |
| Operation | `full-match`, `search`, `find-all`, `replace` |
| Target | engine, version/runtime family, flags/mode |
| Runtime mitigation | memoization, fallback, timeout, step limit, none |
| Compile-time risk | bounded/expanded/DFA-risk/unknown |
| Evidence | theorem, conservative analysis, generated witness, benchmark |
| Input assumptions | maximum subject size; encoding |
| Pattern trust | compile-time trusted / runtime untrusted |
| Failure semantics | timeout exception, PCRE limit error, compile rejection, etc. |
| Exploitability | reachable/limited/not assessed |

This representation prevents a dangerous information loss such as turning “exponential under abstract Spencer matcher, but V8 fallback eligible at configured threshold” into simply “high risk.”

### Recommended compile-time diagnostic pipeline

STRling need not commit to one analyzer. A layered design is stronger.

**Feature classification first.** Classify the IR by semantic features: classical regular core, captures, lookaround, atomicity, backreferences, recursion/subroutine calls, conditionals, engine-specific verbs, counted repetitions, dynamic pattern fragments. This immediately determines which analyses and target modes apply. Safe-engine eligibility is frequently feature-driven: RE2 rejects backreferences/lookaround; .NET `NonBacktracking` rejects several advanced constructs; Ruby's memoization predicate has documented exclusions. [source-verification note](#source-verification-gaps)

**Cheap structural diagnostics next.** Detect nested repetition, overlapping quantified alternatives, adjacent overlapping repetitions, nullable loops, large count expansion, and unanchored restart risk. These findings should be phrased as risk indicators unless backed by a stronger model.

**Formal analysis where supported.** For the ordinary regular subset, use one or more ambiguity/NFA/tree/linearity analyses with a declared matcher model. Existing literature demonstrates that formal static analysis can find pumpable adversarial families and that sound overapproximation is practical at substantial corpus scale. [source-verification note](#source-verification-gaps)

**Target-profile refinement.** Apply engine facts after structural facts. A finding may be eliminated by a guaranteed nonbacktracking target mode, suppressed by a formally applicable optimizer, downgraded to resource-capped, or upgraded because a target lacks safeguards. The SoK's cross-engine experiments show that the same candidate pattern can behave differently after modern mitigations are enabled. [source-verification note](#source-verification-gaps)

**Empirical confirmation last.** Generate adversarial candidates from static findings, then exercise the actual target engine when practical. Dynamic analysis is especially useful for implementation optimizations and extended constructs that are difficult to model. [source-verification note](#source-verification-gaps)

### Relationship between static analysis and empirical execution

Static and empirical methods should corroborate rather than compete.

A **static proof** can establish asymptotic behavior for an abstract model over arbitrarily large input families, but can miss target-specific optimization or unsupported engine semantics.

A **target benchmark** executes the implementation that users actually deploy, including optimizer, JIT, fallback, memoization and resource limits, but only on finitely many cases.

The most useful STRling evidence bundle for a suspected vulnerability would therefore include:

`pattern/IR region → analysis theorem or structural reason → generated prefix/pump/suffix witness → target execution measurements → mitigation/profile interpretation`.

Where instrumentation is available, the empirical layer should prefer CPU work, matcher steps/backtracks, allocation, peak state count, and limit outcomes over wall-clock time alone. This follows from the fact that modern engines may switch algorithms, count “work” differently, or invoke runtime limits that are not simple functions of elapsed time. PCRE2 explicitly documents different match-limit counting under JIT and interpreted execution. [source-verification note](#source-verification-gaps)

Most importantly:

> **Static proof can justify absence within its modeled scope. Fuzzing cannot justify absence merely because it did not find a witness.**

### Fail closed, warn, or report unknown

The policy should depend on the **target profile's declared safety objective**, not on a global severity table.

| Condition | Strict computational-safety profile | General-purpose profile |
|---|---|---|
| Proven superlinear behavior on an adversarially reachable default backtracking target with no mandatory cap | **Fail closed** | Error or high-severity warning |
| Target requires a documented linear/nonbacktracking subset and pattern is ineligible | **Fail closed** | Report ineligibility; allow alternate target/profile |
| Analyzer encounters backreferences/recursion/etc. outside its supported formal model | **Fail closed if proof is required** | `ANALYSIS_UNKNOWN`, not “unsafe” |
| Conservative structural analysis reports possible ambiguity but no proof | Warn, or fail only if policy forbids unresolved risk | Warn |
| Empirical target test shows steep superlinear growth | Fail under strict untrusted-input profile | High-severity warning with evidence |
| Engine timeout/backtrack cap exists but is optional/unconfigured | Treat as absent | Warn with configuration remediation |
| Engine mitigation is documented and mandatory for exact pattern/profile | Accept with `ENGINE_MITIGATED` or stronger guarantee | Informational |
| Pattern/input sizes are statically bounded tightly enough to derive an acceptable finite cost | Accept bound explicitly | Informational |
| Static analysis exhausts its state/time budget | **Unknown**, never “safe” | `ANALYSIS_UNKNOWN` |

The key distinction is that **unknown is not the same as unsafe**. Failing closed on `unknown` is a policy decision appropriate to a strict profile; mislabeling it `unsafe` would overstate the analysis.

### Automatic rewriting requires a substantially higher bar

ReDoS research has explored automatic repair, including RegexScalpel's localization-and-repair approach. The authors explicitly recognize semantic preservation as a central difficulty in regex repair. [source-verification note](#source-verification-gaps)

For STRling, an automatic safety rewrite should require all of the following:

**Semantic preservation for the exact target operation.** Language equivalence alone can be insufficient where leftmost-first priority, match span, captures, repeated captures, replacement backreferences, zero-width behavior, or global iteration matter. .NET itself documents differing repeated-capture behavior in `NonBacktracking` mode, demonstrating that execution-model changes can expose semantic differences beyond Boolean acceptance. [source-verification note](#source-verification-gaps)

**Capture preservation.** Numbered and named groups, capture participation, and values consumed by caller APIs must remain compatible.

**Priority preservation.** Ordered alternation and greediness are observable in Perl-style engines even when accepted languages coincide.

**Flag and Unicode preservation.** Case folding, Unicode classes, multiline/dotall semantics, normalization assumptions, and target-specific character behavior must not silently change.

**Proof that the proposed pruning is unreachable or irrelevant.** This is the standard behind safe auto-possessification: PCRE2 performs it only when it can determine that characters consumed by the quantifier cannot be useful to what follows. [source-verification note](#source-verification-gaps)

**No new computational hazard.** A rewrite that removes runtime backtracking but causes counted-repetition expansion, huge automata, or compile-time explosion is not an unconditional improvement. [source-verification note](#source-verification-gaps)

**Target validation.** The rewrite should be checked on every target profile for which it is emitted, because atomicity, possessive quantifiers, lookaround, and capture rules differ among engines.

**Generated regression evidence.** Existing examples, synthesized semantic distinguishing strings, and the adversarial witness family should be rerun before accepting the rewrite.

Where STRling cannot establish those properties, the proper product behavior is **suggested repair with stated assumptions**, not automatic rewriting.

### Implications for target profiles

Safety should become a capability of each target profile. A target profile should declare at least:

`engine family + minimum/known version + matching mode + operation semantics + supported features + guaranteed complexity + pattern-size limits + input bounds + runtime limits + limit failure behavior`.

A practical classification could look like this:

**Linear-regular profile.** RE2/Go-like target whose accepted syntax is restricted and whose matcher documents input-linear execution. Reject unsupported constructs at compile time. Still enforce pattern/compiler bounds. [source-verification note](#source-verification-gaps)

**Bounded-automata profile.** Rust-like target: report \(O(mn)\) for single search, distinguish iterator operations, and enforce source/compiled-size limits. [source-verification note](#source-verification-gaps)

**Explicit nonbacktracking profile.** .NET `RegexOptions.NonBacktracking`: compiler checks feature eligibility and emits/requests the mode as part of the profile. [source-verification note](#source-verification-gaps)

**Memoized profile.** Ruby: query the documented eligibility rules or reproduce them for a pinned runtime and record memory risk separately. [source-verification note](#source-verification-gaps)

**Fallback profile.** V8: safety depends on fallback being enabled and pattern eligibility; report threshold/configuration rather than pretending JavaScript semantics themselves are linear. [source-verification note](#source-verification-gaps)

**Resource-capped backtracking profile.** PCRE2 with explicit match/heap/depth limits or .NET/Ruby with an explicit timeout. The profile guarantees termination/failure policy, not low asymptotic complexity. [source-verification note](#source-verification-gaps)

**Unbounded backtracking profile.** Python `re` or ordinary Java matching where no profile-level runtime cap or nonbacktracking guarantee is present. Under a strict untrusted-input policy, STRling would need a formal safety result, a tight input bound, or external execution isolation before issuing `SAFE_UNDER_PROFILE`. [source-verification note](#source-verification-gaps)

This is probably the single most strategically valuable conclusion for STRling: **safety intelligence should be target-profile-aware in exactly the same way syntax/feature lowering already must be target-aware.**

## Corrections to historical assumptions and unresolved questions

The following corrections should be applied when consuming historical Research Intelligence reports. They are corrections to recurring older ReDoS assumptions; historical reports remain useful for discovering pattern families, incidents, tools, and papers, but their engine and vulnerability conclusions should be revalidated against current runtimes.

### Obsolete assumptions that should be explicitly corrected

| Historical assumption | Modern correction |
|---|---|
| **“Nested quantifiers are vulnerable.”** | Nested repetition is a useful heuristic, not a proof. Actual blowup depends on ambiguity/overlap, later failure, operation, and engine optimization. PCRE2 automatically eliminates some otherwise apparent backtracking paths. [source-verification note](#source-verification-gaps) |
| **“No nested quantifiers means safe.”** | False. Adjacent overlapping repetitions can produce polynomial behavior; search restart can add a factor of \(n\); backreferences introduce distinct superlinear mechanisms; and counted repetitions can hurt nonbacktracking engines. [source-verification note](#source-verification-gaps) |
| **“ReDoS means exponential behavior.”** | Too narrow. Polynomial behavior, including quadratic behavior, is a recognized ReDoS class and can be practically damaging at realistic subject sizes. [source-verification note](#source-verification-gaps) |
| **“All backtracking engines are equivalently vulnerable.”** | Obsolete. V8 fallback, Ruby memoization, .NET nonbacktracking mode/timeouts, Java caching, PCRE2 counters/optimizations, and other mitigations materially change runtime behavior. [source-verification note](#source-verification-gaps) |
| **“A superlinear abstract regex is automatically an exploitable ReDoS.”** | False. Exploitability depends on attacker reachability, practical input size, invocation rate, deployment controls and engine mitigation. Modern research specifically criticizes studies that omit this context. [source-verification note](#source-verification-gaps) |
| **“Nonbacktracking means universally safe.”** | False as a blanket statement. Bounded repetition can be costly in nonbacktracking matchers; explicit DFA compilation can be exponential in pattern size; memory/state size remains relevant. [source-verification note](#source-verification-gaps) |
| **“Linear engine means all APIs are linear.”** | False. Rust documents \(O(mn^2)\) for match iterators despite \(O(mn)\) one-search guarantees, and Java's design discussion calls out restart costs from `Matcher.find`. [source-verification note](#source-verification-gaps) |
| **“Linear in input means untrusted regex patterns are safe.”** | False. Pattern size \(m\), compilation expansion, automaton size and memory budgets remain attack surfaces. RE2 and Rust both treat compiler/resource bounding as part of safety. [source-verification note](#source-verification-gaps) |
| **“A timeout proves safety.”** | False. A timeout or work counter caps a failure mode; it neither changes asymptotic complexity nor guarantees correct completion. Defaults may also be unlimited, as in .NET absent configuration and Ruby's default `nil` timeout. [source-verification note](#source-verification-gaps) |
| **“An engine's mitigation means every pattern receives it.”** | False. V8 fallback and Ruby memoization have feature exclusions, and .NET `NonBacktracking` explicitly rejects multiple constructs. [source-verification note](#source-verification-gaps) |
| **“Lookaround is inherently non-regular and therefore incompatible with linear algorithms.”** | Overbroad. Production modes often exclude lookaround, but symbolic-derivative research supports restricted lookaround with formally input-linear matching. [source-verification note](#source-verification-gaps) |
| **“Classical ambiguity analysis covers backreferences.”** | False. 2026 research finds backreference-induced superlinear behavior that conventional sink-ambiguity reasoning can miss. [source-verification note](#source-verification-gaps) |
| **“Atomic or possessive rewriting is always a safe fix.”** | False. Those constructs deliberately discard fallback paths and therefore can change matches. Automatic insertion requires proof that discarded paths cannot affect observable semantics. [source-verification note](#source-verification-gaps) |
| **“One static analyzer can universally prove regex safety.”** | Unsupported by the state of the art. Existing static, dynamic and hybrid systems target different matcher models and syntax fragments, and the modern SoK explicitly documents their precision/recall/scope tradeoffs. [source-verification note](#source-verification-gaps) |
| **“A successful structural repair removes all computational risk.”** | False. A rewrite can reduce matching complexity yet increase compiled pattern size, DFA construction cost, or memory usage. [source-verification note](#source-verification-gaps) |

### The main unresolved research questions for STRling

The first unresolved issue is **which formal matcher model should back each target profile**. A prioritized NFA may be appropriate for one family of engines, while a tree semantics, engine-specific transition system, memoized state machine, or symbolic model may be needed for another. The literature contains multiple credible models precisely because implementation strategies differ. [source-verification note](#source-verification-gaps)

A second issue is **how precisely polynomial degree should be reported**. Distinguishing linear, quadratic, cubic and exponential behavior is useful, but exact degree may become expensive or fragile once unanchored search, captures, assertions and engine optimizations enter the model. Classical NFA ambiguity has tractable structural results, yet translating them faithfully into concrete prioritized matcher cost is a separate step. [source-verification note](#source-verification-gaps)

A third is **advanced-feature coverage**. Backreferences now have substantially better formal models than they did in older ReDoS tooling, including recent memory-automaton and fine-grained complexity work, but the field is still evolving rapidly in 2026. [source-verification note](#source-verification-gaps) STRling should expect its `unknown` frontier to move over time rather than design a public contract that assumes today's analyzer is complete.

A fourth is **what exactly constitutes acceptable empirical evidence**. The 2025 SoK notes that ReDoS papers use inconsistent vulnerability thresholds and that relatively few conduct full application-level attacks. [source-verification note](#source-verification-gaps) STRling will need a reproducible methodology for input-length sequences, warmup/JIT behavior, CPU-versus-wall-time measurements, memory, backtrack/step counters, retry behavior, and target build identity before promoting empirical findings into durable safety metadata.

A fifth is **how runtime resource policies enter semantic guarantees**. It is straightforward to say a match is capped at a timeout; it is harder to say whether timeout means validation failure, request rejection, fallback to another algorithm, silent non-match, retry, or process termination. PCRE2's multiple resource-limit paths and the 2026 Snort result demonstrate that limit-exceeded semantics can themselves become security relevant. [source-verification note](#source-verification-gaps)

A sixth is **how to reason compositionally over STRling's IR**. Because STRling treats regex as composable software, a major long-term opportunity is to attach local safety facts to IR nodes and determine which facts survive concatenation, alternation, repetition, assertion, capture and target lowering. [source-verification note](#source-verification-gaps) The research question is which properties are compositional enough to cache and reuse without reanalyzing the entire expression.

A seventh is **how much target-engine optimization STRling should model versus verify empirically**. Reimplementing every optimizer would be brittle. PCRE2 alone has auto-possessification, start optimization, JIT and alternate matching paths. [source-verification note](#source-verification-gaps) A likely robust boundary is to prove source/model properties independently, consume only documented target guarantees as static facts, and use target execution for optimizer-specific confirmation.

An eighth is **how safe-profile guarantees survive runtime upgrades**. Ruby explicitly says `Regexp.linear_time?` is an implementation property with no forward/backward compatibility guarantee. [source-verification note](#source-verification-gaps) V8 fallback rules and engine thresholds are likewise implementation details. [source-verification note](#source-verification-gaps) STRling safety artifacts therefore need engine-version provenance and invalidation rules.

A ninth is **how to bound compilation when patterns themselves are untrusted**. RE2 treats parser/compiler memory bounding as part of its security model; Rust urges explicit source and compiled-size limits; full DFA construction can be exponential. [source-verification note](#source-verification-gaps) Any future STRling runtime-compilation scenario should define compiler quotas independently from matching quotas.

A final unresolved issue is **whether “safe under profile” should require exploitability analysis or only computational guarantees**. The strongest recommendation is to keep these separate. STRling can rigorously establish many regex and engine properties at compile time, while exploitability depends on application routing, maximum request sizes, concurrency, proxies, authentication, rate limiting and error handling that may not be visible to a regex compiler. Modern ReDoS research strongly supports making that boundary explicit. [source-verification note](#source-verification-gaps)

### Recommended STRling position

The research supports a precise product-level doctrine:

> **STRling should promise computational safety intelligence, not universal regex safety.**

For explicitly bounded regular subsets on targets with documented nonbacktracking guarantees, STRling can make strong positive statements such as **proven input-linear under profile X**. Go, RE2, Rust's bounded APIs, and .NET's supported `NonBacktracking` subset demonstrate that such statements can be mathematically and operationally meaningful when carefully scoped. [source-verification note](#source-verification-gaps)

For backtracking targets, STRling can statically identify and sometimes prove polynomial or exponential path growth, synthesize adversarial witness families, account for known engine optimizations and mitigations, and refine the result through actual target execution. Formal static analysis, ambiguity methods, dynamic fuzzing and hybrid systems all provide useful pieces of that capability. [source-verification note](#source-verification-gaps)

For advanced constructs, unsupported matcher configurations, or analyses that exceed practical budgets, **`ANALYSIS_UNKNOWN` is a correct and valuable answer**. New 2025–2026 work on backreferences and JavaScript matching complexity reinforces that full modern regex semantics contain regions where simplistic regular-language reasoning is insufficient. [source-verification note](#source-verification-gaps)

For mitigated engines, STRling should say exactly what the mitigation does: **nonbacktracking execution, memoization, fallback after a threshold, timeout, match-work limit, memory cap, or pattern-size restriction**. None should be collapsed into a generic green “safe” badge. [source-verification note](#source-verification-gaps)

For automatically repaired patterns, STRling should require a substantially stronger semantic proof obligation than it requires for merely suggesting a repair. The fact that atomicity, captures, ordered alternation and matching modes can change observable results makes performance improvement alone insufficient. [source-verification note](#source-verification-gaps)

The resulting safety contract is both rigorous and useful:

> **STRling can determine some safety properties exactly, conservatively bound others, empirically characterize target behavior, identify engine mitigations and runtime resource requirements, and explicitly acknowledge what remains unknown. Every strong guarantee is attached to a target, operation, semantic subset, resource model, and evidence class.**

That is a substantially stronger foundation than the historical model of “scan for catastrophic-backtracking shapes,” while remaining consistent with the 2025 SoK's central finding that contemporary ReDoS must be reasoned about jointly across pattern structure, matcher implementation, mitigation, and deployment. [source-verification note](#source-verification-gaps)
