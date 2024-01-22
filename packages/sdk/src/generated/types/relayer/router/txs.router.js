"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.txsRouter = void 0;
const __1 = require("..");
const relayer_service_1 = require("../services/relayer.service");
const zod_1 = require("zod");
const viem_1 = require("viem");
const server_1 = require("@trpc/server");
const ethers_1 = require("ethers");
exports.txsRouter = (0, __1.router)({
    list: __1.publicProcedure
        .input(zod_1.z.object({
        signature: zod_1.z.string(),
    }))
        .query(async ({ input, ctx }) => {
        const wallet = await (0, viem_1.recoverMessageAddress)({
            message: 'list',
            signature: input.signature,
        });
        const txs = await ctx.prisma.tx.findMany({
            where: {
                wallet,
            },
        });
        if (!txs.length)
            throw new server_1.TRPCError({ code: 'NOT_FOUND', message: 'Transactions not found' });
        return txs;
    }),
    consumeAd: __1.publicProcedure
        .input(zod_1.z.object({
        data: zod_1.z.string(),
        adId: zod_1.z.string(),
        publisher: zod_1.z.string(),
        zkProofs: zod_1.z
            .object({
            inputs: zod_1.z.array(zod_1.z.array(zod_1.z.any())),
            a: zod_1.z.array(zod_1.z.tuple([zod_1.z.any(), zod_1.z.any()])),
            b: zod_1.z.array(zod_1.z.tuple([zod_1.z.tuple([zod_1.z.any(), zod_1.z.any()]), zod_1.z.tuple([zod_1.z.any(), zod_1.z.any()])])),
            c: zod_1.z.array(zod_1.z.tuple([zod_1.z.any(), zod_1.z.any()])),
        })
            .default({
            inputs: [],
            a: [],
            b: [],
            c: [],
        }),
    }))
        .mutation(async ({ ctx, input }) => {
        const viewer = ethers_1.ZeroAddress; // To be changed in attribution v1.
        const result = await (0, relayer_service_1.consumeAd)([viewer, input.adId, input.publisher, input.zkProofs, []]);
        const saved = await ctx.prisma.tx.create({
            data: {
                hash: result,
                wallet: viewer,
                status: 'sent',
            },
        });
        if (!saved.hash)
            throw new server_1.TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Transaction not saved' });
        return result;
    }),
    delete: __1.publicProcedure
        .input(zod_1.z.object({
        hash: zod_1.z.string(),
        signature: zod_1.z.string(),
    }))
        .mutation(async ({ ctx, input }) => {
        const wallet = await (0, viem_1.recoverMessageAddress)({
            message: input.hash,
            signature: input.signature,
        });
        const tx = await ctx.prisma.tx.findFirst({
            where: {
                hash: input.hash,
            },
        });
        if (!tx)
            throw new server_1.TRPCError({ code: 'NOT_FOUND', message: 'Transaction not found' });
        if (tx.wallet !== wallet)
            throw new server_1.TRPCError({
                code: 'FORBIDDEN',
                message: 'You are not allowed to delete this transaction',
            });
        const deleted = await ctx.prisma.tx.delete({
            where: {
                hash: input.hash,
            },
        });
        if (!deleted.hash)
            throw new server_1.TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Transaction not deleted' });
        return 'Transaction deleted';
    }),
});
