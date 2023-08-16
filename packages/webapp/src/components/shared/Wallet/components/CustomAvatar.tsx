import { AvatarComponent } from "@rainbow-me/rainbowkit";
import Image from "next/legacy/image";

import { useWallet } from "~/hooks";

import { walletImages } from "../Wallet.constants";

export const CustomAvatar: AvatarComponent = () => {
  const { connectorId } = useWallet();

  const walletImageUrl = "/images/wallets/" + walletImages[connectorId];

  return (
    <div className="w-[80%] h-[80%] relative">
      <Image src={walletImageUrl} alt="wallet" layout="fill" objectFit="contain" />
    </div>
  );
};
