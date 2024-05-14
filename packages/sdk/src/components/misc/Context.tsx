import { createContext, useState } from 'react';
import { Provider } from 'react-redux';
import { useAsync } from 'react-use';

import { createUserIdentity } from '../..';
import { ZkServicesInstance } from '../../utils/context';
('../../utils/context');
import { store } from '../../utils/store';

import { TargecyContextType, TargecyContextProps, TargecyBaseProps, ZkServicesType } from './Context.types';

export const TargecyServicesContext = createContext<TargecyContextType>({
  zkServices: undefined,
  userIdentity: undefined,
  initialized: false,
});

export const TargecyContext = ({ children }: TargecyContextProps & TargecyBaseProps) => {
  const [context, setContext] = useState<TargecyContextType>({
    zkServices: undefined,
    userIdentity: undefined,
    initialized: false,
  });

  useAsync(async () => {
    if (!context.initialized) {
      const zkServices = await ZkServicesInstance.initServices();
      setContext({ zkServices, userIdentity: zkServices.userIdentity, initialized: true });
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
