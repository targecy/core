import { TargecyContextType } from '../components/misc/Context';
import { useAds } from './useAds';

export const useAd = (context: TargecyContextType) => {
  const { ads, isLoading } = useAds(context);

  const index = 0;

  return {
    ad: ads[index],
    isLoading: isLoading,
  };
};
