import { ethers } from 'ethers';

import deployedAddresses from '../generated/config/config.json' assert { type: 'json' };
import { environment } from '../utils/context';
import { Address } from 'viem';

export const targecyContractAddress = (env: environment): Address => {
  switch (env) {
    case 'development':
      return deployedAddresses['localhost_targecyProxy'] as Address;
    case 'preview':
      return deployedAddresses['mumbai_targecyProxy'] as Address;
    case 'production':
      throw new Error('Set up config for MATIC network');
    default:
      throw new Error(`Unsupported environment: ${env}`);
  }
};
if (!targecyContractAddress) throw new Error('Missing Targecy address');
export const addressZero = ethers.ZeroAddress;
export const BigNumberZero = 0n;
