import { getCircuitStorage, initProofService, initializeStorages } from './zk';

export type ZkServicesType = Awaited<ReturnType<typeof initServices>>;

export const initServices = async () => {
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
