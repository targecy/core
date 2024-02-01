import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { router, publicProcedure } from '..';
import { getSegmentsByIds } from '../services/external/targecy.service';
import {
  getPrismaPredicateForSegment,
  getPrismaPredicateForSegments,
  updateSegment,
} from '../services/internal/segments/segments.service';

// @todo move logic to service layer and db connections to repository layer

export const reachRouter = router({
  getSegmentReachByIds: publicProcedure
    .input(
      z.object({
        ids: z.array(z.string()),
      })
    )
    .query(async ({ ctx, input }) => {
      // Fetch Segments for Audience
      const segments = await getSegmentsByIds(input.ids);

      // Generate database conditions to look for issued credentials
      const predicate = getPrismaPredicateForSegments(segments);

      // Compare Segments to Issued Credentials
      const count = await ctx.prisma.reach.count({
        where: predicate,
      });

      return {
        count,
      };
    }),

  getReachByHashTypeIssuer: publicProcedure
    .input(
      z.object({
        hash: z.string(),
        type: z.string(),
        issuer: z.string(),
      })
    )
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
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Segment not found' });
      }

      return {
        reach: segment.amount,
      };
    }),

  getSegmentReachByParams: publicProcedure
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
      const predicate = getPrismaPredicateForSegment({
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

  updateReach: publicProcedure
    .input(
      z.object({
        type: z.string(),
        issuer: z.string(),
        subject: z.record(z.string(), z.any()), // Credential Subject without 'id'
      })
    )
    .mutation(async ({ ctx, input }) => {
      await updateSegment(ctx.prisma, input);
    }),
});
