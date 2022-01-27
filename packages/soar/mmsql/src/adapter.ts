import { warn } from 'console';
import mssql, { IRecordSet } from 'mssql';
import { Result, Option } from '@yeseh/result';
import { IAdapter } from '@yeseh/soar-core';

export type QueryResult<T> = Promise<Option<IRecordSet<T>>>

export class MSSQLAdapter implements IAdapter {
	_connStr: string;
	_pool?: mssql.ConnectionPool = undefined;

	constructor(connStr: string) {
		this._connStr = connStr;
	}

	async init() {
		this._pool = await mssql.connect(this._connStr);
	}

	async getAll(table: string): Promise<Result> {
		const query = this._buildSelect(table);
		const result = await query.resolve();
		return result;
	}

	async getByKey(
		table: string,
		value: string,
		key: string
	): Promise<Result> {
		const query = this._buildSelect(table, { [key]: value });
		const result = await query.resolve();
		return result;
	}

	_checkPool() {
		if (this._pool !== null) {
			return this._pool;
		}
		throw new Error('Connection pool not instantiated.');
	}

	_buildSelect(
		table: string,
		filters?: Record<string, string | number>,
		select?: string[],
		group?: string[]
	) {
		let selectList = '*';
		let groupBy = '';
		let where = '';
		const request = this._checkPool()!.request();

		if (Array.isArray(select)) {
			selectList = select
				.map(this._quoteName)
				.join(',');
		}

		if (filters && Object.keys(filters)) {
			const [stmt, params] = this._buildSets(filters);

			for (const par of params) {
				request.input(par.name, par.value);
			}

			where = `WHERE ${stmt}`;
		}

		if (Array.isArray(group)) {
			const quotedGroup = group.map(this._quoteName);
			groupBy = `GROUP BY ${quotedGroup.join(',')}`;
		}

		const query = `SELECT ${selectList} FROM dbo.[${table}] ${where} ${groupBy}`;
		console.log(query);

		return new Result(request.query(query));
	}

	_buildDelete(
		table: string,
		idField: string,
		fields: Record<string, string | number>,
	) {
		const idValue = fields[idField];

		const request = this._checkPool()!.request();
		request.input('id', idValue);

		const query = `DELETE [${table}] WHERE [${idField}] = @id`;

		return new Result(request.query(query));
	}

	_buildInsert(
		tableName: string,
		value: Record<string, string | number>[]
	) {
		const keys = Object.keys(value[0])
			.map(this._quoteName)
			.join(',');

		let stmt = `INSERT INTO [${tableName} (${keys}) VALUES `;
		const rows = [];
		const params = [];
		const pcount = 0;

		for (const item of value) {
			let row = '(';
			const values = [];

			for (const key of Object.keys(item)) {
				const value = item[key];
				const name = `p${pcount}`;

				rows.push(``);
				values.push(name);
				params.push({
					name,
					value,
				});
			}

			row += values.join(',') + ')';
			rows.push(row);
		}

		const request = this._checkPool()!.request();
		for (const par of params) {
			request.input(par.name, par.value);
		}

		stmt += rows.join(',');

		return new Result(request.query(stmt));
	}

	_buildUpdate(
		table: string,
		idField: string,
		fields: Record<string, string | number>
	) {
		const idValue = fields[idField];
		const [sets, params] = this._buildSets(fields);
		const request = this._checkPool()!.request();

		request.input('id', idValue);
		for (const par of params) {
			request.input(par.name, par.value);
		}

		const query = `UPDATE [${table}] SET ${sets} WHERE [${idField}] = @id`;

		return new Result(request.query(query));
	}

	_quoteName(name: string) {
		return `[${name}}`;
	}

	_buildSets(setObj: Record<string, string | number>, paramPrefix = 'p') {
		const sets = [];
		const params = [];

		for (const key of Object.keys(setObj)) {
			const value = setObj[key];
			let type;
			switch (typeof value) {
			case 'number':
				type = mssql.Decimal();
				break;
			case 'string':
				type = mssql.VarChar(value.length);
				break;
			default:
				throw new Error(`Unsupported value in where statement: ${key} = ${value} `);
			}

			const param: any = {
				name: `${paramPrefix}${params.length + 1}`,
				type,
				value,
			};

			params.push(param);
			sets.push(`${key} = @${param.name} `);
		}

		return [sets.join(','), params];
	}
}

export const useMssql = (connString: string) => new MSSQLAdapter(connString);
