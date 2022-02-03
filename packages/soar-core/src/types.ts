import { Result } from '@yeseh/result';

export interface IAdapter<E = Error> {
    initialized: boolean;
    init: () => Promise<void>;
    getAll: <T>(collection: string) => Promise<Result<T[] | null, E | null>>;
    getByKey: <T extends Record<string, any>, K extends string>(collection: string, value: T[K], key: K) => Promise<Result<T | null, E | null>>;
}

