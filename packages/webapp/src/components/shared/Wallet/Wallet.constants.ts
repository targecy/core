export const appName = 'Targecy';

export enum ConnectorId {
  METAMASK = 'metaMask',
}

export const walletImages: Record<ConnectorId, string> = {
  [ConnectorId.METAMASK]: '/images/metamask.svg',
};
