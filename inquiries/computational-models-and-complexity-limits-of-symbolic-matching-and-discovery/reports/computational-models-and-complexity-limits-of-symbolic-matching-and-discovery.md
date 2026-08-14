# Execution Boundaries for Symbolic Pattern Matching and Automatic Pattern Discovery

Role: Research report
Origin: AI-assisted deep research commissioned for STRling Research Intelligence
Generated: 2026-08-14
Imported: 2026-08-14
Source verification: Partially verified
Last reviewed: 2026-08-14
Current status: Active input

## Executive conclusion and research framing

STRling is currently organized around a compiler architecture—parse to AST, compile to target-agnostic IR, then emit to target-specific regex—rather than around a generalized pattern virtual machine. Its current fluent API maps core constructs such as literals, character classes, alternation, sequencing, grouping, and quantification into IR nodes. fileciteturn9file0L2-L2 fileciteturn12file0L2-L2 Research Intelligence already contains the right architectural warning for this investigation: shared “pattern” vocabulary does **not** imply one runtime or one IR, and there is presently no evidence that a Universal Pattern Engine is the correct abstraction. fileciteturn11file0L2-L2 fileciteturn13file0L2-L2

The main finding of this investigation is stronger:

> **The useful execution boundary is not “regex versus beyond regex.” It is the point at which the semantic dependency structure of a pattern changes computational model.**

A symbolic predicate over a Unicode character, integer, token, or structured event can remain finite-state even if the alphabet is enormous or infinite; symbolic automata were developed precisely for that case, replacing explicit alphabet enumeration with predicates in a decidable background theory. citeturn14search0turn14search10 By contrast, adding equality to previously captured *substrings*, arbitrary joins among event variables, unconstrained graph topology, or executable predicates can move the problem into NP-hard search, PSPACE-hard reasoning, or even an undecidable setting without any dramatic-looking syntactic change. citeturn18academia50turn13academia13turn17academia48turn19academia48

This suggests that STRling should make **computational class a first-class compiler fact**, parallel to semantic type and target capability. Research Intelligence's existing regex-safety work has already reached the analogous conclusion for ReDoS: “safe” is not scalar; meaningful guarantees depend on pattern, operation, target engine/mode, input and pattern bounds, and resource policy, while runtime caps bound failure modes rather than proving low complexity. fileciteturn7file0L2-L2 The same principle generalizes to symbolic pattern execution.

A second foundational distinction is essential:

**Matching** asks, for a given pattern \(P\) and data \(D\), whether and how \(P\) matches \(D\).

**Discovery** asks, for data \(D\) and a hypothesis language \(\mathcal H\), to find a pattern \(P\in\mathcal H\) satisfying specified constraints.

Those can have radically different complexity even for exactly the same pattern language. A fixed DFA can scan an input in linear time, yet Gold proved that deciding whether there exists an \(n\)-state automaton consistent with finite observations is NP-complete. citeturn16search1 Angluin likewise showed that general pattern inference is effectively solvable while a restricted one-variable pattern class admits polynomial-time discovery. citeturn21search0turn21search1 Thus **“patterns from this class are cheap to execute” does not imply “patterns from this class are cheap to discover.”**

Three size measures must consequently remain separate throughout compilation and diagnostics:

\[
n = |D|,\qquad m = |P|,\qquad q = |\text{compiled execution state}|.
\]

Additional parameters matter for richer classes: \(c\) captures/registers, \(w\) window size, \(d\) structural nesting depth, \(k\) equality/relational variables, and \(\tau\) query/treewidth-like structural width.

This separation prevents one of the most common complexity misstatements. Classical NFA simulation for regular-expression membership takes \(O(nm)\) in **combined complexity**, where both pattern and input vary. Once a compiled pattern is fixed, \(m\) is constant and execution is linear in \(n\). Fine-grained lower bounds indicate that the general \(nm\) dependence cannot simply be eliminated for arbitrary regular-expression membership under standard conjectures. citeturn18academia47turn18academia48 A DFA gives linear input scanning too, but determinization can move an exponential cost into \(q\) at compile time. Research Intelligence's regex-safety report already identifies this distinction between linear subject processing and possible automaton/compiled-representation explosion. fileciteturn8file0L2-L2

The resulting architectural principle is:

> **Guarantees should be stated over both compilation and execution, and should say which variables are fixed. “Linear” without that qualification is insufficient.**

## Complexity taxonomy

The following taxonomy is the core result. It maps semantic/property classes to their natural computational models rather than attempting to force all classes through one generalized matcher.

| Pattern/property class | Appropriate model | Matching boundary | Memory / compilation boundary | Discovery consequence |
|---|---|---|---|---|
| Literals, classes, concatenation, alternation, regular repetition | DFA, Thompson NFA, derivative automaton | \(O(nm)\) generic NFA simulation; \(O(n)\) for fixed compiled pattern | NFA state proportional to compiled pattern; explicit DFA may have exponentially more states | Execution cheap does **not** imply inference cheap; consistent finite-state identification can already be NP-complete |
| Large/infinite alphabets with local decidable predicates | Symbolic DFA/NFA, symbolic derivatives | Linear number of transition steps for fixed symbolic machine, multiplied by predicate-evaluation cost | Avoids alphabet enumeration; logical predicate complexity becomes part of runtime/analysis cost | Predicate synthesis can introduce an additional constraint-search dimension |
| Intersection, complement, Boolean regular combinations | Derivatives, symbolic alternating automata, bounded DFA products | Still regular; input-linear matching is possible in specialized implementations | Boolean composition can be succinct while equivalence/emptiness becomes substantially harder; explicit state products/determinization may explode | Searching Boolean structure grows hypothesis space combinatorially |
| Finite-state transformations, regular capture/output operations | FST, symbolic FST, copyless streaming string transducer | One-pass execution for regular transductions | Output/register storage rather than purely recognition state; copy restrictions control duplication | Inferring transformations is a distinct synthesis problem, not recognition |
| Bounded lookahead/lookbehind that is still regular | Derivatives, extended symbolic FST/automata | Can retain regular/input-linear execution in defined fragments | Requires bounded retained context or derivative state | Search over assertions increases hypothesis size but need not change matching class |
| Bounded-window sequence relations and equality joins | Streaming complex-event automata + indexes/incremental relational algorithms | Efficient streaming is possible for structurally restricted joins | \(O(w)\)-like window retention plus indexes/active partial results rather than constant memory | Discovering join structure is structural search even when execution is tractable |
| Visible nesting / calls and returns | Visibly pushdown automata | One-pass structured recognition with pushdown state | Memory proportional to nesting depth rather than total input | Grammar/structure discovery is a separate, harder search problem |
| General context-free structure | Earley/CKY/GLR or deterministic parser where applicable | General recognition polynomial; Earley's original bound is cubic, with lower bounds for restricted grammar classes | Chart algorithms usually retain input-proportional tables; deterministic subclasses can do much better | Grammar induction is not implied tractable by polynomial parsing |
| PEG / prioritized backtracking grammar | Packrat or specialized PEG parser | Linear parsing can be obtained through memoization | Typically trades backtracking time for input-proportional memoization | Search over PEG structure remains independent of parsing cost |
| Local edit/alignment/weighted sequence relations | Dynamic programming, weighted automata where applicable | Usually polynomial over pattern/data/window dimensions for bounded local dependency | DP frontier/table memory; exact class depends on scoring/operator semantics | Discovery adds structural/parameter optimization on top of DP |
| Repeated-variable equality / substring backreferences | Variable-pattern DP, memory automata, CSP/SAT in bounded cases | General matching NP-complete; bounded structural parameters admit polynomial fragments | Must retain or reconstruct variable assignments/spans | Structural discovery is combinatorial unless hypothesis language is sharply bounded |
| Ordered tree patterns | Tree automata / dynamic programming | Classical ordered tree inclusion \(O(|P||T|)\) | Product-style DP table | Discovery adds tree-structure enumeration |
| Unordered tree patterns | DP plus matching/search/branch-and-bound | NP-complete generally; bounded pattern degree restores polynomial cases | Exponential dependence can move into pattern degree | Discovery inherits and amplifies combinatorial topology search |
| Acyclic/hierarchical relational patterns | Join algorithms, CQ evaluation, CSP DP | Important acyclic classes admit linear/polynomial evaluation | Index/materialization state depends on relation/window sizes | Discovering relation topology remains combinatorial |
| Bounded-treewidth relational patterns | Tree-decomposition DP / CSP | Fixed-parameter tractable families | Exponential dependence isolated in structural width \(\tau\) | Width bounds provide a useful discovery-language restriction |
| Arbitrary conjunctive/graph relational patterns | CQ/CSP search, SAT/CP, graph algorithms | General CQ evaluation and many graph matching formulations are NP-complete | Search tree may grow exponentially | Discovery is at least as hard as evaluation plus candidate-structure search |
| Rich string equations, replacement, arithmetic combinations | Specialized string solver / SMT only for known fragments | Decidable for particular fragments; small extensions cross undecidability boundaries | Solver may need exponential search or return unknown/timeout | Unrestricted synthesis must not be inferred safe from “SMT support” |
| Arbitrary host-language predicates/callbacks | General program execution | No language-level runtime/termination class unless callback is restricted | Inherits callback's memory and termination behavior | Search over arbitrary executable programs is program synthesis, not ordinary pattern discovery |

The regular core is unusually strong. Thompson-style NFA simulation gives the classical \(O(nm)\) upper bound for arbitrary regex membership, while specialized derivative work demonstrates that intersection, complement, and restricted lookaround can remain within an input-linear regular-language engine; those operators therefore should not automatically be labeled “nonregular.” citeturn18academia47turn18search13 The important distinction is between **language expressiveness** and **representation/analysis complexity**: symbolic alternating automata can compose Boolean operations with linear representation growth, yet their emptiness and equivalence problems are PSPACE-hard because that succinct representation defers the combinatorial state space rather than eliminating it. citeturn14academia24

Symbolic alphabets likewise do not themselves cause a complexity-class jump. Symbolic finite-state transducers label transitions by formulas over a background theory; composition, single-valuedness, and equivalence for important classes remain effective provided that theory has a decision procedure, and SMT is commonly used to discharge those predicates. citeturn14search0turn14search4 What changes is the cost model. A matcher that performs \(O(n)\) symbolic transitions but needs a nonconstant theorem-prover query per transition should not advertise plain \(O(n)\) RAM time. Its honest contract is closer to:

\[
T(n) = O(n\cdot \rho),
\]

where \(\rho\) bounds predicate evaluation for the selected predicate fragment. If \(\rho\) is not statically bounded, the compiler should say so.

Finite-state **transformation** deserves a separate model from recognition. Streaming string transducers make one left-to-right pass and use finitely many output variables under copy restrictions; their expressiveness coincides with regular string transformations. citeturn16search7turn16search11 Symbolic/data streaming transducers extend the idea to potentially infinite data domains and retain linear-time single-pass execution under their restrictions. citeturn16search4 For future symbolic capture, normalization, or transformation operators, this is a more appropriate theoretical baseline than stretching a boolean recognizer.

For nested structure, visible recursion is a particularly useful tractability boundary. Visibly pushdown languages let the input symbol determine push/pop behavior, yielding a robust class closed under regular-like operations while retaining decidable analysis where analogous questions for unrestricted context-free languages become much worse; inclusion for visibly pushdown automata is EXPTIME-complete rather than unmanageable through unconstrained recursion. citeturn16search8 Operationally, this gives a streaming model whose memory grows with **nesting depth**, not necessarily input length.

General context-free recognition is still decidable and polynomial, but it is no longer the same runtime class as finite-state scanning. Earley's classical parser has \(O(n^3)\) general worst-case time, \(O(n^2)\) for unambiguous grammars, and linear behavior for a significant restricted class. citeturn22search0 PEG-style grammars illustrate a different trade: packrat memoization can make prioritized backtracking linear in input, but does so by retaining memoized parse results rather than preserving finite-state memory. citeturn22search1turn22academia27 “Linear time” is therefore insufficient as a dispatch criterion; **space class matters independently**.

Relational structure is where structural width becomes more important than surface syntax. Acyclic conjunctive queries can be evaluated in linear time, while arbitrary conjunctive-query evaluation is NP-complete; bounded treewidth characterizes broad fixed-parameter-tractable query families. citeturn13search0turn17search1 In streaming complex-event recognition, recent work gives a particularly relevant positive result: hierarchical conjunctive queries combined with sequence patterns can be implemented by a streaming automaton under sliding windows with logarithmic update time and output-linear delay for equality predicates. citeturn19academia47 This is evidence that **relational operators do not automatically prohibit streaming**. Their dependency graph must be constrained.

Tree structure exposes the same frontier vividly. Ordered tree inclusion has an \(O(|P||T|)\) dynamic-programming solution, whereas unordered tree inclusion is NP-complete; bounding the out-degree of the pattern restores polynomial behavior. citeturn16search2turn16search3 This is exactly the kind of language-design boundary a symbolic pattern compiler can exploit: an innocuous-looking semantic relaxation—“sibling order does not matter”—materially changes the computational class.

Constraint programming, SAT, SMT, and CSP therefore belong in the architecture as **backends for particular classified fragments**, not as an escape hatch called “general pattern matching.” Finite-domain CSP has a deep tractability-versus-NP-completeness dichotomy depending on the constraint language, and valued CSPs show similar exact-solvability frontiers. citeturn17academia49turn17search14 SMT can elegantly combine specialized theories, and current SMT-LIB explicitly includes Unicode strings and regular expressions, but the presence of a solver API says nothing by itself about decidability or predictable runtime. citeturn19search0turn19search1

## Matching boundaries

The matching engine should treat the following as distinct execution classes rather than incremental feature levels of one VM.

**The strongest default core is symbolic regular recognition.** Literals, classes, sequencing, alternation, regular repetition, anchors, local attribute predicates, and regular Boolean operators can be represented by ordinary or symbolic automata. For an already compiled fixed automaton, a scan can be linear in input length; with the pattern variable too, general NFA simulation is \(O(nm)\). citeturn18academia47 A symbolic-derivative implementation can retain input-linear matching for richer *regular* constructs such as complement, intersection, and restricted lookarounds. citeturn18search13 This directly answers the first research question: **linear streaming should be promised to a formally defined regular/symbolic-regular fragment, not merely to “simple-looking” syntax.**

Within this core, DFA and NFA choices trade execution state against compilation state. A DFA makes the current state singular and is attractive for repeated execution of stable patterns, but determinization can be exponentially larger than the source/NFA. Symbolic automata mitigate large-alphabet enumeration but do not remove state-space complexity; even classic minimization algorithms can behave badly when naively lifted to symbolic alphabets. citeturn14search10 An NFA/derivative executor is therefore often the safer default for untrusted or one-shot patterns, while bounded/lazy DFA construction is attractive when profiling indicates repeated use and the compiler can enforce a state cap. This is an architectural recommendation consistent with Research Intelligence's existing warning that nonbacktracking execution does not remove determinization, compilation, memory, or counted-repetition hazards. fileciteturn7file0L2-L2

**Bounded repetition needs its own compile-time metric.** A source pattern can encode a large amount of execution state in a tiny numeric bound. Nonbacktracking by itself does not neutralize this: USENIX Security work demonstrated bounded quantifiers as an Achilles heel for several nonbacktracking matchers. citeturn14search6 For a future symbolic language, quantifier values therefore belong in static resource analysis independently of AST node count. A `{1,1000000000}`-like construct is computationally different from an AST of the same textual length with `{1,10}`.

**Capturing should be split into semantic recognition, selected capture reconstruction, and enumeration.** Recording a bounded number of selected span offsets need not leave the regular language class. Materializing captured content makes memory proportional to captured output unless spans can reference immutable input. Requiring **every** possible parse or every possible capture valuation is a fundamentally different output problem: ambiguity can yield many results even when yes/no recognition merges those paths efficiently. This distinction is particularly important because NFA ambiguity does not automatically imply exponential runtime under Thompson-style state-set simulation; catastrophic behavior arises when an implementation or requested semantics repeatedly explores distinguishable alternatives rather than merging equivalent execution states. Research Intelligence's current safety work makes this same engine/operation distinction for regex ambiguity and backtracking. fileciteturn8file0L2-L2

That yields the answer to the ambiguity question:

> **Ambiguity should be a compiler property with two separate effects: computational ambiguity of the execution model, and semantic multiplicity of requested results.**

For boolean recognition under state merging, ambiguity may be cheap. For priority backtracking, it may amplify work. For “all matches/all captures/all parses,” multiplicity itself can become the lower bound on runtime. Therefore a user-facing guarantee must specify whether it applies to `exists`, `first`, `best-under-deterministic-policy`, or `enumerate-all`.

**Finite-state transduction and regular transformation remain streaming but are not constant-output-memory by definition.** Copyless streaming transducers perform regular transformations in a single pass using a finite number of variables. citeturn16search0turn16search7 That is an appropriate model for transformations whose control is finite-state even when their output is linear in input size. STRling should distinguish **working state** from **output storage** when it describes memory guarantees.

**Windowed relational sequence patterns can remain streamable when dependencies are structurally constrained.** A matcher correlating events \(x,y,z\) by equality/order inside a finite window is not well modeled by an ordinary character DFA once those variables range over unbounded values. It is better viewed as a streaming relational query or complex-event automaton with indexed partial valuations. Hierarchical/acyclic relational structure is the promising tractable core; PCEA work demonstrates logarithmic update and output-linear delay for a nontrivial equality-join fragment under sliding windows. citeturn19academia47 Its memory contract should be phrased as proportional to window/index/active-result state, not “constant.”

This answers the second research question: useful nonconstant-memory classes include at least **captures/output proportional to captured material, sliding-window patterns proportional to \(w\), nested patterns proportional to structural depth \(d\), chart/packrat algorithms proportional to retained input/chart state, and relational matchers proportional to active valuations or materialized indexes.**

**Dynamic programming is the right model when a pattern relation depends on two or more positions but has reusable optimal/subproblem structure.** General context-free recognition, sequence alignment/edit-style relations, ordered tree matching, and bounded-width relational evaluation are examples where forcing the semantics into a finite automaton may cause state blowup or obscure the natural polynomial structure. Earley parsing and ordered-tree inclusion are canonical demonstrations. citeturn22search0turn16search2 This is the main “naturally polynomial” bucket: polynomial is not a failure mode; it is often the correct exact complexity for richer structure.

The clearest combinatorial boundary is **unbounded assignment of relational variables**. Pattern languages with repeated string variables have an NP-complete matching problem in general, although bounded active-variable degree and memory-deterministic fragments admit polynomial algorithms. citeturn18academia50 More elementary variable patterns are likewise NP-complete generally, while a fixed \(k\)-variable pattern can be parsed in \(O(n^k)\) time. citeturn17academia51turn21search2 Thus “capture” and “capture equality” must never be treated as equivalent computational primitives:

- capturing a span for reporting can remain finite-state/tagged;
- requiring a later span to equal an earlier **substring** introduces unbounded data memory and nonregular behavior;
- keeping the number or interaction degree of such variables fixed can recover polynomial execution;
- allowing both the number and topology of equalities to vary exposes NP-hard matching.

Recent JavaScript-regex complexity results make the danger of composition even sharper. A 2026 formal preprint proves PSPACE-hardness for JavaScript regex matching with modern combinations of backreferences and lookaround, and PSPACE-completeness for an important restricted variant. citeturn13academia13 That should be read as a language-design warning: individually understandable operators can create a complexity class far beyond their surface appearance when they share captures, repetition, assertion context, and nondeterministic choice.

Tree and graph operators have analogous boundaries. Ordered tree matching has polynomial DP; forgetting order can produce NP-completeness. citeturn16search2 Relational graph patterns corresponding to acyclic CQs are easy to evaluate relative to arbitrary CQs, while bounded treewidth provides a broad parameterized tractability frontier. citeturn13search0turn17search1 A pattern compiler therefore should measure the constraint/query hypergraph—not just count operators.

SAT, CSP, CP, and branch-and-bound are appropriate **after** this classification. They are especially suitable when a finite set of variables must choose among bounded positions, labels, graph nodes, or structural alternatives. They should be planned as exact combinatorial engines with explicit budgets, not advertised as polynomial matching. Treewidth/acyclicity analysis can first divert tractable instances to dynamic programming or join algorithms; only the residual combinatorial class should reach generic search. CSP research's tractable “islands” reinforce that distinction. citeturn17search13turn17academia49

SMT should be even more tightly gated. It is highly appropriate when symbolic predicates naturally live in arithmetic, bit-vector, regular-language, or other supported theories; Z3, for example, combines specialized decision engines, including symbolic-derivative techniques for regex reasoning. citeturn19search0 But string-theory boundaries show why a generic `SMT_MATCH` fallback would be unsafe. Straight-line string constraints with regular replacement patterns have important decidable fragments, while allowing variables in replacement patterns or adding certain length constraints crosses into undecidability in that setting. citeturn17academia48 Even a quantifier-free theory combining string equations, linear length arithmetic, and string-number conversion has been shown undecidable. citeturn19academia48

The ultimate boundary is arbitrary executable predicates. If a symbolic transition may call host-language code whose termination and resource usage are unconstrained, the pattern language inherits the host program's termination problem. Static complexity classification can then at best say **unknown/external** unless the callback is supplied with a verified totality and cost contract. Such callbacks should never be admitted into an “unrestricted safe matcher” merely because the surrounding control structure is finite-state.

## Discovery boundaries

Discovery must be architecturally separated from matching because it quantifies over patterns:

\[
\exists P\in\mathcal H:\; \operatorname{Acceptable}(P,D).
\]

Even when `Acceptable` is a linear matcher, \(\mathcal H\) may be exponentially large.

For a finite hypothesis set \(\mathcal H\), brute-force discovery gives the simple upper bound

\[
O\!\left(|\mathcal H|\cdot T_{\text{match}}\right)
\]

plus scoring/validation costs. This guarantees decidability, but **bounded does not mean tractable**: a size-\(b\) structural grammar can contain exponentially many patterns in \(b\). Memoization, shared automata, incremental evaluation, pruning, SAT encodings, or branch-and-bound can dramatically reduce actual work without changing that worst-case combinatorial fact.

Gold's automaton-identification result is the cleanest demonstration of the matching/discovery divide: deciding whether there is an \(n\)-state finite automaton consistent with finite data is NP-complete even though executing a given DFA is elementary. citeturn16search1 Angluin's pattern-language work gives the complementary positive result: general descriptive-pattern inference is effectively solvable, while restricting the hypothesis class to one-variable patterns gives a polynomial-time algorithm. citeturn21search0turn21search1 The design lesson is that the **hypothesis-language bound itself is a complexity feature**.

Discovery complexity should therefore be classified along at least four independent axes.

First is **structural choice**: which sequence, alternation, repetition, tree edge, relation, or graph topology exists in the candidate. This is the principal source of combinatorial candidate growth.

Second is **parameter assignment**: thresholds, bounds, symbols, attribute predicates, variables, or weights. A parameter may be optimizable by DP or convex/numeric methods in one semantics and require SAT/SMT/CP in another; this report does not select weighting semantics, but the computational distinction must be represented.

Third is **latent correspondence**: deciding which locations/events/tree nodes/graph nodes instantiate each symbolic variable. Variable-pattern matching already becomes NP-complete in the general case. citeturn17academia51 Discovery that must simultaneously choose the pattern *and* its correspondences therefore compounds two searches unless structure permits factorization.

Fourth is **negative/relational constraints**. Complementing a regular language does not leave regularity, but searching for combinations of inclusion, exclusion, joins, equalities, and ordering can make synthesis behave like constraint solving. Succinct Boolean automata underline the distinction: composition can be representationally cheap while semantic analysis is PSPACE-hard. citeturn14academia24

This implies the following discovery taxonomy.

| Discovery hypothesis class | Computational treatment | Execution policy |
|---|---|---|
| Finite literal/class templates with fixed topology | Enumeration, dynamic programming, indexing | Safe default when hypothesis count is statically bounded |
| One-variable or otherwise formally tractable pattern classes | Specialized polynomial algorithms | Safe default within certified fragment |
| Finite-state structure with bounded state count | SAT/SMT/automata-learning formulation, branch-and-bound | Budgeted; consistency/minimization can be NP-hard |
| Fixed \(k\) substring variables | Parameterized enumeration/DP | Accept with explicit \(k\) and input bounds |
| General repeated-variable structure | CSP/SAT/search | Opt-in combinatorial execution only |
| Acyclic/bounded-treewidth relational pattern topology | Structured DP/join-based synthesis where available | Preferential tractable/parameterized path |
| Arbitrary relational/graph topology | CP/SAT/branch-and-bound | Hard-budgeted only |
| General recursive grammar structure | Grammar-search/synthesis engine | Separate subsystem, not normal matcher |
| Rich SMT string formulas | Only declared decidable fragments | Fragment-gated; solver budget mandatory |
| Arbitrary programs/predicates | Program synthesis | Outside ordinary pattern discovery unless sandboxed and explicitly bounded |

The key point is not that discovery should avoid SAT, SMT, CP, or branch-and-bound. On the contrary, these are appropriate discovery technologies. The point is that they describe **a different execution contract**: search may be exponential, “no answer found before budget” is not equivalent to unsatisfiable, and optimization may terminate with a feasible candidate but without proof of optimality.

Approximation belongs mostly on this side of the boundary. Approximation or heuristic pruning can make discovery usable when exact hypothesis search is prohibitive, but the result must be reported as incomplete or approximate. For matching, approximation is legitimate only when approximate matching is itself part of the declared semantics; silently approximating an exact boolean matcher changes the language recognized. In relational systems, approximation by tractable acyclic/bounded-width queries is an established response to otherwise difficult exact queries, illustrating the general technique. citeturn13search3

Incrementality similarly changes **amortized workload**, not semantic complexity class. Relational systems have long maintained materialized results through deltas instead of complete reevaluation, including queries with joins, aggregation, recursion, and negation, and later work generalizes incremental view-maintenance techniques to richer query languages. citeturn18search15turn18search0 A discovery engine can exploit the same idea when nearby candidates share subcomputations or when data evolves incrementally. It should be understood as an execution optimization over an already classified problem, not evidence that the hypothesis space itself has become polynomial.

Memoization is analogous. Packrat parsing converts potentially repeated parsing work into linear-time recognition by storing prior results. citeturn22search1 For search and symbolic matching, memoization can collapse repeated subproblems, but its memory footprint becomes part of the execution contract. The appropriate compiler question is therefore not “does memoization make this safe?” but “what state key is memoized, how many distinct keys can exist under the declared bounds, and what happens at the memory cap?”

This suggests a strict discovery contract:

\[
\text{DiscoveryResult} =
(\text{candidate},\;
 \text{complete?},\;
 \text{optimal?},\;
 \text{search bound},\;
 \text{resources consumed},\;
 \text{unexplored remainder}).
\]

A budget-exhausted discovery must never be returned as “no pattern exists.” Similarly, a branch-and-bound solver may claim optimality only after the relevant bound closes; otherwise it returns a best-so-far candidate with incomplete status.

## Static complexity, ambiguity, and resource policy

A compiler cannot infer exact asymptotic behavior for every sufficiently expressive language, but it can infer a surprisingly useful **computational signature** before execution.

For every pattern, the analysis pass should derive something close to:

```text
ComputationalSignature {
    semantic_family
    pattern_size
    expanded_size_bound
    automaton_state_bound
    predicate_theory
    predicate_cost_class

    streamable
    max_lookaround
    max_window
    stack_depth_bound

    capture_count
    equality_variable_count
    active_variable_degree

    relational_hypergraph
    acyclic
    treewidth_bound

    ambiguity_class
    result_multiplicity_bound

    compilation_time_class
    compilation_space_class
    matching_time_class
    matching_space_class

    discovery_hypothesis_bound
    discovery_complexity_class

    decidability_status
    completeness_status
    proof_basis
}
```

The `semantic_family` is the first dispatch fact: regular, symbolic-regular, finite-state transduction, visibly pushdown, context-free/PEG, relational sequence, tree, graph/CSP, variable/string-equation, solver fragment, or external-program. This classification should occur on canonical semantic IR rather than on emitted regex text, aligning with STRling's existing architecture in which semantic authority and analysis belong before target-specific lowering. fileciteturn14file0L2-L2

`expanded_size_bound` is critical because source size can understate compiled size. Counted repetitions and Boolean/product constructions are prominent examples; Research Intelligence already identifies compile-time expansion and determinization as separate denial-of-service surfaces. fileciteturn8file0L2-L2 Hard state limits should therefore apply **before** the compiler eagerly constructs a large DFA or expands a bound.

For relational patterns, the analyzer should build a variable/constraint hypergraph. Acyclicity and bounded treewidth are not cosmetic metrics: they separate major tractable query families from general NP-complete evaluation. citeturn13search0turn17search1 For variable/backreference patterns, analogous parameters such as active-variable degree have proven computational meaning; keeping that parameter bounded yields polynomial matching fragments. citeturn18academia50 Static complexity therefore benefits from structural metrics rather than a flat list of “dangerous features.”

For symbolic predicates, the compiler should record the **theory fragment**, not merely “uses SMT.” SMT-LIB's current Strings theory combines Unicode strings and regexes with integer reasoning, but individual combinations of operations and theories have different decidability properties. citeturn19search1 An analyzer should identify, for example, whether a formula is finite-domain, pure Boolean, quantifier-free linear arithmetic, regular membership, a known straight-line string fragment, or outside the compiler's certified solver envelope. Crossing from a certified fragment to an unrestricted one should change the static status from a guaranteed class to `solver-dependent` or `undecidable/unsupported`, not merely add a warning.

`ambiguity_class` should be operation-relative. The compiler should distinguish at least:

**Recognition ambiguity:** multiple internal paths reach equivalent recognition state. Thompson NFA execution can merge these.

**Priority ambiguity:** the semantics require a specific precedence such as ordered choice, leftmost, or another deterministic resolution; the engine must preserve that policy.

**Capture ambiguity:** multiple span assignments exist for a successful recognition.

**Enumeration ambiguity:** the caller explicitly requests every result.

This matters because the same pattern can have linear boolean recognition while producing an enormous result set if all derivations or all variable assignments are requested. The runtime guarantee must therefore include output sensitivity. A useful form is

\[
T = O(f(n,m,k,\ldots) + |\text{output}|),
\]

where appropriate, rather than pretending enumeration has the same cost as existence.

### Resource budgets should be multidimensional

Time limits alone are insufficient. Research Intelligence's existing safety analysis correctly treats timeout/step limits as resource caps rather than complexity proofs. fileciteturn7file0L2-L2 A generalized execution governor should have separate hard budgets for at least:

| Stage/resource | Representative budget |
|---|---|
| Source/IR compilation | AST nodes, encoded numeric magnitude, normalization steps |
| Automata compilation | NFA states, DFA states, symbolic partitions, derivative states |
| Predicate reasoning | solver time, conflicts/decisions, memory, generated clauses |
| Matching | input items, transition steps, DP cells, backtracking/search nodes |
| Streaming | retained window bytes/items, active partial matches, index entries |
| Nesting | pushdown/recursion depth |
| Captures | retained span/value bytes, number of valuations |
| Relational search | assignments, join intermediate cardinality, decomposition width |
| Enumeration | result count and total result bytes |
| Discovery | hypothesis nodes, candidates, solver calls, branch nodes |
| Global | CPU, wall time, memory, cancellation/deadline |

Resource exhaustion must be an explicit outcome:

```text
MATCH
NO_MATCH
RESOURCE_EXHAUSTED
UNSUPPORTED_FRAGMENT
INDETERMINATE
```

For discovery, the outcome model additionally needs `INCOMPLETE` and, where meaningful, an optimality certificate/gap. Treating resource exhaustion as `NO_MATCH` would be semantically incorrect and can become a security problem; Research Intelligence makes the same warning about regex limits and observable match outcomes. fileciteturn8file0L2-L2

### Rejection should be stronger than warning at defined boundaries

A compiler should **reject unrestricted execution**, rather than merely warn, when one of the following is true:

| Condition | Recommended disposition |
|---|---|
| The requested operation falls into a known undecidable fragment | Reject exact unrestricted operation |
| A transition invokes arbitrary unverified host code but the API promises termination/complexity guarantees | Reject guaranteed mode; require explicit external/sandboxed mode |
| A static lower bound or required compilation expansion already exceeds a hard configured resource limit | Reject before compilation/execution |
| Exact discovery has no finite hypothesis bound | Reject normal discovery mode until a structural/size/resource bound is supplied |
| The selected backend is incomplete for the requested logic but the caller requests a proof of unsatisfiability/completeness | Reject that backend/claim |
| Enumeration is statically known to violate a hard output policy | Reject or require a bounded-result operation |
| A target lowering would destroy the computational guarantee promised at source level | Reject that target plan or change the declared guarantee before execution |

A pattern should instead be **warned but executable under hard budgets** when it is decidable yet high-cost: a polynomial DP with large dimensions, a fixed-parameter plan with a large parameter, a small NP-hard CSP instance, a bounded graph pattern, a solver-backed formula in a supported but unpredictable fragment, or a discovery search with a finite but large hypothesis space.

Default unrestricted execution should be reserved for patterns whose compiled execution plan has a proven or conservatively bounded resource class acceptable under platform policy.

This is more defensible than a binary safe/unsafe diagnostic and extends the multidimensional safety model already recommended in Research Intelligence. fileciteturn7file0L2-L2

## Analysis-dispatch architecture

The runtime architecture should be a **portfolio planner behind a common semantic contract**, not a single generalized matcher.

A suitable pipeline is:

```text
                     Canonical Semantic IR
                              │
                              ▼
                 ┌─────────────────────────┐
                 │ Computational Classifier│
                 │ + Static Cost Analysis  │
                 └────────────┬────────────┘
                              │
                  ComputationalSignature
                              │
                              ▼
                 ┌─────────────────────────┐
                 │   Execution Planner     │
                 │ model + algorithm choice│
                 └────────────┬────────────┘
                              │
        ┌─────────────────────┼──────────────────────────────┐
        │                     │                              │
        ▼                     ▼                              ▼
  Finite-state           Structured/DP                Constraint/Search
  engines                engines                      engines
        │                     │                              │
  DFA/NFA/derivative     VPA / parser                 CSP / SAT / SMT
  symbolic automata      sequence DP                  graph search
  FST/SST                tree DP                      branch-and-bound
        │                 relational joins                  │
        └─────────────────────┼──────────────────────────────┘
                              │
                              ▼
                    Runtime Resource Governor
                              │
                              ▼
                Match / Discovery Result Contract
```

The **finite-state lane** should handle regular and symbolic-regular recognition. For one-shot/untrusted patterns, Thompson/tagged NFA or derivative execution avoids eager determinization blowup; for repeatedly reused patterns where state estimates are safe, bounded DFA construction can trade compilation memory for faster transition dispatch. Symbolic automata should be selected when large or infinite alphabets are naturally described by predicates, with predicate-theory cost carried into the plan. Symbolic automata and transducers are explicitly designed for this setting. citeturn14search0turn14search10

The same lane should have a distinct **finite-state transducer** mode for regular transformations rather than pretending transformation is a side effect of recognition. Copyless SST/SFT-like plans are especially attractive when a future operator's semantics are naturally single-pass transformations. citeturn16search7turn14search0

The **structured/DP lane** should own patterns whose state fundamentally depends on positions or nested structure. General CFGs go to chart parsing; deterministic grammar classes can receive faster specialized parsers. PEG semantics, when intentionally chosen, can dispatch to packrat subject to the corresponding memory contract. citeturn22search0turn22search1 Visible nesting should receive VPA-style execution rather than a general grammar engine. citeturn16search8 Ordered tree patterns should use tree DP. citeturn16search2 Approximate/local sequence relations should use a DP or weighted-automata lane where their semantics support it.

The **relational lane** should inspect acyclicity and width before choosing an algorithm. Hierarchical/acyclic patterns should use streaming or indexed joins, possibly incrementalized. Bounded-treewidth patterns should use decomposition-based DP. Only structurally unrestricted residual queries should fall through to generic CSP/search. The CQ literature makes this dispatch theoretically meaningful rather than merely heuristic. citeturn13search0turn17search1 Streaming equality correlations within bounded windows can use a specialized complex-event engine rather than invoking a general solver for every incoming event. citeturn19academia47

The **constraint/search lane** should contain several backends, selected according to structure rather than preference:

SAT is appropriate for bounded Boolean/discrete structural choices.

CSP/constraint programming is appropriate for finite-domain relational assignments and global constraints.

SMT is appropriate when arithmetic, bit-vector, regular-string, or another certified logical theory is semantically natural. citeturn19search0turn19search1

Branch-and-bound is appropriate when exact optimization over a combinatorial candidate set is required and useful objective bounds are available.

Specialized parameterized DP should be preferred over all of those when a fixed \(k\), treewidth, pattern degree, or similar measure puts the problem in a tractable fragment. Backreference matching and unordered-tree matching both provide concrete examples where bounding the right structural parameter materially improves complexity. citeturn18academia50turn16search2

Crucially, **constraint solving should be a planner target, not part of the language's abstract semantics**. That prevents solver implementation details from becoming accidental user-visible semantics and allows future solver replacement.

Matching and discovery should then share the classifier and low-level engines but have separate planners:

```text
MATCH PLAN
P + D
  → classify P
  → choose exact execution model
  → execute under match budget

DISCOVERY PLAN
H + D
  → classify hypothesis language H
  → derive search-space / parameter bounds
  → choose enumeration / DP / SAT / CSP / SMT / B&B
  → invoke match/constraint kernels as subroutines
  → return candidate + completeness status
```

This separation is important because discovery should be allowed to use a SAT/CP representation of candidate structure even when the candidate, once found, compiles to a tiny DFA. Gold's automaton-identification result proves that this asymmetry is not exceptional; it is fundamental. citeturn16search1

Incremental algorithms should be treated as an **execution dimension orthogonal to semantic family**. A stable compiled regex can maintain stream state incrementally; a relational query can maintain materialized views through deltas; a discovery engine can cache validation results shared among neighboring hypotheses. Incremental view-maintenance literature demonstrates that sophisticated query computations can be transformed into update-oriented programs, including rich relational operators and recursion. citeturn18search15turn18search0 The planner should therefore expose `batch`, `streaming`, and `incremental` as plan modes, not define separate pattern languages for each.

The dispatch result should carry its reason:

```text
engine = SYMBOLIC_NFA
because:
  semantic_family = REGULAR
  alphabet = SYMBOLIC
  determinization_state_upper_bound > policy.dfa_states
  captures = 2 offsets
  no substring equality
  no enumeration
guarantee:
  match_time = O(n * q * predicate_cost)
  working_memory = O(q + captures)
  complete = true
```

or:

```text
engine = CSP_BRANCH_AND_BOUND
because:
  semantic_family = RELATIONAL_GRAPH
  variables = 14
  query_acyclic = false
  treewidth_bound = unknown
  exact matching is combinatorial
guarantee:
  complete_if_budget_not_exhausted = true
  polynomial_bound = none
  search_nodes_max = 1_000_000
  on_exhaustion = RESOURCE_EXHAUSTED
```

That kind of explanation turns static complexity analysis into useful compiler intelligence rather than a generic warning.

## Language-design constraints and user guarantees

The strongest language-design recommendation is to preserve a **large tractable default core and make complexity-class transitions syntactically or type-system visible**.

A future symbolic pattern language can remain substantially more expressive than conventional regex without losing analyzability if it follows several boundaries.

**Keep local symbolic predicates local.** Predicates over the current symbol/event can be very expressive while remaining compatible with symbolic automata, provided the predicate theory is decidable and has a declared cost model. Symbolic automata show that large or infinite alphabets themselves are not the problem. citeturn14search0 Cross-position references should be a distinct operator family.

**Separate captures from equality constraints.** A capture used for output and a captured value used as an unbounded equality variable have different formal consequences. General backreference matching is NP-complete, while restricted variable-degree fragments are polynomial. citeturn18academia50 This boundary should be obvious in IR and diagnostics.

**Make all expensive dimensions explicit.** Repetition magnitude, lookaround extent, window width, nesting depth, relation-variable count, graph-pattern size, output cardinality, and discovery hypothesis size should be bounded either statically or by an execution policy. Counted repetition is already known to create nontrivial hazards even in nonbacktracking matchers. citeturn14search6

**Prefer visible recursion over unrestricted recursion when streaming analysis is a goal.** Call/return or open/close structure fits visibly pushdown machinery and preserves stronger decidability properties than general grammar mechanisms. citeturn16search8 General CFG support may still be valuable, but it should cross into a distinct parser execution class with different time/space guarantees.

**Require structural restrictions for first-class relational streaming.** Acyclic/hierarchical joins, bounded treewidth, and finite windows provide defensible tractability parameters. citeturn13search0turn17search1turn19academia47 Arbitrary graph-shaped relational patterns should be explicitly classified as combinatorial rather than allowed to masquerade as a slightly richer sequence matcher.

**Do not expose arbitrary SMT formulas as ordinary predicates.** Expose certified predicate fragments and classify them by theory. “SMT-capable” is not a guarantee: string constraints exhibit decidable straight-line fragments and nearby undecidable extensions. citeturn17academia48turn19academia48 A general escape hatch can exist, but it should carry `solver-dependent`/`unknown` guarantees and hard resource limits.

**Do not allow unrestricted host callbacks in guaranteed modes.** A user-defined predicate may be useful, but once it is arbitrary code the compiler can no longer own termination or complexity. A guaranteed execution mode should accept only pure/total callbacks with a trusted cost contract, a restricted expression language, or a sandboxed budgeted execution model.

**Treat “enumerate all” as a separate high-cost operation.** Existence, one deterministic match, top-\(k\), and exhaustive enumeration should not share a complexity label. Output-sensitive limits must be explicit.

**Keep discovery hypothesis languages bounded by construction.** A discovery request should declare maximum structural size/state count, variable count, relation width, quantifier bounds, or an equivalent finite grammar/budget. Otherwise the normal discovery API should reject it rather than silently launch open-ended synthesis. The historical separation between polynomial one-variable pattern discovery and NP-complete finite-automaton identification demonstrates why the bound must be language-specific. citeturn21search0turn16search1

**Make approximation opt-in and semantic.** Approximate search is an appropriate way to obtain useful discovery candidates or tractable relational approximations, but it must not silently replace exact matching. citeturn13search3

From those restrictions, STRling can expose useful guarantees without claiming more than theory supports:

| User-facing execution class | Meaning |
|---|---|
| **Fixed-plan stream-linear** | After bounded compilation, execution makes \(O(n)\) input progress for fixed compiled plan; constant factors/state size are reported separately |
| **Symbolic stream-linear** | Linear number of streaming transitions, with separately declared predicate-theory cost |
| **Depth-bounded streaming** | One-pass execution with memory proportional to current structural nesting depth |
| **Window-bounded streaming** | Streaming execution with memory/index state explicitly proportional to configured window and active results |
| **Polynomial combined** | Compiler has a polynomial bound in pattern and data dimensions; exponent/major parameters are exposed |
| **Parameterized tractable** | Cost is polynomial in data for fixed declared parameter \(k,\tau,d,\ldots\); the parameter value is shown |
| **Output-sensitive** | Runtime includes the number/size of emitted matches, captures, parses, or discovered candidates |
| **Combinatorial, budgeted** | NP-hard/search-based plan; no polynomial guarantee; hard budget and exhaustion semantics are mandatory |
| **Decidable solver fragment** | Exact solver-backed operation in a specifically certified logical fragment; solver resource cap remains explicit |
| **Unknown / target-dependent** | Compiler cannot establish a portable complexity guarantee; target/runtime evidence may refine but not erase that fact |
| **Rejected unrestricted** | Undecidable, unbounded, unsupported, or incompatible with the requested guarantee/resource policy |

The wording of **fixed-plan stream-linear** is intentional. It avoids claiming that arbitrary pattern compilation is linear or that DFA state size is harmless. General regex membership still carries essentially \(nm\)-type combined complexity, and symbolic/Boolean automata can trade compact syntax for difficult state-space analysis. citeturn18academia47turn14academia24

The practical tractability map is therefore:

| Zone | Pattern capabilities | Recommended status |
|---|---|---|
| **Tractable core** | Regular/symbolic-regular sequence recognition; restricted regular lookaround/intersection/complement; finite-state/copyless regular transduction; bounded local capture reporting | Default execution |
| **Tractable with explicit memory parameter** | Sliding windows, visible nesting, bounded retained captures, incremental relations | Default when window/depth/resource contract is explicit |
| **Polynomial structured extensions** | General CFG parsing, ordered-tree DP, local alignment/DP, acyclic relational evaluation | Supported as separate execution class |
| **Parameterized extensions** | Fixed-\(k\) variable patterns, bounded active-variable degree, bounded-degree unordered trees, bounded-treewidth relational patterns | Supported with parameter visible in guarantee |
| **Expensive but bounded** | General CSP/SAT/CP instances, graph relations, finite-state synthesis, general repeated-variable matching, large finite discovery spaces | Opt-in, hard-budgeted |
| **Dangerous combinations** | Repeated substring equality + unrestricted nondeterminism/repetition; unrestricted graph joins; Boolean/state explosion + huge counts; exhaustive ambiguity; rich cross-theory string constraints | Static escalation, often bounded-only |
| **Unrestricted rejection boundary** | Known undecidable solver combinations; arbitrary nonterminating callbacks under guaranteed mode; unbounded exact discovery; statically impossible resource requirements | Reject rather than warn |

Several combinations deserve explicit compiler escalation because they materially change the class rather than merely the constant factor:

\[
\text{capture} + \text{substring equality}
\quad\Rightarrow\quad
\text{finite-state reporting} \to \text{variable-memory / NP-hard general matching},
\]

supported by the backreference complexity results. citeturn18academia50

\[
\text{ordered tree} + \text{order-insensitivity}
\quad\Rightarrow\quad
O(|P||T|) \to \text{NP-complete general case},
\]

as shown for tree inclusion. citeturn16search2

\[
\text{acyclic relational joins} + \text{arbitrary cyclic topology}
\quad\Rightarrow\quad
\text{linear/polynomial tractable core} \to \text{NP-complete general CQ evaluation},
\]

with treewidth giving a useful intermediate boundary. citeturn13search0turn17search1

\[
\text{straight-line regular string constraints} + \text{certain cross-string operations}
\quad\Rightarrow\quad
\text{decidable} \to \text{undecidable},
\]

as demonstrated for replacement/length and string-number theories. citeturn17academia48turn19academia48

And perhaps most importantly:

\[
\text{cheap matching} + \text{search over }P
\quad\not\Rightarrow\quad
\text{cheap discovery}.
\]

Finite-state execution versus finite-state identification proves this directly. citeturn16search1

The architectural implication for STRling is therefore not to identify the most powerful single matching algorithm. It is to establish a **semantic-to-computational classification boundary in the compiler**, emit an execution contract, and dispatch each class to a model that preserves the strongest defensible guarantee. This follows the project's own emerging research direction: Research Intelligence already cautions against a universal pattern runtime, recommends multidimensional rather than scalar safety conclusions, and treats specialized systems as potentially preferable to artificial architectural unification. fileciteturn10file0L2-L2 fileciteturn13file0L2-L2 fileciteturn7file0L2-L2

The resulting design rule is concise:

> **Extend semantics freely only when the compiler can also extend its computational taxonomy. A new operator should enter the language together with its recognized formal class, static parameters, matching algorithm family, discovery consequences, memory model, decidability boundary, and resource policy. Operators for which those facts are unknown should not inherit the execution guarantees of neighboring syntax.**

That preserves a large linear-streaming core without falsely forcing relational, recursive, graph, constraint, or synthesis workloads through it; permits polynomial and parameterized extensions where they are valuable; confines NP-hard execution behind explicit budgets; and gives the compiler a principled basis for rejecting combinations whose exact unrestricted execution cannot be justified.

**Research stage complete.**
