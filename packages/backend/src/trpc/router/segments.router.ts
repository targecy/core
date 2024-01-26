import { z } from 'zod';

import { router, publicProcedure } from '..';
import { getSegmentsByIds } from '../services/external/targecy.service';
import {
  getPrismaPredicateForCredentialsFromSegment,
  getPrismaPredicateForCredentialsFromSegments,
} from '../services/Segments/segments.service';

// @todo move logic to service layer and db connections to repository layer

export const segmentRouter = router({
  getSegmentPotentialReachByIds: publicProcedure
    .input(
      z.object({
        ids: z.array(z.string()),
      })
    )
    .query(async ({ ctx, input }) => {
      // Fetch Segments for Audience
      const segments = await getSegmentsByIds(input.ids);

      // Generate database conditions to look for issued credentials
      const predicate = getPrismaPredicateForCredentialsFromSegments(segments);

      // Compare Segments to Issued Credentials
      const count = await ctx.prisma.credential.count({
        where: predicate,
      });

      return {
        count,
      };
    }),

  getSegmentPotentialReachByParams: publicProcedure
    .input(
      z.object({
        operator: z.number(),
        value: z.any(),
        slotIndex: z.number(),
        schema: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      // Generate database conditions to look for issued credentials
      const predicate = getPrismaPredicateForCredentialsFromSegment({
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
