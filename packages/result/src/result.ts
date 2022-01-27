export type Option<T, E> = T | E;

export class Result {
	_prom?: Promise<unknown>;
	resolved: boolean;
	value: Option<unknown, null>;
	error: Option<Error, null>;

	constructor(promise?: Promise<any>) {
		this._prom = promise;
		this.resolved = false;
		this.value = null;
		this.error = null;
	}

	static error(msg?: string): Result {
		var result = new Result();
		result.error = new Error(msg);
		return new Result()
	}

	async resolve(): Promise<void> {
		if (this.resolved) {
			return;
		}

		if (this._prom) {
			this._prom
				.then(v => this.value = v)
				.catch((e) => this.error = e);
		}

		this.resolved = true;
	}

	async unwrap(): Promise<Option<unknown, Error>> {
		if (this.error) {
			return this.error;
		}

		if (!this.resolved) {
			await this.resolve()

			if (this.error) {
				return this.error;
			}
		};

		return this.value as unknown;
	}
}

export class TResult<T> extends Result {
	constructor(promise?: Promise<any>) {
		super(promise);
	}

	async resolve(): Promise<void> {
		return super.resolve();
	}

	async unwrap(): Promise<Option<T, Error>> {
		return super.unwrap() as Promise<Option<T, Error>>;
	}
}
