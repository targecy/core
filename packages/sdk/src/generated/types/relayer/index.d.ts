/// <reference types="qs" />
/// <reference types="express" />
import { inferAsyncReturnType } from '@trpc/server';
import superjson from 'superjson';
import * as trpcExpress from '@trpc/server/adapters/express';
import { PrismaClient } from '@prisma/client';
/**
 * Creates a context without req/res, useful for testing
 */
export declare const createBaseContext: () => {
    prisma: PrismaClient<{
        log: {
            emit: "event";
            level: "query";
        }[];
    }, "query", false>;
};
export declare const createContext: ({ req, res }: trpcExpress.CreateExpressContextOptions) => Promise<{
    req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    res: import("express").Response<any, Record<string, any>>;
    prisma: PrismaClient<{
        log: {
            emit: "event";
            level: "query";
        }[];
    }, "query", false>;
}>;
export type Context = inferAsyncReturnType<typeof createContext>;
export declare const middleware: <TNewParams extends import("@trpc/server").ProcedureParams<import("@trpc/server").AnyRootConfig, unknown, unknown, unknown, unknown, unknown, unknown>>(fn: import("@trpc/server").MiddlewareFunction<{
    _config: import("@trpc/server").RootConfig<{
        ctx: {
            req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
            res: import("express").Response<any, Record<string, any>>;
            prisma: PrismaClient<{
                log: {
                    emit: "event";
                    level: "query";
                }[];
            }, "query", false>;
        };
        meta: object;
        errorShape: import("@trpc/server").DefaultErrorShape;
        transformer: typeof superjson;
    }>;
    _ctx_out: {};
    _input_out: unknown;
    _input_in: unknown;
    _output_in: unknown;
    _output_out: unknown;
    _meta: object;
}, TNewParams>) => import("@trpc/server").MiddlewareBuilder<{
    _config: import("@trpc/server").RootConfig<{
        ctx: {
            req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
            res: import("express").Response<any, Record<string, any>>;
            prisma: PrismaClient<{
                log: {
                    emit: "event";
                    level: "query";
                }[];
            }, "query", false>;
        };
        meta: object;
        errorShape: import("@trpc/server").DefaultErrorShape;
        transformer: typeof superjson;
    }>;
    _ctx_out: {};
    _input_out: unknown;
    _input_in: unknown;
    _output_in: unknown;
    _output_out: unknown;
    _meta: object;
}, TNewParams>;
export declare const router: <TProcRouterRecord extends import("@trpc/server").ProcedureRouterRecord>(procedures: TProcRouterRecord) => import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
    ctx: {
        req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
        res: import("express").Response<any, Record<string, any>>;
        prisma: PrismaClient<{
            log: {
                emit: "event";
                level: "query";
            }[];
        }, "query", false>;
    };
    meta: object;
    errorShape: import("@trpc/server").DefaultErrorShape;
    transformer: typeof superjson;
}>, TProcRouterRecord>;
export declare const publicProcedure: import("@trpc/server").ProcedureBuilder<{
    _config: import("@trpc/server").RootConfig<{
        ctx: {
            req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
            res: import("express").Response<any, Record<string, any>>;
            prisma: PrismaClient<{
                log: {
                    emit: "event";
                    level: "query";
                }[];
            }, "query", false>;
        };
        meta: object;
        errorShape: import("@trpc/server").DefaultErrorShape;
        transformer: typeof superjson;
    }>;
    _meta: object;
    _ctx_out: {
        prisma: PrismaClient<{
            log: {
                emit: "event";
                level: "query";
            }[];
        }, "query", false>;
        req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
        res: import("express").Response<any, Record<string, any>>;
    };
    _input_in: typeof import("@trpc/server").unsetMarker;
    _input_out: typeof import("@trpc/server").unsetMarker;
    _output_in: typeof import("@trpc/server").unsetMarker;
    _output_out: typeof import("@trpc/server").unsetMarker;
}>;
