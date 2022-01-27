export type Option<T> = T | null;

export class Result {
	_prom?: Promise<unknown>;
	resolved: boolean;
	value: Option<unknown>;
	error: Option<Error>;

	constructor(promise?: Promise<any>) {
		this._prom = promise;
		this.resolved = false;
		this.value = null;
		this.error = null;
	}

	async resolve(): Promise<Result> {
		if (this.resolved) {
			return this;
		}

		if (this._prom) {
			this.value = await this._prom
				.catch((e) => this.error = e);
		}

		this.resolved = true;

		return this;
	}

	unwrap<T>(): Option<T> {
		if (!this.resolved) {
			throw new Error('Unresolved result.');
		};
		if (this.error !== null) {
			throw this.error;
		}
		return this.value as Option<T>;
	}
}


export class TResult<T> extends Result {
	constructor(promise?: Promise<any>) {
		super(promise);
	}

	async resolve(): Promise<TResult<T>> {
		return super.resolve();
	}

	unwrap<T>(): Option<T> {
		return super.unwrap();
	}
}
