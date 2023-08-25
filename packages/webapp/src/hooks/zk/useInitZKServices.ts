import {
  IdentityWallet,
  type ICircuitStorage,
  type IDataStorage,
  type ProofService,
  CredentialWallet,
} from '@0xpolygonid/js-sdk';
import { useAsync } from 'react-use';

import { initializeStorages, getCircuitStorage, initProofService } from '~/utils/zk.utils';

export type ZKServices = {
  identityWallet: IdentityWallet;
  credWallet: CredentialWallet;
  dataStorage: IDataStorage;
  circuitStorage: ICircuitStorage;
  proofService: ProofService;
};

export const useInitZKServices = (): ZKServices | undefined => {
  const services = useAsync(async () => {
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
  }, []);

  return services.value;
};
