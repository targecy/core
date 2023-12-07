import { ethers } from 'ethers';

import * as deployedAddresses from '../generated/config/config.json' assert { type: 'json' };

export const targecyContractAddress = deployedAddresses['localhost_targecyProxy'];
if (!targecyContractAddress) throw new Error('Missing Targecy address');
export const addressZero = ethers.ZeroAddress;
export const BigNumberZero = 0n;
