export const get = <T, K extends keyof T>(obj: T, prop: K): T[K] => {
	return obj[prop];
};

export const getProperties = <T, K extends keyof T>(obj: T, ...props: K[]): Partial<T> => {
	return props.map((p) => obj[p])
	    .reduce((prev, next) => ({
			...prev,
			...next,
		}));
};
