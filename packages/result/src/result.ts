export type Option<T, E> = T | E;

export class Result<T> {
	_prom?: Promise<T>;
	resolved: boolean;
	value: Option<T, null>;
	error: Option<Error, null>;

	constructor(promise?: Promise<T>) {
		this._prom = promise;
		this.resolved = false;
		this.value = null;
		this.error = null;
	}

	static error(msg?: string): Result<void> {
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

	async unwrap(): Promise<Option<T, Error>> {
		if (this.error) {
			return this.error;
		}

		if (!this.resolved) {
			await this.resolve()

			if (this.error) {
				return this.error;
			}
		};

		return this.value as T;
	}
}
