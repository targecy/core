import { W3CCredential } from '@0xpolygonid/js-sdk';
import { environment } from './context';
import { backendTrpcClient } from './trpc';

export const updatePotentialReachDatabase = async (env: environment, credential: W3CCredential) => {
  const subject = credential.credentialSubject;
  delete subject.id; // We don't track users data!

  await backendTrpcClient(env).reach.updateReach.mutate({
    type: credential.type.length > 1 ? credential.type[1] : credential.type[0],
    issuer: credential.issuer,
    subject,
  });
};
