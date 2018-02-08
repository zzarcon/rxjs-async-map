import * as utils from './utils';

describe('utils', () => {
  describe('shiftWhile', () => {
    it('removes nothing from empty array when predicate returns false', () => {
      const data = new Array<{}>();

      expect(utils.shiftWhile(data, () => false)).toEqual([]);
      expect(data).toEqual([]);
    });

    it('removes nothing from empty array when predicate returns true', () => {
      const data = new Array<{}>();

      expect(utils.shiftWhile(data, () => true)).toEqual([]);
      expect(data).toEqual([]);
    });

    it('removes nothing from non-empty array when predicate returns false', () => {
      const data = [1, 2, 3, 4, 5, 6];

      expect(utils.shiftWhile(data, () => false)).toEqual([]);
      expect(data).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it('removes prefix while predicate returns true', () => {
      const data = [1, 2, 3, 4, 5, 6];

      expect(utils.shiftWhile(data, x => x < 4)).toEqual([1, 2, 3]);
      expect(data).toEqual([4, 5, 6]);
    });

    it('does not remove suffix when predicate returns true', () => {
      const data = [1, 2, 3, 4, 5, 6];

      expect(utils.shiftWhile(data, x => x > 4)).toEqual([]);
      expect(data).toEqual([1, 2, 3, 4, 5, 6]);
    });
  });
});
