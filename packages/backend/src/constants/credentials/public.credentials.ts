import { ERC1155Holding, KNOWN_PROTOCOL } from 'constants/contracts.constants';
import { SCHEMAS } from 'constants/schemas/schemas.constant';

import { CredentialRequest, CredentialStatusType } from '@0xpolygonid/js-sdk';

type BaseCredentialType = Omit<CredentialRequest, 'credentialSchema' | 'credentialSubject' | 'type'>;

export const baseCredentialRequest: BaseCredentialType = {
  expiration: 12345678888,
  revocationOpts: {
    type: CredentialStatusType.Iden3ReverseSparseMerkleTreeProof,
    id: 'https://rhs-staging.polygonid.me',
  },
};

export function createUsedProtocolCredentialRequest(id: string, knownProtocol: KNOWN_PROTOCOL): CredentialRequest {
  const schema = SCHEMAS['ProtocolUsedTargecySchema'];

  const req = {
    ...baseCredentialRequest,
    ...{
      credentialSubject: {
        id: 'did:iden3:' + id,
        protocol: knownProtocol.name,
      },
      credentialSchema: schema.schemaUrl,
      type: schema.type,
    },
  };

  return req;
}

export function createERC1155HoldingCredentialRequest(id: string, erc1155Holding: ERC1155Holding): CredentialRequest {
  console.log('erc1155Holding', erc1155Holding);

  const schema = SCHEMAS['ERC1155TargecySchema'];

  const req = {
    ...baseCredentialRequest,
    ...{
      credentialSubject: {
        id: 'did:iden3:' + id,
        contractAddress: erc1155Holding.contract,
        tokenId: erc1155Holding.tokenId,
        amount: erc1155Holding.amount,
      },
      credentialSchema: schema.schemaUrl,
      type: schema.type,
    },
  };

  return req;
}
