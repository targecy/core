import type { Chain } from '@rainbow-me/rainbowkit';

export const defaultChains: Chain[] = [
  { name: 'Localhost', network: 'localhost', id: 31337, rpcUrls: { default: 'http://localhost:8545' } },
];

export const appName = 'ZetaHub';

export enum ConnectorId {
  METAMASK = 'metaMask',
}

export const walletImages: Record<ConnectorId, string> = {
  [ConnectorId.METAMASK]: '/images/metamask.svg',
};
