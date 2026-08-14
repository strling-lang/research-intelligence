# Symbolic Observation Models for Future Generalized STRling Research

Role: Research report
Origin: AI-assisted deep research commissioned for STRling Research Intelligence
Generated: 2026-08-14
Imported: 2026-08-14
Source verification: Partially verified
Last reviewed: 2026-08-14
Current status: Active input

## Executive finding and research boundary

**Established context.** STRling’s current authoritative architecture is a semantic compiler pipeline: parse the DSL into an AST, compile that AST into a target-agnostic intermediate representation, then emit target-specific regex artifacts. Its architectural documentation emphasizes a canonical internal model, deterministic transformations, separation of syntax from semantics, and semantic constructs rather than exposing target-engine tricks directly. fileciteturn7file0L2-L2 Research Intelligence deliberately treats “Beyond Regex” work as exploratory: inclusion in that program does not imply product commitment, and it explicitly rejects assuming that text, images, audio, tensors, or arbitrary patterns necessarily share one architecture. fileciteturn5file0L2-L2 The active Universal Pattern Engine inquiry goes further: it says that no evidence currently establishes a universal architecture, that similarity of vocabulary is weak evidence for shared architecture, and that STRling’s active center remains a portable regex-intent compiler with a canonical semantic path. fileciteturn9file0L2-L2 The older multi-modal/UPE report is retained only as historical, unreviewed research input and is explicitly superseded by the active inquiry. fileciteturn8file0L2-L2

**Research conclusion.** The strongest model for the question posed is **not** “a symbol is a bag of features.” A future generalized pattern model needs at least four separations:

1. an **observation occurrence** is distinct from every symbolic interpretation of that occurrence;
2. a **representation** is a typed semantic domain, not merely another feature column;
3. a **projection** is an explicit mapping from an observation into such a domain;
4. statements about projected symbols are **claims with typed values, dependency conditions, epistemic origin, and provenance**, rather than anonymous key-value pairs.

That distinction is forced by surprisingly mature prior art. Unicode explicitly distinguishes abstract characters from glyphs and warns that the correspondence is not one-to-one and can depend on font and rendering. citeturn12search1 Typed feature-structure work demonstrates how record-like symbolic descriptions can be given logical semantics, typing, appropriateness constraints, unification, and subsumption. citeturn16search0turn14search2turn16search2 Annotation graphs show that multiple overlapping and even theoretically incompatible annotations can coexist over one underlying signal without reducing the signal to any one annotation. citeturn13academia50turn13academia49 Apache UIMA provides an unusually close practical precedent: one subject of analysis can have multiple views/representations, while typed feature structures and annotations are associated with those views. citeturn13search1turn13search6turn13search10 RDF, OWL, SHACL, and PROV contribute graph-based claims, formal ontology semantics, validation constraints, and provenance respectively. citeturn15search0turn17search0turn17search1turn17search2

**Recommended research abstraction.** This report proposes a **Typed Observation–Projection Model**, abbreviated here only for discussion as **TOPM**. It should be understood as a *formal research vocabulary*, not as a STRling IR design. TOPM uses:

- a **many-sorted relational model** as the cleanest denotational foundation;
- **typed feature structures** as a convenient local representation of coherent property bundles;
- an **attributed graph** as the natural visualization/interchange shape for observations, projections, groups, relations, derivations, and provenance.

The key design move is that these are different views of the *same formal model*, not three competing runtime architectures.

The central recommendation is:

> **An observation should own no universal semantic feature bag. Instead, it should be the stable anchor from which zero or more typed, context-indexed, provenance-bearing projections and claims are exposed.**

This gives `"O"` several simultaneous meanings without asserting that they are properties of the same ontological thing. Its source occurrence can project to an encoded character; that character can carry Unicode properties; an alphabet-order projection can yield ordinal position under an explicitly named alphabet; a rendering projection can yield one or more glyphs under a font/shaping environment; geometric analysis can then describe the rendered result. Unicode’s character model is direct evidence for why these layers must not be collapsed: glyph identity and shape are not inherent consequences of abstract-character identity alone. citeturn12search1

The same separation solves the `"fi"`-style composite case. A two-character observation can project to two abstract characters while a rendering of that same span may produce a single ligature glyph. Unicode explicitly uses this as an example of the non-bijective character–glyph relationship. citeturn12search1 Consequently, generalized STRling research should not assume that every representation is elementwise, length-preserving, or recoverable by applying a unary property function independently to each input element.

## Formal vocabulary and semantic separations

**Established result.** Knowledge-representation systems repeatedly distinguish the thing being described from its description. Feature structures provide feature-value descriptions with logical interpretations; annotation graphs attach layers of descriptive structure to a signal; RDF distinguishes graph terms and propositions; UIMA separates a subject of analysis from metadata structures about it. citeturn16search0turn13academia50turn15search0turn13search1 STRling research should preserve that separation rather than allowing “symbol,” “observation,” and “feature” to become synonyms.

**Proposal.** The minimum conceptual definitions should be:

| Term | Proposed definition | What it is not |
|---|---|---|
| **Source** | An artifact, stream, value, or other addressable substrate from which observations are selected. | Not itself necessarily a symbol. |
| **Observation** | An occurrence-specific selection of a source under an acquisition/decoding layer: roughly `source + extent + layer`. | Not the abstract letter, number, glyph class, or semantic interpretation. |
| **Extent** | The portion of a source selected by an observation: point, span, ordered/discontinuous collection, region, interval, etc. | Not restricted to one character or contiguous text. |
| **Symbol** | A typed value in a particular representation domain. | Not synonymous with its source encoding or occurrence. |
| **Attribute schema** | A declared, typed property relation from an admissible subject type to a value domain, together with applicability constraints. | Not a particular observed value. |
| **Claim** | A particular statement that a subject has an attribute value, including dependency class, origin, context, and provenance. | Not merely `key=value`. |
| **Representation** | A named semantic domain consisting of symbol types, attributes/relations, constraints, and interpretation rules. | Not merely a serialization format or arbitrary feature vector. |
| **Projection** | An explicit, typed mapping that exposes an observation or another representation through a target representation, under declared context. | Not necessarily canonical, lossless, deterministic, or one-to-one. |
| **Relation** | A typed predicate over two or more role-labelled participants. | Not something that must be squeezed into a unary attribute. |
| **Group / composite observation** | An observation with explicit part/membership structure that may itself bear attributes and participate in relations. | Not merely the aggregate of its members’ independent attributes. |
| **Context** | An explicit parameter required to interpret or compute a claim or projection: alphabet, locale, font, rendering settings, schema version, coordinate frame, etc. | Not hidden ambient state. |
| **Provenance** | The lineage of a claim or projection: source, supplying authority, process, derivation inputs, software/version, and responsible agent where relevant. | Not confidence or similarity. |
| **Candidate set** | Mutually alternative well-typed projection results that remain unresolved. | Not a set of facts all asserted simultaneously. |

The extent concept has strong precedent. Annotation graphs bind annotations to regions of underlying signals; Web Annotation makes source selection first-class through selectors and also distinguishes the resource’s state from the selector applied to it. citeturn13academia50turn12search7 UIMA similarly provides span annotations for text while allowing application-defined `AnnotationBase` subclasses to identify other kinds of regions. citeturn13search10 This strongly suggests that “observation = character” would be too narrow even for text.

A useful formalization is:

\[
o=\langle s,e,\lambda\rangle
\]

where \(s\) is a source, \(e\) an extent in that source, and \(\lambda\) the layer under which the extent is observed or decoded. Observation identity is therefore **occurrence identity**. Two source positions containing `"O"` are two observations even if they project to the same abstract symbol.

A representation schema can be modeled as

\[
R=\langle S_R,A_R,\mathcal R_R,K_R\rangle
\]

where \(S_R\) is the family of symbol/value sorts admitted by the representation, \(A_R\) its attribute signatures, \(\mathcal R_R\) its relation signatures, and \(K_R\) its well-formedness constraints. This resembles typed feature structures, where types constrain what features are appropriate and what values those features can take. Carpenter’s formulation explicitly uses appropriateness to distinguish a feature that does not apply to a type from a feature whose value is merely unknown. citeturn14search2 That distinction is directly valuable here: “alphabetic position” should be *inapplicable* to many symbols, not silently represented by a null whose meaning could be “unknown.”

A projection should then be explicit:

\[
\pi_{R,c}:T_{\text{source}}\rightharpoonup
\operatorname{Outcome}(T_R)
\]

where \(c\) is explicit context, `↛` denotes a partial function, and:

\[
\operatorname{Outcome}(T)
=
\operatorname{Resolved}(T)
+
\operatorname{Candidates}(\mathcal P_{\!fin}^{+}(T))
\]

The `+` is deliberately a **sum/alternative**, not a collection of simultaneous values. Algebraic datatypes make exactly this distinction structurally: a constructor can contain several fields together, while alternative constructors represent mutually exclusive variants. Haskell’s standard datatype form, for example, defines a datatype by alternative constructors, each of which may itself contain multiple component values. citeturn16search6 For generalized STRling research, this yields an important law:

> **Coexisting representations are product-like; unresolved interpretations are sum-like. They must not use the same container semantics.**

Thus an observation may simultaneously expose

\[
\langle
\text{character}=O,\;
\text{case}=\text{uppercase},\;
\text{alphabet-rank}=15
\rangle
\]

when those claims are independently justified, while a disputed segmentation should be represented as

\[
\operatorname{Candidates}
\{
\text{projection}_1,
\text{projection}_2
\}
\]

until a context or later operation selects one.

### Property status must be multidimensional

**Interpretation.** The requested categories “intrinsic, contextual, derived, inferred, externally supplied” should **not be one enumeration**, because they answer different questions. A property can, for example, be semantically intrinsic to a representation but externally supplied by an authoritative database; or contextual and derived; or intrinsic and inferred from stronger axioms. OWL makes the distinction between asserted axioms and their logical consequences explicit at the semantic level, while PROV treats derivation/production lineage as another concern. citeturn17search0turn17search2 MLIR offers a useful programming-language analogy: it distinguishes attributes inherent to an operation’s semantics from attributes whose semantics are defined externally by another dialect, showing that “where semantics live” and “how the information arrived” are independent issues. citeturn14search1

TOPM should therefore use **orthogonal axes**:

| Axis | Categories | Question answered |
|---|---|---|
| **Semantic dependency** | `local`, `contextual`, `composite`, `relational` | What information must be consulted for this proposition to have a value? |
| **Production origin** | `source-recorded`, `canonicalized`, `computed`, `inferred`, `externally-asserted` | How did this particular claim enter the model? |
| **Commitment state** | `asserted/resolved`, `candidate`, `hypothetical` | Is this claim currently being committed to as true in its stated context? |
| **Authority/provenance** | standard/database/user/software/rule/version/source lineage | Who or what warrants the claim? |

This classification makes **intrinsic** precise rather than metaphysical:

> A property is *local/intrinsic relative to representation \(R\)* when, once the subject identity and the versioned semantics of \(R\) are fixed, no additional observation context is required to determine it.

That qualification is essential. Unicode’s Character Database classifies properties into catalog, enumerated, binary, string-valued, numeric, and other kinds, and it separately records whether properties are normative, informative, contributory, provisional, or derived. citeturn12search0 Thus “uppercase” can be a property in a versioned abstract-character representation. But a claim such as “this glyph contains one closed loop” cannot safely be promoted to an intrinsic property of the abstract Unicode character: Unicode explicitly says that glyph shapes for the same character can differ and that character-to-glyph correspondence can depend on the rendering system and font. citeturn12search1

Likewise, `"O" → alphabet position 15` should not be treated as an unqualified intrinsic integer property. It is properly something like:

\[
\operatorname{rank}
(
O,
\text{Latin-uppercase-A-through-Z-order}
)
=15
\]

The alphabet/order convention is part of the claim’s context. This distinction prevents a convenient cultural convention from silently becoming an ontological fact.

### Attribute value kinds should carry operations, not just storage types

**Proposal.** Generalized symbolic attributes should differ by their **semantic value domain and legal operations**, not merely by their machine representation.

| Attribute kind | Semantic requirements | Operations that are normally meaningful | Important prohibition |
|---|---|---|---|
| **Categorical** | Declared category vocabulary or class system; possibly versioned/open or closed. | equality, inequality, membership, set inclusion when multi-valued. | No implicit numeric order because codes happen to be integers. |
| **Ordinal** | A named ordering relation or rank system. | equality, `<`, `≤`, predecessor/successor when defined, rank comparison. | Rank numbers do not automatically license arithmetic differences or ratios. |
| **Numeric** | Number domain plus, where applicable, unit, dimension, bounds, and interpretation. | arithmetic appropriate to the domain; comparisons. | Never infer commensurability solely because two values are numbers. |
| **Geometric** | Geometry type plus coordinate/reference system or other frame. | geometric/topological relations defined by the geometry domain. | Geometry of a rendering is not automatically geometry of its abstract symbol. |
| **Linguistic** | Explicit linguistic scheme, language/script or other required interpretation context, and typed values. | Scheme-specific categorical/structural operations. | Avoid a universal “linguistic feature” namespace detached from its model. |
| **Structural** | Node/group/edge/span/tree/graph/member identity and role constraints. | containment, membership, ancestry, adjacency or order where declared. | Do not flatten n-ary or hierarchical structure into unrelated unary booleans. |

Unicode itself demonstrates why the first few distinctions matter: its database treats binary, enumerated, numeric, and string-valued character properties as distinct property classes rather than as one undifferentiated scalar mechanism. citeturn12search0 ML systems, by contrast, routinely transform categorical values into integer or one-hot arrays and can construct arbitrary numeric feature representations from text or images; scikit-learn explicitly frames feature extraction as transforming arbitrary data into numerical representations usable by learning algorithms. citeturn19search0turn19search2 That difference is central to the later boundary between a **symbolic semantic property** and an **engineering feature**.

## Prior art and the closest existing models

No examined system supplies the entire desired model. The interesting result is how consistently the required pieces recur in separate traditions.

| Prior art | What it establishes | Why it is close | Main gap for this research |
|---|---|---|---|
| **Typed feature structures / AVMs** | Record-like descriptions with formal logical semantics, type hierarchies, subsumption/unification, and appropriateness restrictions. citeturn16search0turn14search2turn16search2 | Excellent local model for a symbol exposing several typed properties. | Provenance, repeated competing assertions, view identity, and general n-ary relations are not naturally first-class in a plain AVM. |
| **Annotation graphs** | Multiple descriptive layers can be attached to one underlying signal; hierarchy and overlap can coexist; multiple analyses of one signal can be compared. citeturn13academia50turn13academia49 | Excellent precedent for one observation carrying several simultaneous representations without collapsing them. | Type systems and epistemic/provenance distinctions are comparatively lightweight. |
| **Apache UIMA CAS** | Subject of analysis, multiple artifact representations/views, typed feature structures, annotations, relations, indices, and cross-view structures. citeturn13search1turn13search6turn13search10 | Probably the closest mature implementation architecture to “one artifact, many typed analytical views.” | Primarily a software framework, not a compact formal semantics for projection ambiguity, intrinsicness, inference status, or arbitrary claims. |
| **RDF / OWL / SHACL / PROV** | Graph propositions and datasets; logical ontology axioms and inference; graph validation; provenance entities, activities, agents, derivations, bundles. citeturn15search0turn17search0turn17search1turn17search2 | Strongest standardized toolbox for claims, relations, extensible vocabularies, source attribution, and inference. | Raw RDF is permissive; well-typed closed-world pattern semantics require additional constraints. OWL semantics deliberately treats axiom annotations as logically inert. |
| **Relational model** | Data modeled as n-ary relations independently of physical representation, with algebraic operations over those relations. citeturn15search1 | Very clean denotational base for attributes, relations, provenance tables, selections, projections, joins, and derived views. | Verbose as a conceptual/user-facing representation; hierarchy and graph-shaped provenance require several relations. |
| **Algebraic data types** | Products and alternatives are structurally different; alternative constructors are statically distinguishable. citeturn16search6 | Supplies exactly the conceptual distinction needed between simultaneous features and ambiguous alternatives. | Not itself a KR or provenance model. |
| **MLIR-style typed IR** | Open/extensible type systems, typed values and attributes, nested regions, dialect-specific semantics, and a useful inherent-versus-externally-defined attribute distinction. citeturn14search0turn14search1 | Strong precedent for extensible symbolic domains that preserve type checking and dialect ownership. | Represents program IR, not observational knowledge; provenance and competing interpretations are not its central abstraction. |
| **Unicode character/property model** | Explicit separation of encoding layers, abstract characters and glyphs; rich typed property catalog; explicit normalization/canonicalization semantics. citeturn12search1turn12search0turn18search1 | An exceptionally useful real-world test case for separating source encoding, symbolic identity, properties, renderings, and canonicalization. | Domain-specific rather than a generalized observation model. |

### Typed feature structures are necessary but insufficient

**Established result.** Kasper gave feature structures a logical semantics; Aït-Kaci developed algebraic record-like type structures with subsumption and lattice properties; Carpenter’s typed feature structures added explicit type hierarchies and appropriateness conditions. citeturn16search0turn16search2turn14search2 These ideas are unusually well aligned with a pattern language because they preserve partial information and support compatibility/unification reasoning rather than requiring every object to be fully populated.

For example, a projected abstract character could have a structure schematically resembling:

```text
AbstractCharacter [
    identity        : CharacterId
    generalCategory : GeneralCategory
    uppercase       : Boolean
    numericValue    : NumericValue?   // only where appropriate
]
```

A typed feature formalism can say more than a conventional record: a feature may be inappropriate to the type, its value may be unknown, or its value may be constrained by a subtype. That is desirable for generalized pattern reasoning.

**Failure mode.** Problems begin as soon as the research needs to say:

- property `a=v` was supplied by two distinct authorities;
- the same attribute has different values under two explicit contexts;
- one value is asserted while another is inferred;
- two projections are alternatives rather than jointly valid;
- an attribute is about a relation among three observations;
- a composite observation has its own identity and part structure;
- the projection itself—not merely its values—needs provenance.

One can encode all of these inside increasingly elaborate feature structures, but at that point claims and relations have effectively been reified anyway. TOPM should acknowledge that requirement directly.

### Annotation graphs and UIMA show the importance of an observation anchor

**Established result.** Bird and Liberman developed annotation graphs precisely because linguistic resources needed overlapping, hierarchical, multi-level descriptions of shared underlying data without forcing them into one file-format-specific tree. Their work emphasizes the logical structure of annotation rather than serialization, and explicitly supports multiple analyses of one signal. citeturn13academia50turn13academia49 Although this research should not turn into a linguistic-modeling report, the structural lesson generalizes cleanly.

UIMA takes a complementary engineering approach. A CAS contains the subject of analysis, metadata/analysis results, indexes, and a shared type system; it can contain multiple representations of the artifact. Views associate a particular Subject of Analysis with metadata indices, and annotation types can locate spans or application-specific regions within a view. citeturn13search1turn13search6turn13search10

**Interpretation.** The closest practical approximation to the desired generalized observation idea is therefore something like:

> **UIMA’s subjects/views + typed feature structures + annotation graphs, augmented with first-class projection identity, provenance, epistemic origin, and alternative-candidate semantics.**

This is a conceptual comparison, not a recommendation to adopt UIMA.

### Knowledge graphs solve claim extensibility better than local records

RDF 1.2 models information as graphs of subject-predicate-object propositions; datasets add named graphs, and triple terms permit triples to be referred to as terms. Crucially, RDF 1.2 distinguishes a triple occurring as a triple term from that triple being asserted: a triple can be referenced, asserted, or both. citeturn15search0 That is a valuable precedent for ambiguity and explanation systems because **mentioning a candidate proposition must not itself assert it**.

OWL adds classes, object properties, data properties, assertions, and logical axioms with defined inference semantics. It also permits annotations on axioms, but those annotations intentionally do not alter the logical consequences of the ontology. citeturn17search0 SHACL supplies a complementary validation model for requirements such as datatype and cardinality constraints on RDF graphs. citeturn17search1 PROV supplies a standardized vocabulary around entities, activities, agents, generation, usage, derivation, attribution, and bundles. citeturn17search2

**Interpretation.** This family illustrates another critical design separation:

\[
\text{semantic proposition}
\neq
\text{schema constraint}
\neq
\text{provenance metadata}
\]

A future symbolic pattern model should resist making one mechanism do all three jobs.

### Relational structure is the cleanest formal baseline

Codd’s relational model intentionally separates a user’s logical representation of data from machine-level internal representation and centers the model on n-ary relations and operations over them. citeturn15search1 For this investigation, its deepest advantage is not SQL or databases; it is that **unary attributes, binary relationships, n-ary relationships, provenance, candidate membership, group membership, and derivation dependencies can all be represented without inventing different fundamental metaphysics for each**.

That makes a many-sorted relational model the best candidate for the **denotational core** of TOPM, even if an eventual implementation chose records, objects, graphs, column stores, or something else.

## Candidate symbolic observation models

Four plausible approaches emerge from the prior art.

| Candidate | Core idea | Strengths | Failure modes | Assessment |
|---|---|---|---|---|
| **Typed Feature Bundle** | Each observation has one or more typed AVMs/feature structures representing its properties. | Compact, familiar, supports partial information, type inheritance, appropriateness, unification. | Provenance and multiple claims become awkward; ambiguity and coexistence can be conflated; n-ary relations and groups require extensions. | Good local representation, insufficient global model. |
| **Attributed Observation Graph** | Observations, symbols, projections, groups, claims, contexts and derivations are graph nodes/edges. | Naturally handles sharing, hierarchy, overlapping views, provenance and relations. | A fully open graph can become weakly typed and difficult to analyze unless schemas/constraints are strict. | Excellent conceptual/interchange form. |
| **Normalized Relational Claim Model** | All facts are typed relations; projections and claims receive identities; derived representations are views/functions. | Mathematically clean, compositional, n-ary, provenance-friendly, easy to state invariants and dependencies. | Verbose; human-readable hierarchy requires a presentation layer. | Best formal semantics. |
| **Hybrid Typed Observation–Projection Model** | Relational denotation + attributed-graph identity structure + feature-structure bundles inside coherent projections. | Retains formal analyzability while giving ergonomic local descriptions and explicit provenance/context. | More vocabulary than a feature bag; requires discipline about layer boundaries. | **Recommended research model.** |

### Formal shape of the recommended candidate

The proposed model can be understood as a many-sorted structure containing at least these relations:

\[
\begin{aligned}
&\operatorname{Observation}(o,s,e,\lambda)\\
&\operatorname{Part}(g,i,o,r)\\
&\operatorname{Projection}(p,x,R,c)\\
&\operatorname{ProjectedValue}(p,v)\\
&\operatorname{Claim}(q,x,a,v)\\
&\operatorname{DependencyKind}(q,d)\\
&\operatorname{ProductionKind}(q,k)\\
&\operatorname{ContextOf}(q,c)\\
&\operatorname{ProducedBy}(q,z)\\
&\operatorname{DerivedFrom}(q,q')\\
&\operatorname{ChoiceMember}(h,p)\\
&\operatorname{RelationInstance}(r,\rho)\\
&\operatorname{Argument}(r,\text{role},x)
\end{aligned}
\]

These are **semantic relations**, not proposed database tables or final STRling node types.

`Part` makes grouping first-class. The index \(i\) can carry ordering where ordering is semantically present; `role` handles non-positional composition. A composite observation can therefore bear claims that its children do not. Nothing requires:

\[
a(g)=f(a(o_1),\ldots,a(o_n))
\]

for some elementwise reduction \(f\). Some group-level attributes may be derivable from member properties; others may depend on the group as a whole or on another representation.

That point is supported by Unicode’s character/glyph behavior. A character sequence can map to one glyph, and a character can contribute to multiple glyphs; therefore, properties of a rendered multi-character extent are not in general reducible to a one-character-at-a-time projection. citeturn12search1

### One observation, several simultaneous representations

Consider a source occurrence whose literal textual content is `"O"`.

A disciplined model could contain conceptually:

```text
Observation o17
  source: document D
  extent: text span [42,43)
  acquisition-layer: decoded Unicode text
```

and separately:

```text
Projection p1
  from: o17
  representation: UnicodeScalarSequence@version
  result: [U+004F]
```

then:

```text
Projection p2
  from: p1
  representation: AbstractCharacter@UnicodeVersion
  result: LATIN CAPITAL LETTER O
```

with standardized claims in that representation such as categorical/binary Unicode properties. Unicode explicitly distinguishes binary, enumerated, numeric, string, and other property kinds. citeturn12search0

Another projection can coexist:

```text
Projection p3
  from: p2
  representation: AlphabetOrder
  context:
    alphabet: Latin-uppercase-A-Z
    ordering: conventional
  result:
    rank: 15
```

That is **contextual and computed**, even though the underlying character identity may be locally available.

A rendering projection can be separate again:

```text
Projection p4
  from: o17
  representation: RenderedGlyphRun
  context:
    font: ...
    shaping-engine: ...
    rendering-parameters: ...
  result: ...
```

Only properties computed from `p4` should be treated as properties of that rendered occurrence. This prevents `"O" has a closed loop` from silently becoming a universal fact about abstract character `O`. Unicode explicitly notes that the same abstract character can have substantially different glyph shapes and that rendering cannot in general be predicted from text alone. citeturn12search1

Finally:

```text
Claim q9
  subject: p4
  attribute: hasClosedContour
  value: true
  dependency: local-to-rendered-geometry
  production: computed
  provenance:
    extractor: ...
    version: ...
```

and an arbitrary user statement can coexist without acquiring the same status:

```text
Claim q10
  subject: o17
  attribute: user:looksRound
  value: true
  dependency: contextual
  production: externally-asserted
  provenance:
    agent: user ...
```

The system has preserved the assertion, but it has **not** promoted it to an intrinsic property, a standardized ontology term, or an inferred fact.

This structure directly answers the primary question: multiple simultaneous symbolic attributes are supported because an observation can participate in arbitrarily many compatible projection instances, while origin, context, typing, and provenance remain attached to the individual claims and projections.

### Multi-element symbols and grouping

A group should not merely be a synthetic “character with a longer string value.” It should be an occurrence with its own extent and explicit member structure:

\[
g=\operatorname{Group}
\left[
(o_1,\text{role}_1),
\dots,
(o_n,\text{role}_n)
\right]
\]

with optional ordering.

Three different cases must be representable:

**Composition by membership.** A group is the ordered collection of observations \(o_1,\dots,o_n\), with no stronger symbolic interpretation yet.

**Composite symbol projection.** The group projects as one symbol in another representation.

**Emergent group claim.** A property is stated of the group itself and need not be obtainable by independently mapping each member.

Again, the `"fi"` rendering example demonstrates why this is not theoretical bookkeeping: a two-character sequence can be rendered as one ligature glyph depending on the rendering environment. citeturn12search1 Annotation-graph work likewise demonstrates that hierarchical and overlapping structures over one signal need not obey a single segmentation hierarchy. citeturn13academia49

A useful research invariant follows:

> **Segmentation belongs to a representation or observation layer; there should be no assumption of one globally canonical token boundary.**

That permits one source extent to have one projection segmented into code points, another into higher-level composite symbols, and another into rendered units, without forcing identity among their elements.

## Ambiguity, provenance, canonicalization, and compositionality

### Ambiguity is not multiplicity

The most important representational distinction after observation-vs-symbol is:

\[
\text{many true views}
\neq
\text{many candidate views}
\]

Suppose an observation has an abstract-character projection, an ordinal projection, and a geometric rendering projection. These are **simultaneously valid** and should coexist as ordinary projection instances.

By contrast, suppose an observation admits two alternative segmentations under the *same* representation and context. Those alternatives should live in a named candidate set:

\[
H=\operatorname{Choice}
\{p_1,p_2\}
\]

and neither candidate becomes a committed fact merely by being listed.

This mirrors the distinction available in RDF 1.2 between a triple occurring as a triple term and that proposition actually being asserted. citeturn15search0 It also corresponds to the sum/product distinction in algebraic datatypes. citeturn16search6

There is a second subtlety. Some apparent ambiguities are actually **context plurality**. If two values are both correct under different declared contexts, they should not be put in an exclusive candidate set:

\[
\pi_{R,c_1}(o)=v_1,\qquad
\pi_{R,c_2}(o)=v_2
\]

Both are resolved claims. They differ because \(c_1\neq c_2\).

This rule avoids turning legitimate contextual variation into uncertainty.

### Provenance belongs at claim and projection granularity

**Established result.** W3C PROV treats entities, activities, agents, generation, usage, derivation, attribution and bundles as distinct provenance concepts, and allows provenance chains to describe how one entity was derived from another or produced by an activity. citeturn17search2

**Proposal.** A generalized symbolic representation should preserve enough lineage to answer:

- Which source observation produced this projection?
- Which representation definition and version were used?
- Which context was supplied?
- Was the value read directly, canonicalized, deterministically computed, logically inferred, or externally asserted?
- What rule/software/data authority supplied it?
- Which claims or projected values were dependencies?
- Has a later transformation discarded distinctions?

This is needed not only for auditing but for **explanation semantics**. A matcher should eventually be able to distinguish explanations such as:

> “Matched because the standardized character property is `Uppercase`”

from:

> “Matched because the observation was projected under alphabet \(A\), yielding ordinal rank 15”

from:

> “Matched because an external application asserted category \(X\).”

Those should never collapse into “feature matched.”

Inference also deserves a separate production marker. OWL demonstrates that a fact can follow logically from other asserted axioms, while the asserted axioms themselves have a different epistemic role. citeturn17search0 A future explanation system therefore needs to know both **what proposition holds** and **why it is present**.

### Canonicalization should be a special projection, never destructive identity

Unicode normalization provides an unusually good model of disciplined canonicalization. Its normalization forms are explicitly defined transformations relative to canonical or compatibility equivalence, and the transformations are idempotent. But the standard also warns that NFKC/NFKD erase compatibility distinctions and may remove distinctions important to the semantics of arbitrary text. citeturn18search1

This supports four general principles.

**First, there is no context-free concept of “canonical representation.”** There is only a canonical form **relative to an equivalence relation and purpose**.

Formally, a canonicalizer can be modeled as an endomorphism:

\[
c_R:T_R\rightarrow T_R
\]

with at least:

\[
c_R(c_R(x))=c_R(x)
\]

and a declared equivalence relation \(\sim_R\) for which the canonicalizer is intended to collapse equivalent values.

**Second, canonicalization should produce a projection/derived value rather than overwrite the observation.** Otherwise provenance and lost distinctions disappear.

**Third, a projection should declare its information behavior.** A useful conceptual classification is:

| Projection property | Meaning |
|---|---|
| **bijective / reversible** | Source value can be recovered exactly. |
| **injective** | Distinct sources remain distinct, though representation changes. |
| **many-to-one / canonicalizing** | Declared equivalence classes collapse. |
| **lossy abstraction** | Distinctions outside an equivalence contract may be discarded. |

**Fourth, lossiness is not inherently wrong.** It is wrong when hidden. Unicode’s NFKC is useful precisely because it deliberately removes certain distinctions, while Unicode warns against applying it blindly to arbitrary text. citeturn18search1 Future symbolic research should make that kind of contract explicit.

### Composition should be type-directed

A projection chain

\[
O
\xrightarrow{\pi_1}
R_1
\xrightarrow{\pi_2}
R_2
\xrightarrow{\pi_3}
R_3
\]

is analyzable when the codomain of each projection is admissible to the next and required context is explicit. This looks much more like a typed compiler IR than a generic “feature pipeline.” MLIR’s open type system and dialect-defined operations/attributes show how independently extensible domains can coexist while still giving every value a type and allowing domain-specific verification. citeturn14search0turn14search1

The research model should therefore reject silent coercions such as:

\[
\text{OrdinalRank}\rightarrow\text{Integer}
\]

when that conversion would accidentally license arithmetic semantics. An explicit forgetting/coercion projection is safer:

\[
\operatorname{numericEncoding}:
\text{OrdinalRank}\rightarrow\mathbb{Z}
\]

because it records the point where semantic structure was discarded.

Similarly:

\[
\text{AbstractCharacter}
\nrightarrow
\text{GlyphGeometry}
\]

without a rendering context. Unicode’s model directly establishes that text alone is insufficient to determine general glyph correspondence. citeturn12search1

### What remains statically analyzable

**Interpretation.** The models investigated suggest that a generalized representation layer remains reasonably analyzable and compositional when it has:

- finite, named type and relation signatures;
- explicit domains/codomains;
- explicit applicability/appropriateness constraints;
- pure, named projections with declared context inputs;
- declarative n-ary relations rather than arbitrary callbacks;
- explicit group structure;
- separate candidate semantics;
- explicit inference/derivation rules;
- no hidden state or ambient context;
- provenance that does not change proposition semantics;
- explicitly bounded extension points.

Typed feature systems preserve strong unification/subsumption properties because their structure and type constraints are formalized. citeturn16search2turn14search2 Relational systems remain compositional because selections, projections, joins and related operators have algebraic meaning over relations. citeturn15search1 SHACL demonstrates that even extensible RDF graphs can have a separate declarative validation layer for datatype, cardinality and structural constraints. citeturn17search1

The model becomes progressively less tractable as “projection” comes to mean “run arbitrary user code and accept whatever value it returns.” This report deliberately does not perform the separate Computational Boundaries analysis, but one conceptual line is already clear:

> **Extensibility preserves symbolic analyzability only while extensions remain typed and semantically described. Arbitrary executable predicates are not merely more attributes; they weaken the formal model itself.**

That does not mean such predicates can never exist in a future system. It means they should be visibly outside the strongest analyzable symbolic subset rather than being disguised as ordinary properties.

## Symbolic representation versus arbitrary feature engineering

Machine-learning tooling makes the contrast useful. Feature extraction commonly transforms arbitrary text, image, or other data into numerical vectors suitable for an estimator, and practical preprocessing systems permit transformations such as one-hot encoding, ordinal encoding, binning, polynomial expansion, normalization and even arbitrary function transformation. citeturn19search0turn19search2turn19search5 Such features may be excellent engineering choices without corresponding to independently meaningful concepts in the source domain.

That gives this investigation an important negative result:

> **“Computable from an observation” is far too weak a criterion for admitting something into a symbolic property system.**

Otherwise every hash, embedding coordinate, polynomial combination, task-specific indicator, and arbitrary user callback becomes a “symbolic attribute,” at which point the ontology contributes little beyond naming columns.

**Proposal.** A candidate property should qualify as a reusable **symbolic representation property** when most of the following hold:

| Test | Symbolic-property side | Feature-engineering side |
|---|---|---|
| **Domain semantics** | Meaning can be specified independently of a particular matching task. | Meaning is “helps this model/pattern.” |
| **Typed domain** | Values inhabit a declared semantic type with legitimate operations. | Value is merely a scalar/vector slot. |
| **Applicability** | There is a principled account of what subjects may possess the property. | Feature is emitted wherever a function happens to return something. |
| **Reproducibility** | A standard, deterministic rule, versioned dataset, or attributable assertion defines it. | Ad hoc preprocessing logic with no stable semantic contract. |
| **Context** | Required context is named and typed. | Depends silently on environment or training data. |
| **Invariance/equivalence** | Known invariances or canonicalization rules can be stated. | Transform is justified primarily by predictive utility. |
| **Compositionality** | Interaction with other types/relations is defined or deliberately restricted. | Feature participates only as another input coordinate. |
| **Provenance/explanation** | A downstream system can explain where the proposition came from. | Explanation is only “feature \(f_i\) had value \(x\).” |
| **Reuse** | The concept is useful across patterns/tasks because it reflects the modeled domain. | Constructed for one target or training regime. |

This should not be interpreted as a purity test. A highly specialized domain may legitimately define a narrow symbolic property. The decisive distinction is **whether the property has an intensional semantic contract independent of its usefulness to a particular classifier or pattern**.

For example, these are materially different:

```text
numericValue(symbol) = 7
```

under a versioned symbolic convention,

versus:

```text
feature_483(symbol) = 0.712
```

because a training pipeline discovered that coordinate.

Likewise:

```text
hasClosedContour(renderedGlyph) = true
```

can be a legitimate explicit symbolic/geometric claim if the rendered glyph, geometry definition, extraction method, and provenance are defined. The fact that the same boolean could also be fed into a statistical model does not make it arbitrary. What matters is whether the boolean has semantics outside that model.

Conversely, an externally supplied user property need not be prohibited. The model should simply preserve its epistemic position:

```text
production = externally-asserted
authority  = user/application namespace
```

rather than silently absorbing it into a core “intrinsic properties” map.

This is where ontology systems and ML feature systems diverge philosophically. OWL properties participate in a declared logical vocabulary whose axioms have specified semantics. citeturn17search0 Feature-extraction systems intentionally permit broad transformations because their purpose is constructing usable representations for algorithms. citeturn19search2turn19search5 A future STRling research model can support both, but should not call them the same thing.

## Recommended conceptual model for later STRling research

The evidence supports a fairly strong recommendation while stopping well short of a language or architecture decision.

### Recommended model

**Proposal.** Future generalized STRling research should use a **Typed Observation–Projection Model with provenance-bearing claims and first-class relations** as its shared conceptual substrate.

Its defining principles are:

**Observation primacy.** The observation is the stable occurrence anchor. Symbolic meanings attach through projections rather than redefining what was observed.

**Representation plurality.** No representation is automatically privileged as “the real symbol.” Literal encoding is one representation among several. Abstract-character identity, ordinal position, rendered geometry, user annotation, and composite structure may all coexist when individually warranted.

**Typed projections.** Every projection declares source type, target representation, required context, and output semantics.

**Typed claims.** Attribute values retain semantic types—categorical, ordinal, numeric, geometric, linguistic, structural, or domain-defined—not merely host-language storage types.

**Orthogonal epistemics.** Semantic dependency (`local/contextual/composite/relational`) is separate from production origin (`recorded/canonicalized/computed/inferred/externally asserted`) and from commitment (`resolved/candidate/hypothetical`).

**Relations remain relations.** Properties fundamentally involving multiple participants should be modeled as role-typed n-ary relations instead of being converted into pseudo-properties of an arbitrary participant. Codd’s n-ary relational foundation is the strongest prior-art justification for this treatment. citeturn15search1

**Groups are first-class observations.** Multi-element units have identity, extent and member structure of their own and can carry emergent properties.

**Ambiguity is first-class but non-asserting.** Alternative projections are represented explicitly as alternatives. Listing a candidate does not assert it, analogous to RDF 1.2’s distinction between referring to a triple as a term and asserting that triple. citeturn15search0

**Canonicalization is explicit and provenance-preserving.** No normalization replaces the source observation. Canonicalization states its governing equivalence relation and loss behavior, following the discipline illustrated by Unicode normalization. citeturn18search1

**Extension is typed.** Domain-specific representations should be extensible in the spirit of typed IR dialects rather than through an unstructured global property namespace. MLIR is a useful precedent for an open type system in which dialects can define types/attributes while retaining verification boundaries. citeturn14search0turn14search1

### Direct disposition of the research questions

| Research question | Recommended answer |
|---|---|
| **What counts as observation, symbol, attribute, representation, projection, relation?** | Observation = occurrence/extent; symbol = typed value inside a representation; attribute = typed unary property schema; claim = an instantiated property statement; representation = coherent semantic domain; projection = explicit mapping into a representation; relation = typed n-ary predicate. |
| **Which properties are intrinsic, contextual, derived, inferred, or externally supplied?** | Do not use one flat classification. “Intrinsic/local vs contextual/composite/relational” describes semantic dependency. “Recorded/canonicalized/computed/inferred/externally asserted” describes production. Provenance records authority and lineage. |
| **How should categorical, ordinal, numeric, geometric, linguistic, and structural attributes differ?** | Give them different semantic types and allowed operations. Never rely only on storage types such as integer/string/float. Unicode’s property taxonomy is a useful concrete precedent. citeturn12search0 |
| **How should multi-element symbols and grouping be represented?** | As first-class composite observations with explicit member/part relations, roles/order where applicable, and their own claims/projections. Do not require group properties to reduce elementwise. |
| **How can one observation support several valid representations simultaneously?** | Attach multiple independent projection instances to the same observation. Simultaneous projections form a product/record-like body of knowledge; none implicitly invalidates another. |
| **How should ambiguity be represented?** | As explicit typed candidate/choice sets whose members are not asserted merely by membership. Context-dependent coexistence must be distinguished from genuine alternatives. |
| **What typing and provenance are necessary?** | Subject type, attribute/relation signature, value type, representation/schema version, context type/value, production kind, provenance source/process/version, derivation dependencies, commitment state, and—when relevant—canonicalization/loss contract. |
| **Which models remain analyzable and compositional?** | A finite typed relational core is strongest; typed feature structures remain excellent local structures; graph representations remain analyzable when governed by explicit schemas/constraints. Arbitrary executable projection functions should sit outside the strongest symbolic subset. |
| **Which existing systems are closest?** | Operationally, UIMA CAS; structurally, annotation graphs; locally/logically, typed feature structures; for claims/provenance, RDF/OWL/SHACL/PROV; for denotation, relational algebra; for typed extensibility, MLIR. No one system covers the full requirement. citeturn13search1turn13academia50turn14search2turn17search0turn17search2turn15search1turn14search1 |
| **Where does symbolic representation become arbitrary feature engineering?** | At the point where properties cease to have stable domain semantics, typing/applicability rules, reproducible derivation or attributable assertion, explicit context, and reusable explanatory meaning independent of a target task. |

### Minimum vocabulary to carry into subsequent inquiries

The minimum vocabulary should remain deliberately smaller than a future language design:

| Required concept | Why it cannot safely be omitted |
|---|---|
| **Source** | Separates analyzed data from interpretations of it. |
| **Observation** | Provides occurrence identity. |
| **Extent** | Permits atoms, spans, regions, and composites. |
| **Representation** | Names the semantic world in which a symbol/property makes sense. |
| **Symbol / value** | Separates representation-level identity from observation identity. |
| **Projection** | Makes movement between representations explicit. |
| **Attribute schema** | Gives unary properties types and applicability rules. |
| **Claim** | Gives individual property values identity, status, context and provenance. |
| **Relation** | Preserves genuinely relational structure. |
| **Group / part** | Supports multi-element symbols and emergent structure. |
| **Context** | Prevents hidden assumptions from masquerading as intrinsic facts. |
| **Dependency kind** | Distinguishes local, contextual, composite and relational semantics. |
| **Production kind** | Distinguishes recorded, canonicalized, computed, inferred and external information. |
| **Candidate / choice** | Preserves ambiguity without premature commitment. |
| **Provenance / derivation** | Makes matching and explanation auditable. |
| **Canonicalization contract** | States equivalence, idempotence and information loss explicitly. |

Everything else can initially be considered domain vocabulary layered on top of those concepts.

### What should not yet be committed

**Interpretation.** The research does **not** justify putting these concepts directly into the present STRling IR. Current STRling architecture uses a target-agnostic IR specifically as part of its semantic-regex compilation path, while Research Intelligence explicitly cautions against assuming that generalized pattern domains share one IR or runtime. fileciteturn7file0L2-L2 fileciteturn5file0L2-L2 The active UPE inquiry reinforces that no common architecture has yet been established. fileciteturn9file0L2-L2

Nor does the evidence justify one universal ontology of attributes. The Unicode case demonstrates why domain representations have real semantic boundaries: characters, glyphs and source encodings are related but not interchangeable. citeturn12search1 MLIR demonstrates a different useful principle—extensible semantic dialects can coexist without forcing every domain concept into one built-in vocabulary. citeturn14search0turn14search1 A later STRling investigation should therefore ask whether representations are independent typed “dialects,” interoperable external schemas, compiler-side abstractions, runtime projections, or something else only after concrete matching semantics require that decision.

**Speculation, intentionally bounded.** If later STRling research discovers that pattern matching over symbolic observations is genuinely useful, TOPM would permit a clean conceptual distinction between:

\[
\text{pattern over observations}
\]

and

\[
\text{pattern over a named projection of observations}
\]

and potentially between:

\[
\text{existential projection matching}
\quad\text{and}\quad
\text{explicit projection matching}.
\]

But whether such distinctions belong in STRling syntax, an IR, an external analysis layer, a library API, or a separate system is deliberately unresolved here.

The deeper result of this investigation is therefore not an architecture but an ontological constraint:

> **Future generalized STRling research should model observations as anchors in a typed network of projections and claims, not as objects with an ever-growing universal feature map. Representation identity, context, provenance, derivation, grouping, and ambiguity are part of the semantics—not incidental metadata.**

That formulation is compatible with the strongest lessons from typed feature structures, annotation graphs, multi-view CAS systems, relational models, ontology/provenance standards, extensible typed IRs, and Unicode’s concrete separation of encoded characters, abstract characters, properties, glyphs, and normalization. citeturn14search2turn13academia50turn13search1turn15search1turn17search0turn17search2turn14search1turn12search1turn18search1 It also preserves the most important strategic constraint from Research Intelligence: evidence for reusable representational concepts does not by itself establish a universal pattern architecture. fileciteturn9file0L2-L2

**Present research stage: complete.**
