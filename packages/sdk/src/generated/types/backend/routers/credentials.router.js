"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.credentialsRouter = void 0;
const js_iden3_core_1 = require("@iden3/js-iden3-core");
const server_1 = require("@trpc/server");
const zod_1 = require("zod");
const __1 = require("..");
const default_issuer_1 = require("../../constants/issuers/default/default.issuer");
const credentials_utils_1 = require("../../utils/credentials/credentials.utils");
const zk_utils_1 = require("../../utils/zk.utils");
const credentialsService = __importStar(require("../services/internal/credentials/credentials.service"));
const segments_service_1 = require("../services/internal/segments/segments.service");
// @todo move logic to service layer and db connections to repository layer
exports.credentialsRouter = (0, __1.router)({
    getTotalAmountOfCredentialsIssued: __1.publicProcedure.query(async ({ ctx }) => {
        const totalAmount = await ctx.prisma.credential.count();
        return totalAmount;
    }),
    issueCredential: __1.publicProcedure
        .input(zod_1.z.object({
        apiKey: zod_1.z.string(),
        claimerDid: zod_1.z.string(),
    }))
        .mutation(async ({ ctx, input }) => {
        const apiKey = await ctx.prisma.apiKey.findFirst({
            where: {
                key: input.apiKey,
            },
        });
        if (!apiKey)
            throw new server_1.TRPCError({ code: 'NOT_FOUND', message: 'API Key not found' });
        if (apiKey.expirationDate > new Date())
            throw new server_1.TRPCError({ code: 'NOT_FOUND', message: 'API Key expired' });
        const issuer = await ctx.prisma.issuer.findFirst({
            where: {
                did: apiKey.issuerDid,
            },
        });
        if (!issuer)
            throw new server_1.TRPCError({ code: 'NOT_FOUND', message: 'Issuer not found' });
        const profileDid = await (0, default_issuer_1.getThirdPartyIssuerProfile)(issuer.profileNonce);
        const credentialRequest = (0, zk_utils_1.createCredentialRequest)(input.claimerDid);
        const credentialIssued = await zk_utils_1.storages.identityWallet.issueCredential(profileDid, credentialRequest);
        return credentialIssued;
    }),
    getPublicCredentials: __1.publicProcedure
        .input(zod_1.z.object({
        // message: z.string().optional(),
        did: zod_1.z.string(),
        wallet: zod_1.z.string(),
    }))
        .query(async ({ ctx, input }) => {
        console.debug('getPublicCredentials');
        // // Validate signature, only wallet owners can get their credentials.
        // const walletFromSignature = await recoverMessageAddress({
        //   message: input.message ?? 'public.credentials',
        //   signature: input.signature as `0x{string}`,
        // });
        // if (walletFromSignature !== input.wallet) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Unauthorized' });
        // Check last time credentials were issued for this wallet
        const lastTimeIssuedForWallet = (await ctx.prisma.credential.aggregate({
            where: {
                issuedTo: input.did,
            },
            _max: {
                issuedAt: true,
            },
        }))._max?.issuedAt;
        console.debug('lastTimeIssuedForWallet', lastTimeIssuedForWallet);
        // Check if there are new credentials to issue
        const credentials = await credentialsService.getPublicCredentials(input.wallet, js_iden3_core_1.DID.parse(`did:${input.did}`), lastTimeIssuedForWallet ?? undefined);
        console.debug('credentials', credentials);
        // Save new credentials
        const saved = await ctx.prisma.credential.createMany({
            data: credentials.map((credential) => ({
                did: credential.id,
                issuedTo: credential.credentialSubject['@id'],
                type: credential.type.toLocaleString(),
                issuerDid: credential.issuer,
                credential: JSON.parse(JSON.stringify(credential)),
                identifier: (0, credentials_utils_1.getCredentialIdentifier)(credential),
            })),
        });
        await Promise.all(credentials.map(async (credential) => {
            await (0, segments_service_1.updateSegment)(ctx.prisma, {
                type: credential.type.length > 1 ? credential.type[1] : credential.type[0],
                issuer: credential.issuer,
                subject: credential.credentialSubject,
            });
        }));
        console.debug('saved', saved);
        if (saved.count !== credentials.length)
            throw new server_1.TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Credentials not saved' });
        console.log('Credentials created: ', credentials);
        const allCredentials = await ctx.prisma.credential.findMany({
            where: {
                issuedTo: input.did,
            },
            select: {
                credential: true,
            },
        });
        console.debug('allCredentials', allCredentials);
        return allCredentials.flatMap((credential) => JSON.parse(JSON.stringify(credential.credential)));
    }),
});
