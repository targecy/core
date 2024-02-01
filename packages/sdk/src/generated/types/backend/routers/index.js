"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = void 0;
const __1 = require("..");
const credentials_router_1 = require("./credentials.router");
const reach_router_1 = require("./reach.router");
const schemas_router_1 = require("./schemas.router");
const targets_router_1 = require("./targets.router");
const users_router_1 = require("./users.router");
exports.appRouter = (0, __1.router)({
    ping: __1.publicProcedure.query(() => {
        return 'pong';
    }),
    credentials: credentials_router_1.credentialsRouter,
    schemas: schemas_router_1.schemasRouter,
    targets: targets_router_1.targetsRouter,
    reach: reach_router_1.reachRouter,
    users: users_router_1.usersRouter,
});
