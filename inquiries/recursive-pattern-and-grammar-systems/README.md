---
title: Recursive pattern and grammar systems
programs:
  - Beyond Regex
horizon: Beyond Regex
maturity: Exploratory
last-reviewed: 2026-08-12
review-triggers:
  - Focused grammar-system comparison
  - Downstream need for nested or context-free parsing
---

# Recursive pattern and grammar systems

## Research question

When do recursive patterns, parsing expression grammars, grammar braiding, and tree captures provide the right model, and how should they relate to rather than silently expand regex semantics?

## Motivation / decision informed

The answer could guide whether nested-language problems use specialized parsers, a separate STRling-adjacent system, or carefully bounded interoperability.

## Current state

The preserved report surveys Raku grammars and LPeg and proposes a first-class grammar architecture and virtual machine. That architecture is not accepted and predates the canonical Fourth Edition compiler.

## Scope

Recursive patterns, PEG ordered choice, captures as trees, cursor/state models, grammar composition, embedding, ambiguity, left recursion, error reporting, and interoperability.

## Non-goals

This inquiry does not select LPeg, Raku, a parsing VM, or a grammar syntax; claim that ordered choice cures all denial-of-service risk; or put grammar implementation in the Fourth Edition campaign.

## Research method

Current work is historical preservation. Later work should use primary language specifications, comparative parsing literature, representative nested-language tasks, and prototypes with explicit semantic and performance criteria.

## Evidence and source quality

The report is AI-assisted and implementation-prescriptive. Primary semantics, performance claims, and architecture implications require revalidation.

## Findings

Grammar systems address problems and return structures that conventional regex APIs often do not. Ordered-choice PEG semantics, recursive grammars, and tree captures create different compatibility, complexity, and explanation obligations. A separate subsystem or integration boundary is a live alternative.

## Limits, uncertainty, and negative knowledge

Demand, feature boundary, ambiguity policy, streaming behavior, error quality, and cross-target meaning remain unknown. A shared word such as “pattern” does not establish a shared compiler architecture.

## Alternatives considered

Parser generators, PEG libraries, parser combinators, host parsers, recursive target-engine features, island grammars, and separate grammar services.

## Implications for STRling

Future work should protect the regex-intent compiler's semantic clarity and treat grammar support as an independently justified decision.

## Recommendations

Keep the inquiry Beyond Regex and compare specialized systems before any integration proposal.

## Rejected or abandoned alternatives

The proposed LPeg-style VM, operator mappings, phased implementation, and grammar architecture are not committed STRling direction.

## Downstream disposition

**Disposition:** none.

## Reports

- [STRling Grammar Evolution Research](reports/grammar-evolution.md) — historical Raku/LPeg research input; requires revalidation.

## Sources

See the report bibliography pending focused primary-source verification.

[← Inquiries](../README.md)
