import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { publicProvider } from '@wagmi/core/providers/public';
import { ReactNode, createContext, useState } from 'react';
import { Provider } from 'react-redux';
import { useAsync } from 'react-use';
import { Config, WagmiConfig, createConfig, configureChains, mainnet, createStorage } from 'wagmi';

import { UserIdentityType, createUserIdentity } from '../..';
import { ZkServicesType, initServices } from '../../utils/context';
import { store } from '../../utils/store';

export type TargecyContextType = {
  zkServices?: ZkServicesType;
  userIdentity?: UserIdentityType;
};

export const TargecyServicesContext = createContext<TargecyContextType>({
  zkServices: undefined,
  userIdentity: undefined,
});

export interface TargecyComponentProps {
  children?: ReactNode;
}

export interface TargecyBaseProps {
  wagmiConfig?: Config;
}

export const TargecyComponent = ({ children, ...props }: TargecyComponentProps & TargecyBaseProps) => {
  const [initialized, setInitialized] = useState(false);

  const [context, setContext] = useState<TargecyContextType>({
    zkServices: undefined,
    userIdentity: undefined,
  });

  useAsync(async () => {
    if (!initialized) {
      const zkServices = await initServices();
      const userIdentity = await createUserIdentity(zkServices.identityWallet);

      setContext({ zkServices, userIdentity });
      setInitialized(true);
    }
  }, []);

  // const { chains, publicClient } = configureChains([mainnet], [publicProvider()]);

  // const { connectors } = getDefaultWallets({
  //   appName: 'Targecy',
  //   projectId: 'f9753e832046896b8250567dc3231c56',
  //   chains,
  // });
  // const config = createConfig({
  //   autoConnect: true,
  //   connectors,
  //   publicClient,
  // });

  return (
    // <WagmiConfig config={config}>
      <Provider store={store}>
        <TargecyServicesContext.Provider value={context}>{children}</TargecyServicesContext.Provider>
      </Provider>
    // </WagmiConfig>
  );
};
