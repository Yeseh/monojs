/**
 * Finds the first non-nullish value in the argument list
 */
export function coalesce<T>(...args: Array<T>): T
export function coalesce(...args: Array<unknown>): unknown {
	for (let i = 0, n = args.length; i < n; i++) {
		if (args[i] !== null && args[i] !== undefined) {
			return args[i];
		};
	}

	return null;
}

