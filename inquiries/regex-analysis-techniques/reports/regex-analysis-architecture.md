# STRling Semantic Regex Analysis: An Entitlement-Based Portfolio, Not a Universal Algorithm

Role: Research report
Origin: OpenAI deep-research session commissioned for STRling Research Intelligence
Generated: 2026-08-12
Imported: 2026-08-12
Source verification: Partially verified
Last reviewed: 2026-08-12
Current status: Active input

## Source verification gaps

The imported report contained opaque research-session citation markers without a durable marker-to-source table. The markers were removed; unresolved claim-level citations, external comparisons, and proposed models require verification. Current-state claims were checked against the downstream authorities linked by the active inquiry.

## Executive conclusion and governing principle

The architectural answer is **not** to choose derivatives, automata, symbolic methods, SMT, abstract interpretation, or empirical testing as STRling's universal analysis engine. The evidence instead supports a **staged, property-directed portfolio built over one semantic authority and several disposable or cacheable analysis views**. That conclusion is also consistent with Research Intelligence's current `regex-analysis-techniques` inquiry, which explicitly treats the earlier “symbolic derivatives should be the linter architecture” conclusion as historical rather than authoritative and says that method selection must depend on the property, semantic subset, proof obligation, latency, and explanation requirements.

The central rule should be:

> **An analyzer is entitled to answer a STRling query only when its modeled semantics cover the query's observable behavior and feature subset, its guarantee is strong enough for the requested claim, and it completes within the declared resource budget.**

This makes the choice of algorithm a consequence of the question rather than an architectural identity.

That distinction matters because “regex analysis” contains several fundamentally different problems. Language nullability is a compositional semantic fact. Containment is a relation between languages. Capture equivalence concerns structured match results rather than just accepted strings. “Why did this fail?” on a concrete input may depend on prioritized search. Backreferences can cross the boundary from finite-state language reasoning into non-regular behavior. Portability planning is largely a semantic-requirement/capability problem, not an automata problem at all. Research Intelligence's equivalence inquiry already records the key semantic distinction: two patterns may accept the same strings while differing in captures, spans, selection policy, iteration behavior, or replacement-observable results.

This report therefore recommends five architectural decisions.

| Decision | Recommendation |
|---|---|
| Semantic authority | **Canonical Semantic IR remains authoritative.** No derivative expression, NFA, DFA, SMT formula, tagged automaton, or target engine becomes a second source of regex meaning. |
| Reusable analysis substrate | Maintain **shared, typed, target-neutral semantic and structural facts**, including explicit `Indeterminate`/`Unknown` states. |
| Specialized representations | Construct **property-specific derived views on demand**: residual expressions, Thompson/partial-derivative NFAs, symbolic automata, tagged/result models, search trees, constraints, and concrete target executions. |
| Dispatch | Introduce an **entitlement-aware portfolio dispatcher** whose inputs include property, observation relation, semantic feature envelope, guarantee, target scope, budget, and explanation requirement. |
| Results | Separate **Proven**, **Refuted by witness**, **Unknown**, **Unsupported/Refused**, and **Empirical evidence only**. Never turn a timeout, abstraction loss, bounded search, or absence of fuzz failures into a proof. |

STRling's Fourth Edition work is already moving in the right direction. On `architecture/v4`, `semantic_analysis.rs` derives target-neutral facts such as nullability, minimum/maximum consumption, capture definitions/references, and resolved backreferences from canonical Semantic IR and binds those facts to deterministic program identity. `structural_analysis.rs` consumes those certified facts to derive length classes, leading-consumption information, progress and overlap relationships, while explicitly representing unknown reasons and imposing deterministic complexity limits. `safety_analysis.rs` goes a step further: positive findings require structural evidence, while inconclusive cases become typed uncertainties rather than inferred negatives. And target capability evaluation is deliberately separated from target-neutral requirement extraction.

That is almost exactly the substrate a portfolio architecture needs. The major missing piece is to generalize this pattern from today's compositional/structural analyses into a **query-and-entitlement framework for heavier exact, symbolic, operational, and empirical analyses**.

The strongest negative conclusion of this investigation is therefore:

**STRling should not standardize one canonical automaton representation.** A canonical DFA would make cheap local properties unnecessarily expensive and would erase or complicate capture/search semantics; a canonical tagged automaton would impose capture machinery on questions that do not need it; a canonical symbolic derivative system would be elegant for Boolean regular reasoning but awkward as the sole model of prioritized target execution; and a canonical search tree would preserve operational behavior while being grotesquely expensive for simple language-set questions. Mature compiler and regex systems instead use multiple purpose-specific representations while keeping semantic ownership explicit. LLVM has deliberately different IRs at different phases, and Rust's compiler query architecture memoizes derived computations rather than turning each derived result into a new semantic authority. The `regex-automata` project likewise uses a meta-engine that chooses among multiple regex engines because the individual engines have different capability and performance trade-offs.

The rest of the report defines how that choice should work.

## Semantic envelopes and technique taxonomy

Before STRling selects an algorithm, it should classify the **semantic envelope of the query**. Merely classifying the syntax as “contains lookaround” or “contains captures” is too coarse: the observable being compared can make a feature relevant or irrelevant. A capture group may be ignorable for language equivalence but indispensable for result equivalence; greediness may not alter the accepted language but can alter captures and selected match spans. This is why the equivalence inquiry insists that the observation relation and semantic profile are part of the question itself.

A useful architectural partition is:

| Envelope | Meaning | Typical features | What is observable |
|---|---|---|---|
| **L0 — regular-language core** | Ordinary regular-language reasoning | literal, wildcard, character predicates, concatenation, alternation, bounded/unbounded repetition; regularizable positional predicates | accepted strings |
| **L1 — symbolic/Boolean regular** | Still regular, but character domains or Boolean operators make explicit alphabets/ordinary NFAs inconvenient | Unicode predicates, large classes, complement, intersection, supported regular lookaround/location constructs | accepted strings |
| **R2 — result-regular** | Finite-state language behavior plus submatch/result semantics | captures, capture spans, repeated captures, specified disambiguation such as leftmost-greedy/POSIX where supported | match span and captures |
| **O3 — operational/search semantics** | Result depends on ordered search rather than only set membership | greedy/lazy choice, atomicity, possessive behavior, lookaround search interaction, target-specific priority/capture reset rules | selected match, captures, branch/search explanation |
| **N4 — non-regular or otherwise outside a proven finite-state fragment** | Classical finite automata cannot in general represent the complete language relation | unrestricted backreferences and any future recursion/conditional features with comparable expressiveness | depends on query; often relational string/capture behavior |

Backreferences deserve special treatment. They do **not** mean every pattern containing a backreference denotes a non-regular language, but they invalidate the blanket assumption that the pattern belongs to the regular languages. Classical finite-state inclusion/equivalence algorithms therefore cannot be entitled merely because they successfully translated the rest of the pattern. Research Intelligence already treats backreferences as a major boundary for universal equivalence claims.

Lookaround is subtler. It should not simply be labeled “non-regular.” Recent symbolic-derivative work demonstrates models for complement, intersection, and selected lookaround semantics using location-aware or symbolic formulations, and mechanized work has formalized such matching semantics. But that does **not** imply that every target's lookaround-plus-capture-plus-backreference behavior is covered by the same finite-state construction. The dispatcher should therefore ask not “does this contain lookaround?” but “is this instance of lookaround within the semantics proved by this analyzer?”

The required technique list falls naturally into six families.

**Residual-expression techniques.** Brzozowski derivatives turn language residuals into deterministic states; Antimirov partial derivatives produce sets of residuals and correspond naturally to NFAs. Antimirov proved that the set of partial derivatives is finite for ordinary regular expressions and bounded by one plus the number of letter occurrences in the expression. Modern derivative treatments extend the basic idea to large character sets and Boolean operations. Symbolic Boolean derivatives go farther by maintaining Boolean formulas and symbolic character predicates rather than expanding a huge alphabet.

**Explicit automata.** Thompson NFAs provide a small syntax-directed nondeterministic graph and are useful both directly and as input to relation algorithms; `regex-automata` explicitly exposes its Thompson NFA as a core representation usable for matching, analysis, and DFA construction. DFAs trade construction/state-space cost for deterministic transition behavior. Lazy DFAs materialize only states actually demanded and can impose a memory capacity, but they do not thereby remove the theoretical determinization boundary. `regex-automata` documents precisely this trade-off and notes that its lazy DFA does not provide capture-group offsets. Tagged automata enrich automaton states/transitions with submatch information and can implement defined match-disambiguation policies, while symbolic finite automata replace concrete alphabet labels with predicates over a decidable character theory.

**Relational decision procedures.** Antichain algorithms attack inclusion/universality while avoiding explicit full determinization, retaining only incomparable representatives under a simulation/subset ordering. Bisimulation and coinductive techniques, including bisimulation “up to congruence,” can prove equivalence of nondeterministic automata without first minimizing explicit DFAs. Ambiguity analyses preserve or reconstruct multiple parses/paths rather than quotienting them away; derivative-based ambiguity work can produce counterexample strings and parse witnesses.

**Abstract and constraint reasoning.** Abstract interpretation intentionally computes in an abstract domain that soundly approximates concrete behavior rather than enumerating every execution; precision is traded for cost, and incomplete precision can yield alarms or unknown results even when concrete behavior is harmless. Constraint solving and SMT/SAT instead encode a particular semantic relation into a solver-friendly logical theory. Symbolic-automata work has shown effective combinations of automata and SMT for large/infinite alphabets, and regular-constraint research has integrated such reasoning into Z3-style frameworks.

**Operational and empirical methods.** A search/tree semantics represents what a backtracking matcher actually explores, including priority and capture state; recent mechanized ECMAScript regex semantics explicitly model a full backtracking tree, while the ECMAScript specification itself describes matcher states and captures operationally. Bounded symbolic execution explores such paths under explicit limits and solves path conditions; KLEE is the classic compiler-analysis example of solver-backed path exploration producing concrete witnesses while facing path explosion and solver costs. Concrete execution, fuzzing, and differential testing observe actual implementations. They are extremely valuable for finding counterexamples and portability discrepancies but, absent exhaustive coverage, non-discovery of a counterexample is not a universal proof. Research Intelligence makes the same distinction for regex relations: a valid witness refutes a universal claim, whereas failure to find one proves nothing unless the search is complete for the declared domain.

**Hybrid portfolios.** These deliberately combine the above. A cheap abstract pass may solve the query immediately or narrow the problem; an exact NFA/SFA relation procedure can handle the regular residue; an SMT-backed bounded phase can search difficult features; and concrete/differential execution can validate a discovered target-specific witness. The architecture is not “heuristic first, formal later” so much as **each stage has a typed epistemic role**.

## Technique applicability, guarantees, and operational trade-offs

The matrix below uses these symbols:

**E** = complete/exact for the stated modeled fragment; **R** = exact only under an explicit restricted formalization; **A** = auxiliary, approximate, bounded, or witness-oriented; **—** = not entitled as a general method.

No “E” should be read as a claim about arbitrary modern regex semantics. It means sound and complete **inside the analyzer's declared semantic envelope**.

| Technique | L0 | L1 | R2 | O3 | N4 | Assertions/lookaround | Backreferences | Unicode scaling | Guarantee and false-result behavior |
|---|---:|---:|---:|---:|---:|---|---|---|---|
| **Brzozowski derivatives** | E | R | — | — | — | Regularized assertions only unless using an extended formalism | General case unsupported | Good with symbolic/set-valued alphabet representation; poor if enumerating scalars | Exact language result in supported fragment; no FP/FN there. State/residual explosion can force `Unknown` under a budget. Derivatives correspond to deterministic language residuals. |
| **Antimirov partial derivatives** | E | R | — | — | — | Same regularization boundary | General case unsupported | Good when transitions use predicates/classes | Exact language semantics for supported regex algebra; NFA-like residual sets avoid immediate determinization. Antimirov proves a finite, expression-related partial-derivative set for ordinary regex. |
| **Thompson NFA** | E | R | — | — | — | Only constructs with a sound NFA translation | General case unsupported | Depends on transition representation; byte/symbolic classes avoid per-scalar expansion | Exact language semantics for represented fragment; no FP/FN inside it. Compact construction does not prevent later subset/product explosion. |
| **Full DFA** | E | E after symbolic/encoded alphabet normalization | — | — | — | Only after sound compilation into regular state | Unsupported generally | Can be expensive for large Unicode classes without compact predicates/byte automata | Exact and straightforward for language membership/equivalence once constructed; determinization can be exponentially larger than the NFA. |
| **Lazy DFA** | E | R/E depending alphabet implementation | — | — | — | Same semantic boundary as DFA | Unsupported generally | Practical with compact encodings, but Unicode classes can still cause state pressure | Exact for explored transitions; a complete universal proof requires all relation-relevant reachable states. With a cap, exhaustion means `Unknown`, not proof. `regex-automata` explicitly bounds/cache-resets its lazy DFA and does not use it for capture offsets. |
| **Tagged automata** | E | R | E/R | R | — | Possible only to extent formalized by tagged model | Generally unsupported | Orthogonal; should use symbolic/compact alphabet underneath | Can be exact for a declared submatch/disambiguation policy. Tag histories/register states add complexity. Tagged-DFA work supports submatch extraction and concrete disambiguation policies. |
| **Symbolic finite automata** | E | E | — unless tagged | — | — | Regular predicates and suitably formalized assertions | Unsupported generally | **Strong fit:** labels are predicates rather than enumerated Unicode characters | Exact when predicate theory/decision procedures are exact. Predicate partitioning/minterm formation can itself explode; symbolic automata literature treats this explicitly. |
| **Boolean/symbolic derivatives** | E | E | R in specialized extensions | R in specialized location models | — | Stronger than classical derivatives: complement/intersection and selected lookaround models have been demonstrated | General case unsupported | **Strong fit** through symbolic character predicates | Exact in the supported Boolean/location semantics; may suffer residual-formula normalization and predicate-partition explosion. |
| **Antichain containment** | E | E with SFA-compatible transition reasoning | — | — | — | Whatever the underlying automaton soundly encodes | Unsupported generally | Good with symbolic transition inclusion/intersection operations | Exact containment/universality procedure for supported automata; avoids explicit determinization but retains exponential worst-case search potential. Refuting path naturally yields witness. |
| **Bisimulation/coinduction** | E | R/E | — | — | — | Underlying automaton boundary | Unsupported generally | Depends on underlying alphabet solver | Exact equivalence for represented automata. Up-to-congruence can collapse large families of subset states and yields a checkable relation-style proof object. |
| **Ambiguity analysis** | E for a specified parse/path notion | R | R | R | — generally | Must define assertion/search semantics carefully | Usually outside classic finite-state ambiguity methods | Good if alphabet symbolic | Exact only for its specific definition of ambiguity and parsing policy. Particularly good at producing explanatory ambiguity witnesses/parse alternatives. |
| **Abstract interpretation** | A/E for simple transfer functions | A | A | A | A | Unsupported constructs can map to `Top`/`Indeterminate` rather than invalidate entire pass | Can conservatively summarize or become indeterminate | Excellent if character properties represented abstractly | Soundness depends on transfer functions and abstraction direction. A sound over-approximation can produce false alarms/unknowns but must not manufacture a proof outside its abstraction. |
| **General constraint solving** | A/E for chosen theory | A/E | R | R | R | Encodable fragments | Restricted fragments may be expressible | Strong if character/string domains have native predicates | Exact only when the encoding is exact and the theory/decision procedure covers the unbounded query. Otherwise bounded or incomplete; models make good witnesses. |
| **SMT/SAT** | A | A/E for finite/symbolic encodings | R | R | R | Can encode bounded or specialized assertion semantics | Useful for restricted/bounded backreference constraints | Usually better via symbolic range constraints than scalar enumeration | `sat` gives a model for the encoded formula; `unsat` is a universal proof only if the formula exactly captures the unbounded requested problem and the solver completed. Solver timeout/`unknown` stays `Unknown`. |
| **Tree/search-semantics model** | E but unnecessarily heavy | R | E if model includes result state | **E** for the modeled matcher semantics | R/E for concrete execution semantics | Natural fit | Natural fit if modeled | Depends on target character semantics | Semantically strongest representation for prioritized/backtracking behavior, but search structure may be exponentially large. Recent ECMAScript work uses an explicit full backtracking tree to reason faithfully about modern match semantics. |
| **Bounded symbolic execution** | A | A | A | A | A | Yes within path/depth/input bounds | Yes within modeled bounds | Solver dependent | Positive model/witness can be concrete and valid; no counterexample within the bound says nothing beyond it. Path explosion is fundamental. |
| **Concrete execution** | A | A | A/E for one input against one oracle | A/E for one input against one target | A/E for one input | Whatever target supports | Whatever target supports | Exactly target's implementation | Exact observation for that input assuming the target is the intended oracle; no universal proof from finitely many runs. Target-specific by definition. |
| **Fuzzing-assisted analysis** | A | A | A | A | A | Through generator/oracle | Through target/solver | Excellent for exploring representative Unicode edge cases if generators include them | Validated failures are strong counterexamples; lack of failures has potentially large false-negative space and is never a proof without an exhaustive domain. |
| **Differential methods** | A | A | A | A | A | Yes, when engines support comparable features | Yes | Particularly valuable for Unicode/version/runtime disagreements | A concrete discrepancy is evidence of non-portability or an oracle mismatch. Agreement across tested inputs is empirical evidence, not equivalence proof. |
| **Hybrid portfolio** | E/A | E/A | E/A | E/A | R/A | Delegates to entitled stage | Can cross from exact regular proof to bounded/nonregular evidence | Can combine symbolic alphabet core with other solvers | Guarantee is the guarantee of the stage that actually answered. The dispatcher must not “average” guarantees across methods. |

The most important distinction in this table is not NFA versus derivative. It is **language semantics versus result/search semantics**.

A plain DFA can be the ideal answer representation for “does any string belong to `L(A) \ L(B)`?” and still be fundamentally the wrong representation for “does this rewrite preserve named capture spans under leftmost-greedy matching?” Tagged automata exist precisely because ordinary automata discard information needed for submatch extraction. Modern work on disambiguation also shows that different selection policies can produce different match results even when the underlying language is unchanged.

Likewise, symbolic automata solve a specific scaling problem: **alphabet representation**. They do not magically solve state explosion, capture semantics, or backreferences. Veanes and collaborators formulate transitions using predicates over a background theory and use satisfiability/model generation to manipulate those transitions, but symbolic minimization still requires algorithms designed to avoid predicate-related blow-ups. For STRling, the correct architectural interpretation is that a symbolic character-predicate layer should be **shared infrastructure underneath several analyzers**, not that “SFA” becomes the whole analysis architecture.

The same warning applies to derivatives. Brzozowski residuals are exceptionally attractive for incremental “what remains after this prefix?” explanations and for Boolean-language algebra. Antimirov's partial derivatives retain nondeterminism and have a particularly direct expression-to-NFA relationship. Neither fact establishes that one should own capture semantics, capability planning, target portability, or concrete backtracking explanations.

The state-growth and engineering comparison is therefore:

| Technique | Worst-case/state-growth pressure | Memory behavior | Incrementality/cache suitability | Witness/proof/explanation | Interactive fit | Offline fit | Implementation burden |
|---|---|---|---|---|---|---|---|
| Brzozowski | DFA-equivalent residual family; exponential distinct states possible | Potentially large normalized expression DAG | **High** if canonical residuals/hash-consing are stable | Strong prefix residuals; BFS witness; proof via explored residual relation | Good for small/budgeted queries | Good | Medium–high because canonicalization is decisive |
| Antimirov | Base partial-derivative states expression-bounded for ordinary regex, but relation/subset constructions can still explode | Often smaller NFA-like state collection | **High** for subexpression residual caches | Good source-correlated residual explanations | Good | Good | Medium |
| Thompson NFA | Syntax-proportional graph, but later determinization/products may explode | Predictable base graph | **High** for stable subgraphs | Excellent structural/source provenance; witness path easy | **Excellent construction latency** | Excellent | Low–medium |
| DFA | Up to exponential subset growth | High transition-table cost | Good if reused by many queries | Very easy witness/product reasoning; proof graph straightforward | Poor when large | **Strong** when amortized | Medium |
| Lazy DFA | Only demanded subsets materialized until cap, but global proof may eventually demand many/all | Configurable cache; cache can reset/reuse memory | **Excellent session cache** | Good concrete path trace; incomplete exploration gives no universal certificate | **Strong for execution-like work** | Medium | Medium–high |
| Tagged automata | Underlying automaton growth plus tag/register-history complexity | Higher than language-only automata | Moderate; tag normalization matters | **Excellent capture-result witness** | Only smaller subsets | Strong | **High** |
| Symbolic FA | State growth plus predicate splitting/minterms/solver calls | Compact alphabet, possibly heavy predicates | High with canonical predicates and solver memoization | Symbolic witnesses can select representative characters/models | Good if partitions stay small | Strong | High |
| Boolean/symbolic derivatives | Residual Boolean formula growth + predicate partitioning | DAG sharing essential | **Very high potential** with normalized residual DAG | **Excellent residual/proof explanation** | Good only under strict budgets | Strong | **High** |
| Antichain | Frontier of incomparable state sets can still grow exponentially | Often materially below explicit powerset | Good for subsumption caches/frontier reuse | Counterexample path excellent; proof can retain fixed-point invariant | Medium–good | **Strong** | Medium–high |
| Bisimulation/coinduction | Pair/subset relation growth; up-to techniques can collapse large regions | Relation table | **High** | **Excellent proof certificate** as bisimulation/up-to relation | Medium | **Strong** | Medium–high |
| Ambiguity analyzer | Product/path/transducer growth depending ambiguity definition | Moderate–high | Moderate | **Excellent:** minimal ambiguous word and competing parses/paths | Targeted interactive checks possible | Strong | High |
| Abstract interpretation | Usually tree traversal or finite-domain fixpoint; bounded by abstract domain | **Low/predictable** | **Excellent** node/subtree cache | **Excellent source explanation**; proof is transfer/evidence chain | **Best fit** | Useful screening | Low–medium |
| Constraints | Depends heavily on chosen theory | Solver-owned | Good if constraints share normalized subterms | Models are good witnesses; proof artifact depends solver/theory | Narrow queries only | Strong | Medium–high |
| SMT/SAT | Potentially exponential/unpredictable search | Potentially large learned-clause state | Incremental contexts useful but cache validity subtle | Model excellent; unsat proof availability/backend dependent | Only tightly constrained | **Strong** | High |
| Search tree | Potentially exponential number of explored alternatives | Potentially enormous without sharing | Prefix/path memoization possible but semantics-sensitive | **Best human explanation of priority/backtracking** | Concrete/small queries | Strong diagnostics | **High** |
| Bounded symbolic execution | Exponential path count in bound | Path constraints and solver state | Moderate | **Excellent concrete witness** | Small bounds only | Strong | High |
| Concrete execution | Target's own complexity, including pathological backtracking cases | Target-specific | Input-result caches simple | Exact concrete observation; trace quality varies | **Excellent if safe input** | Excellent | Low |
| Fuzzing | Campaign-dependent, stochastic | Corpus-dependent | **Excellent corpus reuse** | Excellent minimized concrete failure; no proof | Limited smoke use | **Best fit offline** | Medium |
| Differential | Tests × engines/profiles × inputs | Low–medium | High | **Excellent portability witness** | Small probes | **Strong** | Medium |
| Hybrid dispatcher | Sum of selected stages, bounded explicitly | Shared facts plus selected derived artifacts | **Best overall opportunity** | Can choose the most explanatory entitled method | **Best overall** if staged | **Best overall** | **Highest architectural**, but localized analyzer complexity |

Two implementation implications follow.

First, **full DFA materialization should normally be an optimization, not a semantic prerequisite**. Exact inclusion and equivalence can often be done without constructing a complete minimized DFA: antichains and bisimulation-style procedures exist precisely to explore only the relation-relevant part of an implicit subset space. A DFA becomes attractive when STRling expects many repeated queries over the same regularized program, wants a reusable transition oracle, or performs offline analysis where construction cost can be amortized.

Second, **lazy DFA is more compelling as a matching/witness-exploration accelerator than as STRling's principal static-proof representation**. Its principal advantage is avoiding upfront construction of unused states; a universal containment or equivalence proof may eventually have to visit all reachable relation-relevant states anyway. This is an inference from the lazy-DFA execution model, not a limitation of DFA semantics itself. `regex-automata`'s design reinforces the point: it uses a lazy DFA as one engine in a larger portfolio and falls back to other engines when capabilities differ.

## Property-to-technique dispatch for STRling

The appropriate algorithm becomes much clearer when each actual STRling question is treated separately.

| STRling question | First-line analysis | Escalation for exactness | Result/capture or target-sensitive escalation | What should answer |
|---|---|---|---|---|
| **Nullability** | Compositional semantic fact / abstract interpretation | Rarely any need for automata | Backreference-dependent cases may remain indeterminate unless relational facts prove them | Shared semantic facts |
| **Width / consumption bounds** | Interval/finite-domain abstract interpretation | Specialized relational reasoning only for constructs whose width depends on captured strings | Target-specific lookbehind legality consumes the resulting classification, rather than recomputing it | Shared semantic facts |
| **Dead alternatives** | Local emptiness/disjointness/first-set and reachability facts | Exact branch-language containment against earlier alternatives via NFA/SFA + antichain, or derivatives | If “dead” means never selected under ordered result semantics rather than language-unreachable, tagged/search semantics | Structural facts → exact relational analyzer |
| **Unreachable structure** | Syntax/semantic traversal, nullable/progress/empty-language summaries | NFA/SFA emptiness or containment where structural facts cannot decide | Operational model when unreachability depends on branch priority/atomicity | Structural analyzer |
| **Overlap** | Symbolic leading/first-consumption abstraction | Exact intersection non-emptiness through product NFA/SFA or residual derivatives | Tagged/search model only if “overlap” concerns competing result paths rather than strings | Structural facts → exact language analyzer |
| **Containment** | Cheap necessary/sufficient structural checks | **Antichain inclusion** over NFA/SFA is the preferred first exact prototype; symbolic derivatives are attractive when Boolean expressions dominate | Result containment requires a separately defined result relation, not ordinary language inclusion | Property-specific exact analyzer |
| **Equivalence** | Compare cheap facts first to refute obvious mismatches | **Bisimulation/up-to-congruence** or derivative residual relation; antichain can implement two inclusions | Tagged automata/span model for capture equivalence; search semantics for target-result equivalence | Relation dispatcher |
| **Witness generation** | Reuse predecessor/source evidence from the analyzer that found failure | BFS over product/residual states with symbolic predicate model generation | SMT/BSE for bounded richer features; concrete target replay validates target-specific witness | Always attach to refutation when practical |
| **Safety / ambiguity** | Existing target-neutral progress, overlap, repetition structure | Specialized ambiguity/path analysis when exact ambiguity is actually requested | Operational target model only for target-specific exploit/search claims | Current structural/safety tier first; ambiguity analyzer as separate property |
| **Why-no-match** | Concrete-input structural checks, first/width facts | Derivative/residual trace can identify earliest impossible suffix under language semantics | **Search-tree semantics** when explanation depends on greedy/lazy priority, lookaround, captures, atomicity, or target implementation | Concrete explanation pipeline |
| **Rewrite verification** | First classify requested observable | Exact relation algorithm on supported regular language subset | Tagged/result model, search semantics, bounded solver, or explicit refusal as observables become richer | Relation dispatcher, never a single hardwired algorithm |
| **Target capability planning** | Extract semantic requirements from Semantic IR | Compare against versioned target profiles | No language automaton needed unless a capability condition itself requires semantic proof such as fixed lookbehind width | Existing requirement/capability pipeline |
| **Portability differences** | Capability/profile comparison | Formal relation only where both targets' semantics have a common formal observation model | Differential/concrete witness generation for implementation-specific differences | Capability pipeline + target-specific evidence analyzer |

**Nullability and width should emphatically not go through automata.** The Fourth Edition semantic-analysis code already computes nullability and minimum/maximum consumption as foundational facts and propagates typed uncertainty where needed. Turning every nullability query into an ε-acceptance query against an automaton would be both slower and architecturally backward: it would derive a cheap compositional fact from a more expensive derived representation.

**Overlap needs two meanings.** STRling's current structural layer computes conservative overlap relationships from leading consumption and explicitly returns `Unknown` for issues such as case folding, unsupported character-category reasoning, and comparison limits. That is ideal for fast diagnostics. But a user asking “is there any complete string that both branches can match?” is asking an intersection-emptiness question, which deserves an exact product/residual analysis on the regular subset. Conversely, “can these branches compete for the same successful backtracking path and alter captures?” is an ambiguity/result question, not ordinary set intersection.

**Containment is where antichains deserve serious priority.** Classical subset construction is conceptually simple but can build many deterministic subsets irrelevant to the actual inclusion result. Antichain algorithms were created to decide universality/inclusion directly over nondeterministic representations while retaining only maximal/minimal representatives according to a subsumption order. For a STRling prototype, an NFA/SFA plus antichain inclusion should therefore be compared directly with derivative-based inclusion rather than first committing to a reusable full DFA.

**Equivalence is where coinduction deserves comparable priority.** Bisimulation up to congruence can operate over nondeterministic automata while avoiding some redundant subset exploration and naturally yields a finite relation that is much closer to a proof certificate than “the two minimized DFA blobs happened to be byte-identical.” Symbolic derivatives are competitive where STRling's Semantic IR includes Boolean language operations or where residual expressions make source-level explanation especially valuable. Neither should be declared the universal equivalence strategy before measurements on STRling-shaped inputs.

**Witness production should be part of the relation algorithm, not a second independent subsystem.** A containment product, antichain search, derivative exploration, or ambiguity transducer already traverses a graph whose predecessor information can reconstruct a distinguishing word. Symbolic alphabets can produce a representative scalar from the predicate labeling the path, using satisfiability/model generation as symbolic-automata work does. Witness minimization can then be a secondary bounded optimization. This is preferable to solving the same relation once for a Boolean answer and again with SMT merely to obtain a string.

**Why-no-match needs an explicit semantic tier.** For language semantics on one input, derivatives are unusually natural: after each consumed prefix, the residual expression states exactly what suffix could still succeed, so the first transition to an empty residual gives an explanatory boundary. Brzozowski's residual construction is the formal basis for this interpretation. But this does not explain “the first branch consumed X greedily, the lookahead then failed, the engine backtracked here, and the capture was reset.” That requires an operational search-state model. Modern mechanized ECMAScript work demonstrates why an explicit backtracking-tree semantics is useful when matching order itself is part of the semantics.

**Rewrite verification must dispatch on the observation relation.** For `Language`, exact regular containment/equivalence machinery is entitled on L0/L1. For `WholeMatchSpan`, location/search semantics may become relevant. For `Captures`, ordinary DFAs are insufficient; tagged or other span-aware models are candidates. For `TargetResult`, a target operational model may be required. For a pattern containing an unrestricted backreference where no complete formal decision procedure has been adopted, the correct response to a demand for universal proof is not “run more fuzzing”; it is **unsupported for proof**, perhaps accompanied by separately labeled bounded or empirical evidence. This implements the distinction already established by Research Intelligence between proof and counterexample-oriented validation.

**Target capability planning is an important counterexample to automata-centric architecture.** STRling's Fourth Edition capability module extracts target-neutral requirements such as lookahead/lookbehind, named capture, backreference, Unicode property semantics, atomic groups, repetition modes, anchors, and case matching, and then compares those requirements against a target profile. It also consumes structural facts such as lookbehind-length classification. No DFA adds value to most of that query. This is exactly why “canonical automaton” is the wrong abstraction boundary.

## Recommended staged portfolio, shared facts, and caches

The recommended architecture is a **canonical semantic core, reusable fact lattice, property-specific view factory, and budgeted dispatcher**.

It should look conceptually like this:

```text
Frontend(s)
    │
    ▼
Canonical Semantic IR
    │
    ├── Foundational semantic facts
    │     nullability, width, captures, references, feature envelope...
    │
    ├── Structural abstract facts
    │     first/leading predicates, progress, local overlap, reachability...
    │
    ├── Target-neutral semantic requirements
    │
    └── Analysis Dispatcher
          │
          ├── Residual view
          │     Brzozowski / Antimirov / symbolic derivatives
          │
          ├── Automata view
          │     Thompson NFA / SFA / DFA / lazy DFA
          │
          ├── Relation algorithms
          │     antichain / bisimulation / ambiguity
          │
          ├── Result/operational view
          │     tagged automata / span semantics / search tree
          │
          ├── Constraint view
          │     specialized constraints / SMT / bounded symbolic execution
          │
          └── Empirical view
                concrete target / differential / fuzz-assisted
```

The crucial invariant is:

> **All arrows point outward from Semantic IR and certified facts. None of the derived views can redefine Semantic IR.**

This mirrors Research Intelligence's Semantic IR recommendation that target-independent meaning belongs in canonical Semantic IR while derived analyses, capability requirements, and target-relative planning remain recomputable information outside it. It also matches the current Fourth Edition implementation, where structural analysis checks that the foundational fact store belongs to the exact semantic program rather than silently recomputing or accepting mismatched facts.

**The dispatcher contract should be explicit rather than inferred from method names.** A suitable conceptual API is:

```text
AnalysisRequest {
    property:            Property
    observation:         ObservationRelation
    semantic_profile:    SemanticProfile
    target_scope:        TargetNeutral | TargetProfile | TargetProfileSet
    guarantee:           Proof | Counterexample | SoundApproximation | Evidence
    budget:              AnalysisBudget
    explanation:         ExplanationRequirement
}
```

`ObservationRelation` should at minimum distinguish:

```text
Language
WholeMatchSpan
Captures
MatchResult
SearchBehavior
CapabilityRequirements
PortabilityBehavior
```

The semantic profile must pin down any semantics that can affect the result: character domain, Unicode interpretation/version where relevant, case behavior, anchor/newline behavior, matching/search policy, and whatever result-disambiguation contract STRling eventually makes normative. Research Intelligence's equivalence work establishes why this is necessary: “equivalent” without the observation relation and semantic profile is underspecified.

An analyzer then publishes a machine-readable capability descriptor such as:

```text
AnalyzerDescriptor {
    supported_features
    supported_observations
    semantic_profile_constraints
    target_scope
    guarantee_kind
    expected_cost_model
    witness_capabilities
    certificate_capabilities
    explanation_capabilities
}
```

The dispatcher first evaluates **entitlement**, then cost. It must never select an algorithm because it is fast if that algorithm does not model the requested observable.

A representative selection policy would be:

```text
1. Consult already-certified shared facts.
2. If they decide the query exactly, stop.

3. Remove analyzers whose semantic envelope does not cover the request.
4. Remove analyzers whose guarantee is weaker than requested.
5. Rank remaining analyzers by:
      expected latency,
      reusable cached state,
      witness/proof requirements,
      explanation quality,
      target neutrality preference.

6. Run the cheapest entitled exact/sound analyzer.
7. Escalate only if its result is Unknown and the remaining budget permits.

8. Use bounded or empirical analyzers only when:
      a) the caller explicitly permits evidence-only results, or
      b) they are searching for a refuting witness whose validity can
         be checked concretely.

9. Never convert absence of a witness into proof unless the search
   procedure was complete for the declared model/domain.
```

This is a **portfolio dispatcher**, but not an opaque racing portfolio. Solver portfolios sometimes race strategies because all participants solve the same logical problem. STRling has a more fundamental issue: its analyzers can model different semantics. Therefore eligibility filtering must precede performance ranking.

**Shared reusable facts should be richer than today's minimum, but remain representation-neutral.** Recommended fact families are:

| Reusable fact | Why it should be shared | Typical consumers |
|---|---|---|
| Canonical semantic program identity and subtree semantic fingerprints | Cache/invalidation foundation | Every analyzer |
| Contract/specification/Unicode-data versions | Prevent semantically stale cache reuse | Character, target and relation analyses |
| Node feature/envelope classification | Allows fast entitlement test | Dispatcher |
| Nullability | Ubiquitous compositional prerequisite | derivatives, Thompson construction, width, safety |
| Minimum/maximum consumption and length class | Cheap and reusable | lookbehind planning, search pruning, witnesses |
| Symbolic first/leading consumed predicate | Cheap necessary-condition reasoning | overlap, dead branch, safety, witness ordering |
| Optionally symbolic last/follow predicates | Useful for suffix/follower reasoning | overlap, safety, containment pruning |
| Progress class for repetition | Avoid repeated zero-progress reasoning | safety/search |
| Capture definitions and references | Required semantic metadata | tagged/search/constraint layers |
| Backreference resolution graph | Makes the non-regular boundary explicit | dispatcher, SMT/BSE |
| Assertion kind/direction/polarity | Eligibility and capability input | derivatives/SFA/search/capability |
| Lookbehind width classification | Shared structural fact | target capability/legalization |
| Boolean/operator feature flags | Enables derivative/SFA dispatch | relation analyzers |
| Source/provenance mapping per semantic node | Human explanation | every user-facing analyzer |
| Target-neutral semantic requirements | Keeps portability separate from language automata | capability planning |

Many of these already exist partially in Fourth Edition. `SemanticFacts` contains stable node-indexed nullability, consumption and capture/reference data; `StructuralFacts` contains leading consumption, length, repetition progress, and overlap information; the capability evaluator then consumes certified facts rather than inventing competing semantics.

What should **not** become a generic shared semantic fact is an analyzer-specific internal object such as “DFA state 428,” “Z3 formula #17,” or “derivative expression after prefix `abc`.” Those are derived artifacts. They can and should be cached, but their identity is tied to a specific analyzer/version/profile.

A robust derived-artifact cache key should contain, conceptually:

```text
semantic program or subtree fingerprint
+ contract/specification version
+ Unicode/property database version
+ semantic profile
+ observation relation
+ analyzer ID and algorithm/version
+ target profile version, when target-relative
```

A result produced with a limited budget also needs budget provenance. In particular, an `Unknown(StateLimitExceeded=10_000)` must not be reused as though it were the result of a later 1,000,000-state request. Its explored frontier may be reusable as an accelerator, but its epistemic conclusion is not.

This is where rustc's query architecture is a useful precedent. Rust compiler queries are demand-driven and memoized, and incremental compilation tracks dependencies so that changes invalidate downstream computations rather than indiscriminately rebuilding every derived result. STRling can take the same architectural lesson without copying rustc's implementation: **analysis should look like pure keyed queries over canonical semantics, with dependency-aware cache invalidation**.

Incremental reuse should occur at three levels.

**Fact-level reuse** is the highest-value and lowest-risk. Editing one alternative should not require recomputing nullability or capture facts for unrelated semantic subtrees if their semantic fingerprints are unchanged.

**Representation-level reuse** retains residuals, NFA fragments, canonical symbolic predicates, DFA caches, or constraint fragments for unchanged subtrees. Lazy DFA caches illustrate the performance value of retaining partially computed transition information, although `regex-automata` ties each cache carefully to its automaton representation.

**Relation-level reuse** can retain explored pair/frontier states for equivalence or containment when both inputs are unchanged. Once either side changes, reuse requires dependency-sensitive remapping rather than assuming state numbers remain meaningful.

STRling should therefore avoid making source-oriented `NodeId` alone the persistent incremental key unless the NodeId contract explicitly guarantees cross-edit semantic identity. A **semantic subtree fingerprint** is safer as the cache-addressing primitive; `NodeId` remains excellent for evidence/source attribution within a particular canonical program.

The architecture also benefits from one shared **symbolic character theory**. Unicode scalar ranges, built-in character classes, Unicode properties, wildcard exclusions, and case-folded classes should not be independently reimplemented in the first-set analyzer, SFA, derivatives, SMT encoder, and witness generator. Symbolic automata demonstrate the value of representing transitions by predicates, and derivative work similarly benefits from large-character-set representations.

That shared layer should provide operations such as:

```text
is_empty(predicate)
intersects(a, b)
is_subset(a, b)
difference(a, b)
partition(predicates)
choose_witness(predicate)
canonicalize(predicate)
```

Those operations become reusable across structural overlap, SFA transitions, derivative branching, antichain transition matching, and witness generation. Unicode scalability is then treated as a **cross-cutting algebra service**, not a property of whichever automaton happens to win an architectural contest.

## Refusal, unknown results, proof objects, and experimental validation

STRling needs a stricter result algebra than a conventional Boolean analyzer API.

A recommended outcome type is:

```text
AnalysisOutcome<T> =
    Proven {
        result: T,
        evidence,
        certificate?
    }

  | Refuted {
        witness,
        evidence,
        witness_validation
    }

  | Unknown {
        reason,
        partial_evidence,
        resources_consumed
    }

  | Unsupported {
        semantic_boundary
    }

  | EvidenceOnly {
        observations,
        method,
        coverage
    }
```

These categories correspond to meaningfully different epistemic states.

**`Proven`** means the selected analysis is sound and complete for the declared request and has established the proposition.

**`Refuted`** means there is a concrete counterexample to a universal property. A distinguishing string can refute containment/equivalence even if STRling lacks a complete decision procedure for the entire feature class, provided the witness itself can be validated against the intended semantics. This asymmetry—counterexamples can be decisive when proof search is incomplete—is already recognized in Research Intelligence.

**`Unknown`** means the analyzer was semantically entitled but could not decide the instance. Typical reasons include:

`StateLimitExceeded`, `MemoryLimitExceeded`, `TimeLimitExceeded`, `PredicatePartitionLimitExceeded`, `SolverUnknown`, `SolverTimeout`, `AbstractValueIndeterminate`, or `CertificateConstructionLimitExceeded`.

The existing STRling structural and safety analyses already embody this pattern in smaller form: structural overlap has explicit unknown reasons, and safety distinguishes proven findings from typed uncertainties.

**`Unsupported`** means continuing with that proof obligation would be semantically dishonest, not merely expensive. STRling should refuse a proof claim when:

| Situation | Correct behavior |
|---|---|
| Universal language equivalence is requested for an unrestricted backreference fragment and STRling has no proven complete decision procedure for it | `Unsupported(NonRegularFeatureBoundary)` |
| Capture equivalence is requested but the proposed analyzer observes only accepted language | Analyzer is not entitled; select tagged/result analyzer or return unsupported |
| Target-neutral proof is requested for behavior defined only by a particular engine/version | Require target profile or return unsupported |
| Unicode/case/newline semantics are unspecified and changing them could alter the answer | Require/pin a semantic profile; no silent default in proof artifacts |
| Proof is required but only bounded symbolic execution, fuzzing, or differential testing is available | `Unsupported(RequiredGuaranteeUnavailable)`, optionally accompanied by separate `EvidenceOnly` |
| Analyzer lacks a sound transfer/model for a construct | Do not “treat it as wildcard” or “ignore it”; return unsupported or propagate a typed abstraction `Unknown` where a sound top element exists |
| Requested result relation has no defined observation contract | Refuse the relation rather than quietly substituting language equivalence |

**`EvidenceOnly`** is especially important for fuzzing and differential analysis. A differential run that finds `"ß"` produces different capture results in two targets is valuable evidence and potentially a concrete portability counterexample. A million successful differential cases are not a proof that no difference exists. Concrete observations should therefore never share the same result variant as formal proofs.

Proof and witness capabilities should influence method choice, not just decorate the result afterward.

| Technique | Natural refutation artifact | Natural proof/certificate artifact | Explanation quality |
|---|---|---|---|
| Derivatives | Distinguishing prefix/string and residual divergence | Closed relation over residual pairs / nullability agreement | **Very high** because residuals remain regex-like |
| NFA product | Path to accepting difference state | Reachability invariant / explored product closure | High with source-node provenance |
| DFA product | Shortest distinguishing path | Complete product reachability set or isomorphism/equivalence relation | Medium–high |
| Antichain | Counterexample predecessor chain | Closed antichain/fixed-point invariant, with checker engineering | High |
| Bisimulation/up-to | Violating transition/acceptance path | **Finite bisimulation or up-to relation** | High and mathematically direct |
| SFA | Symbolic path plus model-selected Unicode scalars | Automata relation plus predicate obligations | High if predicates are rendered human-readably |
| Tagged automata | Input + differing capture/tag histories | Tagged-state relation under declared policy | **Very high for capture questions** |
| Ambiguity analyzer | Word + two parse/search derivations | Unambiguity certificate depends algorithm | **Excellent** |
| Abstract interpretation | Usually structural counterexample candidate rather than exact string | Transfer/evidence chain proving abstract fact | **Excellent for diagnostics** |
| SMT/SAT | Model assignment/string | Solver proof only where supported and retained; otherwise trusted-solver result | Medium unless mapped back to Semantic IR |
| Search semantics | Concrete path/tree showing decisions | Complete finite tree only for bounded/concrete question | **Best for why/how questions** |
| BSE | Concrete satisfying path | Bound-limited path-coverage evidence, not global proof | High |
| Concrete/differential | Concrete input/output discrepancy | None for universal claim | **Excellent concrete explanation** |
| Fuzzing | Minimized crashing/diverging/differing input | None for universal claim | High for concrete failure |

For user-facing explanations, STRling should separate the **machine certificate** from the **human narrative**. A bisimulation relation is a strong certificate but a poor direct diagnostic. A human explanation can instead say:

> “The rewrite changes the language. Input `ab` is accepted by the original because branch `A` can consume `a` and the suffix consumes `b`; no branch in the rewrite can consume the same string.”

The narrative should be generated from stable source-node provenance plus the witness/certificate, not from incidental internal state numbers.

The requested validation work should be a **prototype benchmark program**, not a benchmark claim about an implementation that does not exist.

The benchmark should compare analyzers under the same `AnalysisRequest` contract and classify each input by feature envelope and requested observable.

A good corpus has six strata:

| Corpus stratum | Purpose |
|---|---|
| **Exhaustively checkable micro-regexes** | Generate small L0 expressions over tiny alphabets; enumerate all words up to a complete finite distinguishing bound where known or compare multiple independently implemented exact methods. Establish correctness before performance. |
| **Regular state-growth families** | Include expressions known to stress determinization, subset products, derivative normalization, antichain frontiers, and coinductive congruence closure. Measure where each representation wins or collapses. |
| **Unicode/symbolic families** | Character ranges, Unicode properties, negated classes, case-folding interactions, wildcard/newline policies, and many overlapping predicates. Stress predicate partitioning independently of regex-node count. |
| **Assertion/location families** | Lookahead, fixed/variable lookbehind where meaningful, anchors and word boundaries. Separate instances supported by the formal symbolic model from target-specific semantics. |
| **Capture/disambiguation families** | Equal-language patterns with different captures, repeated captures, greedy/lazy result changes, POSIX/leftmost-greedy-style differences, ambiguity witnesses. |
| **Boundary and real-world corpus** | Backreference examples, solver-oriented probes, current STRling examples/conformance cases, and curated real patterns. Measure eligibility/refusal as well as runtime. |

The exact prototype set should be:

**Prototype A — Thompson/SFA graph substrate.** Construct a Thompson-style graph with symbolic character predicates and exact source provenance. Implement intersection emptiness, witness BFS, and antichain containment.

**Prototype B — Antimirov substrate.** Build partial derivatives over the same Semantic IR and symbolic predicate layer, then run equivalent containment/witness queries. This determines whether expression-residual locality materially beats Thompson graphs for STRling rather than assuming Antimirov is preferable from theory alone. Antimirov's finite-state bound makes it a credible candidate, but it does not settle implementation constants or downstream relation costs.

**Prototype C — Coinductive equivalence.** Implement an NFA/SFA bisimulation-up-to-congruence path and compare it against two containments and derivative residual equivalence. The Bonchi–Pous results justify this as a serious candidate rather than a theoretical curiosity.

**Prototype D — symbolic Boolean derivatives.** Evaluate Boolean-heavy expressions, Unicode predicates and the exact subset of lookaround for which STRling can establish a formal translation. Measure formula DAG size, canonicalization cost, predicate partitions, cache reuse and explanation quality. Symbolic derivative research demonstrates feasibility but not that it dominates ordinary NFA approaches on STRling's workload.

**Prototype E — result semantics.** Compare tagged automata against an explicit span/result semantics for captures and disambiguation. The criterion should not merely be speed: test whether each representation can correctly answer the result-equivalence cases STRling intends to expose and whether it can produce intelligible witnesses. Tagged-automata and modern regex semantics research show that submatch/disambiguation behavior requires explicit treatment.

**Prototype F — operational explanation.** Implement a faithful but deliberately non-optimized search/tree interpreter for a carefully defined semantic profile. Use it as an oracle for small patterns and concrete `why-no-match` explanations rather than as the default execution engine. A full backtracking-tree semantics has strong precedent as a correctness model for modern regex behavior.

**Prototype G — restricted constraint/backreference analysis.** Pick one explicitly bounded or decidable backreference fragment and encode it in a string/SMT theory. The prototype question is not “can SMT solve regex?” but “is there a practically useful STRling fragment for which this backend gives valid witnesses or complete bounded answers at acceptable cost?” Constraint-solving precedents show the value of combining automata-like constraints with SMT, but solver generality should not be mistaken for a complete regex decision procedure.

Every prototype should report the same metrics:

| Metric family | Measurements |
|---|---|
| **Semantic coverage** | eligible %, unsupported %, and reason distribution by feature envelope/observation |
| **Epistemic result** | Proven / Refuted / Unknown / Unsupported / EvidenceOnly |
| **Correctness** | disagreement with exhaustive oracle; cross-check between exact analyzers; witness replay success |
| **Latency** | median, p95, p99 across a sweep of budgets rather than one preselected product SLA |
| **Space** | peak resident memory and analyzer-specific state bytes |
| **Growth** | NFA states/edges, deterministic subsets, residuals, antichain frontier, bisimulation pairs, symbolic predicates/minterms, solver assertions/calls, tree paths |
| **Incrementality** | cold vs warm latency; cache-hit ratio; recomputation after a single semantic subtree edit |
| **Witness quality** | witness length, whether shortest under algorithm's ordering, minimization cost |
| **Certificate quality** | certificate size, independent checker time, checker complexity |
| **Explanation quality** | percentage of evidence mapped to Semantic IR/source nodes; explanation depth; absence of opaque generated-state-only diagnostics |
| **Target dependence** | target-neutral conclusions versus conclusions requiring a profile/runtime oracle |

Instead of asserting an interactive budget now, test fixed resource envelopes such as 5 ms, 20 ms, 100 ms, 500 ms, and offline/unbounded-by-product-policy runs. These are **experimental sampling points, not proposed product SLAs**. A useful analyzer for the 20 ms tier may still be unsuitable as a default if it returns `Unknown` on most realistic Unicode inputs; conversely an expensive tagged/result analyzer may be entirely acceptable as an explicit offline rewrite-verification command.

The benchmark should also measure **dispatch regret**: given all analyzer outcomes measured offline, how often did the portfolio's inexpensive cost model choose a substantially worse analyzer than the best entitled one for that query? That turns portfolio selection itself into an empirical engineering problem without weakening semantic guarantees.

## Decision framework and unresolved prototype questions

The final selection rule can be stated as a sequence of gates.

| Gate | Question | Consequence |
|---|---|---|
| **Observable** | Is STRling asking about accepted language, match span, captures, full result, search behavior, or target capability? | This excludes semantically insufficient representations before performance is considered. |
| **Semantic envelope** | Is the relevant portion L0 regular, L1 symbolic/Boolean regular, R2 result-regular, O3 operational, or N4 outside the adopted finite-state fragment? | Determines which analyzer families are entitled. |
| **Claim strength** | Does the caller require proof, a refuting witness, a sound warning, or merely empirical evidence? | Prevents bounded/fuzz/differential results from masquerading as proof. |
| **Target scope** | Is the claim target-neutral, profile-relative, or about a concrete runtime/version? | Prevents a target implementation from becoming the authority for STRling semantics. |
| **Alphabet model** | Are Unicode/property predicates large enough that explicit alphabet expansion is inappropriate? | Prefer the shared symbolic predicate layer and SFA/symbolic derivatives. |
| **Relation type** | Is this containment, equivalence, ambiguity, concrete explanation, or another property? | Chooses antichain, coinduction, ambiguity, residual, tagged or search machinery rather than generic determinization. |
| **Existing facts** | Can foundational/structural facts already settle the query? | Stop early; do not construct automata gratuitously. |
| **Expected reuse** | Will many queries share this program/profile? | May justify materializing/caching DFA or other heavier views. |
| **Budget** | Can the entitled exact method run inside the request's time/memory/state limits? | Execute, escalate, or return typed `Unknown`. |
| **Explanation** | Is a proof certificate, minimal witness, source-local structural explanation, or operational trace required? | Prefer the entitled method whose natural evidence matches the user need. |

From those gates follows a concrete default portfolio.

For **cheap target-neutral facts**, STRling should use compositional analysis/abstract interpretation over Semantic IR. This includes nullability, consumption bounds, capture/reference inventories, progress, local reachability, and conservative symbolic first/overlap facts. The existing Fourth Edition code is already evidence that this pattern can support certified facts and explicit uncertainty.

For **ordinary regular-language existential questions** such as nonempty overlap and witness finding, a Thompson- or Antimirov-derived NFA/SFA view plus direct graph/product search should be the default exact machinery. Do not determinize unless the property actually benefits.

For **containment**, prototype **antichain inclusion** as the primary exact algorithm, with symbolic transitions for Unicode and derivative-based competition for Boolean-heavy expressions. Antichains have direct precedent for avoiding explicit full determinization in inclusion/universality problems.

For **equivalence**, prototype **bisimulation/up-to-congruence** and symbolic residual equivalence side by side. Prefer whichever minimizes explored state while preserving good certificates on actual STRling workloads. Coinductive methods have strong proof-object properties; derivatives have strong source/residual explanation properties.

For **Boolean regular expressions, large Unicode predicates, and the formally supported lookaround subset**, use a symbolic alphabet and consider Boolean/symbolic derivatives or SFA relations. Do not assume symbolic derivatives dominate simply because they support complement and intersection elegantly; predicate splitting and residual normalization remain genuine costs.

For **capture/result equivalence**, ordinary language automata are not entitled. Prototype tagged automata or a specialized span/result calculus and make the exact disambiguation policy part of the model.

For **why-no-match and other priority-sensitive concrete explanations**, use cheap facts first, residual traces when only language failure matters, and a faithful search/tree model when the requested explanation is operational.

For **backreference-rich universal questions**, do not extend a finite-state analyzer with an unsound approximation and continue reporting Boolean proof results. Use conservative facts where possible, use restricted constraint/SMT or bounded symbolic execution for explicitly delimited questions, accept validated counterexamples when found, and otherwise return `Unsupported` or `Unknown` according to whether the obstacle is semantic coverage or resource exhaustion.

For **portability**, begin with semantic requirements and target profiles. Use formal relation analysis only for the portion whose target semantics can be modeled faithfully, then use differential/concrete execution to produce target-specific witnesses. Empirical agreement must remain evidence rather than proof. STRling's current capability architecture already establishes the proper separation between target-neutral requirement extraction and target-relative capability comparison.

For **full DFA and lazy DFA**, treat them primarily as cached accelerators and amortization strategies, not as mandatory analysis IRs. The fact that a mature library such as `regex-automata` combines Thompson NFA, PikeVM, one-pass, bounded-backtracking, and DFA-family engines rather than insisting on one representation is a particularly relevant engineering precedent.

For **SMT/SAT**, treat the solver as a backend for well-defined constraints, not as the semantic architecture. Solver models are excellent witness generators; complete `unsat` answers can be proofs for exact decidable encodings; timeouts, bounded encodings, and solver `unknown` results cannot support universal claims.

For **fuzzing, differential testing, and concrete execution**, treat them as an evidence plane orthogonal to formal analysis. They are valuable enough that exact analyzers should feed them candidate witnesses and empirical systems should feed minimized failures back into regressions, but neither direction should blur the proof boundary.

Several issues should deliberately remain unresolved until prototypes provide STRling-specific evidence:

| Unresolved question | Why theory alone is insufficient |
|---|---|
| **Thompson NFA or Antimirov partial derivatives as the default regular graph view?** | Both have strong formal foundations; the decisive variables are Semantic IR mapping, source provenance, Unicode predicates, cache behavior, and downstream relation workloads. |
| **Symbolic derivatives or SFA graph algorithms for Boolean/Unicode-heavy queries?** | They move cost into different places: residual normalization versus transition predicate partitioning. |
| **How much value does a cached full/lazy DFA add after antichain/coinductive relation algorithms exist?** | Depends on query repetition and real STRling state distributions. |
| **Can tagged automata express the exact capture/disambiguation contract STRling wants across its portability model?** | Result semantics must be specified before implementation convenience can decide representation. |
| **Should operational search semantics be a target-neutral STRling model, per-target models, or both?** | The answer depends on whether STRling defines its own canonical matching-selection semantics or treats target behavior as part of target profiles. |
| **What restricted backreference fragment deserves SMT support?** | A theoretically encodable fragment is not automatically useful or fast enough to justify architecture. |
| **Can Semantic IR subtree fingerprints remain stable enough for cross-edit residual/NFA caches?** | Requires implementation experiments on normalization, node identity and edit patterns. |
| **Which proof certificates are worth persisting?** | Bisimulation relations, antichain invariants and automata reachability certificates vary greatly in size and checker cost. |
| **How aggressively should witnesses be minimized?** | Shortest witnesses improve explanations but may materially increase interactive latency. |
| **How should analyzer cost be predicted?** | Regex node count alone will not predict Boolean residuals, Unicode predicate partitions, subset frontiers or solver complexity; the dispatcher needs empirical features. |
| **When should the portfolio race multiple exact analyzers versus choose one?** | Racing may improve tail latency offline but waste resources interactively; benchmark dispatch regret first. |

The resulting decision framework is therefore intentionally not “derivatives versus automata.”

It is:

> **Use Semantic IR to determine what the regex means. Use reusable abstract facts to answer cheap questions and classify the semantic boundary. Then choose the smallest property-specific representation whose modeled observables encompass the question and whose guarantee is entitled to make the requested claim. Prefer symbolic alphabets for character-domain scale, antichains/coinduction for regular relations where they avoid unnecessary determinization, tagged or result models when captures are observable, operational models when search priority is observable, constraint/bounded methods only inside their declared bounds, and concrete/differential/fuzzing as evidence rather than universal proof. Under resource exhaustion say `Unknown`; outside the modeled semantic fragment say `Unsupported`; on a verified counterexample say `Refuted`; and reserve `Proven` for analyzers that actually cover the requested semantics completely.**

That is how STRling can support many analytical techniques without acquiring many competing semantic authorities. It also answers the governing question directly:

**When STRling asks a semantic question about a regex, analytical machinery is entitled to answer only after the dispatcher has established that the machinery models the relevant feature subset and observation relation, offers a guarantee at least as strong as the requested claim, is scoped to the correct target semantics, and has completed rather than merely exhausted its budget. Algorithm selection comes after those gates, never before them.**
