export class Notify<T> {
  private _resolve: (item: T) => void;
  private _reject: (reason: Error) => void;

  private _isFulfilled = false;
  private _value?: T;
  private _isRejected = false;
  private _reason?: Error;

  constructor(promise: PromiseLike<T>, onReady: (notify: Notify<T>) => void) {
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
  }

  setHandlers(resolve: (item: T) => void, reject: (reason: Error) => void) {
    this._resolve = resolve;
    this._reject = reject;
  }

  notifyIfReady() {
    if (this._isFulfilled) {
      this._resolve(this._value);

      return true;
    } else if (this._isRejected) {
      this._reject(this._reason);

      return true;
    } else {
      return false;
    }
  }
}
