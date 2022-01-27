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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Result = exports.handleAsync = exports.validArray = void 0;
const validArray = (arr) => Array.isArray(arr) && arr.length > 0;
exports.validArray = validArray;
const handleAsync = (fn) => (req, res, next) => {
    return Promise.resolve(fn(req, res, next))
        .catch(next);
};
exports.handleAsync = handleAsync;
class Result {
    constructor(promise) {
        this._prom = promise;
        this.resolved = false;
        this.value = null;
        this.error = null;
    }
    resolve() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.resolved)
                return this;
            this.value = yield this._prom
                .catch(e => this.error = e);
            this.resolved = true;
            return this;
        });
    }
    unwrap() {
        if (this.error !== null)
            throw this.error;
        return this.value;
    }
    unwrapMsSql() {
        let value = this.unwrap();
        let bResult = value !== null
            && Array.isArray(value.recordset);
        if (bResult)
            return value.recordset;
        return null;
    }
}
exports.Result = Result;
