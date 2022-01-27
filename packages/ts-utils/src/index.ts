export type {
	StringIndexable, NumberIndexable, Constructor, SubType, MethodsOfObject,
} from './types/utility-types';
export type { EqualsFunction } from './functions/equals';
export type { IObservable, IObserver } from './patterns/observer';

export { coalesce } from './functions/coalesce';
export { defaultEquals } from './functions/equals';
export { get, getProperties } from './functions/get';
export { set } from './functions/set';
export { ifThenElse } from './functions/if-then-else';
export { isPrimitive } from './functions/is-primitive';
