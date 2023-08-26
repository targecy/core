import '@rainbow-me/rainbowkit/styles.css';
import { darkTheme, getDefaultWallets, midnightTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc';
import { ReactNode } from 'react';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { polygonMumbai, localhost } from 'wagmi/chains';

import { appName } from '../Wallet.constants';

import { isVercelDevelopment } from '~~/constants/app.constants';

const { chains, publicClient } = configureChains(
  [isVercelDevelopment ? localhost : polygonMumbai],
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        http: isVercelDevelopment ? 'http://127.0.0.1:8545' : 'https://rpc.ankr.com/polygon_mumbai',
      }),
    }),
  ]
);
const { connectors } = getDefaultWallets({
  appName: 'Targecy',
  projectId: 'f9753e832046896b8250567dc3231c56',
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: false, // TODO Set True and fix hydration issue
  connectors,
  publicClient,
});

export const WalletProvider = ({ children }: WalletProviderProps) => {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} appInfo={{ appName }}>
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

interface WalletProviderProps {
  children: ReactNode;
}
