# Rigorous Semantics for Heterogeneous Symbolic Approximate Matching

Role: Research report
Origin: AI-assisted deep research commissioned for STRling Research Intelligence
Generated: 2026-08-14
Imported: 2026-08-14
Source verification: Partially verified
Last reviewed: 2026-08-14
Current status: Active input

## Executive finding

The central design conclusion is that **heterogeneous symbolic evidence should be vector-valued by default and scalar-valued only by an explicit, independently named aggregation contract**.

For two symbols \(x\) and \(y\), the primary result should conceptually be something like

\[
E(x,y)=\big(e_1(x,y),e_2(x,y),\ldots,e_m(x,y)\big)
\]

where each component is not merely a number but a typed observation:

\[
e_i=(\text{kind},\ \text{value},\ \text{scale contract},\ \text{provenance}).
\]

An optional aggregate is then a **derived result**:

\[
A(x,y)=g(E(x,y);\theta),
\]

where \(g\) is a named aggregation rule and \(\theta\) contains its authored or learned parameters. The crucial semantic boundary is that \(A\) must not erase \(E\), and the existence of \(A\) must not change what any component originally meant.

This is strongly aligned with the repository's current active inquiry. Its present synthesis says that edit distance is a defined distance or cost, weighted automata aggregate under a selected algebra, scores order or filter under a convention, probabilities require a probabilistic model, and calibrated confidence requires empirical calibration; it explicitly says these terms are not interchangeable and rejects a single stochastic logic that collapses them. fileciteturn6file0L2-L2 That boundary is especially important because the repository classifies historical reports as research inputs rather than current authority and states that original papers, standards, controlled evidence, and downstream product repositories retain the relevant authority. fileciteturn9file0L2-L2

The most important recommendations are therefore:

**Keep evidence typed.** A visual-similarity value, a structural Boolean relation, an edit cost, a fuzzy membership grade, and a posterior probability are different mathematical objects even when all happen to be encoded between 0 and 1.

**Keep heterogeneous evidence separate until there is an explicit reason to scalarize it.** A scalar is justified when there is a defensible common geometry, a defined user preference/tradeoff model, a weighted-automaton algebra, or an empirical probabilistic/ranking model. The mere desire to sort results is not enough to make the inputs commensurable.

**Treat authored and learned weights as fundamentally different.** Authored weights express policy or tradeoffs. Learned weights are fitted model parameters conditional on data, labels, loss, regularization, and deployment distribution. Neither should masquerade as an intrinsic amount of symbolic similarity.

**Make thresholds inherit the semantics of the quantity they threshold.** \(d\le\tau\), \(S\ge\tau\), \(\mu\ge\tau\), and \(P(H\mid E)\ge\tau\) make four different claims. A threshold does not magically add semantic meaning to its input.

**Reserve probabilistic language for probabilistic models.** A normalized score, fuzzy membership degree, kernel value, weighted sum, or tropical-semiring path cost is not a probability just because its value lies in \([0,1]\).

**Reject pseudo-precision.** A result such as “0.873462 confidence” is unjustified unless there is a precisely defined target event, a statistical model producing an estimated probability, relevant calibration evidence, and empirical resolution supporting those digits. Calibration itself has a population/frequency interpretation: Dawid's canonical formulation says that events assigned, for example, a 30% forecast should occur about 30% of the time in the corresponding long-run group. citeturn11search7

The appropriate conceptual architecture is therefore:

\[
\boxed{
\text{typed observations}
\rightarrow
\text{optional normalization}
\rightarrow
\text{explicit aggregation}
\rightarrow
\text{optional ranking/decision}
}
\]

and **not**

\[
\boxed{
\text{arbitrary attributes}
\rightarrow
\text{one “similarity/confidence” number}.
}
\]

## Numeric outputs are different mathematical objects

A future symbolic matcher needs a small semantic type system for result values. Numeric representation alone cannot supply this type information.

| Concept | Mathematical meaning | What a value can legitimately mean | What it does **not** imply |
|---|---|---|---|
| **Equality** | \(x=y\) | Identity of the objects under the domain's equality relation | Mere resemblance, substitutability, or semantic equivalence |
| **Equivalence** | \(x\sim_R y\), where \(R\) is a named equivalence relation | Same equivalence class under a specified reflexive, symmetric, transitive relation | Object identity or graded similarity |
| **Semantic equivalence** | A domain-defined equivalence claim concerning meaning | Interchangeability under whatever semantic contract defines it | It cannot be inferred merely because a similarity score is high |
| **Similarity** | A specified function or relation \(s(x,y)\) | Degree/order of resemblance according to that particular function | Metric geometry, probability, or equivalence |
| **Distance** | Usually \(d(x,y)\ge0\), smaller is closer; a metric satisfies identity, symmetry, triangle inequality | Geometric separation according to a declared metric | Probability of mismatch |
| **Pseudodistance** | Metric-like but distinct objects can have \(d(x,y)=0\) | Indistinguishability under the chosen geometry | Equality |
| **Cost** | Penalty for an operation/path/decision, often nonnegative | Expense under a declared cost model | Metric properties unless separately proved |
| **Score** | Arbitrary real-valued evaluation under a named scoring rule | Ordering or filtering according to that rule | Probability, cardinal similarity, or objective truth |
| **Fuzzy membership/similarity degree** | \(\mu\in[0,1]\) under a named fuzzy set or relation | Degree of membership according to that fuzzy semantics | Frequency or probability merely because the range is \([0,1]\) |
| **Likelihood** | \(P(E\mid H)\), viewed as a function of \(H\) for observed \(E\) | How compatible observed evidence is with a hypothesis under a statistical model | \(P(H\mid E)\) |
| **Probability** | A normalized measure of an explicitly defined event/hypothesis under a probabilistic model | Probability conditional on the stated information/model | Truth, calibration, or certainty about an individual case |
| **Calibrated confidence** | Preferably: a predicted probability with empirical calibration evidence for a defined event/population | A probabilistic forecast whose numerical levels have validated frequency meaning | A generic synonym for “large score” |

A metric specifically requires zero distance exactly at equality, symmetry, and the triangle inequality. A pseudometric retains the metric structure but weakens separation so that distinct points may be at zero distance. Mathlib's formal definitions make exactly this distinction. citeturn10view0turn10view1

That distinction is unusually useful for symbolic systems. If two distinct symbols are deliberately indistinguishable **with respect to one particular relation**, a pseudometric can represent that without falsely asserting equality. Indeed, for any pseudometric,

\[
x\sim_d y \iff d(x,y)=0
\]

defines an equivalence relation: reflexivity follows from \(d(x,x)=0\), symmetry from metric symmetry, and transitivity follows because \(d(x,z)\le d(x,y)+d(y,z)=0\). This is an algebraic consequence of the pseudometric axioms, not a claim that the two symbols are identical. citeturn10view1

### Similarity is not inverted distance by definition

A similarity function is simply whatever function the contract defines. It may be bounded or unbounded, symmetric or asymmetric, metric-derived or not. If one deliberately defines

\[
s(x,y)=f(d(x,y))
\]

for a strictly decreasing function \(f\), then \(s\) and \(d\) induce opposite rankings. But this does not make \(s\) a metric, nor does an arbitrary transformation preserve distances, triangle inequalities, or meaningful distance ratios.

This is one reason a system should not casually convert “distance 0.2” into “similarity 0.8.” The expression \(1-d\) makes sense only when \(d\) has been intentionally normalized into an appropriate unit interval and when that complement has an explicitly desired interpretation. It is a transformation, not a theorem.

### Cost is broader than distance

A cost function may be asymmetric:

\[
c(x,y)\ne c(y,x),
\]

may depend on context, and may violate the triangle inequality. That can be entirely correct. For example, a symbolic transformation model may legitimately assign a path-dependent penalty. Such a result should simply be called a **cost**, not a distance.

This matters directly for weighted automata. In standard weighted-automaton algorithms, the weight structure specifies how transition weights are combined along paths and how competing paths are combined; the tropical case gives the familiar “sum costs along a path, choose the minimum” behavior. Mohri's generalized shortest-distance treatment makes semiring choice explicit, and OpenFst similarly defines weighted algorithms in terms of semiring operations and a natural ordering of weights. citeturn10view2turn10view3

Therefore:

\[
\text{minimum path cost}\neq\text{distance}
\]

unless the resulting pairwise function has separately been shown to satisfy the distance axioms.

### Fuzziness and probability answer different questions

Fuzzy-set theory gives values in \([0,1]\) to grades of membership, and Zadeh's later possibility work explicitly developed possibility theory from fuzzy sets rather than equating fuzzy membership with ordinary probability. citeturn11search3turn11search15turn11search16 A value

\[
\mu_R(x,y)=0.8
\]

therefore means **degree 0.8 under fuzzy relation \(R\)**. It does not mean an 80% chance that \(R(x,y)\) is “really true.”

This distinction should survive serialization, APIs, visualization, ranking, and thresholding. A `0.8` without its semantic type is incomplete data.

### Likelihood is not posterior probability

For hypothesis \(H\) and observations \(E\),

\[
L(H;E)=P(E\mid H)
\]

is a likelihood. What a user usually means by “probability that this is a match” is instead

\[
P(H\mid E)
=
\frac{P(E\mid H)P(H)}
{P(E)}.
\]

Changing the prior \(P(H)\) can change the posterior without changing the likelihood. Likewise, likelihood values need not sum to one over competing hypotheses. Calling a likelihood a “confidence” therefore loses an essential part of the statistical model.

### A score has deliberately weak semantics

A score

\[
S:X\times X\rightarrow \mathbb R
\]

can be perfectly legitimate even when no stronger interpretation exists. If the only promise is “higher scores are preferred,” then any strictly increasing transformation

\[
S'(x,y)=h(S(x,y))
\]

preserves the ranking while changing numerical gaps and fixed thresholds.

That observation supplies a useful test:

> **If arbitrary monotone transformation preserves everything the system claims to care about, the quantity is fundamentally an ordinal ranking score, not a calibrated cardinal measure.**

Learning-to-rank makes this distinction concrete. RankNet/LambdaRank/LambdaMART were developed to learn ordering functions for ranking objectives; the output score is useful because it orders candidates, not because its raw magnitude is intrinsically a probability. citeturn10view7

## Defensible models for combining heterogeneous evidence

There is no universal aggregation rule. There are several mathematically defensible rules, but each is defensible for a **different semantic reason**.

### Metric and pseudometric aggregation

Suppose each component \(d_i\) is a pseudometric on the same object space. Then

\[
D_w(x,y)=\sum_{i=1}^{m} w_i d_i(x,y),
\qquad w_i\ge0
\]

is itself a pseudometric.

The proof follows directly from the axioms. Nonnegativity and symmetry are preserved by nonnegative weighted sums, and

\[
\begin{aligned}
D_w(x,z)
&=\sum_iw_i d_i(x,z)\\
&\le \sum_iw_i[d_i(x,y)+d_i(y,z)]\\
&=D_w(x,y)+D_w(y,z).
\end{aligned}
\]

If, in addition, the positively weighted component metrics **jointly separate points**—for every \(x\ne y\), at least one \(i\) with \(w_i>0\) has \(d_i(x,y)>0\)—then \(D_w\) is a metric. These conclusions follow directly from the metric and pseudometric axioms. citeturn10view0turn10view1

This is an important positive result: **weighted combination is mathematically clean when the inputs really are component distances and the weights have an explicit scale/tradeoff interpretation.**

But two caveats are decisive.

First, mathematical validity as a metric does **not** make the weights semantically non-arbitrary. A weighted metric can satisfy every metric axiom while embodying an entirely unjustified tradeoff between its component dimensions.

Second, placing several quantities in \([0,1]\) does not turn them into component metrics. A fuzzy membership value plus a probability plus an edit cost cannot be passed through the theorem above.

For cases where unlimited compensation is undesirable, a weighted maximum can also be useful:

\[
D_{\max}(x,y)=\max_i w_i d_i(x,y).
\]

Under the corresponding metric conditions this again preserves metric-like structure, but its semantics are closer to “the worst weighted dimension controls the result.” This can be preferable to a sum when no very strong dimension should be able to wash out a severe disagreement elsewhere.

### Vector and Pareto models

For genuinely heterogeneous evidence, the most defensible model is often no scalarization:

\[
E(x,y)=(e_1,e_2,\ldots,e_m).
\]

Candidates can still be compared under **Pareto dominance**. Candidate \(a\) dominates \(b\) when \(a\) is at least as good as \(b\) on every relevant dimension and strictly better on at least one.

This provides a partial order rather than forcing every pair to be comparable. That is not a weakness. It accurately represents the fact that, for example, one candidate can be better on visual evidence while another is better on a different independent relation, with no authorized rule saying which tradeoff is preferable.

A Pareto frontier is therefore a strong default when:

- the evidence types are heterogeneous;
- there is no defensible exchange rate among dimensions;
- retaining conflicting evidence matters;
- scalarization would be product policy rather than mathematical fact.

A related option is **lexicographic ordering**: compare one dimension first and consult later dimensions only on ties. This is appropriate only when the policy genuinely says that the first criterion has absolute priority over any quantity of lower-priority evidence.

### Multi-criteria value models

A weighted sum is much more defensible when interpreted as a **decision/value function** rather than an alleged physical or semantic similarity:

\[
V(x,y)
=
\sum_i w_i\,u_i(e_i(x,y)).
\]

Here \(u_i\) maps each raw criterion to a defined value scale, and \(w_i\) encodes tradeoffs on those value scales.

Multiattribute utility theory does not treat this form as assumption-free. Keeney's work on utility independence and related results establishes conditions under which additive or related decompositions are appropriate. citeturn10view4

That gives a crucial interpretation for user-authored symbolic weighting:

> “Visual evidence has weight 0.6 and structural evidence 0.4” can defensibly mean **this user's declared decision policy values the transformed criteria in that proportion under this contract**.

It cannot defensibly mean:

> “Visual evidence objectively constitutes 60% of symbolic similarity.”

The first is an authored utility/scoring policy. The second pretends that a subjective scalarization has discovered an intrinsic physical quantity.

Multi-criteria methods are therefore directly applicable when STRling eventually needs **policy-driven ordering**, particularly when users have explicit tradeoffs. They should not be used to manufacture a semantic “truth score.”

### Fuzzy aggregation

Fuzzy evidence can be aggregated within a fuzzy semantics using a named fuzzy connective. For example, a chosen t-norm may implement a fuzzy analogue of conjunction; different t-norms encode different notions of conjunction. Zadeh's fuzzy-set framework establishes membership grades as the relevant underlying semantics, while later possibility theory further underscores that these degrees should not simply be read as probabilities. citeturn11search3turn11search16

Consequently,

\[
\mu_{\text{combined}}
=
T(\mu_1,\mu_2)
\]

is legitimate when the system is saying **“combine these fuzzy predicates with connective \(T\)”**.

An arithmetic mean,

\[
(\mu_1+\mu_2)/2,
\]

is also mathematically calculable, but absent an explicit fuzzy/value interpretation it is merely an aggregate score. The fact that its answer still lies in \([0,1]\) does not make it a probability or a canonical fuzzy conjunction.

Fuzzy relations are particularly attractive where the desired concept really is graded membership rather than uncertainty about an unknown Boolean fact. They are inappropriate as a cosmetic way to turn arbitrary scores into values that look probabilistic.

### Weighted automata and semirings

Weighted automata address a different aggregation problem: how evidence or costs compose **through alternative computational paths**.

Abstractly, for a path \(\pi\),

\[
w(\pi)=
\bigotimes_{e\in\pi}w(e),
\]

and the weight assigned across alternative accepting paths is

\[
W=
\bigoplus_{\pi} w(\pi).
\]

The semiring specifies \(\oplus\), \(\otimes\), and their identities. OpenFst states the required algebraic properties of its weight structures, while Mohri develops shortest-distance algorithms parametrically over semirings. citeturn10view2turn10view3

This yields an important architectural separation:

**A semiring determines how already-meaningful weights compose. It does not determine what those weights mean.**

For example:

- a tropical \((\min,+)\) calculation can express minimum accumulated cost;
- a probability-like semiring can sum probability mass over alternatives and multiply appropriately modeled factors;
- a Boolean semiring expresses reachability/acceptance;
- tuple or product constructions can preserve more than one component instead of collapsing them immediately.

The direct design implication is particularly strong for this research question. Given component semirings \(K_1,\ldots,K_m\), one can mathematically form a product carrier

\[
K=K_1\times\cdots\times K_m
\]

with componentwise operations where the algebraic requirements hold. This allows an automaton to carry a vector of independently meaningful quantities. Scalarization can then occur **after** path computation, under a separately named policy. OpenFst itself supports nontrivial weight structures, including lexicographic and expectation-related forms, demonstrating that a weighted-automaton design need not be equated with one anonymous floating-point score. citeturn1search13turn10view3

This is preferable to assigning transitions an undifferentiated “confidence weight.”

A further warning follows: **using the probability semiring is not sufficient to make arbitrary transition weights probabilities.** Probabilistic meaning additionally requires a probabilistic model with the necessary normalization and conditional interpretation. This reproduces the active STRling inquiry's distinction between weighted algebra and probability. fileciteturn6file0L2-L2

### Probabilistic evidence fusion

Probability becomes justified when the system can define an actual hypothesis or event such as

\[
H=\text{“candidate satisfies the intended match relation”}
\]

and model how observations arise given that hypothesis.

A particularly explainable binary formulation uses likelihood ratios:

\[
LR_i
=
\frac{P(E_i\mid H)}
     {P(E_i\mid \neg H)}.
\]

If the evidence components are conditionally independent given both \(H\) and \(\neg H\), Bayes' rule gives

\[
\log
\frac{P(H\mid E)}
     {P(\neg H\mid E)}
=
\log
\frac{P(H)}
     {P(\neg H)}
+
\sum_i\log LR_i.
\]

This looks superficially like a weighted sum, but its semantics are radically stronger: every term is a log likelihood ratio supplied by a probabilistic model, and the additive rule comes from the model factorization rather than an arbitrary weighting convention.

The conditional-independence assumption is substantive. When evidence channels are correlated, multiplying their likelihood contributions as though independent double-counts evidence. A joint probabilistic model, Bayesian network, factorization, conditional model, or other explicit dependency structure is then necessary.

This gives the cleanest answer to “when can heterogeneous evidence mathematically become one probability?”:

> **When each input can be interpreted as evidence about the same well-defined random event under a coherent joint probabilistic model.**

It is not enough that all inputs “seem related to matching.”

### Kernels

Kernels are relevant only in a narrower case: when a downstream algorithm requires a positive-semidefinite similarity/kernel representation. Structured kernels can be constructed for strings and weighted-transducer representations, and the weighted-automata literature includes such constructions. citeturn7search6

If \(k_i\) are positive-semidefinite kernels and \(\alpha_i\ge0\), then

\[
k(x,y)=\sum_i\alpha_i k_i(x,y)
\]

is also positive semidefinite, because every Gram-matrix quadratic form remains a nonnegative weighted sum of nonnegative quadratic forms.

That is mathematically useful for kernel methods. It does **not** give the combined kernel value a universal interpretation as distance, probability, fuzzy membership, or semantic similarity. Multiple-kernel learning can learn such combinations for supervised objectives, but those learned coefficients inherit the objective and dataset rather than becoming intrinsic symbolic constants. citeturn6search10

Kernels should therefore not be the general aggregation abstraction for STRling unless a downstream kernel method creates a specific need.

## Normalization and the meaning of weights

Normalization is where many apparently rigorous weighted models quietly become arbitrary.

### A common numeric range is not a common scale

Mapping every attribute into \([0,1]\) does only one thing: it puts numbers into the same interval.

It does **not** establish that:

\[
0.1\text{ visual difference}
\]

is commensurate with

\[
0.1\text{ structural difference}.
\]

Nor does it establish that a change from \(0.2\) to \(0.4\) has the same meaning on two different dimensions.

A normalized weighted sum such as

\[
S=\sum_iw_i z_i
\]

therefore requires **two** semantic decisions, not one:

1. What transformation \(z_i=f_i(e_i)\) creates each criterion's scale?
2. What does trading one unit of \(z_i\) against another unit of \(z_j\) mean?

Skipping the first question makes the weights absorb accidental scale differences. Skipping the second turns them into unexplained constants.

### Fixed normalization and sample-relative normalization have different semantics

Consider min-max normalization:

\[
z_i
=
\frac{x_i-a_i}{b_i-a_i}.
\]

If \(a_i,b_i\) are fixed, versioned domain reference points, the mapping is reproducible. If they are recomputed from each candidate set, corpus, or query, then the same underlying observation can receive a different normalized value merely because unrelated candidates were added.

That is particularly dangerous for persistent thresholds: a threshold in sample-relative normalized units changes meaning when the reference sample changes.

Similarly, standardization

\[
z_i=\frac{x_i-\mu_i}{\sigma_i}
\]

means “number of reference-population standard deviations from the reference mean.” It does not mean probability, similarity, or calibrated confidence. Its parameters \(\mu_i,\sigma_i\) are part of the model and must be versioned with the population from which they were estimated.

A sigmoid or softmax does not cure this semantic problem. A softmax produces nonnegative values summing to one, but normalization by itself does not establish that those values are calibrated posterior probabilities. Empirical work on classifier calibration shows precisely that predictive scores and useful decision margins may need separate probability calibration before they can be interpreted probabilistically. citeturn11search0

### Authored weights should be declared policy

An authored weight is best interpreted as one of three things, and the contract should say which:

**Scale conversion.** A coefficient changes units so that comparable quantities are expressed on one scale.

**Tradeoff/preference.** A coefficient says how much one criterion can compensate for another in an authored decision policy.

**Penalty.** A coefficient defines the chosen cost of a deviation/action.

These are materially different meanings.

A useful discipline is that an authored weighted score should usually operate on explicit criterion value functions:

\[
S
=
\sum_iw_i u_i(e_i),
\qquad
w_i\ge0,\quad\sum_iw_i=1,
\]

rather than directly on raw measurements. The normalization of the weights makes their policy representation easier to compare, but it does not turn them into percentages of objective importance. Multiattribute utility research makes clear that additive decomposition relies on structural assumptions about preferences and independence. citeturn10view4

An authored `0.8` weight therefore means something like:

> under aggregation policy P, this transformed criterion receives coefficient 0.8.

It must **not** be presented as:

> this relation is 80% reliable.

Reliability is an empirical property requiring evidence.

### Learned weights should be declared model parameters

Learned weights have a different provenance:

\[
\hat\theta
=
\arg\min_\theta
\mathcal L(\theta;D)
\]

for some data \(D\), objective \(\mathcal L\), model family, regularization scheme, and training procedure.

Metric-learning research illustrates the distinction. Large Margin Nearest Neighbor learning, for example, learns a Mahalanobis distance from labeled examples specifically to improve a supervised nearest-neighbor objective. citeturn10view8 The learned metric is therefore fitted to a task and training distribution; it is not an ontological discovery that one symbolic attribute is intrinsically “three times as important” as another.

For learned weights, reproducible provenance consequently needs at least:

\[
(\text{training data version},
\text{labels},
\text{objective},
\text{model version},
\text{hyperparameters},
\text{seed/process},
\text{validation evidence}).
\]

Feature coefficient magnitude is especially unsafe as a generic “importance” interpretation when features have different scaling, correlations, or interactions. Learned weighting can be defensible prediction, but explanatory claims about individual coefficient meaning require additional analysis.

### Keep reliability separate from importance

One particularly dangerous design is

\[
S=\sum_i w_i e_i
\]

where \(w_i\) ambiguously mixes:

- the criterion's scale,
- user preference for that criterion,
- empirical reliability of the source,
- discriminative power in training data,
- uncertainty in the current observation.

These should not share one parameter.

A cleaner decomposition is conceptually:

\[
\text{raw evidence}
\rightarrow
\text{scale transform}
\rightarrow
\text{quality/reliability model}
\rightarrow
\text{decision aggregation}.
\]

Even when an implementation later optimizes these stages jointly, the externally exposed semantics should preserve their distinction.

### Missing evidence is not zero evidence

For an evidence vector

\[
(e_1,\ldots,e_m),
\]

“attribute not observed,” “attribute inapplicable,” and “observed evidence of no relationship” are three different states.

Silently mapping missing information to zero introduces a hidden assumption that absence of observation equals negative evidence. A result contract should therefore represent missingness explicitly and say how each aggregation method handles it.

This is particularly important for averages. Renormalizing over available dimensions,

\[
S=
\frac{\sum_{i\in O} w_i e_i}
     {\sum_{i\in O}w_i},
\]

makes scores comparable only under a strong assumption that omitted dimensions can be ignored without changing the interpretation. Otherwise, a candidate with one favorable observed dimension can misleadingly outrank a candidate evaluated on all dimensions.

## Thresholds, ranking, and probabilistic claims

A threshold never has more semantics than the quantity to which it is applied.

| Threshold | Exact guarantee |
|---|---|
| \(x=y\) | The domain equality predicate holds |
| \(x\sim_R y\) | Named relation \(R\) holds |
| \(d(x,y)\le\tau\) for a metric | \(y\) lies in the radius-\(\tau\) closed metric ball around \(x\) |
| \(c(x,y)\le\tau\) | Cost under contract \(c\) is within budget \(\tau\) |
| \(\mu_R(x,y)\ge\tau\) | Membership/similarity grade under fuzzy relation \(R\) is at least \(\tau\) |
| \(S(x,y)\ge\tau\) | The named scoring rule produces at least \(\tau\) |
| rank \(\le k\) | Candidate is among the top \(k\) under that ranking procedure |
| \(P(H\mid E)\ge\tau\) | The model's posterior probability for defined event \(H\), conditional on its inputs/model, meets the threshold |
| calibrated \(\hat p\ge\tau\) | Same model probability gate, with additional empirical evidence about probability calibration on a specified population |

Metric threshold semantics follow directly from the definition of a metric and its induced balls. citeturn10view0 Calibration semantics are different: Dawid defines calibration through agreement between predicted probabilities and long-run frequencies for similarly forecast events. citeturn11search7

### What a score threshold does not guarantee

Suppose

\[
S(x,y)\ge 0.75.
\]

Without additional evidence, this says nothing about:

- 75% probability of a correct match;
- 75% semantic equivalence;
- 75% agreement with humans;
- 25% expected error;
- false-positive rate below 25%;
- precision above 75%;
- reproducibility under a different normalization profile.

It guarantees only what the score contract defines.

Even if \(S\in[0,1]\), the conclusions do not change.

### Probability thresholds also have limits

A model output

\[
P(H\mid E)=0.8
\]

has much stronger semantics than an arbitrary score, but it still does not mean “this individual candidate is 80% true” in a directly observable frequentist sense. Its meaning depends on the hypothesis, conditioning information, prior/model, and calibration population.

Calibration supplies a useful aggregate check: among predictions issued near probability \(p\), the event frequency should be near \(p\). citeturn11search7 Empirical machine-learning research demonstrates that classifiers that perform well at discrimination can still produce distorted probability values, and that methods such as Platt scaling or isotonic regression can improve probability estimation. citeturn11search0

This suggests a terminology rule:

> Prefer **“estimated match probability”** to generic “confidence.” If the product insists on “confidence,” define it as an alias for a specific probabilistic quantity and expose its calibration status.

A statistical confidence interval is another concept entirely, so using bare “confidence” for arbitrary scores creates avoidable ambiguity.

### Calibration should be separately versioned

Calibration is not a permanent property of a raw model score. It is evidence about a model's predictions on a defined population and time/data regime.

A calibrated result therefore needs provenance such as:

\[
(\text{base model},
\text{calibrator},
\text{calibration dataset},
\text{target event},
\text{evaluation window},
\text{calibration metrics}).
\]

A deployment population can change, so old calibration evidence should not be silently treated as timeless.

### Ranking is often preferable to Boolean matching

Ranking is the more honest output when:

- the evidence varies continuously;
- no natural semantic boundary has been established;
- users care primarily about finding the best candidates;
- costs of false positives and false negatives are not yet specified;
- available evidence supports relative discrimination better than calibrated absolute decisions.

Learning-to-rank methods make exactly this separation useful: the learning objective can focus on ordering without claiming that the learned score itself is a calibrated probability. citeturn10view7

Boolean matching is preferable when there is a genuine predicate, constraint, or operational boundary:

\[
R(x,y)\in\{\text{false},\text{true}\}
\]

or where a validated decision policy deliberately converts evidence into a binary action.

A useful architecture is therefore:

\[
\text{evidence}
\rightarrow
\text{ranking}
\rightarrow
\text{optional thresholded action},
\]

while preserving the fact that **the final Boolean is a decision produced from evidence, not newly discovered equality or equivalence.**

### Dimension-wise gates are preferable when compensation is forbidden

Suppose a policy requires both

\[
d_1(x,y)\le\tau_1
\]

and

\[
d_2(x,y)\le\tau_2.
\]

Then use exactly that conjunction.

Replacing it with

\[
w_1d_1+w_2d_2\le\tau
\]

changes the semantics by introducing compensation: exceptional performance on one dimension can offset failure on the other.

There is nothing mathematically wrong with compensation. It is simply a policy decision and must not be introduced accidentally.

This gives a useful rule:

> **Use per-dimension thresholds for requirements; use scalar sums for tradeoffs.**

### Threshold uncertainty should remain visible

Near-threshold results should not acquire an illusion of categorical certainty merely because floating-point arithmetic produced a side of the line.

For an aggregate threshold, expose at least the margin

\[
m=S-\tau
\]

or, for a distance,

\[
m=\tau-d.
\]

When parameters are learned or estimated, uncertainty or sensitivity around the boundary should be evaluated separately. A narrow “decision margin” or abstention band can be operationally more honest than pretending that \(0.7499\) and \(0.7501\) represent substantively different symbolic states.

## Explainability, provenance, and reproducibility

The safest contract is **vector-first, derivation-transparent**.

For each component \(e_i\), a result should preserve at least:

\[
e_i=
(
\text{id},
\text{semantic kind},
\text{raw value},
\text{direction},
\text{range/units},
\text{transform},
\text{provenance}
).
\]

For each aggregate:

\[
A=
(
\text{aggregation contract},
\text{parameters},
\text{component inputs},
\text{derived contributions},
\text{aggregate value},
\text{decision/rank}
).
\]

This follows the repository's own emphasis on provenance, uncertainty, and preserving negative knowledge rather than presenting AI-assisted synthesis as authoritative fact. fileciteturn9file0L2-L2

### Explain the derivation, not an anthropomorphic rationale

For a linear value score,

\[
S=\sum_iw_i u_i,
\]

the exact explanation is:

\[
c_i=w_i u_i,\qquad
S=\sum_i c_i.
\]

A result can therefore say, in substance:

> Component A had raw value \(a\), transform \(u_A(a)\), coefficient \(w_A\), and contribution \(c_A\). Component B contributed \(c_B\). Under policy version P, the total was \(S\), exceeding threshold \(\tau\) by \(m\).

That is inspectable and reproducible.

It should **not** say that component A “caused 63% of the match” merely because \(c_A/S=0.63\). Algebraic contribution to a chosen formula is not causal importance or epistemic responsibility.

For a probabilistic factorization, log likelihood ratios can provide a similarly transparent decomposition:

\[
\log O(H\mid E)
=
\log O(H)+
\sum_i\log LR_i,
\]

but only when the factorization assumptions actually justify those independent terms. Otherwise the explanation must reflect joint/interacting factors rather than inventing independent per-component contributions.

### Every aggregation contract should be immutable or content-addressed

A human-friendly version such as `policy-v3` is useful, but reproducibility is stronger if the effective contract also has a cryptographic/content hash computed over the complete canonicalized configuration.

The contract should include:

| Contract field | Why it matters |
|---|---|
| Component identifiers and component-model versions | Establishes exactly which evidence was used |
| Semantic kind of each component | Prevents score/probability/distance conflation |
| Direction and range | Establishes whether high/low is favorable and valid domain |
| Units or scale interpretation | Establishes comparability |
| Missingness policy | Prevents silent zero-imputation semantics |
| Transformation/normalization function | Shows how raw evidence became aggregation input |
| Fitted normalization parameters | Reproduces sample/population-relative scaling |
| Aggregator or semiring | Defines composition mathematically |
| Weights | Reproduces tradeoffs |
| Weight origin | Distinguishes authored policy from learned parameter |
| Training-data/model provenance for learned weights | Ties empirical behavior to evidence |
| Threshold and threshold type | Defines the Boolean decision |
| Calibration contract | Defines any probabilistic/confidence claim |
| Evaluation evidence | Records what behavior has actually been validated |

A result should record the contract version/hash as well as the **raw evidence vector**. This allows a future system to rescore old observations under a new policy without pretending that the original evidence itself changed.

### Weight changes are semantic changes

For authored weights, changing \(w_i\) changes policy semantics.

For learned weights, retraining changes model semantics.

For either case, silently changing a coefficient while retaining the same public score name destroys reproducibility. A score from aggregation contract A should not automatically be numerically compared with a score from contract B.

This is particularly important when normalization also changes. The same displayed threshold `0.7` can denote a different decision region after either the normalizer or weights change.

### Preserve the distinction between observed and derived values

A future result should be capable of saying:

```text
observed:
    component A: ...
    component B: ...
derived:
    normalized A: ...
    normalized B: ...
    aggregate score: ...
decision:
    ranked #3
    threshold passed: false
model:
    policy/model/calibration versions: ...
```

The conceptual separation matters more than the serialization format. It lets a user inspect whether a surprising result came from:

- the underlying symbolic evidence;
- a transformation;
- a weighting decision;
- a learned model;
- a threshold;
- a calibration layer.

That is considerably more trustworthy than presenting one final number.

### Explicitly reject pseudo-precision

Pseudo-precision appears in several forms.

An authored score of `0.873291` does not deserve six decimals merely because floating-point arithmetic produced them. A hand-authored weight of `0.73` is not evidence that an attribute carries precisely 73% of anything.

A learned probability also does not automatically justify fine precision. The display resolution should be compatible with model discrimination, calibration error, sample size, drift, and intended use. Calibration research exists precisely because a classifier's raw numerical outputs may not correspond to empirical probabilities without additional validation. citeturn11search0turn11search7

A useful discipline is:

- preserve full machine precision internally for deterministic reproducibility;
- display only defensible semantic precision;
- label uncalibrated quantities as scores;
- attach uncertainty/calibration evidence to learned probabilities;
- never infer probability solely from a \([0,1]\) range.

## Failure modes of arbitrary weighted sums

The plain formula

\[
S=\sum_iw_i x_i
\]

is attractive because it is simple, fast, deterministic, and easy to rank. Those properties do not establish meaningful semantics.

Its principal failure modes are structural.

### Scale dependence

If one component is measured on \([0,1]\) and another on \([0,100]\), coefficient magnitude is inseparable from the arbitrary numerical units. Rescaling one component without correspondingly changing its weight changes the ranking.

Even after normalization, choosing different normalizers changes effective tradeoffs.

### Unintended compensation

A weighted sum allows favorable evidence in one component to offset unfavorable evidence in another:

\[
w_1x_1+w_2x_2
=
w_1x'_1+w_2x'_2
\]

for many very different evidence vectors.

Therefore

\[
(1,0)
\quad\text{and}\quad
(0,1)
\]

can receive equal totals despite conveying qualitatively different symbolic evidence.

If the distinction matters, the scalar has destroyed information that should have remained available.

### Double-counting correlated evidence

When two components are partly measurements of the same underlying phenomenon, adding them independently effectively gives that phenomenon multiple votes.

This is particularly dangerous in probabilistic interpretation: multiplying likelihood contributions assumes a factorization such as conditional independence. If that assumption is false, the posterior can become overconfident.

### Hidden interactions

An additive model assumes

\[
V(x_1,x_2)
=
v_1(x_1)+v_2(x_2)
\]

with no interaction term.

But a criterion may matter differently depending on another criterion. If this interaction is part of the actual policy or empirical model, an additive score is misspecified. Multiattribute utility theory's independence conditions are precisely why additive forms cannot simply be presumed. citeturn10view4

### Conflating importance, scale, and reliability

A weight may end up simultaneously correcting units, expressing user preference, estimating source reliability, and compensating for model discrimination.

Then no human-readable explanation of “what the weight means” exists.

### Treating missingness as negative evidence

A zero used both for “observed none” and “not measured” changes rankings according to data availability rather than evidence.

### Threshold instability

Because aggregate thresholds inherit every transform and coefficient choice,

\[
S\ge\tau
\]

can change when weights, normalization bounds, candidate population, or feature availability changes even though the raw evidence is unchanged.

### Rank reversal from context-dependent normalization

If normalization is calculated over the current candidate set, introducing an unrelated extreme candidate can change everyone else's normalized values and thus change their relative aggregate scores.

The ranking then depends partly on who else happened to be evaluated.

### False probability semantics

A convex weighted average

\[
0\le S\le1
\]

looks like a probability even when it is not one.

This is one of the most serious user-interface hazards. The combination of a percentage display and the word “confidence” can imply empirical uncertainty quantification that the model never established. The active STRling inquiry correctly identifies score-to-probability/confidence collapse as something that requires revalidation and explicitly rejects that conflation. fileciteturn6file0L2-L2

### Instability of learned coefficients

A learned metric or ranker can produce useful predictions while its coefficients remain tied to training data and objective. LMNN is a clear example of a distance being fitted specifically for a supervised classification criterion. citeturn10view8 Retraining, distribution shift, feature correlation, or altered labeling can therefore change learned weights without implying that the underlying symbolic relations themselves changed.

### Precision theater

A complicated formula with many decimal coefficients can appear more scientific than a simpler authored rule while encoding no stronger evidence.

Mathematical complexity and empirical validity are separate properties.

## Recommended semantic contract and direct answers

The most defensible design stance for future STRling research is **typed evidence plus explicitly optional scalarization**.

The primary result should remain:

\[
E(x,y)
=
(e_1,e_2,\ldots,e_m).
\]

Each \(e_i\) retains its own mathematical meaning. An aggregate should exist only under a named contract:

\[
A_C(x,y)
=
g_C(E(x,y)).
\]

A threshold is yet another contract:

\[
M_{C,\tau}(x,y)
=
[A_C(x,y)\ \mathrel{\bowtie}\ \tau].
\]

A probabilistic result should be a distinct model:

\[
P_M(H\mid E),
\]

and any claim that it is calibrated should reference a calibration evaluation rather than being inferred from the model's numerical range. This architecture directly implements the repository's current requirement that a future result contract name a numeric value's meaning, algebra/model, direction, range, comparability, and evidence. fileciteturn6file0L2-L2

### Answers to the research questions

| Question | Recommendation |
|---|---|
| **When can heterogeneous attributes be combined mathematically?** | When an explicit model supplies the composition semantics: component metrics under a declared geometry; utility/value functions under defined tradeoffs; fuzzy memberships under a named fuzzy connective; automaton weights under a semiring; or evidence variables under a joint probabilistic model. Mere shared numeric range is insufficient. |
| **When should they remain separate dimensions?** | When they have different semantic types, incomparable scales, no authorized exchange rate, conflicting evidence, substantial dependence/redundancy, explicit noncompensatory requirements, or explanatory value that scalarization would destroy. Vector/Pareto output should be the default in these cases. |
| **What normalization assumptions are required?** | Every transform needs a defined reference scale/population and stable parameters. Normalization must establish the intended value scale, not merely force numbers into \([0,1]\). Query-relative normalization is unsuitable for stable cross-query thresholds unless that context dependence is explicitly part of the contract. |
| **How should user-authored weights differ from empirically learned weights?** | Authored weights are policy/tradeoff/penalty parameters and should carry author/rationale/version provenance. Learned weights are estimated model parameters and should carry training data, labels, objective, model, validation, and drift provenance. Neither is intrinsic “percent importance.” Metric learning provides a canonical example of weights fitted to a supervised objective. citeturn10view8 |
| **What does a threshold actually guarantee?** | Exactly the predicate applied to the thresholded quantity and nothing stronger. A metric threshold guarantees membership in a metric ball; a cost threshold guarantees a cost budget; a fuzzy threshold guarantees fuzzy grade; a score threshold guarantees only score level; a probabilistic threshold is meaningful as a model probability gate. Calibration supplies population-level probability-frequency evidence, not magical individual certainty. citeturn10view0turn11search7 |
| **How should scoring remain explainable?** | Preserve raw components, transforms, missingness, coefficients, algebra, individual formula contributions, aggregate value, threshold margin, and contract version. Explanations should describe mathematical derivation, not reinterpret contributions as causal or probabilistic importance. |
| **When is ranking preferable to a Boolean match?** | When the requirement is relative prioritization and no defensible absolute boundary exists. Learning-to-rank shows that ranking can be a legitimate objective independent of probability estimation. Booleanization should occur only when a semantic constraint, validated operating point, or authored decision policy supplies a threshold. citeturn10view7 |
| **How can weights be versioned and reproduced?** | Version the complete aggregation contract, preferably with an immutable content hash. Store component/model versions, transforms and parameters, missingness rules, weights, their authored/learned origin, semiring/aggregator, threshold, training evidence, and calibration evidence. Persist raw evidence so it can be rescored under later contracts without rewriting history. |
| **When is probabilistic language justified?** | Only when there is a defined random event/hypothesis and a probabilistic model relating the observations to it. Combining evidence requires a valid joint/factorized model; outputs marketed as probabilities should be evaluated for calibration. A score, fuzzy degree, kernel, normalized weighted sum, or semiring cost is not probabilistic by numerical appearance. Calibration work demonstrates why predictive scoring and probability estimation must be distinguished. citeturn11search0turn11search7 |
| **What failure modes arise from arbitrary weighted sums?** | Scale dependence, compensability, correlated double-counting, omitted interactions, conflation of reliability with preference, mishandled missingness, threshold instability, rank reversal under changing normalization, learned-weight instability, false probability interpretation, and pseudo-precision. Additive multi-criteria models are defensible only when their value-scale and independence/tradeoff assumptions are explicit. citeturn10view4 |

### Recommended decision hierarchy

The following hierarchy minimizes semantic overclaiming:

| Situation | Preferred representation | Avoid claiming |
|---|---|---|
| Exact identity is intended | Equality Boolean | Similarity percentage |
| A named substitutability/class relation is intended | Explicit equivalence/relation Boolean | Equality |
| One well-defined metric notion exists | Metric or pseudometric distance | Probability |
| Several defensibly commensurable distances exist | Weighted metric/pseudometric with declared scale coefficients | Intrinsic “overall similarity” unless explicitly defined |
| Several incomparable relations exist | Typed evidence vector | One mandatory scalar |
| Tradeoffs are product/user policy | Multi-criteria value score | Objective evidence magnitude |
| Hard priorities exist | Gates or lexicographic policy | Compensatory weighted average |
| Graded membership is the intended semantics | Fuzzy relation/membership | Probability |
| Path penalties must compose | Weighted automaton with cost semiring | Confidence |
| Several path/evidence dimensions must survive computation | Product/vector semiring or equivalent structured weight | Premature scalarization |
| Only relative retrieval quality matters | Ranking score / Pareto or learned ranker | Calibrated probability |
| An uncertain Boolean hypothesis is modeled statistically | Likelihoods/posterior probability | Certainty |
| Probability values have empirical frequency validation | Calibrated probability, with calibration provenance | Universal or timeless reliability |

The design principle underneath the table is simple but consequential:

\[
\boxed{\text{One scalar should correspond to one declared mathematical meaning.}}
\]

When several meanings are simultaneously useful, return several typed values.

When a scalar is needed for ranking or an operational decision, treat it as a **derived policy/model output**, preserve the original evidence vector, and identify the aggregation contract that created it.

When users author tradeoffs, call them tradeoffs.

When a machine learns coefficients, call them model parameters.

When a semiring computes path costs, call them costs.

When a fuzzy relation yields a grade, call it a membership or similarity grade.

When a ranking algorithm produces a score, call it a score.

When a statistical model produces a posterior, call it an estimated probability.

Only after relevant empirical calibration should probability-like output be described as calibrated—and even then, the event definition, evaluation population, model version, and calibration evidence remain part of its meaning. citeturn11search0turn11search7

That approach preserves exactly what the motivating example needs: “high visual similarity,” “no phonetic relation,” “no ordinal relation,” and “shared structural relation” may coexist without any one statement pretending to subsume the others. A system can subsequently filter them with independent gates, compare them by Pareto dominance, rank them under an authored utility policy, propagate them through an appropriate semiring, or—where a real statistical hypothesis and evidence model exist—combine them probabilistically. None of those later operations requires rewriting the original observations into a fictitious universal measure of “similarity” or “confidence.”

**The present research stage is complete.**
