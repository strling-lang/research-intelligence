import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const site = resolve(process.argv[2] ?? '../website');
const fixtureBytes = await readFile(new URL('./fixtures.json', import.meta.url));
const { forms } = JSON.parse(fixtureBytes);
const fromSite = (path) => import(pathToFileURL(resolve(site, path)).href);
const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');
const compilerModule = 'src/lib/regex-lab/compiler.ts';
const engineModule = 'src/lib/regex-lab/javascript-engine.ts';
const optionsModule = 'src/lib/regex-lab/interactive.ts';
const { compile, generatedPattern } = await fromSite(compilerModule);
const { runJavaScript } = await fromSite(engineModule);
const { defaultOptions } = await fromSite(optionsModule);
const packageRoot = 'node_modules/@strling-lang/strling';
const { loadBundledWasm } = await fromSite(`${packageRoot}/dist/node.js`);
const wasmDigest = sha(await readFile(resolve(site, packageRoot, 'dist/strling_interop.wasm')));
assert.equal(wasmDigest, '6a24a334d5d7e78b17c09e6d9a62d33299d65ac79e52212c4f8db130250656d7');
const compiler = await loadBundledWasm();

const authoring = [];
for (const { id, author } of forms) {
  const text = (value) => `text ${JSON.stringify(value)};`;
  const choice = `choice { ${author.choice.map(text).join(' ')} }`;
  const tasks = [
    [text(author.text), author.literal, false],
    [choice, author.extension, false],
    [`capture code { ${choice} }`, author.extension, true],
  ];
  const outcomes = [];
  for (const [rule, expected, expectsCapture] of tasks) {
    const source = `semantic strling 1.0;\ncase sensitive;\npattern ${rule}`;
    const compilation = compile(compiler, { source, format: 'semantic', target: 'ecmascript' });
    assert.equal(compilation.result?.outcome, 'succeeded');
    const generated = generatedPattern(compilation);
    assert.ok(generated);
    const run = author.subjects.map((subject) => runJavaScript(generated.pattern, subject, {
      ...defaultOptions, flags: generated.flags, operation: 'fullmatch',
    }));
    assert.ok(run.every((result) => ['matched', 'no-match'].includes(result.status)));
    assert.deepEqual(run.map(({ status }) => status === 'matched'), expected);
    const capture = run.map((result) => result.matches?.[0]?.captures.find(({ name }) => name === 'code')?.value ?? null);
    assert.deepEqual(capture, author.subjects.map((subject, index) => expected[index] && expectsCapture ? subject : null));
    outcomes.push({ matches: expected, capture });
  }
  authoring.push({ form: id, outcomes });
}

const pyodideRoot = resolve(site, 'node_modules/pyodide');
const { loadPyodide } = await fromSite('node_modules/pyodide/pyodide.mjs');
const runtime = await loadPyodide({ indexURL: pyodideRoot });
const python = JSON.parse(runtime.runPython(String.raw`
import json, re, sys
json.dumps({'version': '.'.join(map(str, sys.version_info[:3])), 'span': re.search(r'\B', '').span()})
`));
assert.ok(python.version.startsWith('3.14.'));
assert.deepEqual(python.span, [0, 0]);

const profiles = [];
for (const { id, profile } of forms) {
  runtime.globals.set('study_subject', profile.subject);
  const observed = JSON.parse(runtime.runPython(String.raw`
def first_span(flags):
    match = re.search(r'\d', study_subject, flags)
    return None if match is None else match.span()
json.dumps({'unicode': first_span(0), 'ascii': first_span(re.ASCII)})
`));
  const ecmascript = runJavaScript('\\d', profile.subject, { ...defaultOptions, flags: 'u', operation: 'scan' });
  assert.deepEqual(observed, { unicode: profile.pythonSpan, ascii: null });
  assert.equal(ecmascript.status, 'no-match');
  profiles.push({ form: id, pythonStringSpan: observed.unicode, pythonAsciiSpan: observed.ascii, ecmascript: ecmascript.status });
}

const adapters = Object.fromEntries(await Promise.all([compilerModule, engineModule, optionsModule].map(async (path) =>
  [path, sha((await readFile(resolve(site, path), 'utf8')).replace(/\r\n/g, '\n'))],
)));
console.log(JSON.stringify({
  kind: 'technical_stimulus_preflight', participants: 0,
  executionHost: { node: process.version, v8: process.versions.v8 },
  compilerWasmSha256: wasmDigest,
  pyodideWasmSha256: sha(await readFile(resolve(pyodideRoot, 'pyodide.asm.wasm'))),
  adapterFilesLfSha256: adapters,
  authoring,
  profiles,
  python,
}, null, 2));
