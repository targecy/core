import { ReactNode, createContext, useState } from 'react';
import { useAsync } from 'react-use';
import { ZkServicesType, initServices } from '../../utils/context';
import { UserIdentityType, createUserIdentity } from '../..';
import { Provider } from 'react-redux';
import { store } from '../../utils/store';
import { Config, WagmiConfig, createConfig, configureChains, mainnet } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';

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

export const TargecyComponent = ({ children, ...props }: TargecyComponentProps) => {
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
  }, [initialized]);

  const { chains, publicClient, webSocketPublicClient } = configureChains([mainnet], [publicProvider()]);

  const config = createConfig({
    autoConnect: true,
    publicClient,
    webSocketPublicClient,
  });

  return (
    <WagmiConfig config={config}>
      <Provider store={store}>
        <TargecyServicesContext.Provider value={context}>{children}</TargecyServicesContext.Provider>
      </Provider>
    </WagmiConfig>
  );
};
