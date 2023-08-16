import '@rainbow-me/rainbowkit/styles.css';

import { connectorsForWallets, RainbowKitProvider, wallet } from '@rainbow-me/rainbowkit';
import { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { publicProvider } from 'wagmi/providers/public';

import { appName, defaultChains } from '../Wallet.constants';
import { CustomAvatar } from './CustomAvatar';

// const { chains, provider } = configureChains(defaultChains, [
//   jsonRpcProvider({ rpc: (rpcChain) => ({ http: rpcChain.rpcUrls.default }) }),
//   publicProvider(),
// ]);

// const connectors = connectorsForWallets([
//   {
//     groupName: ' ',
//     wallets: [wallet.metaMask({ chains }), wallet.coinbase({ appName, chains })],
//   },
// ]);

// const wagmiClient = createClient({
//   autoConnect: true,
//   connectors,
//   provider,
// });

export const WalletProvider = ({ children }: WalletProviderProps) => {
  return (
    <>{children}</>
    // <WagmiConfig client={wagmiClient}>
    //   <RainbowKitProvider chains={chains} appInfo={{ appName }} avatar={CustomAvatar}>
    //     {children}
    //   </RainbowKitProvider>
    // </WagmiConfig>
  );
};

interface WalletProviderProps {
  children: ReactNode;
}
