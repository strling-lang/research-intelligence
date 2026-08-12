# Information Architecture for a Definitive Public Regex Reference

Role: Research report
Origin: AI-assisted deep-research session commissioned for STRling Research Intelligence; the underlying sources, not the AI system, are the evidence authorities.
Generated: 2026-08-12
Imported: 2026-08-12
Source verification: Partially verified
Last reviewed: 2026-08-12
Current status: Active input

## Source verification gaps

Current public-product state was checked at website commit [`7c7042f`](https://github.com/strling-lang/website/tree/7c7042f3d4418533f5dc0283537546529633b081): the site has documentation, learning, packages, and a Fourth Edition pre-release center, but no dedicated Regex Reference surface. Selected information-architecture precedents were checked against [MDN Browser Compatibility Data](https://github.com/mdn/browser-compat-data), [Unicode Technical Standard #18](https://www.unicode.org/reports/tr18/), [PCRE2 documentation](https://www.pcre.org/current/doc/html/), [.NET substitutions](https://learn.microsoft.com/en-us/dotnet/standard/base-types/substitutions-in-regular-expressions), and [W3C PROV](https://www.w3.org/TR/prov-overview/).

The original research-session marker map is unavailable. Unreconstructed markers link here. Claims about reference-system scale, search behavior, maintenance outcomes, and exact source-to-page generation practices need claim-level verification. The entity/page model is a recommendation and does not redefine Regex Knowledge or Website architecture.

## Executive conclusion

A definitive Regex Reference should **not** be organized as a larger compatibility table, a collection of engine manuals, or a set of versioned documentation snapshots. Regex has too many behaviorally relevant dimensions for any of those structures to remain accurate.

The right architecture is a **semantic reference graph exposed through multiple developer-oriented views**.

The canonical center of the reference should be the **regex concept or feature**—for example, positive lookbehind, atomic grouping, Unicode general-category properties, numbered backreferences—not the spelling used by a particular engine. Around that concept, the public reference should expose qualified relationships to systems, concrete profiles, versions, syntaxes, options, Unicode/text models, operations, replacement languages, host APIs, and evidence. That direction matches the Regex Knowledge Program's own foundational model: canonical semantic features are separate from systems/profiles, and capability facts belong to profile × feature relationships rather than to either entity in isolation. The program also explicitly preserves engine family, engine, dialect, implementation, host, execution profile, Unicode model, replacement behavior, and host API behavior as different things. [source-verification note](#source-verification-gaps)

The key architectural rule is therefore:

> **Normalize the knowledge; denormalize the navigation.**

Developers should be able to enter through a construct name, an unfamiliar token, an engine, a language/runtime version, an option, a replacement form, or a question such as “what does `\w` mean here?” Yet all of those views must resolve to the same underlying statements rather than maintaining parallel compatibility truths.

That distinction matters because regex compatibility is not a Boolean property. Current PCRE2 documentation, for example, says that `\w` changes under `PCRE2_UCP`; PCRE2 10.43 changed part of that Unicode definition; additional ASCII-restriction options can alter it again. .NET has API-only options such as `NonBacktracking` that make otherwise valid constructs unavailable and change capture behavior. Its replacement language gives `$` a meaning different from `$` in the pattern language. Unicode itself specifies that property membership can change when the supported Unicode version changes. [source-verification note](#source-verification-gaps) A green “supported” cell cannot carry those distinctions.

The resulting public architecture should have three conceptual layers:

| Layer | Public purpose | Authority |
|---|---|---|
| **Entities** | Stable things developers can name and navigate to: features, systems, profiles, operations, options/modes, replacement systems, versions | Regex Knowledge |
| **Qualified statements** | “This profile has this capability, with this spelling and these semantics under these conditions” | Regex Knowledge, supplemented but not replaced by Conformance |
| **Views and explanation** | Human-readable feature pages, system references, syntax indexes, compatibility summaries, history, evidence drill-down | Website, generated from the first two layers plus authored explanation |

This is compatible with the existing project authority boundaries. The Knowledge Program owns researched knowledge, terminology, ontology, normative primary-source evidence, and capability knowledge; Regex Conformance is explicitly an empirical verification system that records what exact reproducible profiles did under controlled conditions and does not convert observations into standards guarantees. [source-verification note](#source-verification-gaps) [source-verification note](#source-verification-gaps) The Website already defines itself as the public user surface and says that public claims should come from authoritative sources rather than becoming true merely because website copy repeats them. [source-verification note](#source-verification-gaps) [source-verification note](#source-verification-gaps)

The architectural objective is thus **not to simplify the data model until it resembles ordinary documentation**. It is to keep the model precise while giving users progressively more detailed projections of it.

## User questions and navigation model

The first organizing principle should be user intent rather than repository structure. The proposed Reference needs to answer several different kinds of question that look superficially like “regex documentation” but resolve through different dimensions.

| User question | Primary entry point | Required underlying dimensions | Expected answer shape |
|---|---|---|---|
| “What is positive lookbehind?” | Feature | semantic feature | Canonical meaning, constraints, related constructs |
| “What syntax does Python use for it?” | Feature or system | feature × profile × spelling | Syntax with exact version scope |
| “What does `(?<=...)` mean?” | Syntax discovery | token × grammar context × feature × profile | Possible interpretations, then semantic feature |
| “Does Java support it?” | Feature compatibility | feature × Java profile | Qualified availability statement |
| “Which versions support it?” | Feature history | capability × version boundary | Introduced/changed/removed timeline |
| “Does PCRE2 mean the same thing by it?” | Semantic variants | feature × multiple profiles | Shared meaning plus explicitly different semantics/limits |
| “Why doesn't this work under .NET NonBacktracking?” | Option/mode | feature × profile × option | Capability becomes unavailable under the selected execution mode |
| “Does `\w` include Unicode?” | Feature + Unicode lens | feature × profile × option × Unicode/text model | Character semantics, Unicode version, mode dependencies |
| “What does `$1` mean?” | Syntax discovery | grammar context × replacement profile | Replacement construct, not pattern construct |
| “Why does `find()` differ from `matches()`?” | Operation/API | profile × operation × host API | Search/match policy and result behavior |
| “What changed in 3.14?” | System/profile history | version events × affected capabilities | Structured change inventory |
| “How do we know this?” | Evidence drill-down | claim × normative and empirical evidence | Sources, observations, scope and provenance |
| “The docs disagree. Which is right?” | Claim/conflict | competing propositions × scope × evidence | Preserved conflict, possible scope explanation, unresolved state if necessary |
| “Has this actually been tested?” | Evidence state | capability × Conformance observation | Documented expectation and empirical status shown separately |

The most important consequence is that **feature-centric versus engine-centric navigation is a false choice**. Both are necessary, but only one should define semantic identity.

The canonical semantic entry is feature-centric because a developer asking “what is lookbehind?” should not receive twelve separately authored definitions. The engine/system entry is a **projection over the same graph**: “show this ecosystem from Java's point of view,” “show PCRE2 10.47,” or “show .NET's available constructs.” This resembles one of MDN's strongest structural choices: an MDN article can reference a Browser Compatibility Data key, and its compatibility table is then generated from that shared data rather than maintained as duplicated prose. [source-verification note](#source-verification-gaps) The Regex Reference should use the same separation of editorial page and reusable structured facts, but it should not adopt BCD's browser-shaped schema as its domain model.

A practical top-level navigation should therefore expose a small number of durable **lenses**:

**Features** is the semantic ontology: assertions, grouping and captures, quantification, character matching, boundaries, backreferences, conditionals, recursion/subroutines, control constructs, and related concepts. The actual taxonomy can evolve because stable identifiers, rather than tree position, should define identity. The existing Knowledge Program already requires deterministic IDs that survive renames and explicitly warns against database-row identifiers as semantic identities. [source-verification note](#source-verification-gaps)

**Systems** begins from what a developer uses—Python `re`, Java `Pattern`, .NET regex, PCRE2, RE2, Perl, ECMAScript, ICU, Ruby/Onigmo, Rust `regex`, POSIX grammars, embedded hosts—and moves downward toward exact profiles. A system overview should not itself be a compatibility assertion. RE2 illustrates why: its documented API exposes matching modes and options, including POSIX behavior and UTF-8/Latin-1 differences, while deliberately excluding features such as backreferences and lookaround. [source-verification note](#source-verification-gaps) “RE2” is useful navigation, but a concrete capability statement requires the relevant behavioral context.

**Syntax** is a first-class discovery lens but should **not** be a second feature ontology. It exists because developers routinely arrive with punctuation rather than terminology. Searching `(?<=`, `\K`, `(?P<`, `\p{L}`, `$1`, `$&`, or `\G` should work directly. Each token maps to one or more **uses**, and each use identifies its language context, profiles, feature, and relevant conditions. The .NET documentation provides a decisive example: `$` in a regex pattern is an end anchor, while `$` in a replacement string introduces substitution syntax. [source-verification note](#source-verification-gaps) A global dictionary saying “`$` means X” would therefore be structurally false.

**Operations** captures behavior that is not solely a property of the pattern grammar: compile, full-match, search/find, iterative matching, split, replace/substitute, capture extraction, and related result semantics. Java's `Pattern` and `Matcher` separation is a straightforward example: compilation produces a `Pattern`, mutable matching state belongs to `Matcher`, and methods such as `matches`, `find`, and splitting expose distinct host operations. [source-verification note](#source-verification-gaps) PCRE2 similarly puts substitution behavior behind an API with its own option set, lengths measured in code units, and special global-substitution behavior. [source-verification note](#source-verification-gaps)

**Modes and Unicode** should be cross-cutting lenses rather than footnotes. Unicode Technical Standard #18 explicitly allows regex behavior to depend on a surrounding system or optional setting and ties full-property behavior to the supported Unicode version; property sets may expand or, occasionally, change between Unicode releases. [source-verification note](#source-verification-gaps) .NET and PCRE2 likewise demonstrate that modes can change syntax availability and semantics rather than merely optimize execution. [source-verification note](#source-verification-gaps)

**History** exposes changes and version boundaries without turning the entire site into a documentation snapshot. It should be reachable from features, systems, profiles, and statements, rather than functioning as a disconnected changelog.

These lenses should all preserve the user's selected context. When someone chooses “Python `re` 3.14,” following links from positive lookbehind to `\w`, replacement syntax, or a host operation should keep that profile selected when applicable. But the link must still resolve to canonical entities rather than generating a separate hand-authored Python universe.

## Canonical entity and page model

The public model needs fewer **page identities** than the underlying Knowledge graph has entity types. Making every database record a webpage would expose implementation complexity; collapsing every relationship into prose would destroy technical precision. The correct boundary is to distinguish **page-bearing entities** from **addressable statements**.

The recommended page model is:

| Public identity | Purpose | Canonical content |
|---|---|---|
| **Feature** | Meaning of an engine-independent regex concept | Definition, semantic variants, related features, spellings by profile, compatibility projection, history |
| **System** | Human-recognizable engine/runtime/dialect/host family | Identity, lineage, profile families, current versions, APIs, options, Unicode/replacement links |
| **Profile** | Exact reference context for behavior | Components/version, defaults, text model, applicable options, capabilities, historical status |
| **Operation** | Meaning of match/search/split/replace-like operations | Generic operation concept plus system/API realizations |
| **Option or mode definition** | A behavior-affecting mode in a system | Spelling/API form, scope, precedence, affected capabilities, introduction/removal |
| **Replacement profile/language** | Replacement-string grammar and behavior | Replacement syntax, capture interpolation, escaping, unset-group behavior, API constraints |
| **Version/change view** | Historical state and material transitions | Profile lineage, introduced/changed/removed capabilities, relevant source chronology |
| **Evidence/claim view** | Drill-down for a specific public assertion | Exact proposition, scope, authority, references, observations, conflicts, supersession |

A **capability statement** should generally not require users to browse a vast top-level capability directory, but every material statement should receive a stable address or fragment identifier so it can be linked, cited, inspected, and corrected independently.

The key underlying relation is conceptually:

`Profile —[has capability, with qualifiers]→ Feature`

where the relationship carries what ordinary compatibility tables try to cram into a color.

A useful public abstraction would be:

```text
Capability statement
  subject:       exact profile
  feature:       canonical feature
  applicability: applicable | not-applicable | unknown
  availability:  available | unavailable | unknown
  syntax:        one or more profile-scoped spellings
  semantics:     semantic variant / scoped meaning
  conditions:    options, modes, build/runtime conditions
  operation:     where relevant
  unicode:       text/Unicode assumptions
  constraints:   limits and restrictions
  version_scope: exact release or interval
  api_context:   where relevant
  replacement:   where relevant
  normative:     researched expectation and sources
  empirical:     observation status and references
  uncertainty:   explicit state and explanation
```

This is an information-architecture recommendation rather than a proposal to redesign the internal Knowledge database. It follows from the existing program contract, which already assigns availability, syntax, semantics, qualifiers, constraints, options, Unicode, host/API interactions, versions, limits, evidence and verification state to profile × feature capabilities. [source-verification note](#source-verification-gaps)

There is strong precedent for making the **qualified statement** the durable unit rather than flattening it into a property. Wikidata statements support qualifiers and references, explicitly distinguish unknown values from absence, and can preserve multiple sourced values when sources conflict. [source-verification note](#source-verification-gaps) W3C PROV likewise provides qualified relations so additional context and provenance can be attached to a relationship rather than hidden in prose. [source-verification note](#source-verification-gaps) Regex needs this structure more urgently than many ordinary knowledge bases because options, API operations and Unicode context can materially alter a feature.

The public graph should support the following cross-links automatically:

| From | Automatically link to |
|---|---|
| Feature | spellings, supporting profiles, semantic variants, affected options, Unicode dependencies, version events, evidence |
| Syntax use | feature, grammar context, profiles using that spelling, conflicting/different meanings |
| System | profile families, releases, options, operations, replacement language, Unicode model, related systems |
| Profile | system, preceding/following profile, capabilities, modes, Unicode/replacement/API profiles |
| Option/mode | features whose availability or semantics it changes, API forms, inline forms, version history |
| Operation | implementing APIs by system, match policy, result/index behavior, replacement profile where applicable |
| Replacement construct | replacement profile, capture features it references, API method, ambiguity with pattern syntax |
| Unicode profile | affected classes/properties/case folding/boundaries, Unicode version, controlling options |
| Version event | old/new profile state, affected statements, release evidence |
| Claim | supporting or contradicting sources, empirical observations, superseding claims |
| Source | all public claims that depend on that source |

Lineage must **never generate support inheritance**. The Knowledge Program explicitly states that shared lineage does not imply capability inheritance. [source-verification note](#source-verification-gaps) RE2's description of itself as accepting a subset of Perl-like syntax, and PCRE2's deliberate compatibility syntax for several other regex systems, demonstrate why “derived from” and “behaves like” are different relationships. [source-verification note](#source-verification-gaps)

A particularly important entity distinction is **canonical concept versus spelling versus alias**. “Positive lookbehind” is a feature. `(?<=...)` is one spelling/use of that feature. “lookbehind assertion” may be a terminology alias. A search index should relate all three, but they must not become three independently maintained descriptions. Rustdoc's `doc(alias)` mechanism illustrates the useful principle: alternate vocabulary improves discovery without changing canonical item identity. [source-verification note](#source-verification-gaps)

## Compatibility, versions, evidence, and uncertainty

The central display problem is how to make precise statements quickly readable. The answer is **progressive disclosure**, not loss of dimensionality.

A compatibility matrix can still exist as one projection because developers value rapid scanning. Can I Use demonstrates the utility of feature-centric support tables, and its raw support data is deliberately reusable outside the site. [source-verification note](#source-verification-gaps) MDN similarly generates compatibility tables from reusable BCD. [source-verification note](#source-verification-gaps) But for Regex Reference, a matrix cell must be treated as a **summary of a qualified statement**, never as the statement itself.

A cell should answer at least four things without opening it:

**availability**, **first/current version scope**, **presence of material conditions**, and **epistemic/evidence state**.

For example, conceptually:

> **Available since 10.43** · `UCP required for Unicode \w` · **documented + observed**

or:

> **Unavailable in NonBacktracking mode** · **documented**

or:

> **Introduction disputed: 10.46 / 10.47** · **unresolved**

The final line is not hypothetical as a knowledge-management problem: the current Regex Knowledge Program records a PCRE2 returned-capture introduction conflict between documentation indicating 10.46 and release evidence indicating 10.47, and deliberately preserves it as unresolved pending empirical work. [source-verification note](#source-verification-gaps) That is exactly the type of fact a Boolean matrix would corrupt.

MDN BCD is instructive here because even browser compatibility cannot be represented honestly as a single yes/no value. Its guidelines require notes for “partial implementation,” support flags can matter, and future-version uncertainty has an explicit representation. [source-verification note](#source-verification-gaps) Regex requires a richer model still. The Reference should therefore avoid a generic `partial` state whenever a precise qualifier can be displayed: “supported only with option X,” “supported with bounded lookbehind,” “same spelling but different capture semantics,” or “supported only by operation Y” is more useful than “partial.”

The model should make these states semantically distinct:

| State | Meaning |
|---|---|
| **Available** | The feature/capability is available in the stated scope |
| **Unavailable** | Evidence establishes that it is not available in that scope |
| **Unknown** | The answer is not currently established |
| **Not applicable** | The question has no meaningful application to that profile/context |
| **Conditional** | Availability or behavior is governed by an explicitly identified condition; this qualifies one of the above rather than replacing it |
| **Disputed/unresolved** | Controlling evidence supports incompatible propositions that have not been defensibly reconciled |

This preserves one of the strongest rules already present in Regex Knowledge: `UNKNOWN` must not silently become `UNSUPPORTED`, and inapplicability must be explicit rather than represented by missing data. [source-verification note](#source-verification-gaps) Wikidata makes an analogous distinction between “no value” and “unknown value,” showing why absence of knowledge and knowledge of absence should not share a representation. [source-verification note](#source-verification-gaps)

**Normative/researched knowledge and empirical evidence must be displayed as separate tracks.** The user should be able to see:

> **Documented expectation:** PCRE2 documentation says X for this profile and option state.
> **Empirical evidence:** certified Conformance observations show Y under these execution conditions.
> **Relationship:** consistent / differing / not yet observed / unresolved.

The third line is a derived presentation, not a replacement for either source. Regex Conformance's governing documentation makes the same authority boundary explicit: it measures what a precisely identified runtime did, does not turn that result into a standards guarantee, keeps observations distinct from expectations and findings, and regards immutable evidence as the authority for published empirical observations. [source-verification note](#source-verification-gaps) Its architecture also keeps ontology references, vectors, applicability, execution results, evidence, warehouse projections and generated reports in separate authority layers. [source-verification note](#source-verification-gaps)

As of August 12, 2026, the Conformance README explicitly says that **no observation in the repository is yet a certified conformance result** and that no production evidence campaign has been authorized. [source-verification note](#source-verification-gaps) This provides an immediate design requirement: Reference pages must remain complete and honest when empirical evidence is absent. “No certified observation” is a valid evidence state; it cannot be rendered as either pass or fail.

Evidence drill-down should expose a **claim**, not merely a bibliography. For each material assertion it should show the proposition in plain language, exact profile and version scope, applicable option/API/Unicode context, source authority class, supporting sources, any conflicting sources, empirical observation links if present, derivation status, uncertainty reason, and supersession/history. This follows the Knowledge Program's rule that a source and a researched claim are distinct and that newer documentation must not erase older documentation governing historical releases. [source-verification note](#source-verification-gaps)

A generic “confidence: 62%” or “high/medium/low” display should be rejected. It would imply precision that the evidence model does not possess and could hide the important difference between incomplete research, ambiguous wording, conflicting authorities, and failed empirical replication. The Knowledge Program itself has already deprecated legacy `HIGH/MEDIUM/LOW`-style fields as controlling epistemic or conformance concepts. [source-verification note](#source-verification-gaps) Even Wikidata cautions that its ranks are not measures of source reliability. [source-verification note](#source-verification-gaps)

Versioning requires a similarly different model from ordinary documentation sites.

Docusaurus versions documentation by copying a documentation tree into version-specific snapshots; its own documentation warns that doing so increases maintenance/build complexity and recommends keeping the number of active documentation versions small. [source-verification note](#source-verification-gaps) That model is appropriate for “documentation for product version 4 versus version 5.” It is a poor primary model for a global Regex Reference because Python, Java, .NET, PCRE2, Perl, Unicode, ICU, host applications and embedded libraries evolve on independent release lines.

Instead:

**Canonical feature pages are timeless identities.** Positive lookbehind does not become a new public entity when Python releases a new version.

**Profiles are explicitly versioned identities.** “Python `re` 3.14” and “PCRE2 10.47 under matcher profile X” can be selected and linked directly.

**Capability statements carry exact version scope.** “Introduced,” “removed,” or “semantics changed” are changes to a relation, not reasons to duplicate the feature article.

**Version events are first-class historical records.** A profile page can render “Changes in this release,” and a feature page can render “History across systems,” from the same records.

**Historical profiles remain addressable.** A release becoming obsolete should change its status, not invalidate its URL. The Conformance principles likewise require unreproducible historical releases to remain represented rather than disappearing from coverage accounting. [source-verification note](#source-verification-gaps)

This also allows changes that do not correspond to “support began.” PCRE2's current pattern documentation records, for example, semantic changes to `\w` and POSIX classes in 10.43 and new alternative octal behavior in 10.45. [source-verification note](#source-verification-gaps) A version model limited to `version_added` loses precisely the historical semantics this Reference is intended to preserve.

## Search, permalinks, and generated versus authored knowledge

For this domain, search is part of the information architecture rather than merely a site utility.

A normal documentation search engine that tokenizes punctuation or strongly favors prose titles can make the most important regex queries effectively unsearchable. The index must preserve literal punctuation and backslashes and classify results by entity/context.

At minimum it should understand these query intents:

| Query style | Example | Search behavior |
|---|---|---|
| Exact syntax | `(?<=` | Return syntax uses first, grouped by pattern grammar/profile |
| Replacement syntax | `$&` | Prioritize replacement-language results, clearly label context |
| Canonical term | `positive lookbehind` | Return feature entity |
| Alias | `look-behind assertion` | Resolve to canonical feature without duplicate identity |
| System + feature | `python atomic group` | Bias feature capability under Python profiles |
| Exact version | `python 3.11 atomic` | Select historical/profile-scoped statements |
| Semantic question | `java \w unicode` | Surface feature + Java + Unicode-dependent capability |
| Option | `NonBacktracking` | Return .NET mode plus affected features |
| API operation | `Matcher find` | Return Java operation/API material |
| Evidence identifier | stable claim/test ID | Resolve directly to evidence/claim drill-down |
| Source terminology | unfamiliar vendor name for a concept | Use structured aliases and syntax mappings |

Search results should visibly distinguish **Feature**, **System**, **Profile**, **Syntax**, **Option**, **Operation**, **Replacement**, **Change**, and **Evidence**. A result reading only “Lookbehind” is insufficient if one result is the semantic construct and another is an engine-specific option note.

Rustdoc provides two useful structural lessons: its search system supports more than simple title text, and authors can add search aliases without renaming the underlying item. [source-verification note](#source-verification-gaps) Regex Reference should take the same principle further with a domain-specific alias/syntax index.

Aliases should carry **type and scope**. The index should know that “flavor” may be colloquial terminology for dialect/system behavior; `(?P<name>...)` is a syntax spelling; “named capture” is a concept; `RegexOptions.Multiline` is an option identifier; and `$1` may be replacement syntax depending on context. That makes aliases part of the structured knowledge contract, not a bag of SEO keywords.

Stable URLs should follow entity identity rather than current taxonomy, implementation technology, or mutable status. W3C's longstanding URI guidance specifically warns against encoding implementation mechanisms and change-prone organizational classifications in durable identifiers. [source-verification note](#source-verification-gaps) This aligns directly with Regex Knowledge's deterministic stable-ID discipline. [source-verification note](#source-verification-gaps)

A reasonable public namespace would be conceptually similar to:

```text
/reference/features/positive-lookbehind
/reference/systems/pcre2
/reference/profiles/pcre2-10-47
/reference/operations/replace
/reference/options/dotnet/nonbacktracking
/reference/replacements/dotnet
/reference/changes/pcre2-10-43-unicode-word-character
/reference/claims/<stable-claim-id>
```

The exact slugs are an implementation choice; the principles are more important:

A slug must resolve through a durable semantic ID. Renaming “positive lookbehind assertion” to “positive lookbehind” must not change identity. Moved classifications must redirect indefinitely. “Current,” “latest,” “supported,” “experimental,” or similar mutable status should not be embedded in an entity permalink. Historical profile URLs should include exact version identity. A canonical concept URL should remain independent of which profile a visitor currently has selected.

For shareable scoped states, the site should offer a permalink that captures profile context without redefining the feature's canonical identity. For example, a “copy link to this Python 3.14 view” control could encode a profile selector in a stable parameter or relationship URL while preserving `/reference/features/positive-lookbehind` as the canonical semantic resource.

The content pipeline should also maintain a strict distinction between **generated facts** and **authored explanation**.

Generated from authoritative structured data:

- profile and version identity;
- spellings and aliases;
- availability and constraints;
- compatibility summaries;
- option dependencies;
- Unicode/text-model facts;
- change timelines;
- relationship lists;
- evidence badges and claim links;
- source/reference lists;
- structured cross-links.

Authored for humans:

- concise conceptual definitions;
- explanations of why two similar constructs differ;
- carefully selected examples;
- interpretation guidance;
- terminology notes;
- portability explanations that synthesize multiple structured facts.

The authored layer must be allowed to **explain** structured truth but not independently redefine it. A sentence such as “Python added atomic grouping in version X” is a data-backed assertion and should resolve to the same capability/version event that supplies the compatibility display; it should not be separately typed into five pages.

This is a natural extension of the Website's existing policy. The site already says claims must be supported by authoritative public evidence, that website copy does not become a source merely through repetition, and that shared data should be updated before page-specific copy. [source-verification note](#source-verification-gaps) [source-verification note](#source-verification-gaps) MDN demonstrates the same architectural pattern at larger scale: BCD keys in page metadata drive compatibility and feature-status rendering, while a separate `mdn/data` repository supplies other structured material such as navigation and infobox data. [source-verification note](#source-verification-gaps)

For Regex Reference, this separation should be made even stronger: **the page is a projection of knowledge plus explanation, not the persistence layer for compatibility facts**.

## Lessons from existing technical references and critical anti-patterns

No existing reference system should be copied wholesale, because none has the same combination of syntax ambiguity, embedded engines, host APIs, replacement mini-languages, independently versioned Unicode behavior, options, and empirical execution evidence. Several systems nevertheless provide useful structural lessons.

| Reference system | Keep | Do not copy |
|---|---|---|
| **MDN + BCD** | Separate structured compatibility from editorial prose; use stable data keys; generate compatibility/status UI | Browser-shaped matrix as the domain model; overly coarse support-state vocabulary |
| **Can I Use** | Fast feature-first scanning; immediate cross-implementation orientation | “feature × browser version” as sufficient compatibility truth; summary color becoming semantic authority |
| **Python / Java / .NET docs** | Put version changes, options, Unicode effects and API behavior close to the affected concept | Treat each ecosystem's vocabulary and information hierarchy as globally canonical |
| **PCRE2 manuals** | Separate pattern syntax, API, substitution, Unicode and matching details while cross-referencing them | Require users to reconstruct cross-engine equivalence manually |
| **Rustdoc** | Strong stable item identity, aliases, structured cross-linking, specialized search | Code namespace as the organizing ontology for a semantic ecosystem |
| **Docusaurus-style versioned docs** | Clear current/latest/historical indicators and explicit version selection | Snapshot the entire Regex Reference once for every independent runtime version |
| **Wikidata/Wikibase** | Qualified statements, references, explicit unknown/no-value distinction, ability to preserve sourced conflict | Treat rank as epistemic confidence or let a generic graph vocabulary dictate regex semantics |
| **W3C PROV** | First-class provenance and qualified relations | Expose the provenance ontology itself as the developer-facing information hierarchy |

MDN BCD is particularly instructive because its success comes from making compatibility **machine-readable and reusable**, not from the appearance of the final table. The repository contains over 15,000 feature records, and its schema is the definitive format for support data. [source-verification note](#source-verification-gaps) Yet BCD's own guidelines show where a simple compatibility model strains: “partial implementation” requires judgment and explanatory notes, contextual subfeatures are sometimes necessary, and flags require separate treatment. [source-verification note](#source-verification-gaps) Regex should learn from that limitation rather than repeat it at greater dimensionality.

The domain itself proves why the extra dimensions are necessary. .NET's `NonBacktracking` option makes lookarounds, backreferences, atomic groups, balancing groups and other constructs unavailable and changes capture behavior; some .NET options are API-only while others can be expressed inline. [source-verification note](#source-verification-gaps) PCRE2 can change character-class behavior under Unicode options and supports application options, inline settings and start-of-pattern controls with different scopes. [source-verification note](#source-verification-gaps) PCRE2 substitution has a distinct option set and reports lengths in code units rather than abstract “characters.” [source-verification note](#source-verification-gaps) Unicode Technical Standard #18 says conformance may depend on surrounding systems/settings and on the supported Unicode version. [source-verification note](#source-verification-gaps) These are not “notes around support.” They are dimensions of the claim.

The following anti-patterns should therefore be treated as architecture failures.

**Boolean compatibility tables.** “Yes” hides conditions, version changes, semantic variants and evidence state. “No” dangerously conflates unsupported, unknown and not applicable.

**A universal `partial support` bucket.** A developer needs to know *what* is partial: syntax restriction, semantic mismatch, option dependency, operation dependency, missing Unicode behavior, bounded lookbehind, API limitation, or defect. BCD itself requires notes to make partial support meaningful. [source-verification note](#source-verification-gaps)

**Engine names as behavioral identities.** “PCRE2 supports X” is often too broad. Exact release, matching path, compile/match options, code-unit width, Unicode mode or host wrapper may matter. Regex Conformance therefore defines execution profiles as behaviorally relevant component graphs rather than mere engine labels. [source-verification note](#source-verification-gaps)

**Feature inheritance through lineage.** “Oniguruma-like,” “Perl-compatible,” “uses ICU,” or “based on PCRE” can guide discovery but cannot establish support. The Knowledge Program explicitly forbids deriving capabilities from lineage. [source-verification note](#source-verification-gaps)

**One syntax string → one meaning.** `$`, `\b`, `\w`, numeric escapes and many parenthesized forms are context- or profile-sensitive. .NET's pattern/replacement `$` distinction is an explicit documented example. [source-verification note](#source-verification-gaps)

**Treating replacement as a footnote to matching syntax.** Replacement strings form independent mini-languages. .NET explicitly says substitution constructs are recognized only in replacement patterns, while PCRE2 gives substitution processing its own options and API semantics. [source-verification note](#source-verification-gaps)

**Treating Unicode as a check box.** Unicode affects properties, shorthand character classes, case folding, boundaries, normalization assumptions and version-dependent character membership. UTS #18 expressly scopes full property behavior to a supported Unicode version. [source-verification note](#source-verification-gaps)

**Whole-site version snapshots.** They multiply copies of explanations while regex systems evolve independently. Docusaurus itself warns that documentation versioning introduces duplication and maintenance complexity. [source-verification note](#source-verification-gaps)

**Current documentation overwriting history.** A changed manual cannot retroactively describe an older release. The Knowledge Program explicitly requires historical evidence scope to be preserved. [source-verification note](#source-verification-gaps)

**Manually duplicated compatibility prose.** A version boundary typed separately into a feature article, system article, release page and table will eventually diverge. MDN's BCD-backed rendering and the Website's existing centralized-data policy show the safer pattern. [source-verification note](#source-verification-gaps) [source-verification note](#source-verification-gaps)

**Absence interpreted as unsupported.** Missing knowledge is not negative evidence. Both the Regex Knowledge rules and established knowledge-graph practice explicitly distinguish unknown from known absence. [source-verification note](#source-verification-gaps) [source-verification note](#source-verification-gaps)

**Empirical success converted into normative truth.** A successful controlled run says what that profile did under those conditions; it does not prove every conforming implementation must do the same. That separation is a constitutional principle of Regex Conformance. [source-verification note](#source-verification-gaps)

**Evidence hidden in footnotes.** Evidence should be addressable from the exact claim it supports. W3C PROV and qualified knowledge-base statements both demonstrate why provenance belongs to relationships rather than to an undifferentiated bibliography. [source-verification note](#source-verification-gaps)

**A hierarchy mistaken for the ontology.** Features can belong to several useful groupings, and systems have cross-cutting relationships. W3C's URI guidance even notes that topic classification changes because relationships are web-like rather than inherently tree-like. [source-verification note](#source-verification-gaps) Trees are excellent menus; they should not define semantic identity.

## Implications for STRling contracts and open research questions

The proposed architecture does not require the Website to own a new compatibility truth. It requires clean contracts among Knowledge, Conformance, and Website.

For **Regex Knowledge**, the public-consumption contract should eventually expose stable semantic IDs, canonical labels and aliases; system/profile identity and lineage; explicit version scope; feature × profile capability statements; spellings with grammar context; option and mode dependencies; Unicode/text-model information; host/API and replacement relationships; constraints and semantic variants; change/version events; explicit unknown and not-applicable states; claim IDs; evidence references; conflicts; and supersession/history. These are already substantially present as concepts in the Knowledge Program's canonical research model and database responsibilities. [source-verification note](#source-verification-gaps)

Most importantly, the exported contract must be **lossless enough that the Website never has to infer a collapsed support state from prose**. The Website may decide that a compact view says “available with conditions,” but the underlying conditions must remain structured.

For **Regex Conformance**, the Reference needs a read contract, not ownership of the evidence model. The contract should expose stable observation/evidence identifiers, exact controlled profile identity or an explicit crosswalk to Knowledge profiles, observation status, certification/trust qualification, provenance link, and invalidation/supersession state. The Conformance repository already assigns registries, profile modeling, ontology crosswalks, applicability, result/evidence integrity and generated reports to distinct modules, and explicitly forbids its ontology layer from creating a competing semantic taxonomy. [source-verification note](#source-verification-gaps)

A particularly important integration issue is identity. A public “Python `re` 3.14” profile may be understandable to users while a Conformance execution profile may need substantially more exact component/environment dimensions. Those must be connected through **explicit qualified mappings**, not assumed to be identical. The Conformance architecture already describes registry profiles as behaviorally relevant component graphs and ontology projections as qualified consumers of Knowledge references. [source-verification note](#source-verification-gaps)

For the **Website**, the Reference should become a distinct information domain—conceptually `/reference`—rather than simply enlarging the current authored `/docs` tree. The current repository has dedicated documentation and learning structures and describes `src/content/docs/` as canonical user reference topics, while centralized `src/data/` already holds shared source facts. [source-verification note](#source-verification-gaps) [source-verification note](#source-verification-gaps) The new Reference should use the same public shell but receive its factual state through generated/adapted Knowledge and Conformance inputs.

That implies a content boundary:

```text
Knowledge export
       │
       ├── canonical entities
       ├── qualified capability statements
       ├── terminology / aliases
       ├── version events
       └── normative claims / source references
       │
       ▼
Reference projection layer ◄──── Conformance public evidence index
       │
       ├── compatibility summaries
       ├── profile views
       ├── syntax index
       ├── history
       ├── evidence status
       ├── cross-links
       └── search index
       │
       ▼
Website reference pages
       +
Authored explanatory prose keyed to stable entities
```

The Reference projection layer is deliberately **regenerable**. Handwritten explanation may survive many data releases; compatibility and history projections should change when their authoritative inputs change.

Several questions should remain open until user research or low-cost prototypes establish the right presentation. They are interface questions, not reasons to weaken the underlying model.

First, **what is the dominant entry behavior?** Experienced regex developers may begin with literal syntax (`(?<=`) more often than semantic names (“positive lookbehind”), while developers migrating code may begin with the source or destination system. Search telemetry or task-based testing should determine default emphasis, although the architecture supports all three.

Second, **how much profile specificity can developers understand before it becomes noise?** “PCRE2 10.47” may be enough for most reference browsing, while some claims require 8/16/32-bit code-unit width, matcher variant, host wrapper or option state. A prototype should test a simple profile label with expandable execution detail rather than either hiding those distinctions or exposing the entire component graph initially. PCRE2's own API shows why such details can matter: substitution lengths are explicitly code-unit based. [source-verification note](#source-verification-gaps)

Third, **what is the optimal compact compatibility-cell grammar?** A cell must communicate availability, version boundary, qualification and uncertainty without becoming a miniature paragraph. This should be prototyped with genuinely difficult cases—not easy “supported since X” examples—such as option-dependent availability, Unicode-sensitive semantics and disputed history.

Fourth, **should replacement languages appear under a general Operations lens, a dedicated Replacement lens, or both?** The data model should treat them independently regardless, because authoritative .NET and PCRE2 documentation show that replacement syntax and behavior are separate from pattern syntax. [source-verification note](#source-verification-gaps)

Fifth, **how visible should provenance be by default?** Every claim needs drill-down, but developer testing should determine whether compact evidence badges are sufficient in ordinary reading or whether source class and empirical state should always be visible beside high-risk compatibility claims.

Sixth, **how should historical releases be grouped for navigation while preserving exact scope?** Users may prefer major/minor release families in selectors even though individual patch releases remain addressable. The representation can aggregate navigation without aggregating the underlying statements.

Seventh, **which terminology should be surfaced as canonical versus colloquial?** Terms such as engine, implementation, dialect, flavor, host, profile and execution profile are routinely conflated in regex discourse. The Knowledge model properly distinguishes many of them. [source-verification note](#source-verification-gaps) User research should establish which distinctions belong immediately in the interface and which belong behind an “exact profile” disclosure.

Eighth, **how should same-spelling/different-semantics results be grouped?** For a syntax query such as `\w`, developers may understand the ecosystem better if results are clustered by semantic equivalence rather than simply listed by engine. Unicode- and option-sensitive constructs are the strongest prototype cases because authoritative sources demonstrate that identical spelling can represent materially different character sets. [source-verification note](#source-verification-gaps)

The durable answer to the primary research question is therefore:

> **A developer should navigate the regex ecosystem through multiple lenses over one qualified knowledge graph: semantic feature when asking what something means, syntax when starting from notation, system/profile when working inside an implementation, operation when host behavior matters, and history/evidence when asking when or why a claim is true. The reference should collapse these dimensions only for presentation, never for storage or authority.**

That architecture makes a simple answer simple—“positive lookbehind means this”—while allowing the same page to progressively answer “Python spells it this way,” “this profile introduced it here,” “this mode restricts it,” “Unicode changes this related construct,” “the replacement grammar is separate,” “these sources establish the claim,” and “this historical point remains unresolved.” It preserves the most important property already present in the Regex Knowledge and Conformance programs: **precision is retained at the claim boundary rather than reconstructed later from prose or colored cells**. [source-verification note](#source-verification-gaps) [source-verification note](#source-verification-gaps)
