# Regex Equivalence, Containment, Witness Generation, and Rewrite Verification for STRling

Role: Research report
Origin: AI-assisted deep-research session commissioned for STRling Research Intelligence; the underlying sources, not the AI system, are the evidence authorities.
Generated: 2026-08-12
Imported: 2026-08-12
Source verification: Partially verified
Last reviewed: 2026-08-12
Current status: Active input

## Source verification gaps

Core boundaries were partially checked against [Brzozowski's derivative paper](https://dl.acm.org/doi/10.1145/321239.321249), [Antimirov's partial derivatives](https://doi.org/10.1016/0304-0208(95)00058-H), [ECMAScript RegExp semantics](https://tc39.es/ecma262/multipage/text-processing.html#sec-patterns), [Unicode Technical Standard #18](https://www.unicode.org/reports/tr18/), [PCRE2 pattern documentation](https://www.pcre.org/current/doc/html/pcre2pattern.html), [translation validation](https://doi.org/10.1007/BFb0055132), and [Alive2](https://alive2.llvm.org/). Current STRling architecture was rechecked at [`9991575`](https://github.com/strling-lang/strling/tree/9991575b347ac5f56108f18065c88b2b16a5065a).

The original research-session marker map is unavailable. Unreconstructed markers link here. Exact complexity classifications for specialized fragments, individual tool capabilities, proof-kernel claims, and profile-drift examples require claim-level verification. The proposed proof-status vocabulary and evidence schemas remain candidate models, not STRling contracts.

## Executive findings and STRling baseline

The central conclusion is that **“regex equivalence” is not one problem**. STRling can make a defensible equivalence claim only after fixing three things:

\[
\text{claim} = (\text{semantic profile},\ \text{observation being preserved},\ \text{input domain})
\]

For classical regular-language semantics, equivalence and containment are decidable. For deterministic automata they are straightforward graph problems; for regular expressions and NFAs they remain decidable but are PSPACE-complete in the general case. Derivatives, partial derivatives, automata, antichains, symbolic automata, and SMT-backed symbolic methods provide several practical implementations of that theory. [source-verification note](#source-verification-gaps)

The situation changes once the required observation is stronger than language membership. Leftmost-first versus leftmost-longest choice, greedy versus lazy repetition, capture participation, capture spans, zero-width assertions, global iteration, and replacement behavior can distinguish expressions that accept exactly the same classical language. ECMAScript explicitly resolves alternatives in order, while POSIX defines a leftmost-longest policy; tagged deterministic finite automata exist precisely because ordinary DFAs do not retain the information required for submatch extraction and disambiguation. [source-verification note](#source-verification-gaps)

Backreferences are the principal theoretical boundary in STRling's current language. They make the regex formalism strictly more expressive than regular languages, and unrestricted equivalence and containment are undecidable—even restricted extended regular expressions with only a single variable/backreference inherit those undecidability results. Restricted backreference classes can regain useful matching algorithms, but this does not rescue general equivalence. [source-verification note](#source-verification-gaps)

A crucial asymmetry follows:

> **A single valid counterexample can formally refute an equivalence claim even when no general proof procedure exists. Absence of counterexamples is a proof only when the search was complete for the declared semantic model and domain.**

This should be a foundational distinction in STRling's compiler and Audit/Compare terminology.

STRling is structurally well positioned for this. Its documented architecture is explicitly Parse → Compile to a target-independent IR → Emit, and emitters are intended to be deterministic functions of the model and configuration. Its EBNF and semantics documents are described as jointly normative. That gives STRling natural semantic boundaries at which both rewrite validation and translation validation can be performed. [source-verification note](#source-verification-gaps)

The current normative semantics also already recognize many of the dimensions that proof evidence must pin: Unicode versus code-unit behavior, Unicode shorthands, newline behavior, leftmost-first matching, greedy/lazy quantifiers, capturing groups, backreferences, lookarounds, and target incompatibilities. [source-verification note](#source-verification-gaps) [source-verification note](#source-verification-gaps) [source-verification note](#source-verification-gaps)

There is, however, an important **semantic-profile drift finding** in the repository. The checked-in semantics text describes PCRE2 and ECMAScript lookbehind as fixed-length-only. Current PCRE2 documentation says that since PCRE2 10.43, `pcre2_match()` supports bounded variable-length lookbehind, with a configurable maximum and a default of 255 characters. ECMAScript's standardized lookbehind semantics instead evaluate the enclosed expression backwards and admit normal quantified terms rather than imposing a fixed-length-only grammar. [source-verification note](#source-verification-gaps) [source-verification note](#source-verification-gaps)

That discrepancy is not merely documentation housekeeping. It demonstrates exactly why **rewrite evidence must be attached to a versioned semantic profile rather than to an engine name such as “PCRE2” or “JavaScript.”** A theorem proved against one engine profile can become stale when an engine's semantics or supported subset changes.

The primary answer can therefore be summarized as follows:

| STRling semantic subset | What can be established | Appropriate evidence |
|---|---|---|
| Classical regular expressions, fixed alphabet/profile | Exact language equivalence and containment | Complete automata/derivative decision procedure |
| DFA representation | Exact language equivalence/containment, practical shortest witnesses | Product reachability / bisimulation-style certificate |
| NFA or ordinary regex representation | Exact language equivalence/containment, worst-case PSPACE-complete | On-the-fly subset, antichain, derivative or equivalent complete procedure |
| Regular expressions with symbolic Unicode predicates | Exact language equivalence/containment when predicate theory is decidable | Symbolic automata/derivatives plus predicate solver |
| Captures, no backreferences | Language proof remains regular; capture proof needs tagged/output-aware semantics | TDFA or a conservative tagged-transducer equivalence certificate |
| Regular lookarounds without non-regular contents | Language-level reduction to regular operations is possible under a fixed assertion model; selection/capture proof is richer | Assertion-aware automata/derivatives plus tagged semantics where captures matter |
| Backreferences | General equivalence and containment undecidable | Restricted-fragment theorem, otherwise counterexamples/bounds/evidence only |
| Any computable regex semantics over a declared finite input domain | Exact equivalence **within that finite domain** | Exhaustive bounded verification |
| Arbitrary engines with incomplete formal models | No universal proof from tests alone | Differential/property evidence, explicitly non-proof |

The intellectual requirement should therefore be stated even more strongly than the proposed wording:

> **STRling must record the semantic relation it proved, the semantic profiles on both sides, the proof domain and assumptions, the method that established the claim, and enough evidence to reproduce or independently check either the proof or the counterexample.**

## Semantic contract and taxonomy of equivalence strength

A rigorous STRling equivalence API should start from an observation function rather than from pattern text.

Let:

- \(r\) be a regex or semantic IR;
- \(P\) be a fully specified semantic profile;
- \(D\) be the declared subject-string domain;
- \(O\) be an observable;
- \(\llbracket r\rrbracket_{P,O}(x)\) be the observable result of applying \(r\) to subject \(x\).

Then the useful generic definition is:

\[
r_1 \equiv_{P_1,P_2,O,D} r_2
\quad\Longleftrightarrow\quad
\forall x\in D,\;
\llbracket r_1\rrbracket_{P_1,O}(x)
=
\llbracket r_2\rrbracket_{P_2,O}(x)
\]

Using separate \(P_1\) and \(P_2\) is important for migration. A rewrite within STRling may use the same abstract profile on each side; a migration from PCRE2 to ECMAScript is inherently a **cross-profile** equivalence question.

### Accepted-language equivalence

For classical formal-language purposes:

\[
L_P(r)=\{x\mid r\text{ accepts all of }x\}
\]

and:

\[
r_1\equiv_L r_2 \iff L(r_1)=L(r_2)
\]

\[
r_1\subseteq_L r_2 \iff L(r_1)\subseteq L(r_2)
\]

This is the notion for which the strongest classical theory exists. Regular expressions, DFAs, NFAs, and equivalent finite-state representations all characterize regular languages. Derivative constructions produce finite-state recognizers directly from expressions; Antimirov's partial derivatives provide the analogous NFA-oriented construction. [source-verification note](#source-verification-gaps)

STRling should not use the word **language** without also specifying the matching mode. Classical \(L(r)\) normally describes whole-string acceptance. Real APIs often perform unanchored search. “There exists some match somewhere in the subject” is another Boolean property, but it is not the same relation as classical full-match language equality. Anchors and multiline behavior make this distinction particularly important.

### Match-selection equivalence

A backtracking or prioritized engine can have several possible parses or candidate matches for the same subject. A semantic policy chooses one.

Define `selection-equivalent` to mean that the same disambiguated successful derivation is selected—same start point, alternative/repetition decisions, and other policy-sensitive choices—under the declared policy.

This is deliberately stronger than merely asking whether both patterns can match.

ECMAScript's formal semantics illustrates why this exists: alternatives are tried left-to-right, and `/a|ab/.exec("abc")` chooses `a`, not the longer `ab`. POSIX instead specifies the earliest match and then the longest match beginning there, recursively applying longest-match principles to subexpressions. [source-verification note](#source-verification-gaps)

### Span equivalence

Define:

\[
\operatorname{span}_P(r,x)=(start,end)
\]

for the selected match, including a distinguished value for no match.

`span-equivalent` requires the same selected whole-match offsets on every subject in the domain.

This is observably stronger than language membership but weaker than capture equivalence. Two patterns can find the same substring while arriving there through different alternatives and producing different captures.

For migration work, the coordinate system is part of the relation. A “span” measured in UTF-16 code units is not directly the same observation as a span measured in Unicode code points. ECMAScript internally distinguishes code-unit and code-point handling according to Unicode flags, while STRling's semantics document states that source diagnostics use UTF-32 code-point indices and expresses a code-point-oriented regex intent. [source-verification note](#source-verification-gaps) [source-verification note](#source-verification-gaps) [source-verification note](#source-verification-gaps)

### Capture equivalence

A useful capture observation is not merely a list of strings. It should include:

\[
\operatorname{captures}(r,x)
=
[(id_i,\ participated_i,\ start_i,\ end_i,\ text_i)]_i
\]

where the capture identity includes whatever the relevant API exposes: numeric group position, symbolic name, or both.

This matters because capturing-group numbering, nonparticipation, repeated capture semantics, captures inside assertions, and alternative choice are externally visible. ECMAScript's specification explicitly carries a capture vector through matching; alternatives not taken produce undefined capture values, and quantified atoms clear relevant captures between iterations. [source-verification note](#source-verification-gaps)

The research on tagged DFAs provides a practical finite-state basis for regular capture semantics. TDFA augment ordinary DFA recognition with tags/registers and formalize both leftmost-greedy and POSIX disambiguation, including repeated submatches. [source-verification note](#source-verification-gaps)

That does **not** mean a plain DFA language-equivalence result automatically proves capture equivalence. STRling needs a tag/output-aware proof relation.

### Operation equivalence

The strongest useful notion is contextual operation behavior:

\[
\operatorname{Op}_{P}(r,x,c)
\]

where \(c\) includes operation-specific context such as replacement text, split limit, iteration/global state, starting offset, or API mode.

Examples include:

- `test` / Boolean search;
- first-match extraction;
- `findall` / `matchAll`;
- global iteration;
- replacement;
- split;
- APIs exposing group spans or match indices.

A replacement operation can distinguish two regexes that have identical whole-match spans if captures differ. A global iteration API can distinguish patterns with the same first match if zero-width advancement rules differ. ECMAScript, for example, has explicit `AdvanceStringIndex` and RegExp string-iterator semantics rather than reducing iteration to a single language-membership predicate. [source-verification note](#source-verification-gaps)

The research literature independently reinforces this boundary. Work on repairing regexes for **extraction** found that nondeterministic membership semantics were insufficient: extraction depends on deterministic engine behavior and required an operational semantics that respects actual disambiguation. [source-verification note](#source-verification-gaps)

The resulting STRling taxonomy should therefore be a set of named relations, not a single linear “equivalence strength” flag:

| Relation | Equality required | Typical sufficient use |
|---|---|---|
| `language-equivalent` | Same declared whole-string acceptance set | Pure validators/recognizers |
| `search-existence-equivalent` | Same Boolean “has a match” result | Search used only as predicate |
| `selection-equivalent` | Same disambiguated match derivation under policy | Policy-sensitive compilation |
| `span-equivalent` | Same selected whole-match start/end | Search/extraction when groups are irrelevant |
| `capture-equivalent` | Same whole match and capture identities, participation and values/spans | Extraction, capture APIs |
| `iteration-equivalent` | Same sequence of selected matches and captures | Global matching / `findall` |
| `operation-equivalent(op)` | Same externally visible result for the declared operation and context | Replacement, splitting, API migration |

These relations form a **partial structure, not one universal ladder**. For example, identical visible spans do not imply identical capture allocation; identical language membership says almost nothing about which leftmost-first match a search API chooses.

Accordingly, a STRling result should say something like:

> `FORMALLY_PROVEN: span-equivalent under STRling-v3 / ECMAScript-2026 profile, Unicode 17.0, flags u,i, first-match search`

rather than:

> `Equivalent`

## Decidability and computational boundaries

The core theoretical boundary is sharp enough to guide an implementation dispatcher.

| Fragment | Language equivalence / containment | Stronger observable equivalence | Practical consequence for STRling |
|---|---|---|---|
| DFA over fixed finite alphabet | Decidable in polynomial time | Captures absent unless representation enriched | Preferred proof kernel after successful finite-state lowering |
| NFA | Decidable; equivalence and containment PSPACE-complete in general | Plain NFA loses policy/captures | Use on-the-fly subset/antichain techniques rather than eager determinization where possible |
| Classical regex: union, concatenation, star | Decidable; PSPACE-complete in general | Greediness/captures are outside classical language semantics | Derivatives or automata give exact language proof |
| Succinct counted repetition | Still denotes regular languages, but succinctness can dramatically worsen complexity and state explosion | Same caveats as above | Do not use expanded-regex size as the complexity metric |
| Boolean extended regex: intersection/complement | Still regular | Still language-only unless policy information retained | Derivatives handle Boolean operators particularly naturally |
| Symbolic alphabet + decidable Boolean predicate theory | Decidable finite-state analysis | Output semantics require symbolic transducer/tag layer | Strong fit for Unicode/property classes |
| Regular-only lookaround/assertions | Language behavior can be reduced to regular Boolean/context conditions under a fixed assertion semantics | Captures, atomicity and assertion disambiguation require richer model | Potential proof fragment, but not by deleting lookaround |
| Captures without backreferences | Acceptance language remains regular | Capture equality needs tagged/output semantics | Conservative complete/sufficient tagged checker |
| Backreferences | General equivalence, inclusion, universality and regularity undecidable | At least as difficult | Never promise unrestricted universal proof |
| Finite subject alphabet and finite length/domain | Exhaustively decidable for any terminating concrete semantics | Any chosen observable can be compared | Exact bounded verification, not an all-input theorem |

For DFAs \(A\) and \(B\), equivalence can be decided by exploring their synchronized product and testing whether any reachable pair disagrees on acceptance. Containment uses the analogous “\(A\) accepts and \(B\) rejects” bad state. With \(n\) and \(m\) DFA states and an explicit alphabet \(\Sigma\), straightforward product exploration considers at most \(nm\) state pairs and \(O(|\Sigma|nm)\) transitions.

This also gives STRling a useful exact witness bound: if two complete DFAs with \(n\) and \(m\) states differ, a shortest distinguishing input reaches a bad product state on a simple shortest path and therefore has length at most \(nm-1\). The important point is not that STRling should enumerate every string of that length; product BFS finds the witness far more efficiently. The bound establishes that witness search is complete.

NFA and regex representations are more succinct. Equivalence and containment for regular expressions, regular grammars and NFAs are PSPACE-complete; even substantial unambiguity restrictions were historically studied because the unrestricted problems are difficult despite remaining decidable. [source-verification note](#source-verification-gaps) Modern automata libraries therefore use reductions, simulation and antichain-based inclusion algorithms to avoid explicit worst-case determinization where possible; MATA, for example, includes antichain-based language-inclusion support for string-analysis applications. [source-verification note](#source-verification-gaps)

Counted repetition deserves special attention in STRling. A regex such as `(ab){1,100}` is still regular, but expanding counts can be a disastrous implementation strategy. Counting-set automata have been proposed specifically to avoid state explosion from bounded repetition during matching. [source-verification note](#source-verification-gaps) More fundamentally, the classic Meyer–Stockmeyer result showed that adding a succinct squaring operation to regular expressions causes the equivalence problem to require exponential space. Nested exact repetitions can express the same sort of succinct repeated squaring, so a STRling verifier should distinguish **semantic regularity** from **compact-representation complexity**. [source-verification note](#source-verification-gaps)

Brzozowski derivatives provide an alternative to first building a Thompson NFA and then determinizing it. The derivative \(D_a(r)\) represents the language left after consuming symbol \(a\); derivative states therefore correspond directly to deterministic automaton states. The method extends naturally to Boolean intersection and complement. [source-verification note](#source-verification-gaps) Antimirov partial derivatives instead construct a finite NFA-like family: the number of partial derivatives is bounded by one plus the number of letter occurrences in the expression under the paper's model. [source-verification note](#source-verification-gaps)

There is also strong evidence that a **verified proof kernel is realistic** rather than aspirational. Nipkow and Traytel formalized a unified framework covering multiple regular-expression equivalence procedures in Isabelle, and the Archive of Formal Proofs contains executable verified developments. Related work proves total correctness and completeness of derivative-based equivalence procedures, including extensions used for MSO-on-words reasoning. [source-verification note](#source-verification-gaps)

For Unicode-sized or conceptually infinite alphabets, explicit transition tables over individual characters are the wrong abstraction. Symbolic automata label transitions with predicates over an effective Boolean algebra; classical automata operations can then be lifted to large or infinite alphabets provided the predicate theory supports the necessary satisfiability/Boolean operations. Symbolic minimization research also demonstrates that naively lifting classical algorithms can itself create exponential alphabet-partition blowups, motivating symbolic-specific algorithms. [source-verification note](#source-verification-gaps)

Keil and Thiemann specifically give a containment algorithm for extended regular expressions with intersection and complement over infinite alphabets, using derivatives and representable character sets rather than translating everything to an explicit automaton. [source-verification note](#source-verification-gaps) Stanford, Veanes and Bjørner's symbolic Boolean derivative work likewise combines complement/intersection with arbitrary symbolic character theories and demonstrates an implementation on top of Z3. [source-verification note](#source-verification-gaps) This is especially attractive for STRling's Unicode property classes.

For assertions, a useful boundary can be derived from these regular closure properties. **Inference:** if every assertion body itself denotes a regular predicate, there are no backreferences or other non-regular dependencies, and the semantics of the position being tested is fixed, positive and negative lookaround can be represented using regular context, intersection and complement constructions. Thus language-level analysis can remain finite-state. This inference follows from regular-language Boolean closure together with the zero-width assertion semantics described by mainstream engines. [source-verification note](#source-verification-gaps) What does *not* follow is that ordinary language equivalence preserves captures or engine selection inside the assertion.

Captures themselves do not make a capture-free classical language non-regular when they are merely outputs. Tagged automata demonstrate that regular submatch extraction can remain finite-state while retaining disambiguation information. [source-verification note](#source-verification-gaps) STRling should therefore aim for a capture-aware finite-state fragment, but initially a **conservative proof procedure** is preferable to claiming a complete solution for every capture behavior in every engine.

Backreferences are qualitatively different. Freydenberger proves that practical/extended regexes with variables can denote non-regular languages and that universality, equivalence, inclusion, regularity and cofiniteness are undecidable, even with a single variable. [source-verification note](#source-verification-gaps) Research on deterministic regexes with backreferences and other restricted forms shows that useful islands of tractability exist, but those results must be treated as explicit fragment theorems, not generalized to arbitrary PCRE/JavaScript-style backreferences. [source-verification note](#source-verification-gaps)

STRling's current semantics explicitly supports numeric and named backreferences while excluding recursive patterns. [source-verification note](#source-verification-gaps) Therefore, a semantic classifier can make a strong early decision:

\[
\texttt{RegularCore}
\to
\texttt{RegularAssertions}
\to
\texttt{TaggedRegular}
\to
\texttt{NonRegular/UnsupportedForUniversalProof}
\]

A pattern's placement in the last category is **not** evidence of inequivalence. It means the general proof procedure is unavailable; the correct result is `UNRESOLVED` unless a restricted theorem, a refutation witness, or a bounded claim applies.

## Decision procedures, containment, SMT, and witness generation

The most useful architecture is not to choose “automata versus derivatives versus SMT” globally. They are interchangeable or complementary representations of closely related proof obligations.

For pure language semantics:

\[
L(R)\subseteq L(S)
\iff
L(R)\cap \overline{L(S)}=\varnothing
\]

and:

\[
L(R)=L(S)
\iff
\big(L(R)\setminus L(S)\big)
\cup
\big(L(S)\setminus L(R)\big)
=\varnothing
\]

This decomposition is particularly valuable for migrations because the two differences mean different things:

\[
L(source)\setminus L(target)
\]

contains **lost inputs**—subjects that cease to be accepted—whereas

\[
L(target)\setminus L(source)
\]

contains **newly admitted inputs**—a broadening of behavior.

A rewrite can therefore be classified more precisely than simply equivalent/not-equivalent. STRling can formally prove, for example, that a change is narrowing:

\[
L(target)\subsetneq L(source)
\]

while still refusing to call it semantics-preserving.

**Automata product checking.** For DFAs, perform BFS/DFS over synchronized state pairs. For equivalence, an accepting/nonaccepting mismatch is a counterexample state. For containment, only source-accepting/target-rejecting pairs are bad. Maintaining predecessor edges yields a concrete witness essentially for free.

A complete equivalence certificate for deterministic automata can be compact and independently checkable: a relation \(R\) containing the initial state pair, closed under every symbol/character class, with equal accepting status for every pair. For containment, require that every pair in \(R\) satisfies “if source accepts, target accepts.” A small checker can validate that certificate without trusting the search algorithm that discovered it.

**NFA checking.** Eager determinization can generate exponentially many subsets. On-the-fly subset exploration computes only what is needed, while antichain/simulation techniques can prune states according to subsumption. Modern automata tooling such as MATA incorporates antichain inclusion techniques precisely for these workloads. [source-verification note](#source-verification-gaps) The witness mechanism remains predecessor reconstruction through the discovered subset-product graph.

**Derivative checking.** Start from the pair \((r,s)\). At every residual pair, compare nullability. If one derivative accepts the empty string and the other does not, the input prefix used to reach the pair is a counterexample. Otherwise derive both expressions under each relevant alphabet class and continue. Once all derivative pairs close into already-seen equivalence classes without nullable disagreement, the explored relation is itself a coinductive equivalence certificate. This style has been formalized in theorem provers and forms the basis of several verified decision procedures. [source-verification note](#source-verification-gaps)

A recent research example, Crepe, goes even further by constructing sound and complete coinductive derivative proof objects for regex equivalence, in that case for zero-knowledge verification. It is not itself a proposed STRling dependency, but it is evidence that **portable proof artifacts for regex equivalence are technically feasible**, not merely theoretical. [source-verification note](#source-verification-gaps)

**Symbolic alphabet checking.** Instead of iterating every Unicode scalar value, compute equivalence classes/minterms of predicates that affect transitions. A transition might be labeled by a formula such as:

\[
\operatorname{Letter}(c)\land\neg\operatorname{ASCII}(c)
\]

A satisfiability solver determines whether a symbolic region is nonempty. For a counterexample, obtain a concrete model character from the predicate and append it to the current witness prefix. Symbolic automata and Rex use this general pattern with SMT-backed character predicates. [source-verification note](#source-verification-gaps)

Rex is particularly relevant as a concrete precedent: it translates .NET regexes into symbolic finite automata, supports intersection, difference, complement and equivalence operations, and its “duel” mode constructs strings from \(L(R)-L(S)\) and \(L(S)-L(R)\). [source-verification note](#source-verification-gaps) That is almost exactly the analytical witness primitive STRling Audit/Compare needs at the language level.

**Direct SMT reasoning.** Another formulation is to ask whether a distinguishing subject exists:

\[
\exists x.\;
Match(R,x)\oplus Match(S,x)
\]

For containment:

\[
\exists x.\;
Match(R,x)\land\neg Match(S,x)
\]

For a regular fragment with a complete encoding, `SAT` supplies a witness and `UNSAT` establishes equivalence or containment relative to that encoding and theory. Symbolic Boolean derivative work demonstrates regex constraints with Boolean combinations implemented over Z3, and Rex also uses Z3 for symbolic regex analysis. [source-verification note](#source-verification-gaps)

STRling should nevertheless distinguish an abstract theorem from a particular solver invocation. An SMT result should record the solver and encoding versions. `SAT` is especially attractive because the resulting witness can be replayed independently against both semantic evaluators. `UNSAT` has a larger trusted-computing base unless the solver can provide a proof artifact checked by another kernel. `UNKNOWN`, resource exhaustion or timeout is simply `UNRESOLVED`; it must never be promoted to empirical equivalence.

For capture-aware equivalence in the regular fragment, a practical first implementation can compile each side into a common **tagged deterministic representation** and check a stronger synchronized invariant:

\[
(state_1,\ registers_1)
\sim
(state_2,\ registers_2)
\]

where the checker proves not only equal acceptance, but equal externally relevant tag outputs at every successful match. TDFA research establishes how tags can represent submatch positions under leftmost-greedy and POSIX policies. [source-verification note](#source-verification-gaps) STRling need not initially claim this checker is complete for every conceivable capture rewrite. It is sufficient for a proof system to be **sound but conservative**: failing to prove a safe rewrite should yield `UNRESOLVED`, not an unsound success.

For selection-equivalence, a similar principle applies: the finite-state representation must retain the disambiguation semantics. Plain unordered NFA language acceptance cannot do so. This conclusion is reinforced by regex-extraction repair work, which found nondeterministic semantics acceptable for membership classification but inadequate for extraction because actual results depend on deterministic engine behavior. [source-verification note](#source-verification-gaps)

Bounded checking becomes the universal fallback. For a finite alphabet \(\Sigma\) and maximum subject length \(N\), the tested domain is:

\[
D_{\Sigma,N}=\bigcup_{i=0}^{N}\Sigma^i
\]

with cardinality:

\[
|D_{\Sigma,N}|=\sum_{i=0}^{N}|\Sigma|^i
\]

Comparing the full chosen observation on every element of that domain is a genuine proof:

\[
\forall x\in D_{\Sigma,N},\ O_1(x)=O_2(x)
\]

but **only** for \(D_{\Sigma,N}\). Hence the correct label is `BOUNDED_VERIFIED`, not `FORMALLY_PROVEN_EQUIVALENT` over all subjects.

This distinction applies equally to nonregular constructs. Even when unrestricted backreference equivalence is undecidable, exhaustive comparison over all ASCII strings of length ≤ 8 is a perfectly valid finite theorem—just a much weaker one.

For large bounded domains, STRling can substitute symbolic bounded search or solver-based enumeration for literal brute force as long as completeness for that bound is established. If a solver only samples, fuzzes or heuristically explores paths, the result drops to empirical evidence.

Empirical witness generation remains valuable when proof is impossible. Useful strategies include boundary-directed generation from quantified lengths, mutation around literals/classes, Unicode representatives, alternation/greediness stress inputs, capture-participation cases, assertion boundary cases, and differential execution across the exact source and target engines. But the semantic status must remain clear: property testing and differential testing can find decisive counterexamples; passing them does not establish universal equivalence.

This is also the correct way to interpret regex repair tools. RFixer-style systems repair regexes to satisfy supplied positive/negative examples rather than proving universal semantic identity, while R3 extends repair to extraction by modeling deterministic behavior. They are valuable sources of synthesis and testing techniques, not equivalence certificates for arbitrary rewrites. [source-verification note](#source-verification-gaps)

The most useful analytical witness formats for STRling are therefore:

| Failed claim | Witness should contain |
|---|---|
| Language equivalence | Subject plus which side accepts |
| Containment | Subject in source but not target, or vice versa |
| Selection equivalence | Subject plus competing selected derivations/policy decision |
| Span equivalence | Subject plus `(start,end)` for each side |
| Capture equivalence | Subject plus named/numbered capture participation, spans and values |
| Iteration equivalence | Subject plus first differing match in the result sequence |
| Replacement equivalence | Subject, replacement context, outputs and first differing capture expansion |
| Cross-engine equivalence | All above plus exact engine/profile identifiers |

A “shortest witness” is particularly valuable analytically because it tends to isolate the semantic cause. DFA/derivative BFS naturally yields shortest-length counterexamples under the chosen alphabet ordering. Symbolic witness generation can additionally choose a canonical representative from each character predicate, making results deterministic and reproducible.

## Extended constructs, Unicode, and engine-specific matching policy

Several STRling constructs remain finite-state at the accepted-language level but invalidate naive rewrite laws because practical regex semantics include more than acceptance.

**Greedy and lazy quantifiers.** In classical formal-language algebra, greediness does not change the set of strings generated by a repetition. In a leftmost-first search engine it can radically change the selected result. ECMAScript's semantics explicitly branch differently for greedy versus nongreedy quantifiers and gives examples in which the former consumes a longer selected match. [source-verification note](#source-verification-gaps) STRling also normatively describes greedy and lazy repetition as part of matching behavior. [source-verification note](#source-verification-gaps) Therefore:

\[
a+ \equiv_L a+?
\]

does **not** imply span equivalence in search mode.

**Alternation order.** Classical union is commutative:

\[
L(A|B)=L(B|A)
\]

but prioritized alternation is not operationally commutative. ECMAScript tries the left alternative first; STRling's current semantics likewise specifies leftmost-first/first-match behavior. [source-verification note](#source-verification-gaps) [source-verification note](#source-verification-gaps) Thus an algebraic simplifier must not freely sort alternatives when selected spans or captures are observable.

**Capturing versus noncapturing grouping.** `(a)` and `(?:a)` accept the same language and produce the same whole-match span, but they are not capture-equivalent. Removing one capturing group can also renumber every later numeric group and therefore change both backreferences and replacement templates. STRling explicitly numbers captures by opening-parenthesis order. [source-verification note](#source-verification-gaps)

**Lookaround.** Positive and negative assertions are zero-width, so consuming the asserted text is not an equivalent transformation. In ECMAScript, captures created by successful positive assertions are propagated into the result state, and positive lookahead has special non-backtracking behavior once its internal choice succeeds. [source-verification note](#source-verification-gaps) A language-oriented transformation that treats the lookahead merely as a Boolean condition may therefore be correct for membership while being wrong for captures.

Pure regular lookaround is a promising formal proof fragment. Under fixed start-position semantics and with regular assertion bodies, positive assertions can be modeled by conjunction with a regular context condition and negative assertions by complement of such a condition. The regular closure and symbolic-Boolean machinery already needed for STRling can support this. [source-verification note](#source-verification-gaps) But capture propagation and engine-specific assertion atomicity must remain part of a richer profile.

**Atomic groups and possessive quantifiers.** These must never be treated as merely “performance annotations.” STRling's own semantics gives the instructive pair:

```regex
a+ab
(?>a+)ab
```

Against `aaaab`, the ordinary greedy form can backtrack and succeed; the atomic form cannot give characters back and fails. [source-verification note](#source-verification-gaps) Therefore adding atomicity as an automatic “safety rewrite” is not generally semantics-preserving. It may be a deliberate narrowing optimization, but then it needs a different classification and ideally a containment proof.

**Backreferences.** STRling's rule that a backreference matches the exact most recently captured text creates a data equality constraint whose value is unbounded with subject length. [source-verification note](#source-verification-gaps) This is the mechanism behind the nonregularity and undecidability results for general extended regexes. [source-verification note](#source-verification-gaps) A compiler should therefore recognize exact syntactic special cases where the backreference can be eliminated—for example a capture known statically to have a single constant value—but must otherwise stop invoking the classical DFA equivalence theorem.

**Anchors and newline definitions.** `^`, `$`, `.`, multiline mode and engine newline configuration are part of semantics, not lexical sugar. STRling acknowledges engine-dependent line terminator behavior, and current PCRE2 exposes configurable newline modes through its compilation/match context. [source-verification note](#source-verification-gaps) [source-verification note](#source-verification-gaps) Consequently, equivalence evidence involving these constructs must include the newline convention.

**Search policy.** POSIX specifies leftmost-longest matching. [source-verification note](#source-verification-gaps) STRling specifies leftmost-first. [source-verification note](#source-verification-gaps) PCRE2 itself offers materially different matching machinery: its default engine uses a depth-first backtracking search, while its DFA matching facility can find POSIX-style leftmost-longest matches. [source-verification note](#source-verification-gaps) This means an engine identifier alone is insufficient. A semantic profile may need an **engine API/matcher** field, not merely `engine = pcre2`.

Unicode creates another independent axis of proof assumptions.

STRling says it is Unicode-first, defines `\d`, `\w`, `\s` and `\b` in Unicode-oriented terms, does not perform canonical normalization, and intends code-point rather than code-unit semantics where possible. [source-verification note](#source-verification-gaps) Unicode Technical Standard #18 separately emphasizes that Unicode regex conformance is a set of explicit requirements rather than something automatically obtained by supporting Unicode strings. [source-verification note](#source-verification-gaps)

At least the following must therefore be proof-profile fields:

| Unicode semantic dimension | Why evidence depends on it |
|---|---|
| Character universe | Code points, Unicode scalar values, UTF-16 code units, bytes, etc. |
| Unicode/UCD version | Property memberships and repertoire are versioned |
| Property interpretation | `Letter`, `Script`, shorthand classes, aliases |
| Case-folding model | Simple versus full folding; engine-specific deviations |
| Normalization | Code-point equality versus NFC/NFD/etc. |
| Word-character definition | Determines both `\w` and `\b` |
| Newline set | Determines `.`, `^`, `$`, multiline and dotAll behavior |
| Invalid encoding policy | Ill-formed UTF-8/UTF-16 may differ by engine |

This is not hypothetical version sensitivity. Unicode 17.0 is the current published Unicode Standard as of this report, and UAX #44 explicitly notes that property assignments can change between Unicode versions and recommends that APIs expose or document which UCD version they implement. [source-verification note](#source-verification-gaps)

Case-insensitivity is likewise more specific than a generic `i` flag. UTS #18 distinguishes simple one-code-point case folding from full folding that can map one character to multiple characters. [source-verification note](#source-verification-gaps) Evidence involving case-insensitive rewrites must pin whichever model STRling and the target actually use.

The current STRling semantics also expose a subtle implementation hazard around `\w`. STRling describes Unicode `\w` approximately as letters, numbers and underscore. [source-verification note](#source-verification-gaps) Current PCRE2 documentation says that with UCP, `\w` includes `\p{L}`, `\p{N}`, `\p{Mn}` and `\p{Pc}`, with the inclusion of non-spacing marks and general connector punctuation changed in PCRE2 10.43. [source-verification note](#source-verification-gaps) Emitting raw PCRE2 `\w` is consequently **not automatically a proof-preserving implementation of STRling's stated class** unless those definitions are deliberately reconciled.

ECMAScript has a different nuance. Its current formal `WordCharacters` starts with ASCII word characters and, under Unicode plus ignore-case, can add characters whose canonicalized form lies in that ASCII set. [source-verification note](#source-verification-gaps) Thus even the common shorthand “JavaScript `\w` is ASCII-only” is too coarse for proof metadata in the presence of Unicode case-insensitive matching.

These findings argue for a rule:

> **Character-class rewrites should be proved against normalized set predicates, not against informal names such as “digit,” “word,” or “Unicode-aware.”**

A symbolic Boolean algebra of normalized character predicates is the strongest architectural fit for that rule.

## Evidence-carrying rewrite verification for STRling

The compiler-verification literature provides a useful conceptual model: **translation validation** verifies each particular transformation result rather than relying solely on a global argument that the transforming compiler is always correct. Pnueli, Siegel and Singerman introduced the approach in exactly these terms: source and generated target are placed in a common semantic framework and a refinement relation is checked for each translation. [source-verification note](#source-verification-gaps) Alive2 demonstrates the modern form at LLVM IR scale, using SMT-based bounded translation validation to find real optimizer errors and even ambiguities in the underlying semantic specification. [source-verification note](#source-verification-gaps)

That model maps unusually well onto STRling's already documented Parse → IR → Emit architecture. [source-verification note](#source-verification-gaps)

A robust verification pipeline would be:

\[
Source\ AST
\rightarrow
Source\ Semantic\ IR
\rightarrow
\boxed{rewrite}
\rightarrow
Target\ Semantic\ IR
\rightarrow
Target\ pattern
\]

with two distinct proof obligations:

\[
SourceIR \;\mathcal R\; RewrittenIR
\]

and, when target lowering itself is semantically nontrivial,

\[
RewrittenIR \;\mathcal R_{cross-profile}\; EmittedTarget
\]

The first asks whether the compiler rewrite preserves STRling's abstract semantics. The second asks whether target syntax actually implements that semantics under a versioned target profile. This separation is important: an algebraically valid IR optimization can coexist with an incorrect target emission rule.

For migrations, the relation should explicitly be cross-profile:

\[
\forall x\in D:\;
Obs_{SourceEngineProfile}(r_s,x)
=
Obs_{TargetEngineProfile}(r_t,x)
\]

That is a stronger and more useful statement than claiming the two pattern strings are “equivalent.”

### Recommended evidence terminology

The user's proposed terminology is directionally correct, but one additional state—**refuted**—should be first-class, and “formal proof” should always be scoped by relation and profile.

| Status | STRling meaning | May be called semantics-preserving? |
|---|---|---|
| **Formally proven** | Complete decision procedure or independently checkable certificate proves the requested relation for the complete declared domain; all assumptions are machine-enforced | Yes, but only with relation/profile shown |
| **Conditionally proven** | Complete proof holds provided explicit side conditions are true | Only when compiler enforces those conditions; otherwise no |
| **Refuted** | A replayable witness violates the requested relation | No |
| **Bounded-verified** | Exhaustive proof over a declared finite alphabet/domain/length bound | No unqualified all-input claim |
| **Empirically supported** | Differential/property/corpus tests found no difference | No |
| **Heuristic** | Rewrite is believed safe from a syntactic rule or approximation but lacks a complete semantic validation | No |
| **Unresolved** | Unsupported construct, solver `unknown`, timeout, semantic-profile gap, or proof search exhausted resources | No |

The distinction between `REFUTED` and `UNRESOLVED` is particularly important. Backreferences may make a proof obligation undecidable in general, but that does not imply a rewrite is wrong. Conversely, one concrete subject can immediately make the result `REFUTED`.

Likewise, `BOUNDED_VERIFIED` should not be euphemistically displayed as “probably equivalent.” It is an exact theorem with a deliberately bounded quantifier:

\[
\forall x \in D_{\text{bounded}}.\ O_1(x)=O_2(x)
\]

That is stronger than sampling but weaker than universal equivalence.

### Evidence provenance requirements

A proof result should be a persistent compiler artifact, not a transient Boolean.

A minimum provenance record should contain:

| Evidence field | Required content |
|---|---|
| Claim | Relation: language, containment direction, span, capture, operation, etc. |
| Domain | Alphabet/predicate universe; length bound if any; normalization assumptions |
| Source identity | Canonical AST/IR hash, original pattern hash |
| Target identity | Canonical rewritten IR hash, emitted-pattern hash if validated |
| Rewrite identity | Rewrite rule ID, implementation/version/hash, instantiated side conditions |
| STRling semantics | Semantics specification version/commit/schema profile |
| Source profile | Engine/dialect/version/API/options when validating migration |
| Target profile | Engine/dialect/version/API/options |
| Matching mode | Full match, search, sticky, anchored, global, etc. |
| Disambiguation | Leftmost-first, leftmost-longest, greediness conventions |
| Capture model | Group identity/numbering, unmatched-group semantics, repeated captures |
| Unicode profile | UCD version, code-point/code-unit model, case folding, normalization, `\w`/`\b`, newline convention |
| Operation context | Replacement language, split behavior, global iteration/zero-width advancement if relevant |
| Proof method | DFA product, derivatives, antichain inclusion, symbolic automata, SMT, tagged checker, exhaustive enumeration |
| Toolchain | Verifier version/hash, solver/version/options, lowering version |
| Trusted base | Checker or solver components whose correctness the result assumes |
| Result | Proven, conditional, refuted, bounded, empirical, heuristic, unresolved |
| Proof artifact | Certificate, reachable relation, derivative closure, solver proof if available |
| Witness | Counterexample and complete differing observations when applicable |
| Resource record | Timeout/memory limits when a result can become unresolved |
| Dependency digest | Canonical hash controlling evidence reuse/invalidation |

A suitable conceptual serialization would resemble:

```json
{
  "claim": {
    "relation": "capture-equivalence",
    "scope": "all-subjects",
    "status": "formally-proven"
  },
  "source": {
    "semanticIrHash": "…"
  },
  "target": {
    "semanticIrHash": "…"
  },
  "profiles": {
    "source": "strling-v3:…",
    "target": "ecmascript-2026:unicode17:…"
  },
  "rewrite": {
    "rule": "ALT_FACTORING",
    "ruleVersion": "…",
    "sideConditions": ["…"]
  },
  "verification": {
    "method": "symbolic-tdfa-product",
    "verifierVersion": "…",
    "certificateHash": "…"
  }
}
```

The exact schema is secondary to the invariant:

> **The claim must be impossible to detach from the assumptions under which it is true.**

### Evidence invalidation

Evidence should be content-addressed by its semantic dependencies. Any change to a dependency should make old evidence stale unless STRling can itself establish that the change is irrelevant to the pattern.

Hard invalidators normally include:

- STRling semantics version;
- rewrite-rule version;
- source or target IR;
- target engine/dialect version where behavior is delegated to the engine;
- matcher API or target options;
- Unicode/UCD version;
- newline and case-fold profile;
- proof lowering/version;
- verifier or solver semantics;
- operation being guaranteed.

This is where the repository's current lookbehind documentation mismatch becomes instructive. Evidence calculated under a “PCRE2 fixed-length-lookbehind-only” profile should not silently survive a migration to a PCRE2 10.43+ profile that admits bounded variable-length lookbehind. [source-verification note](#source-verification-gaps)

The same applies to character properties: UAX #44 explicitly documents version-sensitive property data, and PCRE2 changed its UCP `\w` definition in 10.43. [source-verification note](#source-verification-gaps)

A profile digest should therefore be part of the verification cache key.

### Proof-carrying rewrites

STRling does not need every verifier to be formally verified to obtain substantial assurance. A practical architecture can separate a potentially complex **proof searcher** from a small **evidence checker**.

For deterministic language equivalence, the searcher produces a closed relation of state pairs. The checker verifies:

\[
(q_{01},q_{02})\in R
\]

\[
(p,q)\in R \Rightarrow
[p\in F_1 \Leftrightarrow q\in F_2]
\]

and, for every semantic alphabet class \(a\),

\[
(\delta_1(p,a),\delta_2(q,a))\in R
\]

For containment, replace the accepting-status biconditional with:

\[
p\in F_1\Rightarrow q\in F_2
\]

A derivative checker can verify the equivalent closure rules over expression residuals and nullability.

A symbolic certificate additionally needs evidence that its character predicates cover the semantic alphabet and that required intersections/implications are empty or satisfiable. Initially, that may place the predicate solver in the trusted base. Later, selected solver proof objects could reduce that base.

For capture-aware proofs, the certificate extends the state relation with equal observable tag/register transformations.

The existence of Isabelle-verified regex equivalence checkers offers an even stronger long-term option: use a formally verified finite-state checker as the final validation kernel while allowing higher-performance engines to search for candidate certificates. [source-verification note](#source-verification-gaps)

### Automatic rewrite gating

The compiler rule should be strict:

\[
\texttt{emitSemanticsPreserving}
\iff
\texttt{evidence.status = PROVEN}
\land
\texttt{evidence.relation}\succeq
\texttt{requiredRelation}
\land
\texttt{activeProfile = evidence.profile}
\]

where “\(\succeq\)” means that the established observation is sufficient for the consuming context.

A recognition-only validator may require language equivalence. A search API returning offsets requires at least span equivalence. An extraction API requires capture equivalence. Replacement requires operation-level preservation for the relevant capture/replacement semantics.

A conditionally proven rewrite may be automatically applied only if its side conditions are themselves checked and enforced. Otherwise it remains advisory.

`BOUNDED_VERIFIED`, `EMPIRICALLY_SUPPORTED`, `HEURISTIC`, and `UNRESOLVED` are **not sufficient grounds for an unqualified `semantics-preserving` compiler rewrite**.

This directly implements the desired foundation: STRling knows *why* the rewrite is safe, *which observation* it preserves, and *under which assumptions*.

## Rewrite counterexamples, refusal policy, downstream implications, and open research

Concrete examples make the difference between language equality and observable equality especially clear.

| Apparently safe rewrite | What is preserved | What changes |
|---|---|---|
| `a\|ab` → `ab\|a` | Classical accepted language | Under leftmost-first search on `ab`, first form chooses `a`; second can choose `ab` [source-verification note](#source-verification-gaps) |
| `a+` → `a+?` | Classical language | Greedy versus lazy search can produce different spans [source-verification note](#source-verification-gaps) |
| `(a)` → `(?:a)` | Language and whole-match span | Capture 1 disappears; later capture numbers and replacement behavior can change |
| `(foo)\|(bar)` → `(foo\|bar)` | Classical language | Capture topology, numbering and participation change |
| `foo(?=bar)` → `foobar` | Both can identify the same occurrence context | Lookahead matches only `foo`; rewritten form consumes `bar`, changing span and replacement behavior |
| `(a\|b)\1` → `aa\|bb` | Same full-match language for this specific expression | Capture structure disappears; language proof is insufficient for extraction/replacement |
| `a+ab` → `(?>a+)ab` | Superficially similar repetition | Atomic form can fail where ordinary form backtracks and succeeds; not language-equivalent [source-verification note](#source-verification-gaps) |
| `\d` → `[0-9]` | May coincide under ASCII-only assumptions | Not equivalent under STRling's Unicode digit intent [source-verification note](#source-verification-gaps) |
| Unicode `\w` → target raw `\w` | Same spelling | Character sets can differ by target/profile; PCRE2 UCP includes categories beyond STRling's documented `L/N/_` definition [source-verification note](#source-verification-gaps) |
| Reorder alternatives for canonicalization | Classical union | Prioritized engine selection and captures can change |
| Replace assertion with consumed context | Often preserves match existence | Match span, captures and replacements change |
| Add possessive/atomic constructs “for safety” | Sometimes preserves a particular tested corpus | Can alter accepted behavior; never assume equivalence |

The first row is perhaps the smallest counterexample to a broad class of unsafe algebraic optimizer rules. In formal-language algebra, union is commutative. In ECMAScript and STRling's leftmost-first model, prioritized alternation is observably noncommutative. [source-verification note](#source-verification-gaps) [source-verification note](#source-verification-gaps)

The third and fourth rows demonstrate why capture identity belongs in the semantic IR. Group parentheses cannot safely be treated as decorative syntax once captures are observable or referenced.

The atomic-group example directly answers the requirement concerning “safety rewrites”: an optimization that intentionally limits backtracking may be desirable for another reason, but **if it changes observable behavior, STRling must describe it as a semantics-changing transformation**. A proven containment relation can accurately say that the transformed expression narrows behavior; it cannot turn narrowing into equivalence.

### Refusal policy

STRling should refuse to call a rewrite semantics-preserving whenever any of the following holds:

| Condition | Required result |
|---|---|
| Required observation has not been declared | `UNRESOLVED: equivalence-kind-required` |
| Source or target semantic profile is incomplete | `UNRESOLVED: semantic-profile-incomplete` |
| A nonregular construct falls outside a proved restricted fragment | `UNRESOLVED: no-complete-procedure-for-fragment` |
| Verifier times out or solver returns unknown | `UNRESOLVED`, never inferred-safe |
| Only language equality was proved but spans/captures/operations are observable | Report weaker proof; reject stronger preservation claim |
| Only bounded exhaustive verification was performed | `BOUNDED_VERIFIED` with exact bound/domain |
| Only differential/property tests passed | `EMPIRICALLY_SUPPORTED` |
| A witness exists | `REFUTED`, with witness |
| Target engine/version semantics differ from proof profile | `STALE/UNRESOLVED` until reverified |
| Rewrite intentionally narrows/broadens behavior | Report containment/refinement; do not label equivalent |
| “Safety” rewrite changes semantics | Treat as opt-in behavioral transformation, never equivalent |

There is one useful exception to a weak proof: **observational irrelevance can be a checked compiler fact**. If a regex is provably used only as a Boolean validator and no match/capture data can escape, language equivalence may be sufficient even though the patterns are not capture-equivalent. That is not relaxing correctness; it is choosing the correct observation function for the actual program context.

### Compiler optimization implications

STRling's optimizer should make every rewrite rule declare its minimum proof obligation.

Examples:

| Rewrite family | Minimum default obligation |
|---|---|
| Character-class normalization | Language equivalence under exact Unicode/profile predicates |
| Algebraic factoring | Selection/capture equivalence unless optimizer can prove recognition-only use |
| Capture elimination | Capture/operation proof or proven capture deadness |
| Alternation reordering | Selection-equivalence proof |
| Greediness change | Span/capture/operation proof |
| Assertion lowering | Span and capture proof, not just language proof |
| Atomicity/possessification | Full required-observation proof; never “safe by construction” |
| Engine migration lowering | Cross-profile equivalence of required observation |

Rule-level theorems and per-instance translation validation can coexist. A simple rule such as character-class set union may have a reusable algebraic theorem plus machine-checked side conditions. Complex rewrites can be validated after instantiation.

### Migration and portability implications

For migration planning, equivalence should be reported as a matrix, not a binary badge.

A useful Compare result could logically contain:

```text
accepted-language:
    source ⊆ target: PROVEN
    target ⊆ source: REFUTED
    witness: …

selected-span:
    UNRESOLVED (backreference-dependent)

captures:
    REFUTED
    witness: …

replace-operation:
    NOT_CHECKED
```

This immediately distinguishes widening from narrowing and makes weaker results impossible to mistake for full behavioral equivalence.

Cross-engine migration must also identify whose semantics each side uses. Comparing:

```text
PCRE2 pattern A
ECMAScript pattern B
```

without specifying PCRE2 version/options/matcher, ECMAScript edition/flags, Unicode version and operation is not a well-formed formal equivalence question.

### Audit/Compare implications

Audit/Compare should treat counterexamples as analytical evidence attached to a failed relation.

For a language difference:

```text
Witness: "ab"

source:
  accepted = true

target:
  accepted = false
```

For a selection difference:

```text
Witness: "ab"

source:
  span = [0,1]   text = "a"

target:
  span = [0,2]   text = "ab"
```

For a capture difference:

```text
Witness: "a"

source:
  whole = [0,1]
  group 1 = [0,1] "a"

target:
  whole = [0,1]
  group 1 = undefined
```

The UI treatment belongs elsewhere, as requested, but the underlying analytical object should be first-class and replayable.

### Diagnostic implications

Diagnostics should state exactly which theorem failed or could not be attempted. Good diagnostics would include:

> `LANGUAGE_EQUIVALENT / CAPTURE_EQUIVALENCE_REFUTED`

> `UNRESOLVED: backreference places pattern outside supported universal-proof fragment`

> `BOUNDED_VERIFIED: all Unicode scalar strings over predicate partition C, length ≤ 6`

> `EVIDENCE_STALE: target profile changed from PCRE2-10.42 to PCRE2-10.46`

> `CONTAINMENT_PROVEN: target ⊂ source; transformation is behavior-narrowing, not semantics-preserving`

This vocabulary is substantially more informative than “compatible,” “probably safe,” or “equivalent.”

### Practical technology choices

A sensible research-to-implementation stack for STRling is:

| Need | Relevant precedent |
|---|---|
| Verified regular-language equivalence kernel | Isabelle/AFP regex-equivalence developments [source-verification note](#source-verification-gaps) |
| Direct regex decision procedure | Brzozowski derivatives; Owens/Reppy/Turon implementation techniques [source-verification note](#source-verification-gaps) |
| Compact NFA construction | Antimirov partial derivatives [source-verification note](#source-verification-gaps) |
| Large Unicode alphabets | Symbolic automata and effective Boolean algebras [source-verification note](#source-verification-gaps) |
| SMT-integrated Boolean regex solving | Symbolic Boolean derivatives over Z3 [source-verification note](#source-verification-gaps) |
| Language-difference witnesses | Rex symbolic automata/difference generation [source-verification note](#source-verification-gaps) |
| High-performance NFA inclusion experiments | MATA [source-verification note](#source-verification-gaps) |
| Capture/submatch finite-state semantics | TDFA/re2c [source-verification note](#source-verification-gaps) |
| Extraction-sensitive operational modeling | R3 regex repair research [source-verification note](#source-verification-gaps) |
| Per-transformation compiler validation model | Translation validation / Alive2 [source-verification note](#source-verification-gaps) |

None should be adopted wholesale without reconciling its regex syntax and semantics with STRling. Rex, for example, targets .NET regexes and historically offers specific alphabet modes; re2c's TDFA policies are explicit; symbolic-solvers operate against their own regex theories. These are architectural and algorithmic precedents, not drop-in semantic authorities for STRling. [source-verification note](#source-verification-gaps)

### Unresolved research gaps

The most significant remaining research problems are not classical language equivalence; that part is mature. They sit at the boundary between finite-state language theory and practical regex observables.

| Research gap | Why it matters |
|---|---|
| A formally specified STRling semantic IR for **selection**, not just language acceptance | Rewrites involving alternation, greediness and assertions require a precise winner-selection model |
| Complete or deliberately conservative capture-equivalence checking across STRling's full regular capture fragment | TDFA provide the representation foundation, but STRling needs a precise equivalence relation over exposed group identities and repeated captures |
| Formal lowering of regular lookarounds into proof machinery while preserving capture effects | Language regularity alone is insufficient |
| Exact reconciliation of STRling Unicode intent with each engine's versioned shorthand/property behavior | Raw `\w`, `\d`, `\b`, case folding and code-unit semantics are not portable identities |
| Independently checkable certificates for symbolic-character proofs | SMT-backed predicates enlarge the trusted base |
| Useful decidable subclasses of STRling backreferences for equivalence, not merely matching | Existing tractability results do not give a universal replacement for the undecidable general problem |
| Operation-level formal semantics for replace, split and global iteration across targets | Matching equivalence alone cannot prove operation equivalence |
| Counterexample minimization for capture/policy/nonregular mismatches | Small witnesses make formal failures much easier to diagnose |
| Semantic-profile evolution and compatibility theorems | Avoid unnecessary invalidation while never reusing stale proofs unsafely |
| Proof-preserving counted-repetition representations | Naive expansion is impractical even though the language remains regular |
| Cross-profile equivalence for source-engine → STRling → target-engine migrations | This is ultimately the strongest formal model of a migration |

The current repository documentation issue around lookbehind should be treated as an early case study for the last two architecture concerns: a proof system should not embed assumptions such as “PCRE2 lookbehind is fixed-length” in opaque code. That fact must belong to a versioned profile whose provenance is visible and invalidatable. Current PCRE2 10.43+ semantics demonstrate how quickly such a fact can cease to be correct. [source-verification note](#source-verification-gaps) [source-verification note](#source-verification-gaps)

The strongest resulting architectural principle for STRling is:

> **Equivalence is a typed, scoped theorem, not a Boolean property of two regex strings.**

A successful rewrite verification should therefore be readable as:

\[
\boxed{
\begin{array}{l}
\text{relation: capture-equivalence}\\
\text{domain: all Unicode scalar strings}\\
\text{source semantics: STRling profile }P_s\\
\text{target semantics: ECMAScript profile }P_t\\
\text{proof: symbolic tagged-automata certificate}\\
\text{status: formally proven}\\
\text{dependencies: versioned and hashed}
\end{array}
}
\]

When only a bounded theorem is available, STRling should say so. When only tests are available, it should say so. When an undecidable construct blocks proof, it should say so. When a concrete counterexample exists, it should refute the claim and preserve the witness. And when a transformation intentionally changes semantics for performance or safety reasons, STRling should represent that change honestly rather than smuggling it under an equivalence label.

That establishes the intended foundation: **STRling must know why a rewrite is safe, exactly what notion of equivalence was established, and exactly which semantic assumptions make the proof valid.**
