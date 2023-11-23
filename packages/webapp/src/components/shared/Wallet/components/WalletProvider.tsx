import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { RainbowKitSiweNextAuthProvider, GetSiweMessageOptions } from '@rainbow-me/rainbowkit-siwe-next-auth';
import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc';
import { SessionProvider } from 'next-auth/react';
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
  autoConnect: true, // TODO Set True and fix hydration issue
  connectors,
  publicClient,
});

const getSiweMessageOptions: GetSiweMessageOptions = () => ({
  statement: 'Sign in to my RainbowKit app',
});

export const WalletProvider = ({ children, session }: WalletProviderProps) => {
  return (
    <WagmiConfig config={wagmiConfig}>
      <SessionProvider session={session}>
        <RainbowKitSiweNextAuthProvider getSiweMessageOptions={getSiweMessageOptions}>
          <RainbowKitProvider chains={chains} appInfo={{ appName }}>
            {children}
          </RainbowKitProvider>
        </RainbowKitSiweNextAuthProvider>
      </SessionProvider>
    </WagmiConfig>
  );
};

interface WalletProviderProps {
  children: ReactNode;
  session?: any;
}
