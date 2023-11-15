import { z } from 'zod';

import { router, publicProcedure } from '..';
import { getZKPRequestsByIds } from '../services/external/targecy.service';
import {
  getPrismaPredicateForCredentialsFromZKPRequest,
  getPrismaPredicateForCredentialsFromZKPRequests,
} from '../services/ZKPRequests/zkpRequests.service';

// @todo move logic to service layer and db connections to repository layer

export const zkpRequestRouter = router({
  getZKPRequestPotentialReachByIds: publicProcedure
    .input(
      z.object({
        ids: z.array(z.string()),
      })
    )
    .query(async ({ ctx, input }) => {
      // Fetch ZKPRequests for TargetGroup
      const zkpRequests = await getZKPRequestsByIds(input.ids);

      // Generate database conditions to look for issued credentials
      const predicate = getPrismaPredicateForCredentialsFromZKPRequests(zkpRequests);

      // Compare ZKPRequests to Issued Credentials
      const count = await ctx.prisma.credential.count({
        where: predicate,
      });

      return {
        count,
      };
    }),

  getZKPRequestPotentialReachByParams: publicProcedure
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
      const predicate = getPrismaPredicateForCredentialsFromZKPRequest({
        validator: '',
        metadataURI: '',
        id: '',
        query_circuitId: '',
        query_operator: input.operator,
        query_schema: input.schema,
        query_slotIndex: input.slotIndex,
        query_value: input.value,
      });

      // Compare ZKPRequests to Issued Credentials
      const count = await ctx.prisma.credential.count({
        where: predicate,
      });

      return {
        count,
      };
    }),
});
