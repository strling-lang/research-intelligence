# Symbolic Equivalence and Representational Substitution for Future Generalized STRling Pattern Systems

Role: Research report
Origin: AI-assisted deep research commissioned for STRling Research Intelligence
Generated: 2026-08-14
Imported: 2026-08-14
Source verification: Partially verified
Last reviewed: 2026-08-14
Current status: Active input

## Executive finding

The central finding is that **“looks like,” “means the same,” “can be normalized to the same form,” “could have been produced from,” and “a human might interpret as” are different relations and must not collapse into one generalized equivalence operator**.

Unicode itself demonstrates why. Canonical normalization says that two sequences represent the same abstract character when their normalized forms agree; Unicode security confusables also reduce strings to common skeletons, but UTS #39 explicitly says those skeletons are security-testing intermediates and **must not be used as identifier normalization**. A deterministic collapse function therefore does not, by itself, establish semantic equivalence. citeturn12view1turn20search1

For a future generalized STRling system, the sound model is a **typed relation algebra over spans or strings**, not a universal fuzzy character relation. The minimum useful distinctions are:

1. **literal identity**;
2. **standardized equivalence**, including Unicode canonical equivalence and explicitly chosen compatibility/case profiles;
3. **declared symbolic equivalence**, established by a domain or pattern author;
4. **confusability**, meaning representations may be mistaken for each other without asserting semantic sameness;
5. **structural or perceptual similarity**, normally scored rather than boolean;
6. **directed transformation/transduction**, which can be one-to-one, one-to-many, many-to-one, context-sensitive, or lossy;
7. **contextual interpretation**, where surrounding text, language, domain, or rendering environment determines a plausible reading; and
8. **uncertain inference**, where several candidate interpretations remain and evidence only ranks them.

That separation is especially important for examples such as `0/O`, `1/I/l`, `3/E`, `rn/m`, and `vv/w`. None of those pairs should acquire universal equivalence merely because some renderings or adversarial spellings make them similar. Unicode's own confusables process acknowledges that visual similarity varies by font, style, writing system, context, and user knowledge, while leetspeak research likewise treats visual obfuscations as perturbations that humans may decode rather than as formal character identity. citeturn20search0turn20search1turn15search4

This direction also fits STRling's existing research and compiler boundaries. Research Intelligence explicitly describes its output as non-normative, preserves uncertainty and counterexamples, and leaves acceptance of implementation-facing recommendations to the STRling product repository. fileciteturn5file0L2-L2 The current STRling repository already describes an AST → target-agnostic IR → target-regex pipeline and emphasizes readable, composable intent; a future representational layer can therefore plausibly preserve relation type and provenance before any target lowering rather than flattening every relation into raw alternatives. fileciteturn6file0L2-L2

The most important design principle is consequently:

> **Representational collapse is an operation; equivalence is a semantic claim. They must remain distinct.**

A matcher may discover that two strings share a Unicode confusable skeleton, a case-folded form, an OCR candidate, or a declared `rn ↔ m` mapping. Its explanation must still say **which relation licensed that comparison and why**.

## Formal relation taxonomy

Let \(S=\Sigma^*\) be the set of finite strings over the system's declared symbol domain. Nothing in this report requires STRling to settle its complete observation or attribute ontology; \(S\) is only enough structure to distinguish the relations relevant to representation.

The following taxonomy is recommended.

| Relation class | Formal shape | Typical example | Determinism | Symmetric / transitive? | Recommended semantic status |
|---|---|---|---|---|---|
| **Literal identity** | \(Id(x,y)\iff x=y\) | `O` = `O` | Deterministic | Yes / yes | Fundamental exact relation |
| **Canonical equivalence** | \(E_f(x,y)\iff f(x)=f(y)\), with a standards-defined canonicalizer such as NFD | `é` vs `e` + combining acute | Deterministic for fixed standard/version | Yes / yes | First-class standardized equivalence |
| **Profile equivalence** | Equality after an explicitly named fold/profile | full case fold; NFKC-based identifier profile | Deterministic for fixed profile | Usually yes / yes when defined by common canonical form | First-class only when profile is explicit |
| **Declared symbolic equivalence** | Explicitly declared equivalence classes or a named domain relation | application declares two symbols interchangeable | Deterministic from registry | Should be yes / yes **if called equivalence** | Plausible first-class relation |
| **Confusability** | \(C_p(x,y)\); often equality after a security skeleton | Latin `a` vs Cyrillic `а` under UTS #39 | Deterministic for fixed UTS #39 data/profile; underlying perception is not | UTS #39 deliberately makes it transitive; perceptual confusability need not be | First-class security/perceptual relation, **not equivalence** |
| **Structural/perceptual similarity** | \(sim_p(x,y)\rightarrow\mathbb R\) or ordered category | OCR `l`/`1`; glyph-shape similarity; edit similarity | Scored | Generally neither | Candidate-generating / approximate |
| **Transformation / transduction** | \(T_p\subseteq S\times S'\), or \(T_p:S\to S'\) when functional | transliteration, width folding, `ph→f`, whitespace deletion | Rule-dependent | Directional; usually not symmetric or transitive in the equivalence sense | First-class operation, not equivalence |
| **Span correspondence** | relation between source and target intervals plus strings | `rn ↔ m`, `ß ↔ ss`, `œ ↔ oe` | Rule-dependent | Direction/profile dependent | Necessary to model variable-length substitution |
| **Contextual interpretation** | \(I_p(x,c)\rightarrow\{y_1,\ldots\}\) | `0ver` interpreted as `Over`; abbreviation expansion | Context-dependent | No general algebraic guarantees | Higher-level interpretive relation |
| **Uncertain inference** | \(Q_p(y\mid x,c)\) or ranked candidates | OCR recovery; spelling correction; adversarial decipherment | Probabilistic/scored | No | Must remain explicitly uncertain |

### Literal identity

Literal identity should mean **the same sequence of values in the declared matching domain**, with no case folding, normalization, transliteration, ignored whitespace, confusable reduction, or implicit rendering assumptions.

This apparently trivial relation is important because every less exact result should remain distinguishable from it. A match produced by `0 → O` should never be reported as if the input literally contained `O`.

### Unicode canonical equivalence

Unicode defines canonical equivalence for characters or sequences representing the same abstract character, and UTS #18 defines regex canonical equivalence by equality after NFD. Thus precomposed `é` and decomposed `e◌́` can be canonically equivalent while remaining different literal sequences. citeturn13search4turn12view1

Formally:

\[
x \equiv_{\mathrm{canon}} y
\quad\Longleftrightarrow\quad
NFD(x)=NFD(y)
\]

This is a genuine standardized equivalence relation and is much stronger evidence of interchangeability than visual resemblance. Unicode normalization is designed so equivalent strings receive a unique normalized representation, and normalization transformations are idempotent. citeturn13search4

Canonical equivalence nevertheless does **not** imply identical source representation. Combining marks can reorder, characters can split or compose, and offsets into normalized text can therefore differ from offsets into the source text. UTS #18 explicitly notes that canonical-equivalence matching is difficult around character splitting, merging, and reordering. citeturn12view1

### Compatibility and case-profile equivalence

Unicode's compatibility equivalence is deliberately broader. NFKC/NFKD can erase distinctions involving presentation forms, width, ligatures, superscripts, and other compatibility distinctions; UAX #15 specifically warns against blindly applying these forms to arbitrary text because meaningful distinctions can be lost. citeturn13search4turn19view1

For this reason, **compatibility equivalence should not be conflated with canonical equivalence**. It is better modeled as a named profile:

\[
x \equiv_{p} y
\quad\Longleftrightarrow\quad
fold_p(x)=fold_p(y)
\]

where \(p\) specifies, for example, `NFKC`, `NFKC_Casefold`, simple Unicode case folding, or full Unicode case folding.

Case folding reinforces the need for string-level rather than character-only relations. UTS #18 defines case-insensitive equivalence by equality after case folding, distinguishes simple 1:1 folding from full folding with 1:n mappings, and gives examples in which a ligature and a multi-character sequence become equivalent only under full folding. It also notes the familiar `ß`/`SS` variable-length case. citeturn12view0turn12view2

UAX #31 likewise requires an implementation claiming normalized or case-insensitive identifier equivalence to specify the normalization form and simple/full folding policy. Its `toNFKC_Casefold` transform combines compatibility normalization and case folding and removes default-ignorable code points. citeturn14search0

The resulting principle is:

**“Case-insensitive,” “width-insensitive,” and “compatibility-insensitive” are named comparison profiles, not properties of literal identity.**

### Declared symbolic equivalence

Some substitutions have no appropriate universal Unicode relation yet may be legitimate inside a particular symbolic domain. A future STRling environment could therefore support **declared symbolic equivalence** as an authoritative, scoped statement from a domain or pattern definition.

If a relation is actually called *equivalence*, it should obey the normal mathematical requirements:

\[
x\sim x
\]

\[
x\sim y \Rightarrow y\sim x
\]

\[
x\sim y\land y\sim z\Rightarrow x\sim z
\]

A declaration such as “for this machine-readable identifier scheme, these two published spellings denote the same identifier” can legitimately create such a class.

By contrast, a declaration such as `0 resembles O` should normally be a **declared confusable/substitution relation**, not equivalence. Otherwise a system risks manufacturing transitive claims the author never intended. For example, separately stating that `1` resembles `I` and `I` resembles `l` does not necessarily mean every rendering of `1` should be freely interchangeable with every rendering of `l`.

This is a design recommendation rather than an established Unicode rule, but it follows directly from Unicode's explicit separation between equivalence/normalization and security confusability. citeturn13search4turn20search1

### Visual confusability

Unicode UTS #39 supplies the strongest standardized precedent for visual confusability. Its current data maps source characters to **prototypes**, where a prototype itself may be a sequence of symbol classes; `œ`, for example, has a prototype corresponding to `o` followed by `e`. Strings are transformed to skeletons, and two strings are defined as confusable when their skeletons agree. citeturn20search1

That definition is deterministic once the Unicode version, direction/profile, and data are fixed:

\[
x\cong_{UTS39}y
\quad\Longleftrightarrow\quad
skeleton(x)=skeleton(y)
\]

Yet the **phenomenon being approximated is not deterministic**. Unicode explicitly describes confusability as a matter of degree: glyphs vary by font; contextual shaping can alter appearance; italic styling can introduce confusions absent in upright text; and familiarity with a writing system changes what users find confusing. The Unicode submission criteria therefore emphasize ordinary font sizes and common UI fonts and acknowledge cases requiring human judgment. citeturn20search0turn20search1

This leads to an important distinction:

- **UTS #39 confusable** is a reproducible, versioned security relation.
- **Visually similar under renderer \(r\)** is a perceptual or measured relation that may depend on font, style, size, shaping, display direction, and observer population.

They should not share a single semantic identity.

UTS #39 itself underscores the distinction by warning that a skeleton is not suitable for display and **should not be used as normalization**. It also deliberately closes its data under transitivity and substring operations for practical security detection, accepting some odd results from that closure. citeturn13search3turn20search1

Therefore, although UTS #39 confusability is mathematically transitive under its fixed skeleton mechanism, STRling should not infer:

\[
x\cong y \;\Rightarrow\; x\equiv y
\]

That implication is false by definition of the relation's purpose.

### Structural similarity, contextual interpretation, and inference

OCR, spelling correction, leetspeak recovery, and moderation evasion occupy a different category again. NIST's TREC OCR work explicitly treated corrupted text probabilistically: corpora with approximately 5% and 20% OCR character-error rates were searched, and methods attempting probabilistic reconstruction of the clean text generally outperformed approaches that simply accepted the corruption. citeturn15search0 Earlier OCR correction work likewise framed the task as statistical correction **in context**. citeturn17search12

Spelling correction has long been modeled as a noisy-channel problem rather than an equivalence table, including Brill and Moore's improved error model and earlier noisy-channel work. Weighted finite-state approaches provide another formal mechanism for representing possible corrections and their costs. citeturn15search2turn15search16turn17search13

Similarly, adversarial-text research finds that humans often recognize visually perturbed forms such as leetspeak while NLP systems may not; Eger et al. explicitly studied transformations such as `!d10t` and `1337` as **visual adversarial perturbations** rather than formal character identities. citeturn15search4 Wu et al. went further and modeled disguised abusive text as the result of an invented cipher, applying decipherment to recover candidate plaintext. That is naturally an *interpretation/inference* relation, not declared equivalence. citeturn17search15

Consequently:

\[
sim(x,y)=0.91
\]

or

\[
P(\text{“Over”}\mid\text{“0ver”}, context)=0.94
\]

must not be silently converted into

\[
x\equiv y
\]

even when a downstream matching policy ultimately chooses to accept the candidate.

## Composition, span mappings, and multi-symbol substitutions

The hardest technical point is not `0/O`; it is **variable-length correspondence**. Unicode and transliteration systems already demonstrate that useful symbolic relationships do not respect one-code-point-to-one-code-point boundaries.

UTS #18 explicitly models regex items as either code points **or multi-code-point strings**, and its discussion of character classes with strings gives examples such as `ch`, `sch`, and multi-code-point emoji. It notes that implementations must account carefully for overlapping strings and matching order. citeturn12view2turn12view3 Full Unicode case folding also includes 1:n mappings. citeturn12view0 ICU transliteration rules can directly replace one string with another and may use preceding and following context. citeturn16search0turn16search2

### Span correspondence rather than character equivalence

`rn` versus `m` should therefore be modeled conceptually as:

\[
R(
  [i,i+2),\text{“rn”},
  [j,j+1),\text{“m”}
)
\]

not as either:

\[
r\sim m
\]

or

\[
n\sim m
\]

Neither constituent of `rn` individually corresponds to `m`; the **span as a whole** does.

The same approach naturally handles:

- `vv ↔ w`;
- `œ ↔ oe`;
- full-fold `ß ↔ ss`;
- transliteration such as a single source symbol becoming several Latin letters;
- OCR errors in which touching characters merge, or one glyph is segmented into multiple recognized symbols.

UTS #39 provides a useful conceptual precedent: its prototypes can themselves contain multiple symbols, so a single input character may reduce to a multi-symbol skeleton. That demonstrates how a system can establish string-level confusability without claiming pairwise character identity. citeturn20search1

A future STRling relation should therefore have **source span and target span cardinality as explicit facts**, rather than assuming one symbol on either side.

### One-to-many and many-to-one behavior

A relation should distinguish at least four cardinality cases:

| Shape | Example | Important implication |
|---|---|---|
| 1 → 1 | case variant, many homoglyphs | Character-local implementation may be possible |
| 1 → n | `ß → ss`, transliterated symbol → digraph | Source and target offsets diverge |
| n → 1 | `rn → m`, merged OCR glyph | Segmentation is part of the match |
| n → m | transliteration/rewrite sequence | General string relation/transducer required |

This is more than an implementation detail. A many-to-one rule introduces **segmentation ambiguity**. In a larger string containing `rn`, the matcher cannot assume that those letters form the perceptual unit relevant to an `m` substitution merely because such a correspondence exists somewhere. The candidate needs a precise span witness and any applicable context constraints.

Unicode's string-class machinery has the same underlying problem: when alternatives overlap, multi-code-point alternatives require deliberate ordering/handling instead of pretending that they are scalar character classes. citeturn12view3 ICU likewise supports context-sensitive rules and explicitly warns that rule ordering changes results. citeturn16search0turn16search2

### Transformation is directional

Transliteration provides a particularly clear counterexample to treating all mappings as symmetric equivalence. ICU supports explicitly directional rules, contextual transforms, compound transforms, and inverse transform names, but warns that an inverse does **not** guarantee exact reversal. Its documentation discusses transliteration ambiguities in which different source sequences can produce the same target sequence, as well as systems deliberately augmented to improve reversibility. citeturn16search0

Thus:

\[
T(x)=y
\]

does not generally entail:

\[
T^{-1}(y)=x
\]

and neither direction entails semantic equivalence.

For example, an ASCII-oriented transliteration may intentionally throw away distinctions present in the source script. That may be perfectly useful for search, but the result is a **lossy transform**.

The same principle applies to:

- accent stripping;
- punctuation removal;
- whitespace collapsing;
- width conversion;
- transliteration;
- leetspeak decoding;
- moderation-evasion recovery.

These should be recorded as transformations even when a matching policy decides to compare their results.

### What composes safely

Composition should be a property of **typed operations**, not a blanket permission to take transitive closure across all relations.

Safe or defensible composition includes:

**Identity.** Composing identity with another relation does not alter that relation.

**A single genuine equivalence relation.** If \(x\equiv_p y\) and \(y\equiv_p z\) under the same exact profile \(p\), transitivity permits \(x\equiv_p z\).

**Named deterministic transformations.** If \(T_1:S\to U\) and \(T_2:U\to V\), the explicit pipeline \(T_2\circ T_1\) is meaningful. ICU compound transforms and finite-state-transducer composition provide established computational precedents. citeturn16search0turn17search0

**Explicitly normalized comparisons.** Applying an agreed normalizer before another operation can be legitimate when the order and profile are normative to that operation; UTS #39, for example, incorporates Unicode normalization as part of its defined skeleton construction rather than leaving the combination accidental. citeturn20search1

Unsafe composition includes:

\[
canonicalEquivalent(x,y)
\land
confusable(y,z)
\not\Rightarrow
canonicalEquivalent(x,z)
\]

and:

\[
confusable(x,y)
\land
similar(y,z)
\not\Rightarrow
confusable(x,z)
\]

Likewise, a sequence such as:

`compatibility-fold → confusable skeleton → whitespace deletion → spelling correction`

must not be treated as one unnamed “normalization.” Each step changes the claim being made.

Thresholded similarities are particularly unsuitable for transitive closure. Even where the underlying score is a metric, “distance ≤ threshold” need not remain true across a chain; with learned visual or contextual scores, metric properties may not exist at all. Weighted/spelling systems are therefore better understood as candidate-generating mechanisms than equivalence classes. citeturn17search13turn15search2

### A normalization-specific composition trap

Unicode adds a subtler warning: even strings that are individually normalized do not necessarily remain normalized after ordinary concatenation. UAX #15 says that **none** of NFC, NFD, NFKC, or NFKD is closed under simple string concatenation because combining characters can interact across the new boundary. citeturn13search4

Thus a generalized matcher cannot safely assume:

```text
normalize(a) + normalize(b)
==
normalize(a + b)
```

for arbitrary strings.

That matters to a compositional pattern language: transformations that operate on text boundaries need explicit contracts about whether they run on components, concatenated material, or the final subject.

## Standards, algorithms, and evidence classes

There is no single authoritative dataset covering all representational substitution. Instead, different relation classes have different authorities.

### Unicode normalization, case, width, and identifiers

**Unicode Standard Annex #15 — Unicode Normalization Forms** is the primary standard for NFC, NFD, NFKC, NFKD, canonical equivalence, and compatibility equivalence. It explicitly distinguishes the stronger semantic claim of canonical equivalence from compatibility mappings that may erase meaningful visual or semantic distinctions. Width variants, ligatures, superscripts, Roman numeral forms, and similar compatibility cases are among the categories handled by NFKC/NFKD. citeturn13search4turn19view1

**Unicode Standard Annex #31 — Unicode Identifiers and Syntax** defines profiles for normalized and case-insensitive identifiers and specifies `toNFKC_Casefold`. It is especially valuable as a warning against generalized folding: UAX #31 notes that mathematical programming languages that make semantic use of Mathematical Alphanumeric Symbols must exclude `Decomposition_Type=Font` characters from blanket NFKC treatment. citeturn14search0

**Unicode Technical Standard #18 — Unicode Regular Expressions** establishes canonical-equivalence and case-folding semantics relevant to pattern matching and, crucially for STRling, explicitly recognizes properties/classes containing multi-code-point strings. citeturn12view0turn12view1turn12view3

These standards together argue against a generic `normalizeEverything()` model. The normal form, folding algorithm, Unicode version, and application profile are semantically material.

### Unicode confusables and spoofing

**Unicode Technical Standard #39 — Unicode Security Mechanisms** is the principal authoritative source for Unicode identifier spoofing and confusable detection. The Unicode 17.0 security-data distribution contains `confusables.txt`, `confusablesSummary.txt`, `IdentifierStatus.txt`, `IdentifierType.txt`, and `intentional.txt`. citeturn14search2

The standard's core algorithm maps strings to skeletons and compares those skeletons. It distinguishes single-script, mixed-script, and whole-script confusables, and its current bidirectional-aware machinery accounts for the fact that rendered display order can matter. citeturn13search3turn13search9

UTS #39 should be treated as a **security-oriented confusability profile**, not a universal glyph-equivalence database. Its data collection examines common fonts and includes human judgment; the specification acknowledges that font and contextual shaping make perceptual confusability inherently approximate. citeturn20search0turn20search1

That distinction matters for “homoglyph detection.” A software system that simply asks “do their UTS #39 skeletons agree?” implements one standardized security test. A system that rasterizes arbitrary fonts or computes learned glyph embeddings is solving the broader **visual similarity** problem and needs renderer/model provenance; it should not claim to implement Unicode equivalence merely because its output resembles a confusables table. Unicode itself stresses that arbitrary fonts can change the appearance associated with a code point. citeturn20search1

### Rendering, bidi, and segmentation

Logical order and apparent visual order can diverge. UTS #39 includes bidi-aware confusable processing, while the Trojan Source research demonstrated the security consequence directly: bidirectional controls can cause source code to be logically encoded in a different order from the way a human reviewer sees it. citeturn13search3turn16search1

A generalized symbolic matcher therefore needs to distinguish at least:

```text
logical representation
rendered representation
```

A renderer-level relation must never silently overwrite or replace the logical source sequence.

The same concern appears with segmentation. **UAX #29 — Unicode Text Segmentation** supplies default grapheme, word, and sentence boundary algorithms but explicitly permits—and sometimes requires—language or environment tailoring. It states that grapheme clusters only approximate user-perceived characters and notes font- and framework-dependent cases. Word boundaries are likewise not equivalent to “split on whitespace”; some languages do not use spaces as word separators, and languages such as Thai, Lao, Chinese, and Japanese require additional mechanisms for satisfactory word segmentation. citeturn13search1turn19view2

Consequently, whitespace removal or boundary normalization should be a **declared transformation or segmentation profile**, never a universal equivalence. For example:

```text
"foo bar"
"foobar"
```

may be intentionally equivalent in one identifier/search profile and sharply different in prose or programming source.

### Transliteration

ICU's Unicode transform subsystem is a strong implementation precedent for explicit symbolic transformation. It supports case conversion, normalization, full/halfwidth conversion, script transliteration, character removal, compound transforms, filters, context-sensitive rules, and explicit forward/backward rules. citeturn16search0

Its transliteration documentation makes three points directly applicable here:

First, **transliterations are named profiles**. There can be many systems for one script/language pair, often based on external standards. citeturn16search0turn16search2

Second, **mappings can be ambiguous and variable-length**. A source character may map to a digraph, and a target digraph can also arise from multiple source characters. ICU describes such ambiguities explicitly. citeturn16search0

Third, **an inverse is not necessarily a true inverse**. Case conversion and many transliterations lose information, so merely naming a reverse transform does not guarantee round-trip identity. citeturn16search0

Transliteration therefore belongs decisively in `transformation`, not in intrinsic symbolic equivalence.

### OCR, spelling, and approximate symbolic substitution

There is no universal OCR confusion table analogous to Unicode canonical decomposition. OCR errors depend on the imaging process, typeface, degradation, recognizer, segmentation, and language context; the NIST TREC experiments explicitly varied image quality and obtained materially different character error rates. citeturn15search0

Useful algorithmic families instead include:

- statistical/noisy-channel reconstruction for OCR and spelling; citeturn17search12turn15search2turn15search16
- weighted finite-state correction models; citeturn17search13
- explicit finite-state transducers and their composition for representing variable-length mappings; citeturn17search0
- visual-character representations and rule-based recovery for adversarial/leetspeak forms. citeturn15search4

These are algorithm families for **structural similarity, transformation, and uncertain reconstruction**. They should not enlarge a core equivalence relation.

A confusion such as:

```text
rn → m
```

can therefore have several different provenances:

```text
visual-confusable(common-font-profile)
ocr-confusion(model=X)
declared-substitution(domain=Y)
adversarial-decoding(profile=Z)
```

The surface pair is the same; the relation is not.

### Leetspeak, moderation/search evasion, and abbreviation

Research on adversarial orthography confirms that transformations such as numeral/letter substitution are frequently deliberately chosen so humans can reconstruct a message while automated systems fail. citeturn15search4 Other work treats repeated evasion as a decipherment problem, meaning that the mapping from surface form to intended plaintext can be inferred statistically rather than prescribed by a stable character table. citeturn17search15

This category should therefore resist standardization into a global dictionary like:

```text
0 == O
3 == E
1 == I
```

Those substitutions may be plausible in:

```text
0ver
h3llo
```

but not necessarily in:

```text
IPv6 address
serial number
mathematical expression
version identifier
mixed alphanumeric password
source code
```

That is precisely the distinction between **available substitution evidence** and **contextual interpretation**.

Abbreviations sit still farther from visual equivalence. A domain authority can explicitly declare an abbreviation relation, but ordinary expansion depends on language and domain. Even Unicode text segmentation illustrates the underlying ambiguity: a period may mark a sentence boundary, an abbreviation, or a number, so text alone does not always uniquely determine interpretation. citeturn13search0

Abbreviation is therefore appropriate only as:

- declared domain transformation, when an authority supplies the mapping; or
- contextual interpretation/inference, otherwise.

It should not enter a generic character-equivalence table.

## Information loss, context dependence, and adversarial bounds

### Normalization can destroy information

Normalization is often described as making text “the same,” but that phrase obscures crucial differences among forms.

NFC and NFD preserve canonical equivalence, yet can change the code-point representation and ordering. NFKC and NFKD additionally erase compatibility distinctions. UAX #15 specifically warns that those compatibility forms may remove formatting distinctions that are semantically important. citeturn13search4turn19view1

Examples of potentially destroyed distinctions include:

| Transformation | Information at risk |
|---|---|
| NFD/NFC | Original composition and source code-point layout; original offsets |
| NFKC/NFKD | Width, typographic forms, superscripting, ligature choices, mathematical styled-symbol distinctions |
| Full case folding | Original case and sometimes original symbol cardinality |
| `NFKC_Casefold` | Compatibility distinctions, case, and default-ignorable characters |
| Accent stripping | Diacritics that may distinguish words or letters |
| Whitespace collapse | Original token/layout boundaries and spacing distinctions |
| Transliteration | Script distinctions and any distinctions merged by the target alphabet |
| Confusable skeleton | Original scripts and characters; UTS #39 explicitly prohibits treating the result as ordinary normalized identifier text |
| Bidi/display reordering | Logical source sequence if only the visual rendering is retained |

The standards explicitly support several of these warnings. UAX #31 notes that `NFKC_Casefold` removes default ignorables and warns about mathematical alphanumeric distinctions. citeturn14search0 UTS #39 goes further: blanket removal/rejection of joining controls is inappropriate because ZWJ/ZWNJ can be needed for legitimate distinctions in particular languages and contexts. citeturn19view0

Thus an implementation should preserve:

\[
raw\_input \neq transformed\_working\_form
\]

as separate values.

A normalized or interpreted view can support matching, indexing, or security checks, but it should not become the only retained representation.

### Rendering dependence

The following dependencies should be explicit in any relation profile:

| Relation | Language dependent | Culture/community dependent | Font/render dependent | Unicode-version dependent |
|---|---:|---:|---:|---:|
| Literal identity | No | No | No | No, given fixed encoded values |
| Unicode canonical equivalence | No | No | No | Algorithm/data version should be recorded |
| Unicode compatibility profile | Application dependent | Possibly | Not to execute, though distinctions folded are often presentational | Yes |
| Default Unicode case fold | Mostly standardized rather than locale-specific | No | No | Yes |
| Transliteration | Often | Often | Sometimes | Implementation/profile dependent |
| UTS #39 confusability | Script-sensitive | User familiarity can matter | **Yes in underlying perception** | **Yes** |
| Measured glyph similarity | Possibly | Possibly | **Fundamentally yes** | Dataset/model dependent |
| Grapheme/word segmentation | Often | Sometimes | Some grapheme/UI cases | Yes |
| OCR confusion | Often through language model | No inherent universal value | **Yes**, plus image/acquisition conditions | Model/data dependent |
| Leetspeak/algospeak interpretation | Often | **Strongly** | Sometimes | Not fundamentally Unicode-versioned |
| Abbreviation | **Strongly** | Often | No | Domain/version dependent |
| Spelling correction | **Strongly** | Sometimes | Usually no | Model/dictionary version dependent |

Unicode's documentation gives unusually clear evidence for the font/rendering rows: confusability depends on fonts, contextual shaping, font style, and user familiarity, while UAX #29 notes that even detailed cursor/display unit determination can require font and rendering-engine information. citeturn20search1turn19view2

### Adversarial transformations must be bounded

An adversarial matcher that permits arbitrary chains of “plausible” edits will eventually make almost every short string related to many unrelated strings. This is not merely a performance issue; it destroys the semantic content of the match.

A defensible future symbolic pattern system should therefore bound adversarial transformation along **structural dimensions**, without prematurely defining the numeric weighting scheme reserved for Weighted Symbolic Similarity.

Useful bounds include:

**Relation-family bounds.** A pattern or profile should state which relation classes are permitted: for example, Unicode confusables and declared leetspeak substitutions, but not arbitrary spelling correction.

**Transformation-depth bounds.** Do not recursively rewrite until a fixed point across heterogeneous rules. An explicit finite pipeline or maximum number of transformation steps prevents uncontrolled closure.

**Span-size bounds.** Multi-character substitutions should declare the maximum source and target span they can consume. `rn ↔ m` should not imply an unrestricted search for arbitrary segment rewrites.

**Expansion bounds.** One-to-many transformations can produce combinatorial candidate growth; profiles should bound generated alternatives or operate symbolically rather than materializing every variant.

**Script/profile bounds.** Unicode's own security mechanisms distinguish script configurations and provide identifier restriction mechanisms because unrestricted cross-script acceptance creates spoofing hazards. citeturn13search9turn19view0

**Cycle bounds.** Rewrite graphs should detect cycles. A declared `a→b`, `b→c`, `c→a` transformation set must not cause infinite normalization.

**Context bounds.** A context-sensitive rule should state which surrounding span or metadata it consults, rather than treating an arbitrary language model as an invisible oracle.

**Provenance bounds.** Each accepted transformation path should remain reconstructable. If a result can only be justified by a huge opaque search through substitutions, it has crossed from explainable symbolic matching into general fuzzy inference.

These restrictions are consistent with established systems. ICU's transformations are named, ordered, filterable, and explicitly context-sensitive; UTS #39 uses a defined skeleton algorithm and versioned data rather than arbitrary glyph similarity; statistical spelling/OCR systems keep uncertain alternatives in a probabilistic or weighted model. citeturn16search0turn20search1turn17search13

## Provenance and explainable symbolic matching

The relation taxonomy is useful only if a matcher can explain an individual result. The recommended unit of explanation is a **relation witness**: evidence that a particular source span was connected to a particular target span by a particular named relation.

Conceptually:

```text
RelationWitness {
    sourceRepresentation
    sourceSpan

    targetRepresentation
    targetSpan

    relationKind

    authorityOrProfile
    datasetOrAlgorithmVersion

    direction
    sourceCardinality
    targetCardinality

    contextUsed

    lossiness
    reversibility

    evidenceOrMapping
    scoreOrConfidence?       // only when the relation is actually scored

    parentWitnesses[]        // when this step follows other explicit steps
}
```

This is not proposed STRling syntax; it is the minimum provenance concept needed to keep representation-aware matching intelligible.

### Provenance should say why, not merely that

Consider matching pattern `Over` against:

```text
0ver
```

A poor explanation is:

```text
match: 0.93
```

A useful symbolic explanation is:

```text
pattern span: "O"
input span:   "0"

relation:
    visual-substitution

basis:
    declared profile "latin-leet-basic"

direction:
    input "0" -> interpreted "O"

remaining spans:
    "ver" matched literally

result:
    transformed match, not literal identity
```

With UTS #39, the witness would instead identify the Unicode security profile/data version and the relevant skeleton mapping. Because UTS #39 data can change across Unicode versions and its skeletons are explicitly not stable interchange formats, version provenance is mandatory for reproducibility. citeturn13search3turn14search2

With OCR, a witness might say:

```text
relation:
    ocr-candidate

observed span:
    "rn"

candidate:
    "m"

evidence:
    OCR confusion model X

status:
    uncertain inference
```

The NIST and statistical OCR literature supports precisely this distinction between observed corrupted text and probabilistically reconstructed clean text. citeturn15search0turn17search12

### Multi-stage explanations must preserve the chain

Suppose an input is matched only after:

```text
original
  -> NFKC
  -> case fold
  -> declared leetspeak substitution
  -> pattern
```

The matcher should not report merely:

```text
normalized equivalent
```

Those operations have different authorities and different information-loss properties. UAX #15 and UAX #31 themselves distinguish normalization, compatibility folding, and case folding; Unicode security then defines a different skeleton mechanism for confusability. citeturn13search4turn14search0turn20search1

The explanation should therefore preserve the ordered witness:

```text
input
  --compatibility-fold(UAX15/NFKC)-->
A
  --full-case-fold(Unicode profile)-->
B
  --declared-substitution(profile=P)-->
pattern
```

That provides two important properties:

**Auditability.** A developer can determine whether a surprising match came from NFKC, confusability, a domain declaration, or an approximate inference.

**Policy control.** A consuming application can accept, reject, warn on, or display different relation classes differently without reverse-engineering an opaque score.

### Scores should not erase relation type

A future weighted-similarity system may eventually attach costs or scores to some of these operations, but that does not justify replacing relation kinds by a scalar.

For example:

```text
canonical equivalence
UTS39 confusable
OCR candidate
edit-distance neighbor
contextual abbreviation
```

could conceivably all receive downstream numeric values. Their evidence semantics remain categorically different. Unicode canonical equivalence is a normative equivalence; UTS #39 confusability is a versioned security relation; OCR recovery is model evidence; abbreviation interpretation may be lexical/domain knowledge. citeturn12view1turn20search1turn15search0

Therefore the appropriate abstraction is:

\[
\text{RelationEvidence} \;+\; \text{optional score}
\]

not:

\[
\text{RelationEvidence} := \text{score}
\]

That boundary preserves the role of the separate Weighted Symbolic Similarity research rather than prejudging how signals should be combined.

## Recommendations for future STRling pattern research

The evidence supports a layered adoption model rather than one universal substitution mechanism.

### Relations suitable for exact symbolic participation

**Literal identity should remain the base relation.**

**Unicode canonical equivalence is suitable as a first-class standardized relation**, provided normalization policy and Unicode data/version provenance are explicit. UTS #18 supplies the direct regex precedent. citeturn12view1

**Named standardized folding profiles are suitable**, including explicitly selected case-fold and compatibility/identifier profiles, but should never masquerade as literal identity. UAX #15 and UAX #31 provide the governing distinctions and warnings. citeturn13search4turn14search0

**Declared symbolic equivalence is suitable**, provided it really represents an authoritative equivalence relation rather than generic resemblance. The declaration should be named, scoped, versionable, and explainable.

**Deterministic transformations are suitable**, including transliteration, width conversion, whitespace policies, or application-specific rewrites, provided they retain direction, ordering, lossiness, context requirements, and span mappings. ICU demonstrates that such transforms can be composable without pretending they are equivalences. citeturn16search0

**Variable-length span correspondences should be a fundamental capability.** Unicode regex string properties, full case folding, UTS #39 prototypes, and transliteration all demonstrate that useful symbolic relations routinely cross scalar boundaries. citeturn12view0turn12view3turn20search1

### Relations suitable for explicit non-equivalent matching

**UTS #39 confusability is highly suitable as an optional, versioned relation class**, especially for security, identifier, moderation, and search use cases. It must retain the label *confusable* rather than being promoted to equivalence. citeturn20search1

**Renderer-specific glyph similarity is plausible**, but it belongs to an approximate/perceptual layer. A relation profile would need to identify the font/rendering environment or model, because Unicode itself establishes that glyph confusability changes across fonts and styles. citeturn20search0turn20search1

**Segmentation and whitespace policies are plausible as named transformations**, not general identity. UAX #29 shows that boundaries are context-, operation-, and language-sensitive. citeturn13search1turn19view2

### Relations that should remain candidate-generating or contextual

**OCR confusion should remain uncertain evidence unless a domain explicitly promotes a particular mapping to a deterministic rule.** The relevant literature treats OCR recovery statistically and contextually. citeturn15search0turn17search12

**Spelling variation should distinguish declared variants from inferred corrections.** A dictionary that explicitly states two accepted spellings can supply a declared relation; edit/noisy-channel correction remains approximate. citeturn15search2turn17search13

**Leetspeak and adversarial orthography should generally remain scoped substitution or contextual-decoding profiles.** The research evidence shows these conventions can be intentionally human-readable and machine-evasive, but does not establish a universal equivalence table. citeturn15search4turn17search15

**Abbreviation should normally remain domain-declared or contextual.** It is too dependent on language, lexical conventions, and surrounding context to belong to generic symbolic equivalence; Unicode segmentation itself demonstrates that punctuation around abbreviations is ambiguous without additional interpretation. citeturn13search0

**General uncertain inference should not become a boolean relation simply because a threshold is crossed.** It should return candidates plus provenance and leave acceptance policy to the appropriate higher layer.

### Recommended relation lattice

The resulting conceptual order should not be interpreted as a single numerical similarity scale:

```text
                    REPRESENTATIONAL RELATIONS

                         literal identity
                               │
             ┌─────────────────┴─────────────────┐
             │                                   │
    standardized equivalence            declared equivalence
     canonical / case /                   domain-authorized
       named profiles
             │                                   │
             └──────────────┬────────────────────┘
                            │
                  exact symbolic relations


             confusability         transformation
          security / perceptual     directional
                 │                      │
                 └──────────┬───────────┘
                            │
                 explainable non-identity
                    span correspondences


              structural / visual similarity
                            │
                  contextual interpretation
                            │
                    uncertain inference
```

The vertical layout does **not** mean that every lower relation is weaker or stronger in a mathematical sense. It expresses increasing dependence on context, model choice, or uncertainty. UTS #39 is a particularly useful reminder: a confusable relation may itself be perfectly deterministic once a skeleton profile is chosen, while still making a weaker semantic assertion than Unicode canonical equivalence. citeturn12view1turn20search1

### Direct answers to the research questions

| Question | Finding |
|---|---|
| **Which relations are deterministic versus scored/contextual?** | Identity, Unicode canonical equivalence, fixed case/compatibility profiles, fixed declared equivalence, fixed UTS #39 skeleton comparison, and deterministic rule transforms can be deterministic. Glyph similarity, OCR recovery, spelling correction, adversarial decoding, and ordinary contextual interpretation may be scored/contextual. UTS #39 is a key hybrid: deterministic algorithm, approximate model of human visual confusion. citeturn20search1turn15search0 |
| **Which can safely compose?** | Identity; transitive steps within the **same** genuine equivalence/profile; and explicitly ordered compatible transformations. Heterogeneous relations must retain their typed path rather than collapse by transitivity. Transform composition is established practice in ICU and finite-state systems. citeturn16search0turn17search0 |
| **How should one-to-many and many-to-one behave?** | As mappings between spans/strings with explicit cardinalities and offset alignment. Full case folding, Unicode string classes, confusable prototypes, and transliteration establish precedents. citeturn12view0turn12view3turn20search1 |
| **How should `rn` versus `m` be modeled?** | As a whole-span relation such as visual confusability, OCR confusion, or declared substitution. Do not derive `r~m` or `n~m`. Competing segmentations remain distinct candidate alignments. |
| **How should provenance explain a relationship?** | Record original spans, relation type, authority/profile, algorithm/data version, exact mapping, direction, context, cardinality, lossiness/reversibility, and score only where genuinely scored. UTS #39's version-dependent skeleton data makes version provenance especially important. citeturn13search3turn14search2 |
| **When can normalization destroy information?** | Whenever representation itself matters; especially compatibility folding, case folding, default-ignorable removal, whitespace collapse, accent removal, transliteration, and security skeletonization. UAX #15 and UAX #31 explicitly warn about compatibility and mathematical distinctions. citeturn19view1turn14search0 |
| **How should adversarial transformations be bounded?** | By allowed relation classes, transformation depth, source/target span length, expansion, script/profile, context, cycle detection, and preserved provenance—not by unrestricted closure. Unicode security itself uses explicit data/profile restrictions. citeturn19view0turn20search1 |
| **Which relations are language-, culture-, font-, or rendering-dependent?** | Transliteration, segmentation, spelling, abbreviations, and adversarial conventions are often language/domain dependent; leetspeak/algospeak is community-dependent; visual confusability and OCR are strongly rendering/acquisition dependent. Unicode canonical equivalence is substantially independent of those factors. citeturn16search0turn19view2turn20search1turn15search4 |
| **What authoritative datasets and standards exist?** | UAX #15 normalization; UAX #31 identifiers/case profiles; UTS #18 regex; UTS #39 plus Unicode security data; UAX #29 segmentation; Unicode bidi algorithms as incorporated by UTS #39; ICU transforms for widely used transliteration/transformation implementations; NIST TREC for OCR-retrieval research. citeturn13search4turn14search0turn12view3turn14search2turn13search1turn16search0turn15search0 |
| **How can matching remain explainable?** | Make relation kind and witness path part of the match result; preserve original text; never substitute one all-purpose normalized key for heterogeneous relations; and keep approximate scores attached to typed evidence rather than replacing it. This is consistent with STRling's stated emphasis on readable intent and Research Intelligence's emphasis on provenance, uncertainty, and counterexamples. fileciteturn5file0L2-L2 fileciteturn6file0L2-L2 |

The resulting research recommendation is therefore **not** to build a larger synonym table for symbols. It is to give future generalized STRling systems a small number of rigorously distinct relation classes, with string/span cardinality, direction, profile, context, and provenance preserved as semantic facts.

Under that model, all of these statements can coexist without contradiction:

```text
0 ≠ O                    literal identity

é ≡ e◌́                  Unicode canonical equivalence

ß ≈ SS                   full case-fold equivalence

а ≅ a                    Unicode-security confusability
                         in an applicable UTS #39 profile

rn ~visual m             possible span-level visual relation
                         under a specified rendering/profile

rn ->OCR m               possible OCR confusion/transduction

0ver ->interpret Over    contextual/adversarial interpretation
```

The crucial protection is that **none of the arrows silently turns into `=`**. Unicode normalization, Unicode security, transliteration practice, OCR research, spelling correction, and adversarial-text research all independently support keeping those claims separate. citeturn13search4turn20search1turn16search0turn15search0turn15search2turn15search4

For STRling, that separation offers a plausible route to generalized symbolic matching without reducing the system to an opaque fuzzy matcher: deterministic relationships remain reproducible; approximate relationships remain labeled as approximate; multi-symbol substitutions remain proper span mappings; lossy transformations remain visible; and every nonliteral match can carry an inspectable reason for why the two representations were related.

**Present research stage complete.**
