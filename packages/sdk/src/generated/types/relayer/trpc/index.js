"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicProcedure = exports.router = exports.middleware = exports.createContext = exports.createBaseContext = void 0;
const server_1 = require("@trpc/server");
const superjson_1 = __importDefault(require("superjson"));
const client_1 = require("@prisma/client");
/**
 * Creates a context without req/res, useful for testing
 */
const createBaseContext = () => {
    const prisma = new client_1.PrismaClient({
        log: [
            {
                emit: 'event',
                level: 'query',
            },
        ],
    });
    if (process.env.NODE_ENV === 'development') {
        prisma.$on('query', (e) => {
            console.log('Query: ' + e.query);
            console.log('Params: ' + e.params);
            console.log('Duration: ' + e.duration + 'ms');
        });
    }
    return {
        prisma,
    };
};
exports.createBaseContext = createBaseContext;
const createContext = async ({ req, res }) => {
    const baseContext = (0, exports.createBaseContext)();
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
const logger = t.middleware(async ({ path, type, rawInput, next }) => {
    const result = await next();
    if (result.ok) {
        console.info(`Ok: ${JSON.stringify({ path })}`);
    }
    else {
        console.error(`Error`, { path, rawInput, type, error: result.error });
    }
    return result;
});
exports.publicProcedure = t.procedure.use(logger);
