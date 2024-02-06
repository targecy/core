import { AdMetadata } from '../../hooks';
import { AdStyling } from '../../constants';
import { environment } from '../../utils/context';
import { Address, FallbackTransport } from 'viem';

export type LayoutParams = {
  env: environment;
  isLoading?: boolean;
  styling: AdStyling;
  isDemo?: boolean;

  attribution: number;
  abi: string;
  target: Address;
  publisher: Address;

  adId: string;
} & AdMetadata;
