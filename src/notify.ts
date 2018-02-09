import { Observer } from 'rxjs/Observer';

export interface Notifier {
  notifyIfReady(): boolean;
}

export const notify = <T>(
  promise: PromiseLike<T>,
  onReady: (notifier: Notifier) => void,
  observer: Observer<T>
): Notifier => {
  let isFulfilled = false;
  let value: T;
  let isRejected = false;
  let reason: Error;

  const notifier = {
    notifyIfReady() {
      if (isFulfilled) {
        observer.next(value);
        observer.complete();

        return true;
      } else if (isRejected) {
        observer.error(reason);

        return true;
      } else {
        return false;
      }
    }
  };

  promise.then(
    resolveValue => {
      isFulfilled = true;
      value = resolveValue;
      onReady(notifier);
    },
    rejectionReason => {
      isRejected = true;
      reason = rejectionReason;
      onReady(notifier);
    }
  );

  return notifier;
};
