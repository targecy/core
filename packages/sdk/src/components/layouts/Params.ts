import { AdStyling } from 'src/constants';
import { environment } from 'src/utils/context';

export type LayoutParams = {
  isLoading?: boolean;

  title: string;
  description: string;
  image: string;
  link: string;

  attribution: number;
  abi: string;

  styling: AdStyling;

  env: environment;
};
