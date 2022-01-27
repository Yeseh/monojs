import { Result } from '@yeseh/result';

export interface IAdapter {
    init: () => Promise<void>;
    getAll: (collection: string) => Promise<Result>;
    getByKey: (collection: string, value: string, key: string) => Promise<Result>;
}
