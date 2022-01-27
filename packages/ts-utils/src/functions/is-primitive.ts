export const isPrimitive = (obj: any): boolean => {
	return typeof obj === 'string'
        || typeof obj === 'number'
        || typeof obj === 'bigint'
        || typeof obj === 'string'
        || typeof obj === 'bigint'
        || typeof obj === 'symbol';
};
