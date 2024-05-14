import { createIssuerIdentity } from './tracking';
import { initializeStorages, getCircuitStorage, createUserIdentity, initProofService } from './zk';
import { ZkServicesType } from '../components/misc/Context.types';

export type environment = 'development' | 'preview' | 'production';

class ZkServices {
  private static instance: ZkServices;
  private services: ZkServicesType | null;
  private initialized: boolean = false;

  private constructor() {
    if (ZkServices.instance) {
      throw new Error("ZkServices is a singleton class. Use ZkServices.getInstance() to get the instance.");
    }
    this.services = null;
  }


  static getInstance(): ZkServices {
    if (!ZkServices.instance) {
      ZkServices.instance = new ZkServices();
    }
    return ZkServices.instance;
  }

  async initServices(): Promise<ZkServicesType> {
    if (!this.initialized) {
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

      this.services = {
        identityWallet: storages.identityWallet,
        credWallet: storages.credWallet,
        dataStorage: storages.dataStorage,
        circuitStorage,
        proofService,
        userIdentity,
        issuerIdentity,
      };

      Object.freeze(this.services)
      this.initialized = true;
    }

    return this.services!;
  }
}

export const ZkServicesInstance = ZkServices.getInstance();
