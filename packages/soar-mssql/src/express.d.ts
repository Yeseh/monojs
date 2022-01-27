import { MSSQLAdapter } from './adapter';

declare global {
	namespace Express {
		export interface Request {
			adapter?: MSSQLAdapter;
		}
	}
}
