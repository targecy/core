import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useMountedState } from 'react-use';
import { useAccount, useNetwork, usePublicClient, useSwitchNetwork, useWalletClient } from 'wagmi';

import { ConnectorId } from '~/components/shared/Wallet/Wallet.constants';

export const useWallet = () => {
  const { address, connector, isConnected, isConnecting } = useAccount();
  const { chain, chains } = useNetwork();
  const signer = useWalletClient();
  const provider = usePublicClient();
  const { switchNetwork } = useSwitchNetwork();
  const { openConnectModal } = useConnectModal();

  const isMounted = useMountedState();

  return {
    address,
    isConnecting,
    signer: signer.data,
    provider,
    chains,
    chainId: chain?.id,
    isConnected: Boolean(isConnected || address) && isMounted(),
    connectorName: connector?.name,
    connectorId: connector?.id as ConnectorId | undefined,
    switchNetwork,
    openConnectModal,
  };
};
