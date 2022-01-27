export const defaultEquals = <T>(a: T, b: T): boolean => a === b;

export type EqualsFunction<T> = (a: T, b: T) => boolean;
