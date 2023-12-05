import { CredentialRequest, CredentialStatusType } from '@0xpolygonid/js-sdk';
import { DID } from '@iden3/js-iden3-core';
import { EthereumNetwork } from 'generated/bitquery.types';

import {
  TokenHolding as TokenHolding,
  KNOWN_PROTOCOL,
  SUPPORTED_NETWORKS_DATA,
} from '../../constants/contracts.constants';
import { SCHEMAS } from '../../constants/schemas/schemas.constant';

type BaseCredentialType = Omit<CredentialRequest, 'credentialSchema' | 'credentialSubject' | 'type'>;

export const baseCredentialRequest: BaseCredentialType = {
  expiration: 12345678888,
  revocationOpts: {
    type: CredentialStatusType.Iden3ReverseSparseMerkleTreeProof,
    id: 'https://rhs-staging.polygonid.me',
  },
};

export function createUsedProtocolCredentialRequest(did: DID, knownProtocol: KNOWN_PROTOCOL): CredentialRequest {
  const schema = SCHEMAS['ProtocolUsedTargecySchema'];

  const req: CredentialRequest = {
    ...baseCredentialRequest,
    ...{
      credentialSubject: {
        id: 'did:iden3:' + did.id,
        protocol: knownProtocol.name,
      },
      credentialSchema: schema.schemaUrl,
      type: schema.type,
    },
  };

  return req;
}

export function createActiveOnChainCredential(did: DID, network: EthereumNetwork): CredentialRequest {
  const schema = SCHEMAS['ActiveOnChainTargecySchema'];

  const req: CredentialRequest = {
    ...baseCredentialRequest,
    ...{
      credentialSubject: {
        id: 'did:iden3:' + did.id,
        chain: network,
      },
      credentialSchema: schema.schemaUrl,
      type: schema.type,
    },
  };

  return req;
}

export function createTokenHoldingCredentialRequest(did: DID, holding: TokenHolding): CredentialRequest {
  const schema = SCHEMAS['TokenHolderTargecySchema'];

  if (!holding.token) throw new Error('Token not found');

  const req: CredentialRequest = {
    ...baseCredentialRequest,
    ...{
      credentialSubject: {
        id: 'did:iden3:' + did.id,
        token: holding.token,
        amount: holding.amount || 1,
        tokenId: holding.tokenId || '',
      },
      credentialSchema: schema.schemaUrl,
      type: schema.type,
      evidence: {
        id: SUPPORTED_NETWORKS_DATA[holding.chain].scanner + '/tx/' + holding.tx,
        type: 'EthereumTransaction',
      },
      refreshService: {
        id: 'TO_BE_DEVELOPED SEE https://www.w3.org/TR/vc-data-model/#refreshing',
        type: 'TargecyManualRefreshService',
      },
    },
  };

  return req;
}
