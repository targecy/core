"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = void 0;
const __1 = require("..");
const credentials_router_1 = require("./credentials.router");
const schemas_router_1 = require("./schemas.router");
const segments_router_1 = require("./segments.router");
const targets_router_1 = require("./targets.router");
const users_router_1 = require("./users.router");
exports.appRouter = (0, __1.router)({
    credentials: credentials_router_1.credentialsRouter,
    schemas: schemas_router_1.schemasRouter,
    targets: targets_router_1.targetsRouter,
    segment: segments_router_1.segmentRouter,
    users: users_router_1.usersRouter,
});
