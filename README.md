# stringio: convert strings to Node.js streams and vice versa

```
npm install @rauschma/stringio
```

## Overview

See line A and line B:

```js
import * as assert from 'assert';
import { StringStream, readableToString } from '@rauschma/stringio';

test('From string to stream to string', async () => {
  const str = 'Hello!\nHow are you?\n';
  const stringStream = new StringStream(str); // (A)
  const result = await readableToString(stringStream); // (B)
  assert.strictEqual(result, str);
});
```

## `StringStream`: from string to stream

```typescript
declare class StringStream extends Readable {
  constructor(str: string);
}
```

Used in line A.

## `readableToString`: from stream to string

```typescript
declare function readableToString(readable: Readable, encoding?: string): Promise<string>;
```

Default encoding is `'utf-8'`.

Used in line B.

### Reading stdin into a string

```typescript
async function readStdin() {
  const str = await readableToString(process.stdin);
  console.log('STR: '+str);
}
```

## `chunksToLinesAsync`: async iterable over chunks to async iterable over lines

```typescript
declare function chunksToLinesAsync(chunks: AsyncIterable<String>): AsyncIterable<String>;
```

Example (starting with Node.js v.10, readable streams are asynchronous iterables):

```typescript
import * as fs from 'fs';
import { chunksToLinesAsync } from '@rauschma/stringio';

async function main() {
  const stream = fs.createReadStream(process.argv[2]);
  for await (const line of chunksToLinesAsync(stream)) {
    console.log(line);
  }
}
main();
```

## Related npm packages

* [`string-to-stream`](https://github.com/feross/string-to-stream): Convert a string into a stream.
* [`get-stream`](https://github.com/sindresorhus/get-stream): Get a stream as a string, buffer, or array.

## Acknowledgements

* Partially inspired by: https://github.com/feross/string-to-stream/blob/master/index.js