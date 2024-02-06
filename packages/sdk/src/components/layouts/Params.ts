import { AdStyling } from 'src/constants';
import { SolidityTypes } from 'src/constants/chain';
import { AdMetadata } from 'src/hooks';
import { environment } from 'src/utils/context';
import { Address, FallbackTransport } from 'viem';
import { Config, PublicClient, WebSocketPublicClient } from 'wagmi';

export type LayoutParams = {
  env: environment;
  isLoading?: boolean;
  styling: AdStyling;

  attribution: number;
  abi: string;
  target: Address;
} & AdMetadata;
