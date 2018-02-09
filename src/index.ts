import { Observable } from 'rxjs/Observable';
import { mergeMap } from 'rxjs/operators/mergeMap';

import { Notifier, notify } from './notify';

const mapper = <T, U>(project: (value: T) => PromiseLike<U>) => {
  const notifiers = new Array<Notifier>();

  return (value: T) => new Observable<U>(sub => {
    notifiers.push(notify(project(value), sub, () => {
      // find the first non-ready notifier in the queue,
      // while invoking all ready notifiers that we encounter along the way
      const notReadyIdx = notifiers.findIndex(notifier => !notifier.notifyIfReady());
      if (notReadyIdx > 0) {
        // remove all ready notifiers we found, after the notifications have been sent
        notifiers.splice(0, notReadyIdx);
      }
    }));
  });
};

export { Observable };

export const asyncMap = <T, U>(
  project: (item: T) => PromiseLike<U>,
  concurrent: number
): (source: Observable<T>) => Observable<U> =>
  mergeMap(mapper(project), concurrent);
