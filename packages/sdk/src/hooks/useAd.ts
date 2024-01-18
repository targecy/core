import { TargecyContextType } from '../components/misc/Context.types';

import { useAds } from './useAds';

export const useAd = (context: TargecyContextType) => {
  const { ads, isLoading } = useAds(context);

  if (!ads.length)
    return {
      ad: undefined,
      isLoading: isLoading,
    };

  const index = 0;
  return {
    ad: ads[index],
    isLoading: isLoading,
  };
};
