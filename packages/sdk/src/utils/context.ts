import { ZkServicesType } from '~/components/misc/Context.types';
import { getCircuitStorage, initProofService, initializeStorages } from './zk';

export const initServices = async (): Promise<ZkServicesType> => {
  const storages = initializeStorages();
  const circuitStorage = await getCircuitStorage('client');
  const proofService = initProofService(
    storages.identityWallet,
    storages.credWallet,
    storages.dataStorage.states,
    circuitStorage
  );

  return {
    identityWallet: storages.identityWallet,
    credWallet: storages.credWallet,
    dataStorage: storages.dataStorage,
    circuitStorage,
    proofService,
  };
};

export type environment = 'development' | 'preview' | 'production';
