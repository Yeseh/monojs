"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMssql = exports.MSSQLAdapter = void 0;
const mssql_1 = __importDefault(require("mssql"));
const utils_1 = require("./utils");
class MSSQLAdapter {
    constructor(connStr) {
        this._pool = undefined;
        this._connStr = connStr;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this._pool = yield mssql_1.default.connect(this._connStr);
        });
    }
    getAll(table) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this._buildSelect(table);
            let result = yield query.resolve();
            return result;
        });
    }
    getByKey(table, value, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this._buildSelect(table, { [key]: value });
            let result = yield query.resolve();
            return result;
        });
    }
    _checkPool() {
        if (this._pool !== null) {
            return this._pool;
        }
        throw new Error("Connection pool not instantiated.");
    }
    _buildSelect(table, filters, select, group) {
        let selectList = '*';
        let groupBy = '';
        let where = '';
        let request = this._checkPool().request();
        if (Array.isArray(select)) {
            selectList = select
                .map(this._quoteName)
                .join(',');
        }
        if (filters && Object.keys(filters)) {
            let [stmt, params] = this._buildSets(filters);
            for (let par of params) {
                request.input(par.name, par.value);
            }
            where = `WHERE ${stmt}`;
        }
        if (Array.isArray(group)) {
            let quotedGroup = group.map(this._quoteName);
            groupBy = `GROUP BY ${quotedGroup.join(',')}`;
        }
        let query = `SELECT ${selectList} FROM dbo.[${table}] ${where} ${groupBy}`;
        console.log(query);
        return new utils_1.Result(request.query(query));
    }
    _buildUpdate(table, idField, fields, output) {
        let idValue = fields[idField];
        let outputStmt = '';
        idValue = typeof idValue === 'string'
            ? `'${idValue}'`
            : idValue;
        let [sets, params] = this._buildSets(fields);
        if (Array.isArray(output)) {
            outputStmt = `OUTPUT ${output.map(o => `INSERTED.[${o}]`)
                .join(',')}`;
        }
        let request = this._checkPool().request();
        request.input('id', idValue);
        for (let par of params) {
            request.input(par.name, par.value);
        }
        let query = `UPDATE [${table}] SET ${sets} WHERE [${idField}] = @id ${outputStmt}`;
        return new utils_1.Result(request.query(query));
    }
    _quoteName(name) { return `[${name}}`; }
    _buildSets(setObj, paramPrefix = 'p') {
        let sets = [];
        let params = [];
        for (let key of Object.keys(setObj)) {
            let value = setObj[key];
            let type;
            switch (typeof value) {
                case 'number':
                    type = mssql_1.default.Decimal();
                    break;
                case 'string':
                    type = mssql_1.default.VarChar(value.length);
                    break;
                default:
                    throw new Error(`Unsupported value in where statement: ${key} = ${value} `);
            }
            let param = {
                name: `${paramPrefix}${params.length + 1}`,
                type,
                value
            };
            params.push(param);
            sets.push(`${key} = @${param.name} `);
        }
        return [sets.join(','), params];
    }
}
exports.MSSQLAdapter = MSSQLAdapter;
const useMssql = (connString) => new MSSQLAdapter(connString);
exports.useMssql = useMssql;
