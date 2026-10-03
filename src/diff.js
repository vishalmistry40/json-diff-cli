// A small, predictable JSON diff. Arrays are treated as ordered values.
const own = (value, key) => Object.prototype.hasOwnProperty.call(value, key);
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const escape = key => key.replaceAll('~', '~0').replaceAll('/', '~1');

export function diff(before, after, path = '') {
  if (Object.is(before, after)) return [];
  if (object(before) && object(after)) {
    const changes = [];
    for (const key of Object.keys(before).sort()) {
      const at = `${path}/${escape(key)}`;
      if (!own(after, key)) changes.push({ op: 'remove', path: at, before: before[key] });
      else changes.push(...diff(before[key], after[key], at));
    }
    for (const key of Object.keys(after).sort()) {
      if (!own(before, key)) changes.push({ op: 'add', path: `${path}/${escape(key)}`, after: after[key] });
    }
    return changes;
  }
  if (Array.isArray(before) && Array.isArray(after)) {
    const changes = [];
    const shared = Math.min(before.length, after.length);
    for (let i = 0; i < shared; i++) changes.push(...diff(before[i], after[i], `${path}/${i}`));
    for (let i = before.length - 1; i >= after.length; i--) changes.push({ op: 'remove', path: `${path}/${i}`, before: before[i] });
    for (let i = shared; i < after.length; i++) changes.push({ op: 'add', path: `${path}/${i}`, after: after[i] });
    return changes;
  }
  return [{ op: 'replace', path, before, after }];
}
