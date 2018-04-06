import * as assert from 'assert';
import * as path from 'path';
import * as fs from 'fs';
import { StringStream, readableToString } from '../src';

test('From string to stream to string', async () => {
  const str = 'Hello!\nHow are you?\n';
  const stringStream = new StringStream(str);
  const result = await readableToString(stringStream);
  assert.strictEqual(result, str);
});

test('File stream stream to string', async () => {
  const PATH = path.resolve(__dirname, '../../ts/test/index_test_file.txt');
  const stream = fs.createReadStream(PATH);
  const str = await readableToString(stream);
  assert.strictEqual(str.trim(), 'This is a test!');
});

/*
async function mainTest() {
  const str = await readableToString();
  console.log('STR: '+str);
}
async function mainStdin() {
  const str = await readableToString(process.stdin);
  console.log('STR: '+str);
}
*/
