import { readFileSync } from 'node:fs';

const [formId, replayOption, ...extra] = process.argv.slice(2);
const fixtures = JSON.parse(readFileSync(new URL('fixtures.json', import.meta.url), 'utf8'));
const form = fixtures.forms.find(({ id }) => id === formId);
if (!form || extra.length || ![undefined, '--fresh-replay'].includes(replayOption)) {
  console.error('Usage: node participant-form.mjs A|B [--fresh-replay]');
  process.exit(2);
}

const { inherited, diagnosis, captures, replace, version, author, profile, replay } = form;
const tasks = [
  {
    task: 'T1',
    prompt: 'Describe which records the inherited pattern accepts. Identify the ID for each provided sample.',
    pattern: inherited.pattern,
    subjects: inherited.subjects,
  },
  {
    task: 'T2',
    prompt: 'The new plural row should pass while unrelated and prefixed rows still fail. Diagnose and change the pattern, check all rows, and say what your results establish.',
    pattern: diagnosis.pattern,
    subjects: diagnosis.subjects,
  },
  {
    task: 'T3',
    prompt: 'Make the rank group participate when the digit is missing. Preserve accepted subjects and compare before and after captures.',
    pattern: captures.before,
    subjects: captures.subjects,
  },
  {
    task: 'T4',
    prompt: 'Replace the marked amounts with a dollar sign followed by the captured number. Preserve leading zeroes and untouched text.',
    pattern: replace.pattern,
    subject: replace.subject,
  },
  {
    task: 'T5',
    prompt: 'Compare the recorded Python 3.13 result and the Python 3.14 evidence. State which runtime was observed and what the documentation establishes.',
    pattern: '\\B',
    subject: version.subject,
  },
  {
    task: 'T6',
    prompt: 'Write a case-sensitive full match for the first literal. Extend it to allow the alternate and preserve both negative cases. Capture the whole chosen value as code.',
    literal: author.text,
    alternate: author.choice[1],
    subjects: author.subjects,
  },
  {
    task: 'T7',
    prompt: 'The program searches for a decimal digit. Choose the runtime that matches Python Unicode-string defaults and compare it with Python ASCII mode and ECMAScript.',
    pattern: '\\d',
    subject: profile.subject,
  },
  {
    task: 'T8',
    prompt: replayOption
      ? 'Reopen the investigation and run Find first with the recorded settings. Did execution resume from the recorded cursor? Compare the redacted and altered-input versions.'
      : 'Save and reopen the investigation in the other Lab. Continue from the recorded cursor and compare the redacted and altered-input versions.',
    pattern: replay.literal,
    subject: replay.subject,
    recordedCursor: replay.startAt,
  },
];

console.log(JSON.stringify({ form: form.id, tasks }, null, 2));
