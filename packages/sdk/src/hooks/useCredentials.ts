import { W3CCredential } from '@0xpolygonid/js-sdk';
import { useState } from 'react';

import { TargecyContextType } from '../components/misc/Context.types';
import { getSavedCredentials, saveCredentials } from '../utils';
import { useAsync } from 'react-use';

export const useCredentials = (context: TargecyContextType) => {
  const [initialized, setInitialized] = useState(false);
  const [credentials, setCredentials] = useState<W3CCredential[]>([]);

  const { zkServices, userIdentity, initialized: contextInitialized } = context;

  useAsync(async () => {
    if (!initialized && zkServices && userIdentity) {
      setInitialized(true);

      // Add saved credentials to the initialized wallet and state
      const savedCredentials = await getSavedCredentials();
      await zkServices.credWallet.saveAll(savedCredentials);
      const credWalletList = await zkServices.credWallet.list();
      setCredentials(credWalletList);
    }
  }, [initialized, contextInitialized, zkServices, userIdentity]);

  return { credentials, setCredentials };
};
