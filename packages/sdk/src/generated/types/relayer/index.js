"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicProcedure = exports.router = exports.middleware = exports.createContext = exports.createBaseContext = void 0;
const server_1 = require("@trpc/server");
const superjson_1 = __importDefault(require("superjson"));
const db_1 = require("../db");
/**
 * Creates a context without req/res, useful for testing
 */
const createBaseContext = async () => ({
    prisma: db_1.prisma,
});
exports.createBaseContext = createBaseContext;
const createContext = async ({ req, res }) => {
    const baseContext = await (0, exports.createBaseContext)();
    return {
        ...baseContext,
        req,
        res,
    };
};
exports.createContext = createContext;
const t = server_1.initTRPC.context().create({
    transformer: superjson_1.default,
    errorFormatter({ shape }) {
        return shape;
    },
});
exports.middleware = t.middleware;
exports.router = t.router;
const logger = t.middleware(async ({ path, type, next }) => {
    const result = await next();
    if (result.ok) {
        console.info(`Ok: ${JSON.stringify({ path, type })}`);
    }
    else {
        console.error(`Error: ${JSON.stringify({ path, type })}`);
    }
    return result;
});
exports.publicProcedure = t.procedure.use(logger);
// export const publicProcedure = t.procedure;
