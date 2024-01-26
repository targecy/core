import { createContext, useState } from 'react';
import { Provider } from 'react-redux';
import { useAsync } from 'react-use';

import { createUserIdentity } from '../..';
import { initServices } from '../../utils/context';
import { store } from '../../utils/store';

import { TargecyContextType, TargecyComponentProps, TargecyBaseProps } from './Context.types';

export const TargecyServicesContext = createContext<TargecyContextType>({
  zkServices: undefined,
  userIdentity: undefined,
});

export const TargecyComponent = ({ children }: TargecyComponentProps & TargecyBaseProps) => {
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

  return (
    // <WagmiConfig config={config}>
    <Provider store={store}>
      <TargecyServicesContext.Provider value={context}>{children}</TargecyServicesContext.Provider>
    </Provider>
    // </WagmiConfig>
  );
};
