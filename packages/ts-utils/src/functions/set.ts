export const set = <T, K extends keyof T>(obj: T, prop: K, value: T[K]): T[K] => {
	obj[prop] = value;
	return obj[prop];
};
