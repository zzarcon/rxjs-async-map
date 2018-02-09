import { Observable } from 'rxjs/Observable';
import { expectToReject } from 'jasmine-promise-tools';

import { Notify } from './notify';

describe('Notify', () => {
  it('calls onReady when wrapped promise resolves', async () => {
    const onReady = jest.fn(p => p.notifyIfReady());
    const notify = new Notify(Promise.resolve(), onReady);
    await new Observable<void>(sub => notify.setSubscriber(sub)).toPromise();

    expect(onReady).toHaveBeenCalledTimes(1);
  });

  it('calls onReady when wrapped promise rejects', async () => {
    const onReady = jest.fn(p => p.notifyIfReady());
    const notify = new Notify(Promise.reject('error'), onReady);
    const promise = new Observable(sub => notify.setSubscriber(sub)).toPromise();
    const err = await expectToReject(promise);

    expect(err).toBe('error');
    expect(onReady).toHaveBeenCalledTimes(1);
  });

  it('signals non-readiness when the wrapped promise has not been resolved yet', () => {
    const onReady = jest.fn();
    const notify = new Notify(Promise.reject('error'), onReady);

    expect(notify.notifyIfReady()).toBe(false);
  });
});
