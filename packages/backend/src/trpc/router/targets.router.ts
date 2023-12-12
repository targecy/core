import { z } from 'zod';

import { router, publicProcedure } from '..';
import { getSegmentForAudience } from '../services/external/targecy.service';
import { getPrismaPredicateForCredentialsFromSegments } from '../services/Segments/segments.service';

// @todo move logic to service layer and db connections to repository layer

export const targetsRouter = router({
  getAudiencesReach: publicProcedure
    .input(
      z.object({
        ids: z.array(z.string()),
      })
    )
    .query(async ({ ctx, input }) => {
      const audienceReach = await Promise.all(
        input.ids.map(async (id) => {
          // Fetch Segments for Audience
          const segments = await getSegmentForAudience(id);

          // Generate database conditions to look for issued credentials
          const predicate = getPrismaPredicateForCredentialsFromSegments(segments);

          // Compare Segments to Issued Credentials
          const count = await ctx.prisma.credential.count({
            where: predicate,
          });

          return count;
        })
      );

      return {
        count: audienceReach.reduce((a, b) => a + b, 0),
      };
    }),
});
