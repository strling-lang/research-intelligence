# Declarative Relational Pattern Algebra for Future STRling Research

Role: Research report
Origin: AI-assisted deep research commissioned for STRling Research Intelligence
Generated: 2026-08-14
Imported: 2026-08-14
Source verification: Partially verified
Last reviewed: 2026-08-14
Current status: Active input

## Executive finding

The strongest design direction is **not** to extend regular expressions with an open-ended expression language. It is to preserve a **regular structural algebra** for describing how observations are arranged, then add a **typed, closed relational algebra** for describing how the values occupying those structural roles must relate.

That separation has substantial precedent. Kleene algebra provides the equational structure behind regular composition; Kleene Algebra with Tests adds predicates while retaining algebraic reasoning; Guarded KAT shows that restricting seemingly innocuous forms of choice and iteration can dramatically improve the tractability of equivalence reasoning. citeturn17search0turn17search2 Symbolic automata similarly retain finite-state structure while replacing finite character alphabets with predicates over richer, even infinite, domains. citeturn17search5turn17search1 SQL row-pattern recognition provides perhaps the closest deployed analogue to the desired idea: regular-expression-like structure over pattern variables, separate relational conditions among rows, explicit partition/order semantics, and match outputs explaining which rows played which roles. citeturn16search0turn21view0

The proposed conceptual architecture is therefore:

\[
\boxed{\text{Pattern} =
\text{regular structure}
+\text{explicit views/partitions}
+\text{typed relations}
+\text{relational lifts}
+\text{immutable captures}}
\]

with **no user-defined recursion, no arbitrary callbacks, no mutable variables, no general fold, and no ability for a captured value to construct the future pattern**.

For the motivating sequence

\[
1,\ 3,\ 4,\ 6,\ 7,\ 9
\]

the important primitive is not “discover two arithmetic progressions.” Discovery is out of scope. The supplied pattern can instead state an explicit alternating lane assignment

\[
A\,B\,A\,B\,A\,B
\]

which projects the source into

\[
A=(1,4,7),\qquad B=(3,6,9)
\]

and then imposes the same additive-step relation on adjacent elements of both lanes:

\[
\exists d.\;
\operatorname{adjacent}(A,\Delta=d)
\land
\operatorname{adjacent}(B,\Delta=d)
\land
d=3.
\]

This decomposition matters. **Interleaving is structural; arithmetic progression is relational; equality of the two steps is a relation between relational parameters.** None needs to guess the partition, and none requires a loop written by the pattern author. Formal-language shuffle work likewise treats interleaving as a separate operation preserving each component word's order, and “regular trajectories” constrain the schedule explicitly. citeturn19academia26

The research therefore supports a relatively small kernel:

\[
\begin{aligned}
\textbf{Structure:}\;&
\epsilon,\ \operatorname{atom},\ \operatorname{seq},\
\operatorname{alt},\ \operatorname{repeat},\
\operatorname{capture},\
\operatorname{where},\
\operatorname{project},\
\operatorname{weave}
\\[2mm]
\textbf{Scalar relations:}\;&
=,\ \ne,\ <,\ \le,\
\Delta,\
\operatorname{affine},\
\operatorname{metric}
\\[2mm]
\textbf{Relational lifts:}\;&
\operatorname{each},\
\operatorname{adjacent},\
\operatorname{window},\
\operatorname{correspond}
\\[2mm]
\textbf{Structural views:}\;&
\operatorname{reverse},\
\operatorname{lag},\
\operatorname{permute},\
\operatorname{lane}
\end{aligned}
\]

Most of the requested vocabulary—monotonicity, arithmetic progression, geometric progression, periodicity, recurrence, alternation, symmetry, reflection, transformation, hierarchy—is then **derived or theory-specific**, rather than fundamental.

This direction also fits STRling's existing architectural principles better than a universal sequence runtime. STRling already uses a Parse → AST → target-agnostic IR → Emit pipeline, treats the fluent API as a semantic abstraction over IR nodes, and emphasizes deterministic, side-effect-free compiler stages. fileciteturn12file0L2-L2 The Research Intelligence inquiry on non-text sequences explicitly warns that shared sequence vocabulary does not imply one runtime or IR and rejects a universal `Sequence<T>` compiler layer as an accepted direction. fileciteturn10file0L2-L2 The implication is that a future relational-pattern IR should be a **semantically classified sibling or extension layer**, not a claim that everything is regex and not a claim that one execution engine fits every domain.

## Semantic foundation

### Patterns should denote relations over ordered views, not strings

Let the input be a finite sequence over some typed domain \(D\):

\[
S=(v_0,v_1,\ldots,v_{n-1})\in D^n.
\]

The crucial abstraction is an **ordered view** of that input. Define a view by an order-preserving injective index map

\[
\iota:\{0,\ldots,m-1\}\hookrightarrow\{0,\ldots,n-1\}.
\]

Its observed sequence is

\[
S\!\upharpoonright_{\iota}
=
(v_{\iota(0)},\ldots,v_{\iota(m-1)}).
\]

A contiguous regex-like span is simply the special case in which

\[
\iota(j)=a+j.
\]

An interleaved lane is another view. For the motivating sequence, the two maps are

\[
\iota_A=(0,2,4),\qquad
\iota_B=(1,3,5).
\]

This makes “subsequence” a first-class semantic object without requiring copying, and it cleanly distinguishes the **order within a lane** from the **physical positions in the parent sequence**.

A capture environment \(\rho\) should map names to immutable typed match objects rather than text:

\[
\rho :
\text{Name}
\to
\text{ValueOccurrence}\;\cup\;\text{SequenceView}\;\cup\;\text{RelationParameter}.
\]

A successful match can then be modeled as a tuple

\[
M=(V,\rho,\omega),
\]

where \(V\) is the matched source/view extent, \(\rho\) contains captures, and \(\omega\) is a witness explaining the structural and relational derivation.

This framing generalizes STRling's present captures without pretending that a relational capture is merely a regex substring. Today STRling's semantic abstraction maps constructs such as sequence, alternation, quantification, and capture onto explicit IR node types such as `Seq`, `Alt`, `Quant`, and `Group`. fileciteturn12file0L2-L2 A relational extension should preserve that explicitness: a captured subsequence is a typed object in the semantic model, not an implicit string that later happens to be reparsed.

### Keep consumption and truth separate

A major semantic distinction should be:

\[
\boxed{\text{Patterns consume/organize observations; relations assert truths.}}
\]

A scalar relation such as

\[
x<y
\]

does not consume another element. Likewise,

\[
y-x=3
\]

is not a sequence operator. It is a proposition about already identified values.

This is exactly the useful separation seen in row-pattern SQL. `PATTERN` defines structural roles and repetition; `DEFINE` supplies Boolean conditions, including conditions that compare the current row with rows previously assigned to pattern variables. Oracle's documentation explicitly distinguishes the regular-expression-like row pattern from the Boolean definitions and notes that the latter make row-pattern matching richer than ordinary regex because conditions can depend on previous variable assignments. citeturn21view0 Flink similarly separates `PATTERN`, `DEFINE`, `PARTITION BY`, `ORDER BY`, and `MEASURES`. citeturn16search0

The same idea appears algebraically in KAT: a Kleene-style action algebra is combined with Boolean tests rather than replacing sequencing with arbitrary computation. citeturn17search0 This is a particularly good conceptual model for STRling even though KAT itself is not the proposed language.

### Relations need algebraic types

“Numeric relation” is too coarse a category. Different relations require different mathematical structure on the value domain. A useful type-theoretic hierarchy is:

| Domain capability | Relations justified by it | Examples |
|---|---|---|
| Equality | \(=,\ne\) | identifiers, symbols, numbers |
| Total/partial order | \(<,\le,>,\ge\) | numbers, timestamps, ordered versions |
| Additive difference / affine space | \(\Delta(x,y)\), offset | integers, reals, times/durations |
| Scalar action / module | \(y=ax+b\) for fixed \(a,b\) | numeric scaling and affine transforms |
| Multiplicative structure | fixed ratio, geometric progression | rationals/reals subject to zero rules |
| Metric | \(d(x,y)\) and threshold relations | arbitrary metric-valued domains |
| Explicit hierarchy/graph | parent, child, edge, reachability | structured/tree/graph values |

This prevents accidental semantics such as assuming every ordered value supports subtraction, every equality domain has a meaningful distance, or every numeric representation has exact division.

It is also consistent with symbolic-automata research. Symbolic automata parameterize their alphabet by a background Boolean algebra/theory, allowing transitions over rich or infinite alphabets without building every possible value into the automaton. citeturn17search1turn17search5 A future relational layer should similarly be **theory-indexed** rather than hard-coding “numbers” as one monolithic primitive universe.

For an initial exact numerical theory, linear arithmetic is especially attractive. SMT-LIB explicitly separates linear integer/real logics, and quantifier-free difference logic specializes further to constraints essentially of the form \(x-y<c\). Its linear-real fragment permits multiplication by concrete coefficients while excluding variable-by-variable multiplication from linear atoms. citeturn20search5turn20search8 This supports equality, order, difference, literal scaling, affine transforms, arithmetic progressions, and fixed-coefficient linear recurrences without requiring unrestricted arithmetic.

## Candidate relational vocabulary

The central design recommendation is to distinguish **fundamental constructors**, **relational lifts**, and **derived vocabulary**. “Fundamental” here means that removing the operator would either lose an important semantic distinction or force unrelated concepts to be encoded indirectly. It does not mean every fundamental operator must appear directly in eventual STRling syntax.

### Structural kernel

A compact structural algebra is:

\[
P,Q ::= \epsilon
\mid \operatorname{atom}(\phi)
\mid P\cdot Q
\mid P+Q
\mid P^{[m,n]}
\mid \operatorname{capture}(x,P)
\mid \operatorname{where}(P,C)
\mid \operatorname{project}(\pi,P)
\mid \operatorname{weave}(T;P_1,\ldots,P_k).
\]

Here:

**`atom(φ)`** consumes one observation satisfying a unary test \(\phi\). Unary symbolic predicates belong here because they classify individual values without relating multiple sequence positions. Symbolic finite automata are strong prior art for this level. citeturn17search5

**Sequential composition \(P\cdot Q\)**, alternative \(P+Q\), and bounded/unbounded regular repetition \(P^{[m,n]}\) retain the familiar Kleene structure. Their algebraic laws are a major source of compiler simplification and equivalence reasoning. citeturn17search0turn17search4

**`capture(x,P)`** gives a semantic name to the result of \(P\).

**`where(P,C)`** filters matches of \(P\) by a closed declarative relation \(C\) over captures, parameters, positions, and values. `where` is deliberately not a host-language callback.

**`project(π,P)`** applies \(P\) to an explicitly identified child view. It is the generic operation behind “take every second element,” “match this lane,” and other non-contiguous but explicitly selected subsequences.

**`weave(T;...)`** is the fundamental explicit interleaving operator. \(T\) is a declarative schedule or regular language over lane labels. Formal shuffle theory defines shuffle as arbitrary interleaving while preserving the order of each component; regular trajectories add explicit scheduling constraints. citeturn19academia26

This retains a regular compositional backbone while introducing one genuinely new structural idea: a pattern may operate on an ordered projection rather than only on a contiguous interval.

### Fundamental scalar relations

The candidate scalar kernel should be smaller than the motivating list suggests.

| Candidate | Recommendation | Reason |
|---|---|---|
| Equality | **Fundamental** | Universal relational notion; drives correspondence and repeated-value relations |
| Inequality `≠` | Derived or primitive-negated equality | Semantically useful, algebraically not independent |
| Ordering `<, ≤` | **Fundamental capability** | Cannot in general be derived from equality |
| Difference | **Fundamental on additive domains** | Natural primitive for sequence deltas, offsets, APs |
| General affine relation | **Fundamental theory form** | Unifies fixed scaling, offset, linear recurrences |
| Ratio | **Convenience/theory-specific** | Fixed ratio reduces to scaling; variable ratio introduces multiplicative coupling |
| Distance | **Capability primitive on metric domains** | On numbers it can often be derived from difference/order, but not on arbitrary metric domains |
| Monotonicity | **Derived** | Lift of `<` or `≤` to adjacent values |
| Arithmetic progression | **Derived** | Constant adjacent difference |
| Geometric progression | **Derived/specialized** | Constant adjacent multiplicative ratio |
| Periodicity | **Derived** | Equality under fixed-lag correspondence |
| Recurrence | **Derived family** | Fixed-window relation; safe core should use fixed arity and closed coefficient theory |

The preferred primitive numerical relation is therefore not a separate operator for every familiar sequence name. It is an additive/affine kernel.

For example,

\[
\Delta(x,y,d)\quad\overset{\mathrm{def}}{\Longleftrightarrow}\quad y-x=d.
\]

Arithmetic progression is then:

\[
\operatorname{AP}(S,d)
\equiv
\operatorname{adjacent}(S,\lambda(x,y).\,\Delta(x,y,d)).
\]

The `lambda` here is mathematical notation for relation parameterization, **not** a proposal to expose arbitrary anonymous functions.

Monotonicity similarly becomes

\[
\operatorname{strictIncreasing}(S)
\equiv
\operatorname{adjacent}(S,<)
\]

and

\[
\operatorname{nondecreasing}(S)
\equiv
\operatorname{adjacent}(S,\le).
\]

NumPy's established array vocabulary reflects the usefulness of this view mechanically: `diff` computes consecutive differences as \(a[i+1]-a[i]\), while `arange` defines evenly spaced sequences in terms of an adjacent step. citeturn15search4turn15search0 The proposed algebra differs by using those concepts as **constraints on supplied data**, not transformations for computing new arrays.

### Relational lifts are more fundamental than named sequence motifs

The decisive operators for sequence relationships are higher-level **closed lifts** of fixed-arity relations:

\[
\operatorname{each}(S,R)
\]

applies a unary relation to every element;

\[
\operatorname{adjacent}(S,R)
\]

applies a binary relation to every consecutive pair in the view;

\[
\operatorname{window}_k(S,R)
\]

applies a \(k\)- or \((k+1)\)-ary relation to every fixed-width consecutive window;

\[
\operatorname{correspond}(A,B,\alpha,R)
\]

relates two views according to an explicit alignment \(\alpha\).

These four operators provide a far more compositional basis than dozens of sequence-specific predicates. Critically, they are not general higher-order programming operators: \(R\) must come from the closed relational theory known to the compiler.

A fixed-order linear recurrence

\[
x_i
=
a_1x_{i-1}
+\cdots+
a_kx_{i-k}
+c
\]

becomes a `window` relation with literal coefficients. Linear recurrence sequences are an established mathematical object, and their theory is rich enough that even seemingly simple global decision questions such as the Skolem zero problem remain deep open territory in general. citeturn15academia36turn15academia39 That is a strong reason not to make “recurrence” mean arbitrary recursive code. STRling needs the **local recurrence equation**, not a general recursive definition facility.

Periodicity with fixed lag \(p\) is:

\[
\forall i\ge p:\quad x_i=x_{i-p},
\]

which is naturally a correspondence between two aligned views displaced by \(p\):

\[
\operatorname{periodic}_p(S)
\equiv
\operatorname{correspond}
(S[0:n-p],S[p:n],\operatorname{zip},=).
\]

Symmetry is similarly a correspondence:

\[
\operatorname{symmetric}(S)
\equiv
\operatorname{correspond}(S,\operatorname{reverse}(S),\operatorname{zip},=).
\]

Reflection about a value \(c\) can be expressed by replacing equality with

\[
x+y=2c.
\]

The fundamental operation is therefore **correspondence under an alignment**, while symmetry, reflection, antisymmetry, and many “mirror” patterns are named conveniences.

### Explicit transformations only

“Transformation” should not mean

\[
y=f(x)
\]

for an arbitrary user-supplied \(f\). That is the shortest route from a pattern algebra to embedding a programming language.

Instead, transformations should belong to a **closed family with declared laws**. An affine transformation, for example,

\[
y=ax+b,
\]

has identity and associative composition:

\[
(a_2,b_2)\circ(a_1,b_1)
=
(a_2a_1,\ a_2b_1+b_2).
\]

A compiler can reason about that family algebraically. Arbitrary callbacks have no corresponding general simplification theory.

The same applies to position transformations. `reverse`, fixed `lag(k)`, explicit `permute(π)`, and residue-class projections are legitimate because their index mappings are declaratively known. An arbitrary callback `selector(i,value)` is qualitatively different.

### Partition and interleave must be semantic operators

Partitioning cannot be an inference side effect.

Let lane labels be

\[
L=\{A_1,\ldots,A_k\}.
\]

A schedule is a word

\[
\tau\in L^n
\]

assigning every input position to a lane. The lane \(A_j\) is the ordered projection

\[
V_{A_j}=
(v_i\mid \tau_i=A_j).
\]

Define

\[
\operatorname{weave}(T;P_1,\ldots,P_k)
\]

to hold when there exists an allowed schedule \(\tau\in T\) of the appropriate length and each projected lane satisfies its corresponding pattern.

This gives several precisely different concepts:

\[
T=(AB)^*
\]

means strict alternating interleave;

\[
T=A^*B^*
\]

means an A block followed by a B block;

\[
T=(A|B)^*
\]

means unconstrained binary shuffle, subject to whatever explicit lane-coverage constraints accompany it.

Formal-language shuffle is exactly the arbitrary-interleaving case, with component order preserved; regular trajectories provide the natural formalism for constraining the interleaving schedule. citeturn19academia26

Consequently, **“partition into two APs” must never mean “find whatever partition makes this true.”** A pattern must state the partition mechanism: alternate positions, residue classes modulo \(k\), explicit tags, an explicit finite permutation, or explicitly request existential shuffle semantics. A compiler may optimize that declaration but must not invent it.

For the motivating example, an algebraic—not syntactic—description is:

\[
\begin{aligned}
&\operatorname{weave}\big((AB)^*;\,
  \operatorname{capture}(A,\top),
  \operatorname{capture}(B,\top)\big)
\\
&\land\;
\exists d.\;
\operatorname{adjacent}(A,\Delta_d)
\land
\operatorname{adjacent}(B,\Delta_d)
\land d=3.
\end{aligned}
\]

Its successful witness contains:

\[
\tau=ABABAB,
\]

\[
A=[(0,1),(2,4),(4,7)],
\qquad
B=[(1,3),(3,6),(5,9)],
\]

and relation instances

\[
4-1=3,\quad 7-4=3,\quad
6-3=3,\quad 9-6=3.
\]

Nothing is discovered, scored, or guessed.

### Permutation and hierarchy belong at different layers

A known finite permutation \(\pi\) is a useful structural view:

\[
\operatorname{permute}_{\pi}(S)
=
(S_{\pi(0)},\ldots,S_{\pi(n-1)}).
\]

An existential statement “there exists some permutation that makes \(P\) true” is materially different: it introduces combinatorial assignment. It can still be declarative, but should be an explicit advanced construct rather than the default meaning of `permutation`.

Hierarchy should not be forced into sequence arithmetic. Graph query systems demonstrate why. SPARQL basic graph patterns use shared variables as joins, while property paths add regular-expression-like composition, alternatives, inversion, and repetition over graph edges; solution mappings provide variable bindings. citeturn13search0 This suggests a future hierarchy/graph family based on explicit relations such as `parent`, `edge`, or compiler-known path operators. It does **not** justify treating arbitrary graph reachability as a primitive of the core numerical sequence algebra.

## Composition, captures, and algebraic laws

### Value relations and subsequence relations should be different sorts

The distinction requested in the research question should be explicit in the type system.

A **value relation** has fixed finite arity:

\[
R\subseteq D_1\times\cdots\times D_k.
\]

Examples are

\[
x=y,\quad x<y,\quad y-x=d,\quad y=2x+1.
\]

A **sequence relation** should normally be constructed by applying a fixed-arity relation according to a declared traversal/alignment:

\[
\operatorname{adjacent} :
\operatorname{Seq}(D)\times\operatorname{Rel}(D,D)\to\operatorname{Bool},
\]

\[
\operatorname{correspond} :
\operatorname{Seq}(A)\times\operatorname{Seq}(B)
\times\operatorname{Alignment}
\times\operatorname{Rel}(A,B)
\to\operatorname{Bool}.
\]

This avoids magical overloading such as allowing `A == B` sometimes to mean scalar equality, sometimes sequence equality, sometimes multiset equality, and sometimes elementwise equality after an inferred permutation.

The alignment is part of the meaning.

For example:

\[
\operatorname{correspond}(A,B,\text{zip},=)
\]

means same length and pairwise equality;

\[
\operatorname{correspond}(A,B,\text{reverseZip},=)
\]

means mirror correspondence;

\[
\operatorname{correspond}(A,B,\text{lag}(2),\Delta_3)
\]

means an explicitly shifted pairwise relation.

This resembles the distinction in array programming between array structure and operations along a chosen axis: `numpy.diff`, for example, specifies the axis on which adjacent differencing is performed rather than guessing one. citeturn15search4

### Captures should be immutable semantic bindings

Captures should obey four rules.

First, a capture binds a **match object**, including source indices and values, not merely a serialized substring.

Second, repeated captures are collections/views. There should be no implicit rule that “capture X means the most recent X” after repetition. Flink's row-pattern semantics illustrate both the usefulness and the danger here: a pattern variable denotes a set/list of rows, while scalar use can implicitly select its latest value; navigation functions such as `FIRST` and `LAST` make other selections explicit. citeturn16search0 A cleaner relational algebra should require explicit selection whenever a sequence-valued capture is used as a scalar.

Third, bindings are immutable and lexically scoped. SPARQL's solution mappings provide a useful comparison: shared variables join pattern pieces through compatible bindings, and `BIND` introduces a value without permitting rebinding of an already in-scope variable. citeturn13search0

Fourth, branch scope should be statically checkable. After

\[
P(x)+Q(y),
\]

neither \(x\) nor \(y\) is unconditionally available unless the type system represents the branch result explicitly. After

\[
P(x)+Q(x),
\]

a common capture \(x\) can be exposed if both branches bind compatible types.

These rules would make relational captures closer to lexical variables in a logic than to mutable storage.

### Relational parameters should use constraints, not assignment

The motivating step need not be computed procedurally.

Suppose lane \(A=(a_0,a_1,\ldots)\). Instead of:

```text
d = a[1] - a[0]
for each pair:
    if next - current != d: fail
```

the algebra says:

\[
\exists d.\;
\Delta(a_0,a_1,d)
\land
\operatorname{adjacent}(A,\Delta_d).
\]

The same \(d\) can then constrain another capture:

\[
\operatorname{adjacent}(B,\Delta_d).
\]

This is genuine relational capture: **bind by satisfying a relation**, not by running arbitrary code.

There is strong precedent for the general idea of freezing or registering an observed value and comparing later observations with it. Register automata operate over data words by retaining data values for later comparisons; single-use restrictions recover a substantially more robust algebraic theory than unrestricted register-machine variants. citeturn17search12 Freeze LTL similarly stores a current data value into a register for later equality tests. A particularly cautionary result is that the future-time one-register fragment over finite data words is decidable, while adding another register or past-time machinery crosses into undecidability in that formalism. citeturn18academia25 STL* adds a value-freezing operator to Signal Temporal Logic specifically to compare later signal behavior against remembered signal values. citeturn18academia27

The lesson is not that STRling should adopt those exact restrictions. It is that **capture power is an expressiveness dimension in its own right** and should be designed explicitly.

### Preserve the Kleene laws wherever possible

For the pure structural fragment, choice and sequencing should inherit standard regular/Kleene identities. Writing \(+\) for alternative, \(\cdot\) for sequence, \(0\) for impossible, \(1=\epsilon\) for empty sequence, and \(^*\) for repetition:

\[
P+Q=Q+P
\]

\[
(P+Q)+R=P+(Q+R)
\]

\[
P+P=P
\]

\[
(PQ)R=P(QR)
\]

\[
P(Q+R)=PQ+PR
\]

\[
(P+Q)R=PR+QR
\]

\[
1P=P1=P
\]

\[
0P=P0=0.
\]

Kleene algebra exists precisely to axiomatize this family of regular-event identities, while KAT demonstrates how Boolean predicates/tests can coexist with the structure. citeturn17search0turn17search4

This gives STRling a strong principle:

> **Do not let relational extensions invalidate ordinary structural identities unless their side conditions make that unavoidable and explicit.**

For instance, a capture-sensitive pattern may make naïve reordering invalid because the capture environment changes, but plain `seq` and `alt` nodes without capture effects should still obey their normal algebra.

### Relational constraints should normalize algebraically

Conjunction of pure constraints is associative, commutative, and idempotent:

\[
C\land D=D\land C,
\]

\[
(C\land D)\land E=C\land(D\land E),
\]

\[
C\land C=C.
\]

Equality is reflexive, symmetric, and transitive. Difference has useful inverse laws:

\[
\Delta(x,y,d)\iff\Delta(y,x,-d).
\]

Affine constraints can be normalized to a canonical linear form:

\[
a_1x_1+\cdots+a_kx_k=c.
\]

SMT-LIB's linear arithmetic fragments deliberately permit concrete scalar coefficients while excluding variable-variable products from their linear atoms. citeturn20search5 That boundary maps well onto a compiler normalization strategy.

Useful derived rewrites then become possible. For an additive domain:

\[
\operatorname{reverse}(\operatorname{AP}(S,d))
\equiv
\operatorname{AP}(\operatorname{reverse}(S),-d).
\]

For an affine transform \(f(x)=ax+b\):

\[
\operatorname{AP}(S,d)
\Rightarrow
\operatorname{AP}(f(S),ad).
\]

For an ordered domain:

\[
\operatorname{strictIncreasing}(S)
\Rightarrow
\operatorname{nondecreasing}(S).
\]

For views:

\[
\operatorname{reverse}(\operatorname{reverse}(S))=S.
\]

For explicit permutations:

\[
\operatorname{permute}_{\pi}
\circ
\operatorname{permute}_{\sigma}
=
\operatorname{permute}_{\sigma\circ\pi},
\]

up to whichever function-composition convention the IR adopts.

These are exactly the kinds of laws a compiler can exploit without understanding any application-specific meaning.

A future optimizer could implement such identities through ordinary canonical rewriting or equality saturation. E-graphs are a well-established implementation technique for compactly representing many equivalent expressions, and the `egg` work demonstrates their use for rewrite-driven optimization. citeturn14academia12 This is an implementation option rather than part of the proposed language semantics.

### Parser combinators identify an important language boundary

Parser-combinator research provides a useful programming-language analogy. Applicative structure is weaker than monadic structure: computations can be combined and sequenced without giving the earlier result the power to determine the structure of the later computation. The Haskell `Applicative` documentation explicitly notes that lacking full monadic bind admits more static analysis and sharing, including for parsers. citeturn12search0turn12search5

Monadic parser combinators, by contrast, deliberately have the full power of the host language and can define new combinators and data-dependent parsing behavior. citeturn11search0 Research on data-dependent parser combinators notes that arbitrarily rich semantic actions make automated reasoning substantially harder. citeturn11academia27

That distinction should directly inform STRling:

\[
\boxed{\text{captures may constrain later structure, but must not construct later structure}}
\]

A relation like

\[
\text{later.value} = \text{captured.value}+3
\]

is appropriate.

An operation semantically equivalent to

```text
capture x;
return arbitraryPatternGenerator(x);
```

is not. That is monadic bind over patterns and is a programming-language boundary.

## Prior-art comparison

No single existing formalism exactly matches the proposed target. The useful result is a synthesis of several established traditions.

| Formalism | What it already expresses | Lesson for STRling | Boundary not to import wholesale |
|---|---|---|---|
| **Regular expressions / Kleene algebra / KAT** | Choice, concatenation, repetition; KAT combines regular structure with Boolean tests and equational reasoning. citeturn17search0turn17search4 | Preserve a regular structural algebra and explicit predicate layer. | KAT is a program algebra, not directly a multi-value sequence relation language. |
| **Guarded KAT** | Restricts KAT union/iteration to guarded forms and obtains a much more tractable equational theory. citeturn17search2 | Restrictions are a feature: syntax can be intentionally less expressive to retain verification properties. | Do not infer that GKAT's exact grammar is appropriate for patterns. |
| **Symbolic automata** | Finite-state structure whose transitions use predicates over rich/infinite alphabet theories. citeturn17search5turn17search1 | Excellent model for unary value tests and typed background theories. | Ordinary symbolic automata do not by themselves provide arbitrary cross-position value relations. |
| **Register automata / data words / Freeze LTL** | Store values from an infinite alphabet and compare them later; small changes in register power materially affect formal properties. citeturn17search12turn18academia25 | Treat scalar relational captures/registers as an explicit expressiveness tier. | Do not expose an unrestricted register machine. |
| **SQL `MATCH_RECOGNIZE` / CEP** | Explicit partition/order, regex-like row structure, pattern-variable conditions referencing previous matched rows, navigation, measures, match classification. citeturn21view0turn16search0 | Closest practical architecture: structure + roles + relational conditions + witness/projection. | SQL expressions, aggregates, subqueries, and UDFs are much broader than a small pattern algebra. |
| **Shuffle languages and regular trajectories** | Interleave component words while preserving lane order; trajectories constrain the schedule. citeturn19academia26 | Formal foundation for declared weave/interleave semantics. | Arbitrary existential shuffle can create substantial ambiguity and state growth; it should be explicit. |
| **Temporal/signal logic** | STL relates predicates to temporal ordering; STL* freezes signal values so later samples can be compared against prior ones. citeturn18academia27 | Value freezing/cross-time relation is established and useful; temporal position and value relation can remain distinct. | Robustness scoring and control synthesis are outside this inquiry. |
| **Linear arithmetic / SMT theories** | Equality, order, difference, and affine constraints with clear theory boundaries; QF linear theories permit literal coefficients but not general nonlinear atoms. citeturn20search5turn20search8 | Strong candidate semantic theory for the first numerical relation core. | Do not expose all SMT-LIB theories as pattern syntax. |
| **miniKanren / constraint logic programming** | Relations can be full programs, with unification, arithmetic constraints, interpreters, theorem provers, and bidirectional search. citeturn20search1 | Demonstrates the power and elegance of relations. | Also demonstrates exactly what “pattern algebra becoming a relational programming language” looks like. |
| **SPARQL/property paths** | Shared-variable joins plus regular path composition over graph edges; solution mappings expose bindings. citeturn13search0 | Good model for immutable relational bindings and a separate future graph/hierarchy family. | General graph querying is not needed in the numerical sequence core. |
| **Applicative vs monadic parser combinators** | Applicative composition retains more static structure; monadic parsers can make later parsing depend arbitrarily on earlier values and use the full host language. citeturn12search5turn11search0 | Relational capture references should resemble closed applicative dependency, not arbitrary bind. | Host-language semantic actions and pattern-generation callbacks. |
| **Term rewriting / equality saturation** | Equational rules normalize or retain equivalent representations; e-graphs compactly represent many equivalent forms. citeturn14academia12 | Algebraic laws should be explicit enough for verified/compiler-known rewrites. | User-defined unrestricted rewriting is itself a programmable computation mechanism. |

Two prior-art conclusions are especially important.

First, **SQL row-pattern recognition is the closest architectural precedent**. Oracle separates structural `PATTERN`, relational `DEFINE`, partition/order semantics, and `MEASURES`; its `PREV`, `FIRST`, `LAST`, `CLASSIFIER`, and `MATCH_NUMBER` facilities make the match's relational roles observable. citeturn21view0 A future STRling algebra can adopt that separation while being significantly smaller, more statically typed, and less SQL-like.

Second, **data-word/register research gives the clearest warning**. Remembering one prior value and comparing it later sounds like a tiny extension, yet the exact number and scope of registers can determine whether important reasoning problems remain decidable. citeturn18academia25turn18search0 Consequently, “captures may appear in relational constraints” cannot be treated as an innocuous implementation detail.

## Expressiveness boundaries and witness semantics

### Use explicit expressiveness strata rather than one binary “regular/non-regular” label

The desirable algebra need not remain within classical regular languages. The user's motivating goal inherently concerns values and relationships beyond character-class membership. The important boundary is not simply “regular versus non-regular”; it is **declarative, compiler-understood relational structure versus unrestricted user computation**.

A useful classification is:

| Stratum | Capabilities | Character |
|---|---|---|
| **Structural-symbolic** | `seq`, `alt`, `repeat`, unary typed predicates | Regular/symbolic-automata-like |
| **Scalar-relational** | Finite scalar captures, equality/order/difference, fixed-window affine relations | Data/register-like; beyond ordinary finite-alphabet regex semantics |
| **Sequence-relational** | Arbitrary-length sequence captures, pairwise correspondence, symmetry/reversal, explicit weave | Can be non-regular; requires separate compiler/runtime classification |
| **Specialized theory** | Geometric ratios, nonlinear relations, domain-specific metrics, specialized recurrences | Admit only through explicitly defined background theories |
| **Programming boundary** | User recursion/fixpoints, callbacks, general folds, mutable state, dynamic pattern construction, arbitrary user-defined relations | Outside the pattern algebra |

This classification is more honest than trying to label every new feature “regex.” Backreferences demonstrate the issue sharply: once an arbitrary-length captured string can be required to recur, expressive power exceeds regular languages and can even describe non-context-free languages. citeturn19academia25turn19search3 Current research continues to find substantial complexity in matching regexes with unrestricted backreference facilities. citeturn19search5turn19academia24

Therefore, a relation such as

\[
\operatorname{correspond}(A,B,\operatorname{zip},=)
\]

where both \(A\) and \(B\) can be unbounded sequence captures should be considered a **sequence-relational capability**, not silently lowered as though it were an ordinary regular operation.

That does not mean it should be rejected. It means its semantic class must be explicit.

### The safe arithmetic envelope should be affine by default

For integers/reals, an especially coherent base fragment consists of Boolean combinations/conjunctions of:

\[
x=y,
\]

\[
x<y,\quad x\le y,
\]

\[
x-y=c,
\]

and, more generally,

\[
a_1x_1+\cdots+a_kx_k=c
\]

with fixed literal coefficients.

This corresponds closely to established linear arithmetic fragments. SMT-LIB's QF_LRA allows concrete coefficients \(c\cdot x\) while defining linear atoms specifically to exclude unrestricted multiplication and division among variables. citeturn20search5

That envelope covers:

- equality and inequality;
- order;
- difference;
- offsets;
- monotonicity;
- arithmetic progressions;
- fixed-lag arithmetic relationships;
- affine transformations with supplied literal parameters;
- fixed-order linear recurrences with literal coefficients;
- equality between captured steps.

It notably does **not** require arbitrary multiplication.

This matters for ratio semantics. With literal \(q\),

\[
y=qx
\]

is still linear in the variables and can be a closed scale relation.

With captured/unknown \(q\),

\[
y=qx
\]

contains a product of two match variables and no longer belongs to that linear fragment. Consequently:

> **`ratio` should not be a fundamental core operator equivalent in status to `difference`.**

A geometric-progression convenience can still exist, but its semantics should either require a literal/external ratio parameter or live in a separately classified multiplicative theory.

This avoids the false blanket claim that “multiplication is always undecidable.” Mathematical decidability boundaries are subtler than that. The narrower and useful point is that introducing variable-variable products abandons the clean linear-arithmetic theory on which straightforward normalization and solver-backed verification can rely. SMT-LIB makes precisely this syntactic distinction between its linear and nonlinear logics. citeturn20search5turn20search9

### Do not assume that individually safe features compose safely

Formal-language and logic research repeatedly shows that apparently modest combinations can cross major boundaries. Adding an uninterpreted unary predicate to Presburger arithmetic already makes certain very restricted fragments undecidable. citeturn20academia49 Freeze LTL's one-register future-only fragment has a decidability result, while one additional register or past operators changes the picture radically. citeturn18academia25 Unrestricted register automata also lose much of the robust algebraic equivalence between machine models recovered under the single-use restriction. citeturn17search12

The appropriate STRling design policy is therefore:

> **Every new operator should declare both its local semantics and its interaction class with existing operators.**

“Primitive X is decidable” is insufficient evidence that `X + captures + star + correspondence + negation` preserves desirable compiler properties.

This report intentionally does not perform the systematic complexity matrix reserved for the Computational Boundaries work. The obvious architectural consequence is simply that the IR should carry an **expressiveness classification** after semantic analysis, rather than treating every relational AST as the same execution problem.

### The programming-language boundary can be stated syntactically

A practical definition of the intended boundary is possible before final syntax exists.

A relational STRling pattern remains inside the proposed algebra when:

1. Its structural AST is finite and built from compiler-known constructors.
2. Iteration is regular structural repetition, not invocation of a user-defined recursive relation.
3. Relational predicates come from a finite, typed compiler-known theory.
4. Captures are immutable.
5. A captured value may parameterize a later relation but may not generate a new pattern AST.
6. Sequence traversal occurs only through compiler-known lifts such as `adjacent`, `window`, and `correspond`.
7. There is no general `fold`, while-loop, recursion, fixpoint, mutation, or unbounded user state.
8. There is no arbitrary host-language callback inside matching semantics.
9. Quantification is limited to match choices and theory-supported relation variables; there is no quantification over functions, programs, or arbitrary relations.

This is an intentionally **applicative rather than monadic** discipline. Applicative interfaces are weaker than monads precisely because later computation structure cannot depend arbitrarily on an earlier result; that weaker structure admits analyses unavailable to general bind-based composition. citeturn12search0turn12search5

miniKanren illustrates the far side of the line. Its goal is explicitly to make programs relational; the literature demonstrates relational interpreters, theorem provers, constraint arithmetic, and general relational programming. citeturn20search1 Those are valuable capabilities, but importing their generality would answer the primary question incorrectly: STRling would have created a programming language whose programs happened to be relations.

### Successful matches should carry proof-relevant witnesses

A Boolean `match/no match` result is too weak for a relational pattern system. A successful match should expose a structured witness:

\[
\omega=
(\omega_{\text{structure}},
 \omega_{\text{captures}},
 \omega_{\text{partition}},
 \omega_{\text{relations}},
 \omega_{\text{correspondence}}).
\]

The **structural witness** records the source extent, alternatives chosen, repetition instances, and subpattern derivation.

The **capture witness** records every capture's type, source positions, and observed values.

The **partition witness** records the exact lane assignment or selector result. For a weave, this includes the actual schedule word.

The **relation witness** records normalized atomic constraints and parameter bindings.

The **correspondence witness** records which occurrence on one side was paired with which occurrence on the other.

SQL row-pattern matching gives useful precedent. Oracle's `CLASSIFIER()` exposes the pattern variable assigned to each row; `MATCH_NUMBER()` identifies the match; `FIRST`, `LAST`, and measures expose values derived from the matched roles. citeturn21view0 The proposed STRling witness should generalize this concept beyond rows and SQL.

For the motivating sequence, an expanded witness could conceptually contain:

```text
source:
  indices = [0,1,2,3,4,5]
  values  = [1,3,4,6,7,9]

weave:
  schedule = [A,B,A,B,A,B]

capture A:
  indices = [0,2,4]
  values  = [1,4,7]

capture B:
  indices = [1,3,5]
  values  = [3,6,9]

parameter d:
  value = 3

relations:
  delta(A[0], A[1]) = 3
  delta(A[1], A[2]) = 3
  delta(B[0], B[1]) = 3
  delta(B[1], B[2]) = 3
```

That representation gives users, diagnostics, optimizers, tests, and future explanation systems the same ground truth.

It also creates a valuable distinction between a **compact witness**, sufficient to reproduce/verify the match, and an **expanded explanation**, which derives higher-level statements such as “A and B are arithmetic progressions with equal step.” The former belongs in core semantics; the latter can be tooling.

## Recommendations for STRling research

The evidence supports the following candidate vocabulary as the working research model, without committing to final STRling surface syntax.

| Layer | Candidate vocabulary | Status |
|---|---|---|
| Structure | `atom`, `seq`, `alt`, `repeat` | Fundamental |
| Binding/filtering | `capture`, `where` | Fundamental |
| Views | `project`, `lane`, `reverse`, `lag` | `project` fundamental; others derived view constructors |
| Parallel structure | `weave(schedule, lanes…)` | Fundamental |
| Scalar equality | `eq`, `neq` | Equality fundamental; inequality derived/primitive negation |
| Scalar order | `lt`, `le`, `gt`, `ge` | Fundamental on ordered domains |
| Additive relation | `delta(x,y,d)` | Fundamental on additive domains |
| Linear relation | `affine(coefficients, vars, constant)` | Fundamental theory-level form |
| Metric relation | `distance`/metric threshold | Fundamental only for metric-capable domains |
| Sequence lifts | `each`, `adjacent`, `window`, `correspond` | Fundamental |
| Sequence conveniences | monotone, AP, periodic | Derived |
| Multiplicative conveniences | fixed-ratio scale, GP | Theory-specific / derived |
| Arrangement conveniences | alternation, explicit permutation, reflection, symmetry | Derived |
| Recurrence | fixed-window closed relation | Derived family |
| Hierarchy | explicit parent/edge/path family | Separate future structural theory |
| Arbitrary functions, recursion, folds, mutable captures | none | Explicitly outside the algebra |

The nine research questions then have fairly direct answers.

**Which primitives are genuinely fundamental?**

Structural regular composition, explicit projection/weaving, immutable capture, equality/order, additive or affine relation forms, and the relational lifts `adjacent`, `window`, and `correspond`. Most named motifs are derived. Kleene/KAT, symbolic automata, shuffle trajectories, and row-pattern SQL independently support this decomposition. citeturn17search0turn17search5turn19academia26turn21view0

**Which compose cleanly?**

Regular structure composes cleanly under Kleene laws; pure constraints under Boolean conjunction; affine relations under normalization; explicit index transformations under functional composition; sequence relations when their alignment is explicit. GKAT is particularly strong evidence that deliberately constrained composition can preserve a useful equational theory. citeturn17search2

**How should relations over values differ from relations over subsequences?**

Value relations should be finite-arity predicates in a typed theory. Subsequence relations should be explicit lifts of those predicates over a traversal/alignment. A subsequence must not silently coerce to “latest element,” “set,” “multiset,” or “elementwise vector.” Flink's distinction between pattern-variable collections and logical navigation shows why this must be explicit. citeturn16search0

**How should captures participate in later relational constraints?**

As immutable lexical bindings to values/views/parameters. Repeated captures yield ordered collections. Scalar relational parameters may be bound through supported constraint equations. They may parameterize later predicates, but they may not generate later pattern structure. Register/freeze logics show both the utility and the formal significance of this capability. citeturn17search12turn18academia25

**How should partition/interleave semantics be declared rather than guessed?**

With explicit view constructors and a `weave` operator parameterized by a schedule language or deterministic selector. Alternation can use a schedule such as \((AB)^*\); arbitrary shuffle requires an explicit schedule language such as \((A|B)^*\). Regular trajectories are direct formal-language precedent. citeturn19academia26

**Which algebraic properties enable compiler simplification or verification?**

Kleene identities for structural nodes; Boolean/idempotent laws for constraints; canonical affine forms; involution of reverse; group composition for permutations; inverse laws for differences; alpha-renaming of captures; and theory-specific transformation laws. KAT demonstrates the value of equational reasoning, and equality-saturation work provides one implementation route for exploiting large rewrite sets. citeturn17search0turn14academia12

**Where does expressiveness cross into arbitrary computation?**

The decisive boundary is user-definable recursion/fixpoints, arbitrary host callbacks, dynamic construction of future patterns from captures, general folds/aggregates capable of simulating arbitrary state, mutable bindings, higher-order relation variables, or an extensible rule language. miniKanren provides a concrete example of relations becoming general programs; monadic parser combinators provide the corresponding pattern-construction analogy. citeturn20search1turn11search0

**What useful relational pattern classes already have established formalisms?**

Regular/Kleene structure; symbolic predicates; data/register comparisons; row-pattern recognition; shuffle/trajectory interleaving; linear arithmetic and difference constraints; temporal/value-freeze relations; linear recurrences; graph path relations; and backreference-like sequence equality all have mature formal antecedents. citeturn17search5turn17search12turn21view0turn19academia26turn20search8turn18academia27turn15academia36turn13search0turn19academia25

**What explanation/witness structure should a successful match expose?**

At minimum: source positions, structural derivation, capture bindings, explicit partition/lane assignment, relation-parameter bindings, instantiated atomic constraints, and correspondence maps. Oracle's row classifier/match numbering demonstrates the practical value of making role assignments observable rather than returning only a Boolean. citeturn21view0

For STRling specifically, the best architectural hypothesis is **not** “extend the existing regex IR until it can execute arbitrary numerical relationships.” STRling's current architecture deliberately has a target-agnostic IR and semantic APIs whose constructs map predictably to IR nodes. fileciteturn12file0L2-L2 At the same time, Research Intelligence's current non-text-sequence inquiry warns that common sequence vocabulary does not justify one universal IR/runtime and explicitly declines the earlier universal `Sequence<T>` architecture. fileciteturn10file0L2-L2

A more defensible future decomposition is therefore:

\[
\text{Relational Pattern AST}
\longrightarrow
\text{semantic classification}
\longrightarrow
\begin{cases}
\text{regular/symbolic IR}\\
\text{scalar-relational IR}\\
\text{sequence-relational IR}\\
\text{specialized-theory IR}
\end{cases}
\]

with lowering only where semantics warrant it. A purely structural or unary-symbolic pattern might still compile to regex/automata machinery. A finite-register equality pattern belongs to a different semantic class. An arbitrary-length cross-capture correspondence is backreference-like and should be classified accordingly. A numerical affine pattern may be evaluated by a dedicated relational matcher or constraint-aware engine. This respects STRling's compiler architecture without assuming all future pattern domains share one execution mechanism. fileciteturn1file0L2-L2 fileciteturn10file0L2-L2

The central research proposition can thus be stated compactly:

\[
\boxed{
\begin{array}{c}
\textbf{Keep structure regular.}\\
\textbf{Keep relations closed and typed.}\\
\textbf{Make subsequence alignment explicit.}\\
\textbf{Make captures immutable and proof-relevant.}\\
\textbf{Treat interleaving as declared structure.}\\
\textbf{Derive motifs from small relational lifts.}\\
\textbf{Classify non-regular power instead of hiding it.}\\
\textbf{Never let captured data manufacture arbitrary future patterns.}
\end{array}}
\]

That yields something materially broader than conventional regex, but still recognizably a **pattern algebra rather than a general-purpose language**. The present research stage is complete.
