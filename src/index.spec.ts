import { Observable } from 'rxjs';

import { asyncMap } from './index';

describe('asyncMap', () => {
  it('returns empty observable for empty input', async () => {
    const project = jest.fn();
    const input = Observable.empty();
    const output = await input.pipe(asyncMap(project, 0)).toArray().toPromise();

    expect(output).toEqual([]);
  });

  it('calls project function in-order for all values in input', async () => {
    const project = jest.fn(x => Promise.resolve(x.length));
    const input = Observable.of('f', 'ba', 'baz');
    const output = await input.pipe(asyncMap(project, 1)).toArray().toPromise();

    expect(output).toEqual([1, 2, 3]);
    expect(project.mock.calls).toEqual([['f'], ['ba'], ['baz']]);
  });

  it('calls project function with the given concurrency', async () => {
    const invocations: {[v: string]: number} = {};
    const input = Observable.of('foo', 'bar', 'baz');
    const project = jest.fn(v => {
      invocations[v] = Date.now();

      return Observable.of().delay(10).toPromise();
    });
    await input.pipe(asyncMap(project, 2)).toArray().toPromise();

    expect(invocations['bar'] - invocations['foo']).toBeLessThan(5);
    expect(invocations['baz']).toBeGreaterThan(invocations['foo']);
    expect(invocations['baz']).toBeGreaterThan(invocations['bar']);
  });

  it('returns projected values in-order even if promises resolve out of order', async () => {
    const project = jest.fn(x => {
      if (x === 'foo') {
        return Observable.of(1).delay(20).toPromise();
      } else {
        return Observable.of(2).delay(10).toPromise();
      }
    });
    const input = Observable.of('foo', 'bar');
    const output = await input.pipe(asyncMap(project, 1)).toArray().toPromise();

    expect(output).toEqual([1, 2]);
  });
});
