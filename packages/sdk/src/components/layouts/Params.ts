import { AdStyling } from 'src/constants';
import { SolidityTypes } from 'src/constants/chain';
import { AdMetadata } from 'src/hooks';
import { environment } from 'src/utils/context';

export type LayoutParams = {
  env: environment;
  isLoading?: boolean;
  styling: AdStyling;

  attribution: number;
  abi: string;
} & AdMetadata;
