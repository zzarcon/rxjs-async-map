import { Observable } from 'rxjs/Observable';
import { mergeMap } from 'rxjs/operators/mergeMap';

import { Notifier, notify } from './notify';

const mapper = <T, U>(project: (value: T) => PromiseLike<U>) => {
  const notifiers = new Array<Notifier>();

  return (value: T) => new Observable<U>(sub => {
    notifiers.push(notify(project(value), sub, () => {
      // notify all notifiers which are ready at the start of the queue
      while (notifiers.length > 0 && notifiers[0].notifyIfReady()) {
        // remove notifier after notification has been sent
        notifiers.shift();
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
