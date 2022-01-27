export type Option<T> = T | null

export class Result<T> {
	_prom: Promise<unknown>;
	resolved: boolean;
	value: Option<unknown>;
	error: Option<Error>;

	constructor(promise: Promise<any>) {
		this._prom = promise;
		this.resolved = false;
		this.value = null;
		this.error = null;
	}

	async resolve(): Promise<Result<T>> {
		if (this.resolved) {
			return this;
		}

		this.value = await this._prom
			.catch((e) => this.error = e);

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
