import * as assert from 'assert';
import * as path from 'path';
import * as fs from 'fs';
import { StringStream, chunksToLinesAsync, asyncIterableToArray } from '../src';

test('Chunk iterable to lines', async () => {
  async function* createChunks() {
    yield 'line A\nline B\n';
  }
  const arr = await asyncIterableToArray(chunksToLinesAsync(createChunks()));
  assert.deepStrictEqual(arr, [
    'line A\n',
    'line B\n',
  ]);
});

test('String stream to lines', async () => {
  const stream: any = new StringStream('line A\nline B\n'); // temporary work-around
  const arr = await asyncIterableToArray(chunksToLinesAsync(stream));
  assert.deepStrictEqual(arr, [
    'line A\n',
    'line B\n',
  ]);
});

test('File stream to lines', async () => {
  const PATH = path.resolve(__dirname, '../../ts/test/test_file.txt');
  const stream:any = fs.createReadStream(PATH); // temporary work-around
  const arr = await asyncIterableToArray(chunksToLinesAsync(stream));
  assert.deepStrictEqual(arr, [
    'First line.\n',
    'Second line.\n',
  ]);
});
