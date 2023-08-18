import { useConnectModal } from '@rainbow-me/rainbowkit';
import { Button, Typography } from 'antd';

export const NoWalletConnected = ({ caption }: { caption: string }) => {
  const { openConnectModal } = useConnectModal();

  return (
    <div>
      <div onClick={openConnectModal} className="btn btn-primary w-fit">
        Connect Wallet
      </div>
    </div>
  );
};
