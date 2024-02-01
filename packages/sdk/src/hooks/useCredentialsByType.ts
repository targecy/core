import { W3CCredential } from '@0xpolygonid/js-sdk';
import { TargecyContextType } from '../components/misc/Context.types';

import { useCredentials } from './useCredentials';

export const useCredentialsByType = (context: TargecyContextType) => {
  const credentials = useCredentials(context);

  const credentialsByType = credentials.credentials.reduce(
    (acc, credential) => {
      const type = credential.type.length > 1 ? credential.type[1] : credential.type[0];
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(credential);
      return acc;
    },
    {} as Record<string, W3CCredential[]>
  );

  return credentialsByType;
};
