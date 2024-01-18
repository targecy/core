"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.segmentRouter = void 0;
const zod_1 = require("zod");
const __1 = require("..");
const targecy_service_1 = require("../services/external/targecy.service");
const segments_service_1 = require("../services/Segments/segments.service");
// @todo move logic to service layer and db connections to repository layer
exports.segmentRouter = (0, __1.router)({
    getSegmentPotentialReachByIds: __1.publicProcedure
        .input(zod_1.z.object({
        ids: zod_1.z.array(zod_1.z.string()),
    }))
        .query(async ({ ctx, input }) => {
        // Fetch Segments for Audience
        const segments = await (0, targecy_service_1.getSegmentsByIds)(input.ids);
        // Generate database conditions to look for issued credentials
        const predicate = (0, segments_service_1.getPrismaPredicateForCredentialsFromSegments)(segments);
        // Compare Segments to Issued Credentials
        const count = await ctx.prisma.credential.count({
            where: predicate,
        });
        return {
            count,
        };
    }),
    getSegmentPotentialReachByParams: __1.publicProcedure
        .input(zod_1.z.object({
        operator: zod_1.z.number(),
        value: zod_1.z.any(),
        slotIndex: zod_1.z.number(),
        schema: zod_1.z.string(),
    }))
        .query(async ({ ctx, input }) => {
        // Generate database conditions to look for issued credentials
        const predicate = (0, segments_service_1.getPrismaPredicateForCredentialsFromSegment)({
            validator: '',
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
        const count = await ctx.prisma.credential.count({
            where: predicate,
        });
        return {
            count,
        };
    }),
});
