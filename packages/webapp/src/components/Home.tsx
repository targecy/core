import { useBlockNumber } from 'wagmi';
import { useWallet } from '~~/hooks';

export const Home = () => {
  const wallet = useWallet();

  return (
    <p>
      Hello: {wallet.address}
    </p>
  );
};
