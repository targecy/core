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
    transformer: typeof import("superjson").default;
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
    }, string>;
    credentials: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
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
        getTotalAmountOfCredentialsIssued: import("@trpc/server").BuildProcedure<"query", {
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
        }, number>;
        issueCredential: import("@trpc/server").BuildProcedure<"mutation", {
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
                apiKey: string;
                claimerDid: string;
            };
            _input_out: {
                apiKey: string;
                claimerDid: string;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, import("@0xpolygonid/js-sdk").W3CCredential>;
        getPublicCredentials: import("@trpc/server").BuildProcedure<"query", {
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
                signature: string;
                did: string;
                wallet: string;
                message?: string | undefined;
            };
            _input_out: {
                signature: string;
                did: string;
                wallet: string;
                message?: string | undefined;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, any[]>;
    }>;
    schemas: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
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
        }, {
            ProtocolUsedTargecySchema: import("../../constants/schemas/schemas.constant").SCHEMA<"ProtocolUsedTargecySchema">;
            TokenHolderTargecySchema: import("../../constants/schemas/schemas.constant").SCHEMA<"TokenHolderTargecySchema">;
            ActiveOnChainTargecySchema: import("../../constants/schemas/schemas.constant").SCHEMA<"ActiveOnChainTargecySchema">;
            PageViewTargecySchema: import("../../constants/schemas/schemas.constant").SCHEMA<"PageViewTargecySchema">;
            CustomEventTargecySchema: import("../../constants/schemas/schemas.constant").SCHEMA<"CustomEventTargecySchema">;
            InterestTargecySchema: import("../../constants/schemas/schemas.constant").SCHEMA<"InterestTargecySchema">;
            ProfileTargecySchema: import("../../constants/schemas/schemas.constant").SCHEMA<"ProfileTargecySchema">;
        }>;
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
        }, import("../../constants/schemas/schemas.constant").SCHEMA<"ProtocolUsedTargecySchema"> | import("../../constants/schemas/schemas.constant").SCHEMA<"TokenHolderTargecySchema"> | import("../../constants/schemas/schemas.constant").SCHEMA<"ActiveOnChainTargecySchema"> | import("../../constants/schemas/schemas.constant").SCHEMA<"PageViewTargecySchema"> | import("../../constants/schemas/schemas.constant").SCHEMA<"CustomEventTargecySchema"> | import("../../constants/schemas/schemas.constant").SCHEMA<"InterestTargecySchema"> | import("../../constants/schemas/schemas.constant").SCHEMA<"ProfileTargecySchema">>;
    }>;
    targets: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
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
        getAudiencesReach: import("@trpc/server").BuildProcedure<"query", {
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
                ids: string[];
            };
            _input_out: {
                ids: string[];
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            count: number;
        }>;
    }>;
    reach: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
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
        getSegmentReachByIds: import("@trpc/server").BuildProcedure<"query", {
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
                ids: string[];
            };
            _input_out: {
                ids: string[];
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            count: number;
        }>;
        getReachByHashTypeIssuer: import("@trpc/server").BuildProcedure<"query", {
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
                issuer: string;
                hash: string;
            };
            _input_out: {
                type: string;
                issuer: string;
                hash: string;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            reach: bigint;
        }>;
        getSegmentReachByParams: import("@trpc/server").BuildProcedure<"query", {
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
                schema: string;
                operator: number;
                slotIndex: number;
                value?: any;
            };
            _input_out: {
                schema: string;
                operator: number;
                slotIndex: number;
                value?: any;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            count: number;
        }>;
        updateReach: import("@trpc/server").BuildProcedure<"mutation", {
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
                issuer: string;
                subject: Record<string, any>;
            };
            _input_out: {
                type: string;
                issuer: string;
                subject: Record<string, any>;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, void>;
    }>;
    users: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
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
        getTotalAmountOfUsers: import("@trpc/server").BuildProcedure<"query", {
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
        }, import(".prisma/client").Prisma.GetCredentialAggregateType<{
            _count: {
                issuedTo: true;
            };
        }>>;
    }>;
}>;
export type AppRouter = typeof appRouter;
