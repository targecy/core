import type { Chain } from '@rainbow-me/rainbowkit';

export const defaultChains: Chain[] = [
  {
    name: 'Localhost',
    network: 'localhost',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    id: 1337,
    rpcUrls: { default: { http: ['http://localhost:8545'] }, public: { http: [] } },
  },
];

export const appName = 'ZetaHub';

export enum ConnectorId {
  METAMASK = 'metaMask',
}

export const walletImages: Record<ConnectorId, string> = {
  [ConnectorId.METAMASK]: '/images/metamask.svg',
};
