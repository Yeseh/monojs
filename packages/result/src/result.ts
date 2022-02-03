export type Option<T, E> = T | E;
type Nullable<T> = Option<T, null>

export class Result<T, E = Nullable<Error>> {
	_prom?: Promise<T>;
	resolved: boolean;
	value: Option<T, null>;
	error: Option<E, null>;

	constructor(promise?: Promise<T>) {
		this._prom = promise;
		this.resolved = false;
		this.value = null;
		this.error = null;
	}

	public static fromError<E extends Error>(err: E): Result<null> {
		var result = new Result<null, E>();
		result.error = err; 
		result.value = null;
		result.resolved = true;
		return result;
	}

	public static fromValue<T>(value: T): Result<T> {
		var result = new Result<T>();
		result.error = null; 
		result.value = value;
		result.resolved = true;
		return result;
	}

	async resolve(): Promise<void> {
		if (this.resolved) {
			return;
		}

		if (this._prom) {
			try {
				this.value = await this._prom;
			}
			catch(e) {
				this.error = e as E;
			}
		}

		this.resolved = true;
	}

	async unwrap(): Promise<Option<T, E>> {
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
