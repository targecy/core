import { W3CCredential } from '@0xpolygonid/js-sdk';
import { TargecyContextType } from '../components/misc/Context.types';

import { useCredentials } from './useCredentials';
import { SCHEMA_TYPE, SCHEMA_TYPES, isSchemaType } from '@backend/constants/schemas/schemas.constant';

export enum CredentialCategory {
  Public = 'public',
  Private = 'private',
  Behaviour = 'behaviour',
  Configuration = 'configuration',
}

const getCredentialCategory = (credential: W3CCredential) => {
  const type = credential.type.length > 1 ? credential.type[1] : credential.type[0];

  if (!isSchemaType(type)) {
    return CredentialCategory.Configuration;
  }

  const schemaToCategoryMap = {
    [SCHEMA_TYPES.ProtocolUsedTargecySchema]: CredentialCategory.Public,
    [SCHEMA_TYPES.TokenHolderTargecySchema]: CredentialCategory.Public,
    [SCHEMA_TYPES.ActiveOnChainTargecySchema]: CredentialCategory.Public,
    [SCHEMA_TYPES.PageViewTargecySchema]: CredentialCategory.Behaviour,
    [SCHEMA_TYPES.CustomEventTargecySchema]: CredentialCategory.Behaviour,
    [SCHEMA_TYPES.InterestTargecySchema]: CredentialCategory.Behaviour,
    [SCHEMA_TYPES.ProfileTargecySchema]: CredentialCategory.Public,
  };

  const category = schemaToCategoryMap[type] || CredentialCategory.Configuration;
  if (category === CredentialCategory.Configuration) {
    console.error(`Set category for credential type: ${type}`);
  }
  return category;
};

export const useCredentialsByCategory = (context: TargecyContextType) => {
  const credentials = useCredentials(context);

  const credentialsByCategory = credentials.credentials.reduce(
    (acc, credential) => {
      const category = getCredentialCategory(credential);
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(credential);
      return acc;
    },
    {
      public: [] as W3CCredential[],
      private: [] as W3CCredential[],
      behaviour: [] as W3CCredential[],
      configuration: [] as W3CCredential[],
    }
  );

  return credentialsByCategory;
};
