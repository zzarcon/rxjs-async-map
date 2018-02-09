import { Observable } from 'rxjs/Observable';
import { mergeMap } from 'rxjs/operators/mergeMap';

import { shiftWhile } from './utils';
import { Notifier, notify } from './notify';

const mapper = <T, U>(project: (value: T) => PromiseLike<U>) => {
  const notifiers = new Array<Notifier>();

  const onReady = () => shiftWhile(notifiers, notifier => notifier.notifyIfReady());

  return (value: T) => new Observable<U>(sub => {
    notifiers.push(notify(project(value), onReady, sub));
  });
};

export { Observable };

export const asyncMap = <T, U>(
  project: (item: T) => PromiseLike<U>,
  concurrent: number
): (source: Observable<T>) => Observable<U> =>
  mergeMap(mapper(project), concurrent);
