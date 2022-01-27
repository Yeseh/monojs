import { IAdapter } from './types';

declare global {
	namespace Express {
		export interface Request {
			result?: any;
			adapter?: IAdapter
		}
	}
}
