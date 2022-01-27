"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.createApp = void 0;
const express_1 = __importStar(require("express"));
const mw_factories_1 = require("./mw-factories");
class Application {
    constructor(adapter) {
        this.initRequestMw = undefined;
        this._adapter = adapter;
        this._app = (0, express_1.default)();
        this.initRequestMw = (0, mw_factories_1.buildInitRequest)(this._adapter);
    }
    start(port) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._adapter.init();
            this._app.listen(port, () => console.log("Induct app started on port " + port));
        });
    }
    router(opts) {
        const router = (0, express_1.Router)();
        const initRequest = (0, mw_factories_1.buildInitRequest)(this._adapter);
        const chain = [initRequest];
        if (opts.authenticator) {
            chain.push(opts.authenticator.authenticate);
        }
        this.getRoute(router, opts.table, chain);
        this._app.use(`/${opts.name}`, router);
    }
    getRoute(router, table, baseChain) {
        baseChain.push((0, mw_factories_1.buildGetRoute)(table));
        baseChain.push((0, mw_factories_1.buildParseResponse)());
        router.get(`/`, baseChain);
    }
}
const createApp = (adapter) => new Application(adapter);
exports.createApp = createApp;
