import { z } from 'zod';

export const isValidEvmAddress = (potentialAddress: string): boolean =>
  potentialAddress.match(/^0x[a-fA-F0-9]{40}$/) !== null;

export const evmAddressStringSchema = z
  .string()
  .refine((value) => isValidEvmAddress(value), { message: 'Invalid evm address string.' });

export type AddressString = z.infer<typeof evmAddressStringSchema>;
