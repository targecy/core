import { useState } from 'react';
import { useAsync } from 'react-use';
import { cloneCredential } from '../utils/zk';
import { CredentialStatusType, W3CCredential } from '@0xpolygonid/js-sdk';
import { TargecyContextType } from '../components/misc/Context';

export const useCredentials = (context: TargecyContextType) => {
  const [initialized, setInitialized] = useState(false);
  const [credentials, setCredentials] = useState<W3CCredential[]>([]);

  useAsync(async () => {
    if (!initialized && context.zkServices && context.userIdentity) {
      setInitialized(true);
      const credentialsReceived = JSON.parse(localStorage.getItem('credentials') || '[]');
      const cloned = credentialsReceived.map(cloneCredential);

      
      await context.zkServices.dataStorage.credential.saveAllCredentials(cloned);

      setCredentials(await context.zkServices.credWallet.list());
    } else {
      if (credentials.length > 0) {
        localStorage.setItem(
          'credentials',
          JSON.stringify(credentials.filter((c) => !c.type.includes('AuthBJJCredential')))
        );
      }
    }
  }, [credentials, initialized, context.zkServices, context.userIdentity]);


  return credentials;
};
