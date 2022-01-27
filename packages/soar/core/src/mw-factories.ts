import { MSSQLAdapter } from './adapter';
import {
	Handler, Request, Response, NextFunction,
} from 'express';
import { handleAsync } from './utils';

export function buildInitRequest(adapter: MSSQLAdapter): Handler {
	return function(req: Request, _, next: NextFunction) {
		req.adapter = adapter;
		next();
	};
}

export function buildParseResponse(): Handler {
	return function(req: Request, res) {
		res.status(200).send(req.result);
	};
}

export function buildGetRoute(table: string, keyField = 'id'): Handler {
	return handleAsync(async (req: Request, _: Response, next: NextFunction) => {
		const key = req.query['key'] as string;

		const command = req.query['key']
			? req.adapter!.getByKey(table, key, keyField)
			: req.adapter!.getAll(table);

		const result = await command;

		if (result.error) {
			return next(result.error);
		}

		req.result = result.unwrapMsSql();

		next();
	});
}

