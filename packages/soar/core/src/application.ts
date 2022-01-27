import { MSSQLAdapter } from './adapter';
import express, { Handler, Router } from 'express';
import {
	buildInitRequest, buildGetRoute, buildParseResponse,
} from './mw-factories';

interface IAuthenticator {
	authenticate: () => Handler;
}

export interface RouterOptions {
	name: string;
	table: string;
	idField?: string;
	authenticator?: IAuthenticator;
}

class Application {
	_adapter: MSSQLAdapter
	_app: express.Application
	initRequestMw?: Handler = undefined;

	constructor(adapter: MSSQLAdapter) {
		this._adapter = adapter;
		this._app = express();
		this.initRequestMw = buildInitRequest(this._adapter);
	}

	async start(port: number): Promise<void> {
		await this._adapter.init();
		this._app.listen(port,
			() => console.log('Induct app started on port ' + port)
		);
	}

	router(opts: RouterOptions): void {
		const router = Router();
		const initRequest = buildInitRequest(this._adapter);
		const chain: Handler[] = [initRequest];

		if (opts.authenticator) {
			chain.push(opts.authenticator.authenticate);
		}

		this.getRoute(router, opts.table, chain);
		this._app.use(`/${opts.name}`, router);
	}

	getRoute(router: Router, table: string, baseChain: Handler[]): void {
		baseChain.push(buildGetRoute(table));
		baseChain.push(buildParseResponse());
		router.get(`/`, baseChain);
	}
}

export const createApp = (adapter: MSSQLAdapter): Application => new Application(adapter);
