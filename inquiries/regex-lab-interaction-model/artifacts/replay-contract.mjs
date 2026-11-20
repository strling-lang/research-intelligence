import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { once } from 'node:events';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { isDeepStrictEqual } from 'node:util';
import { Worker } from 'node:worker_threads';

const websiteSha = '3187d307e1d4707d706b1a7508f0cc5c067cadac';
const compilerSha = 'eba5dad3de3fa620eb1ea13e0514d02f4b23e288';
const source = readFileSync(new URL('contract-cases.json', import.meta.url), 'utf8');
const cases = JSON.parse(source);
const runtime = {
  kind: 'local-native',
  id: 'node:24.4.1',
  engine: process.versions.v8,
  unicode: process.versions.unicode,
  nativeUnit: 'utf16',
};
assert.equal(process.versions.node, '24.4.1');
assert.equal(runtime.engine, '13.6.233.10-node.17');
assert.equal(runtime.unicode, '16.0');
assert.ok(cases.length <= 32);

const digest = (text) => createHash('sha256').update(text).digest('hex');

function span(start, end, unit = 'utf16') {
  assert.ok(Number.isInteger(start) && Number.isInteger(end) && start >= 0 && start <= end);
  return { subject: 'input', unit, start, end };
}

function displaySpan(subject, native) {
  if (native.unit === 'utf16') {
    assert.ok(native.end <= subject.length);
    return { status: 'native', span: native };
  }
  assert.ok(['utf8', 'scalar'].includes(native.unit));
  if (!subject.isWellFormed()) return { status: 'unavailable', reason: 'malformed-input' };
  let from = 0;
  let utf16 = 0;
  const boundaries = new Map([[0, 0]]);
  for (const char of subject) {
    from += native.unit === 'utf8' ? Buffer.byteLength(char) : 1;
    utf16 += char.length;
    boundaries.set(from, utf16);
  }
  if (!boundaries.has(native.start) || !boundaries.has(native.end)) {
    return { status: 'unavailable', reason: 'non-boundary' };
  }
  return {
    status: 'derived',
    method: 'unicode-scalar-boundaries-v1',
    span: span(boundaries.get(native.start), boundaries.get(native.end)),
  };
}

function viewMatch(match) {
  return { value: match[0], native: span(...match.indices[0]) };
}

function selectCaptures(match, fields) {
  return fields.map((name) => {
    if (!Object.hasOwn(match.groups ?? {}, name)) return { name, state: 'absent' };
    const value = match.groups[name];
    if (value === undefined) return { name, state: 'nonparticipating' };
    return { name, state: 'participated', value, native: span(...match.indices.groups[name]) };
  });
}

function scan(regex, subject, cursor, maxMatches) {
  const unicode = regex.unicode;
  const previous = subject.charCodeAt(cursor - 1);
  const next = subject.charCodeAt(cursor);
  const insidePair = previous >= 0xd800 && previous <= 0xdbff && next >= 0xdc00 && next <= 0xdfff;
  if (cursor > subject.length || (unicode && insidePair)) {
    return { status: 'refused', reason: 'invalid-cursor-boundary' };
  }
  regex.lastIndex = cursor;
  const matches = [];
  for (const match of subject.matchAll(regex)) {
    if (matches.length === maxMatches) {
      return { status: 'matched', matches, complete: false, resume: 'unavailable' };
    }
    matches.push(viewMatch(match));
  }
  return { status: matches.length ? 'matched' : 'no-match', matches, complete: true };
}

function runRaw(caseInput) {
  const { operation, pattern, subject, flags = '', cursor = 0, maxMatches = 8, maxOutput = 32 } = caseInput;
  assert.ok(cases.includes(caseInput), 'Only the checked-in cases may run');
  assert.ok(pattern.length <= 40 && subject.length <= 24);
  assert.ok(/^(?:g|u)?$/.test(flags));
  assert.ok(Number.isInteger(cursor) && cursor >= 0 && maxMatches <= 8 && maxOutput <= 32);
  let regex;
  try {
    const full = operation === 'full-match';
    const engineFlags = operation === 'scan' ? `g${flags}` : flags;
    const sourcePattern = full ? `^(?:${pattern})(?![\\s\\S])` : pattern;
    regex = new RegExp(sourcePattern, `d${engineFlags}`);
  } catch (error) {
    if (!(error instanceof SyntaxError)) throw error;
    return { status: 'compile-rejection' };
  }
  if (operation === 'scan') return scan(regex, subject, cursor, maxMatches);
  if (operation === 'replace') {
    assert.ok(caseInput.template.length <= 8);
    const output = subject.replace(regex, caseInput.template);
    const complete = output.length <= maxOutput;
    return { status: 'completed', complete, output: complete ? output : null };
  }
  if (operation === 'split') {
    const parts = subject.split(regex, caseInput.limit).map((value) => value === undefined
      ? { unavailableValue: 'nonparticipating' }
      : value);
    return { status: 'completed', parts };
  }
  if (['search', 'full-match', 'extract'].includes(operation)) {
    const match = regex.exec(subject);
    if (!match) return { status: 'no-match', matches: [] };
    const result = { status: 'matched', matches: [viewMatch(match)] };
    if (operation === 'extract') result.fields = selectCaptures(match, caseInput.fields);
    return result;
  }
  return { status: 'refused', reason: 'unknown-operation' };
}

function projectObservation(record, expected) {
  const observed = { ...record };
  if ('prefix' in expected) observed.prefix = record.matches.map((match) => match.value);
  if ('starts' in expected) observed.starts = record.matches.map((match) => match.native.start);
  if ('states' in expected) observed.states = record.fields.map((field) => field.state);
  if ('values' in expected) observed.values = record.fields.map((field) => field.value ?? null);
  return Object.fromEntries(Object.keys(expected).map((key) => [key, observed[key]]));
}

const observations = cases.map((caseInput) => {
  const result = runRaw(caseInput);
  assert.deepEqual(projectObservation(result, caseInput.expected), caseInput.expected, caseInput.id);
  return { id: caseInput.id, operation: caseInput.operation, result };
});

// The independent hand table uses cumulative widths of A, supplementary U+1F600,
// e, and combining U+0301. The bytes between boundaries cannot be rendered
// as exact text ranges. UTF-16 inside a surrogate pair is still a native fact.
const subject = 'A😀e\u0301';
const coordinateChecks = [
  [span(1, 5, 'utf8'), span(1, 3)],
  [span(6, 8, 'utf8'), span(4, 5)],
  [span(1, 2, 'scalar'), span(1, 3)],
  [span(2, 4, 'scalar'), span(3, 5)],
  [span(2, 2, 'utf16'), span(2, 2)],
];
for (const [native, expected] of coordinateChecks) {
  const display = displaySpan(subject, native);
  assert.deepEqual(display.span, expected);
  assert.equal(display.status, native.unit === 'utf16' ? 'native' : 'derived');
}
assert.deepEqual(displaySpan(subject, span(2, 5, 'utf8')), {
  status: 'unavailable', reason: 'non-boundary',
});
assert.deepEqual(displaySpan('\ud800', span(0, 3, 'utf8')), {
  status: 'unavailable', reason: 'malformed-input',
});
assert.throws(() => new TextDecoder('utf-8', { fatal: true }).decode(Uint8Array.of(0xff)), TypeError);

// A caller's signal is observable. Producer shutdown is a distinct event.
const controller = new AbortController();
const worker = new Worker(`
  const { parentPort } = require('node:worker_threads');
  parentPort.on('message', () => {});
  parentPort.postMessage('ready');
`, { eval: true });
let exited = false;
worker.once('exit', () => { exited = true; });
let terminationCode;
try {
  assert.deepEqual(await once(worker, 'message', { signal: AbortSignal.timeout(5000) }), ['ready']);
  controller.abort();
  assert.equal(controller.signal.aborted, true);
  assert.equal(exited, false);
} finally {
  terminationCode = await worker.terminate();
}
assert.equal(terminationCode, 1);
assert.equal(exited, true);

function envelope(request, result) {
  assert.equal(request.id, result.id);
  assert.equal(request.generation, result.generation);
  assert.equal(request.operation, result.operation);
  assert.equal(request.providerId, result.providerId);
  assert.equal(request.profile, result.profile);
  assert.ok(['native-observation', 'fixture'].includes(result.evidence));
  if (request.program.kind === 'semantic') {
    assert.equal(request.program.target, request.profile);
    if (request.program.provenance === 'contract-example') assert.equal(result.evidence, 'fixture');
  }
  return { request, result };
}

const sharedInput = { text: '😀abc', coordinateSpace: 'input' };
const rawCase = cases.find((fixture) => fixture.id === 'shared-subject-literal');
const cursorCase = cases.find((fixture) => fixture.id === 'cursor');
const rawRequest = {
  id: 'case-raw-r1', generation: 1, operation: 'search',
  profile: `${runtime.id}/${runtime.engine}`, providerId: 'local-node-fixed-cases',
  program: { kind: 'raw', dialect: 'ECMAScript', pattern: rawCase.pattern, flags: '' },
  input: sharedInput, limits: { matches: 1 }, parameters: {},
};
const cursorRequest = {
  ...rawRequest, id: 'case-raw-r3', generation: 3, operation: 'scan',
  program: { ...rawRequest.program, pattern: cursorCase.pattern },
  input: { ...sharedInput, text: cursorCase.subject }, limits: { matches: 8 },
  parameters: { cursor: cursorCase.cursor, unit: 'utf16', progression: 'ecmascript-matchAll' },
};
const semanticRequest = {
  id: 'case-semantic-r2', generation: 2, operation: 'search',
  profile: 'profile:pcre2/10.43@1.3.0', providerId: 'semantic-target-literal-fixture',
  program: {
    kind: 'semantic', inputKind: 'semantic-ir', literal: 'abc', compilerRevision: compilerSha,
    compilerContract: '1.0.0', target: 'profile:pcre2/10.43@1.3.0',
    targetDigest: '56762a1d289d41d0811b007695464916fda0ca5c48c2f5569b4ec26983a24bff',
    example: 'spec/contracts/1.0/examples/compile-result/target-artifact.json',
    provenance: 'contract-example',
  },
  input: sharedInput, limits: { matches: 1 }, parameters: {},
};

function identity(request) {
  const { id, generation, operation, profile, providerId } = request;
  return { id, generation, operation, profile, providerId };
}

const rawRecord = envelope(rawRequest, {
  ...identity(rawRequest), evidence: 'native-observation', ...runRaw(rawCase),
});
const cursorRecord = envelope(cursorRequest, {
  ...identity(cursorRequest), evidence: 'native-observation', ...runRaw(cursorCase),
});
assert.equal(sharedInput.text.indexOf('abc'), 2);
const semanticRecord = envelope(semanticRequest, {
  ...identity(semanticRequest), evidence: 'fixture', status: 'matched',
  matches: [{ value: 'abc', native: span(4, 7, 'utf8') }],
});
const fixtureSpan = semanticRecord.result.matches[0].native;
assert.equal(sharedInput.text.slice(fixtureSpan.start, fixtureSpan.end), 'c');
assert.deepEqual(displaySpan(sharedInput.text, fixtureSpan).span, rawRecord.result.matches[0].native);
assert.throws(() => envelope(rawRequest, { ...rawRecord.result, operation: 'replace' }), assert.AssertionError);
assert.throws(() => envelope(rawRequest, { ...rawRecord.result, evidence: 'certified' }), assert.AssertionError);
assert.throws(() => envelope(semanticRequest, rawRecord.result), assert.AssertionError);
assert.throws(() => envelope(semanticRequest, { ...semanticRecord.result, evidence: 'native-observation' }), assert.AssertionError);

function save(records) {
  return JSON.stringify({ version: 1, records });
}

function replay(text, expectedDigest, availableProvider) {
  if (digest(text) !== expectedDigest) return { status: 'refused', reason: 'digest-mismatch' };
  const session = JSON.parse(text);
  assert.equal(session.version, 1);
  return session.records.map(({ request, result }) => {
    envelope(request, result);
    if (!Object.hasOwn(request.input, 'text')) return 'redacted';
    if (result.evidence === 'fixture') return 'fixture-history';
    if (request.providerId !== availableProvider.providerId) return 'provider-unavailable';
    if (request.profile !== availableProvider.profile) return 'profile-unavailable';
    if (request.input.coordinateSpace !== 'input' || request.program.kind !== 'raw'
      || request.program.dialect !== 'ECMAScript') return 'outside-replay-fixtures';
    const input = cases.find((fixture) => fixture.operation === request.operation
      && fixture.pattern === request.program.pattern && fixture.subject === request.input.text
      && (fixture.flags ?? '') === request.program.flags
      && fixture.cursor === request.parameters.cursor);
    if (!input) return 'outside-replay-fixtures';
    const parameters = request.operation === 'scan'
      ? { cursor: input.cursor, unit: 'utf16', progression: 'ecmascript-matchAll' }
      : {};
    const matchLimit = request.operation === 'scan' ? input.maxMatches ?? 8 : 1;
    if (!['scan', 'search'].includes(request.operation)
      || !isDeepStrictEqual(request.parameters, parameters)
      || !isDeepStrictEqual(request.limits, { matches: matchLimit })) return 'outside-replay-fixtures';
    assert.deepEqual({ ...identity(request), evidence: 'native-observation', ...runRaw(input) }, result);
    return 'replayed';
  });
}

const saved = save([rawRecord, semanticRecord, cursorRecord]);
const savedHash = digest(saved);
const availableProvider = { providerId: rawRequest.providerId, profile: rawRequest.profile };
const expectedReplay = ['replayed', 'fixture-history', 'replayed'];
assert.deepEqual(replay(saved, savedHash, availableProvider), expectedReplay);
assert.deepEqual(replay(saved, savedHash, { ...availableProvider, profile: 'unresolved-runtime' }),
  ['profile-unavailable', 'fixture-history', 'profile-unavailable']);
assert.deepEqual(replay(saved, savedHash, { ...availableProvider, providerId: 'unavailable-provider' }),
  ['provider-unavailable', 'fixture-history', 'provider-unavailable']);
assert.deepEqual(replay(saved + ' ', savedHash, availableProvider), { status: 'refused', reason: 'digest-mismatch' });
const redacted = save([{ ...rawRecord, request: { ...rawRequest, input: { redacted: true } } }]);
assert.deepEqual(replay(redacted, digest(redacted), availableProvider), ['redacted']);
const changedRequests = [
  { ...cursorRequest, parameters: { ...cursorRequest.parameters, cursor: 0 } },
  { ...cursorRequest, parameters: { ...cursorRequest.parameters, unit: 'scalar' } },
  { ...cursorRequest, parameters: { ...cursorRequest.parameters, progression: 'overlap' } },
  { ...cursorRequest, input: { ...cursorRequest.input, coordinateSpace: 'different-subject' } },
  { ...cursorRequest, limits: { matches: 7 } },
];
for (const request of changedRequests) {
  const changed = save([{ ...cursorRecord, request }]);
  assert.deepEqual(replay(changed, digest(changed), availableProvider), ['outside-replay-fixtures']);
}

// Failure fixtures are records of a modelled event, not timing observations.
const outcomes = [
  { status: 'cancelled', termination: 'unconfirmed' },
  { status: 'deadline-exceeded', termination: 'unconfirmed' },
  { status: 'resource-terminated', termination: 'producer-acknowledged', cause: 'timeout' },
  { status: 'infrastructure-failure', phase: 'transport' },
  { status: 'runtime-error', phase: 'execution' },
  { status: 'refused', reason: 'profile-identity-unknown' },
  { status: 'unsupported-operation', reason: 'provider-declared' },
  { status: 'unknown', reason: 'capture-participation-unavailable', fields: [{ name: 'sample', state: 'unavailable' }] },
];
for (const outcome of outcomes) {
  const result = envelope(rawRequest, { ...identity(rawRequest), evidence: 'fixture', ...outcome }).result;
  assert.deepEqual(JSON.parse(JSON.stringify(result)), result);
  assert.equal(Object.hasOwn(result, 'matches'), false);
}

const output = {
  fixtureSha256: digest(source.replaceAll('\r\n', '\n')),
  runtime,
  observations,
  coordinateChecks: coordinateChecks.length + 3,
  workerTermination: { abortRequested: true, exitedAfterTerminate: true, terminationCode },
  replay: { savedHash, expected: expectedReplay, negativeChecks: 4 + changedRequests.length },
  simulatedFailureOutcomes: outcomes,
};

async function auditWebsite(path) {
  const show = (file) => execFileSync('git', ['-C', path, 'show', `${websiteSha}:${file}`], { encoding: 'utf8' });
  const asModule = (content) => `data:text/javascript;base64,${Buffer.from(content).toString('base64')}`;
  const contracts = asModule(stripTypeScriptTypes(show('src/lib/regex-lab/contracts.ts')));
  const coordinator = asModule(stripTypeScriptTypes(show('src/lib/regex-lab/coordinator.ts')).replace('./contracts.ts', contracts));
  const { createLabExecutionRequest } = await import(contracts);
  const { ReactiveLabExecutor } = await import(coordinator);
  const settled = [];
  const deferred = new Map();
  const provider = {
    providerId: 'fixture-provider', kind: 'fixture', supports: () => true,
    execute: (request, { signal }) => new Promise((resolve, reject) => {
      deferred.set(request.requestId, { resolve, reject, signal });
    }),
  };
  const executor = new ReactiveLabExecutor(provider, {
    onStateChange: (state) => { if (state.phase === 'settled') settled.push(state.result); },
  });
  const request = (id) => createLabExecutionRequest({
    requestId: id, operationId: 'search', pattern: 'z', input: 'a', options: {},
    runtime: { profileId: 'fixture', releaseId: '1', profileReleaseId: 'fixture-1', technicalLabel: 'Fixture' },
  });
  const result = (id, operationId = 'search', providerId = 'fixture-provider') => ({
    schemaVersion: 'strling-regex-lab-execution-result-v1',
    requestId: id, profileReleaseId: 'fixture-1', operationId,
    provider: { providerId, kind: 'fixture' }, timing: { durationMs: 0 },
    status: 'no-match', matches: [],
  });
  executor.update(request('obsolete'));
  const obsolete = executor.flush();
  executor.update(request('current'));
  const current = executor.flush();
  assert.equal(deferred.get('obsolete').signal.aborted, true);
  deferred.get('current').resolve(result('current', 'split', 'unexpected-provider'));
  await current;
  deferred.get('obsolete').resolve(result('obsolete'));
  await obsolete;
  assert.deepEqual(settled.map(({ requestId }) => requestId), ['current']);
  assert.equal(settled[0].operationId, 'split');
  assert.equal(settled[0].provider.providerId, 'unexpected-provider');

  executor.update(request('failure'));
  const failure = executor.flush();
  deferred.get('failure').reject(new Error('fixture transport failure'));
  await failure;
  assert.equal(settled[1].status, 'infrastructure-failure');
  executor.dispose();
  return { revision: websiteSha, staleResponseDropped: true, mismatchedOperationAccepted: true,
    mismatchedProviderAccepted: true, thrownProviderFailure: settled[1].status };
}

if (process.argv.length === 4 && process.argv[2] === '--website') {
  output.website = await auditWebsite(process.argv[3]);
} else {
  assert.equal(process.argv.length, 2, 'Usage: node replay-contract.mjs [--website path]');
}

console.log(JSON.stringify(output));
