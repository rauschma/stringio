import { Readable, Writable } from 'stream';
import { WriteStream } from 'fs';
import { EventEmitter } from 'events';

//---------- string -> stream

export class StringStream extends Readable {
  private _done: boolean;
  private _str: string;
  constructor(str: string) {
    super();
    this._str = str;
    this._done = false;
  }
  _read() {
    if (!this._done) {
      this._done = true;
      this.push(this._str);
      this.push(null);
    }
  }
}

//---------- stream -> string

export function readableToString(readable: Readable, encoding='utf8'): Promise<string> {
  return new Promise((resolve, reject) => {
    readable.setEncoding(encoding);
    let data = '';
    readable.on('data', function (chunk) {
      data += chunk;
    });
    readable.on('end', function () {
      resolve(data);
    });
    readable.on('error', function (err) {
      reject(err);
    });
  });
}

//---------- async tools

/**
 * Parameter: async iterable of chunks (strings)
 * Result: async iterable of lines (incl. newlines)
 */
export async function* chunksToLinesAsync(chunks: AsyncIterable<string>): AsyncIterable<string> {
  if (! Symbol.asyncIterator) {
    throw new Error('Current JavaScript engine does not support asynchronous iterables');
  }
  if (! (Symbol.asyncIterator in chunks)) {
    throw new Error('Parameter is not an asynchronous iterable');
  }
  let previous = '';
  for await (const chunk of chunks) {
    previous += chunk;
    let eolIndex;
    while ((eolIndex = previous.indexOf('\n')) >= 0) {
      // line includes the EOL
      const line = previous.slice(0, eolIndex+1);
      yield line;
      previous = previous.slice(eolIndex+1);
    }
  }
  if (previous.length > 0) {
    yield previous;
  }
}

export async function asyncIterableToArray<T>(asyncIterable: AsyncIterable<T>): Promise<Array<T>> {
  const result = new Array<T>();
  for await (const elem of asyncIterable) {
    result.push(elem);
  }
  return result;
}

//---------- string tools

const RE_NEWLINE = /\r?\n$/u;
export function chomp(line: string): string {
  const match = RE_NEWLINE.exec(line);
  if (! match) return line;
  return line.slice(0, match.index);
}

//---------- Promisified writing to streams

/**
 * Usage:
 * <pre>
 * await streamWrite(someStream, 'abc');
 * await streamWrite(someStream, 'def');
 * await streamEnd(someStream);
 * </pre>
 * 
 * @see https://nodejs.org/dist/latest-v10.x/docs/api/stream.html#stream_writable_write_chunk_encoding_callback
 */
export function streamWrite(stream: Writable, chunk: string|Buffer|Uint8Array, encoding = 'utf8'): Promise<void> {
  return streamPromiseHelper(stream,
    callback => stream.write(chunk, encoding, callback));
}

export function streamEnd(stream: Writable): Promise<void> {
  return streamPromiseHelper(stream,
    callback => stream.end(callback));
}

function streamPromiseHelper(emitter: EventEmitter, operation: ((callback: () => void) => void)): Promise<void> {
  return new Promise((resolve, reject) => {
    const errListener = (err: Error) => {
      emitter.removeListener('error', errListener);
      reject(err);
    };
    emitter.addListener('error', errListener);
    const callback = () => {
      emitter.removeListener('error', errListener);
      resolve(undefined);
    };
    operation(callback);
  });
}
