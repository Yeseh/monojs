import {
	Router as ExRouter,
	Handler,
} from 'express';

type RouteType = 'get' | 'update' | 'create' | 'delete';

export interface RouterOptions {
	path: string;
	routes: RouteType[];
}

export class Router {
	chain: Handler[];
	isBuilt: boolean;
	path: string;

	private _router: ExRouter;

	constructor(opts: RouterOptions) {
		this.chain = [];
		this._router = ExRouter();
		this.isBuilt = false;
		this.path = opts.path;
	}

	use(toUse: Handler) {
		this.chain.push(toUse);
	}

	build() {
		if (this.isBuilt) {
			return this._router;
		}

		for (const h of this.chain) {
			this._router.use(h);
		}

		this.isBuilt = true;

		return this._router;
	}
}
