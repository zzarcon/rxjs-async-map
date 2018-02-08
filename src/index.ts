import { Observable } from 'rxjs/Observable';
import { mergeMap } from 'rxjs/operators/mergeMap';

import { shiftWhile } from './utils';
import { NotifyPromise } from './notify';

const mapper = <T, U>(project: (value: T) => PromiseLike<U>) => {
  const promises = new Array<NotifyPromise<U>>();

  const onReady = () =>
    shiftWhile(promises, p => p.isReady()).forEach(p => p.notify());

  return (value: T) => {
    const notify = new NotifyPromise(project(value), onReady);
    promises.push(notify);
    return notify.promise();
  };
};

export { Observable };

export const asyncMap = <T, U>(
  project: (item: T) => PromiseLike<U>,
  concurrent: number
) => mergeMap(mapper(project), concurrent);
