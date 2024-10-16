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
    // Example for Amoy Testnet (you should add cases for other environments)
    const networkParams =
      props.env === 'preview'
        ? {
            chainId: '0x13882', // Amoy chain id
          }
        : props.env === 'production'
          ? { chainId: '0x89' }
          : { chainId: '0x539' };

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

        const amoyData = {
          chainId: '0x13882', // Amoy chain id
          chainName: 'Amoy Testnet',
          rpcUrls: ['https://rpc.ankr.com/polygon_amoy'],
          nativeCurrency: {
            name: 'MATIC',
            symbol: 'MATIC', // 2-6 characters long
            decimals: 18,
          },
          blockExplorerUrls: ['https://amoy.polygonscan.com'],
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
            params: [localhostData, amoyData, polygonData],
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

  const [signed, setSigned] = useState(false);

  const signForRewards = async () => {
    if (provider && isConnected) {
      await connect();
      const signer = provider.getSigner();
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];

        // Message to sign
        const messageToSign = `0x${Buffer.from('Targecy will store your wallet in order to send you your rewards.', 'utf8').toString('hex')}`;

        // Request the signature from the user's wallet
        const signature = await window.ethereum.request({
          method: 'personal_sign',
          params: [messageToSign, account],
        });

        if (signature) {
          setSigned(true);
        }
      } catch (error) {
        console.error('Error executing transaction:', error);
      }
    } else {
      console.error('Ethereum provider not found or not connected');
    }
  };

  return (
    <div style={{ marginTop: '0.5rem' }}>
      {isConnected ? (
        props.isDemo ? (
          <button
            disabled={signed}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #6c757d',
              backgroundColor: 'transparent',
              color: signed ? '#6c757d' : props.styling.titleColor,
              borderRadius: '0.25rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              opacity: signed ? 0.5 : 1,
            }}
            className="hover:opacity-70"
            onClick={signForRewards}>
            {signed ? 'Done' : 'Sign for rewards'}
          </button>
        ) : (
          <button
            disabled={props.isDemo}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #6c757d',
              backgroundColor: 'transparent',
              color: '#6c757d',
              borderRadius: '0.25rem',
              cursor: props.isDemo ? 'auto' : 'pointer',
              transition: 'all 0.2s',
              opacity: props.isDemo ? 0.5 : 1,
            }}
            onClick={executeTransaction}>
            Execute
          </button>
        )
      ) : (
        <button
          style={{
            padding: '0.5rem 1rem',
            border: '1px solid #6c757d',
            backgroundColor: 'transparent',
            color: '#6c757d',
            borderRadius: '0.25rem',
            cursor: props.isDemo ? 'auto' : 'pointer',
            transition: 'all 0.2s',
            opacity: props.isDemo ? 0.5 : 1,
          }}
          onClick={connect}>
          Connect
        </button>
      )}
      <br />
      {address && (
        <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#718096' }}>
          {shortenAddress(address ?? zeroAddress)} is connected.
        </p>
      )}
    </div>
  );
};
