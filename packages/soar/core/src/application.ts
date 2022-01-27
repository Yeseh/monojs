import { IAdapter } from './types' 
import express, { Handler, Router } from 'express';
import {
	buildInitRequest, buildGetRoute, buildParseResponse,
} from './mw-factories';
import { PathLike } from 'fs';

export interface IAuthenticator {
	authenticate: () => Handler;
}

export interface ApplicationOpts {
	initRequestMw: Handler;
	autoloadFolder: string;
}

export interface RouterOptions {
	name: string;
	table: string;
	idField?: string;
	authenticator?: IAuthenticator;
}

export class Application {
	_adapter: IAdapter 
	_app: express.Application
	autoloadLocation: PathLike;
	initRequestMw?: Handler = undefined;

	constructor(adapter: IAdapter, opts: ApplicationOpts) {
		this._adapter = adapter;
		this._app = express();
		this.initRequestMw = opts.initRequestMw ?? buildInitRequest(this._adapter);
		this.autoloadLocation = opts.autoloadFolder;
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

export function createApp(adapter: IAdapter, opts: ApplicationOpts): Application {
	return new Application(adapter, opts);
} 
