import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getCsrfToken } from 'next-auth/react';
import { SiweMessage } from 'siwe';

import { isVercelDevelopment } from '~~/constants/app.constants';
import { env } from '~~/env.mjs';

const WHITELISTED_ADDRESSES = [
  '0x97C9f2450dfb4ae01f776ea3F772F51C3BEFa26a',
  '0xc8e4fcff013b61bea893d54427f1a72691ffe7a2',
  '0xE86ce0450be5bCAb5302d381EB3e6297F874fBd6', // Benja Farres
];
const isBetaUser = (address: string) => WHITELISTED_ADDRESSES.includes(address) || isVercelDevelopment;

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default async function auth(req: any, res: any) {
  const providers = [
    CredentialsProvider({
      name: 'Ethereum',
      credentials: {
        message: {
          label: 'Message',
          type: 'text',
          placeholder: '0x0',
        },
        signature: {
          label: 'Signature',
          type: 'text',
          placeholder: '0x0',
        },
      },
      async authorize(credentials) {
        try {
          const siwe = new SiweMessage(JSON.parse(credentials?.message || '{}'));

          const verifyParams = {
            signature: credentials?.signature || '',
            nonce: await getCsrfToken({ req }),
          };

          const result = await siwe.verify(verifyParams);

          if (!result.success) return { id: 'Could not verify signature.' };

          const isBetaUser = true;
          if (!isBetaUser)
            return {
              id: 'Address is not whitelisted.',
            };

          return {
            id: siwe.address,
          };
        } catch (e) {
          return null;
        }
      },
    }),
  ];

  const isDefaultSigninPage = req.method === 'GET' && req.query.nextauth.includes('signin');

  // Hide Sign-In with Ethereum from default sign page
  if (isDefaultSigninPage) {
    providers.pop();
  }

  return await NextAuth(req, res, {
    providers,
    session: {
      strategy: 'jwt',
    },
    secret: env.NEXTAUTH_SECRET,
    callbacks: {
      session({ session, token }: { session: any; token: any }) {
        session.data = {
          address: token.sub,
          isBetaUser: isBetaUser(token.sub),
        };

        return session;
      },
      jwt({ token }: { token: any }) {
        token.isBetaUser = isBetaUser(token.sub);

        return token;
      },
    },
  });
}
