import { ethers } from 'ethers';
import { z } from 'zod';

export const isValidEvmAddress = (potentialAddress: string): boolean => ethers.utils.isAddress(potentialAddress);

export const evmAddressStringSchema = z
  .string()
  .refine((value) => isValidEvmAddress(value), { message: 'Invalid evm address string.' });

export type AddressString = z.infer<typeof evmAddressStringSchema>;
