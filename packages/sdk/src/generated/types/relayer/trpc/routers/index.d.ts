/// <reference types="qs" />
/// <reference types="express" />
import SuperJSON from 'superjson';
export declare const appRouter: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
    ctx: {
        req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
        res: import("express").Response<any, Record<string, any>>;
        prisma: import(".prisma/client").PrismaClient<{
            log: {
                emit: "event";
                level: "query";
            }[];
        }, "query", false>;
    };
    meta: object;
    errorShape: import("@trpc/server").DefaultErrorShape;
    transformer: typeof SuperJSON;
}>, {
    ping: import("@trpc/server").BuildProcedure<"query", {
        _config: import("@trpc/server").RootConfig<{
            ctx: {
                req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
                res: import("express").Response<any, Record<string, any>>;
                prisma: import(".prisma/client").PrismaClient<{
                    log: {
                        emit: "event";
                        level: "query";
                    }[];
                }, "query", false>;
            };
            meta: object;
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: typeof SuperJSON;
        }>;
        _meta: object;
        _ctx_out: {
            prisma: import(".prisma/client").PrismaClient<{
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
    }, string>;
    txs: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
        ctx: {
            req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
            res: import("express").Response<any, Record<string, any>>;
            prisma: import(".prisma/client").PrismaClient<{
                log: {
                    emit: "event";
                    level: "query";
                }[];
            }, "query", false>;
        };
        meta: object;
        errorShape: import("@trpc/server").DefaultErrorShape;
        transformer: typeof SuperJSON;
    }>, {
        list: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: {
                    req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
                    res: import("express").Response<any, Record<string, any>>;
                    prisma: import(".prisma/client").PrismaClient<{
                        log: {
                            emit: "event";
                            level: "query";
                        }[];
                    }, "query", false>;
                };
                meta: object;
                errorShape: import("@trpc/server").DefaultErrorShape;
                transformer: typeof SuperJSON;
            }>;
            _meta: object;
            _ctx_out: {
                prisma: import(".prisma/client").PrismaClient<{
                    log: {
                        emit: "event";
                        level: "query";
                    }[];
                }, "query", false>;
                req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
                res: import("express").Response<any, Record<string, any>>;
            };
            _input_in: {
                signature: string;
            };
            _input_out: {
                signature: string;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, import(".prisma/client").Tx[]>;
        consumeAd: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: {
                    req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
                    res: import("express").Response<any, Record<string, any>>;
                    prisma: import(".prisma/client").PrismaClient<{
                        log: {
                            emit: "event";
                            level: "query";
                        }[];
                    }, "query", false>;
                };
                meta: object;
                errorShape: import("@trpc/server").DefaultErrorShape;
                transformer: typeof SuperJSON;
            }>;
            _meta: object;
            _ctx_out: {
                prisma: import(".prisma/client").PrismaClient<{
                    log: {
                        emit: "event";
                        level: "query";
                    }[];
                }, "query", false>;
                req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
                res: import("express").Response<any, Record<string, any>>;
            };
            _input_in: {
                data: string;
                adId: string;
                publisher: string;
                zkProofs?: {
                    inputs: any[][];
                    a: [any, any][];
                    b: [[any, any], [any, any]][];
                    c: [any, any][];
                } | undefined;
            };
            _input_out: {
                data: string;
                adId: string;
                publisher: string;
                zkProofs: {
                    inputs: any[][];
                    a: [any, any][];
                    b: [[any, any], [any, any]][];
                    c: [any, any][];
                };
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, string>;
        delete: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: {
                    req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
                    res: import("express").Response<any, Record<string, any>>;
                    prisma: import(".prisma/client").PrismaClient<{
                        log: {
                            emit: "event";
                            level: "query";
                        }[];
                    }, "query", false>;
                };
                meta: object;
                errorShape: import("@trpc/server").DefaultErrorShape;
                transformer: typeof SuperJSON;
            }>;
            _meta: object;
            _ctx_out: {
                prisma: import(".prisma/client").PrismaClient<{
                    log: {
                        emit: "event";
                        level: "query";
                    }[];
                }, "query", false>;
                req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
                res: import("express").Response<any, Record<string, any>>;
            };
            _input_in: {
                hash: string;
                signature: string;
            };
            _input_out: {
                hash: string;
                signature: string;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, string>;
    }>;
}>;
export type AppRouter = typeof appRouter;
