import { MSSQLAdapter } from '../../mmsql/src/adapter';

declare global {
	namespace Express {
		export interface Request {
			adapter?: MSSQLAdapter;
		}
	}
}
