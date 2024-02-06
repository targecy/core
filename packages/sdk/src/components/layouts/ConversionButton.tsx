import { useEffect, useState } from 'react';
import { LayoutParams } from './Params';
import { ethers } from 'ethers';
import { Address, zeroAddress, zeroHash } from 'viem';
import { useAsync } from 'react-use';

const shortenAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const ConversionButton = ({ props, params }: { props: LayoutParams; params: Record<string, any> }) => {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | undefined>(undefined);
  const [address, setAddress] = useState<Address | undefined>(undefined);
  const [isConnected, setIsConnected] = useState(false);

  useAsync(async () => {
    if (typeof window.ethereum !== 'undefined') {
      const browserProvider = new ethers.providers.Web3Provider(window.ethereum);
      browserProvider.listAccounts().then((accounts) => {
        setIsConnected(accounts.length > 0);
      });
      setProvider(browserProvider);

      const signer = browserProvider?.getSigner();
      const address = await signer?.getAddress();

      setAddress(address as Address);
    }
  }, []);

  const switchNetwork = async () => {
    // Define network parameters based on props.env
    // Example for Mumbai Testnet (you should add cases for other environments)
    const networkParams =
      props.env === 'preview'
        ? {
            chainId: '0x13881', // Mumbai chain id
          }
        : props.env === 'production'
          ? { chainId: '0x89' }
          : '0x539';

    if (networkParams && provider) {
      try {
        await provider.send('wallet_switchEthereumChain', [networkParams]);
      } catch (switchError) {
        console.error('Error switching network:', switchError);

        const localhostData = {
          chainId: '0x539',
          chainName: 'Localhost',
          rpcUrls: ['http://localhost:8545'],
          nativeCurrency: {
            name: 'MATIC',
            symbol: 'MATIC', // 2-6 characters long
            decimals: 18,
          },
          blockExplorerUrls: ['http://localhost:8090'],
        };

        const mumbaiData = {
          chainId: '0x13881',
          chainName: 'Mumbai Testnet',
          rpcUrls: ['https://rpc-mumbai.matic.today'],
          nativeCurrency: {
            name: 'MATIC',
            symbol: 'MATIC', // 2-6 characters long
            decimals: 18,
          },
          blockExplorerUrls: ['https://mumbai.polygonscan.com'],
        };

        const polygonData = {
          chainId: '0x89',
          chainName: 'Polygon Mainnet',
          rpcUrls: ['https://rpc-mainnet.maticvigil.com'],
          nativeCurrency: {
            name: 'MATIC',
            symbol: 'MATIC', // 2-6 characters long
            decimals: 18,
          },
          blockExplorerUrls: ['https://polygonscan.com'],
        };

        await window.ethereum
          .request({
            method: 'wallet_addEthereumChain',
            params: [localhostData, mumbaiData, polygonData],
          })
          .catch((error: any) => {
            console.error('Error adding network:', error);
          });
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
      await connect();
      const signer = provider.getSigner();
      try {
        const abi = ['function ' + props.abi];
        const functionName = props.abi.split('(')[0];
        const iface = new ethers.utils.Interface(abi);
        const encodedData = iface.encodeFunctionData(functionName, Object.values(params ?? {}));

        // @dev note: signer.sendTransaction didn't worked for me, so I used window.ethereum.request.
        const response = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [
            {
              from: address,
              to: props.target,
              data: encodedData,
            },
          ],
        });

        console.log('Transaction response:', response);
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
        <button disabled={props.isDemo} className="btn btn-outline-secondary" onClick={executeTransaction}>
          Execute
        </button>
      ) : (
        <button disabled={props.isDemo} className="btn btn-outline-secondary" onClick={connect}>
          Connect
        </button>
      )}
      {address && <span className="mt-2 text-xs text-slate-600 dark:text-slate-400		">{shortenAddress(address ?? zeroAddress)} connected.</span>}
    </div>
  );
};
