import {
	Request, Response, NextFunction, Handler,
} from 'express';
import { IResult, IRecordSet } from 'mssql';

export const validArray = (arr: any): boolean => Array.isArray(arr) && arr.length > 0;

export const unwrapResult =
	(fn: Handler) => (req: Request, res: Response, next: NextFunction): Promise<any> => {
		return Promise.resolve(fn(req, res, next))
			.catch(next);
	};

export const nonEmptyArray = (obj: any): boolean => Array.isArray(obj) && obj.length > 0;
