import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

const kit = JSON.parse(readFileSync(new URL('fixtures.json', import.meta.url), 'utf8'));
const [checkout] = process.argv.slice(2);
assert.equal(process.argv.length, checkout ? 3 : 2, 'Usage: node dry-run.mjs [strling-checkout]');
assert.equal(process.versions.node, kit.runtime.node);
assert.equal(process.versions.v8, kit.runtime.v8);

const pythonSource = String.raw`
import json, re, sys
forms = json.load(sys.stdin)
def span(match):
    return list(match.span()) if match else None
print(json.dumps({
    'version': '.'.join(map(str, sys.version_info[:3])),
    'forms': [{
        'versionSpan': span(re.search(r'\B', x['version']['subject'])),
        'digitSpan': span(re.search(r'\d', x['profile']['subject'])),
        'asciiDigitSpan': span(re.search(r'\d', x['profile']['subject'], re.ASCII)),
    } for x in forms],
}))
`;
const python = spawnSync('python', ['-I', '-B', '-X', 'utf8', '-c', pythonSource],
  { input: JSON.stringify(kit.forms), encoding: 'utf8', timeout: 5000 });
assert.ifError(python.error);
assert.equal(python.status, 0, python.stderr);
const py = JSON.parse(python.stdout);
assert.equal(py.version, kit.runtime.python);

function findSpan(expression, subject) {
  const match = expression.exec(subject);
  return match && [match.index, match.index + match[0].length];
}

function digest(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

function projectLiteralSession(session) {
  const requiredRuntime = `node@${kit.runtime.node}/v8@${kit.runtime.v8}`;
  if (session.runtime !== requiredRuntime || session.operation !== 'stateful_search'
      || session.options?.flags !== 'g' || session.coordinateUnit !== 'utf16-code-unit'
      || !['raw-regex', 'semantic-fixture'].includes(session.frontend)
      || !Number.isInteger(session.startAt) || session.startAt < 0
      || session.subjectSha256 !== digest(session.subject)) {
    return { status: 'unavailable' };
  }
  // This bridge maps only those two known fixture literals. It is no frontend.
  const allowed = kit.forms.map(form => form.replay.literal);
  let rawSource = session.source;
  if (session.frontend === 'semantic-fixture') {
    rawSource = allowed.find(text => session.source === `semantic strling 1.0;\ncase sensitive;\npattern text "${text}";\n`);
  }
  if (!allowed.includes(rawSource)) return { status: 'unavailable' };
  const raw = new RegExp(rawSource, session.options.flags);
  raw.lastIndex = session.startAt;
  return { status: 'observed', span: findSpan(raw, session.subject), unit: session.coordinateUnit };
}

const observed = kit.forms.map((form, index) => {
  const { inherited, diagnosis, captures, replace, author, replay } = form;
  const capturesFor = pattern => captures.subjects.map(subject => {
    const { label, rank } = new RegExp(pattern, 'u').exec(subject).groups;
    return [label, rank ?? null];
  });
  const matches = (pattern, subjects) => subjects.map(subject => new RegExp(pattern, 'u').test(subject));
  const session = {
    runtime: `node@${kit.runtime.node}/v8@${kit.runtime.v8}`,
    operation: 'stateful_search', startAt: replay.startAt,
    options: { flags: 'g' }, coordinateUnit: 'utf16-code-unit',
    subject: replay.subject, subjectSha256: digest(replay.subject),
    frontend: 'raw-regex', source: replay.literal,
  };
  const transported = JSON.parse(JSON.stringify(session));
  const rawResult = projectLiteralSession(transported);
  const semanticFixtureResult = projectLiteralSession({ ...transported, frontend: 'semantic-fixture',
    source: `semantic strling 1.0;\ncase sensitive;\npattern text "${replay.literal}";\n` });
  const missingProfile = { ...transported, runtime: undefined };
  const changedSubject = { ...transported, subject: `x${transported.subject}` };
  const result = {
    form: form.id,
    inherited: inherited.subjects.map(subject => new RegExp(inherited.pattern, 'u').exec(subject)?.groups.id ?? null),
    diagnosisBefore: matches(diagnosis.pattern, diagnosis.subjects),
    diagnosisAfter: matches(diagnosis.repair, diagnosis.subjects),
    capturesBefore: capturesFor(captures.before), capturesAfter: capturesFor(captures.after),
    replaced: replace.subject.replace(new RegExp(replace.pattern, 'gu'), replace.template),
    python313VersionSpan: py.forms[index].versionSpan,
    python314VersionSpan: 'not_tested',
    authorLiteralModel: author.subjects.map(subject => subject === author.text),
    authorChoiceModel: author.subjects.map(subject => author.choice.includes(subject)),
    pythonDigitSpan: py.forms[index].digitSpan,
    pythonAsciiDigitSpan: py.forms[index].asciiDigitSpan,
    jsDigitSpan: findSpan(/\d/u, form.profile.subject),
    rawResult, semanticFixtureResult,
    resetCursorResult: projectLiteralSession({ ...transported, startAt: 0 }),
    noCursorResult: projectLiteralSession({ ...transported, startAt: undefined }),
    missingProfileResult: projectLiteralSession(missingProfile),
    changedSubjectResult: projectLiteralSession(changedSubject),
    changedOptionsResult: projectLiteralSession({ ...transported, options: { flags: '' } }),
  };
  assert.deepEqual(result.inherited, inherited.expected);
  assert.deepEqual(result.diagnosisBefore, diagnosis.before);
  assert.deepEqual(result.diagnosisAfter, diagnosis.after);
  assert.deepEqual(result.capturesBefore, captures.expectedBefore);
  assert.deepEqual(result.capturesAfter, captures.expectedAfter);
  assert.equal(result.replaced, replace.expected);
  assert.deepEqual(result.python313VersionSpan, form.version.expected313Span);
  assert.deepEqual(result.authorLiteralModel, author.literal);
  assert.deepEqual(result.authorChoiceModel, author.extension);
  assert.deepEqual(result.pythonDigitSpan, form.profile.pythonSpan);
  assert.equal(result.pythonAsciiDigitSpan, null);
  assert.equal(result.jsDigitSpan, null);
  assert.deepEqual(rawResult.span, replay.expectedSpan);
  assert.deepEqual(rawResult, semanticFixtureResult);
  assert.deepEqual(result.resetCursorResult.span, [0, 2]);
  const refusals = [result.noCursorResult, result.missingProfileResult, result.changedSubjectResult,
    result.changedOptionsResult];
  for (const refusal of refusals) {
    assert.equal(refusal.status, 'unavailable');
  }
  return result;
});

function getCompilerFile(path) {
  return execFileSync('git', ['-C', checkout, 'show', `${kit.compilerRevision}:${path}`],
    { timeout: 5000, maxBuffer: 1024 * 1024 });
}

function verifyCards() {
  if (!checkout) return { status: 'not_run_without_pinned_checkout' };
  const digests = {};
  for (const card of kit.cards.filter(({ id }) => id !== 'S')) {
    const bytes = getCompilerFile(card.source);
    digests[card.id] = digest(bytes);
    const document = JSON.parse(bytes);
    if (card.id === 'F') {
      assert.equal(document.program.evidence_class, card.expect);
      assert.equal(document.nodes[0].semantic.kind, 'literal');
    } else if (card.id === 'C') {
      assert.equal(document.authority.classification, card.expect);
      assert.equal(document.authority.owner, 'P15-T04');
      assert.equal(document.authority.normative, false);
    } else {
      assert.deepEqual([document.outcome, document.explanation_disposition], card.expect);
      const limits = document.work.reached_limits;
      assert.deepEqual(limits, card.id === 'U' ? ['steps'] : []);
    }
  }
  const source = getCompilerFile('spec/frontends/semantic/1.0/fixtures/positive.json');
  const { cases } = JSON.parse(source);
  assert.ok(cases.some(test => test.expected.mapping_ids.includes('node.literal')
    && test.expected.mapping_ids.includes('node.alternation')));
  assert.ok(cases.some(test => test.expected.mapping_ids.includes('node.capture')));
  digests.frontendPositive = digest(source);
  return { status: 'verified_fields_in_pinned_sources', digests };
}

function score(cards) {
  let correct = 0;
  let highConfidenceErrors = 0;
  for (const card of kit.cards) {
    const answer = cards[card.id];
    if (answer?.class === card.class && answer?.scope === card.scope) {
      correct += 1;
    } else if (answer?.confidence >= 4) {
      highConfidenceErrors += 1;
    }
  }
  return { correct, possible: kit.cards.length, highConfidenceErrors };
}

// Instrument checks use constructed answers. No participant records exist.
const correct = Object.fromEntries(kit.cards.map(card => [card.id, { class: card.class, scope: card.scope, confidence: 4 }]));
const mistakes = structuredClone(correct);
mistakes.S = { ...mistakes.C };
mistakes.U = { ...mistakes.P };
mistakes.P.scope = 'all_inputs_and_targets';
mistakes.L = { ...mistakes.C, confidence: 2 };
delete mistakes.F;
const instrumentChecks = { complete: score(correct), ambiguousAndMissing: score(mistakes) };
assert.deepEqual(instrumentChecks.complete, { correct: 6, possible: 6, highConfidenceErrors: 0 });
assert.deepEqual(instrumentChecks.ambiguousAndMissing, { correct: 1, possible: 6, highConfidenceErrors: 3 });

console.log(JSON.stringify({
  kind: 'technical_dry_run', participants: 0, seed: 'no_randomness', runtime: kit.runtime,
  compilerRevision: kit.compilerRevision, websiteRevision: kit.websiteRevision,
  sourceChecks: verifyCards(), observed, instrumentChecks,
  notTested: ['both public Lab workflows', 'semantic compilation', 'Python 3.14 execution',
    'regex101 UI', 'VS Code UI', 'human performance', 'repeat use'],
}, null, 2));
