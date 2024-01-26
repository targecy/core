export declare const schemasRouter: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
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
    transformer: typeof import("superjson").default;
}>, {
    getAllSchemas: import("@trpc/server").BuildProcedure<"query", {
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
            transformer: typeof import("superjson").default;
        }>;
        _meta: object;
        _ctx_out: {
            req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
            res: import("express").Response<any, Record<string, any>>;
            prisma: import(".prisma/client").PrismaClient<{
                log: {
                    emit: "event";
                    level: "query";
                }[];
            }, "query", false>;
        };
        _input_in: typeof import("@trpc/server").unsetMarker;
        _input_out: typeof import("@trpc/server").unsetMarker;
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, Record<"ProtocolUsedTargecySchema" | "TokenHolderTargecySchema" | "ActiveOnChainTargecySchema", import("../../constants/schemas/schemas.constant").SCHEMA>>;
    getSchemaByType: import("@trpc/server").BuildProcedure<"query", {
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
            transformer: typeof import("superjson").default;
        }>;
        _meta: object;
        _ctx_out: {
            req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
            res: import("express").Response<any, Record<string, any>>;
            prisma: import(".prisma/client").PrismaClient<{
                log: {
                    emit: "event";
                    level: "query";
                }[];
            }, "query", false>;
        };
        _input_in: {
            type: string;
        };
        _input_out: {
            type: string;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, import("../../constants/schemas/schemas.constant").SCHEMA>;
}>;
