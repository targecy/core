import { getPrismaPredicateForCredentialsFromZKPRequests } from 'trpc/services/ZKPRequests/zkpRequests.service';
import { z } from 'zod';

import { router, publicProcedure } from '..';
import { getZKPRequestForTargetGroup } from '../services/external/targecy.service';

// @todo move logic to service layer and db connections to repository layer

export const targetsRouter = router({
  getTargetGroupsReach: publicProcedure
    .input(
      z.object({
        ids: z.array(z.string()),
      })
    )
    .query(async ({ ctx, input }) => {
      const targetGroupReach = await Promise.all(
        input.ids.map(async (id) => {
          // Fetch ZKPRequests for TargetGroup
          const zkpRequests = await getZKPRequestForTargetGroup(id);

          // Generate database conditions to look for issued credentials
          const predicate = getPrismaPredicateForCredentialsFromZKPRequests(zkpRequests);

          // Compare ZKPRequests to Issued Credentials
          const count = await ctx.prisma.credential.count({
            where: predicate,
          });

          return count;
        })
      );

      return {
        count: targetGroupReach.reduce((a, b) => a + b, 0),
      };
    }),
});
