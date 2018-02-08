import { expectToReject } from 'jasmine-promise-tools';

import { NotifyPromise } from './notify';

describe('NotifyPromise', () => {
  it('calls onReady when wrapped promise resolves', async () => {
    const onReady = jest.fn((notify: NotifyPromise<void>) => notify.notify());
    const notify = new NotifyPromise(Promise.resolve(), onReady);
    await notify.promise();

    expect(onReady).toHaveBeenCalledTimes(1);
    expect(notify.isReady()).toBe(true);
  });

  it('calls onReady when wrapped promise rejects', async () => {
    const onReady = jest.fn((notify: NotifyPromise<void>) => notify.notify());
    const notify = new NotifyPromise(Promise.reject('error'), onReady);
    const err = await expectToReject(notify.promise());

    expect(err).toBe('error');
    expect(notify.isReady()).toBe(true);
  });

  it('signals non-readiness when the wrapped promise has not been resolved yet', () => {
    const onReady = jest.fn();
    const notify = new NotifyPromise(Promise.reject('error'), onReady);

    expect(notify.isReady()).toBe(false);
  });

  it('throws when attempting to notify while the wrapped promise has not been resolved yet', () => {
    const onReady = jest.fn();
    const notify = new NotifyPromise(Promise.reject('error'), onReady);

    expect(() => notify.notify()).toThrow(/attempted to notify non-ready promise/);
  });
});
