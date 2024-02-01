import { isSchemaType } from '../../constants/schemas/schemas.constant';

// @todo improve type
export const getCredentialIdentifier = (credential: any): string => {
  const type = credential.type[0];

  if (!isSchemaType(type)) throw new Error(`Invalid credential type ${type}`);

  switch (type) {
    case 'ProtocolUsedTargecySchema':
      if (typeof credential.credentialSubject.protocol == 'string') return credential.credentialSubject.protocol;
      else throw new Error(`Invalid credential type ${type}`);
    case 'TokenHolderTargecySchema':
      if (typeof credential.credentialSubject.token == 'string') return credential.credentialSubject.token;
      else throw new Error(`Invalid credential type ${type}`);
    default:
      throw new Error(`Invalid credential type ${type}`);
  }
};
