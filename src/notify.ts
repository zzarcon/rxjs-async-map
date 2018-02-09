import { Subscriber } from 'rxjs/Subscriber';

export class Notify<T> {
  private _sub: Subscriber<T>;

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

  setSubscriber(sub: Subscriber<T>) {
    this._sub = sub;
  }

  notifyIfReady() {
    if (this._isFulfilled) {
      this._sub.next(this._value);
      this._sub.complete();

      return true;
    } else if (this._isRejected) {
      this._sub.error(this._reason);

      return true;
    } else {
      return false;
    }
  }
}
