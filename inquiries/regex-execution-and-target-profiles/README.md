---
title: Regex execution and target profiles
programs:
  - Fourth Edition Architecture
  - Portability & Compatibility
  - Regex Conformance Science
  - Regex Knowledge Architecture
horizon: Fourth Edition
maturity: Exploratory
last-reviewed: 2026-08-12
review-triggers:
  - STRling ratifies an exact target-profile contract
  - Regex Conformance publishes profile-registry schemas or certified observations
  - Evidence reveals a new behaviorally material profile dimension
---

# Regex execution and target profiles

## Research question

How should exact runtime execution profiles and compiler-facing target profiles be identified, versioned, grouped, compared, and evolved so claims remain behaviorally scoped and reproducible?

## Motivation / decision informed

The answer may inform future STRling target selection and artifacts, Regex Knowledge profile research, and Conformance execution identity without treating an engine name as a semantic profile.

## Current state

STRling’s [ratified architecture](https://github.com/strling-lang/strling/blob/9991575b347ac5f56108f18065c88b2b16a5065a/governance/architecture.md) requires versioned target profiles and separates host languages from target engines, but explicitly leaves exact profile identity and schema to later contract work. Conformance defines execution profiles as behaviorally relevant component graphs and has a profile-registry boundary, but has no certified observations. The report’s concrete fields are recommendations, not implemented contracts.

## Scope

Execution-profile identity, compiler-facing target contracts, profile families, material behavioral dimensions, effective defaults, versions, aliases, equivalence, splitting, evolution, retirement, and evidence staleness.

## Non-goals

This inquiry defers portability meaning to [Regex portability semantics](../regex-portability-semantics/README.md), text details to [Unicode and text semantics](../unicode-and-text-semantics/README.md), operations to [operation and result semantics](../regex-operation-and-result-semantics/README.md), and target-independent lowering architecture to [Semantic IR and target lowering](../semantic-ir-and-target-lowering/README.md).

## Research method

The deep-research report compared runtime, host, Unicode, operation, build, and platform dimensions across representative ecosystems and proposed identity and equivalence rules. The synthesis checked current STRling and Conformance authority documents and extracted architectural invariants rather than the field-level proposal.

## Evidence and source quality

Pinned downstream documents support the current-state boundary and the need for profile-sensitive facts. The report’s external API survey and citation mapping were not durably preserved; the dimension taxonomy and equivalence tests require claim-level source verification and empirical discovery.

## Findings

- Engine or host labels are insufficient identities; behavior can depend on runtime release, embedded engine, host API, defaults, Unicode provider, options, build, and platform.
- Execution profiles describe reproducible observed environments. Target profiles describe compiler contracts over acceptable execution-profile sets; the identities serve different questions.
- Defaults must be resolved to effective values where they affect behavior, while aliases remain navigation rather than identity.
- Profile families group related profiles but do not confer capability inheritance.
- Profile equivalence is scoped to an observable and domain; it is not one timeless global relation.
- Unknown material dimensions must weaken or block exact claims rather than being silently filled.
- New evidence may split a previously broad profile without rewriting historical observations.

## Limits, uncertainty, and negative knowledge

No empirical campaign establishes which proposed dimensions are materially necessary for each engine family. Exact family membership, target-set satisfaction, capability aggregation, environment stratification, and evidence expiry remain unresolved. A detailed report does not establish that current STRling or Conformance schemas implement its model.

## Alternatives considered

Engine-name profiles, host-version profiles, fully enumerated environment identities, family-level targets, exact singleton targets, common-denominator target sets, dispatched targets, aliases as identities, and scoped behavioral equivalence were compared.

## Implications for STRling

A future compiler contract may need separate resolved execution identity, target contract identity, operation contract, Unicode/text policy, and evidence fingerprint. This is compatible with ratified architecture but requires downstream specification and implementation.

## Recommendations

The report recommends a candidate set-valued target-profile model with explicit material dimensions, resolved defaults, versioned families, scoped equivalence, fail-closed unknowns, historical retirement, and evidence-staleness rules. Validate it through Conformance profile-discovery probes before ratification.

## Rejected or abandoned alternatives

Reject engine-only identifiers, `Node 22`-style host labels as complete regex identity, mutable aliases as semantic identity, automatic family inheritance, and global equivalence. Do not place every operation parameter or resource limit into profile identity when a separate operational envelope is more precise.

## Downstream disposition

**Disposition:** none.

No target-profile schema or execution-profile model from this inquiry is recorded as adopted.

## Reports

| Report | Role | Current status |
| --- | --- | --- |
| [Execution and Target Profile Architecture](reports/regex-execution-and-target-profiles.md) | Modern primary research input | Active input; partially verified with unresolved claim-level citations. |

## Related inquiries

- [Regex portability semantics](../regex-portability-semantics/README.md)
- [Regex operation and result semantics](../regex-operation-and-result-semantics/README.md)
- [Unicode and text semantics](../unicode-and-text-semantics/README.md)
- [Semantic IR and target lowering](../semantic-ir-and-target-lowering/README.md)

## Sources

- [`strling` architectural invariants](https://github.com/strling-lang/strling/blob/9991575b347ac5f56108f18065c88b2b16a5065a/governance/architecture.md), reviewed commit `9991575`.
- [`regex-conformance` program status](https://github.com/strling-lang/regex-conformance/blob/57672519e899f986d94b7d1256ffe0aa90f1b26d/README.md), reviewed commit `5767251`.
- [`regex-conformance` profile registry boundary](https://github.com/strling-lang/regex-conformance/blob/57672519e899f986d94b7d1256ffe0aa90f1b26d/registries/profiles/README.md).

[← Inquiries](../README.md)
