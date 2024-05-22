import { W3CCredential } from '@0xpolygonid/js-sdk';
import { useState } from 'react';
import { useAsync } from 'react-use';

import { TargecyContextType } from '../components/misc/Context.types';
import { getSavedCredentials, saveCredentials } from '../utils';

export const useCredentials = (context: TargecyContextType) => {
  const [credentials, setCredentials] = useState<W3CCredential[]>([]);

  useAsync(async () => {
    if (!context.initialized && context.zkServices && context.userIdentity) {
      // Add saved credentials to the initialized wallet and state
      const savedCredentials = await getSavedCredentials();
      await context.zkServices.credWallet.saveAll(savedCredentials);

      setCredentials(await context.zkServices.credWallet.list());
    }
  },  [credentials, context.initialized, context.zkServices, context.userIdentity]
);

  return { credentials, setCredentials };
};
