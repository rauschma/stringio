import * as assert from 'assert';
import { chomp } from '../src';

test('chomp', () => {
  assert.strictEqual(chomp('abc'), 'abc');
  assert.strictEqual(chomp('abc\n'), 'abc');
  assert.strictEqual(chomp('abc\r\n'), 'abc');
  assert.strictEqual(chomp(''), '');
});