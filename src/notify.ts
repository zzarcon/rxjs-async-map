import { Observer } from 'rxjs/Observer';

export interface Notifier {
  notifyIfReady(): boolean;
}

export const notify = <T>(
  promise: PromiseLike<T>,
  observer: Observer<T>,
  onReady: (notifier: Notifier) => void
): Notifier => {
  const notifier = {
    notifyIfReady: () => false
  };

  promise.then(
    value => {
      notifier.notifyIfReady = () => {
        observer.next(value);
        observer.complete();

        return true;
      };
      onReady(notifier);
    },
    reason => {
      notifier.notifyIfReady = () => {
        observer.error(reason);

        return true;
      };
      onReady(notifier);
    }
  );

  return notifier;
};
