import { AvatarComponent } from '@rainbow-me/rainbowkit';
import Image from 'next/legacy/image';

import { useWallet } from '~/hooks';

export const CustomAvatar: AvatarComponent = () => {
  const { connectorId } = useWallet();

  const walletImageUrl = '/images/wallets/user-profile.jpeg';

  return (
    <div className="relative h-[80%] w-[80%]">
      <Image src={walletImageUrl} alt="wallet" layout="fill" objectFit="contain" />
    </div>
  );
};
