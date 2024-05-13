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
import { ReactNode } from 'react';
import { Config } from 'wagmi';

export type TargecyContextType = {
  zkServices?: ZkServicesType;
  userIdentity?: UserIdentityType;
  initialized?: boolean;
};

export interface TargecyContextProps {
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
  userIdentity: UserIdentityType;
  issuerIdentity: UserIdentityType;
};

export type UserIdentityType = {
  did: core.DID;
  credential: W3CCredential;
};
