import { Address } from 'viem';
import { TargecyContextType } from '../components/misc/Context.types';

import { useAds } from './useAds';

export const useAd = (context: TargecyContextType, params?: { whitelistedAdvertisers: Address[] }) => {
  const { ads, isLoading } = useAds(context, params?.whitelistedAdvertisers);

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
