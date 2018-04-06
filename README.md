# stringio: convert strings to Node.js streams and vice versa

```
npm install @rauschma/stringio
```

## Overview

See line A and line B:

```js
import * as assert from 'assert';
import { StringStream, readableToString } from 'stringio';

test('From string to stream to string', async () => {
  const str = 'Hello!\nHow are you?\n';
  const stringStream = new StringStream(str); // (A)
  const result = await readableToString(stringStream); // (B)
  assert.strictEqual(result, str);
});
```

## `stringio.StringStream`: from string to stream

```typescript
declare class StringStream extends Readable {
  constructor(str: string);
}
```

Used in line A.

## `stringio.readableToString`: from stream to string

```typescript
declare function readableToString(readable: Readable, encoding?: string): Promise<string>;
```

Default encoding is `'utf-8'`.

Used in line B.

## Related npm packages

* [`string-to-stream`](https://github.com/feross/string-to-stream): only converts in one direction, pre-ES6 code (which is a pro and a con).
* [`get-stream`](https://github.com/sindresorhus/get-stream): Get a stream as a string, buffer, or array.

## Acknowledgements

* Partially inspired by: https://github.com/feross/string-to-stream/blob/master/index.js