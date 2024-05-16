import { createIssuerIdentity } from './tracking';
import { initializeStorages, getCircuitStorage, createUserIdentity, initProofService } from './zk';
import { ZkServicesType, ZkServicesTypeApp } from '../components/misc/Context.types';

export type environment = 'development' | 'preview' | 'production';

class ZkServices {
  private static instance: ZkServices;
  private services: ZkServicesType | ZkServicesTypeApp | null;
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
  //Download files for circuitStorage and init proofService in background and updated the service object
  async getCircuitStorageAndInitProofService(storages: any) {
    const circuitStorage = await getCircuitStorage('client');
    const proofService = initProofService(
      storages.identityWallet,
      storages.credWallet,
      storages.dataStorage.states,
      circuitStorage
    );
    const currentServices = this.services;
    if (currentServices) {
      const newServices: ZkServicesTypeApp = {
        ...currentServices,  
        proofService,
        circuitStorage
      }
      this.services = newServices;
    }    
  }

  async initServices(): Promise<ZkServicesType | ZkServicesTypeApp> {
    if (!this.initialized) {
      const storages = initializeStorages();
      const issuerUrl = window.location.hostname;

      const userIdentity = await createUserIdentity(storages.identityWallet);
      const issuerIdentity = await createIssuerIdentity(storages.identityWallet, issuerUrl.toString());

      this.services = {
        identityWallet: storages.identityWallet,
        credWallet: storages.credWallet,
        dataStorage: storages.dataStorage,
        userIdentity,
        issuerIdentity,
      };
      this.getCircuitStorageAndInitProofService(storages)
      this.initialized = true;
    }

    return this.services!;
  }

  // Get Updated Object with all Props
  getZkServiceData() {
    return this.services;
  }
}

export const ZkServicesInstance = ZkServices.getInstance();
