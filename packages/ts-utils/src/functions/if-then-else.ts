export function ifThenElse<T, F>(cond: boolean, then: T, el: F): T | F
export function ifThenElse(cond: boolean, then: unknown, el: unknown): unknown {
	return cond ? then : el;
}

