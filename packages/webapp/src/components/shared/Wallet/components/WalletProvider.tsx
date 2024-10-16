import '@rainbow-me/rainbowkit/styles.css';
import { darkTheme, lightTheme, getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { RainbowKitSiweNextAuthProvider, GetSiweMessageOptions } from '@rainbow-me/rainbowkit-siwe-next-auth';
import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc';
import { SessionProvider } from 'next-auth/react';
import { ReactNode, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { defineChain } from 'viem';
import { polygonAmoy, localhost } from 'viem/chains';
import { configureChains, createConfig, WagmiConfig, Chain } from 'wagmi';

import { IRootState } from '../../../../store/index';
import { appName } from '../Wallet.constants';

import { isVercelPreview, isVercelProduction } from '~/constants/app.constants';

const chain = (): Chain => {
  if (isVercelProduction || isVercelPreview)
    return defineChain({
      ...polygonAmoy,
      name: 'Amoy',
      network: polygonAmoy.name,
      rpcUrls: {
        default: {
          http: ['https://polygon-mainnet.g.alchemy.com/v2/NdeRszEl7KquB4CoT8QF7zfjd-a-IDFX'],
        },
        public: {
          http: ['https://polygon-mainnet.g.alchemy.com/v2/NdeRszEl7KquB4CoT8QF7zfjd-a-IDFX'],
        },
      },
    });
  const customLocalhost = defineChain({
    ...localhost,
    name: 'Localhost',
    network: localhost.name,
    rpcUrls: {
      default: {
        http: ['http://localhost:8545'],
      },
      public: {
        http: ['http://localhost:8545'],
      },
    },
  });

  return customLocalhost;
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
  const themeConfig = useSelector((state: IRootState) => state.themeConfig);
  const [rainbowTheme, setRainbowTheme] = useState(darkTheme());

  useEffect(() => {
    const themeRainbow = themeConfig.isDarkMode ? darkTheme() : lightTheme();
    setRainbowTheme(themeRainbow);
  }, [themeConfig.isDarkMode]);

  return (
    <WagmiConfig config={wagmiConfig}>
      <SessionProvider session={session}>
        <RainbowKitSiweNextAuthProvider getSiweMessageOptions={getSiweMessageOptions}>
          <RainbowKitProvider modalSize="compact" theme={rainbowTheme} chains={chains} appInfo={{ appName }}>
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
