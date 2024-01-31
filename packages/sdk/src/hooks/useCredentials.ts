import { W3CCredential } from '@0xpolygonid/js-sdk';
import { useState } from 'react';
import { useAsync } from 'react-use';

import { TargecyContextType } from '../components/misc/Context.types';
import { getSavedCredentials, saveCredentials } from '../utils';

export const useCredentials = (context: TargecyContextType) => {
  const [initialized, setInitialized] = useState(false);
  const [credentials, setCredentials] = useState<W3CCredential[]>([]);

  useAsync(async () => {
    if (!initialized && context.zkServices && context.userIdentity) {
      setInitialized(true);

      // Add saved credentials to the initialized wallet and state
      const savedCredentials = await getSavedCredentials();
      await context.zkServices.credWallet.saveAll(savedCredentials);

      setCredentials(await context.zkServices.credWallet.list());
    } 
    // else if (context.zkServices && context.userIdentity) {
    //   if (credentials.length > 0) {
    //     console.log('Saving credentials', credentials)
    //     await saveCredentials(credentials);
    //     await context.zkServices?.credWallet.saveAll(credentials);

    //     setCredentials(await context.zkServices.credWallet.list());
    //   }
    // }
  }, [credentials, initialized, context.zkServices, context.userIdentity]);

  return { credentials, setCredentials };
};
