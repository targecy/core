import { TargecyContextType } from '../components/misc/Context.types';
import { useCredentialsByCategory } from './useCredentialsByCategory';

export const useCredentialsStatistics = (context: TargecyContextType) => {
  const credentials = useCredentialsByCategory(context);

  return {
    public: credentials.public.length,
    private: credentials.private.length,
    behaviour: credentials.behaviour.length,
    configuration: credentials.configuration.length,
    total:
      credentials.public.length +
      credentials.private.length +
      credentials.behaviour.length +
      credentials.configuration.length,
  };
};
