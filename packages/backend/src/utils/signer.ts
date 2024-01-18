import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { polygonMumbai, localhost } from 'viem/chains';

export const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);

export const walletClient = createWalletClient({
  account,
  chain: process.env.NODE_ENV === 'development' ? localhost : polygonMumbai,
  transport: http(),
});
