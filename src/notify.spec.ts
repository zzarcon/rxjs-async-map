import { Observable } from 'rxjs/Observable';
import { empty as emptyObserver } from 'rxjs/Observer';
import { expectToReject } from 'jasmine-promise-tools';

import { notify } from './notify';

describe('Notify', () => {
  it('calls onReady when wrapped promise resolves', async () => {
    const onReady = jest.fn(p => p.notifyIfReady());
    await new Observable<void>(sub => {
      notify(Promise.resolve(), sub, onReady);
    }).toPromise();

    expect(onReady).toHaveBeenCalledTimes(1);
  });

  it('calls onReady when wrapped promise rejects', async () => {
    const onReady = jest.fn(p => p.notifyIfReady());
    const promise = new Observable<void>(sub => {
      notify(Promise.reject('error'), sub, onReady);
    }).toPromise();
    const err = await expectToReject(promise);

    expect(err).toBe('error');
    expect(onReady).toHaveBeenCalledTimes(1);
  });

  it('signals non-readiness when the wrapped promise has not been resolved yet', () => {
    const onReady = jest.fn();
    const notifier = notify(Promise.reject('error'), emptyObserver, onReady);

    expect(notifier.notifyIfReady()).toBe(false);
  });
});
