import { getThirdPartyIssuerProfile } from 'constants/issuers/default/default.issuer';

import { TRPCError } from '@trpc/server';
import { getPublicCredentials } from 'trpc/services/credentials/credentials.service';
import { createCredentialRequest, storages } from 'utils/zk.utils';
import { recoverMessageAddress } from 'viem';
import { z } from 'zod';

import { router, publicProcedure } from '..';

// @todo move logic to service layer and db connections to repository layer

export const credentialsRouter = router({
  issueCredential: publicProcedure
    .input(
      z.object({
        apiKey: z.string(),
        claimerDid: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const apiKey = await ctx.prisma.apiKey.findFirst({
        where: {
          key: input.apiKey,
        },
      });

      if (!apiKey) throw new TRPCError({ code: 'NOT_FOUND', message: 'API Key not found' });
      if (apiKey.expirationDate > new Date()) throw new TRPCError({ code: 'NOT_FOUND', message: 'API Key expired' });

      const issuer = await ctx.prisma.issuer.findFirst({
        where: {
          did: apiKey.issuerDid,
        },
      });

      if (!issuer) throw new TRPCError({ code: 'NOT_FOUND', message: 'Issuer not found' });

      const profileDid = await getThirdPartyIssuerProfile(issuer.profileNonce);

      const credentialRequest = createCredentialRequest(input.claimerDid);

      const credentialIssued = await storages.identityWallet.issueCredential(profileDid, credentialRequest);

      return credentialIssued;
    }),

  getPublicCredentials: publicProcedure
    .input(
      z.object({
        signature: z.string(),
        did: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      // Validate signature, only wallet owners can get their credentials.
      const wallet = await recoverMessageAddress({
        message: 'public.credentials',
        signature: input.signature as `0x{string}`,
      });

      // Check if there are new credentials to issue
      const credentials = await getPublicCredentials(wallet, input.did);

      // Save new credentials - @todo CHECK
      const saved = await ctx.prisma.credential.createMany({
        data: credentials.map((credential) => ({
          did: credential.id,
          issuedTo: credential.credentialSubject['@id'].toString(),
          type: 'TYPE',
          issuerDid: credential.issuer,
          subject: credential.credentialSubject,
        })),
      });

      if (saved.count != credentials.length)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Credentials not saved' });

      return credentials;
    }),
});
