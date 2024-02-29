import { W3CCredential } from '@0xpolygonid/js-sdk';
import { useCredentials, useTargecyContext } from '@targecy/sdk';
import { useEffect } from 'react';
import { useCookie } from 'react-use';

import { useWallet } from '~/hooks';
import { backendTrpcClient } from '~/utils';

const FETCHING_INTERVAL = 1000 * 60 * 60 * 24 * 7; // 1 week

export const OnChainWrapper = ({ children }: { children: React.ReactNode }) => {
  const { address } = useWallet();
  const { context, initialized } = useTargecyContext();
  const { setCredentials } = useCredentials(context);

  const [lastTimeFetched, updateCookie] = useCookie('publicCredentialsLastTimeFetched');

  const getPublicCredentials = (wallet: `0x${string}`, did: string) =>
    backendTrpcClient.credentials.getPublicCredentials
      .query({
        wallet,
        did,
      })
      .then((credentials) => {
        setCredentials(credentials.map(W3CCredential.fromJSON));
        updateCookie(Date.now().toString(), { expires: new Date(Date.now() + FETCHING_INTERVAL) });
        console.info('Public Credentials fetched.');
      })
      .catch(console.error);

  useEffect(() => {
    if (!!address && initialized && context.userIdentity?.did.id && localStorage) {
      const shouldFetch = !lastTimeFetched || Date.now() - parseInt(lastTimeFetched) > FETCHING_INTERVAL;
      if (shouldFetch) {
        console.info('Getting public credentials');
        getPublicCredentials(address as `0x${string}`, context.userIdentity?.did.id);
      } else {
        console.info('Public credentials already fetched in this interval.');
      }
    }
  }, [address, initialized, context.userIdentity?.did.id, lastTimeFetched]);

  return <div>{children}</div>;
};
