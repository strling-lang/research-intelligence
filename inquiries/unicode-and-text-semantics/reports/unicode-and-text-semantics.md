# STRling’s Canonical Unicode and Text Model for Portable Regex Intent

Role: Research report  
Origin: OpenAI deep-research session commissioned for STRling Research Intelligence  
Generated: 2026-08-12  
Imported: 2026-08-12  
Source verification: Partially verified  
Last reviewed: 2026-08-12  
Current status: Active input

## Source verification gaps

The imported report contained opaque research-session citation markers without a durable marker-to-source table. The markers were removed; unresolved claim-level citations, external comparisons, and proposed models require verification. Current-state claims were checked against the downstream authorities linked by the active inquiry.

The central finding is that STRling cannot make “Unicode support” a flag or an emitter capability and remain semantically defensible. It needs an explicit **text contract** that separates at least four things which many runtimes conflate: the domain of input values, the unit that regex atoms consume, the Unicode data and algorithms that define predicates and boundaries, and the coordinate system used for match positions. Unicode itself distinguishes abstract characters, code points, scalar values, encoding-form code units, normalization, segmentation, and versioned character properties; UTS #18 likewise warns that Unicode regex semantics depend on both the Unicode version and the logical unit on which matching operates.

STRling's current semantics are already pointed in the right direction: they describe the DSL as Unicode-first, say that STRling “aims for code-point intent,” distinguish JavaScript UTF-16 code-unit behavior from Unicode-aware behavior, reject implicit normalization, and recognize Unicode-sensitive shorthands and target differences. But several of those statements are still underspecified for a portable semantic language: “code point” needs tightening to **Unicode scalar value** for the portable Unicode domain; `\d`, `\w`, `\b`, newline, dot, case folding, and Unicode version need semantic identities independent of target syntax; and result spans need a coordinate model separate from matching semantics.

That separation also fits the project's existing research governance. The Regex Knowledge Program explicitly treats the Unicode/text model as a required research facet and keeps Unicode model, execution profile, host behavior, and API behavior distinct. The Conformance program, meanwhile, owns reproducible execution evidence rather than normative semantic definitions. The existing semantic-obligation taxonomy already identifies encoding datum domain, classes/properties, folding, index unit, and malformed handling as text-model-dependent obligations.

The recommended answer to the report's framing question is therefore:

> **A STRling character is, by default, one Unicode scalar value. A STRling word is not a primitive character class but a separately named word-class or Unicode-segmentation concept. A STRling boundary is a zero-width position defined by an explicit boundary algorithm and policy. A STRling position is a boundary expressed in a declared coordinate system, with native runtime coordinates preserved rather than silently converted away.**

## Canonical text domain and semantic alphabet

Unicode has several superficially similar units that are not interchangeable. A **code point** is a numerical value in the Unicode codespace. A **Unicode scalar value** is a code point excluding the surrogate range U+D800–U+DFFF. UTF-8, UTF-16, and UTF-32 encode scalar values into sequences of 8-, 16-, and 32-bit code units respectively; UTF-16 uses two code units for supplementary scalar values, UTF-8 uses one to four, while UTF-32 uses one code unit per scalar value. Ill-formed code-unit sequences are not valid encodings of Unicode scalar values. The Unicode Standard requires ill-formed encoding to be treated as an error condition rather than silently interpreted as characters, although replacement with U+FFFD is an allowed recovery strategy.

UTS #18's fundamental regex model is similarly based on logical Unicode code points rather than the serialized code units of UTF-8 or UTF-16. In particular, supplementary characters are expected to behave as single logical elements rather than as the surrogate pair or multiple UTF-8 bytes used to encode them. UTS #18 permits implementations to expose isolated surrogate values in some environments, but that is an implementation accommodation, not a reason for a portable language to make surrogates part of its canonical textual alphabet.

### Recommended domain taxonomy

| Semantic dimension | Distinct concepts STRling should model | Recommended portable meaning |
|---|---|---|
| **Datum domain** | Unicode text, arbitrary bytes, optionally raw host code units | Two first-class domains: `unicodeScalars` and `bytes`. Raw host-code-unit matching should be a target-specific extension rather than ordinary Unicode text. |
| **Unicode alphabet** | Code points vs scalar values | A finite sequence of **Unicode scalar values**. Surrogate code points are excluded from this semantic domain. |
| **Byte alphabet** | Bytes interpreted as text vs uninterpreted octets | A finite sequence of octets 0–255. No Unicode property or case semantics arise merely because the bytes happen to contain UTF-8. |
| **Serialization** | UTF-8, UTF-16, UTF-32 | An external representation/interop fact, not the regex alphabet. |
| **Regex atom** | Byte, code unit, scalar, grapheme cluster | Scalar in Unicode intent; byte in byte intent. Grapheme clusters require an explicit grapheme-aware construct. |
| **User-perceived character** | Extended grapheme cluster | Explicit UAX #29 segmentation product, not the default meaning of literal, dot, class, or quantifier. |
| **Position** | Byte offset, UTF-16 offset, scalar offset, grapheme offset | Typed coordinate, never an unqualified integer. |
| **Malformed data behavior** | Reject, replacement decoding, raw units | Explicit input-boundary policy. `reject` is the recommended portable Unicode default. |

The important choice here is **scalar value rather than the broader phrase “code point.”** Unicode's surrogate code points exist precisely to support UTF-16's encoding mechanism and are not Unicode scalar values. Making scalars the portable alphabet therefore creates a clean correspondence across well-formed UTF-8, UTF-16, and UTF-32 and prevents the meaning of “one character” from depending on whether a target exposes UTF-16 internals. This is a STRling policy recommendation; UTS #18 itself commonly says “code point,” and in places permits implementations to accommodate isolated surrogate code points.

This would sharpen, rather than reverse, the current STRling v3 statement that STRling “aims for code-point intent.”

### UTF execution models should not leak into portable meaning

Consider the text:

```text
A𝄞B
```

where `𝄞` is U+1D11E MUSICAL SYMBOL G CLEF.

Its useful coordinate systems are:

| Coordinate system | Boundaries around `A𝄞B` |
|---|---|
| Unicode scalar values | `0, 1, 2, 3` |
| UTF-8 bytes | `0, 1, 5, 6` |
| UTF-16 code units | `0, 1, 3, 4` |
| UTF-32 code units | `0, 1, 2, 3` |

Those are four coordinate representations of the **same semantic text**; they should not produce four different STRling definitions of `.` or “one repetition.” This is exactly the portability distinction UTS #18 makes between logical Unicode matching and storage serialization.

A byte-oriented target is therefore not intrinsically incompatible with Unicode intent. It has two defensible lowering paths. STRling can require an external decode step into a Unicode-capable engine, or it can compile scalar predicates into byte-sequence automata under a declared encoding such as **well-formed UTF-8**. The latter is only semantically valid if generated expressions preserve complete encoded scalar boundaries. A raw byte class that can begin in the middle of a multibyte encoding is not an exact implementation of scalar matching.

Conversely, a STRling **byte intent** should remain genuinely byte-oriented. Automatically decoding arbitrary bytes into Unicode is not lossless for all byte sequences and therefore changes the semantic domain. An encoding such as UTF-8 can be an explicit conversion contract; it should never be inferred merely because the destination runtime's API accepts strings.

### Grapheme clusters belong above the scalar alphabet

UAX #29 defines grapheme clusters as an approximation to what users perceive as characters. It exists precisely because one code point is often not one user-perceived character. Extended grapheme clusters are the preferred default segmentation model, and the algorithm is also useful for cursor movement, selection, and regex-style operations.

For example:

```text
e◌́
```

is U+0065 followed by U+0301. It consists of two Unicode scalar values but ordinarily one extended grapheme cluster. Its NFC form:

```text
é
```

is one scalar value and one grapheme cluster. UAX #15 guarantees normalization forms for canonically equivalent Unicode strings, while UAX #29 defines the segmentation algorithms that determine grapheme boundaries.

STRling should consequently avoid making “character” mean grapheme cluster in some operators and scalar value in others. The cleaner model is:

```text
unicode character       = Unicode scalar value
extended grapheme       = explicit UAX #29 sequence
byte character          = octet, only in byte-domain intent
host code unit          = representation detail
```

This lets a future semantic `extendedGrapheme`/`\X` operation exist without changing the alphabet underlying literals, ranges, property predicates, captures, quantifiers, and scalar offsets.

## Unicode data, predicates, normalization, and case

A Unicode property predicate is not timeless. Unicode 17.0.0 is the current published Unicode Standard version as of this report; UAX #44's current UCD is Unicode 17.0.0, and Unicode publishes each numbered UCD release into an immutable archived version directory. Unicode 17 added thousands of characters and property updates, while UAX #29 revision 47 changed `Word_Break=ALetter` for the already-encoded U+00B8 CEDILLA. Thus even the same pattern and the same pre-existing text can acquire different segmentation behavior after a Unicode data upgrade.

That fact is decisive for STRling: **the Unicode database version is part of regex meaning whenever a semantic construct depends on the database or on a versioned Unicode algorithm.**

### Unicode-version policy alternatives

There are three defensible models.

| Policy | Advantages | Problems |
|---|---|---|
| **Runtime-native Unicode** | Usually cheapest lowering; follows the host runtime automatically; takes advantage of native property tables. | Meaning can vary across targets and can change after a runtime upgrade without source changes. Exact cross-runtime equivalence is impossible unless their relevant Unicode data are known equivalent. |
| **STRling-release Unicode** | Every STRling language/compiler release has one documented Unicode meaning. Easier than per-artifact configuration. | Recompiling old source with a newer STRling release can change its language denotation. Artifacts are not self-describing unless the release is retained as provenance. |
| **Resolved version pinned into the compiled intent** | Reproducible; portable comparison knows exactly which UCD/algorithm semantics are intended; old source artifacts remain explainable. | Native target properties cannot always be trusted; exact range expansion or helper lowering may be needed when target Unicode data differ. |

**Recommended baseline:** source configuration may offer `pinned`, `STRling-default`, or explicitly `runtime-native`, but a compilation that claims reproducible portable semantics should resolve the choice to a **full Unicode version in its semantic artifact**.

For example:

```text
unicodeVersion = 17.0.0
```

should mean more than “the compiler happened to be built recently.” It should scope every UCD-derived predicate, case mapping, and version-synchronized algorithm unless that feature has a separately declared version/profile.

UTS #18 specifically says regex specifications should identify the relevant Unicode and UTS versions because property behavior can change. UAX #44 likewise documents both immutable per-release UCD snapshots and ongoing additions/changes to property data.

This is not theoretical runtime drift. Official Java documentation, for example, ties Java's character information to a specific Unicode release rather than to a perpetually current UCD; runtime releases therefore need not coincide with the newest Unicode Standard. Other runtimes similarly package or delegate Unicode data according to their own release policies. The portable semantic layer cannot safely infer “Unicode” as one universally synchronized thing.

### Character predicates should be semantic identities, not spellings

STRling should represent the meaning of a Unicode property class in something conceptually equivalent to:

```text
domain: unicodeScalars
predicate:
    property: General_Category
    relation: equals
    value: Decimal_Number
unicodeVersion: 17.0.0
```

The public DSL can remain concise, but the canonical identity should not be the target spelling `\p{Nd}`, `\p{Decimal_Number}`, `\p{Digit}`, `\d`, or a runtime API enum.

That distinction matters because UAX #44 defines canonical property and property-value names plus aliases, while UTS #18 recommends accepting standard aliases with Unicode's loose property-name matching conventions. A target regex language is free to recognize a narrower syntax. ECMAScript, for example, deliberately defines which property names and aliases its property escapes admit rather than simply accepting every UCD spelling.

Recommended property families for first-class portable predicates are:

| Predicate family | Canonical semantics |
|---|---|
| General category | Equality or membership using `General_Category`, such as `Lu`, `Letter`, or specifically `Decimal_Number`. |
| Script | Equality using the single-valued `Script` property. |
| Script extensions | **Membership** in `Script_Extensions`; this is not synonymous with `Script=X`. |
| Binary properties | Boolean membership, such as `Alphabetic`, `White_Space`, `Default_Ignorable_Code_Point`, `Join_Control`, etc., according to the declared Unicode version. |
| Fixed STRling classes | Explicit finite scalar sets/ranges whose membership does not depend on a target's Unicode tables, such as ASCII digit. |

UTS #18's basic Unicode property requirements specifically include general category, Script/Script_Extensions, and selected binary/core properties. It also illustrates why Script Extensions matters: a character may be usable with a script without having that script as its single `Script` value.

Aliases should therefore be a **source-language convenience layer**. STRling can normalize accepted aliases to canonical identifiers while retaining the original spelling for diagnostics. Emitters then choose the target's accepted spelling or abandon direct property emission in favor of expansion.

### Stable STRling classes versus Unicode properties

STRling should not clone the entire UCD into an independently defined proprietary classification system. That would create two evolving Unicode ontologies and force STRling to determine when its private definition ought to change.

Instead, two categories are useful:

**Versioned Unicode predicates** deliberately inherit a property from a specific Unicode version:

```text
unicode.decimalNumber   -> General_Category=Decimal_Number
unicode.whitespace      -> White_Space=true
unicode.alphabetic      -> Alphabetic=true
```

**Fixed STRling predicates** deliberately define timeless finite sets:

```text
ascii.digit       -> U+0030..U+0039
ascii.word        -> A-Z, a-z, 0-9, _
ascii.hexDigit    -> 0-9, A-F, a-f
```

The distinction should be visible in semantic identity. Calling both simply “digit” creates exactly the portability ambiguity this project is trying to eliminate.

### “Unicode digit” should mean `General_Category=Decimal_Number`

The safest definition of STRling's semantic Unicode digit is:

```text
General_Category = Decimal_Number (Nd)
```

UTS #18 uses decimal-number category characters in its Unicode word-character guidance, and the UCD formally defines General Category values.

That is better than making the canonical definition `\p{Digit}`. `Digit` is overloaded terminology across regex ecosystems, while `Decimal_Number`/`Nd` gives STRling an exact UCD proposition independent of target syntax.

This reveals a specific semantic cleanup opportunity in current STRling v3 documentation, which currently says Unicode `\d` is equivalent to `\p{Digit}`. The portable semantic definition should instead be expressed as `gc=Nd`; an emitter can use a native `\d` only when the target profile proves that its `\d` has exactly that membership under the required Unicode mode/version.

Thus:

```text
\d             recommended -> Unicode Decimal_Number / Nd
asciiDigit     recommended -> U+0030..U+0039
```

is substantially more defensible than “`\d` means whatever the destination regex engine means.”

### Normalization must remain an explicit text contract

The Unicode normalization forms NFC, NFD, NFKC, and NFKD provide standardized representations of equivalent text. NFC/NFD address canonical equivalence; NFKC/NFKD also apply compatibility mappings and therefore deliberately conflate some distinctions. UAX #15 defines these forms and their conformance behavior.

UTS #18 does **not** require every basic Unicode regex implementation to perform hidden canonical-equivalence matching. It discusses canonical equivalence as a higher-level requirement and recognizes normalization of the subject/pattern elsewhere in a larger system as a possible implementation strategy. This is important because generic regex canonical-equivalence matching becomes difficult around captures, combining-mark reordering, quantifiers, and subsequences.

The current STRling policy—no implicit normalization, sequence matching as written—is therefore a sound default and should be retained, but made fully explicit.

Four policies are defensible:

| Policy | Meaning | Portability assessment |
|---|---|---|
| **Raw scalar sequence** | No normalization assumption or transform. Canonically equivalent but differently encoded scalar sequences can differ in matching. | **Recommended default.** Exact and easy to reason about. |
| **Normalized-input contract** | Caller promises or STRling validates that subject is in a specified form such as NFC. Pattern is compiled under the same contract. | Strongly portable if validation and form are explicit. |
| **Pre-match normalization transform** | STRling or host normalizes subject and pattern before matching. | Semantically viable, but capture/span mapping to original input becomes a first-class obligation. |
| **Implicit canonical equivalence** | Regex atoms automatically match all canonically equivalent realizations. | Semantically powerful but difficult to lower and particularly problematic for exact captures/spans. Best kept out of baseline portable intent unless rigorously specified. |

A critical distinction is that an **input contract** is not the same thing as an **input transform**. If a caller promises NFC, offsets still refer directly to the supplied string. If STRling changes an NFD subject into NFC before matching, scalar count can change, so a map back to the original representation becomes necessary.

`é` versus `e + U+0301` is the simplest example. Hidden normalization can change a two-scalar original range into a one-scalar normalized range. Exposing the transformed index as though it were an original index would be factually wrong.

### Case-insensitive matching needs named relations

Unicode distinguishes simple and full case mappings/folding. Simple case folding is one-to-one at the code-point level; full case folding can expand one character to multiple characters. Locale-specific casing introduces a further semantic dimension, with Turkish/Azeri I behavior being the standard example of why locale-sensitive case behavior is not the same relation as default Unicode caseless matching. UTS #18 explicitly distinguishes basic/simple case-insensitive support from fuller multi-character and locale-sensitive behavior.

STRling should therefore avoid a semantic field that merely says:

```text
ignoreCase = true
```

without saying what relation is meant.

A useful model is:

| Case mode | Semantic relation | Portable status |
|---|---|---|
| `caseSensitive` | Scalar sequences compared exactly. | Baseline. |
| `asciiSimpleFold` | Fixed ASCII case pairs only. | Highly portable and version-independent. |
| `unicodeSimpleFold` | Default Unicode simple case folding under the pinned Unicode version. | **Recommended meaning of portable Unicode ignore-case.** |
| `unicodeFullFold` | Full default Unicode case folding, including multi-scalar folds. | Valuable but harder to lower exactly; should be explicit. |
| `localeCase` | Locale/culture-tailored casing/folding with an identified locale/data profile. | Explicit extension, not an implicit portable default. |
| `canonicalCaseless` | Unicode's normalization-plus-folding relation for canonical caseless equivalence. | Distinct from ordinary `/i`; should never be inferred from it. |

The classic example is German `ß` versus `SS`: full folding can establish equivalence that simple one-to-one folding cannot. Greek sigma demonstrates why even simple Unicode case-insensitivity is not equivalent to ASCII upper/lowercasing. Locale tailoring creates further differences.

The existing STRling statement that case-insensitive matching uses Unicode folding “where available” and no locale-specific rules should be strengthened. “Where available” is an emitter fallback policy, not a semantic definition. A portable intent needs to say exactly which fold it requires; a target that cannot implement it exactly must expand, transform, or reject rather than silently substitute a weaker native `i` mode.

## Words, graphemes, boundaries, newlines, and anchors

“Word” is the most overloaded concept in practical regex. At least three fundamentally different notions are routinely exposed under similar spellings:

1. a unary **word-character predicate** such as `\w`;
2. a **transition boundary** between word and non-word characters, traditionally `\b`;
3. a Unicode **word-segmentation algorithm** such as UAX #29.

They are not interchangeable.

UTS #18's basic word-boundary guidance already needs more than “letters, digits, underscore.” It identifies Unicode alphabetic characters, decimal numbers, and join controls as relevant and requires nonspacing marks to remain associated with their bases for word-boundary purposes. Its enhanced guidance distinguishes Unicode default word boundaries from the simple `\w`/`\W` transition model.

UAX #29 goes farther and defines a rule-based Unicode word segmentation algorithm. It is intended as a broadly useful **default**, not universal natural-language tokenization. Unicode explicitly allows tailoring because languages and scripts such as Thai, Lao, Chinese, and Japanese can need dictionary or language-aware segmentation beyond default word-boundary rules.

### STRling should separate word class from word segmentation

The current STRling documentation defines Unicode `\w` approximately as letters, numbers, and underscore and says `\b` uses Unicode properties by default. That direction needs a normative split.

A good semantic vocabulary is:

```text
unicodeRegexWordCharacter
regexWordBoundary
unicodeWordBoundary
unicodeWordNonBoundary
```

The first two form a compatibility pair:

```text
regexWordBoundary =
    transition between unicodeRegexWordCharacter
    and its complement / text edge
```

The second boundary family is different:

```text
unicodeWordBoundary =
    boundary produced by pinned UAX #29 Word_Break rules/profile
```

UTS #18 itself distinguishes enhanced Unicode word boundaries from the simpler boundary associated with the regex word-character class.

This solves the otherwise impossible question “What does `\b` mean?” There are several defensible answers, but they must have distinct semantic names even if source syntax retains compatibility shorthands.

### What should `\w` mean?

Several policies are defensible.

**Engine-native `\w`** is cheap but unsuitable as the canonical definition. Engines disagree on whether `\w` is ASCII-only, Unicode-sensitive, includes combining marks, includes connector punctuation, or changes under options.

**Current STRling `[Letter | Number | "_"]`** is simple and comprehensible, but it is not equivalent to UAX #29 word segmentation and omits categories that several Unicode-aware regex systems treat as word constituents, especially combining marks and connector punctuation. It also includes every Unicode number category if `N` is used, which is broader than the decimal-number component commonly used in standards guidance.

**A named UTS #18-oriented compatibility word predicate** is the best candidate if STRling wants `\w` to remain Unicode-aware. The exact formula should be frozen as part of the STRling language semantics rather than inferred from a destination engine. UTS #18 provides the standards basis for Alphabetic/decimal-number/join-control behavior and treatment of marks.

**UAX #29 Word_Break is not a valid definition of `\w` at all**, because segmentation is contextual; it is a boundary algorithm, not simply membership in one unary set.

Accordingly, the recommended design is to preserve `\w` only as shorthand for a **documented STRling Unicode regex-word predicate**, while exposing UAX #29 word segmentation as a different semantic operation.

The exact membership formula for the compatibility predicate remains one of the normative decisions to ratify; STRling should not encode it as the vague phrase “Unicode word character.”

### Grapheme-aware operations should exist, but explicitly

There is a strong standards case for portable grapheme-aware intent. UAX #29 provides a precise extended-grapheme-cluster algorithm, and UTS #18 describes grapheme boundary and grapheme-cluster regex operations such as `\X`-style constructs as enhanced Unicode support.

Recommended semantic constructs are therefore conceptually:

```text
extendedGrapheme
graphemeBoundary
graphemeNonBoundary
```

with:

```text
segmentationAlgorithm = UAX29
segmentationVersion   = Unicode/algorithm version
segmentationProfile   = default | explicitly tailored profile
```

The critical point is that supporting such intent does **not** require pretending every target can spell it natively. A portable semantic language can express an operation that a particular single-regex target cannot lower. The correct compiler result can be an exact structural rewrite, helper-assisted execution, preprocessing, or an explicit unsupported/rejection result.

This is preferable to omitting grapheme semantics merely because lowering is uneven. Semantic portability and syntactic single-pattern portability are different propositions.

For the core portable profile, the most reproducible baseline is the pinned **default UAX #29 extended-grapheme algorithm without locale tailoring**. Tailored CLDR/language profiles can be explicit extensions. UAX #29 itself permits profiles/tailoring and notes that default segmentation is not sufficient for every language.

### Boundary algorithms are versioned semantics

The Unicode 17 revision of UAX #29 changed the derivation of `Word_Break=ALetter` to include U+00B8 CEDILLA because of its use in Saanich.

That is a particularly valuable STRling evidence case. Suppose the pattern, input string, runtime regex implementation, and source code all remain byte-for-byte identical. If a word boundary is implemented via a newer UAX #29 dataset/profile, its behavior around U+00B8 may differ.

Therefore a semantic artifact saying only:

```text
boundary = unicodeWord
```

is incomplete. It must identify the applicable algorithm/data profile.

### Newline must be an independent semantic set

“Whitespace,” “line break,” “what dot excludes,” and “what multiline anchors recognize” are four concepts that runtimes frequently entangle but STRling should not.

Unicode regex guidance recognizes at least CRLF, LF, CR, NEL U+0085, LINE SEPARATOR U+2028, and PARAGRAPH SEPARATOR U+2029 for Unicode line-boundary handling. UTS #18's newline-sequence discussion additionally includes vertical tab and form feed in its broader newline-sequence set. It also treats CRLF specially so a logical line boundary should not be invented between CR and LF.

This gives STRling two defensible canonical policy choices:

| Newline policy | Set |
|---|---|
| **UTS #18 minimum line-boundary set** | `CRLF`, `LF`, `CR`, `NEL`, `LS`, `PS` |
| **Full UTS #18 newline-sequence set** | Above plus `VT` and `FF` |

**Recommendation:** use the full UTS #18 newline-sequence definition for a STRling semantic `newlineSequence`, while keeping the choice explicit in the text contract so a compatibility profile can choose the narrower set if required.

In either policy, **CRLF is one newline sequence for boundary semantics**. It contains two scalar values, but there should be no synthetic empty line between them.

This would improve on the current STRling documentation, which mentions ECMAScript's LF/CR/LS/PS set in its line discussion while separately describing default dot primarily in terms of excluding `\n`. A canonical language should define one coherent relationship among its line-oriented constructs rather than inheriting whichever newline convention an emitter happens to use.

### `\s` is not the newline set

Recommended semantic Unicode whitespace is:

```text
White_Space = true
```

under the pinned Unicode version.

That is a Unicode binary property and should not be derived from STRling's newline set. The two sets overlap, but they answer different questions. UAX #44 defines Unicode properties through the versioned UCD; UTS #18 includes `White_Space` among relevant regex properties.

Therefore:

```text
\s              -> Unicode White_Space
asciiWhitespace -> explicitly fixed ASCII set
newlineSequence -> independently defined sequence predicate
```

is preferable to defining one in terms of another.

### Dot should be a semantic atom, not a native period

STRling needs two clear meanings:

```text
anyScalar
anyScalarExceptLineBreak
```

A source `.` can map to the second in normal mode and the first in dot-all mode.

The default exclusion set should be derived from STRling's declared newline policy, not from the destination engine's `.` token. With the recommended full newline policy, a non-dotall scalar dot excludes individual line-break scalar values involved in LF, VT, FF, CR, NEL, LS, and PS; CRLF handling remains consistent with the higher-level newline-sequence model.

This is intentionally stronger than simply promising “`.` except `\n`.” UTS #18 emphasizes that arbitrary-character matching and line-boundary treatment need consistent Unicode newline handling.

### Anchors need semantic decomposition

UTS #18 observes that “end of line/string” has historically had multiple interpretations, including strict end-of-input, a point immediately before a final newline, and positions before line breaks in multiline mode.

STRling should not let a raw `$` token carry all those possibilities implicitly.

The semantic vocabulary should distinguish at minimum:

```text
textStart
textEnd
lineStart(newlinePolicy)
lineEnd(newlinePolicy)
endBeforeFinalNewline    // only if intentionally supported
```

Then source syntax can have conventional behavior:

```text
^ without multiline -> textStart
$ without multiline -> chosen documented end policy
^ with multiline    -> textStart | lineStart
$ with multiline    -> textEnd | lineEnd
```

The exact treatment of `$` before a final newline is a language-design decision, not something that should be inherited from the target regex spelling.

A target emitter may use native `^`/`$` only after proving that the relevant target profile, flags, and newline configuration implement the selected semantic anchor.

## Positions, captures, and malformed text

A portable regex system needs two conceptually separate answers for every successful match:

1. **What semantic substring matched?**
2. **How did this runtime locate that substring in its native representation?**

Those answers frequently use different coordinates.

Some UTF-8-oriented APIs return byte indices even while matching Unicode code points; JavaScript's external strings and indices are based on UTF-16 code units even when Unicode-aware regex modes cause the matcher to treat surrogate pairs as Unicode code points for relevant pattern operations. This is precisely why “start = 5” is not a portable fact unless its unit is recorded. UTS #18's distinction between logical character semantics and UTF serialization supports keeping these dimensions separate.

### Recommended span model

A conformance-quality STRling result should conceptually preserve:

```text
capture:
    matchedText: ...
    nativeSpan:
        start: ...
        end: ...
        unit: byte | utf16CodeUnit | utf32CodeUnit | hostDefined
    semanticSpan:
        start: ...
        end: ...
        unit: unicodeScalarBoundary
    transformationProvenance:
        ...
```

Optional derived coordinates can include:

```text
graphemeSpan:
    unit: extendedGraphemeBoundary
    segmentationVersion: ...
    segmentationProfile: ...
```

A position should therefore be modeled as a **boundary**, not as “character number N.” There are `n + 1` boundaries around `n` scalar values, and a half-open span `[start,end)` identifies the consumed sequence cleanly. This also corresponds naturally to the offset convention used by most programming-language matching APIs.

### Native spans must never be discarded

The user's existing Regex Lab principle that native span units should be preserved is the right requirement.

For `A𝄞B`, if a runtime reports the G-clef capture as:

```text
native: [1, 3) UTF-16 code units
```

and another reports:

```text
native: [1, 5) UTF-8 bytes
```

both can normalize to:

```text
semantic: [1, 2) Unicode scalar boundaries
```

They are **semantically equivalent spans but empirically different native observations**.

Conformance comparison should therefore compare the scalar span for cross-target semantic equivalence while retaining native spans for API fidelity and evidence. A normalized semantic result should supplement—not overwrite—the observation delivered by the actual runtime.

This directly follows the project's authority model: the Knowledge Program owns the semantic interpretation, while Regex Conformance owns what an exact runtime execution actually returned.

### Transformations require offset provenance

Normalization, malformed-input replacement, or helper-based full folding can break a one-to-one relationship between transformed and original positions.

Examples:

```text
original:   e + U+0301
NFC:        é
```

and:

```text
original:   ß
full fold:  ss
```

show different varieties of length change. UAX #15 defines normalization behavior, while UTS #18 explains that full Unicode case handling can introduce multi-character relationships.

If STRling performs such a transform, it needs an **offset map** that can explain which original span corresponds to a transformed match.

Not every transformation admits a simple “add or subtract N” mapping. Combining-mark reordering can make correspondence more complex, and a semantic operation may conceptually match material whose transformed representation has different boundaries. The result model must be allowed to state that an exact original contiguous coordinate is unavailable rather than fabricating one.

This is a major reason not to perform normalization or full folding silently.

### Invalid UTF belongs at the text-domain boundary

Malformed encoded input is not simply another Unicode character.

Recommended Unicode-input policy:

```text
decodePolicy = reject
```

The byte/code-unit sequence must decode to a sequence of Unicode scalar values before it enters the canonical Unicode text domain.

This aligns most directly with Unicode's well-formed encoding model. Unicode requires ill-formed encoded input to be treated as an error condition; replacement processing is available as a recovery mechanism, while silent interpretation of malformed sequences as ordinary characters is not a sound Unicode model.

Two additional policies can still be legitimate if explicit:

**Replacement mode**

```text
decodePolicy = replace
replacement = U+FFFD
```

The regex then operates on the repaired Unicode scalar sequence. Evidence must record that transformation and maintain enough source-coordinate provenance to explain where replacement occurred.

**Raw mode**

```text
domain = bytes
```

or, as a target extension:

```text
domain = rawCodeUnits
```

The input is intentionally not interpreted as ordinary well-formed Unicode text. Unicode properties and Unicode scalar assumptions cannot automatically carry into this domain.

What should *not* exist is:

```text
domain = unicode
malformedBehavior = whateverTargetDoes
```

because that is a portability hole.

A runtime may reject malformed UTF, replace it, expose individual malformed code units, or map malformed bytes to an error scalar. Those are observably different languages of input. Leaving this unspecified can change matches, captures, and indices even when the pattern appears unrelated to encoding.

### Noncharacters and unassigned scalars are not malformed encoding

The scalar domain should include every Unicode scalar value, not only assigned graphic characters.

An unassigned scalar in Unicode version X remains a scalar; its UCD property defaults are determined by that version. A later Unicode release may assign the scalar and change relevant property membership. UAX #44 explicitly records property changes and additions as Unicode evolves.

This is another reason complements must be defined over the **scalar universe**:

```text
not Letter
```

means every scalar that does not satisfy `General_Category ∈ Letter` for the pinned version.

It must not accidentally mean:

```text
every value representable in the target's 16-bit character class
```

because that could introduce isolated surrogates that are outside STRling's Unicode scalar domain.

## Target lowering, Unicode-version evidence, and Conformance

The fundamental lowering rule should be:

> **Target syntax is acceptable only when its denotation under the exact target profile equals the STRling semantic denotation. Similar spelling is not evidence of semantic equality.**

This is especially important for shorthands. Current STRling already recognizes, for example, that JavaScript `\w`/`\b` behavior is not transformed into broad Unicode word semantics merely by enabling Unicode mode and that PCRE-style engines can change shorthand behavior under Unicode-property options.

### A lowering ladder

STRling can classify Unicode lowering conceptually into five levels.

| Lowering class | Example | Defensibility |
|---|---|---|
| **Native exact** | Target property/boundary mode is known to have exactly the required semantics and Unicode version/profile. | Ideal; emit native syntax. |
| **Static semantic expansion** | Expand pinned `gc=Nd`, Script, Script_Extensions membership, or binary property into scalar ranges. | Exact for unary code-point predicates if representation and complement handling remain scalar-safe. |
| **Structural regex rewrite** | Rewrite a semantic boundary or supplementary-scalar operation using lookarounds/alternation/encoding structures. | Exact where target features suffice; compiler should prove construction, not guess. |
| **Preprocessing/helper lowering** | Normalize subject, segment graphemes, or apply a portable matching wrapper. | Exact if transformation and span mapping are part of the artifact contract. |
| **Reject or qualify** | Target cannot preserve the required meaning/captures/spans. | Correct outcome; preferable to silent semantic degradation. |

### Properties are especially amenable to exact expansion

For a pinned Unicode version, these predicates are finite sets over the scalar universe:

```text
General_Category = X
Script = X
X in Script_Extensions
Binary_Property = true
```

Consequently they can conceptually be compiled into explicit scalar ranges even if the destination engine lacks the corresponding property syntax.

But “scalar range” is not necessarily synonymous with “one target character class.”

A UTF-16 code-unit engine without scalar-aware class semantics may require supplementary characters to be represented through surrogate-pair structures. A byte engine may require complete UTF-8 sequences. A complement must likewise exclude encodings that are not valid scalars. UTS #18's code-point-versus-code-unit requirement is the standards basis for treating those rewrites as semantically necessary rather than cosmetic.

This means “target does not support `\p{Script_Extensions=...}`” should not immediately imply “unsupported.” For a fixed UCD version, Script_Extensions membership is still a finite scalar set and may be exactly expandable. The compiler only needs to reject when the target representation or resource constraints make exact lowering unavailable.

### Boundaries are not just character-set expansion

UAX #29 grapheme and word boundaries are contextual algorithms. They cannot in general be reduced to a unary property class.

Therefore lowering:

```text
unicodeWordBoundary
graphemeBoundary
extendedGrapheme
```

requires one of:

- a native construct proven to implement the same algorithm/profile;
- a structural regex encoding of the relevant state machine;
- preprocessing/helper execution;
- rejection.

A native target `\b` is not a valid fallback simply because both constructs contain the word “boundary.”

### Canonical equivalence and full folding are transform-level semantics

Full Unicode folding can create one-to-many relationships, and canonical equivalence can involve normalization and combining-character behavior. UTS #18 discusses both as higher levels of Unicode regex support beyond basic code-point predicates.

Therefore an emitter should not lower:

```text
unicodeFullFold
```

to an arbitrary native `/i` unless that exact target profile's folding relation is established.

Likewise:

```text
canonicalEquivalent
```

should not become a target canonical-equivalence option merely because one exists; the exact capture and comparison semantics need to agree with STRling's contract.

### Unicode dependency fingerprint

Every compiled intent for which reproducible Unicode meaning matters should carry enough information to construct something conceptually like:

```text
textContract:
    domain: unicodeScalars
    unicodeVersion: 17.0.0

    normalization:
        mode: none

    case:
        mode: unicodeSimpleFold
        unicodeVersion: 17.0.0

    word:
        regexWordProfile: strling.<version>
        segmentation:
            algorithm: UAX29
            unicodeVersion: 17.0.0
            profile: default

    grapheme:
        algorithm: UAX29
        unicodeVersion: 17.0.0
        profile: default

    newline:
        profile: uts18-full

    malformedInput:
        policy: reject

    resultCoordinates:
        semantic: unicodeScalarBoundary
        preserveNative: true
```

The exact serialization belongs to broader IR/schema work and is outside this inquiry, but the **semantic dimensions themselves cannot be omitted**.

When static property expansion is used, the artifact should additionally preserve a hash/version of the generated set or lowering tables. Then the compiler can distinguish “semantics inherited from target Unicode data” from “semantics baked into this artifact.”

### When Unicode changes invalidate evidence

Evidence invalidation should be dependency-driven rather than “every runtime update invalidates everything.”

| Change | Should prior Unicode evidence be considered sufficient? |
|---|---|
| Runtime's Unicode database changed and lowering used native Unicode properties | **No**, for affected property/case/segmentation claims. Revalidation is required. |
| Runtime's Unicode database changed but STRling emitted an exact pinned static range set independent of runtime properties | Not solely because the UCD changed. Revalidate only if target regex execution semantics or generated construction changed. |
| STRling changes pinned Unicode version | **No** for predicates, folds, or algorithms whose membership/behavior can differ. |
| UAX #29 version/profile changes | **No** for grapheme/word-boundary evidence. |
| CaseFolding data/version changes | **No** for affected case-insensitive behavior. |
| New target runtime release changes native index conventions/API | **No** for span/API evidence even if match denotation is unchanged. |
| Normalization policy changes from raw to NFC transform | **No** for match, capture, and span equivalence claims. |
| Malformed-input policy changes | **No** for any evidence involving potentially ill-formed input. |
| Newline profile changes | **No** for dot, newline, multiline anchor, or line-boundary claims. |

Unicode 17's UAX #29 change for U+00B8 is a concrete demonstration that segmentation evidence cannot be treated as timeless merely because the character itself existed before Unicode 17.

The UCD's immutable version archives are valuable here: an old compiled artifact can retain a stable semantic dependency even after Unicode advances.

### Conformance should test semantic and native results separately

Regex Conformance is specifically structured to preserve reproducible observations rather than promote undocumented runtime behavior into normative semantics. The text contract should therefore produce its own cross-cutting conformance dimensions.

A minimum text-model campaign should include:

| Obligation | Discriminating probes |
|---|---|
| **Scalar atomicity** | `𝄞` and another supplementary scalar under literal, `.`, class, quantifier, capture, alternation. Confirm one semantic atom regardless of UTF encoding. |
| **Encoding/index separation** | `A𝄞B`; capture `𝄞`; record native span and expected scalar span in UTF-8-, UTF-16-, and other target profiles. |
| **Unicode decimal digit** | ASCII `1` plus non-ASCII `Nd`, such as Arabic-Indic U+0661; distinguish it from fixed ASCII digit. |
| **General categories** | Representatives of `Nd`, `Nl`, `No`, letters, marks, separators, punctuation; confirm exact requested category rather than broad “number.” |
| **Script vs Script_Extensions** | Characters whose single Script and Script_Extensions memberships differ; verify the two predicates are not conflated. |
| **Binary properties** | `White_Space`, `Alphabetic`, `Join_Control`, default-ignorable and selected negative cases. |
| **Aliases** | Canonical and accepted UCD aliases should resolve to one semantic predicate, while target emission uses only target-valid syntax. |
| **Unassigned/version-dependent scalars** | Probe a scalar whose assignment/property membership differs across Unicode versions. |
| **Normalization** | NFC `é` vs NFD `e + U+0301`; raw mode must distinguish them unless the pattern explicitly accepts both. Test each supported normalization contract. |
| **Combining-order canonical equivalence** | Canonically equivalent sequences with reordered combining marks to ensure hidden normalization is not accidentally supplied. |
| **Simple folding** | Greek sigma cases and other non-ASCII one-to-one folds. |
| **Full folding** | `ß` versus `ss`/`SS`; distinguish full from simple behavior. |
| **Locale behavior** | Turkish dotted/dotless I to prove that portable default folding is locale-independent; separately test any explicit locale profile. |
| **Regex word class** | Base letter + combining mark; connector punctuation; join controls; non-decimal numbers; underscore. |
| **Classic word boundary** | Transition cases around each edge of the defined STRling word predicate. |
| **UAX word boundary** | Apostrophe/mid-letter cases, combining marks, emoji-adjacent text, scripts represented in Word_Break tests, and Unicode-version differentials such as U+00B8. |
| **Grapheme segmentation** | Combining sequences, emoji ZWJ sequences, regional-indicator flags, prepend/extend cases using UAX #29 GraphemeBreak test data. |
| **Newline** | LF, CR, CRLF, NEL, LS, PS, and—under the recommended full profile—VT and FF. Verify no line boundary between CR and LF. |
| **Dot** | Every declared newline scalar plus ordinary scalar and supplementary scalar in normal/dotall modes. |
| **Anchors** | Text start/end, internal line breaks, CRLF, final newline, empty input, and multiline mode. |
| **Malformed UTF-8** | Invalid leading byte, overlong sequence, truncated sequence, surrogate encoding; verify reject/replace/raw policies separately. |
| **Malformed UTF-16** | Lone high and low surrogates; verify they cannot silently enter the scalar domain. |
| **Span mapping** | Supplementary scalar, decomposed grapheme, normalized subject, replacement-decoded subject; compare native and semantic coordinates. |
| **Unicode upgrade differential** | Run intentionally version-sensitive vectors under two UCD/algorithm profiles and prove the evidence fingerprint distinguishes them. |

UAX #15 and UAX #29 publish conformance-oriented normalization and segmentation test material, while the UCD supplies the normative property and case data from which property/folding vectors can be generated.

A conformance result should consequently distinguish at least:

```text
semantic match/no-match
semantic capture text
semantic scalar spans

native match/no-match
native capture representation
native spans + unit

Unicode/version/profile provenance
lowering strategy
malformed-input treatment
```

Two targets can then be declared semantically equivalent for a vector even if their native spans differ, while the native observations remain available and scientifically accurate.

## Dangerous assumptions and unresolved normative decisions

The practical value of an explicit text contract is easiest to see in cases where a regex looks trivial but has multiple defensible runtime meanings.

### Dangerous assumptions

| Pattern or concept | Subject | Hidden assumption | Failure mode |
|---|---|---|---|
| `^.$` | `𝄞` U+1D11E | “One visible character equals one host code unit.” | A UTF-16 code-unit regex mode can see two units; scalar semantics see one character. UTS #18 requires code-point-oriented Unicode matching for this reason. |
| `\d+` | `١` U+0661 | “Every target's `\d` means Unicode digit.” | ASCII-only shorthand and `gc=Nd` differ. STRling must lower the semantic predicate, not copy the spelling. |
| `\w+` | `e◌́` | “Unicode word character means letters/numbers/underscore.” | The combining mark may be excluded from a simplistic unary class even though Unicode word-boundary treatment keeps marks with their base. |
| `\w` | U+203F UNDERTIE | “All Unicode regex word sets have identical membership.” | Connector punctuation and similar categories expose differences among common `\w` definitions. |
| `\b` | `can't` | “A `\w`/`\W` transition is the same thing as Unicode word segmentation.” | UAX #29 uses contextual rules around mid-word punctuation; simple transition boundaries and Unicode word boundaries denote different boundary sets. |
| literal `é` | `e◌́` | “Canonical equivalence is automatic Unicode behavior.” | They are canonically equivalent but distinct scalar sequences. Current STRling correctly does not normalize automatically; an explicit policy is required. |
| ignore-case `ß` | `SS` | “Unicode ignore-case is one relation.” | Simple and full folding differ because full folds can be multi-scalar. |
| ignore-case `I` | Turkish text | “Default Unicode folding and locale-sensitive casing are interchangeable.” | Locale tailoring can change equivalence. Portable default must remain locale-independent unless locale is part of the contract. |
| `.` around CRLF | `\r\n` | “Newline means LF.” | A target may let dot match CR while another line model treats CRLF as a single newline; dot, newline, and anchors become inconsistent. |
| `$` | final newline | “End anchor has one universal meaning.” | Some regex traditions permit a pre-final-newline position while strict end-of-text semantics do not. UTS #18 identifies multiple historical interpretations. |
| Unicode word boundary | text containing U+00B8 | “A Unicode boundary algorithm is timeless.” | UAX #29 Unicode 17 changed U+00B8's Word_Break derivation to `ALetter`; identical source can therefore segment differently under different Unicode profiles. |
| capture `𝄞` in `A𝄞B` | same text on several hosts | “Span `[1,2)` is inherently portable.” | It is `[1,2)` in scalar offsets, `[1,5)` in UTF-8 bytes, and `[1,3)` in UTF-16 units. Unit must accompany every reported coordinate. |
| invalid encoded data | malformed UTF | “Unicode regex engines all receive the same character.” | Rejecting, replacement decoding, and raw-unit matching produce different semantic subjects. Unicode treats malformed encoding as an error condition, so recovery policy must be explicit. |
| `\P{Letter}` | UTF-16 target | “Negating a target character class automatically means scalar complement.” | A code-unit complement can admit isolated surrogates, which are outside the recommended STRling Unicode alphabet. |
| `\p{sc=Kana}` vs `\p{scx=Kana}` | shared-script punctuation/marks | “Script and Script_Extensions are synonyms.” | `Script_Extensions` is membership in a potentially multi-script set; it carries different information from the single-valued Script property. |

### Recommended canonical STRling contract

Taken together, the most defensible baseline is:

| Question | Recommended STRling answer |
|---|---|
| **What is Unicode text?** | A sequence of Unicode scalar values. |
| **What is a character?** | One scalar value unless an operation explicitly says grapheme cluster. |
| **What is byte text?** | A separate sequence-of-octets domain. |
| **Are UTF-8/16/32 different semantic alphabets?** | No. They are encoding forms/target execution representations of scalar text. |
| **Does STRling assume normalization?** | No by default. |
| **Is canonical equivalence implicit?** | No. It requires an explicit normalized-input, transform, or canonical-equivalence policy. |
| **Which Unicode version applies?** | Resolve and record a complete Unicode version in reproducible compiled intent; runtime-native semantics are an explicitly weaker portability mode. |
| **What is Unicode digit?** | `General_Category=Decimal_Number (Nd)`. |
| **What is Unicode whitespace?** | Binary `White_Space`, separate from newline. |
| **What is `\w`?** | A specifically named STRling Unicode regex-word predicate with frozen membership rules; final exact formula needs ratification. It is not UAX #29 segmentation. |
| **What is `\b`?** | Preserve a classic predicate-transition boundary if desired, but expose UAX #29 Unicode word boundary as a different semantic operation. |
| **Are grapheme operations portable intent?** | Yes, explicitly, using a pinned UAX #29 extended-grapheme profile; individual targets may require rewriting/helper execution or reject exact lowering. |
| **What is newline?** | Prefer UTS #18 full newline sequences: CRLF, LF, VT, FF, CR, NEL, LS, PS, with CRLF atomic for boundaries. |
| **What does dot mean?** | Any scalar except the declared line-break set; dotall means any scalar. |
| **What do anchors mean?** | Explicit text-start/text-end or line-start/line-end predicates; never merely “whatever target `^`/`$` does.” |
| **How is ignore-case defined?** | Prefer pinned default Unicode **simple** folding for baseline portable `/i`; full folding and locale tailoring are separate explicit modes. |
| **What happens to malformed UTF?** | Reject at the Unicode-domain boundary by default. Replacement/raw-unit behavior must be explicitly selected. |
| **What is a match position?** | A typed boundary coordinate. Preserve target-native span plus a Unicode-scalar semantic span when a valid mapping exists. |
| **What happens after normalization/folding/replacement transforms?** | Preserve transformation provenance and an offset map; never invent original offsets when no exact mapping exists. |
| **When does evidence expire?** | When a dependency that affected the tested semantics—UCD data, case data, segmentation profile, newline policy, malformed policy, native index model, or lowering implementation—changes. |
| **Can Unicode properties be statically compiled?** | Unary scalar properties generally can be expanded exactly from a pinned UCD. Contextual segmentation and multi-scalar equivalence require structural/helper lowering or rejection. |

### Normative decisions still requiring STRling authority

Several points have strong recommendations but more than one defensible policy, so they should be recorded as explicit language decisions rather than smuggled into emitter behavior.

**The meaning of existing `\w`.** The current `[Letter Number _]` description is easy to understand but not a sufficiently standards-aligned definition of Unicode regex word behavior. STRling needs to choose and version an exact predicate formula. A UTS #18-oriented formula is recommended; UAX #29 should remain a separate boundary concept.

**The meaning of existing `\b`.** Retaining compatibility `\b` as a transition based on STRling's exact `\w` predicate is defensible and familiar. Redefining it directly as UAX #29 segmentation is also conceptually attractive but would change the relationship between `\w` and `\b`. The cleaner language evolution is to retain the traditional pair and add an explicitly Unicode-segmentation boundary.

**Whether `\d`, `\s`, `\w`, and `\b` remain Unicode-by-default surface shorthands.** Current STRling semantics take that direction. The strong recommendation is to retain Unicode semantics for `\d` and `\s` but define them canonically as `Nd` and `White_Space`. `\w`/`\b` need the more careful split above. Explicit ASCII forms should be available rather than overloading a global “Unicode mode.”

**Whether the canonical newline set is UTS #18 minimum or full newline sequence.** The full set gives the most coherent Unicode-centric meaning and is recommended; the minimum six-sequence line-boundary set has slightly less semantic distance from several mainstream engines. Either is defensible only if dot and line anchors use the same chosen policy.

**Whether baseline Unicode ignore-case is simple or full folding.** Simple default case folding is recommended because it corresponds to the baseline expectation described by UTS #18 and avoids automatic one-to-many text transformations. Full folding is a useful separate intent and should not be excluded, but its capture/backreference/lowering semantics must be specified explicitly.

**Whether canonical-equivalence matching belongs in portable core.** The recommended answer is “not implicitly.” Raw scalar matching should remain the default. An explicit normalized-input contract is straightforward; an explicit normalization transform is supportable with offset provenance; fully transparent canonical-equivalence matching is substantially harder to make defensible for captures and spans. UAX #15 and UTS #18 support keeping these concerns distinct.

**Whether Unicode version is pinned per language release or per compiled artifact.** Both are viable. Per-artifact resolved versioning is stronger for evidence reproducibility and long-lived compilation artifacts and is therefore recommended. A STRling release can still supply the default version that becomes pinned at compilation.

**Whether runtime-native Unicode remains an allowed portability mode.** It is useful for convenience and compact output, but its claim must be weaker: “meaning follows this target profile's Unicode data,” not “this artifact has target-independent Unicode membership.” UAX #44's versioned property data and UAX #29's demonstrated rule changes make that distinction unavoidable.

**Whether raw surrogate/code-unit regex intent is supported.** It may be necessary for exact interop with particular host string models, but it should be a visibly different domain or extension. Making lone surrogates ordinary members of portable Unicode text would surrender the clean scalar invariant that makes UTF-8/16/32 comparison tractable.

**Whether UAX #29 default segmentation or a CLDR/language-tailored profile is the portable grapheme/word baseline.** A pinned, untailored UAX #29 default is recommended for deterministic cross-target intent. Tailoring is useful but necessarily adds profile/locale data to the semantic contract; UAX #29 explicitly anticipates such tailoring.

**Whether semantic scalar spans are mandatory in every public matching API.** The research strongly supports computing them whenever Unicode scalar text and an exact mapping exist, while always retaining native coordinates for evidence and host interoperability. Whether all public APIs expose both eagerly or derive semantic offsets on demand is an API question outside the present domain.

The resulting architecture is conceptually simple despite the number of dimensions: **STRling owns an abstract scalar or byte language; Unicode versions own the membership and algorithm tables; normalization, folding, segmentation, newline, and malformed handling are explicit semantic policies; emitters prove or construct equivalent target behavior; and runtimes report their native positions without redefining what the regex meant.**

That lets portability claims survive the fact that one target stores strings as UTF-16, another returns UTF-8 byte offsets, another uses native Unicode properties from an older UCD, and another has no native grapheme boundary at all. “Character,” “word,” “boundary,” and “position” cease to be accidental properties of destination APIs and become versioned STRling concepts with testable lowering obligations.
