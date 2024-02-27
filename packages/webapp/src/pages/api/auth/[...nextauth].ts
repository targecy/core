import NextAuth, { DefaultSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getCsrfToken } from 'next-auth/react';
import { SiweMessage } from 'siwe';

import { env } from '~/env.mjs';

export type SessionData = {
  address: string;
} & DefaultSession;

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
        const data: Partial<SessionData> = {
          address: token.sub,
        };

        session.user = data;

        return session;
      },
      jwt({ token }: { token: any }) {
        return token;
      },
    },
  });
}
