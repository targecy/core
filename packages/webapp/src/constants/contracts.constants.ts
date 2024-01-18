import { ethers } from 'ethers';

import { env } from '~/env.mjs';

export const targecyContractAddress = env.NEXT_PUBLIC_TARGECY_CONTRACT_ADDRESS as `0x${string}`;
export const addressZero = ethers.constants.AddressZero;
export const BigNumberZero = ethers.constants.Zero;
