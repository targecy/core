import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useMountedState } from 'react-use';
import { useAccount, useNetwork, useProvider, useSigner, useSwitchNetwork } from 'wagmi';

import { ConnectorId, defaultChains } from '~/components/shared/Wallet/Wallet.constants';

export const useWallet = () => {
  const { address, isConnected, connector, isConnecting } = useAccount();
  const { chain, chains } = useNetwork();
  const signer = useSigner();
  const provider = useProvider();
  const { switchNetwork } = useSwitchNetwork();
  const { openConnectModal } = useConnectModal();

  const isMounted = useMountedState();

  return {
    address,
    isConnecting,
    signer: signer.data,
    provider,
    chains: chains.length ? chains : defaultChains,
    chainId: chain?.id,
    isConnected: Boolean(isConnected || address) && isMounted(),
    connectorName: connector?.name,
    connectorId: connector?.id as ConnectorId | undefined,
    switchNetwork,
    openConnectModal,
  };
};
