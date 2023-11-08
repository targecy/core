import { useState } from 'react';
import { useAsync } from 'react-use';
import { W3CCredential } from '@0xpolygonid/js-sdk';
import { TargecyContextType } from '../components/misc/Context';
import { createUserIdentity, getSavedCredentials, saveCredentials } from '../utils';
import { initServices } from '../utils/context';

export const useTargecyContext = () => {
  const [initialized, setInitialized] = useState(false);
  const [context, setContext] = useState<TargecyContextType>({
    zkServices: undefined,
    userIdentity: undefined,
  });

  useAsync(async () => {
    if (!initialized) {
      const zkServices = await initServices();
      const userIdentity = await createUserIdentity(zkServices.identityWallet);

      setContext({ zkServices, userIdentity });
      setInitialized(true);
    }
  }, []);

  return { context, initialized };
};
