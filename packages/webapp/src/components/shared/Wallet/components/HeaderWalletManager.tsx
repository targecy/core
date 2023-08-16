import { clsx } from '@mantine/core';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export const HeaderWalletManager = () => {
  return (
    <span>wallet</span>
    // <ConnectButton.Custom>
    //   {({ account, chain, openAccountModal, openConnectModal, mounted }) => (
    //     <div
    //       aria-hidden={!mounted}
    //       className={clsx({
    //         'pointer-events-none select-none opacity-0': !mounted,
    //       })}>
    //       {(() => {
    //         if (!mounted || !account || !chain) {
    //           return (
    //             <button className="min-w-[163px]" onClick={openConnectModal}>
    //               connect wallet
    //             </button>
    //           );
    //         }

    //         return (
    //           <button color="info" onClick={openAccountModal}>
    //             {account.address}
    //             {/* <ConnectionIndicator /> */}
    //           </button>
    //         );
    //       })()}
    //     </div>
    //   )}
    // </ConnectButton.Custom>
  );
};
