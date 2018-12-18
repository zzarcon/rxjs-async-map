import { Observable, of, empty } from 'rxjs';
import {toArray,delay} from 'rxjs/operators';
import { asyncMap } from './index';

describe('asyncMap', () => {
  it('returns empty observable for empty input', async () => {
    const project = jest.fn();
    const input = empty();
    const output = await input.pipe(asyncMap(project, 0)).pipe(toArray()).toPromise();

    expect(output).toEqual([]);
  });

  it('calls project function in-order for all values in input', async () => {
    const project = jest.fn(x => Promise.resolve(x.length));
    const input = of('f', 'ba', 'baz');
    const output = await input.pipe(asyncMap(project, 1)).pipe(toArray()).toPromise();

    expect(output).toEqual([1, 2, 3]);
    expect(project.mock.calls).toEqual([['f'], ['ba'], ['baz']]);
  });

  it('calls project function with the given concurrency', async () => {
    const invocations: {[v: string]: number} = {};
    const input = of('foo', 'bar', 'baz');
    const project = jest.fn(v => {
      invocations[v] = Date.now();

      return of().pipe(delay(10)).toPromise();
    });
    await input.pipe(asyncMap(project, 2)).pipe(toArray()).toPromise();

    expect(invocations['bar'] - invocations['foo']).toBeLessThan(5);
    expect(invocations['baz']).toBeGreaterThan(invocations['foo']);
    expect(invocations['baz']).toBeGreaterThan(invocations['bar']);
  });

  it('returns projected values in-order even if promises resolve out of order', async () => {
    const project = jest.fn(x => {
      if (x === 'foo') {
        return of(1).pipe(delay(20)).toPromise();
      } else {
        return of(2).pipe(delay(10)).toPromise();
      }
    });
    const input = of('foo', 'bar');
    const output = await input.pipe(asyncMap(project, 1)).pipe(toArray()).toPromise();

    expect(output).toEqual([1, 2]);
  });
});
