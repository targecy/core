import { ReactNode } from 'react';
import { Config } from 'wagmi';

import {
  IdentityWallet,
  CredentialWallet,
  CredentialStorage,
  IdentityStorage,
  InMemoryMerkleTreeStorage,
  EthStateStorage,
  CircuitStorage,
  ProofService,
  core,
  W3CCredential,
} from '@0xpolygonid/js-sdk';

export type TargecyContextType = {
  zkServices?: ZkServicesType;
  userIdentity?: UserIdentityType;
};

export interface TargecyComponentProps {
  children?: ReactNode;
}

export interface TargecyBaseProps {
  wagmiConfig?: Config;
}

export type ZkServicesType = {
  identityWallet: IdentityWallet;
  credWallet: CredentialWallet;
  dataStorage: {
    credential: CredentialStorage;
    identity: IdentityStorage;
    mt: InMemoryMerkleTreeStorage;
    states: EthStateStorage;
  };
  circuitStorage: CircuitStorage;
  proofService: ProofService;
};

export type UserIdentityType = {
  did: core.DID;
  credential: W3CCredential;
};
