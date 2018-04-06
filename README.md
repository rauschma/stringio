# stringio: convert strings to Node.js streams and vice versa

Overview (see line A and line B):

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