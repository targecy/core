import { TargecyContextType } from '../components/misc/Context.types';

import { useCredentials } from './useCredentials';

export const useCredentialsStatistics = (context: TargecyContextType) => {
  const credentials = useCredentials(context);

  const publicCredentialsQuantity = credentials.credentials.length; // currently all are public data credentials;
  const privateCredentialsQuantity = 0; // currently no private data credentials;
  const behaviourCredentialsQuantity = 0; // currently no behaviour data credentials;

  return {
    public: publicCredentialsQuantity,
    behaviour: behaviourCredentialsQuantity,
    private: privateCredentialsQuantity,
    total: publicCredentialsQuantity + behaviourCredentialsQuantity + privateCredentialsQuantity,
  };
};
