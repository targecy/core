"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = void 0;
const __1 = require("..");
const txs_router_1 = require("./txs.router");
exports.appRouter = (0, __1.router)({
    ping: __1.publicProcedure.query(() => {
        return 'pong';
    }),
    txs: txs_router_1.txsRouter,
});
