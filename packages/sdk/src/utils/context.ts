import { ZkServicesType } from '../components/misc/Context.types';
import { createIssuerIdentity } from './tracking';

import { createUserIdentity, getCircuitStorage, initProofService, initializeStorages } from './zk';

export const initServices = async (): Promise<ZkServicesType> => {
  const storages = initializeStorages();
  const circuitStorage = await getCircuitStorage('client');
  const proofService = initProofService(
    storages.identityWallet,
    storages.credWallet,
    storages.dataStorage.states,
    circuitStorage
  );

  const issuerUrl = window.location.hostname;

  const userIdentity = await createUserIdentity(storages.identityWallet);
  const issuerIdentity = await createIssuerIdentity(storages.identityWallet, issuerUrl.toString());

  return {
    identityWallet: storages.identityWallet,
    credWallet: storages.credWallet,
    dataStorage: storages.dataStorage,
    circuitStorage,
    proofService,
    userIdentity,
    issuerIdentity,
  };
};

export type environment = 'development' | 'preview' | 'production';
