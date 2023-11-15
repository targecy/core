import { z } from 'zod';

import { router, publicProcedure } from '..';

// @todo move logic to service layer and db connections to repository layer

export const targetsRouter = router({
  getAllTargets: publicProcedure.query(async ({ ctx }) => {
    // Group by type and return count
    return await ctx.prisma.credential.groupBy({
      by: ['type', 'identifier'],
      _count: {
        _all: true,
      },
    });
  }),

  getTargetReach: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, prisma }) => {
      // Fetch ZKPRequests for TargetGroup
      // Compare ZKPRequests to Issued Credentials
    }),
});
