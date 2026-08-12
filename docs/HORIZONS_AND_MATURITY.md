# Horizons and maturity

Horizons describe when research may be relevant. Maturity describes how well the inquiry's conclusions are supported. Neither is a directory structure or an engineering tracker.

## Horizons

### Fourth Edition

Directly relevant to the active STRling architecture transition: canonical semantics, the Rust compiler path, frontends, Semantic IR, analysis, profiles, portability planning, lowering, artifacts, diagnostics, validation, adapters, and compiler-backed tooling.

This label does not mean the work is implemented, scheduled, or required for release.

### Post-Fourth Edition

Likely relevant after the semantic compiler foundation stabilizes. These inquiries can inform later product and architecture choices, but should not be presented as current campaign scope without downstream acceptance.

### Beyond Regex

Long-range research into generalized pattern capabilities or adjacent systems without current product commitment. Inclusion records an area worth studying, not a promise that STRling will pursue it.

Store horizon in inquiry metadata. Do not make horizon directories.

## Maturity

### Exploratory

The question is framed, but sources, method, or synthesis are incomplete. Historical or AI-generated inputs may exist without current verification.

### Evidence-backed

Material claims have been checked against applicable evidence, conflicts and limits are recorded, and the inquiry can support bounded findings. Alternatives or decision criteria may still need work.

### Recommendation-ready

The evidence, alternatives, uncertainty, and implications are developed enough for a downstream owner to make a decision. This does not mean the recommendation has been accepted.

### Resolved

The research question has a durable answer within its scope or has been closed by an explicit downstream decision. Review triggers may reopen or supersede it.

### Superseded

A successor inquiry or changed authority has replaced this inquiry's active conclusion. The document remains available as history and must link to its successor.

## Downstream disposition

Track disposition separately from maturity:

- **none** — no downstream decision is recorded;
- **accepted** — the downstream owner accepted the recommendation;
- **partially accepted** — only a defined part was accepted;
- **rejected** — the downstream owner declined it;
- **implemented** — accepted work is implemented, with evidence; and
- **superseded downstream** — a later downstream decision replaced it.

Disposition requires a link or other traceable record. Research Intelligence cannot assign acceptance to another repository or product owner.

## Metadata discipline

Use one horizon and one maturity value in frontmatter. Omit optional supersession fields when unused. Record last review and concrete triggers such as an architecture decision, exact runtime release, new certified evidence, major replication, or material counterexample.
