# Evaluating Automatically Discovered Symbolic Patterns: A Defensible Evidence Framework

Role: Research report
Origin: AI-assisted deep research commissioned for STRling Research Intelligence
Generated: 2026-08-14
Imported: 2026-08-14
Source verification: Partially verified
Last reviewed: 2026-08-14
Current status: Active input

## Executive finding

An automatically discovered pattern should be worthy of attention **not because it is technically true, syntactically short, frequent, statistically significant, or visually striking in isolation**, but because it earns one or more clearly identified kinds of evidence against explicit alternatives.

The central recommendation is to treat candidate evaluation as **multidimensional model criticism**, with Minimum Description Length as a particularly strong structural foundation, statistical inference as a separate safeguard against chance discoveries, held-out prediction as evidence of generalization, perturbation stability as evidence of robustness, residual analysis as a test of explanatory adequacy, and novelty/usefulness as explicitly conditional on prior knowledge and downstream goals. These dimensions cannot in general be reduced to a single domain-independent “meaningfulness score.” MDL itself was introduced as model selection by shortest total description; modern MDL pattern-mining work likewise emphasizes selecting compact *sets* of patterns rather than merely finding many individually true patterns. citeturn11search3turn16view0

This conclusion fits the Research Intelligence repository's epistemic model unusually well. The repository explicitly separates observations, published results, inference, recommendations, hypotheses, and speculation; requires claim-specific evidence; treats uncertainty and negative knowledge as first-class output; and warns that AI synthesis is not itself an evidence authority. fileciteturn8file0L2-L2 fileciteturn9file0L2-L2 Its current Universal Pattern Engine inquiry also explicitly warns that similar vocabulary is weak evidence for common architecture and that specialized systems may prove superior—a useful precedent for keeping the evaluator's **evidence logic general while leaving null models, semantics, utilities, perturbations, and causal assumptions domain-specific**. fileciteturn10file0L2-L2

The framework proposed here therefore has three layers:

**Validity gates → multidimensional evidence profile → Pareto/task-specific ranking.**

A candidate should first pass methodological validity checks: correct accounting of its own complexity and exceptions, declared baseline/null model, no evaluation leakage, known search provenance where significance is claimed, and appropriate uncertainty. Only then should evidence dimensions be compared. Pareto dominance should normally precede any weighted scalarization; an optional composite score is justified only for a declared operational objective with explicit weights and non-compensable gates.

The crucial conceptual distinctions are:

| Concept | What it actually establishes | What it does **not** establish |
|---|---|---|
| **Compression** | The candidate plus its residuals describes the data more economically than a stated baseline under a stated code/model language. MDL formalizes the tradeoff between model cost and data-given-model cost. citeturn16view0 | Population significance, prediction, causality, semantic importance. |
| **Fit** | How closely the candidate accounts for the observations it models, before or apart from complexity penalty. | Parsimony or generalization. An arbitrary lookup table can fit perfectly. |
| **Coverage** | How much of the data/population the candidate purports to cover. | Accuracy, surprise, recurrence, or importance. |
| **Recurrence** | How often the structure occurs, preferably with dependence and replication breadth reported. Pattern mining historically treats repetition/support as central, but frequency alone is not enough. citeturn16view0turn20search0 | Statistical independence, novelty, or meaningfulness. |
| **Significance** | Incompatibility of a chosen statistic with an explicit null model, after appropriate search/multiplicity correction. citeturn21view1turn12search4 | Large effect, good compression, useful prediction, causality. |
| **Prediction** | Improvement on genuinely unseen observations relative to a relevant baseline and loss function. citeturn14search0turn12search0 | Causal explanation or semantic interpretation. |
| **Stability** | Robustness of results to specified reasonable perturbations of data, sampling, preprocessing, or modeling choices. citeturn12search1turn15academia48 | Truth. Stable biases and stable confounding remain possible. |
| **Novelty** | Information not already accounted for by a stated background model, accepted pattern set, or user's prior knowledge. citeturn17view3turn20academia39 | Reliability or usefulness by itself. |
| **Usefulness** | Improvement on a declared task, decision, or user objective, net of costs. | Intrinsic statistical or semantic truth. |
| **Causality** | A causal claim supported by causal assumptions plus an identification strategy, experiment, quasi-experiment, or other appropriate causal design. citeturn21view3 | Something inferable from association, compression, stability, or prediction alone. |
| **“Meaning”** | A defensible external semantic grounding or interpretation connecting the formal pattern to entities, concepts, mechanisms, or user purposes. Formal symbol regularity alone does not supply such grounding. citeturn15search3 | An intrinsic property computable from the observed string alone. |

The resulting principle is:

> **A discovered pattern merits stronger attention when it provides a low-complexity account of substantial data, survives honest correction for the search that found it, predicts or compresses unseen observations, remains robust under relevant perturbations, leaves comparatively unstructured residuals, adds information beyond already-known patterns, and—where claimed—has separately established utility, causal support, or semantic grounding.**

No single one of those achievements substitutes for all the others.

## Why generative compression is stronger than redescription

### The decisive distinction is model plus residual, not pattern syntax alone

Rissanen's original MDL formulation begins from the fact that the description length of observed data depends on the model assumed to generate it; model selection then favors the model yielding the shortest description. citeturn11search3 In practical two-part MDL, the fundamental quantity is

\[
L(M,D)=L(M)+L(D\mid M),
\]

where the first term charges for the model and the second charges for everything the model still requires to reconstruct the observations. Galbrun's pattern-mining survey explicitly describes these terms as model complexity and model fit, respectively. citeturn16view0

For a candidate pattern \(P\), with a background description \(B\) held fixed, a useful operational quantity is therefore

\[
G_{\mathrm{MDL}}(P\mid B)
=
L(D\mid B)
-
\left[
L(P\mid B)+L(D\mid B,P)
\right].
\]

This report recommends calling \(G_{\mathrm{MDL}}\) **net compression gain**. Positive values mean the pattern earns back the information needed to specify itself and still saves bits; negative values mean it is a more elaborate redescription of the same data.

This directly resolves the 1,000-digit example. Suppose, merely for illustration, that the baseline already knows there are 1,000 digits drawn from ten equally coded symbols. A literal representation then costs about

\[
1000\log_2 10 \approx 3321.9\text{ bits}.
\]

The statement “divide the sequence into two blocks of 500” does not predict a single digit. The 1,000 digit values must still be transmitted, and the partition itself has some cost. Consequently its net compression gain is zero or negative.

By contrast, suppose the sequence is exactly a ten-digit block repeated 100 times. The actual digit content can then be represented by roughly \(10\log_2 10\approx33.2\) bits plus the relatively small cost of communicating the repetition rule and count. That is a genuine generative regularity: one concise mechanism replaces thousands of literal symbol values. This is precisely the kind of regularity MDL is intended to reward. citeturn16view0turn11search3

The lesson is deeper than “simple is good.” **A short pattern is not necessarily a good explanation. A short total reconstruction is.** “Every item is in one of two groups” may be syntactically tiny yet predict nothing. Conversely, a moderately complicated grammar may be highly explanatory if its cost is amortized over a great deal of accurately generated data.

### Complexity must be paid once; exceptions must also be paid

A defensible symbolic-pattern complexity penalty should therefore be an actual information cost, not merely “number of nodes” or “number of clauses.” \(L(P)\) should account for every piece of information a decoder—or equivalently, a probabilistic specification—must know that is not already common to every candidate: pattern type, structural choices, parameters, parameter precision where relevant, delimiters or lengths where required, and other side information. Modern MDL work stresses decodability and explicitly warns that missing information, arbitrary unit costs, or favorable ad hoc encodings can bias comparisons. citeturn21view0

Exceptions belong in \(L(D\mid P)\); they are not free annotations such as “except for these 100 cases.” For \(e\) exchangeable exception locations among \(n\) positions, merely identifying the locations can require on the order of

\[
\log_2 {n\choose e}
\]

bits before the exceptional values themselves are encoded. At \(n=1000,e=100\), that location cost alone is about 464 bits. The exact code should reflect the appropriate noise assumptions, but the governing rule is invariant: **exceptions must consume the information they require**.

This provides a principled answer to noise. A pattern with a small number of genuinely unpredictable exceptions can remain excellent because the regular part saves far more bits than the residual costs. A pattern requiring a long bespoke exception list will lose its apparent simplicity once that list is properly charged. Galbrun notes that practical MDL encodings often have exactly this three-part character: pattern description, reconstruction instructions, and corrections needed to recover the original data. citeturn21view0

Exceptions should also be examined structurally. Two candidates can have identical error counts yet very different explanatory quality: one may leave approximately structureless residual noise, while another leaves errors clustered by time, symbol type, region, or some other systematic dimension. Box's model-criticism framework treats predictive checking and diagnostics for systematic departures as integral to scientific modeling, while posterior predictive checking provides a formal way to compare observed discrepancies with those expected from the fitted model. citeturn14search5turn14search4

A useful evaluator should therefore report both **residual amount** and **residual adequacy**.

### Algorithmic information theory is a foundation, not an executable oracle

Algorithmic information theory sharpens the intuition further. Kolmogorov complexity asks for the length of the shortest program that reproduces an object. A highly patterned 1,000-digit string can have a short generating program; a genuinely incompressible string cannot. But Kolmogorov complexity is not computable in general. Vitányi's detailed treatment explicitly defines it through the shortest generating program and analyzes its incomputability and limits of approximation. citeturn11search0

This incomputability has a major engineering consequence:

**The evaluator must never claim to compute “true algorithmic meaningfulness,” “true Kolmogorov complexity,” or the objectively shortest possible explanation.**

Real compressors and restricted symbolic languages provide computable upper bounds or proxies relative to what those compressors/languages know how to exploit. Work on normalized information distance makes this distinction explicit: the theoretical quantity is based on incomputable Kolmogorov complexity, while practical normalized compression measures substitute real-world compressors; stronger nonapproximability results show that the theoretical quantity itself cannot simply be recovered to arbitrary useful precision by a generic computable procedure. citeturn19search0turn19academia24

Thus AIT should play the role of a **north star**:

> Prefer explanations that replace literal information with reusable generative structure.

MDL then makes that ideal operational inside a declared model class and code.

That qualification matters at finite scale. The choice of descriptive language determines what regularities are cheap to express. A language with a primitive for periodicity will find periodic structure cheaper than a language that must spell periodicity out procedurally. That is not automatically an error; it is an inductive bias. The error would be hiding the bias and presenting the resulting codelength as language-independent ground truth. Galbrun explicitly describes the encoding design as both a benefit and a source of bias—one can effectively put a finger on the scale by making favored structures cheap. citeturn17view2turn21view0

### Compression is strongest when the comparison is conditional

The most useful extension for an ongoing discovery system is **incremental or conditional compression**. Let \(A\) denote patterns already accepted into the background explanation. Then evaluate a new candidate \(P\) by

\[
G_{\mathrm{inc}}(P\mid A,B)
=
L(D\mid A,B)
-
\left[
L(P\mid A,B)+L(D\mid A,B,P)
\right].
\]

A candidate with large standalone compression but nearly zero incremental gain is mostly redundant. This follows the development of pattern mining from selecting many individually “good” patterns toward selecting *good collections* with redundancy removed. citeturn17view3turn16view0

This is an especially strong, domain-independent treatment of one aspect of **novelty**: novelty means “information not already explained.” It does not require claiming that the pattern is historically, semantically, or scientifically novel; those stronger meanings require an external knowledge base or user model.

### MDL, AIC, BIC, and Bayesian evidence solve related but different problems

“Occam's razor” does not imply one universal penalty. Several major model-selection traditions formalize complexity differently:

| Method | Core comparison | Principal interpretation | Important caution |
|---|---|---|---|
| **Two-part MDL** | \(L(M)+L(D\mid M)\) | Choose the model giving the shortest total lossless description under a declared code/model class. citeturn16view0 | Results inherit the coding/model-language choices; crude codes can embed unwanted biases. citeturn21view0 |
| **AIC** | \(-2\log \hat L+2k\) | Akaike introduced it as an information-theoretic model-identification criterion balancing likelihood against the number of fitted parameters. citeturn13search0 | It addresses predictive/information loss rather than “probability the model is true”; \(k\) is often too crude for arbitrary symbolic structures. |
| **BIC / Schwarz criterion** | conventionally \(-2\log\hat L+k\log n\) | Derived from an asymptotic Bayesian model-selection argument for models of differing dimension. citeturn13search6turn16view0 | Its justification depends on asymptotic/statistical-model assumptions; it is not a universal symbolic-complexity law. |
| **Bayesian marginal likelihood / Bayes factor** | \(\int p(D\mid\theta,M)p(\theta\mid M)d\theta\) | Compares how much probability each model, averaged over its parameter prior, assigns the observations; this can encode an Occam effect. citeturn13search14 | Model comparison can be highly prior-sensitive; improper priors can make marginal likelihood undefined, and diffuse priors are not innocuous. citeturn13search7 |
| **Cross-validation / holdout** | Empirical loss on withheld observations | Directly assesses predictive generalization. Stone's foundational work treats cross-validation as a method for choosing and assessing predictions. citeturn14search0 | Selection itself can overfit a noisy CV estimate, requiring nested or independent evaluation. citeturn12search0 |

These should not be averaged into an “Occam score.” They express different assumptions and targets. For arbitrary symbolic candidates, **explicit MDL-style structural cost is usually the cleanest domain-general foundation**, because it naturally charges discrete structure and exceptions. Bayesian evidence is valuable where a defensible generative probability model and prior exist. AIC/BIC are appropriate when candidates fit their statistical assumptions. Held-out evaluation remains separately necessary when generalization matters.

### When compression is evidence—and when it misleads

Compression is compelling evidence of regularity when the baseline and coding scheme are fixed in advance, the candidate model is fully charged, reconstruction is lossless or distortion is explicitly accounted for, improvements are large enough to survive sampling variation, and the compression persists on fresh data. The MDL literature explicitly emphasizes fair lossless comparison and the need to account for reconstruction corrections. citeturn16view0turn21view0

It can mislead when:

1. the code gives favored patterns artificially cheap descriptions;
2. the baseline omits obvious known facts and lets candidates earn credit for “discovering” them;
3. exception positions, parameters, or other side information are omitted;
4. the same sample is searched so extensively that an unusually compressive candidate is selected by chance;
5. data duplicates, preprocessing artifacts, source-specific formatting, or leakage produce genuine but scientifically irrelevant compressibility;
6. a real-world compressor simply lacks—or happens to favor—the representational machinery needed for particular regularities;
7. compression is silently interpreted as evidence of prediction, causation, usefulness, or semantic meaning.

The first three are failures of accounting; the fourth is model-selection overfitting; the rest are failures of interpretation. Cawley and Talbot's analysis is especially important here: **the criterion used for model selection can itself be overfit**, and this phenomenon is not restricted to cross-validation; they explicitly note that it applies broadly to optimized model-selection criteria, including Bayesian evidence. citeturn12search0

Compression should consequently be reported as **“compression relative to baseline \(B\), code \(C\), and candidate language \(L\)”**, never merely “information content” or “meaningfulness.”

## Evidence dimensions must remain distinct

The strongest design principle emerging from the literature is that candidate evaluation is not a one-dimensional measurement problem. Description length, null-hypothesis evidence, predictive performance, robustness, and scientific explanation answer fundamentally different questions. Shmueli's work has repeatedly stressed the distinction among descriptive, predictive, and explanatory/causal modeling goals; her 2025 commentary again argues that modeling should be driven by whether the question is descriptive, predictive, or causal. citeturn15search2turn15search0

A candidate evidence record should therefore expose the following independent dimensions.

### Structural evidence

**Fit** should measure the empirical fidelity of the candidate on the observations it claims to model: log likelihood, reconstruction error, exact-match rate, or another loss appropriate to the declared observation model. It should *not* contain a complexity penalty.

**Model complexity** should report the charge for specifying the candidate itself, preferably in bits where a defensible code exists.

**Residual complexity** should report what remains to reconstruct or explain.

**Net compression gain** combines those terms in the MDL comparison, but the evaluator should still expose the components. A user needs to be able to distinguish “excellent fit bought with a huge model” from “moderate fit delivered by an extraordinarily compact model.” MDL's explicit separation of \(L(M)\) and \(L(D\mid M)\) provides exactly this decomposition. citeturn16view0

### Scope evidence: coverage and recurrence

**Coverage** should answer: *What fraction of the relevant observation mass is within this candidate's scope?*

This is not necessarily a quantity to maximize. A valid anomaly, niche subgroup, local motif, or specialized rule may appropriately cover 0.1% of the data. Coverage tells the user how broad the claim is; it should not turn a local pattern into an inferior candidate merely because it is local.

**Recurrence** should answer: *How many times does the claimed structure appear, and across how many meaningfully separate contexts?*

Pattern mining has long been organized around support/frequency because repetition can amortize a pattern's description cost. citeturn16view0 But recurrence should ideally be decomposed into:

\[
(\text{raw occurrences},\ \text{effective support},\ \text{replication breadth}).
\]

Raw occurrences can be badly misleading when observations overlap, are duplicates, or are serially correlated. Ten thousand overlapping occurrences in one sequence are not equivalent to ten thousand independent replications in unrelated samples. The appropriate dependence correction is domain-specific.

Frequency is also not surprise. IBM research on periodic pattern discovery explicitly notes that an infrequent pattern can still be highly informative when its occurrence probability under the relevant expectation is extremely low; raw support therefore need not be the right measure of interest. citeturn20search0

### Inferential evidence: significance and effect size

**Statistical significance** should be attached only when the evaluator can state:

- the null hypothesis;
- the sampling/randomization model;
- the test statistic;
- the candidate-selection/search history relevant to the test;
- the multiplicity procedure;
- the unadjusted and adjusted inferential result where useful.

Hämäläinen and Webb's pattern-discovery tutorial makes the core distinction explicit: statistical testing can control the risk of false discoveries, but the huge numbers of patterns considered in discovery make specialized multiple-testing treatment essential. citeturn11search5turn21view1

Significance must be paired with an **effect-size measure**. A tiny deviation can become overwhelmingly significant with enough observations while producing negligible compression, prediction improvement, or utility. Conversely, a large apparent effect on very little data may be practically important but inferentially uncertain. Neither case is accurately summarized by a p-value alone.

### Generalization evidence: prediction

Prediction should be evaluated against a baseline on data not used to choose the pattern. A candidate can fit and compress the discovery sample while merely exploiting sample-specific noise. Stone's work established cross-validatory assessment as a way to evaluate statistical predictions, while later work shows that selecting the best performer across many alternatives can itself overfit cross-validation estimates. citeturn14search0turn12search0

A generic predictive measure is

\[
G_{\mathrm{pred}}
=
R_{\mathrm{baseline,test}}-R_{\mathrm{candidate,test}},
\]

where \(R\) is a task-appropriate loss. Positive values indicate improvement. The report should include uncertainty—not just a point estimate—and should preserve the identity of the baseline.

For generative symbolic models, **held-out log loss or held-out codelength** is especially attractive because it connects prediction with information theory: the pattern earns evidence by assigning greater probability, hence shorter codes, to observations it did not see during discovery. But even then, it should be labeled prediction/generalization, not simply merged with in-sample MDL.

### Robustness evidence: stability

Bin Yu characterizes reproducibility at minimum as stability under reasonable perturbations to data and models; bootstrap, jackknife, cross-validation, and robustness methods can all be understood through this perturbative lens. citeturn15academia48 Meinshausen and Bühlmann formalized one important special case—stability selection—by repeatedly subsampling and retaining structures with high selection probabilities, with finite-sample false-selection guarantees under stated assumptions. citeturn12search1

For arbitrary symbolic candidates, one generic scalar called “stability” would hide too much. The evaluator should distinguish at least:

**Score stability:** Does the same fixed candidate retain similar compression, effect, or predictive scores when observations are resampled or perturbed?

**Selection stability:** Does the candidate, or an externally supplied equivalent representation, reappear when the external discovery procedure is rerun on perturbed samples?

**Predictive stability:** Does its generalization advantage remain consistent across folds, time periods, sources, or environments?

This framework does not require designing the discovery algorithm. Selection-stability evaluation can call whatever external discovery procedure already exists. Likewise, it does not design an equivalence relation; if syntactically distinct candidates are to count as the “same” pattern, that identity/equivalence policy must come from elsewhere.

Stability is corroborative, not dispositive. A confounded association can be highly stable. A measurement artifact can recur flawlessly. Conversely, two practically equivalent explanations can alternate across samples and make each individual representation look unstable. Stability should therefore never become a substitute for fit, prediction, or causal validation.

### Comparative evidence: novelty and redundancy

A useful pattern is often one that tells the system something **not already known**.

There are at least three different novelty concepts:

\[
\text{data-internal novelty}
\neq
\text{statistical surprise}
\neq
\text{semantic/user novelty}.
\]

**Data-internal novelty** is best measured through conditional/incremental explanation. If adding \(P\) to background explanation \(A\) scarcely shortens the data, it is redundant even if \(P\) scores well in isolation.

**Statistical surprise** is measured against a null/background distribution: a low-probability event can be highly surprising even if it is not semantically new.

**Semantic or user novelty** depends on what a user or knowledge system already believes. De Bie's subjective-interestingness framework explicitly represents prior information through a background probability model and evaluates patterns relative to that state of knowledge. citeturn20academia39turn20search1

The evaluator can support all three, but must label which one is being measured. It should not call conditional compression “novel scientific knowledge.”

Hämäläinen and Webb provide a complementary insight from statistically sound pattern mining: apparently interesting supersets or variants can be discarded when their frequency/dependence is already explained by a simpler known pattern. citeturn21view1 This supports an important ranking rule:

> **A candidate's incremental evidence matters more than its standalone evidence when the analyst has already seen closely explanatory candidates.**

### Usefulness, causality, and meaning are different epistemic categories

**Usefulness** is a decision-theoretic or product property. A generic evaluator can represent

\[
U(P)
=
E[\text{task value with }P]
-
E[\text{task value without }P]
-
\text{cost of using }P,
\]

but the quantities in this formula require a specified user, task, objective, and cost model. Usefulness is therefore not intrinsic to a string. A rare pattern that prevents an expensive failure may be extremely useful even if it provides little global compression.

**Causality** must remain outside the compensatory statistical score. Pearl's review emphasizes that causal inference requires causal assumptions and a shift beyond traditional purely associational statistical analysis; causal and counterfactual claims are conditional on those assumptions. citeturn21view3 No amount of compression, p-value significance, cross-validation accuracy, recurrence, or stability proves that changing one variable will change another.

**Meaning** requires still another type of evidence. Harnad's symbol-grounding formulation directly raises the problem of how semantic interpretation can become grounded rather than merely attached to formally manipulated symbol tokens. citeturn15search3 A discovery system may legitimately say that “pattern P is statistically associated with externally labeled phenomenon X” when that association has been tested. It may not jump from a formal regularity to “P means X” without a grounding argument.

For machine discovery, this distinction is essential. **Regularity is discoverable internally; semantics is relational.**

## Controlling false discovery, overfitting, and search-induced evidence

### Search itself changes the evidentiary burden

Automatic discovery creates a severe selection problem because a system can inspect an enormous number of hypotheses and retain only the most extreme results. Hämäläinen and Webb make the arithmetic concrete: if 100,000 null patterns are each tested at \(\alpha=0.05\), the expected number passing by chance can be about 5,000. citeturn21view1

This means that the relevant evidentiary question is not

> “How surprising would this candidate have been if it were specified before seeing the data?”

but rather

> **“How surprising is it that this discovery process, after all the opportunities it had to find something, produced a candidate at least this impressive?”**

That distinction should be foundational to an automatic evaluator.

Candidate generation remains outside this report's scope, but **search provenance is an input that candidate evaluation requires**. At minimum the evaluator should know, where inferential claims are desired:

- whether the candidate was pre-specified or discovered from the same data;
- the candidate family or effective search space when known;
- whether tuning/ranking occurred using the evaluation sample;
- how many rounds of adaptive search occurred;
- whether the same holdout has already been queried.

When these facts are unavailable, the correct output is not a guessed multiplicity correction. It is:

**“Search-corrected significance unavailable; discovery multiplicity is unquantified.”**

### FWER and FDR answer different risk questions

The traditional family-wise error rate is

\[
FWER=P(V\ge1),
\]

the probability of at least one false rejection in the family. False discovery rate instead controls the expected false proportion among reported discoveries. Hämäläinen and Webb review both approaches, and Benjamini and Hochberg's original FDR paper introduced the latter specifically as a less conservative alternative to controlling any familywise false rejection. citeturn21view1turn12search4

For a discovery engine, the choice should be tied to the downstream claim:

- **FWER-style control** is appropriate when surfacing even one false “established discovery” is costly.
- **FDR-style control** is often better suited to broad exploratory lists where the system deliberately tolerates a declared expected proportion of false positives in exchange for power. Hämäläinen and Webb make essentially this distinction between settings in which false discoveries are intolerable and exploratory pattern discovery. citeturn21view1

The Benjamini–Hochberg procedure has dependence conditions; the pattern-discovery literature reviews alternatives for other dependency structures. citeturn21view1turn12search4 Therefore “q < 0.05” should not be hard-coded as a universal validity badge. The correction method and assumptions belong in provenance.

### Adaptive search defeats naïve holdouts

A holdout set protects against overfitting only while it remains genuinely held out. Dwork and colleagues' reusable-holdout work begins from exactly this problem: conventional validity assumes a fixed analysis, whereas real data analysis is adaptive, with later analyses influenced by earlier results; repeatedly querying the same holdout can consequently create spurious discoveries. citeturn21view2

For candidate evaluation, that implies a hierarchy:

**Best confirmation:** a final, untouched test set or genuinely new data collected after discovery.

**Development estimate:** cross-validation or a validation set used for model/candidate selection.

**Unsafe confirmation:** the same validation/holdout repeatedly inspected while changing patterns, thresholds, or ranking logic and then presented as if it were untouched.

Where data is limited, nested cross-validation can separate candidate/model selection from outer performance estimation. But even cross-validation estimates are noisy, and selecting the best among many candidates can overfit those estimates; Cawley and Talbot demonstrate that selection bias can be comparable to the performance differences between algorithms being compared. citeturn12search0

### Null calibration should include the selection process

When candidate discovery is massive or adaptive and a simple effective hypothesis count cannot be defended, a particularly principled solution is **search-level null calibration**: generate data under the declared null, run the same external discovery/selection process, and compare the best null discoveries with the observed discovery.

This is conceptually different from calculating an ordinary p-value for the final selected candidate. Randomization-based methods in statistically sound pattern discovery are explicitly used to estimate the overall significance of mining results and handle multiplicity. citeturn17view4

The evaluator need not design the generator. It needs only an interface capable of asking:

> Under null-consistent datasets, what distribution of maximum—or otherwise selected—evidence does the existing discovery process produce?

This can yield a **search-level empirical p-value** or calibrated threshold.

Where rerunning discovery is impossible, holdout confirmation becomes more important. Hämäläinen and Webb describe holdout evaluation as a way to reduce the number of hypotheses requiring final tests because only selected candidates are tested on independent data, while also noting dependence on the particular split. citeturn17view4

### Significance should be a qualification, not a ranking jackpot

A common scoring mistake would be to turn \(-\log p\) or \(-\log q\) into an unbounded reward in a universal meaningfulness score. That would cause gigantic datasets to favor tiny but precisely estimated effects and allow significance to compensate for poor prediction, zero novelty, or zero utility.

Instead:

**significance should usually be a claim-specific validity field or gate**, accompanied by effect size.

For example:

- “statistically supported” may require an adjusted \(q\) or FWER criterion;
- among candidates that pass, ranking can then use compression, predictive gain, novelty, or task utility;
- extremely tiny p-values need not produce proportionately greater attention after the relevant inferential threshold is safely exceeded.

This preserves the true role of significance: **controlling the risk that an apparent empirical pattern is a sampling/search accident**, not declaring how important the pattern is. Hämäläinen and Webb explicitly caution that significance testing controls type-I-error risk, not every other dimension of pattern quality. citeturn17view4

## Prediction, stability, recurrence, and residual adequacy as corroborating evidence

A defensible evaluator should ask not only whether a candidate explains the particular sample it was discovered from, but whether the implied structure survives several attempts to falsify it.

### Prediction is the strongest generic defense against in-sample storytelling

In-sample compression is evidence that a regularity exists *in the observed record*. Out-of-sample prediction asks a harder question: did the candidate identify something that persists beyond the particular noise realization that made it discoverable?

For a symbolic generative rule, several forms of prediction may exist:

- predicting unseen symbols;
- predicting the next occurrence or location;
- predicting conditional distributions;
- predicting whether a pattern will recur in a new sample;
- reducing held-out log loss/codelength.

The exact target is domain-specific. The domain-independent requirement is that the target and loss be specified before the confirming observations are inspected.

A pattern should only be called **predictive** when its advantage is measured on observations not used to select it. Shmueli's distinction between explanatory and predictive modeling is useful here: the two objectives can diverge, and high apparent explanatory power does not guarantee high predictive performance. citeturn15search2

Out-of-sample prediction is strong evidence for general regularity, but not necessarily for causal mechanism. A proxy variable can predict extremely well without being a cause; a stable environmental correlation may fail under intervention. Causal labeling therefore remains separate. citeturn21view3

### Stability should test reasonable perturbations, not arbitrary vandalism

A perturbation test is only informative if the perturbation represents uncertainty that the claimed finding ought to survive. Yu's stability perspective is explicitly framed around “reasonable” perturbations to data and models. citeturn15academia48

Examples include, depending on domain:

- bootstrap or subsampling;
- small measurement perturbations consistent with instrument uncertainty;
- plausible preprocessing variants;
- changes in sample boundaries;
- different data sources or periods;
- omitted subsets or influential observations.

The evaluator should record the perturbation family itself, because “95% stable” is meaningless without specifying *stable against what*.

A useful profile might report:

\[
S_{\mathrm{metric}}
=
\Pr_{Q}\left[
G_{\mathrm{MDL}}(P)>0
\right],
\]

along with the distribution of compression gains, rather than just the probability.

Likewise,

\[
S_{\mathrm{pred}}
=
\Pr_{Q}\left[
G_{\mathrm{pred}}(P)>0
\right].
\]

Where rerunning the discovery process is possible,

\[
S_{\mathrm{select}}
=
\Pr_{Q}\left[
P\text{ or supplied-equivalent reappears}
\right].
\]

These are examples of evaluation quantities, not prescriptions for a candidate generator.

### Recurrence should increase confidence only when it adds information

A repeated occurrence is useful because it can do two different things.

First, recurrence **amortizes pattern cost**. A rule whose description costs 200 bits may be useless if applied once but excellent if it saves 20 bits on each of 100 independent occurrences.

Second, recurrence provides **replication evidence** when occurrences are sufficiently independent or spread across independently informative contexts.

But those two effects should not be conflated. Copying the same record 10,000 times provides enormous naïve frequency but almost no new independent evidence. Likewise, one recurring deterministic formatting marker may strongly compress a file while telling the scientist nothing of interest.

The evaluator should consequently report at least:

\[
\text{support}
\quad+\quad
\text{context breadth}
\quad+\quad
\text{dependence qualification}.
\]

Determining effective independence is domain-specific; reporting the raw distinction is domain-independent.

### Residual structure is evidence against completeness

A candidate that explains 95% of observations may seem excellent. But if all 5% of failures occur every Sunday, only for one class of symbols, or immediately after a particular event, then the exceptions themselves reveal an omitted systematic variable.

Box's conception of scientific model building makes criticism rather than mere fit central: a model should generate predictions against which discrepancies can be examined, including diagnostics for serial correlation and “bad values.” citeturn14search5 Gelman, Meng, and Stern's posterior predictive framework similarly judges model fitness through discrepancies between observed data and data replicated from the fitted model. citeturn14search4

A symbolic-pattern evaluator should therefore include **residual diagnostics** as an evidence dimension. At minimum:

- residual amount/codelength;
- concentration by context;
- remaining compressibility under a neutral residual code;
- whether residual behavior matches the candidate's declared noise model.

A particularly useful generic measure is **residual compression opportunity**:

\[
G_{\mathrm{residual}}
=
L(R\mid N)
-
L(R\mid Q),
\]

where \(R\) is the residual and \(N\) is the candidate's nominal noise model, while \(Q\) is some permitted richer diagnostic model. A large positive value signals that the supposed “noise” has substantial remaining structure.

The evaluator does not have to generate the improved pattern \(Q\). It only needs to flag that the candidate's residuals are not convincingly noise-like.

### Explanatory strength should require convergent evidence

Within this framework, “explanatory” should be used conservatively.

A useful **noncausal structural explanation** is stronger than a mere fit when it has several properties simultaneously:

\[
\text{economy}
+
\text{scope}
+
\text{generalization}
+
\text{robustness}
+
\text{residual adequacy}
+
\text{competitive superiority}.
\]

That is, it provides a compact generative account, applies across substantial relevant observations, yields successful empirical consequences beyond those used to construct it, survives reasonable perturbations, leaves little systematic structure unexplained, and performs better than plausible competing explanations.

This is a synthesis rather than a theorem, but each component addresses a known failure mode of model selection: complexity controls memorization, holdout testing controls sample-specific fitting, stability addresses reproducibility, residual criticism exposes misspecification, and direct comparison prevents a technically correct but dominated description from being mistaken for the best account. citeturn16view0turn12search0turn15academia48turn14search5

Even then, the safest label is **“candidate structural explanation”** unless a causal mechanism has independently been established. Shmueli's distinction between predictive and explanatory goals and Pearl's separation of association from causal inference both argue against allowing model quality alone to generate causal language. citeturn15search2turn21view3

## A ranking architecture based on gates, profiles, and Pareto dominance

### The evaluator should not begin with one meaningfulness number

The most defensible architecture is:

\[
\boxed{
\text{Validity Gates}
\rightarrow
\text{Evidence Profile}
\rightarrow
\text{Pareto Set}
\rightarrow
\text{Optional Task Utility}
}
\]

This preserves information that a scalar score would erase.

Multiobjective optimization uses Pareto non-domination specifically to retain alternatives when objectives conflict rather than forcing them into a single aggregate objective; such approaches are well established in multiobjective optimization and have also been used to trade off model accuracy against program/model complexity. citeturn10search7turn10search5

### Validity gates should be non-compensable

Before ranking, a candidate should carry a validity record. Recommended gates are:

| Gate | Requirement | Consequence if absent |
|---|---|---|
| **Reconstructability/accounting** | All candidate structure, parameters, exceptions, and side information charged under the stated code. | Compression claim invalid. |
| **Declared baseline** | Baseline/background model identified. | Compression gain uninterpretable. |
| **Search provenance** | Selection/search history sufficiently known for inferential correction. | Significance labeled uncalibrated. |
| **No confirmation leakage** | Test/confirmation observations not used to select or tune the candidate. | Predictive claim exploratory only. |
| **Null adequacy** | Null and sampling/randomization assumptions stated where significance is claimed. | No valid significance label. |
| **Perturbation specification** | “Reasonable” perturbations explicitly defined. | Stability label undefined. |
| **Residual completeness** | Deviations/exceptions included in the fit/code rather than silently discarded. | Fit/compression invalid. |
| **External grounding for strong labels** | Causal assumptions or semantic evidence supplied for causal/meaning claims. | Candidate remains associational/formal. |

A candidate with an invalid p-value should not be able to “make up for it” with excellent compression. A pattern evaluated on a leaked test set should not recover predictive credibility by being very stable. Causality should not become obtainable by adding enough points from other columns.

That is why these are gates rather than score dimensions.

### The evidence profile should preserve raw components

A practical **Candidate Evidence Record** could contain:

| Evidence family | Recommended fields |
|---|---|
| **Provenance** | candidate identifier; dataset/version; discovery procedure/version supplied externally; search family/adaptivity metadata; evaluation splits |
| **Structural** | in-sample fit; model bits; residual bits; net and normalized compression gain; baseline/code identifier |
| **Scope** | coverage; raw support; effective support if known; breadth across sources/contexts |
| **Inferential** | effect size; uncertainty; null; test; raw p; multiplicity method; adjusted p/q; search-level calibration |
| **Generalization** | holdout loss; baseline loss; predictive gain; uncertainty; temporal/environmental breakdown where applicable |
| **Stability** | score-stability distribution; selection stability if obtainable; prediction stability; perturbation specification |
| **Residual** | exception rate; residual codelength; residual-structure diagnostics; model-criticism warnings |
| **Comparative** | incremental compression conditional on accepted candidates; redundancy indicators; competing candidates dominated/dominating |
| **Usefulness** | declared objective; task utility or cost reduction; uncertainty; affected user/system |
| **Causal status** | none / hypothesis / identified observational claim / quasi-experimental / experimental or another domain-governed evidence classification |
| **Semantic status** | uninterpreted / externally associated / grounded interpretation, with provenance |
| **Negative evidence** | failed replications, unstable strata, violated assumptions, contradictory sources, unresolved anomalies |

The last field is especially compatible with Research Intelligence, whose evidence standard explicitly requires preserving limitations, conflicts, unsupported assumptions, counterexamples, and review triggers rather than manufacturing certainty. fileciteturn8file0L2-L2

### Pareto dominance should filter obvious losers

For comparable candidates within the same declared task/scope, \(P\) can be said to **Pareto-dominate** \(Q\) when it is no worse on every designated benefit dimension and strictly better on at least one.

Useful benefit dimensions might include:

- net compression gain;
- held-out predictive gain;
- robustness/stability;
- incremental novelty;
- task utility.

Complexity itself need not appear again if net MDL already charges it. Significance is usually better used as a qualification/gate than as an unlimited reward. Coverage and recurrence should ordinarily remain contextual rather than universally maximized because local but strong patterns can be legitimate.

This yields a **Pareto front** of non-dominated candidates. A candidate far from the front is difficult to justify: another pattern explains at least as much structure, predicts at least as well, is at least as stable, and adds at least as much new information.

A front may contain multiple genuine alternatives—for example:

- a very compact broad rule with moderate predictive gain;
- a more complex model with excellent prediction;
- a narrow but highly useful anomaly rule.

That is informative. The fact that the system cannot choose between them without a user objective is not a defect; it reveals a genuine value tradeoff.

### Composite scores are permissible only after the objective is explicit

There are legitimate reasons to produce a scalar—UI ordering, alert budgets, automated triage, or a particular downstream optimization. But the score should be presented as a **task policy**, not a discovery of universal meaningfulness.

A defensible form is

\[
S_w(P)
=
\sum_j w_j\,T_j(E_j(P)),
\]

where:

- \(E_j\) are already validated evidence dimensions;
- \(T_j\) are declared monotone transformations/normalizations;
- \(w_j\) express explicit task preferences;
- candidates failing non-compensable gates are excluded before scoring.

The system should record the weight set and, for consequential rankings, show whether the order changes substantially under plausible weights. If the winner changes whenever a small weight is perturbed, the correct conclusion is that there is no robustly superior single candidate.

Causality and semantic meaning should normally remain **typed evidence states outside this compensatory sum**. Statistical significance should likewise usually be thresholded/qualified rather than rewarded without bound.

The resulting policy is therefore:

> **Profile first. Pareto-filter second. Scalarize only for a named decision. Never publish the scalar as “meaningfulness.”**

## Domain-independent core and reporting contract

### What can be universal

The following principles are defensible across symbolic-pattern domains:

| Domain-independent principle | Why it generalizes |
|---|---|
| Compare a candidate with an explicit baseline rather than with nothing. | Evidence is inherently comparative; MDL and statistical testing both require a reference. citeturn16view0turn21view1 |
| Charge model complexity, parameters, and exceptions rather than fit alone. | Otherwise memorization and arbitrary exception lists win. citeturn16view0turn21view0 |
| Prefer incremental evidence conditional on already accepted patterns. | Prevents redundant variants from monopolizing attention. citeturn17view3turn21view1 |
| Separate coverage from quality and recurrence from independence. | Frequency/support describes scope; it is not itself surprise or replication. citeturn16view0turn20search0 |
| Correct inferential claims for the search/multiplicity that produced them. | Pattern discovery inherently considers many hypotheses. citeturn21view1turn12search4 |
| Evaluate generalization on genuinely unseen data. | Model selection can overfit the discovery sample and even the selection criterion. citeturn14search0turn12search0 |
| Test robustness under declared reasonable perturbations. | Stability is a component of reproducibility. citeturn15academia48turn12search1 |
| Inspect residuals rather than treating exceptions as the end of analysis. | Systematic residuals are evidence of misspecification. citeturn14search5turn14search4 |
| Distinguish description, prediction, and causal explanation. | They are different research objectives and require different evidence. citeturn15search2turn21view3 |
| Do not infer semantic meaning from formal regularity alone. | Semantic grounding requires evidence outside symbolic form itself. citeturn15search3 |

### What necessarily requires domain knowledge

The evaluator cannot determine universally:

**The model/pattern language and code.** The cost of a symbolic structure depends on the available primitives and prior commitments. MDL pattern-mining research explicitly identifies the pattern language and encoding design as application choices. citeturn17view2 This report does not prescribe those primitives.

**The null model.** What counts as “chance” depends on what characteristics should remain invariant under the null. A random permutation, independent-symbol model, Markov null, exchangeable sampling model, or spatial null can answer radically different questions. Statistically sound pattern discovery emphasizes choosing tests appropriate to the sampling interpretation and application. citeturn11search5

**What constitutes independent recurrence.** Temporal, spatial, genealogical, social-network, and duplicated observations have different dependence structures.

**The prediction loss and deployment distribution.** A next-symbol log loss, classification error, forecasting error, and failure-cost objective answer different questions.

**Reasonable perturbations.** Changing 1% of symbols may represent sensor noise in one domain and destroy the phenomenon in another.

**Usefulness.** Only a task or user provides the payoff structure.

**Causal assumptions.** They require scientific/domain knowledge and study design; they are not derivable mechanically from the observational association alone. citeturn21view3

**Semantic interpretation.** Connecting formal patterns to concepts, entities, mechanisms, language, phonetics, biology, behavior, or other meaning-bearing domains necessarily introduces external evidence. citeturn15search3

The general evaluator should therefore be **parameterized by these domain commitments rather than pretending to eliminate them**.

### Recommended claim vocabulary

The safest reporting strategy is to say exactly what evidence a candidate earned.

| Permissible claim | Minimum evidence the label should imply |
|---|---|
| **“Observed pattern”** | Candidate matches stated observations; no broader implication. |
| **“Compressive pattern”** | Positive net description-length improvement under an identified baseline/code, with full model and residual accounting. |
| **“Broad-coverage pattern”** | Coverage metric reported; says nothing yet about quality. |
| **“Recurrent pattern”** | Repeated observations/support reported, with dependence qualifications where relevant. |
| **“Statistically supported pattern”** | Explicit null/test plus search-appropriate multiplicity control and effect estimate. |
| **“Predictive pattern”** | Improvement against a baseline on genuinely unseen observations. |
| **“Stable pattern”** | Robustness demonstrated under a declared perturbation family; the type of stability stated. |
| **“Novel relative to background B”** | Adds information after conditioning on B/accepted patterns or is surprising relative to an identified prior-belief model. |
| **“Useful for task T”** | Demonstrated decision/product utility for T, including relevant costs. |
| **“Candidate structural explanation”** | Competitive generative economy plus adequate fit, generalization, stability, residual adequacy, and alternative-model comparison. |
| **“Causal explanation”** | Separate causal identification assumptions and evidence appropriate to the domain. |
| **“Meaningful as X”** | External semantic grounding/validation supporting X, with provenance. |

The qualifiers matter. “Novel **relative to background B**” is epistemically honest; “novel” without a reference set is often not. “Useful **for task T**” is defensible; “useful” universally is not. “Stable **under bootstrap resampling and measurement perturbation Q**” has content; “stable” alone is underspecified.

### Language the system should avoid

A discovery system should not transform evidence into anthropomorphic or causal narratives such as:

> “The data wants to form two groups.”

> “This pattern explains why X happens.”

> “The symbols mean Y.”

> “The system discovered a fundamental law.”

unless the corresponding causal, semantic, or scientific evidence actually exists.

Instead it should report:

> “Candidate P reduces total codelength by 418 bits relative to baseline B after its own 73-bit model cost and exception encoding.”

> “P covers 62% of observations and occurs in 14 independent source groups.”

> “Its association survives FDR correction at the declared discovery-family level.”

> “On an untouched test set, P improves log loss by 0.08 bits per observation.”

> “Its compression advantage remains positive in 94% of declared subsamples.”

> “Residuals remain concentrated in context C, suggesting incomplete explanation.”

> “P adds little incremental compression after candidate Q and is therefore largely redundant with Q.”

> “No causal interpretation has been established.”

> “No external semantic interpretation has been established.”

That vocabulary mirrors Research Intelligence's own requirement to separate observations and published findings from inference, recommendations, hypotheses, and speculation. fileciteturn8file0L2-L2

### The recommended evaluation contract

Putting the research together, the candidate evaluator should accept a candidate \(P\), observed data \(D\), background/baseline \(B\), and—as available—search provenance \(S\), prior accepted patterns \(A\), holdout data \(H\), perturbation specification \(Q\), and task context \(T\). It should emit an evidence record approximately of the form:

\[
E(P)=
\{
\underbrace{G_{\mathrm{MDL}},L(P),L(D\mid P)}_{\text{compression / fit}},
\underbrace{C,R}_{\text{coverage / recurrence}},
\underbrace{\text{effect},p,q}_{\text{significance}},
\underbrace{G_{\mathrm{pred}}}_{\text{prediction}},
\underbrace{S_{\mathrm{metric}},S_{\mathrm{select}},S_{\mathrm{pred}}}_{\text{stability}},
\underbrace{G_{\mathrm{residual}}}_{\text{residual adequacy}},
\underbrace{G_{\mathrm{inc}}}_{\text{novelty}},
\underbrace{U_T}_{\text{usefulness}},
\underbrace{\text{causal status}}_{\text{non-compensable}},
\underbrace{\text{semantic status}}_{\text{non-compensable}}
\}.
\]

Not every field will always exist. **Missing evidence should remain missing**, not be silently replaced by a neutral numeric value. That is especially important for causality, semantics, unquantified multiplicity, and unavailable holdout confirmation.

The default ranking procedure should then be:

**Validity screening.** Reject or downgrade unsupported evidence claims rather than the candidate itself.

**Profile comparison.** Show structural, inferential, predictive, robust, comparative, and task evidence separately.

**Pareto filtering.** Remove candidates demonstrably dominated by alternatives on the dimensions relevant to the current objective.

**Redundancy conditioning.** Recompute attention value incrementally relative to already selected explanations.

**Optional task ranking.** Apply an explicitly named, versioned utility function only where a downstream product needs an ordering.

**Typed reporting.** Generate only the strongest claim for which the candidate actually has the required evidence.

This answers the primary question in operational terms:

> **One symbolic pattern is more explanatory than another when it achieves a materially better generative account after complexity and residuals are charged, generalizes beyond the data that selected it, withstands model criticism and perturbation, and improves upon serious competing explanations. It is more statistically significant when it survives an explicit null and the multiplicity of the discovery process. It is more predictive when it performs better on unseen data. It is more stable when that evidence persists under relevant perturbations. It is more novel when it contributes information not already captured by the background. It is more useful only relative to a task. None of those properties, alone or together, establishes causality or semantic meaning.**

That is the strongest defensible boundary for an automatic discovery engine: **discover structure aggressively, but make every stronger epistemic adjective earn its own evidence.**

The present research stage is complete.
