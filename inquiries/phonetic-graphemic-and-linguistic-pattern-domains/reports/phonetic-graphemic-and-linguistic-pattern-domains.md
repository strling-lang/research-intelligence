# Phonetic and Linguistic Symbolic Representation as a Stress Test for STRling Pattern Semantics

Role: Research report
Origin: AI-assisted deep research commissioned for STRling Research Intelligence
Generated: 2026-08-14
Imported: 2026-08-14
Source verification: Partially verified
Last reviewed: 2026-08-14
Current status: Active input

## Executive conclusion

Phonetics is an unusually strong test case for generalized symbolic pattern semantics because **the useful symbolic units do not form a single substitution table or even a single sequence**. Text participates simultaneously in orthographic, lexical, morphological, phonological, and prosodic structures, and the mappings between those structures can be one-to-one, many-to-one, one-to-many, many-to-many, context-dependent, or genuinely ambiguous.

The central architectural conclusion is therefore:

> **STRling should treat linguistic interpretation as a profile-scoped projection from preserved source text into a typed, provenance-carrying graph or lattice of symbolic analyses—not as character replacement into a second string.**

A viable representation needs at least three ideas working together:

1. **Layered symbolic domains.** Code points, Unicode grapheme clusters, orthographic graphemes, tokens, lexemes/morphemes, phonemes, phonological features, syllables, and prosodic units are different kinds of objects and should not be conflated.
2. **Explicit relations between layers.** A unit such as a digraph can span several lower-level symbols; one spelling can have several pronunciations; one pronunciation can correspond to several spellings; and phonological or morphological processes can insert, delete, merge, or split units.
3. **Alternatives remain first-class.** Language, dialect, lexical identity, morphology, stress, and surrounding context often narrow an interpretation without reducing it to a universally deterministic answer. W3C's Pronunciation Lexicon Specification explicitly models multiple pronunciations of the same orthography and separately models homophones, demonstrating that pronunciation alternatives are a normal part of the data model rather than an exceptional error case. citeturn1search1

This means a future generalized STRling semantic layer can reuse several language-independent mechanisms—**typed projections, span/group objects, alternative paths, profile scoping, transformations, alignments, and provenance**—but should not attempt to make phonology itself generic. Phoneme inventories, grapheme rules, morphology, syllabification, stress assignment, dialectal realization, and lexical pronunciation belong in specialized linguistic modules.

A concise representation of the proposed model is:

```text
source text
   │
   ├── Unicode representation
   │      └── code points / normalization relations
   │
   ├── orthographic segmentation lattice
   │      ├── extended grapheme clusters
   │      ├── language-specific graphemes
   │      └── tokens
   │
   ├── lexical / morphological analyses
   │      ├── lexeme identity
   │      ├── lemma
   │      └── morpheme spans
   │
   └── pronunciation lattice
          ├── phoneme sequence
          │      └── distinctive-feature structures
          ├── syllable structure
          ├── stress / tone / prosody
          └── rhyme / metrical abstractions
```

Crucially, the arrows should be **relations with provenance**, not destructive conversion steps. Unicode itself already illustrates why this distinction matters: normalization gives a well-defined relation over character encodings, but compatibility normalization can erase distinctions relevant to semantics and is explicitly not appropriate as an unconditional transformation. citeturn1search0turn1search2

## The linguistic representation stack

### Characters, code points, and Unicode grapheme clusters

The bottom of the system should preserve the original source and its offsets. Above it can sit a Unicode-normalized view, but normalization must be represented as a projection or recorded transformation rather than silently replacing the evidence.

Unicode defines NFC/NFD in terms of **canonical equivalence** and NFKC/NFKD in terms of the broader notion of compatibility equivalence. The Unicode Standard explicitly warns that compatibility normalization can remove distinctions that matter semantically. It also notes that normalization may have context around concatenation boundaries and defines special stream-safe handling for pathological combining-mark sequences. citeturn1search0turn1search2

That immediately yields an important STRling principle:

**Unicode equivalence is not linguistic equivalence.**

For example, canonical-equivalent Unicode representations should normally be candidates for the same orthographic interpretation, but two canonically different spellings can still be homophones, while two Unicode strings made equal by compatibility normalization need not have identical linguistic significance. The system therefore needs separately named relations such as:

```text
same_source_encoding
canonically_equivalent_unicode
same_grapheme_analysis
same_phonemic_form
same_pronunciation_under_profile
```

They should never collapse into a universal `equivalent` operation.

Unicode extended grapheme clusters are also not the same thing as linguistic graphemes. UAX #29 defines default boundaries for grapheme clusters, words, and sentences, describing grapheme clusters as approximations to user-perceived characters. That makes them an appropriate text-processing layer, but not a complete orthographic linguistic analysis. citeturn1search3

A language-dependent orthographic grapheme can therefore span multiple Unicode grapheme clusters:

```text
source positions:    0     1
                     c     h
Unicode EGCs:       [c]   [h]

possible orthographic analyses:

A:                  [c]   [h]
B:                  [  ch   ]
```

The important implementation decision is **not to manufacture a new pseudo-character for `ch`**. The grouped object should retain its span over the underlying sequence. That preserves offsets, allows overlapping or alternative segmentations, and prevents an implementation detail from masquerading as source text.

This distinction also matters in the opposite direction: an apparent character can consist of a base plus combining marks yet belong to one extended grapheme cluster. Unicode normalization may alter the encoded representation without changing the intended character. citeturn1search0turn1search3

### Orthographic graphemes and tokens

An **orthographic grapheme** should be a profile-defined symbolic unit over one or more lower-level text units.

Its identity is potentially language-sensitive:

```text
Grapheme {
    class: orthographic_grapheme
    symbol: <profile-local identifier>
    source_span: ...
    members: [...]
    language_profile: ...
    analysis_provenance: ...
}
```

This is deliberately different from saying that every occurrence of a letter sequence has a fixed graphemic meaning. Grapheme segmentation can depend on orthography and language, and a sequence useful as a unit for grapheme-to-phoneme processing need not correspond to a Unicode character boundary.

Tokenization requires the same separation. UAX #29 provides language-neutral default word-boundary rules but explicitly presents them as **default text boundaries**, not a universal lexical analysis. citeturn1search3 A language-technology architecture should consequently allow:

```text
Unicode/default word segmentation
        ≠
language-specific tokenizer
        ≠
morphological segmentation
        ≠
lexical identity
```

A token is primarily a span and segmentation decision; a lexeme is a linguistic analysis attached to that span.

### Lexemes and morphemes

Morphology is the first point where a purely linear “projection string” becomes especially inadequate.

A word can carry:

- a lemma or lexical identity;
- a sequence or structure of morphemes;
- morphological features;
- one or more analyses when the surface form is ambiguous;
- phonological behavior conditioned by those analyses.

Classical finite-state morphology demonstrates that large classes of morphological analysis can be represented as regular relations between lexical and surface forms. Koskenniemi's two-level morphology and subsequent finite-state work by Kaplan & Kay and Beesley & Karttunen established the practical importance of finite-state relations for morphology and phonological alternations.¹

For STRling, the important reusable concept is not “all morphology is an FST.” It is:

> A surface span may project through **several competing structured analyses**, and downstream phonological projections may depend on which analysis is selected.

That requires analysis identities or paths:

```text
surface token
   ├── lexical_analysis A
   │       ├── morpheme ...
   │       └── pronunciation A1
   │
   └── lexical_analysis B
           ├── morpheme ...
           └── pronunciation B1
```

Flattening A and B into a bag of tags creates invalid cross-products—for example, accidentally combining the morphology from analysis A with the pronunciation licensed only by analysis B. **Alternative analyses therefore need correlated path identity, not merely independent attributes.**

That observation is one of the strongest findings that generalizes beyond linguistics.

### Phonemes and phonological features

A phonemic projection should normally be represented as a sequence over a **declared phoneme inventory**, not merely as a Unicode IPA string.

IPA provides a standardized notation for representing speech sounds, but an IPA transcription is still an encoding of a linguistic analysis: its degree of phonetic detail, phonemic interpretation, diacritics, and segment boundaries depend on transcription conventions and the intended language variety. W3C PLS accordingly treats the pronunciation alphabet as explicit metadata—for example, `alphabet="ipa"`—rather than assuming that every pronunciation string has the same symbol system. citeturn1search1

A phoneme object therefore needs information comparable to:

```text
Phoneme {
    inventory: <inventory/profile>
    symbol: <inventory-local phoneme identifier>
    notation: IPA | X-SAMPA | ARPABET | ...
    rendered_form: ...
}
```

The **inventory identifier is semantic**, while an IPA glyph should normally be regarded as one serialization.

Distinctive phonological features add another projection:

```text
/p/
 └── features {
       consonantal: ...
       voice: ...
       place: ...
       manner: ...
       ...
     }
```

Feature representations make classes expressible declaratively—for example, “voiceless obstruent” or “front vowel”—without enumerating every segment. PanPhon is a notable computational precedent: Mortensen, Littell, Bharadwaj, Goyal, Dyer & Levin developed a resource mapping IPA segments to articulatory feature vectors specifically to enable cross-linguistic computational operations over phonetic segments.²

But feature inventories themselves are a **linguistic model choice**. STRling's generic architecture should support a structured attribute projection; it should not hard-code a universal theory of distinctive features.

### Syllables and suprasegmental structure

Syllables should not be encoded as another spelling-to-string substitution. They are **groupings over a pronunciation analysis**:

```text
pronunciation
  / k ... /
       │
       ├── syllable
       │     ├── onset
       │     ├── nucleus
       │     └── coda
       │
       └── syllable ...
```

Stress attaches naturally to syllables or prosodic units rather than to characters. Pronunciation lexicons often encode it alongside phonemic information; for example, CMUdict's ARPABET convention attaches lexical stress categories to vowel symbols.³

A representation should keep apart at least:

```text
lexical stress
surface/realized stress
metrical prominence
```

because a poetic meter is not simply an equality test over dictionary stress. Metrical analysis can incorporate lexical stress, contextual rhythm, elision, pronunciation variants, and poetic conventions. Consequently:

```text
phoneme projection
        ↓
syllabification
        ↓
prosodic annotation
        ↓
optional metrical interpretation
```

is safer than making “meter” a property of characters or words.

Rhyme is similarly best understood as a **derived structural relation**. Depending on the application, a rhyme key might be defined from the final stressed nucleus through the end of a pronunciation, from syllable rimes, or according to a language- or poetry-specific convention.

The key semantic requirement is that `rhyme` not silently mean “similar spelling.” A pattern needs an identified rhyme model/profile, and its evidence should be traceable to the pronunciation and syllabic/prosodic structures from which the rhyme relation was derived.

### Lexical pronunciation and homophony

The pronunciation lexicon should be modeled as a relation:

\[
L \subseteq \text{Lexical/Orthographic Form} \times \text{Pronunciation}
\]

rather than as:

\[
f(\text{word}) = \text{pronunciation}.
\]

W3C PLS provides direct precedent. It supports multiple pronunciations for the same lexeme and, for ASR, requires the relevant alternatives to be treated as valid pronunciations. It also recommends representing homophones as distinct lexemes even when their `<phoneme>` representations are identical. citeturn1search1

This gives clean definitions:

```text
heterophonic/homographic case:
    one orthographic/lexical key
             ↓
       pronunciation A
       pronunciation B

homophonic case:
    lexical key A ──┐
                    ├── same pronunciation
    lexical key B ──┘
```

Homophones therefore require **no special primitive at the representation level**. They emerge as equality of pronunciation projections from different lexical/source identities.

That is exactly the sort of result STRling should exploit: keep source identity and derived symbolic identity separate, and relationships such as homophony follow declaratively.

## Projection, ambiguity, language, and context

### A projection should be a relation, not necessarily a function

The most important formal choice is to define a linguistic projection approximately as:

\[
P_{profile}(x, context) \rightarrow
\{(y_i,\ evidence_i)\}_{i=1}^{n}
\]

rather than:

\[
P(x) \rightarrow y.
\]

The result may contain zero, one, or multiple alternatives.

For deterministic transformations, the set happens to have cardinality one. This allows one uniform interface without pretending that every projection is ambiguous.

A useful classification is:

| Projection | Usually deterministic after profile is fixed? | Why alternatives arise |
|---|---:|---|
| bytes → Unicode source representation | yes, given encoding | encoding may itself be unknown |
| Unicode → NFC/NFD | yes | selected normalization form is policy |
| Unicode → extended grapheme clusters | yes, for a particular Unicode segmentation/version | tailored segmentation can differ |
| EGCs → orthographic graphemes | not universally | language/orthography, multigraphs, competing analyses |
| text → default word boundaries | yes, under a specified rule set | language-specific lexical tokenization may differ |
| token → lexeme | often no | homography, morphology, POS/context |
| token → morphemes | often no | morphological ambiguity |
| graphemes/word → phonemes | often no | lexical exceptions, heteronyms, dialect, morphology/context |
| lexical entry → listed pronunciations | relation | lexicon may explicitly contain alternatives |
| phoneme → feature structure | often deterministic within one declared feature inventory | inventories/analyses differ |
| pronunciation → syllables | profile-dependent | theoretical/language conventions and ambiguous boundaries |
| pronunciation → lexical stress | lexical/rule dependent | alternatives and lexical exceptions |
| utterance text → phonetic realization | generally context-dependent | connected speech, prosody, dialect, speaker effects |
| pronunciation → rhyme key | deterministic only after rhyme definition is chosen | competing rhyme conventions |
| line → metrical analysis | generally potentially ambiguous | pronunciation, stress and metrical interpretation |

Unicode gives good examples at the deterministic end of this spectrum. Given a specified normalization form, the normalization algorithm is defined and idempotent; the standard even provides conformance tests. citeturn1search0 W3C PLS demonstrates the other end: a single lexeme may explicitly have multiple valid pronunciations. citeturn1search1

### Profiles are part of semantics, not configuration trivia

A phonetic pattern without a language/profile is underspecified.

A useful conceptual profile would identify something like:

```text
LinguisticProfile
    language tag
    script / orthography
    regional or dialectal variety
    Unicode version + normalization policy
    grapheme model
    tokenizer
    morphological analyzer/version
    pronunciation lexicon(s)/version(s)
    G2P model/version
    phoneme inventory
    phonetic notation
    syllabification model
    stress/prosody model
```

This does **not** imply that every operation needs every field. It means each result identifies the subset of assumptions that actually governed it.

W3C PLS already scopes pronunciation lexicons with `xml:lang`; its examples distinguish such profiles as `en-US` and `en-GB`, and the specification permits multiple pronunciations within a language-specific lexicon. citeturn1search1

For a generalized STRling semantics, profile selection should therefore behave more like a type/environment selection than a hidden global locale:

\[
\text{pronunciation}_{en-US}(x)
\]

and

\[
\text{pronunciation}_{en-GB}(x)
\]

are potentially different projections.

Patterns compiled under one profile should not silently acquire new meaning because the process locale changes.

Profile versioning matters too. Unicode standards themselves are versioned—UAX #15 currently identifies its Unicode version explicitly—and Unicode defines stability properties for normalization. citeturn1search0 Linguistic models and lexicons generally have much weaker stability guarantees, so recording resource versions is even more important.

### Context must be explicit

“Context” is not one thing. Linguistic projection can depend on several scopes:

```text
local orthographic context
    neighboring letters/graphemes

morphological context
    stem / affix boundaries and grammatical analysis

lexical context
    whole-word identity

syntactic/semantic context
    lexical disambiguation

phonological context
    neighboring segments, word boundaries

prosodic context
    phrase structure, stress, speech style
```

A G2P rule can be perfectly deterministic given an analysis and still participate in an overall ambiguous system because the lexical or morphological analysis feeding it is uncertain.

This is another reason alternatives should be retained as correlated analysis paths.

Consider conceptually:

```text
source
   │
   ├── analysis A ── morphology A ── pronunciation A
   │
   └── analysis B ── morphology B ── pronunciation B
```

A pattern engine should be able to ask whether **some valid analysis** satisfies a pattern without first pretending that A or B is uniquely true.

Likewise it must distinguish that from the stronger question of whether **every valid analysis** satisfies it.

Those are semantic questions that become unavoidable as soon as linguistic ambiguity is represented faithfully.

### Grouping needs spans and alignments

Grouped symbols require two related but distinct mechanisms.

The first is **segmentation/grouping**:

```text
[c][h]
 \___/
  orthographic grapheme G
```

The second is **cross-layer alignment**:

```text
orthography:       g r a p h
                  \_______/
                         \
phonology:             /ɡ r æ f/
```

The exact alignment can involve:

- one-to-one mappings;
- multiple source units → one target unit;
- one source unit → multiple target units;
- insertion;
- deletion;
- context-conditioned reinterpretation.

Finite-state transducers are a natural executable model for these relations. Standard transducers implement sequence-to-sequence relations, and mappings of unequal length can be expressed using intermediate states and epsilon transitions. Weighted FSTs extend this machinery so that alternative paths can retain model-native costs or probabilities. Classic foundational work includes Kaplan & Kay's regular account of phonological rule systems and Mohri's algorithms for weighted automata and transducers.⁴ ⁵

At the higher-level STRling representation, however, retaining only the compiled FST path would be too low-level. The semantic representation should preserve source and target spans:

```text
Alignment {
    from: [source/grapheme span]
    to:   [phoneme span]
    relation: ...
    analysis_path: ...
    provenance: ...
}
```

The FST can then be an implementation or compilation target.

This separation is important:

> **Semantic IR should expose meaningful grouped units and alignments; automata should be an execution strategy.**

## Domain-specific architecture for declarative matching

### The proposed core data model

The linguistic subsystem should expose a **typed annotation graph with alternative paths**, conceptually containing five classes of object.

**Anchored source objects** preserve the actual input and immutable offsets.

```text
SourceSpan {
    source_id
    start
    end
}
```

**Symbolic units** represent typed interpretations:

```text
SymbolicUnit {
    domain            // grapheme, phoneme, morpheme, syllable ...
    identity          // domain-specific symbol
    spans/members
    attributes
}
```

**Projection relations** say how one representation was obtained from another:

```text
Projection {
    source_units
    target_units
    profile
    method
    provenance
}
```

**Analysis alternatives** retain mutually compatible interpretations:

```text
AnalysisPath {
    id
    assumptions
    units
    projections
}
```

**Evidence records** explain why a match exists:

```text
Evidence {
    source_spans
    matched_units
    projection_chain
    profile
    resource/model versions
    lexical entry or rule/model origin
    selected alternative
    alignment
}
```

The structure can be serialized in any convenient internal representation. The key requirement is semantic: **identity, membership, spans, alternatives, and derivation must survive projection**.

### Do not make every layer a linear tape

Several linguistic layers are sequences:

```text
phoneme1 → phoneme2 → phoneme3
```

but the overall object is not.

Syllables contain segments. Morphemes overlap source spans with lexical structures. Alternative segmentations branch. Stress is associated with prosodic units. Features decorate segments. A pronunciation may belong to a lexical analysis, not merely a surface word.

The appropriate abstraction is therefore:

\[
\text{typed graph/lattice containing ordered substructures}
\]

rather than:

\[
\text{one sequence of maximally annotated characters}.
\]

A “super-character” representation such as:

```text
character {
  grapheme=...
  phoneme=...
  morpheme=...
  syllable=...
  stress=...
}
```

fails as soon as boundaries do not align.

The failure is structural, not cosmetic:

```text
characters:  a b c d e
graphemes:   [a] [bc] [d] [e]
morphemes:   [a b c] [d e]
phonemes:    [x] [y z] [w]
syllables:   [x y] [z w]
```

There is no single segmentation whose cells can hold all these facts correctly.

### Keep identity, equivalence, and similarity separate

The pattern system should recognize three fundamentally different operations.

**Identity** means two references denote the same symbolic item within the same representation/inventory.

\[
a = b
\]

**Declared equivalence** means a profile has established an equivalence relation or canonicalization:

\[
a \equiv_P b
\]

Examples can include Unicode canonical equivalence or an explicitly defined phonemic canonicalization. Unicode NFC/NFD provide a strong formal precedent for this kind of deterministic canonical equivalence. citeturn1search0turn1search2

**Similarity** means a comparison procedure produces a distance, alignment, or similarity relation:

\[
d_P(a,b)
\]

These operations must not be collapsed.

That distinction directly answers the question about phonetic equivalence versus approximate pronunciation matching:

> **Phonetic/phonemic equivalence should be categorical and profile-defined. Approximate pronunciation similarity should be a separately named relation computed by a declared algorithm.**

Consider:

```text
same pronunciation:
    canonical_phone_sequence(A) == canonical_phone_sequence(B)

similar pronunciation:
    distance(A, B, metric=M) satisfies some externally stated condition
```

The first can support homophone semantics. The second supports “sounds like.”

Algorithms such as Soundex, Metaphone/Double Metaphone, phoneme edit distance, feature-weighted alignment, or articulatory-feature distance can be useful candidate implementations for approximate matching, but they should **not redefine phonemic identity**. Soundex-like systems intentionally discard information to create coarse retrieval keys; articulatory-feature systems preserve a different type of similarity information. PanPhon's explicit IPA-to-feature mapping is particularly relevant to the latter family.²

Because this report's scope excludes design of numerical multi-signal weighting, the architecture should merely permit a similarity operation to identify:

```text
algorithm
algorithm version
input representation
result/alignment
parameters
```

It should not prescribe one universal cross-signal score.

### Declarative matching over ambiguity

When a projection has alternatives, pattern semantics need an explicit interpretation.

At minimum the underlying semantic model must be capable of distinguishing:

\[
\exists a \in Analyses(x): Pattern(a)
\]

from:

\[
\forall a \in Analyses(x): Pattern(a)
\]

and from:

\[
Pattern(best\_selected\_analysis(x)).
\]

The last case is materially different because it delegates disambiguation to an analyzer.

The default recommended architecture is to retain every analysis the selected linguistic provider says is valid and allow the query's semantic operation to determine whether existence, universality, or explicit disambiguation is intended.

That prevents the system from turning a model implementation detail—“this analyzer happened to return this pronunciation first”—into language semantics.

W3C PLS illustrates why ordering and selection policy cannot simply be ignored: it explicitly has rules for dealing with multiple pronunciations and a `prefer` mechanism for contexts where one pronunciation must be selected. citeturn1search1

### Evidence should be part of the match result

A linguistic match should be explainable back to the source.

A good evidence payload should answer:

| Question | Evidence |
|---|---|
| What source matched? | immutable source span/text |
| At which linguistic level? | grapheme, lexeme, phoneme, feature, syllable, etc. |
| Under what language assumptions? | effective profile |
| How was the unit produced? | normalization, segmentation, lexicon, FST, G2P model, analyzer |
| Which version? | resource/rule/model/version identifier |
| Was the analysis ambiguous? | analysis/path identifier and alternatives |
| What pronunciation was used? | phoneme sequence and inventory/alphabet |
| How does it map to the source? | source↔target alignment |
| Why did the predicate hold? | matched symbols/features/structural relation |
| Was it exact or approximate? | equivalence relation or named similarity method |
| Was a lexical resource involved? | dictionary/lexicon entry identity |
| Did a model supply uncertainty? | provider-native probability/cost, if actually available |

One important rule should be:

> **Do not manufacture confidence scores for deterministic evidence.**

A Unicode normalization result has conformance semantics, not “93% confidence.” A pronunciation generated by a probabilistic G2P model may carry a model score. A dictionary entry may simply be present. Those evidence types should remain distinct.

This gives STRling auditability without requiring the prohibited general-purpose signal-weighting system.

## Finite-state, lexical, and computational prior art

### Finite-state machinery is a particularly good fit, but not the whole architecture

Finite-state methods are among the strongest reusable formal models for this domain.

Kaplan & Kay showed how important classes of phonological rewrite rules can be modeled by finite-state relations. Koskenniemi's two-level morphology modeled correspondence between lexical and surface strings with parallel constraints. Xerox-style finite-state morphology subsequently demonstrated large practical lexical/morphological systems.¹ ⁴

For STRling, finite-state machinery is attractive for:

```text
orthographic rewrite/transliteration
grapheme segmentation where regular
contextual G2P rules
phonological rewrite
morphotactics
morphological generation/analysis
normalization of symbolic sequences
composition of several regular projections
```

Composition is especially valuable. Conceptually:

\[
Text
\xrightarrow{G}
Graphemes
\xrightarrow{L}
LexicalAnalysis
\xrightarrow{P}
Phonemes
\]

can, where all relations are finite-state, be composed into:

\[
Text \xrightarrow{G \circ L \circ P} Phonemes.
\]

This is a compelling model for compiled STRling execution because it permits a declarative relation to become a reusable automaton.

Mohri's weighted finite-state framework generalizes this to paths carrying weights over a semiring, and weighted transducer composition became foundational in speech-recognition and speech-processing pipelines.⁵ ⁶

The architectural caution is equally important:

**WFST weights are properties of the particular linguistic model, not a reason to make STRling pattern truth itself a weighted score.**

A G2P model can expose N-best alternatives or path costs while exact phoneme matching remains categorical.

### Pronunciation lexicons solve a different problem from G2P

A pronunciation lexicon and a G2P model should be separate providers behind a common projection interface.

A lexicon answers a relation like:

```text
lexical entry → attested/declared pronunciation alternative(s)
```

A G2P model answers:

```text
orthographic representation + profile/context → predicted pronunciation(s)
```

W3C PLS is useful prior art precisely because it formalizes the lexicon side: lexemes associate graphemic representations with phoneme or alias representations, may carry multiple pronunciations, may specify an IPA alphabet, and are language-scoped. citeturn1search1

CMUdict is a widely used English-language example of a machine-readable pronunciation dictionary using an ARPABET-like phoneme inventory with lexical stress marks.³

These providers need not produce equal evidence:

```text
lexicon evidence:
  "entry X explicitly lists pronunciation P"

G2P evidence:
  "model M, version V generated pronunciation P"

rule evidence:
  "compiled rule transducer derived pronunciation P"
```

A declarative match can use all three while preserving the difference.

### G2P should naturally return a pronunciation lattice

Grapheme-to-phoneme conversion is fundamentally a transduction task, but for many languages it is not merely a local spelling rule.

A robust pipeline should support:

```text
spelling
  ↓
language/profile
  ↓
lexicon lookup, if applicable
  ↓
lexical/morphological/context analysis, if applicable
  ↓
G2P provider
  ↓
pronunciation alternatives
  ↓
optional syllabification / stress / feature expansion
```

Joint-sequence G2P models, such as the grapheme-phoneme joint multigram approach developed by Bisani & Ney, explicitly model correspondences between grapheme and phoneme subsequences rather than assuming a character-by-character substitution.⁷ That is directly aligned with the grouped/many-to-many concern in the research question.

Modern neural G2P systems change the computational implementation, not the semantic requirement: the projection still needs a profile, output alternatives or a selected result, model provenance, and alignment where available.

### What can be streamed or compiled

The domain naturally divides by computational behavior.

| Operation | Streaming/compilation suitability | Architectural implication |
|---|---|---|
| Unicode code-point traversal | excellent | low-level deterministic stage |
| Unicode normalization | incremental/streaming implementations possible, with boundary/state constraints | preserve normalization profile/version |
| default grapheme boundaries | very good rule-based processing | compile/cache |
| simple orthographic grapheme rules | often excellent | FST/DFA candidate |
| regular phonological rewrite | excellent | compile as FST |
| finite-state morphology | excellent where grammar is finite-state | compose/cached transducer |
| pronunciation lexicon | fast indexed lookup; resource-dependent | external lexical evidence |
| lexicon represented as FST | excellent after compilation | lexical lookup can join composed pipeline |
| rule-based G2P | often highly compilable | FST candidate |
| statistical/WFST G2P | compilable/searchable | alternatives + native path weights |
| neural G2P | generally requires model inference | provider boundary |
| lexical disambiguation | requires context/lookup/model | defer until sufficient context |
| syntactic/semantic heteronym resolution | contextual | typically non-stream-local |
| syllabification | rule/model dependent | often post-pronunciation |
| meter/scansion | sentence/line-level context | not purely token-stream local |

Unicode normalization itself demonstrates why “streamable” needs qualification. UAX #15 discusses potentially unbounded-looking sequences of combining marks, defines a Stream-Safe Text Format for bounded-buffer environments, and notes that normalization at concatenation boundaries may require special care. citeturn1search0turn1search2

So STRling should model **streamability as an implementation capability of a projection provider**, not infer it merely because the mathematical operation is deterministic.

### Reusable prior-art models

The strongest reusable models are complementary rather than competing.

| Prior art | What STRling should reuse conceptually |
|---|---|
| Unicode UAX #15 | versioned deterministic normalization; explicit equivalence class; conformance; distinction between canonical and compatibility equivalence citeturn1search0turn1search2 |
| Unicode UAX #29 | rule-defined text segmentation and distinction among grapheme/word/sentence boundaries citeturn1search3 |
| International Phonetic Alphabet | standardized phonetic notation and compositional segment/diacritic vocabulary |
| W3C PLS | orthography↔pronunciation relation, language scoping, pronunciation alphabets, multiple pronunciations, homophone modeling citeturn1search1 |
| Koskenniemi two-level morphology | surface↔lexical relations expressed by constraints¹ |
| Kaplan & Kay finite-state phonology | compilation of regular phonological relations⁴ |
| weighted finite-state transducers | composable alternative transductions and provider-native costs⁵ ⁶ |
| joint-sequence G2P | many-to-many grapheme↔phoneme chunk alignment⁷ |
| CMUdict-style pronunciation dictionaries | lexical pronunciation alternatives plus stress-bearing phone notation³ |
| PanPhon | separate projection from IPA segments into articulatory feature representations² |

No one of these is the architecture STRling needs. Collectively, however, they strongly support a model of **typed symbolic relations rather than substitution characters**.

## Matching semantics and concrete architectural requirements

The ten research questions can now be answered directly.

### Useful symbolic levels

The most useful core matching levels are:

| Level | Appropriate pattern questions |
|---|---|
| source/code point | literal encoding-sensitive pattern |
| Unicode-normalized | canonical textual equivalence |
| extended grapheme cluster | user-character-oriented segmentation |
| orthographic grapheme | language-specific writing units and multigraphs |
| token | lexical surface forms |
| lexeme/lemma | lexical identity independent of inflection |
| morpheme | morphological structure |
| phoneme | categorical pronunciation patterns |
| phonological feature | natural classes and feature relations |
| syllable | syllable count/shape/onset/nucleus/coda |
| prosodic stress/tone | prominence and suprasegmental patterns |
| rhyme-derived structure | exact/profile-defined rhyme relations |
| metrical structure | higher-level prosodic patterning |

Not every implementation needs to materialize every layer. They should be **independently requestable projections**.

### Interaction among character, grapheme, phoneme, syllable, morpheme, and lexical levels

The correct interaction is a graph, not a strict pipeline:

```text
                   ┌──────── lexical identity ────────┐
                   │                                  │
source → graphemes → token → morphology ─────────────┤
   │                                                  ↓
   └──────────────────────────────→ pronunciation alternatives
                                            │
                               ┌────────────┼────────────┐
                               ↓            ↓            ↓
                           phonemes      syllables      stress
                               │            │            │
                               ↓            └────┬───────┘
                            features             ↓
                                           rhyme/meter
```

The graph structure is essential because pronunciation may come directly from lexical lookup, from morphology plus G2P, or from another context-sensitive model.

### Deterministic versus alternative projections

Determinism is **provider/profile-relative**.

A deterministic Unicode normalization algorithm and a deterministic finite-state rewrite can coexist with an ambiguous lexical analysis. The pipeline's final output is therefore a relation even when individual stages are functions. Unicode normalization demonstrates the function-like case; PLS multiple pronunciations demonstrate the relation-like case. citeturn1search0turn1search1

The type system should not label an entire linguistic feature “deterministic” or “ambiguous.” That property belongs to a particular projection invocation.

### Representation of grouped symbols

Use **typed span/group nodes plus cross-layer alignments**.

Do not:

```text
ch → invented single character ĈH
```

Do:

```text
Grapheme G:
    members = source_units[4:6]
    symbolic_identity = <language-profile grapheme>
```

and separately:

```text
Alignment:
    grapheme G → phoneme-span P
```

Alternative groupings require a segmentation lattice.

### Language and profile selection

Language/profile is part of the projection's semantic identity.

The effective meaning of:

```text
graphemes(text)
phonemes(text)
syllables(text)
rhyme(text)
```

cannot be complete without identifying the language/model assumptions.

W3C PLS's explicit language scoping and pronunciation alphabet are direct prior-art evidence for this requirement. citeturn1search1

Profiles should inherit where practical, but a result must expose the **effective profile**, not merely whatever default happened to be in effect during execution.

### Streamable, compilable, and lookup-bound behavior

The architecture should expose three broad execution classes:

```text
compiled/local
    Unicode processing
    segmentation rules
    finite-state phonology/morphology/G2P

resource lookup
    pronunciation lexicons
    lexical/morphological dictionaries

contextual inference
    lexical disambiguation
    context-sensitive pronunciation
    neural G2P
    prosodic/meter analysis
```

These are execution capabilities, not distinct query semantics.

A single declarative phoneme pattern should ideally remain unchanged whether its pronunciation projection is served by a precompiled FST, a dictionary, or another provider—while **evidence reveals which one produced the answer**.

### Phonetic equivalence versus approximate similarity

They must be separate operations.

Exact/category-level comparison:

\[
canonical_P(x)=canonical_P(y)
\]

Approximation:

\[
similarity_{P,M}(x,y)
\]

where \(M\) names the algorithm or metric.

A phoneme edit distance, feature distance, phonetic-key algorithm, or learned pronunciation similarity model should not make two representations “equal.” This protects exact declarative semantics from implementation-dependent thresholds and intentionally falls inside the requested boundary against designing numerical multi-signal weighting.

### Evidence accompanying a linguistic match

The minimum high-quality evidence record is:

```text
source span
linguistic layer
matched structure
profile
projection chain
analysis alternative/path
resource/model identity and version
source↔derived alignment
lexical entry/rule identifier where applicable
exact-equivalence or similarity method
provider-native uncertainty only where one exists
```

This enables a caller to distinguish:

```text
"same because Unicode canonical normalization says so"

from

"same phoneme sequence according to dictionary X"

from

"predicted to have this pronunciation by model Y"

from

"approximately similar according to metric Z"
```

Those are importantly different claims.

### Existing formal models worth reusing

The best foundations are not a new linguistic formalism invented inside STRling:

**Unicode's segmentation and normalization machinery** should govern the corresponding text levels. citeturn1search0turn1search3

**IPA or explicitly identified pronunciation alphabets** should encode phonetic/phonemic strings instead of a private unconstrained transcription notation; W3C PLS already demonstrates how the alphabet and language can be metadata of a pronunciation lexicon. citeturn1search1

**Finite-state relations/transducers** should be a preferred compilation target for regular orthographic, morphological, G2P, and phonological relations.¹ ⁴ ⁵

**WFSTs** are appropriate when a provider inherently produces alternative paths with probabilities/costs; their weighting machinery should remain provider-local instead of becoming STRling's general match semantics.⁵ ⁶

**Pronunciation lexicons** should remain first-class external resources rather than being compiled conceptually into character rules. W3C PLS is particularly useful as an interoperability model. citeturn1search1

**Feature systems such as PanPhon** demonstrate a practical separate projection from phones into articulatory feature structures.²

### General architecture versus specialized linguistic machinery

The domain strongly supports a **general symbolic representation architecture**, but only at the structural level.

The reusable architecture should know how to represent:

```text
source anchors
typed symbolic units
grouped spans
ordered sequences
hierarchical membership
alternative analyses
many-to-many relations
projection chains
profiles
provenance
alignment
exact equivalence
separate similarity operations
```

It should **not** itself know:

```text
what counts as an English grapheme
which phones constitute a particular language's inventory
how an affix changes pronunciation
how a language syllabifies
where lexical stress falls
what a dialect does with a particular phoneme
which pronunciation a heteronym has in context
what constitutes rhyme in a particular poetic tradition
how a G2P system ranks alternatives
```

That boundary is the principal architectural result of the investigation.

## Generalizable concepts, language-specific machinery, and STRling implications

The linguistic stress test exposes a useful dividing line.

| Concept | Generalizes beyond language? | Reason |
|---|---:|---|
| immutable source anchors | **yes** | derived meaning must remain traceable to input |
| projection from one symbolic domain to another | **yes** | broadly applicable representation mechanism |
| typed symbolic domains | **yes** | avoids false equivalence between unlike representations |
| grouping several source units into one derived unit | **yes** | generic many-to-one structural interpretation |
| one source unit mapping to several derived units | **yes** | generic one-to-many transformation |
| many-to-many span alignment | **yes** | generic transformation relation |
| alternative analyses/lattices | **yes** | ambiguity is not unique to language |
| correlated analysis paths | **yes** | prevents invalid combinations of mutually dependent interpretations |
| profile/environment-dependent interpretation | **yes** | semantic projections often depend on an explicit interpretation regime |
| model/resource/version provenance | **yes** | generic reproducibility requirement |
| distinction between equality and similarity | **yes** | fundamental semantic distinction |
| existential/all-alternatives matching | **yes** | generic consequence of alternative interpretations |
| phoneme | **no** | linguistic domain concept |
| distinctive phonological feature inventory | **no** | linguistic theory/resource choice |
| orthographic grapheme definition | **mostly no** | language/orthography dependent |
| morpheme and lexical analysis | **no** | linguistic machinery |
| G2P rules/models | **no** | language/model specific |
| pronunciation lexicon | **no** | language/resource specific |
| syllable/onset/nucleus/coda | **no** | linguistic representation |
| lexical stress/tone | **no** | phonological/prosodic machinery |
| dialect realization | **no** | linguistic profile/model |
| rhyme and meter | **no** | language/genre/prosody-specific interpretation |

That suggests a clean architectural split for future STRling work:

```text
┌──────────────────────────────────────────────┐
│        General STRling symbolic core         │
│                                              │
│ spans · units · groups · projections         │
│ alternatives · profiles · provenance         │
│ alignments · equivalence · similarity hooks  │
└───────────────────┬──────────────────────────┘
                    │ provider contract
┌───────────────────▼──────────────────────────┐
│       Linguistic symbolic subsystem          │
│                                              │
│ Unicode/orthography · tokenization           │
│ morphology · lexicon · G2P · phonology       │
│ features · syllables · stress · rhyme/meter  │
└──────────────────────────────────────────────┘
```

This avoids both architectural extremes.

A **language-only design** would hardwire phonemes, graphemes, syllables, and lexicons into the general symbolic engine and make later domains awkward.

A **maximally abstract design** would attempt to reduce phonology to generic attributes and lose exactly the important phenomena this stress test reveals: segmentation, structured alternatives, lexical dependence, prosodic hierarchy, language-specific inventories, and transduction.

The appropriate compromise is:

> **Generalize the representation mechanics; specialize the interpretation machinery.**

That principle is considerably stronger than “support attributes on characters.”

### Recommended semantic invariants

Without designing final STRling syntax, the eventual symbolic semantics should preserve several invariants.

**Source preservation.** No linguistic normalization or projection should destroy the ability to identify the original source span.

**Domain separation.** Character identity, grapheme identity, lexical identity, phoneme identity, and phonetic similarity must remain distinct relations.

**Profile completeness.** Any projection whose result depends on language/dialect/model state must carry or inherit an identifiable effective profile.

**Alternative preservation.** A provider returning several legitimate analyses should not be forced through a single-value symbolic property.

**Path consistency.** Attributes belonging to alternative analyses must not be independently recombined.

**Grouping without rewriting.** Derived grouped symbols should reference lower-level spans rather than replacing them with artificial source characters.

**Alignment preservation.** Many-to-many transformations should be capable of explaining which source units support which target units.

**Provider transparency.** Lexicon, finite-state rule set, statistical model, and neural model outputs may share a projection interface, but their provenance must remain distinguishable.

**No implicit fuzziness.** Approximate phonetic similarity must never silently alter categorical equality or homophone semantics.

**Version reproducibility.** Unicode version, lexicon/version, model/version, feature inventory, and other semantically material resources should be identifiable in evidence. Unicode's own versioned conformance model provides a useful benchmark for this discipline. citeturn1search0

### A useful test suite for the eventual semantics

Before treating generalized symbolic projections as adequate for language, the design should be able to represent all of the following without special-case distortion:

```text
one source character → one phoneme
one grapheme made from several source units → one phoneme
one grapheme → several phonemes
several graphemes → one phoneme
spelling material producing no phoneme
phonological material not in simple one-to-one spelling alignment

one spelling → several lexical analyses
one lexical item → several pronunciations
different lexical items → identical pronunciation
same word → pronunciation differing by language/dialect profile

phoneme sequence → syllable hierarchy
syllable → stress
phone → distinctive features

exact pronunciation equality
feature-class matching
approximate pronunciation similarity
rhyme derived from pronunciation/prosody

lexicon-derived evidence
rule-derived evidence
model-derived evidence
ambiguous alternatives retained through a match
```

A symbolic architecture that passes those cases has demonstrated substantially more than support for phonetic substitution: it has demonstrated **contextual symbolic projection over non-isomorphic representations**.

## Prior-art assessment and research limitations

The strongest prior-art conclusion is that most pieces of the linguistic problem already have mature formal models; STRling does not need to invent replacements.

Unicode gives deterministic, versioned formal models for normalization and default text boundaries. citeturn1search0turn1search3 W3C PLS gives an interoperable model of the relation between graphemic and pronunciation representations, including language scoping, alternate pronunciations, homophones, and explicit pronunciation alphabets. citeturn1search1 Finite-state morphology and phonology provide a mature algebra for sequence relations; weighted finite-state technology provides composition and alternative-path machinery; joint-sequence G2P provides precedent for non-characterwise grapheme/phoneme alignment; pronunciation dictionaries provide lexical exceptions and alternatives; feature resources such as PanPhon show how phonetic segments can be projected into a structurally richer comparison space.¹ ² ³ ⁴ ⁵ ⁶ ⁷

The architectural novelty STRling should pursue is consequently **not a new phonological theory**. It is the integration contract that lets declarative patterns address these established representations without flattening them.

A particularly useful criterion for evaluating future STRling proposals is:

> Can the semantic system consume two different linguistic providers that produce the same *kind* of projection—say an FST G2P and a neural G2P—without changing the meaning of phoneme-level patterns, while preserving the materially different evidence and alternatives produced by those providers?

If yes, the symbolic abstraction is at approximately the right level.

If changing provider technology requires redefining what a phoneme match means, the abstraction is too implementation-specific.

If the abstraction cannot express pronunciation alternatives, grouped orthographic units, or many-to-many alignment without inventing ad-hoc attributes, it is too weak.

If the generalized core contains English stress rules, IPA-specific parsing, syllabification algorithms, or morphological grammars, it has generalized too far into domain internals.

### Repository-specific limitation

The STRling and `research-intelligence` repositories were included in the research target, but the repository material available in this research pass was not sufficient to support reliable, line-specific claims about the current internal STRling semantic model. I have therefore deliberately **not attributed proposed mechanisms such as lattices, projection records, or evidence graphs to the existing implementation**. They are recommendations derived from the linguistic requirements in the supplied brief and the prior-art models above, not claims that the repositories already implement them.

This is materially preferable to retrofitting the linguistic conclusions onto undocumented repository assumptions.

### Primary literature cited

1. **Kimmo Koskenniemi.** *Two-Level Morphology: A General Computational Model for Word-Form Recognition and Production.* University of Helsinki, 1983. The foundational two-level finite-state treatment of lexical/surface morphological correspondence.

2. **David R. Mortensen, Patrick Littell, Akash Bharadwaj, Kartik Goyal, Chris Dyer, and Lori Levin.** “PanPhon: A Resource for Mapping IPA Segments to Articulatory Feature Vectors.” *COLING*, 2016. A computational model separating IPA segment identity from feature-vector representation.

3. **Carnegie Mellon University.** *CMU Pronouncing Dictionary / CMUdict.* Machine-readable North-American-English pronunciation lexicon, using an ARPABET-derived symbol set and lexical stress annotations.

4. **Ronald M. Kaplan and Martin Kay.** “Regular Models of Phonological Rule Systems.” *Computational Linguistics* 20(3), 1994. Formal treatment of important phonological rewrite systems as regular relations.

5. **Mehryar Mohri.** “Finite-State Transducers in Language and Speech Processing.” *Computational Linguistics* 23(2), 1997; and subsequent work on weighted automata/transducer algorithms. Foundation for efficient composition and weighted transduction.

6. **Mehryar Mohri, Fernando Pereira, and Michael Riley.** “Weighted Finite-State Transducers in Speech Recognition.” *Computer Speech & Language* 16(1), 2002. Demonstrates compositional WFST machinery in speech processing.

7. **Maximilian Bisani and Hermann Ney.** “Joint-Sequence Models for Grapheme-to-Phoneme Conversion.” *Speech Communication* 50, 2008. Models grapheme/phoneme correspondences as joint subsequences rather than simple character substitution.

The standards evidence examined for this report also includes Unicode Standard Annex #15 on normalization, Unicode Standard Annex #29 on text boundaries, and W3C Pronunciation Lexicon Specification 1.0. UAX #15 explicitly distinguishes canonical and compatibility normalization and describes normalization stability and stream-safe concerns; UAX #29 supplies formal default grapheme/word/sentence boundaries; PLS explicitly represents language-scoped grapheme-to-pronunciation relations, pronunciation alternatives, and homophones. citeturn1search0turn1search1turn1search3

**Overall finding:** phonetic and linguistic representation supports a generalized STRling symbolic architecture **only if the generalization is structural rather than linguistic**. The general core should provide typed projections, grouped spans, alternative-path semantics, alignments, profiles, provenance, and an explicit distinction between equivalence and similarity. Grapheme analysis, lexical/morphological interpretation, G2P, phoneme inventories, features, syllabification, stress, dialect realization, rhyme, and meter should remain specialized language technology layered on that core. A character-substitution model cannot faithfully represent the domain; a typed projection graph/lattice can.

The present research stage is complete.
