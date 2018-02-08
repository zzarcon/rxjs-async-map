export const shiftWhile = <T>(values: Array<T>, predicate: (value: T) => boolean) => {
  const shifted = new Array<T>();

  while (values.length > 0 && predicate(values[0])) {
    shifted.push(values.shift());
  }

  return shifted;
};
