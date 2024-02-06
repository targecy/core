import { AdMetadata } from '../../hooks';
import { AdStyling } from '../../constants';
import { environment } from '../../utils/context';
import { Address, FallbackTransport } from 'viem';

export type LayoutParams = {
  env: environment;
  isLoading?: boolean;
  styling: AdStyling;

  attribution: number;
  abi: string;
  target: Address;
} & AdMetadata;
