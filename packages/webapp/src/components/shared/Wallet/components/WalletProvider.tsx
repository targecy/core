import '@rainbow-me/rainbowkit/styles.css';
import { darkTheme, getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { RainbowKitSiweNextAuthProvider, GetSiweMessageOptions } from '@rainbow-me/rainbowkit-siwe-next-auth';
import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc';
import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { defineChain } from 'viem';
import { polygonMumbai, polygon, localhost } from 'viem/chains';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';

import { appName } from '../Wallet.constants';

import { isVercelPreview, isVercelProduction } from '~/constants/app.constants';

type DeepWriteable<T> = { -readonly [P in keyof T]: DeepWriteable<T[P]> };

const chain = () => {
  if (isVercelProduction) return polygon;
  if (isVercelPreview)
    return defineChain({
      ...polygonMumbai,
      name: 'Mumbai',
      rpcUrls: {
        default: {
          http: ['https://rpc-mumbai.maticvigil.com'],
        },
        public: {
          http: ['https://rpc-mumbai.maticvigil.com'],
        },
      },
    });
  return localhost;
};

const { chains, publicClient } = configureChains(
  [chain()],
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        http: chain.rpcUrls.default.http[0],
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
  statement: 'Sign in to Targecy',
});

export const WalletProvider = ({ children, session }: WalletProviderProps) => {
  return (
    <WagmiConfig config={wagmiConfig}>
      <SessionProvider session={session}>
        <RainbowKitSiweNextAuthProvider getSiweMessageOptions={getSiweMessageOptions}>
          <RainbowKitProvider modalSize="compact" theme={darkTheme()} chains={chains} appInfo={{ appName }}>
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
