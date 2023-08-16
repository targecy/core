import type { Chain } from '@rainbow-me/rainbowkit';

export const defaultChains: Chain[] = [{ name: 'Localhost', chainId: 31337, rpcUrl: 'http://localhost:8545' }];

export const appName = 'ZetaHub';

export enum ConnectorId {
  METAMASK = 'metaMask',
}

export const walletImages: Record<ConnectorId, string> = {
  [ConnectorId.METAMASK]: '/images/metamask.svg',
};
