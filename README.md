# JSON diff CLI

A tiny Node CLI for comparing two JSON files. It emits a deterministic list of add, remove and replace operations with JSON Pointer paths. Arrays are ordered: changing a value at an index is a replacement rather than a move. No runtime dependencies.

```sh
node src/cli.js fixtures/before.json fixtures/after.json
npm test
```

Exit codes: 0 = identical, 1 = different, 2 = bad invocation or input. This is a diagnostic format, not RFC 6902 JSON Patch: `before` is included for inspection, and the root path is an empty string. Large arrays are diffed by index, not by longest common subsequence.
