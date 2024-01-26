import { router, publicProcedure } from '..';
import { consumeAd } from '../services/relayer.service';
import { z } from 'zod';
import { recoverMessageAddress } from 'viem';
import { TRPCError } from '@trpc/server';
import { ZeroAddress, ZeroHash } from 'ethers';

export const txsRouter = router({
  list: publicProcedure
    .input(
      z.object({
        signature: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const wallet = await recoverMessageAddress({
        message: 'list',
        signature: input.signature as `0x{string}`,
      });
      const txs = await ctx.prisma.tx.findMany({
        where: {
          wallet,
        },
      });
      if (!txs.length) throw new TRPCError({ code: 'NOT_FOUND', message: 'Transactions not found' });
      return txs;
    }),
  consumeAd: publicProcedure
    .input(
      z.object({
        data: z.string(),
        adId: z.string(),
        publisher: z.string(),
        zkProofs: z
          .object({
            inputs: z.array(z.array(z.any())),
            a: z.array(z.tuple([z.any(), z.any()])),
            b: z.array(z.tuple([z.tuple([z.any(), z.any()]), z.tuple([z.any(), z.any()])])),
            c: z.array(z.tuple([z.any(), z.any()])),
          })
          .default({
            inputs: [],
            a: [],
            b: [],
            c: [],
          }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const viewer = ZeroAddress; // To be changed in attribution v1.
      const result = await consumeAd([viewer, input.adId, input.publisher, input.zkProofs, ZeroHash]);
      const saved = await ctx.prisma.tx.create({
        data: {
          hash: result,
          wallet: viewer,
          status: 'sent',
        },
      });
      if (!saved.hash) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Transaction not saved' });
      return result;
    }),
  delete: publicProcedure
    .input(
      z.object({
        hash: z.string(),
        signature: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const wallet = await recoverMessageAddress({
        message: input.hash,
        signature: input.signature as `0x{string}`,
      });
      const tx = await ctx.prisma.tx.findFirst({
        where: {
          hash: input.hash,
        },
      });
      if (!tx) throw new TRPCError({ code: 'NOT_FOUND', message: 'Transaction not found' });
      if (tx.wallet !== wallet)
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You are not allowed to delete this transaction',
        });
      const deleted = await ctx.prisma.tx.delete({
        where: {
          hash: input.hash,
        },
      });
      if (!deleted.hash) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Transaction not deleted' });
      return 'Transaction deleted';
    }),
});
