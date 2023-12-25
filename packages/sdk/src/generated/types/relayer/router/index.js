"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = void 0;
const __1 = require("..");
const txsRouter_1 = require("./txsRouter");
exports.appRouter = (0, __1.router)({
    txs: txsRouter_1.txsRouter,
});
