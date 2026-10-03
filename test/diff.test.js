import { test } from 'node:test';
import { deepStrictEqual as eq } from 'node:assert';
import { diff } from '../src/diff.js';

test('nested objects, escaped JSON pointer and stable order', () => {
  eq(diff({ 'a/b': { x: 1 }, old: true }, { 'a/b': { x: 2 }, new: null }), [
    { op: 'replace', path: '/a~1b/x', before: 1, after: 2 },
    { op: 'remove', path: '/old', before: true },
    { op: 'add', path: '/new', after: null }
  ]);
});
test('ordered arrays remove backwards, append forwards', () => {
  eq(diff([1, 2, 3], [1]), [
    { op: 'remove', path: '/2', before: 3 },
    { op: 'remove', path: '/1', before: 2 }
  ]);
  eq(diff([1], [1, 2]), [{ op: 'add', path: '/1', after: 2 }]);
});
test('primitive/type change and no change', () => {
  eq(diff(1, '1'), [{ op: 'replace', path: '', before: 1, after: '1' }]);
  eq(diff({ a: [1] }, { a: [1] }), []);
});
