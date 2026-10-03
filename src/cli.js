#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { diff } from './diff.js';

const [a, b, ...extra] = process.argv.slice(2);
if (!a || !b || extra.length) {
  console.error('Usage: json-diff <before.json> <after.json>');
  process.exitCode = 2;
} else {
  try {
    const [before, after] = await Promise.all([a, b].map(async path => JSON.parse(await readFile(path, 'utf8'))));
    const changes = diff(before, after);
    console.log(JSON.stringify(changes, null, 2));
    if (changes.length) process.exitCode = 1;
  } catch (error) {
    console.error(`Could not compare files: ${error.message}`);
    process.exitCode = 2;
  }
}
