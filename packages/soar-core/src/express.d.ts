import { IAdapter } from './types';
import { Result } from '@yeseh/result';

declare global {
	namespace Express {
		export interface Request {
			result?: Result<unknown>;
			adapter?: IAdapter
		}
	}
}
