export class NotifyPromise<T> {
  private _resolve: (item: T) => void;
  private _reject: (reason: Error) => void;

  private _isFulfilled = false;
  private _value?: T;
  private _isRejected = false;
  private _reason?: Error;

  private _promise: Promise<T>;

  constructor(promise: PromiseLike<T>, onReady: (notify: NotifyPromise<T>) => void) {
    this._promise = new Promise((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;

      promise.then(
        value => {
          this._isFulfilled = true;
          this._value = value;
          onReady(this);
        },
        reason => {
          this._isRejected = true;
          this._reason = reason;
          onReady(this);
        }
      );
    });
  }

  isReady() {
    return this._isFulfilled || this._isRejected;
  }

  notify() {
    if (this._isFulfilled) {
      this._resolve(this._value);
    } else if (this._isRejected) {
      this._reject(this._reason);
    } else {
      throw new Error('attempted to notify non-ready promise');
    }
  }

  promise(): Promise<T> {
    return this._promise;
  }
}
