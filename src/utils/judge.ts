export const isUndefined = (value: unknown): value is undefined =>
  typeof value === "undefined";
export const isNull = (value: unknown): value is null => value === null;

export const isFalsy = (value: unknown): value is null | undefined =>
  isUndefined(value) || isNull(value);
export const isTruthy = <T>(value?: T): value is T & {} => !isFalsy(value);
