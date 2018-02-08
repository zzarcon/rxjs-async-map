import { Observable } from 'rxjs/Observable';
import { mergeMap } from 'rxjs/operators/mergeMap';

import { shiftWhile } from './utils';
import { Notify } from './notify';

const mapper = <T, U>(project: (value: T) => PromiseLike<U>) => {
  const notifiers = new Array<Notify<U>>();

  const onReady = () => shiftWhile(notifiers, notify => notify.notifyIfReady());

  return (value: T) => new Promise((resolve, reject) => {
    const notify = new Notify<U>(project(value), onReady);
    notify.setHandlers(resolve, reject);
    notifiers.push(notify);
  });
};

export { Observable };

export const asyncMap = <T, U>(
  project: (item: T) => PromiseLike<U>,
  concurrent: number
) => mergeMap(mapper(project), concurrent);
