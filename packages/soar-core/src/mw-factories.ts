import {
	Handler, Request, Response, NextFunction,
} from 'express';
import { handleAsync } from './utils';
import { IAdapter } from '.';
import { Result } from '@yeseh/result'

export function buildInitRequest(adapter: IAdapter): Handler {
	return handleAsync(async function(req: Request, _, next: NextFunction) {
		req.adapter = adapter;

		if (!req.adapter.initialized) {
			await req.adapter.init();
		}

		next();
	});
}

export function buildGetRoute(table: string, keyField = 'id'): Handler {
	return handleAsync(async (req: Request, _: Response, next: NextFunction) => {
		const key = req.query['key'] as string;

		if (!req.adapter) {
			req.result = Result.fromError(new Error("Adapter is not initialized"));
			return next();
		}

		const command = req.query['key']
			? req.adapter!.getByKey(table, key, keyField)
			: req.adapter!.getAll(table);

		req.result = await command;

		next();
	});
}

export function buildUnwrapResult(): Handler {
	return handleAsync(async (req: Request, res: Response, next: NextFunction) => {
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