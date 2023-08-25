import { useAsync } from 'react-use';

import { ZKServices } from './useInitZKServices';

import { createUserIdentity } from '~/utils/zk.utils';

export const useInitUserIdentity = (services?: ZKServices) => {
  const identity = useAsync(async () => {
    if (!services) return;
    return await createUserIdentity(services.identityWallet);
  }, [services]);

  return identity.value;
};
