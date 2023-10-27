import { useConnectModal } from '@rainbow-me/rainbowkit';

export const NoWalletConnected = ({ caption }: { caption: string }) => {
  const { openConnectModal } = useConnectModal();

  return (
    <div>
      <div onClick={openConnectModal} className="btn btn-primary w-fit">
        {caption}
      </div>
    </div>
  );
};
