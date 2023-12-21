import { Targecy, Targecy__factory } from '~generated/contract-types';
import { localhost_targecyProxy, mumbai_targecyProxy } from '../generated/config/config.json';
import { ethers } from 'ethers';

import * as abi from '../generated/abis/Targecy.json';

export const getSettings = () => {
  const env = process.env.NODE_ENV;

  switch (env) {
    case 'development':
      return {
        address: localhost_targecyProxy,
        provider: new ethers.JsonRpcProvider('http://localhost:8545'),
        network: 'localhost',
      };
    case 'staging':
      return {
        network: 'mumbai',
        address: mumbai_targecyProxy,
        provider: new ethers.JsonRpcProvider(
          'https://rpc-mumbai.maticvigil.com/v1/0e5b8e0c0b3f6e0c5b4f4c0e8f6e0c5b4f4c0e8f/'
        ),
      };
    case 'production':
      throw new Error('Set up config for mainnet network');
    default:
      throw new Error('Invalid environment');
  }
};

export const getContract = () => {
  const { address, provider, network } = getSettings();
  if (!process.env.WALLET_PRIVATE_KEY) throw new Error('Set up wallet private key');
  console.log('Wallet private key: ', process.env);
  const signer = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, provider);
  const targecy = new Targecy__factory(signer).attach(address) as Targecy;
  console.debug(
    `Targecy's address: ${address} | Wallet's address: ${signer.address} | Provider ready: ${provider.ready} | Network: ${network}`
  );
  return targecy;
};
