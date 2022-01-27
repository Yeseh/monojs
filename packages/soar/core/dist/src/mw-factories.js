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
exports.buildGetRoute = exports.buildParseResponse = exports.buildInitRequest = void 0;
const utils_1 = require("./utils");
function buildInitRequest(adapter) {
    return function (req, _, next) {
        console.log('init request');
        req.adapter = adapter;
        next();
    };
}
exports.buildInitRequest = buildInitRequest;
function buildParseResponse() {
    return function (req, res) {
        console.log('parse response');
        res.status(200).send(req.result);
    };
}
exports.buildParseResponse = buildParseResponse;
function buildGetRoute(table, keyField = 'id') {
    return (0, utils_1.handleAsync)((req, _, next) => __awaiter(this, void 0, void 0, function* () {
        let key = req.query["key"];
        let command = req.query["key"]
            ? req.adapter.getByKey(table, key, keyField)
            : req.adapter.getAll(table);
        let result = yield command;
        if (result.error) {
            return next(result.error);
        }
        req.result = result.unwrapMsSql();
        next();
    }));
}
exports.buildGetRoute = buildGetRoute;
