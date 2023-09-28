import { router, publicProcedure } from '..';

// @todo move logic to service layer and db connections to repository layer

export const targetsRouter = router({
  getAllTargets: publicProcedure.query(async ({ ctx }) => {
    // Group by type and return count
    return await ctx.prisma.credential.groupBy({
      by: ['type'],
      _count: {
        _all: true,
      },
    });
  }),
});
