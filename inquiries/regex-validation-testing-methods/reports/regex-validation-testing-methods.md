# Advanced Semantic Testing for STRling and Regex Engines

Role: Research report
Origin: AI-assisted deep-research session commissioned for STRling Research Intelligence; the underlying sources, not the AI system, are the evidence authorities.
Generated: 2026-08-12
Imported: 2026-08-12
Source verification: Partially verified
Last reviewed: 2026-08-12
Current status: Active input

## Source verification gaps

Current STRling compiler-stage and test status was checked at [`9991575`](https://github.com/strling-lang/strling/tree/9991575b347ac5f56108f18065c88b2b16a5065a); current Regex Conformance status was checked at [`f8c603a`](https://github.com/strling-lang/regex-conformance/tree/f8c603a1a4f5f827247f8a5bed61c85f483857f8). Selected methods were checked against the [Csmith paper](https://www.cs.utah.edu/~regehr/papers/pldi11-preprint.pdf), [QuickCheck](https://doi.org/10.1145/351240.351266), [libFuzzer](https://llvm.org/docs/LibFuzzer.html), [delta debugging](https://www.st.cs.uni-saarland.de/papers/tse2002/tse2002.pdf), and [Perses](https://doi.org/10.1145/3360562).

The original research-session marker map is unavailable. Unreconstructed markers link here. Exact claims about individual fuzzers, defect counts, metamorphic relations, reducer performance, and regex-specific tools remain provisional. Generated-test strategy is not Conformance certification methodology.

## Executive findings and semantic model

STRling is unusually well positioned for deep semantic testing because its architecture already separates parsing, target-independent compilation, and emission. The repository describes a strict **Parse → Compile(IR) → Emit** pipeline, with emitters expected to be deterministic and side-effect free; its current test design already includes semantic verification, end-to-end execution, shared-spec tests, golden patterns, cross-engine conformance, and combinatorial tests. [source-verification note](#source-verification-gaps) [source-verification note](#source-verification-gaps) The opportunity is therefore not to replace ordinary unit and conformance tests, but to add a **generated semantic-validation layer** that systematically constructs cases humans are unlikely to anticipate.

Recent research specifically on regex engines points in almost exactly this direction. The 2026 ReTest work argues that naïve differential testing is unreliable because regex dialects legitimately differ, while byte-level fuzzing spends too much effort on syntactically invalid inputs; it instead combines grammar-aware generation with metamorphic relations. Its preliminary PCRE evaluation reported substantially higher edge coverage and three newly found memory-safety defects. Because ReTest is currently workshop/preliminary research rather than a mature standard, its quantitative results should be treated as early evidence, but the methodological fit to STRling is strong. [source-verification note](#source-verification-gaps)

The central recommendation of this investigation is:

> **STRling should test semantics through several independent, partially overlapping validators rather than seek one universal oracle.** Generate semantically purposeful DSL/IR programs; validate local invariants immediately; apply metamorphic relations whose preconditions are machine-checkable; execute bounded independent semantics for a tractable core; compare portable cases across implementations only after capability/profile normalization; compare compiler stages through translation-validation-style checks; and automatically minimize every stable failure under the exact predicate that exposed it.

That design matters because the oracle problem is not solved by replacing one imperfect oracle with another. Differential testing, property testing, metamorphic testing, and bounded reference interpretation fail in different ways; their value comes from **independence and overlap**. Compiler-testing research repeatedly shows the same pattern. Csmith succeeded partly because it deliberately generated only programs whose behavior was sufficiently defined to make differential results meaningful; EMI generated families that were equivalent only for specific inputs; translation validation checks each compilation rather than trying to prove a whole compiler correct; and Alive2 demonstrates that bounded IR-level validation can find both implementation errors and specification ambiguities. [source-verification note](#source-verification-gaps)

A precise vocabulary is essential because these terms should not be conflated:

| Concept | Operational meaning for STRling | What it does **not** establish |
|---|---|---|
| **Test oracle** | A decision mechanism that can classify an execution or compilation as correct/incorrect with respect to a stated contract. It may be complete for a narrow subset or partial for a wider one. | The fact that another engine behaved differently is not itself an oracle. |
| **Differential signal** | An observation that two implementations, versions, compiler paths, targets, or configurations produced different normalized outcomes for supposedly comparable coordinates. | It does not say which side is wrong, or that either side is wrong. |
| **Metamorphic relation** | A necessary semantic relation between related test executions, such as “these two capture-free expressions must accept the same strings under these stated preconditions.” Metamorphic testing was developed specifically to exploit such relations when exact expected outputs are unavailable. [source-verification note](#source-verification-gaps) | It is not a complete specification of either individual output. When instantiated, it supplies a partial relational oracle only within its preconditions. |
| **Property** | An executable predicate over one artifact or a family of artifacts, such as `quant.min <= quant.max`, emitter determinism, or preservation of bounded language membership. Property-based testing explicitly combines executable properties with generated inputs and customizable generators. [source-verification note](#source-verification-gaps) | Passing sampled properties is not proof of global correctness. |
| **Empirical evidence** | An observation of what a precisely identified engine/profile did on a case. Regex Conformance explicitly distinguishes such observation from an engine-independent normative claim. [source-verification note](#source-verification-gaps) | Agreement, even unanimous agreement, is not necessarily semantic truth. |

This distinction aligns particularly well with Regex Conformance's architecture. Its vectors are explicitly described as executable questions rather than engine-independent normative claims, its applicability layer is intended to determine which coordinates are meaningful, and adapters translate native requests/results rather than owning applicability or evidence qualification. [source-verification note](#source-verification-gaps) [source-verification note](#source-verification-gaps) [source-verification note](#source-verification-gaps) Generated testing should preserve those boundaries.

The semantic pipeline that should be tested is therefore:

`DSL source → syntax/AST → Semantic IR → target lowering/emission → target regex compile → target match execution → normalized semantic observation`

There should be validators both **within each stage** and **across every arrow**. STRling's TargetArtifact base schema already gives a strong structural basis: it models alternatives, sequences, literals, dots, anchors, character classes, quantifiers, groups, backreferences, and lookarounds, with flags such as ignore-case, multiline, dot-all, Unicode, and extended mode. [source-verification note](#source-verification-gaps) The generated-testing system should treat that semantic structure as the primary fuzzing space instead of treating emitted regex text as an unstructured byte string.

## Testing-technique taxonomy

No single technique should dominate. Different methods answer different questions and require different oracle strength.

| Technique | Operational use | Oracle requirement | Best defect classes | Principal weakness | STRling / Regex Conformance role |
|---|---|---|---|---|---|
| **Cross-implementation differential testing** | Compile or execute the same applicable semantic case against several engines and compare normalized observations. | No expected answer required, but requires a justified comparability contract. | Wrong lowering, engine semantic defects, portability assumptions, capture/index discrepancies. | Legitimate dialect differences produce false differentials; shared bugs go unnoticed. | Core tool for portable STRling output and Regex Conformance discovery, but never majority-vote correctness. |
| **Cross-version differential testing** | Replay the same semantic coordinate on engine/compiler version N and N+1. | Previous result is a baseline, not necessarily an oracle. | Regressions, silent semantic changes, changed rejection rules. | Intended specification changes look like defects. | Strong regression signal after profile/spec-version normalization. |
| **Differential compiler testing** | Compile one semantic program through independent compiler paths/backends/targets and compare resulting behavior. | Programs must have defined semantics in the compared domain. | Miscompilations and backend-specific lowering errors. | Underspecified source semantics poison the signal. Csmith's major lesson was to avoid undefined/unspecified cases for exactly this reason. [source-verification note](#source-verification-gaps) | Compare target emitters and, where multiple STRling bindings implement compilation independently, compiler implementations. |
| **Equivalence modulo inputs** | Produce variants guaranteed equivalent only for the concrete test inputs being executed. | Requires correctness of the input-specific equivalence condition, not global equivalence. | Transformations and optimizations that alter apparently irrelevant structure. | Gives no claim outside the selected inputs. | Excellent for regexes: change branches/subexpressions proven irrelevant to a generated subject corpus and verify stable results. EMI found many GCC/LLVM miscompilations with this approach. [source-verification note](#source-verification-gaps) |
| **Metamorphic testing** | Transform a case according to a necessary semantic relation and verify the relation between executions. | Needs a valid MR plus enforceable preconditions. | Common-mode bugs invisible to engine consensus; compiler transformations; escaping/grouping/normalization defects. | A bad or over-broad MR manufactures false positives. | One of the highest-value techniques for STRling because its IR makes preconditions inspectable. ReTest independently reaches the same conclusion for regex engines. [source-verification note](#source-verification-gaps) |
| **Property-based testing** | Generate structured cases and evaluate executable semantic/structural predicates. | Each property is a partial oracle. | IR invariant failures, validator bugs, diagnostics, target-preservation errors. | Poor generators produce vast numbers of trivial or discarded tests. | Primary framework around Semantic IR generation and compiler-stage invariants. [source-verification note](#source-verification-gaps) |
| **Grammar-based generation** | Generate syntactically valid DSL/regex inputs from the grammar. | Usually crash/rejection/property oracle. | Parser, lexer, precedence, syntax interactions. | Syntax validity alone says almost nothing about semantic meaningfulness. | Useful first layer, not sufficient for Semantic IR/compiler testing. Grammar-aware generation is known to reach deeper stages than unstructured fuzzing. [source-verification note](#source-verification-gaps) |
| **Grammar-aware mutation** | Parse seeds and replace/simplify compatible AST subtrees. | Same as the surrounding campaign. | Deep parser/compiler interactions while retaining validity. | Structural compatibility does not guarantee semantic validity. | Use DSL AST or Semantic IR node classes, not arbitrary text offsets. Superion and LangFuzz support this general strategy for structured languages. [source-verification note](#source-verification-gaps) |
| **Coverage-guided structured fuzzing** | Retain structurally valid cases that unlock new implementation coverage and mutate from them. | Crash/property/differential/MR oracles run independently of coverage. | Rare implementation paths and feature interactions. | Code coverage can reward semantic duplicates and parser peculiarities. | Feed compiler/emitter coverage back into semantically aware mutation. NAUTILUS and coverage-guided property testing show why combining structure with feedback can reach sparse behavior. [source-verification note](#source-verification-gaps) |
| **Semantic fuzzing** | Generate/mutate while tracking semantic attributes such as capture environment, width, nullability, target capabilities, witnesses, and observation mode. | Property, relational, bounded-reference, or differential oracle. | Semantic defects rather than mere crashes. | More generator engineering than grammar-only fuzzing. | Should be STRling's principal generated-test strategy. Type/effect-directed compiler testing shows why constructing inputs that satisfy semantic invariants beats generate-and-reject strategies. [source-verification note](#source-verification-gaps) |
| **Translation validation** | Validate an individual source→target translation after the compiler performs it. | Requires a common semantic model and a refinement/equivalence check. | Frontend/IR and IR/target miscompilations. | Full validation may be expensive or impossible for extended semantics. | Implement a bounded “translation-validation-lite” for STRling's tractable subset. Translation validation was defined precisely as checking each compiler run; Alive2 demonstrates practical bounded IR validation. [source-verification note](#source-verification-gaps) |
| **Mutation testing** | Deliberately introduce plausible semantic compiler/emitter defects and measure whether the generated validation system detects them. | Existing test mechanisms are themselves being evaluated. | Blind spots in generators and properties. | Surviving mutants may be equivalent; mutation score is not correctness. | Use STRling-specific semantic mutants as an adequacy benchmark, not as a production bug oracle. |
| **Reducer/minimizer** | Iteratively simplify source, IR, input strings, profiles, and engine sets while preserving the exact failure predicate. | Requires a stable failure predicate. | Makes generated discoveries actionable and deduplicable. | Generic text deletion often destroys validity or changes the failure. | Essential. Domain-aware reduction should be part of the discovery pipeline rather than post-processing. Delta debugging, C-Reduce, and Perses all support this conclusion. [source-verification note](#source-verification-gaps) |

Two research lessons deserve particular emphasis for STRling.

First, **validity rate is not the same as useful-test rate**. Grammar-based whitebox fuzzing improved deep compiler/interpreter exploration because syntactically invalid tests get trapped in front-end paths. [source-verification note](#source-verification-gaps) But effect-driven QuickCheck goes further: even syntactically valid and type-correct programs can be useless for differential testing when their behavior depends on an underspecified semantic choice. [source-verification note](#source-verification-gaps) STRling therefore needs semantic generation, not merely grammar generation.

Second, **small structured search spaces deserve deliberate enumeration alongside fuzzing**. Skeletal Program Enumeration found long-latent compiler bugs by exhaustively exploring small syntactic structures modulo irrelevant renamings, demonstrating the usefulness of “small-scope” exhaustive exploration. [source-verification note](#source-verification-gaps) For STRling, small exhaustive spaces such as “two alternation branches × two group forms × two quantifier modes × several overlap relationships” may be more valuable than millions of randomly deep regex trees.

## Oracle strategy and differential failure classification

### When regex engines may legitimately disagree

A cross-engine disagreement is meaningful only after the harness proves the two executions are asking the same semantic question. Regex dialects differ in syntax, capabilities, matching policy, Unicode behavior, capture semantics, and host-language APIs; recent regex-engine testing work explicitly identifies this as the central limitation of naïve differential testing. [source-verification note](#source-verification-gaps)

Several concrete differences illustrate the problem.

RE2 intentionally omits backreferences and lookaround assertions, supports different POSIX and Perl-style matching modes, and documents distinct full-match and partial-match APIs. In POSIX mode it selects leftmost-longest matches, while its Perl mode is intended to select the match Perl would choose. [source-verification note](#source-verification-gaps) PCRE2, meanwhile, changes `\d`, `\s`, `\w`, and consequently word-boundary behavior when Unicode-property mode is enabled; it also has configurable duplicate-name and unset-backreference semantics. [source-verification note](#source-verification-gaps) ECMAScript defines its word-character set around ASCII word characters, with additional characters only through particular Unicode/case-folding conditions, and its host strings/indices are based on UTF-16 semantics. [source-verification note](#source-verification-gaps)

STRling itself states a Unicode-first semantic policy, distinguishes core from target-specific extensions, requires unsupported extensions to be rejected, and requires warnings where target semantics may diverge. It also explicitly notes differences between JavaScript's word-character behavior and PCRE2's Unicode-property configuration. [source-verification note](#source-verification-gaps)

Consequently, the meaningful differential coordinate is not:

`regex text + input`

but approximately:

`semantic feature set + pattern/IR + input + operation + flags + Unicode policy/version + newline policy + match-selection policy + capture observation + index-unit normalization + target capability/profile + engine/version`

A result should enter differential comparison only when applicability proves that these coordinates correspond to the same STRling semantic obligation. This is consistent with Regex Conformance's stated use of typed applicability rules and behaviorally relevant execution profiles rather than an engine label alone. [source-verification note](#source-verification-gaps) [source-verification note](#source-verification-gaps)

### Failure classification

Every differential should be automatically assigned to a class before anyone calls it a bug.

| Class | Meaning | Disposition |
|---|---|---|
| **Capability differential** | One engine does not support the construct, such as RE2 receiving a backreference. | Expected if applicability says unsupported; defect only if STRling wrongly emitted it instead of rejecting/transforming it. |
| **Dialect-semantic differential** | Both parse the construct but the profiles intentionally define different semantics, such as Unicode word classes or POSIX versus Perl match selection. | Legitimate disagreement; improve applicability/profile classification if it was compared accidentally. |
| **Operation differential** | Harness compared full-match with search, first-match with global iteration, overlapping with non-overlapping enumeration, etc. | Harness defect. |
| **Representation differential** | Equivalent semantic results use different native capture/null/index representations. | Adapter/normalization issue unless normalization itself is under test. |
| **Configuration differential** | UTF/UCP/newline/locale/flag/JIT or another behavioral option differs. | Re-run under matched profiles or explicitly classify the difference. |
| **Invalid/underspecified-case differential** | Input lies outside the contract or uses behavior STRling has not normatively fixed. | No correctness judgment until the contract is resolved. |
| **Resource/execution differential** | Timeout, OOM, compile limit, crash, harness failure, or unstable execution rather than a normal semantic result. | Separate operational/safety signal; never silently translate into “no match.” |
| **Version differential** | Same implementation changes behavior across versions. | Determine whether specification/profile changed; otherwise candidate regression. |
| **Stable in-contract semantic differential** | Applicable implementations received equivalent normalized semantics and produce contradictory observations. | Candidate semantic defect requiring independent adjudication. |
| **Consensus-but-property violation** | All engines agree, but an independent property, MR, or reference semantics says they are wrong. | Important candidate common-mode defect; demonstrates why majority voting is insufficient. |

The last class is particularly important. Differential testing cannot detect a bug shared by every compared implementation. Neither a majority nor unanimity is an oracle. This is why compiler-testing systems combine differential execution with carefully constrained input generation, and why metamorphic testing was developed specifically for systems where explicit expected outputs are unavailable. [source-verification note](#source-verification-gaps)

A robust adjudication pipeline should therefore be:

`applicability check → compile-result classification → native observation normalization → repeatability check → profile/spec comparison → differential clustering → independent property/MR/reference check → candidate defect`

Only the final stage should produce a semantic-defect allegation.

### Bounded independent oracles

STRling does not need a complete independent regex implementation to gain a powerful oracle. A small, deliberately independent **Semantic IR evaluator** should cover a tractable core such as literals, concatenation, alternation, character classes, anchors with explicitly defined semantics, ordinary grouping, and bounded/ordinary repetition. Captures, backreferences, and advanced lookarounds can be added only where the semantic model is trustworthy.

For each generated IR program over a deliberately small alphabet, the validator can enumerate all input strings up to a configured bound and compare:

`Semantic IR evaluator(IR, s)`
against
`target engine(emit(IR), s)`

This is not a proof of unbounded regex equivalence; it is a **complete oracle for the bounded domain being enumerated**. That is operationally valuable because it can catch wrong escaping, grouping, precedence, character classes, flags, anchors, nullability, and many quantifier transformations without relying on another production regex engine. Translation-validation research provides the general model—validate each produced translation under an explicitly stated refinement relation—while Alive2 demonstrates the practical usefulness of deliberately bounded validators. [source-verification note](#source-verification-gaps)

For ECMAScript specifically, a second high-independence oracle is possible for selected cases: research has produced an executable Coq mechanization of ECMAScript regular-expression semantics and used it to examine corner cases and optimizations. This illustrates that spec-derived executable semantics can provide an independent adjudicator where the implementation cost is justified, although STRling should not make such a heavy mechanism a prerequisite for its general testing architecture. [source-verification note](#source-verification-gaps)

## Generators, metamorphic relations, and semantic properties

### Semantic IR generation

The wrong generator architecture would be:

`random JSON → schema validation → discard almost everything invalid → execute survivors`

That reproduces the classic compiler-fuzzing problem where most random programs never reach interesting semantics. Effect-directed compiler testing found that merely following the grammar produced too many semantically unusable programs; goal-directed construction based on semantic judgments was much more useful. [source-verification note](#source-verification-gaps) Similarly, grammar-aware fuzzing research consistently finds that preserving structure allows exploration beyond parser rejection paths. [source-verification note](#source-verification-gaps)

STRling should instead implement a **constructive attributed generator**. Every recursive generation call should carry an environment approximately like:

```text
GenerationContext
  size_budget
  depth_budget
  enabled_features
  target_capability_intersection
  flags
  capture_symbol_table
  desired_width
  nullable_policy
  observation_mode
  alphabet_partition
  portability_class
  validity_mode
```

Each returned node should carry derived semantic attributes:

```text
GeneratedNode
  ir
  nullable
  min_width
  max_width
  fixed_width?
  captures_defined
  captures_referenced
  contains_assertion
  contains_backreference
  feature_set
  positive_witnesses
  negative_witnesses
```

This lets generation satisfy invariants *by construction*. A backreference can be emitted only from a scope containing an allowed preceding/available capture according to STRling's normative rule. A core lookbehind can call a fixed-width subgenerator. A quantifier can choose bounds satisfying `min <= max`. A named group can allocate from a symbol table rather than discovering duplicates after generation. The existing TargetArtifact schema already imposes many local structural constraints—for example node kinds, alternatives, quantifiers, group forms, backreferences, and lookarounds—making it a natural source for generator types. [source-verification note](#source-verification-gaps)

The generator should also **co-generate subject strings**. For a `Lit("ab")`, generate `"ab"` and nearby mutants such as `"a"`, `"ac"`, and `"xab"` depending on operation mode. For `Seq(A,B)`, concatenate positive witnesses. For `Alt(A,B)`, preserve branch-specific witnesses and deliberately generate overlap witnesses when possible. For character classes, generate inside/outside boundary values. For quantifiers, generate strings around `min`, `max`, and one-past-the-bound. This converts random tree creation into semantic test creation.

Positive and negative witnesses should not be treated symmetrically by chance. A useful distribution deliberately targets:

- match success;
- ordinary non-match;
- multiple possible matches;
- ambiguous alternation;
- empty matches;
- capture-set versus capture-unset paths;
- quantifier lower/upper boundaries;
- line/word boundaries;
- Unicode category boundaries;
- target capability boundaries.

Those are semantic partitions, not merely syntax categories.

The test system should maintain **separate generation modes** for three kinds of invalidity:

| Mode | Example | Expected behavior |
|---|---|---|
| Lexically/syntactically invalid DSL | unterminated class/group, malformed escape | Parser rejection at a controlled stage. |
| Syntactically valid but semantically invalid STRling | contradictory quantifier bounds, invalid capture reference, duplicate name if forbidden, invalid core lookbehind width | Semantic compiler rejection with the correct diagnostic class. |
| Semantically valid STRling but unsupported on target | target-specific extension/capability mismatch | Emitter/target validation error or specified warning—never silent semantic degradation. |

Mixing these populations would make rejection rates almost meaningless. STRling's own semantics explicitly distinguish portable core features from extensions that targets may reject or warn about. [source-verification note](#source-verification-gaps)

### Grammar-aware and coverage-guided mutation

Once valid AST/IR cases exist, mutations should operate on structure:

`Seq` parts can be removed, reordered only when the mutation is intentionally semantic-changing, or replaced by compatible subtrees; `Alt` branches can be spliced from a fragment corpus; quantifier bounds and modes can be changed with automatic repair; class items can be inserted/removed; group forms can be altered; and flags can be toggled. LangFuzz showed the value of recombining fragments from previously interesting inputs, while Superion showed the value of grammar-aware subtree mutation rather than byte-level editing. [source-verification note](#source-verification-gaps)

STRling should maintain two explicitly different mutator families:

**Semantics-preserving mutators** create metamorphic variants.

**Semantics-perturbing but validity-preserving mutators** search for new behavior and coverage.

Do not blur them. A mutation cannot serve as an MR merely because it “usually does not matter.”

Coverage feedback should combine ordinary implementation coverage with **semantic coverage**. Coverage-guided property testing shows that retaining generated inputs that reach sparse execution paths can greatly improve exploration compared with repeatedly sampling from scratch. [source-verification note](#source-verification-gaps) For STRling, a corpus entry should be considered interesting when it adds one or more of:

`compiler branch coverage`, `emitter branch coverage`, `IR node-pair/feature interaction coverage`, `diagnostic-class coverage`, `capability-boundary coverage`, `match-outcome diversity`, `capture-state diversity`, or `metamorphic-relation coverage`.

A million patterns that all reduce to “ASCII literal concatenation, successful full-match” are not a strong campaign even if their textual entropy is high.

### Candidate metamorphic relations

Each MR must have a **machine-checkable precondition**, a transformation, and a declared observation scope.

| Relation | Transformation | Required preconditions | Observation that must be preserved |
|---|---|---|---|
| **Noncapturing-group insertion** | `R ↔ (?:R)` | Group has no scoped flags or atomic semantics; transformation preserves parent precedence. | Full semantic observation, including match span and existing captures. |
| **Literal folding** | `Seq(Lit(a), Lit(b)) ↔ Lit(a+b)` | Both represent semantic characters, not source escape spelling; no diagnostic/source-location assertion is being compared. | Match/capture behavior. |
| **Equivalent literal spelling** | literal code point ↔ equivalent `\x…`/`\u…` escape | Code point is representable identically under the active source/target Unicode mode; escape cannot be lexically reinterpreted. | Semantic match behavior, not emitted textual form. |
| **Character-class permutation** | reorder class members | Base class is set-union semantics; no target-specific class operators whose order has semantics. | Match behavior. |
| **Character-class idempotence** | duplicate a class member | Same set-semantics precondition. | Match behavior. |
| **Capture alpha-renaming** | rename a named group and every reference consistently | Name is unique; no reflection on literal capture names is part of the observation; normalized result applies the same bijection. | Match/capture contents after name normalization. |
| **Extended-mode whitespace insertion** | add insignificant whitespace/comments | `x` semantics active; insertion occurs only where whitespace/comment is normatively insignificant, never inside a class/escape/token. | Parsed/compiled semantics. |
| **Irrelevant multiline flag** | toggle `m` | IR contains no start/end anchors whose semantics depend on `m`. | All match observations. |
| **Irrelevant dot-all flag** | toggle `s` | IR contains no `Dot` node. | All match observations. |
| **Exact repetition expansion** | `R{n} ↔ R…R` | `R` is capture-free, backreference-free, assertion-free and guaranteed to consume positive width; observation focuses on language/match span rather than internal matching path. | Membership/full-match or compatible search observation. |
| **Positive repetition expansion** | `R+ ↔ RR*` | Same restrictions as above. | Membership/full-match. |
| **Kleene idempotence** | `R* ↔ (R*)*` | Classical regular subset only: no captures, backrefs, lookarounds, atomic/possessive behavior; compare language membership, not backtracking/capture behavior. | Membership/full-match. |
| **Alternation factoring** | `AB\|AC ↔ A(?:B\|C)` | `A`, `B`, `C` are capture/backreference free; branch order retained; observation is language membership or otherwise proven insensitive to matching-path differences. | Declared restricted observation. |
| **Alternation reordering** | `A\|B ↔ B\|A` | **Only** when languages are proven disjoint for the observation domain, or boolean full-match semantics is being used and captures are absent. Never apply blindly under leftmost-first semantics. | Restricted membership observation. |
| **Whole-match/API relation** | full-match `R` ↔ search against an absolutely anchored form | Target has absolute-start/end anchors with semantics proven equivalent to the full-match API; newline/end semantics matched. | Boolean full-match result and, where safe, captures. |
| **Regex EMI relation** | modify/add a branch proven unreachable on the current generated subject set | Equivalence is asserted only modulo those concrete subjects; added structure introduces no capture numbering/name changes that affect observations. | Results on that subject set only. |

The alternation warning is important. STRling specifies leftmost-first behavior; therefore algebraic language equivalence does **not automatically imply equivalence of captures, selected match, or match path**. [source-verification note](#source-verification-gaps) ReTest's Kleene-algebra-derived MRs are highly relevant, but STRling should explicitly classify each MR by observation level—language membership, first match, match span, captures, or diagnostics—rather than import language-algebra identities wholesale. [source-verification note](#source-verification-gaps)

This creates a hierarchy:

`language-equivalence MR`
is weaker than
`first-match-equivalence MR`
is weaker than
`capture-equivalence MR`.

That hierarchy should be encoded into the MR registry.

### Semantic IR property classes

STRling's schema gives many structural properties directly, while other invariants require semantic analysis. [source-verification note](#source-verification-gaps) Recommended property families are:

| Property class | Candidate properties |
|---|---|
| **Schema/shape** | Every generated artifact validates against the exact IR schema; every node kind has required members; alternatives have the required arity; literals and class items obey representation rules; a backreference selects exactly one reference form. |
| **Quantifier** | `min >= 0`; finite `max >= min`; fixed quantifiers report equal min/max width where child width is fixed; normalization never changes greedy/lazy/possessive mode accidentally. |
| **Capture environment** | Names/indices satisfy STRling's uniqueness/reference rules; renaming with a bijection preserves behavior; removal or insertion of noncapturing groups cannot change capture numbering. |
| **Width/nullability** | Independently computed `nullable`, minimum width, maximum/fixed width agree with generated witnesses; fixed-width lookbehind requirements are enforced in the portable core. |
| **Character semantics** | Ranges are valid semantic ranges; class membership matches a small independent character-set evaluator; negation is complement relative to the defined character universe. |
| **Flags** | Flags irrelevant to the actual node set do not change semantics; relevant flags exercise specifically generated discriminating subjects. |
| **Diagnostics** | Invalid semantic inputs fail deterministically at the intended stage; unsupported target constructs cannot silently lower to weaker semantics. |
| **Determinism** | Same IR plus same emitter configuration yields byte-identical emitted artifact and diagnostics, matching STRling's emitter architecture. [source-verification note](#source-verification-gaps) |
| **Serialization** | Canonical IR serialization/deserialization preserves structure and semantic attributes where serialization is defined as lossless. |
| **Bounded denotation** | Independent IR evaluator and emitted target agree for every string in a generated bounded alphabet/length domain. |
| **Witness consistency** | Every claimed positive witness actually satisfies the generated node; every claimed negative witness fails when the generator marks it definitive. |

### Target-lowering property classes

The target compilation contract should be stronger than “the emitted regex compiled.”

For every IR/target pair classified as supported:

`emit(IR, profile)` must produce syntax accepted by that target profile **and** execution should refine the STRling semantics being promised.

For unsupported semantics, the correct property is often the opposite:

`emit(IR, incapable-profile)` must **reject**, rather than return a syntactically valid but semantically weaker regex.

Candidate target properties include:

| Property | Validation mechanism |
|---|---|
| Emitted syntax is accepted whenever artifact has no error diagnostic. | Native target compiler. |
| Unsupported core/extension mismatch cannot disappear silently. | Capability oracle plus diagnostic property. |
| Match/no-match behavior preserves IR bounded denotation. | Independent IR evaluator + bounded subjects. |
| Match start/end preserves semantic positions after unit normalization. | Adapter normalization plus generated non-BMP subjects. |
| Capture count, names, participation, and captured text preserve the declared mapping. | Generated capture-sensitive subjects. |
| Nullability and minimum consumed length are preserved. | Static IR analysis plus execution on boundary strings. |
| Greedy/lazy behavior is preserved where observable. | Ambiguous generated inputs specifically designed to distinguish them. |
| Anchor semantics are preserved under multiline/newline configuration. | Generated line-terminator matrix. |
| Unicode class/property intent is preserved or produces the mandated diagnostic. | Generated code points chosen across relevant Unicode partitions. |
| Emission is deterministic. | Repeat compilation/hash comparison. |
| Semantics-preserving IR normalizations commute with emission. | MR: `exec(emit(IR)) == exec(emit(transform(IR)))`. |

The Unicode cases deserve especially heavy weighting because STRling intentionally promises Unicode-first semantics while target engines expose materially different policies. [source-verification note](#source-verification-gaps) PCRE2's documented `UCP` behavior and ECMAScript's word-character definition demonstrate why “both engines support `\w`” is not enough to establish portability. [source-verification note](#source-verification-gaps)

## Stage-specific validation for STRling and Regex Conformance

STRling's existing architecture makes **compiler-stage differential testing** particularly attractive. The repository already has many language bindings, while the architectural contract centralizes parse/IR/emit semantics. [source-verification note](#source-verification-gaps) Cross-binding comparison should therefore distinguish structural agreement from semantic agreement rather than merely compare final regex strings.

| Boundary | Generated input | Primary validators | Defects targeted |
|---|---|---|---|
| **DSL → AST** | Grammar-generated and intentionally malformed source | Grammar invariants; parse-success/rejection properties; AST equivalence under source-level MRs; cross-binding AST normalization | Tokenization, precedence, escaping, free-spacing, source-range defects |
| **AST → Semantic IR** | Valid ASTs plus semantically invalid ASTs | IR structural properties; capture/width analyses; frontend metamorphic relations; cross-binding IR comparison; bounded source-vs-IR semantics | Lost flags, wrong grouping, capture allocation, invalid construct acceptance, incorrect semantic normalization |
| **Semantic IR → target artifact** | Constructively generated IR | Capability property; translation-validation-lite; emitter determinism; target compilation; target-specific MRs | Wrong escaping, precedence/grouping, flag lowering, Unicode lowering, unsupported-feature handling |
| **Target artifact → engine result** | Jointly generated subjects | Normalized execution, bounded reference oracle, MR checks, portable differential testing | Engine bugs and emitter-engine interaction errors |
| **Version N → version N+1** | Minimized generated regression corpus | Cross-version semantic differential under unchanged profile | STRling or engine regressions |
| **Binding A → binding B** | Same source or canonical IR | AST/IR canonical comparison and final semantic execution | Binding-specific semantic compiler defects |

The most valuable new mechanism for the frontend compiler would be **per-case semantic translation validation**. Rather than assert only that a known DSL string produces a known IR JSON document, independently evaluate enough semantics on both sides to determine that the transformation is sound for that case. The original translation-validation formulation specifically advocates checking the correctness of each translator run rather than proving the translator universally. [source-verification note](#source-verification-gaps)

For STRling this need not begin with a theorem prover. An operational version can be:

1. Generate a DSL/AST from a semantic construction whose intended bounded behavior is known.
2. Compile it to Semantic IR.
3. Independently evaluate the IR over the associated witness/bounded subject set.
4. Execute one or more applicable target lowerings.
5. Verify all promised semantic observations agree.

The generator itself must not be the only source of truth. For high-value properties, derive expectations through a structurally independent component—for example a simple IR evaluator rather than the production emitter.

This would address an important limitation in the current shared-spec/golden architecture. STRling's test design describes a JavaScript reference implementation generating JSON AST goldens consumed by other bindings. [source-verification note](#source-verification-gaps) **Inference:** that is excellent for cross-binding consistency, but a defect in the reference semantics can become a common-mode expected result. Generated properties, independent bounded semantics, and MRs should therefore sit alongside—not replace—the reference goldens.

### Regex Conformance

Regex Conformance should consume generated testing differently from STRling's internal CI.

Its README says the project measures what precisely identified runtimes do under controlled conditions and intentionally does not transform observations into standards guarantees. It also insists that applicability prevent meaningless Cartesian-product expansion. [source-verification note](#source-verification-gaps) Those principles are exactly right for generated differential testing.

Generated discovery should therefore be organized as:

`generator → semantic coordinate → applicability → execution profiles → observations → differential classifier`

not:

`generator → every engine → compare raw strings → mark losers`

The repository already gives appropriate homes for the pieces: campaign definitions can freeze generated input references/policy, vectors can represent executable semantic questions, applicability can exclude meaningless target coordinates, and adapters can translate/normalize native observations. [source-verification note](#source-verification-gaps) [source-verification note](#source-verification-gaps) [source-verification note](#source-verification-gaps) [source-verification note](#source-verification-gaps)

For Regex Conformance, the most useful generated families are not unrestricted arbitrary regexes. They are **feature-isolating and feature-interaction families** such as:

`Unicode word semantics × case-insensitive × boundary`;
`alternation overlap × greediness × capture`;
`empty-match quantifier × global iteration API`;
`lookbehind width × Unicode code-point width`;
`named capture × optional branch × backreference`;
`anchor × multiline × each line-terminator class`.

That yields interpretable differential findings while still exploring combinations humans are poor at enumerating manually.

Cross-version campaigns should reuse minimized generated coordinates whenever an engine upgrade occurs. A changed observation is then a **version differential** to classify, not automatically a regression. Whether it is wrong depends on the versioned profile/specification contract.

## Shrinking, reproducibility, and failure handling

Generated testing becomes operationally useful only when a failure can be reduced to something a developer can understand.

Delta debugging established the general approach of repeatedly simplifying an input while retaining the failing condition. [source-verification note](#source-verification-gaps) Compiler-reduction research then showed why generic substring deletion is insufficient: it often creates invalid programs or leaves excessively large cases, motivating language-specific transformations in C-Reduce. [source-verification note](#source-verification-gaps) Perses subsequently demonstrated that syntax-guided reduction can avoid wasting attempts on syntactically invalid candidates while remaining language-general. [source-verification note](#source-verification-gaps)

STRling should go further and use **semantic dependency-aware reduction**.

The reducer's predicate must be the original failure condition, not merely “something still fails.” Examples:

```text
Differential failure:
  PCRE2 normalized result != ECMAScript normalized result
  AND applicability remains portable
  AND disagreement class remains MATCH_SPAN

Metamorphic failure:
  MR_CAPTURE_ALPHA_RENAME preconditions remain true
  AND normalized base/follow-up relation remains violated

Compiler property:
  emitted pattern compiles
  AND bounded IR semantics != target semantics

Diagnostic failure:
  input remains semantically invalid for rule X
  AND compiler still accepts it
```

Preserving a coarse predicate such as “non-zero exit” risks shrinking a semantic miscompilation into an unrelated parser crash.

Reduction should jointly minimize **all dimensions that participate in the failure**:

`IR/source + subject string(s) + flags + target configuration + engine set + metamorphic transform`

A practical reduction order is:

| Reduction domain | Examples |
|---|---|
| **Engine/profile set** | Reduce N disagreeing implementations to the smallest discriminating pair; drop irrelevant configuration flags. |
| **IR tree structure** | Delete sequence elements, branches, wrappers; hoist children where type-compatible; replace subtrees with simpler nodes. |
| **Semantic features** | Remove irrelevant captures, assertions, flags, Unicode constructs, quantifier modes. |
| **Identifiers/dependencies** | Rename and compact capture names; safely renumber/rewrite references after group deletion. |
| **Values** | Reduce quantifier bounds toward 0/1; shrink Unicode values toward representative boundaries; shorten literals. |
| **Subject strings** | Delta-debug code points, then simplify code points while retaining semantic classes required by the defect. |
| **Source syntax** | After semantic reduction, simplify spelling/escaping while preserving the same AST/IR and failure. |

Alternating pattern and subject reduction is better than minimizing one to completion first. A regex fragment may become removable only after the subject shrinks; a subject character may become removable only after a branch disappears.

For capture/backreference cases, reduction must track dependency edges. Removing capture `G` requires either proving no reference remains or rewriting/removing dependent backreferences. Blind AST deletion will otherwise spend most attempts generating semantic invalidity.

For MRs, the reducer must reduce the **source case**, then regenerate the related case through the registered transform whenever possible. Independently reducing both sides can accidentally destroy the relationship being tested.

### Generated-test reproducibility

The scope here is only the information required to reproduce generated behavior, not long-term evidence certification. A generated failure should carry at least:

| Item | Reason |
|---|---|
| Generator seed | Replays randomized choices where the generator remains identical. |
| Generator implementation/version or commit | Seeds are meaningless across changed decision algorithms. |
| Grammar/schema/semantic-spec version | Determines what “valid” meant when generated. |
| Generation mode and feature/capability constraints | Explains why the case was generated and its intended semantic domain. |
| Serialized original generated source/IR and subjects | Replay must not depend solely on reconstructing pseudorandom choices. |
| Generation decision trace, where practical | Helps debug generator bugs and recover cases after generator evolution. |
| MR/property identifier and version | Defines the actual failure predicate. |
| MR precondition evaluation | Proves why a relational comparison was considered meaningful. |
| Engine/compiler identity and behaviorally relevant profile | Required to distinguish semantic change from reproduction failure. |
| Observation operation and normalization rules | Prevents search/full-match/index-unit ambiguity. |
| Timeout/resource configuration | Required when the failure involves execution limits. |
| Reducer version and minimized result | Allows checking whether later reducer changes alter the reproducer. |

A random seed alone is not sufficient reproducibility. Changing random-number consumption in one branch can cause the same seed to generate a completely different tree.

### Nondeterminism

Regex matching results should normally be treated as deterministic **within a fully identified semantic profile**, but generated testing infrastructure can still be unstable through timeouts, resource exhaustion, JIT behavior, concurrent harness code, locale/configuration leaks, or flaky external processes. PCRE2 and other engines also expose many behaviorally relevant configuration options, underscoring the need to pin the profile rather than assume engine name determines semantics. [source-verification note](#source-verification-gaps)

Before reduction, re-execute the failure enough to establish whether the semantic predicate is stable. Stable and unstable failures should go into separate queues. A reducer designed around a deterministic predicate will behave badly on a flaky timeout.

For genuinely probabilistic failures, reduction can use a statistical predicate such as “failure observed repeatedly under the same controlled coordinate,” but such a result should remain classified as nondeterministic rather than silently promoted to an ordinary semantic contradiction.

### Mutation testing of the testing system

STRling should maintain a small hand-designed set of **semantic compiler mutants**. Examples include:

`Greedy ↔ Lazy`;
`quantifier max off by one`;
`forget noncapturing wrapper needed for precedence`;
`drop Unicode-property mode`;
`map \w to native target shorthand where target semantics differ`;
`emit $ where absolute end was required`;
`reverse alternation branches`;
`misnumber a nested capture`;
`treat an unset backreference as empty`;
`omit an unsupported-feature error`;
`encode a non-BMP literal incorrectly`.

The question is not “does the test suite achieve 100% mutation score?” It is: **does each important semantic defect model have at least one independent generated-validation mechanism capable of detecting it?**

Surviving mutants identify missing generators, weak witness selection, or missing properties. A killed mutant demonstrates sensitivity to that modeled defect, not correctness of the real compiler.

## Recommended layered architecture and unresolved questions

The strongest architecture is a set of independently failing layers rather than a single fuzz harness.

| Layer | Mechanism | Primary oracle/signal | Purpose |
|---|---|---|---|
| **Contract layer** | Schema, semantic-validator, width/capture/capability checks | Exact executable properties | Reject malformed IR and validate local semantics cheaply. |
| **Bounded semantics layer** | Independent Semantic IR evaluator + bounded exhaustive/witness inputs | Strong bounded oracle | Catch frontend and lowering defects without another production engine. |
| **Transformation layer** | Registered MRs and regex-EMI variants | Relational oracle | Find common-mode semantic defects and transformation errors. |
| **Translation layer** | Per-compilation source/IR/target validation | Bounded refinement relation | Validate AST→IR and IR→target semantics directly. |
| **Differential layer** | Cross-binding, cross-target, cross-engine, cross-version execution | Differential signal after applicability/normalization | Discover disagreement requiring adjudication. |
| **Exploration layer** | Constructive generation, grammar-aware mutation, semantic corpus splicing, coverage guidance | Coverage/novelty signals feeding all oracle layers | Reach combinations hand-authored tests seldom exercise. |
| **Triage layer** | Repetition, failure classification, semantic reduction, regression promotion | Stable exact failure predicate | Convert generated noise into minimal actionable defects. |

This architecture follows the strongest recurring lesson from compiler testing research: generation quality and oracle quality must be engineered together. Csmith constrained generation so differential comparisons remained meaningful; EMI deliberately weakened equivalence to the concrete input domain; coverage-guided property testing retains rare cases satisfying sparse semantic conditions; grammar-aware fuzzers use syntax to penetrate front ends; and translation validation independently checks individual compiler transformations. [source-verification note](#source-verification-gaps)

### Research-backed priorities for STRling

**Build the Semantic IR generator before a generic regex-text fuzzer.** STRling's principal semantic risk is compiler transformation, not merely parser crash behavior. Constructive IR generation makes capture environments, width, nullability, target capabilities, and transformation preconditions directly observable. Research on structured and effect-directed generation strongly favors such semantically constrained construction over high-rejection random generation. [source-verification note](#source-verification-gaps)

**Create an independent executable semantics for a deliberately small portable core.** Do not wait until every backreference and lookaround feature can be modeled. A trustworthy evaluator for literals, classes, sequence, alternation, ordinary repetition, groups, and carefully selected anchors immediately provides a high-value oracle for hundreds of generated transformation combinations. Translation-validation experience suggests that bounded partial validators can find substantial defect classes even when intentionally incomplete. [source-verification note](#source-verification-gaps)

**Make every MR a typed registry entry, not an informal code transformation.** An MR definition should contain its applicable IR subset, observation level, precondition predicate, transform, result relation, and reducer behavior. This prevents the most dangerous metamorphic-testing anti-pattern: silently assuming an algebraic regex-language identity preserves captures or leftmost-first match selection.

**Use differential testing only after applicability.** Regex Conformance already has exactly the right conceptual boundary: applicability should determine meaningful coordinates before execution. [source-verification note](#source-verification-gaps) The generated-testing system should extend that rather than create a parallel raw-engine-comparison layer.

**Make semantic normalization explicit.** Store/compare at least compile status, match status, match interval in a canonical unit, capture participation/content, relevant named-capture mapping, diagnostics, and operation semantics. Native representations should never be compared directly when engines use different index or capture conventions.

**Deliberately generate discriminator strings.** A regex with no carefully chosen input often does not test its interesting semantics. Subject generation should search for strings that distinguish greedy from lazy, branch A from branch B, Unicode class A from ASCII class A, match from near miss, minimum repetition from one-less, and end-anchor conventions. This is one of the most important differences between “random regex generation” and semantic testing.

**Combine systematic small-scope enumeration with fuzzing.** Exhaustive combinations of small IR skeletons can explore interactions much more reproducibly than unrestricted randomness. Compiler-testing results from Skeletal Program Enumeration show the value of exhaustively exploring small structural spaces rather than assuming greater test size means greater defect-finding power. [source-verification note](#source-verification-gaps)

**Feed interesting regression fragments back into mutation.** Maintain a semantic fragment bank from historical STRling/engine defects, similar in spirit to LangFuzz's reuse of previously interesting fragments, then splice them only into semantically compatible IR contexts. [source-verification note](#source-verification-gaps) This should include minimized cases, not huge original fuzz outputs.

**Use coverage as a search heuristic, never as the correctness criterion.** Coverage can guide the generator toward unexplored implementation paths, but semantic novelty should also include feature-interaction, diagnostic, match-outcome, and MR coverage. Coverage-guided property testing demonstrates the value of coverage for escaping sparse generator regions, not as an oracle. [source-verification note](#source-verification-gaps)

**Promote stable minimized findings into ordinary regressions.** Fuzzing should continuously enrich the deterministic suite. Delta-debugging and compiler-reduction literature strongly support automated reduction as part of the testing loop, rather than asking developers to interpret large generated failures. [source-verification note](#source-verification-gaps)

### Anti-patterns that will produce meaningless volume

| Anti-pattern | Why it fails |
|---|---|
| Random bytes as the main DSL/regex strategy | Mostly measures parser rejection and fails to exercise semantic compiler paths; structured-input fuzzing research repeatedly demonstrates this barrier. [source-verification note](#source-verification-gaps) |
| Random schema-shaped JSON followed by massive rejection | Spends generation budget discovering invariants the generator should already know. |
| Grammar-valid equals useful | Semantically ambiguous/undefined/inapplicable inputs poison differential signals, as compiler-testing research demonstrates. [source-verification note](#source-verification-gaps) |
| Comparing every pattern against every engine | Regex Conformance explicitly designed applicability to prevent meaningless Cartesian expansion. [source-verification note](#source-verification-gaps) |
| Treating majority engine behavior as truth | Shared implementation traditions and common semantics can all be wrong relative to STRling's contract; differential agreement is evidence, not oracle. |
| Comparing native result objects directly | Conflates representation/API differences with semantic disagreement. |
| Using all algebraic regex identities as capture-preserving MRs | Classical language equivalence does not guarantee leftmost-first match/capture equivalence. STRling explicitly specifies leftmost-first matching. [source-verification note](#source-verification-gaps) |
| Measuring only code coverage | Rewards syntactic novelty even when semantic behavior is redundant. |
| Generating only matching inputs | Misses boundary rejection, failed lookaround/backreference paths, anchors, and one-past-quantifier cases. |
| Generating only huge/deep patterns | Makes reduction expensive and often obscures small feature-interaction defects; small-scope compiler enumeration has found long-latent defects. [source-verification note](#source-verification-gaps) |
| One implementation produces all generated expected outputs | Creates a common-mode oracle: every consumer faithfully reproduces the reference's mistake. |
| Shrinking until “anything fails” | Changes a semantic defect into an unrelated error and destroys diagnostic value. |
| Recording only a seed | Generator code changes can reinterpret the seed; serialized cases and generator identity are required for practical replay. |
| Mixing invalid DSL, invalid semantics, and unsupported-target cases | Makes rejection statistics uninterpretable and hides wrong-stage acceptance/rejection defects. |

### Unresolved questions

| Question | Why it must be decided |
|---|---|
| **What exactly is STRling's canonical observable semantics?** Boolean membership, first-match span, all captures, names, iteration behavior, or some combination? | Every MR and cross-engine comparator needs an observation level. |
| **Where is the authoritative boundary between internal Semantic IR and TargetArtifact?** | Generator and translation-validator ownership should follow the real compiler stages rather than accidentally treating a serialization schema as the entire semantic model. |
| **Which Unicode version and property database are normative for a STRling semantic coordinate?** | Engines can use different Unicode revisions; this can otherwise masquerade as a lowering defect. |
| **How strong is STRling's promise when an emitter issues a warning?** Is the emitted result still required to preserve semantics, approximately preserve them, or merely be executable? | Target-lowering properties cannot be stated without this distinction. |
| **What are the exact semantics of duplicate named captures, unmatched captures/backreferences, forward references, and repeated captures?** | These are high-value cross-engine differential areas and must either be normalized by STRling or excluded from portable comparison. PCRE2 alone exposes configurable behavior in several of these areas. [source-verification note](#source-verification-gaps) |
| **What is the exact portable lookbehind contract?** | Fixed-width checking needs a formally testable width analysis, especially around Unicode code points and target code units. |
| **Which operation semantics does Regex Conformance normalize across hosts?** | Search, match, full-match, global iteration, and empty-match advancement can differ independently of regex-language semantics. |
| **How should source ranges behave through semantic normalization?** | If diagnostics/source positions are part of the frontend contract, source-level MRs need separate observational relations from pure semantic MRs. |
| **How large should the independently interpreted Semantic IR subset become?** | Expanding it improves oracle strength but increases risk that the “independent” evaluator simply reproduces production complexity and bugs. |
| **Should generated exploratory cases become ordinary Regex Conformance vectors immediately, or only after minimization and semantic classification?** | The repository explicitly says a vector asks a question rather than making a normative claim; discovery cases should retain that distinction. [source-verification note](#source-verification-gaps) |

The answer to the primary question is therefore not “fuzz more.” STRling can systematically find semantic defects that example-based unit tests miss by **generating small but semantically rich IR structures, co-generating discriminating subject strings, checking independent properties at every compiler boundary, applying only preconditioned metamorphic relations, using bounded executable semantics wherever a complete oracle is feasible, treating cross-engine/version disagreement as a signal rather than a verdict, steering valid mutations with structural and semantic coverage, and automatically shrinking every stable finding into the smallest case that preserves the original semantic contradiction**. The existing Parse → IR → Emit architecture and Regex Conformance applicability/observation boundaries provide unusually good foundations for this approach. [source-verification note](#source-verification-gaps) [source-verification note](#source-verification-gaps) Recent regex-specific ReTest research independently supports the combination of grammar awareness and metamorphic validation, while decades of compiler-testing work explain why defined semantics, input-aware equivalence, independent translation validation, and structure-preserving reduction are necessary to make generated volume scientifically useful rather than noisy. [source-verification note](#source-verification-gaps)
