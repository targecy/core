import { ReactNode, createContext, useState } from 'react';
import { useAsync } from 'react-use';
import { ZkServicesType, initServices } from '../../utils/context';
import { UserIdentityType, createUserIdentity } from '../..';
import { Provider } from 'react-redux';
import { store } from '../../utils/store';
import { Config, WagmiConfig, mainnet, PublicClient, WebSocketPublicClient } from 'wagmi';

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
  wagmiConfig: Config<PublicClient, WebSocketPublicClient>;
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
      // @todo: Fetch identity from credential stored or create it.
      const userIdentity = await createUserIdentity(zkServices.identityWallet);
      setContext({ zkServices, userIdentity });
      setInitialized(true);
    }
  }, [initialized]);

  return (
    <WagmiConfig config={props.wagmiConfig}>
      <Provider store={store}>
        <TargecyServicesContext.Provider value={context}>{children}</TargecyServicesContext.Provider>
      </Provider>
    </WagmiConfig>
  );
};
