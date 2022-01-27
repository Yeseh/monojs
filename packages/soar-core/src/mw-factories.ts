import {
	Handler, Request, Response, NextFunction,
} from 'express';
import { handleAsync as unwrapResult } from './utils';
import { IAdapter } from '.';
import { Result } from '@yeseh/result'

export function buildInitRequest(adapter: IAdapter): Handler {
	return function(req: Request, _, next: NextFunction) {
		req.adapter = adapter;
		next();
	};
}

export function buildUnwrapResult(): Handler {
	return unwrapResult(async (req: Request, res: Response, next: NextFunction) => {
		if (!req.result) { 
			return next(new Error("Undefined result")); 
		}

		let value = await req.result.unwrap();

		if (value instanceof Error) { 
			return next(value); 
		}
		
		res.status(200).send(value);
	});
}


export function buildGetRoute(table: string, keyField = 'id'): Handler {
	return unwrapResult(async (req: Request, _: Response, next: NextFunction) => {
		const key = req.query['key'] as string;

		if (!req.adapter) {
			req.result = Result.error("Adapter is not initialized");
			next();
		}
		else {
			const command = req.query['key']
				? req.adapter!.getByKey(table, key, keyField)
				: req.adapter!.getAll(table);

			req.result = await command;
		}

		next();
	});
}

