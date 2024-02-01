"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.targetsRouter = void 0;
const zod_1 = require("zod");
const __1 = require("..");
const targecy_service_1 = require("../services/external/targecy.service");
const segments_service_1 = require("../services/internal/segments/segments.service");
// @todo move logic to service layer and db connections to repository layer
exports.targetsRouter = (0, __1.router)({
    getAudiencesReach: __1.publicProcedure
        .input(zod_1.z.object({
        ids: zod_1.z.array(zod_1.z.string()),
    }))
        .query(async ({ ctx, input }) => {
        const audienceReach = await Promise.all(input.ids.map(async (id) => {
            // Fetch Segments for Audience
            const segments = await (0, targecy_service_1.getSegmentForAudience)(id);
            // Generate database conditions to look for issued credentials
            const predicate = (0, segments_service_1.getPrismaPredicateForSegments)(segments);
            // Compare Segments to Issued Credentials
            const count = await ctx.prisma.reach.count({
                where: predicate,
            });
            return count;
        }));
        return {
            count: audienceReach.reduce((a, b) => a + b, 0),
        };
    }),
});
