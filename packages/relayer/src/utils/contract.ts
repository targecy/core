import { Targecy, Targecy__factory } from '../generated/contract-types';
import { ethers } from 'ethers';
import localhostConfig from '../generated/config/localhost.json';
import amoyConfig from '../generated/config/amoy.json';
import maticConfig from '../generated/config/matic.json';
import { hostname } from 'os';

import * as abi from '../generated/abis/Targecy.json';

export const getSettings = () => {
  const env = process.env.NODE_ENV;

  switch (env) {
    case 'development':
      return {
        address: localhostConfig[hostname() as keyof typeof localhostConfig],
        provider: new ethers.JsonRpcProvider('http://localhost:8545'),
        network: 'localhost',
      };
    case 'staging':
      return {
        network: 'amoy',
        address: amoyConfig.address,
        provider: new ethers.JsonRpcProvider('https://rpc.ankr.com/polygon_amoy'),
      };
    case 'production':
      return {
        network: 'amoy',
        address: amoyConfig.address,
        provider: new ethers.JsonRpcProvider('https://rpc.ankr.com/polygon_amoy'),
      };
    default:
      throw new Error('Invalid environment');
  }
};

export const getSigner = () => {
  const { provider } = getSettings();
  if (!process.env.PRIVATE_KEY) throw new Error('Set up wallet private key');
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  return signer;
};

console.log("Signer's address: " + getSigner().address);

export const getContract = () => {
  const { address, provider, network } = getSettings();
  const signer = getSigner();
  const targecy = new Targecy__factory(signer).attach(address) as Targecy;
  console.debug(
    `Targecy's address: ${address} | Wallet's address: ${signer.address} | Provider ready: ${provider.ready} | Network: ${network}`
  );
  return targecy;
};
