import { useEffect, useState } from 'react';
import { LayoutParams } from './Params';
import { ethers } from 'ethers';
import { zeroHash } from 'viem';

export const ConversionButton = (props: LayoutParams, params: Record<string, any>) => {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | undefined>(undefined);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const browserProvider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(browserProvider);
      browserProvider.listAccounts().then((accounts) => {
        setIsConnected(accounts.length > 0);
      });
    }
  }, []);

  const switchNetwork = async () => {
    // Define network parameters based on props.env
    // Example for Mumbai Testnet (you should add cases for other environments)
    const networkParams =
      props.env === 'preview'
        ? {
            chainId: '80001', // Mumbai chain id
          }
        : props.env === 'production'
          ? { chainId: '137' }
          : '1337';

    if (networkParams && provider) {
      try {
        await provider.send('wallet_switchEthereumChain', [networkParams]);
      } catch (switchError) {
        console.error('Error switching network:', switchError);
      }
    }
  };

  const connect = async () => {
    if (provider) {
      await provider.send('eth_requestAccounts', []);
      setIsConnected(true);
      await switchNetwork();
    }
  };

  const executeTransaction = async () => {
    if (provider && isConnected) {
      const signer = provider.getSigner();
      try {
        console.log(
          'Executing transaction:',
          props.target,
          Object.values(props.paramsSchema ?? {}),
          Object.values(params ?? {})
        );
        const res = await signer.sendTransaction({
          to: props.target,
          data: ethers.utils.defaultAbiCoder.encode(
            Object.values(props.paramsSchema ?? {}),
            Object.values(params ?? {})
          ),
        });
        console.log('Transaction result:', res);
      } catch (error) {
        console.error('Error executing transaction:', error);
      }
    } else {
      console.error('Ethereum provider not found or not connected');
    }
  };

  return (
    <div className="mt-2">
      {isConnected ? (
        <button className="btn btn-outline-secondary" onClick={executeTransaction}>
          Execute
        </button>
      ) : (
        <button className="btn btn-outline-secondary" onClick={connect}>
          Connect
        </button>
      )}
    </div>
  );
};
