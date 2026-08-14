# Bounded Symbolic Discovery for a Future STRling System

Role: Research report
Origin: AI-assisted deep research commissioned for STRling Research Intelligence
Generated: 2026-08-14
Imported: 2026-08-14
Source verification: Partially verified
Last reviewed: 2026-08-14
Current status: Active input

## Executive synthesis

The most defensible architecture for automatic STRling pattern discovery is **not** a universal inducer that attempts to infer arbitrary programs from arbitrary data. It is a **bounded, syntax-guided, matcher-verified symbolic search system**:

\[
\text{Data} + \text{Pattern Algebra} + \text{Search Bounds}
\;\longrightarrow\;
\{\text{Declarative Candidate Patterns}\}
\]

The decisive design move is to turn discovery into search over an **explicit hypothesis language** whose primitives, composition rules, types, structural costs, parameter ranges, recursion policies, approximation semantics, and resource limits are known in advance. Syntax-Guided Synthesis provides a close formal precedent: a grammar specifies the allowed candidate expressions while semantic constraints determine whether a candidate is acceptable. Bottom-up synthesis work likewise shows that grammar enumeration becomes practical only when large equivalence classes of candidates are collapsed or pruned. citeturn17search0turn17search7

This interpretation fits the current Research Intelligence repository's authority model. The repository explicitly describes itself as a research and strategic-reasoning layer rather than the owner of STRling semantics or architecture, and it warns that historical “Universal Pattern Engine” material is not current product authority. Its current non-text-sequence inquiry similarly cautions that shared sequence vocabulary does not imply a single runtime or intermediate representation, while the recursive-grammar inquiry recommends independently justifying grammar capabilities rather than silently broadening regex-like semantics. fileciteturn8file0L2-L2 fileciteturn10file0L2-L2 fileciteturn11file0L2-L2

The central recommendation is therefore a **hybrid discovery kernel** rather than a single algorithm. Different parts of the symbolic algebra should expose specialized proposal mechanisms—sequence mining for recurring subsequences, sparse selection for numeric relations, constraint solving for relational structures, multi-model fitting for latent partitions, grammar compression for hierarchy—while all proposals converge on a common candidate representation, common scoring interface, and the **ordinary STRling matcher as the final semantic authority**. Existing STRling research already makes essentially the same generator/verifier separation for AI-assisted synthesis: syntax constraints can narrow candidates, but compiler/analyzer/test machinery must retain verification authority. fileciteturn12file0L2-L2

The research literature strongly supports this decomposition. PrefixSpan avoids indiscriminate subsequence enumeration by recursively projecting the database and growing only locally supported prefixes; SEQUITUR discovers recursive grammatical structure by replacing repeated phrases; SINDy selects a sparse subset from a user-chosen nonlinear function library rather than searching arbitrary equations; SyGuS constrains synthesis by grammar; Popper learns constraints from failed logical hypotheses; and multiple-model fitting work separates hypothesis generation from selection of a covering set of model instances. These are different algorithms, but they share the same fundamental idea: **practical induction becomes possible by exploiting structure in a deliberately restricted search space**. citeturn22search2turn16academia24turn16search0turn17search0turn16academia26turn20search1

This also draws the boundary with unrestricted induction. Solomonoff-style universal induction ranges over universal computation and is known to be incomputable; work by Leike and Hutter explicitly studies the degree of that incomputability. A STRling discovery facility should not approximate that objective by merely imposing a timeout on an otherwise universal programming language. It should instead define a materially smaller, typed, resource-bounded and preferably finitely searchable hypothesis class for every discovery run. citeturn14search0turn14search1

**Core conclusion:** a feasible future STRling discovery system is best understood as a **portfolio of bounded symbolic search procedures operating over one externally defined declarative algebra, with aggressive structure-preserving pruning, decomposition, residual-guided iteration, and mandatory replay through the ordinary matcher**. Search heuristics may be probabilistic, approximate, greedy, learned, or incomplete; semantic acceptance need not be.

## Taxonomy of practical discovery approaches

No single literature surveyed covers the full `Data → Candidate Patterns` problem. The useful taxonomy is by the *structure each method exploits to avoid universal search*.

| Approach | What it searches efficiently | Principal pruning or compression mechanism | STRling-relevant role |
|---|---|---|---|
| Frequent/sequential pattern mining | Repeated itemsets or subsequences | Support thresholds, prefix projection, local pattern growth | Seed discovery for repeated symbolic structures |
| Time-series motif mining | Similar repeated numeric subsequences | Distance bounds, indexing/profiles, dimensional representations | Detect repeated local numerical shapes before symbolic lifting |
| Grammar induction/compression | Repeated and nested sequence structure | Replace reusable phrases/subtrees with nonterminals | Discover hierarchy and reusable subpatterns |
| MDL pattern-set mining | Sets of patterns explaining data jointly | Prefer reductions in total model-plus-data description | Search heuristic for concise explanatory sets |
| Symbolic regression | Numeric symbolic expressions | Structural cost, evolutionary/search heuristics, algebraic decomposition | Discover algebra-compatible numeric relations |
| Sparse system identification | Sparse equations from fixed term library | Sparse coefficient selection | Fast discovery when the right primitive library is enumerable |
| ILP / relational induction | Logic rules and recursive relations | Mode/syntax restrictions; constraints learned from failures | Relational pattern composition and predicate invention |
| Syntax/constraint-guided synthesis | Programs in a grammar satisfying constraints/examples | Grammar, SMT/SAT/FTA/VSA representations, CEGIS | General bounded symbolic-search substrate |
| Multi-model fitting | Unknown number of simultaneous latent structures | Minimal hypotheses, inlier/support sets, covering/assignment | Interleaving and latent partition discovery |
| Bayesian/program induction | Programs weighted by a prior | Probabilistic search ordering and learned abstraction libraries | Optional search guidance, not semantic authority |

PrefixSpan is particularly instructive for candidate generation. The authors explicitly start from the observation that sequential mining can require examination of combinatorially many intermediate subsequences. Rather than generate all candidates globally, PrefixSpan recursively projects the database around prefixes and extends them using only locally frequent fragments; the paper also notes that the mechanism can incorporate user-specified constraints. That suggests a STRling rule of **grow candidates only inside a support-conditioned subproblem**, rather than repeatedly evaluating every extension against the entire dataset. citeturn22search2

For continuous or numeric sequences, motif discovery is valuable as a *proposal layer* rather than as the final symbolic language. Exact motif algorithms such as MK search for repeated similar subsequences much more efficiently than brute-force all-pairs comparison, while SAX provides a symbolic dimensional representation with a lower-bounding distance measure. Matrix Profile work further demonstrates that motif and nearest-subsequence information can be maintained exactly, incrementally, and in anytime forms. These systems identify where repeated structure exists; a later symbolic phase can ask which algebraic STRling pattern describes it. citeturn20search2turn20search4turn20search11

Grammar induction offers a different form of leverage. SEQUITUR incrementally replaces repeated phrases by grammar rules and applies that transformation recursively, yielding a hierarchical description in linear time and space with respect to its input sequence. RePair similarly constructs a straight-line grammar through repeated bigram replacement, although finding a globally smallest grammar is hard in general. The lesson for STRling is not to adopt either grammar as semantics, but to use repetition and reuse as **signals for candidate abstraction**: a repeatedly occurring symbolic subtree is a strong candidate for a named or shared subpattern. citeturn16academia24turn18academia2

MDL-based mining is useful because discovery needs to select *sets* of mutually explanatory patterns rather than simply list every frequent one. GoKrimp directly grows sequential patterns while they improve a compression objective and uses dependency tests to restrict extensions. Other sequence-summary work explicitly allows interleaving patterns, and a probabilistic subsequence-interleaving model formulates inference partly as a coverage optimization problem. These results support MDL as a search heuristic for balancing additional symbolic structure against unexplained observations. They do **not** establish that the most compressive STRling candidate is the most semantically meaningful one; that stronger judgment belongs to the separate meaningfulness layer. citeturn19search1turn19academia24turn20academia33

Symbolic regression and sparse system identification contribute two complementary strategies. General symbolic regression searches expression structures—AI Feynman, for example, recursively exploits separability, symmetry, and compositional structure, while contemporary symbolic-regression systems combine structural search with simplification and constant optimization. SINDy instead avoids expression-tree search where possible: it starts from an explicit candidate library of nonlinear terms and uses sparse regression to identify a small active subset. SINDy's own formulation emphasizes that success depends critically on choosing appropriate state variables and a suitable function library. For STRling this is a highly relevant pattern: **when composition can be linearized into “select a few primitives from a bounded library,” prefer sparse selection over tree enumeration**. citeturn16search0

ILP contributes relational and recursive induction techniques. Popper implements a generate-test-constrain loop: when a hypothesis is too general or too specific, constraints derived from the failure eliminate related portions of the hypothesis space. Fine-grained failure explanations can prune still more candidates, and predicate-invention work shows how new reusable abstractions can be induced when bounded by an explicit meta-language. This is directly applicable to a symbolic relational algebra in which matcher failures can reveal not only that a candidate failed, but **which composition or relation caused it to fail**. citeturn16academia26turn16academia25turn16academia27

Program synthesis supplies the general search machinery around these specialized miners. SyGuS makes the candidate language explicit through a grammar; bottom-up enumerative synthesis grows grammar terms by cost and removes observationally equivalent programs; finite-tree-automata and version-space approaches represent many consistent programs compactly rather than materializing each independently; abstraction-refinement synthesizers initially reason about coarser candidate classes and refine only when a supposed solution is spurious. Best-first bottom-up synthesis further demonstrates that candidate generation can be ordered directly by an explicit program-cost function. citeturn17search0turn17search7turn21search0turn21search11turn21academia12

Bayesian program induction is best treated as comparison and optional guidance. DreamCoder alternates program search with learning new reusable symbolic abstractions and a neural search guide; its abstractions remain compositional programs. Stitch later demonstrated that library abstractions can be learned directly from a corpus of programs by top-down symbolic search and syntactic pruning, with substantially lower measured search cost than DreamCoder's earlier library-learning procedure. This supports **learned priors or corpus-derived libraries as accelerators**, but there is no need to make probabilistic machinery part of the meaning or verification of discovered STRling patterns. citeturn18academia1turn18academia0

### What should be combined

The strongest design is consequently not “pick symbolic regression” or “pick program synthesis.” It is a staged portfolio:

\[
\text{cheap structural detectors}
\rightarrow
\text{symbolic candidate construction}
\rightarrow
\text{matcher evaluation}
\rightarrow
\text{joint explanation/partition search}
\rightarrow
\text{residual search}
\rightarrow
\text{hierarchical abstraction}
\rightarrow
\text{independent verification}.
\]

That architecture takes the efficient proposal mechanisms of data mining, the controlled hypothesis languages of synthesis, the joint-selection ideas of MDL and multi-model fitting, and the reuse mechanisms of grammar/library induction, without forcing any one of them to define STRling semantics. This is a synthesis of the cited evidence rather than a claim made by any one source. citeturn22search2turn17search0turn20search1turn16academia24turn18academia0

## Hypothesis-space controls and search architecture

The hypothesis space should be **bounded in multiple independent dimensions**, not merely by “maximum AST depth.” A depth limit still permits an enormous branching factor, and an unrestricted constant space or recursion mechanism can defeat otherwise reasonable syntactic bounds. SyGuS's explicit grammatical candidate set, SINDy's fixed term dictionary, DESQ's declarative subsequence constraints, and Popper's syntactic hypothesis constraints all demonstrate different ways in which admissible structure can be restricted before expensive semantic search occurs. citeturn17search8turn16search0turn20academia34turn16academia26

A practical discovery request should therefore compile an externally defined pattern algebra into a **discovery grammar** with at least these controls:

| Control dimension | Recommended bound |
|---|---|
| Operator vocabulary | Explicit allow-list of externally defined primitives/combinators |
| Types and sorts | Only type-correct compositions generated |
| Structural size | Maximum AST nodes or weighted structural cost |
| Operator-specific depth | Separate limits for repetition, nesting, alternation, relation chaining, etc. |
| Arity | Bounded fan-out for combinators |
| Constants | Finite observed-value pool, bounded numeric ranges, or separately fitted parameters |
| Gaps/windows | Explicit maximum gap, span, lag, or neighborhood where applicable |
| Recursion | Disabled by default; otherwise explicit templates, depth/resource bounds, and legal base cases |
| Approximation | Explicit error model/tolerance family; never implicit |
| Partition complexity | Maximum active components or, preferably, a per-component cost plus global resource ceiling |
| Abstraction invention | Limited count/size of newly introduced subpatterns per round |
| Search resources | Candidate, memory, matcher-call, and wall-clock budgets |

These are *discovery restrictions*, not changes to the pattern algebra itself. A broader algebra can exist while a particular discovery profile searches only a tractable fragment. That separation mirrors synthesis systems in which the underlying semantic theory is broader than the grammar admitted for a particular synthesis problem. citeturn17search0turn21search2

### Candidate construction should be typed and bottom-up

Primitive candidates should be created first, then composed only through legal algebra productions. The search store should contain a DAG rather than independent AST copies so identical subexpressions can be shared. Version-space and finite-tree-automaton synthesis work demonstrates the importance of compactly sharing common structures across many candidate programs; library-learning work similarly exploits shared subtrees and repeated structures. citeturn21search0turn21search1turn18academia0

For each candidate, the discovery engine should retain more than its syntax:

\[
C =
(\text{AST},
\text{type},
\text{structural cost},
\text{parameters},
\text{support/witness signature},
\text{fit statistics},
\text{provenance},
\text{bounds}).
\]

The **support/witness signature** is particularly important. Two syntactically different candidates that produce exactly the same observable matcher behavior on the current data may be redundant for subsequent context-independent composition. Bottom-up synthesis uses precisely this “observational equivalence” idea to collapse candidate classes, although its sound use requires that equivalence be preserved by all contexts in which an expression may later be embedded. STRling should therefore make semantic deduplication operator-aware rather than assuming that equal current match sets always imply interchangeable subpatterns. citeturn17search7

### Search should be cost-layered, not exhaustive

A reasonable default is **best-first progressive widening**. Start with low-cost atoms and shallow compositions; expand candidates with good search-interface scores; admit successively more expensive operator families or parameter ranges only as cheaper frontiers saturate. Best-first bottom-up synthesis provides direct evidence for generation ordered by program cost, while PrefixSpan shows the complementary benefit of recursively growing candidates only in projected subspaces where extensions have evidence of local support. citeturn21academia12turn22search2

Beam search is useful when admissible bounds are unavailable but the frontier becomes too large. It should be treated as an explicitly incomplete mode: retain several competing candidates per operator family, type, support signature, and structural-cost band rather than a single global top-\(k\). **Diversity-aware beams** reduce the danger that one easy-to-fit hypothesis family crowds out structurally different explanations before later composition reveals their value. This is a design recommendation inferred from the general ambiguity and search-space results in program synthesis rather than a theorem about STRling. citeturn21search6turn15search12

Dynamic programming is most valuable where the algebra has **optimal substructure or reusable subproblems**: span-based sequence segmentation, compact sets of programs yielding a particular observation signature, or tree-structured composition. Version-space algebras and finite tree automata show how exponentially many syntactic programs can sometimes be manipulated through shared representations; this is preferable to treating “dynamic programming” as a universal solver for arbitrary relational patterns. citeturn21search0turn21search2

Branch-and-bound should be enabled only for scoring components for which valid lower or upper bounds can be computed for a partial candidate. Exact sparse-regression work shows why branch-and-bound can be powerful when relaxations provide certifiable bounds, but the applicability of such bounds depends on problem structure. In STRling, examples might include monotone support limits, unavoidable residual cost, minimum remaining structural cost, or a provable ceiling on additional coverage. Heuristic estimates that are not admissible belong in best-first ordering, **not in irrevocable branch pruning**. citeturn14academia25

### Separate structural search from parameter fitting

A major source of explosion is enumerating both expression structure and numeric constants simultaneously. Symbolic regression and SINDy suggest a better separation: discover a structural template, then fit its continuous or discrete parameters with a specialized solver where semantics permit it. SINDy selects terms and estimates coefficients inside a fixed library; symbolic-regression systems similarly distinguish expression evolution from numeric constant optimization. The fitted values must ultimately be serialized as ordinary parameters/constants in the declarative pattern algebra rather than remaining hidden inside a regression model. citeturn16search0

The resulting core loop can be conceptualized as:

```text
seed primitive candidates from the data
canonicalize and type-check

while budget remains:
    choose promising frontier classes
    compose/grow legal candidates
    discard structurally impossible or dominated candidates
    collapse sound semantic-equivalence classes
    fit bounded parameters where necessary
    evaluate candidates through matcher-compatible semantics
    update joint explanation hypotheses
    derive residual evidence
    generate residual-conditioned candidates
    periodically mine recurring candidate substructures

serialize surviving declarative candidates
re-run them independently through the ordinary matcher
```

The important property is not the precise loop ordering. It is that **every stage operates on bounded declarative hypotheses and retains enough provenance to reconstruct why a candidate was generated and how it was evaluated**. This is consistent with the repository's wider emphasis on provenance, uncertainty, and downstream verification. fileciteturn8file0L2-L2

## Decomposition, interleaving, hierarchy, residuals, and noise

### Unknown interleaving should become model-set discovery, not partition enumeration

The motivating “1,000 values secretly contain 11 interleaved arithmetic progressions” example exposes an especially important trap. A direct search over assignments of 1,000 observations to an unknown number of components is the wrong abstraction. The useful precedent is **multi-model fitting**: generate plausible component hypotheses, compute which observations each explains, then select a small compatible collection of hypotheses. Multiple Model Fitting as a Set Coverage Problem explicitly recasts extraction of multiple latent model instances as set covering; Progressive-X interleaves proposal, rejection, and integration and can terminate when further adequately supported models become sufficiently unlikely. citeturn20search1turn20search0

For an arithmetic-progression pattern family, for example, the generator need not know \(k=11\). Under whatever AP semantics the external STRling algebra defines, it can generate AP hypotheses from **small bounded witness sets**, expand each hypothesis with the ordinary or indexed matcher to obtain its support set, and pass those support sets to an explanation solver:

\[
\min_{z,r}
\quad
\sum_j \lambda_{\text{pattern}}\, z_j
+
\sum_i \lambda_{\text{residual}}\,r_i
+
\text{fit-error}
\]

subject to each observation being either assigned to one or more allowed candidate supports or charged as residual/noise. A hard partition uses mutually exclusive assignments; an overlap-capable algebra can instead allow controlled multiple coverage. The number of active components is

\[
k = \sum_j z_j,
\]

so it is **inferred through selection**, not enumerated as an outer loop over \(k=1,2,\ldots\). This is an architectural inference from set-cover and interleaving-pattern methods, not a claim that the vision algorithms themselves solve arithmetic progressions. citeturn20search1turn20academia33

The minimal-witness generator can also be bounded. If a family needs \(m\) observations to determine a parameterized primitive, sample or index promising \(m\)-tuples rather than enumerate all subsets. RANSAC-derived multi-model methods show how minimal hypotheses and support/inlier testing can uncover multiple structures amid noise and outliers. A deterministic mode could instead enumerate only indexed seeds meeting algebra-specific constraints. citeturn20search0turn20search1

This makes the unknown partition count far less special. “Eleven interleaved APs” becomes the same generic problem as “several repeating motifs plus anomalies,” “multiple recurring symbolic episodes,” or “several relational generators”: **propose components, compute supports, choose an explanatory collection, search what remains**. The exact selection objective is an interface point for the separate meaningfulness work; discovery only needs usable costs for search and pruning.

### Residual analysis should drive the next search round

Residuals are not necessarily numeric subtraction. For a general symbolic matcher, the residual can be represented as:

\[
R =
(\text{unexplained observations},
\text{partially explained observations},
\text{per-observation mismatch},
\text{failed bindings},
\text{uncovered intervals/relations}).
\]

Searching this residual has strong precedents in greedy compression and multi-model discovery. GoKrimp repeatedly finds patterns that improve compression; Progressive-X progressively adds models to the current interpretation; failure-driven ILP converts rejected hypotheses into constraints on future generation. Together they support an **explain → inspect residual → specialize the next search** architecture. citeturn19search6turn20search0turn16academia26

Purely greedy residual subtraction is dangerous, however. An initially attractive candidate can consume observations that would support a substantially better joint explanation. Set-cover formulations were developed partly because sequential extraction has exactly this problem. STRling should therefore retain a beam or pool of **explanation states**, periodically reconsider assignments jointly, and permit previously selected candidates to be displaced. citeturn20search1

A particularly useful search statistic is **marginal residual gain**:

\[
\Delta(C\mid E)
=
\text{Loss}(E,R)
-
\text{Loss}(E\cup\{C\},R')
-
\text{structural-cost}(C).
\]

This need not be the final meaningfulness score. It is an operational answer to “is expanding this branch likely to explain something that the current explanation does not?” MDL pattern mining supplies precedent for evaluating patterns as members of a set rather than solely in isolation. citeturn19search9turn19academia24

### Patterns among patterns should be mined explicitly

Hierarchical discovery should occur after—or interleaved with—first-level candidate formation. SEQUITUR shows that repeated phrases can be replaced with rules and then recursively participate in higher-level repetitions. DreamCoder learns abstractions that become primitives for later synthesis, while Stitch searches a corpus of existing programs for common symbolic structures that deserve library abstraction. citeturn16academia24turn18academia1turn18academia0

For STRling, this suggests two separate hierarchy channels.

The first is **data hierarchy**: matched spans, subsequences, groups, or relational structures are replaced by typed symbolic tokens and mined again. For example, after discovering several local candidates \(A,B,C\), the engine may discover that their occurrence sequence repeatedly has form `A B A C`, which can then be translated back into a legal higher-level composition in the externally provided algebra. SEQUITUR is the clearest precedent for recursive phrase abstraction. citeturn16academia24

The second is **program hierarchy**: recurring AST fragments among many good candidates are factored into reusable subpatterns. Stitch's corpus-guided abstraction search is directly analogous: it seeks library functions capturing shared program structure and uses syntactic matching to prune that search. This can discover “patterns among candidate patterns” even when their matches do not occur contiguously in the source data. citeturn18academia0

These abstractions should initially be **run-local discovered definitions**, not automatic extensions to the canonical STRling language. Promotion to a shared standard library or algebra is a separate product/semantic decision. That restraint matches the Research Intelligence repository's explicit distinction between research recommendations and downstream authority. fileciteturn8file0L2-L2

Recursive discovery deserves still stronger controls. Recursive synthesis is feasible in specialized systems—Popper learns recursive logic programs, and trace-guided synthesis uses compact version spaces over recursion traces—but recursion magnifies ambiguity and search cost. A STRling discovery profile should therefore enable recursion only through externally legal templates, explicit base-case forms, and resource/depth bounds rather than allowing arbitrary recursive program generation. citeturn16academia26turn21search1

### Approximate and noisy evidence should alter evaluation, not semantic authority

Noise should enter the system through **explicit loss/support semantics**. Time-series motif mining has algorithms designed for noisy repeated subsequences; robust multi-model fitting separates inliers from outliers; weak-form variants of SINDy were developed specifically to recover sparse equations under substantial measurement noise; noisy ILP systems similarly relax perfect coverage of examples. These show that approximate discovery is practical when the permissible error model is made explicit. citeturn20search6turn20search1turn16search9

A useful candidate should therefore distinguish:

\[
\text{exact support},\qquad
\text{approximate support},\qquad
\text{error distribution},\qquad
\text{unexplained residual}.
\]

Approximate candidates should not silently become exact patterns. If the externally defined STRling algebra includes tolerances, fuzzy relations, distance predicates, bounded edit/error constructs, or analogous approximation operators, the discovery engine can serialize them and let the ordinary matcher verify them. If it does **not** include such semantics, an approximate fit can at most be reported as a discovery hypothesis awaiting translation into a legal exact declarative candidate. This preserves the distinction between a search heuristic and a language feature.

Noise handling should also be robust against a few extreme observations. Depending on the externally available semantics and data family, useful search adapters include truncated losses/inlier thresholds, explicit outlier codes in an MDL objective, probabilistic motif support, or bounded penalties on uncovered examples. The key design rule is that the error model is part of the search configuration and candidate evidence, never an undocumented relaxation. citeturn20search1turn20search6turn19search1

## Pruning, scoring, and independent verification

The hardest implementation question is not how to generate *a* pattern, but how to avoid generating billions of candidates without destroying the unusual hypothesis that matters. The literature suggests a hierarchy of pruning methods, ordered roughly from safest to most heuristic.

### Structural pruning

**Type and grammar pruning** should occur before evaluation. Any composition illegal under the externally supplied pattern algebra is never constructed. SyGuS demonstrates the basic principle of restricting candidate syntax through a grammar; DESQ shows that rich constraints such as length, span, gap, hierarchy, and regular-expression restrictions can be incorporated directly into sequential mining. citeturn17search8turn20academia34

**Canonicalization and symmetry breaking** should remove structurally equivalent syntax. Commutative operands can be ordered canonically where the algebra declares commutativity; associative structures can use canonical grouping where semantics allow it; alpha-equivalent bindings can share representations. ILP research has found that logically equivalent or symmetric hypotheses can cause substantial wasted search and that explicit symmetry breaking can materially reduce solving time. citeturn16academia26

**Structural cost bounds** then keep the search within a deliberate envelope. Weighted AST size is preferable to raw depth because different operators can have radically different branching consequences. A recursive operator, unrestricted disjunction, or arbitrary numeric constant generator should generally carry greater search cost than a simple primitive.

### Semantic pruning

**Observational equivalence** can collapse candidates that behave identically on the relevant observations, provided the algebra guarantees that this equivalence remains valid under future contexts. Bottom-up synthesis relies heavily on this technique, and compact finite-tree-automaton representations similarly exploit shared behavior among large families of programs. citeturn17search7turn21search0

**Support-conditioned growth** can reject extensions that lack sufficient local evidence. PrefixSpan's key move is not to extend every sequence prefix everywhere, but to recurse into projected databases and explore locally frequent fragments. GoKrimp similarly uses a dependency test to avoid considering every possible event as an extension. citeturn22search2turn19search6

**Failure-derived constraints** are stronger still when the matcher can explain a failure. Popper's generate-test-constrain cycle removes generalizations of hypotheses that are too general and specializations of those that are too specific; finer-grained explanations permit finer constraints. For STRling, structured matcher diagnostics could therefore become **search lemmas**—for example, “this relation cannot be repaired by adding a stricter descendant” or “this subtree already makes the required witness impossible.” Such pruning is safe only where those monotonic relationships are established for the external algebra. citeturn16academia26turn16academia25

**Abstraction refinement** offers another route: evaluate coarse summaries of candidate behavior first and refine only candidate regions that remain potentially valid. Program-synthesis work using abstract finite tree automata reports large reductions by grouping programs under coarse abstract semantics and refining after spurious candidates appear. An analogous STRling implementation might use interval summaries, cardinality bounds, type/shape summaries, or approximate support signatures before an expensive complete match. citeturn21search11

### Heuristic pruning should remain reversible where possible

Beam width, candidate quotas, approximate similarity clustering, learned priors, MDL gains, and probabilistic proposals are all useful but can remove the true pattern. They should therefore affect **priority, memory admission, or provisional beams** rather than silently being presented as logical impossibility.

DreamCoder demonstrates that a learned search model can guide program discovery while candidates remain symbolic, and other synthesis research learns or uses search policies to reduce explored portions of a DSL. The safe architectural interpretation for STRling is: learned or statistical mechanisms may decide *what to try first*; deterministic semantics decide *what the pattern means and whether it matches*. citeturn18academia1

A particularly important preservation strategy is **stratified diversity**. Do not use one global beam dominated by a single candidate family. Reserve frontier capacity across operator families, cost layers, support signatures, regions of the input, and exact versus approximate modes. This is a recommendation intended to counter the ambiguity and hypothesis multiplicity documented in programming-by-example systems, where many programs can be consistent with the same observations. citeturn15search12turn21search6

### Discovery scoring should expose a vector, not decide meaningfulness

The discovery engine needs scores to order work even though the separate Meaningfulness report owns final significance judgments. The clean interface is therefore a **score vector**:

\[
S(C)=
\big(
F,\;U,\;K,\;\Delta R,\;Q,\;V,\;P
\big)
\]

where, for example:

- \(F\): fit or matcher loss;
- \(U\): support/coverage;
- \(K\): structural or description cost;
- \(\Delta R\): marginal residual reduction;
- \(Q\): robustness/stability diagnostics;
- \(V\): verification state;
- \(P\): optional search prior.

MDL can supply a particularly useful \(K+\text{residual}\) search objective because it penalizes both a complicated explanation and unexplained data. Compression-based sequential miners have successfully used exactly this pattern-set perspective. But MDL results depend on the chosen coding/model class, so **compression should be an algorithmic preference, not a declaration of semantic importance**. citeturn19search1turn19search9

Search can operate on a weighted scalarization of this vector for a particular discovery profile, or maintain a Pareto frontier over fit versus structural cost. Symbolic-regression work commonly treats accuracy and expression complexity as competing objectives rather than collapsing them into one notion of truth. This is a useful model for keeping discovery mechanics separate from the downstream judgment of what is interesting.

### Every final candidate should be an ordinary declarative pattern

The discovery system should never return only opaque coefficients, cluster IDs, latent vectors, or a fitted model object. A candidate is complete only when it has been **reified into the externally defined symbolic algebra**:

```text
Candidate
  declarative_pattern
  bound_constants / symbolic parameters
  required approximation semantics
  predicted match/support set
  bindings or witnesses
  unexplained residual
  structural cost
  search-score components
  discovery provenance
  verification result
```

SINDy is relevant precisely because its output is a sparse explicit equation rather than only a black-box predictor, while program-synthesis systems deliberately return programs in a DSL. Library-learning systems likewise produce reusable symbolic abstractions. citeturn16search0turn17search0turn18academia0

An internal sparse-regression vector such as

\[
[0,0,1.7,0,-0.3,\ldots]
\]

is therefore not a discovery output. The corresponding externally legal symbolic relation—assuming those operators and constants exist in the algebra—is. Likewise, a clustering algorithm that says “points 17, 42, 81 form cluster 6” has not discovered a reusable STRling pattern until it identifies a declarative predicate or composition whose ordinary semantics generate those observations.

### Verification should be intentionally independent of discovery

The final pipeline should be:

\[
\text{Discovery Candidate AST}
\stackrel{\text{serialize}}{\longrightarrow}
\text{ordinary STRling pattern}
\stackrel{\text{ordinary matcher}}{\longrightarrow}
\text{actual matches}
\]

and the result should be compared to the support, bindings, captures, partitions, or residuals that the discovery engine predicted.

This generator/checker separation mirrors CEGIS and failure-driven ILP: one mechanism proposes hypotheses, another tests them and returns counterexamples or failures. STRling's current AI-assisted-synthesis inquiry independently recommends separating candidate generation from deterministic verification and acceptance. citeturn17search11turn16academia26 fileciteturn12file0L2-L2

To make that verification genuinely useful, the final check should **not reuse discovery shortcuts as its authority**. The discovery engine may have used indexes, cached partial matches, abstract interpretation, approximate nearest neighbors, sampled support, sparse regression, or a specialized parameter fitter. The verifier should deserialize the candidate from the same public/canonical representation an ordinary user would supply and execute the standard matcher over the original data. That reduces the chance that a bug in a discovery-only evaluator certifies itself.

A verification record should bind at least the serialized pattern, algebra/schema version, matcher version, input-data digest or immutable identity, match set, bindings/witnesses, any legal approximation settings, and discrepancies against discovery predictions. The repository's evidence model already emphasizes provenance and the distinction between generated research artifacts and authoritative execution evidence. fileciteturn8file0L2-L2

An approximate candidate is independently verifiable only if its approximation is itself part of matcher semantics. Otherwise, the ordinary matcher can verify an exact pattern derived from it but cannot certify the discovery engine's private notion of “near enough.” That is an important architectural boundary rather than a missing optimization.

## Recommended bounded-induction architecture and research conclusions

The evidence favors a **layered discovery service** with specialized proposal engines feeding a shared symbolic core.

| Layer | Responsibility | Recommended mechanism |
|---|---|---|
| Observation layer | Index and normalize the input without redefining its semantics | Sequence indexes, difference/lag tables, motif indexes, relation indexes |
| Primitive proposal layer | Find cheap locally evidenced structures | Pattern growth, motifs, bounded relational seeds, sparse libraries |
| Symbolic construction layer | Compose only legal algebra terms | Typed grammar, cost-layered bottom-up/best-first search |
| Candidate store | Share and deduplicate candidate families | DAG/FTA/VSA-style sharing, canonicalization, support signatures |
| Evaluation layer | Obtain candidate behavior | Matcher-backed exact evaluation plus explicitly separate approximate adapters |
| Explanation layer | Select compatible sets of candidates | Set cover/assignment, beam over explanation states, MDL-like cost interface |
| Residual layer | Focus subsequent generation | Unexplained-data masks, failure witnesses, error structure |
| Hierarchy layer | Discover patterns among candidates | Grammar compression, subtree mining, bounded library learning |
| Verification layer | Establish ordinary semantics | Fresh execution by canonical matcher |
| Output layer | Expose reusable results | Declarative patterns + evidence + provenance, not model internals |

This hybrid is better justified by the literature than attempting to force the entire task into symbolic regression, grammar induction, ILP, or generic enumerative synthesis. Specialized search methods derive their efficiency from different structural assumptions. A portfolio architecture preserves those advantages while the common pattern algebra and matcher provide interoperability. citeturn22search2turn16search0turn16academia26turn20search1turn18academia0

### Recommended search policy

The default discovery profile should begin with **small, exact, cheap candidates** and progressively widen the hypothesis space. Run indexed primitive detectors first; enumerate simple typed compositions next; use support-conditioned extensions; fit parameters separately where possible; collapse sound observational equivalences; and invoke expensive relational, partition, recursive, or approximate families only when the residual provides evidence for them. Best-first synthesis, pattern-growth mining, sparse system identification, and progressive multi-model fitting all support aspects of this “cheap evidence before expensive composition” policy. citeturn21academia12turn22search2turn16search0turn20search0

Where admissible bounds exist, branch-and-bound can conclusively eliminate subspaces. Where only heuristic scores exist, maintain beams and make incompleteness visible. Where enormous syntactic families share behavior, use compact version-space/tree-automaton representations or semantic signatures. Where the space is additive over a bounded primitive library, use sparse selection rather than symbolic enumeration. Where data contain several latent structures, search component hypotheses and a covering explanation rather than all partitions. citeturn14academia25turn21search0turn16search0turn20search1

### Recommended handling of the ten research questions

**Bounding the hypothesis space.** Compile the externally supplied algebra into explicit discovery profiles with type, operator, structural-cost, parameter, gap/window, recursion, approximation, abstraction, partition, and resource bounds. Do not expose an unrestricted general-purpose programming language behind a timeout. Syntax-guided synthesis is the strongest general precedent. citeturn17search0turn14search0

**Primitive composition.** Use typed bottom-up composition with structural sharing. Permit specialized compositional shortcuts—sparse library selection, pattern growth, constraint solving—when an operator family supports them. Represent candidates in a canonical shared DAG and mine recurring subtrees for subsequent abstraction. citeturn17search7turn21search0turn16search0turn18academia0

**Avoiding combinatorial explosion.** The first line of defense should be not generating candidates: grammar/type restrictions, support-conditioned growth, seed indexes, canonicalization, sound semantic equivalence, failure-derived constraints, coarse abstractions, and parameter fitting outside the structural enumerator. Only after these should beam limits or learned priorities discard viable branches heuristically. citeturn22search2turn17search7turn16academia25turn21search11

**Unknown interleaving/partition count.** Treat it as multiple-model selection. Generate bounded component hypotheses and their support sets; select a compatible covering/partition with a cost for each active component and each unexplained observation. The optimizer discovers the effective \(k\); progressive residual-conditioned proposal avoids constructing all component candidates up front. citeturn20search1turn20search0turn20academia33

**Patterns among patterns.** Use both data-level substitution and AST-level abstraction mining. SEQUITUR provides the model for recursively replacing repeated sequence fragments; Stitch provides the model for mining repeated symbolic program structures. Keep discovered abstractions local until separately promoted by the authority that owns the algebra. citeturn16academia24turn18academia0

**Residual guidance.** Maintain an explicit unexplained-observation/error structure and condition subsequent generators on it. Do not irreversibly subtract greedy matches; retain multiple explanation states or periodically solve jointly so an early candidate can be replaced. citeturn19search6turn20search1

**Approximate/noisy matches.** Carry exact support and approximate support separately, use explicit robust losses or legal approximation operators, and preserve residual/error evidence. Approximation can guide proposal even when exact verification ultimately rejects a candidate, but it cannot silently modify matcher semantics. citeturn20search6turn16search9turn20search1

**Useful pruning.** Distinguish proofs from heuristics. Type errors, established monotonic bounds, canonical equivalences, and matcher-derived impossibility constraints may support hard pruning. Beam cuts, MDL ordering, approximate equivalence, learned priors, and sampling should normally remain recoverable/incomplete search decisions. citeturn16academia26turn17search7turn21search11

**Reusable declarative output.** Every accepted candidate must serialize into the given symbolic algebra, including constants and approximation constructs that affect its meaning. Regression coefficients, cluster memberships, embeddings, and latent assignments are intermediate evidence, not the final discovery artifact. citeturn16search0turn17search0

**Independent matcher verification.** Serialize the candidate, discard discovery-specific evaluator state, execute the ordinary matcher against original data, and compare its matches and bindings to the candidate's predicted evidence. Store discrepancies rather than hiding them. This gives discovery a clear epistemic status: **proposal engine, not alternate semantics engine**. citeturn17search11turn16academia26 fileciteturn12file0L2-L2

### What should not be built

A future STRling system should not attempt to enumerate all programs in a Turing-complete language and call the first compact one a discovered pattern. Universal-induction theory provides a principled warning here: Solomonoff induction is not a computable search algorithm that becomes practical with better engineering. citeturn14search0turn14search1

It should also not equate frequency with explanation. Classical pattern mining can return enormous redundant result sets; MDL and pattern-set mining arose partly to address this problem by considering patterns jointly rather than independently. citeturn19search7turn19search9

It should not equate compression with meaningfulness. Compression is a powerful way to allocate search effort and penalize unnecessary structure, but the chosen encoding itself represents an inductive bias. The Meaningfulness layer should remain free to favor, reject, or re-rank equally well-fitting/compressing candidates using criteria outside this report's scope. citeturn19search1

It should not make hierarchy synonymous with unrestricted recursion. Repeated symbolic structure can be discovered safely through finite abstraction and library learning long before arbitrary recursive hypotheses are enabled. SEQUITUR and Stitch demonstrate substantial hierarchical discovery without requiring universal recursive-program search. citeturn16academia24turn18academia0

And it should not create a second, discovery-specific semantics. The ordinary matcher should remain able to answer:

\[
\text{Discovered Pattern}+\text{Original Data}
\longrightarrow
\text{Matches}
\]

without knowing *how* the candidate was discovered. That property is what turns machine discovery from an opaque modeling subsystem into a producer of **reusable STRling artifacts**.

### Research conclusion

The practical frontier is therefore **bounded symbolic induction**, not universal induction. The hypothesis language is externally supplied; the discovery system controls which bounded fragment to search. Search is heterogeneous and incomplete when necessary, but its incompleteness is explicit. Local pattern mining, symbolic regression, sparse selection, constraint solving, ILP, multi-model fitting, grammar induction, residual analysis, and library learning are best treated as complementary proposal and pruning technologies rather than competing definitions of discovery. citeturn17search0turn22search2turn16search0turn16academia26turn20search1turn18academia0

The architecture with the strongest evidence base is consequently:

\[
\boxed{
\begin{aligned}
&\text{Externally defined symbolic algebra}\\
&+\;\text{explicit bounded discovery profile}\\
&+\;\text{specialized primitive proposal}\\
&+\;\text{typed cost-guided composition}\\
&+\;\text{semantic and structural pruning}\\
&+\;\text{joint multi-pattern explanation}\\
&+\;\text{residual-guided iteration}\\
&+\;\text{hierarchical abstraction}\\
&+\;\text{ordinary-matcher verification}\\
&\Rightarrow\;\text{declarative candidate patterns}
\end{aligned}}
\]

This preserves the most useful ambition in `Data → Candidate Patterns`: finding structure that a human would not think to write, including latent interleavings and multi-level regularities, while refusing the unbounded premise that the system must search every computable explanation. It is compatible with the Research Intelligence repository's present posture: investigate broadly, preserve uncertainty, keep research recommendations non-normative, and leave semantics and implementation authority downstream. fileciteturn8file0L2-L2

The present research stage is complete.
