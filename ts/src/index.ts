import { Readable } from 'stream';

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
