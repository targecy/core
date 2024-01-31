"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reachRouter = void 0;
const server_1 = require("@trpc/server");
const zod_1 = require("zod");
const __1 = require("..");
const targecy_service_1 = require("../services/external/targecy.service");
const segments_service_1 = require("../services/segments/segments.service");
// @todo move logic to service layer and db connections to repository layer
exports.reachRouter = (0, __1.router)({
    getSegmentReachByIds: __1.publicProcedure
        .input(zod_1.z.object({
        ids: zod_1.z.array(zod_1.z.string()),
    }))
        .query(async ({ ctx, input }) => {
        // Fetch Segments for Audience
        const segments = await (0, targecy_service_1.getSegmentsByIds)(input.ids);
        // Generate database conditions to look for issued credentials
        const predicate = (0, segments_service_1.getPrismaPredicateForSegments)(segments);
        // Compare Segments to Issued Credentials
        const count = await ctx.prisma.reach.count({
            where: predicate,
        });
        return {
            count,
        };
    }),
    getReachByHashTypeIssuer: __1.publicProcedure
        .input(zod_1.z.object({
        hash: zod_1.z.string(),
        type: zod_1.z.string(),
        issuer: zod_1.z.string(),
    }))
        .query(async ({ ctx, input }) => {
        const segment = await ctx.prisma.reach.findUnique({
            where: {
                hash_type_issuer: {
                    hash: input.hash,
                    type: input.type,
                    issuer: input.issuer,
                },
            },
        });
        if (!segment) {
            throw new server_1.TRPCError({ code: 'NOT_FOUND', message: 'Segment not found' });
        }
        return {
            reach: segment.amount,
        };
    }),
    getSegmentReachByParams: __1.publicProcedure
        .input(zod_1.z.object({
        operator: zod_1.z.number(),
        value: zod_1.z.any(),
        slotIndex: zod_1.z.number(),
        schema: zod_1.z.string(),
    }))
        .query(async ({ ctx, input }) => {
        // Generate database conditions to look for issued credentials
        const predicate = (0, segments_service_1.getPrismaPredicateForSegment)({
            metadataURI: '',
            id: '',
            issuer: {
                id: '',
            },
            queryCircuitId: '',
            queryOperator: input.operator,
            querySchema: input.schema,
            querySlotIndex: input.slotIndex,
            queryValue: input.value,
        });
        // Compare Segments to Issued Credentials
        const count = await ctx.prisma.reach.count({
            where: predicate,
        });
        return {
            count,
        };
    }),
    updateReach: __1.publicProcedure
        .input(zod_1.z.object({
        type: zod_1.z.string(),
        issuer: zod_1.z.string(),
        subject: zod_1.z.record(zod_1.z.string(), zod_1.z.any()), // Credential Subject without 'id'
    }))
        .mutation(async ({ ctx, input }) => {
        await (0, segments_service_1.updateSegment)(ctx.prisma, input);
    }),
});
