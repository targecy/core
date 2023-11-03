import { getThirdPartyIssuerProfile } from 'constants/issuers/default/default.issuer';

import { DID } from '@iden3/js-iden3-core';
import { TRPCError } from '@trpc/server';
import * as credentialsService from 'trpc/services/credentials/credentials.service';
import { getCredentialIdentifier } from 'utils/credentials/credentials.utils';
import { createCredentialRequest, storages } from 'utils/zk.utils';
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
        wallet: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      console.debug('getPublicCredentials');

      // Validate signature, only wallet owners can get their credentials.
      // const walletFromSignature = await recoverMessageAddress({
      //   message: 'public.credentials',
      //   signature: input.signature as `0x{string}`,
      // })
      // if (walletFromSignature != input.wallet) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Unauthorized' });

      // Check last time credentials were issued for this wallet
      const lastTimeIssuedForWallet = (
        await ctx.prisma.credential.aggregate({
          where: {
            issuedTo: input.did,
          },
          _max: {
            issuedAt: true,
          },
        })
      )._max?.issuedAt;

      console.debug('lastTimeIssuedForWallet', lastTimeIssuedForWallet);

      // Check if there are new credentials to issue
      const credentials = await credentialsService.getPublicCredentials(
        input.wallet,
        DID.parse(`did:${input.did}`),
        lastTimeIssuedForWallet ?? undefined
      );

      console.debug('credentials', credentials);

      // Save new credentials
      const saved = await ctx.prisma.credential.createMany({
        data: credentials.map((credential) => ({
          did: credential.id,
          issuedTo: credential.credentialSubject['@id'].toString(),
          type: credential.type.toLocaleString(),
          issuerDid: credential.issuer,
          credential: JSON.parse(JSON.stringify(credential)),
          identifier: getCredentialIdentifier(credential),
        })),
      });

      console.debug('saved', saved);

      if (saved.count !== credentials.length)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Credentials not saved' });

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
      return allCredentials;
    }),
});
