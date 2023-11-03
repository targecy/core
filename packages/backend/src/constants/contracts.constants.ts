import { getTokenHoldings } from 'trpc/services/external/bitquery.service';
import { AddressString } from 'utils';

export enum CHAIN {
  MUMBAI = 'MUMBAI',
  POLYGON = 'POLYGON',
  ETHEREUM = 'ETHEREUM',
}

export const SCANNERS: Record<CHAIN, string> = {
  MUMBAI: 'https://mumbai.polygonscan.com',
  POLYGON: 'https://polygonscan.com',
  ETHEREUM: 'https://etherscan.io',
};

export enum PROTOCOL_CATEGORY {
  DEX = 'DEX',
  LENDING = 'LENDING',
  GAME = 'GAME',
  OTHER = 'OTHER',
}

export type KNOWN_PROTOCOL = {
  name: string;
  category: PROTOCOL_CATEGORY;
  addresses: AddressString[];
  chain: CHAIN;
};

// @todo (micael): fill this list with more protocols (you can add more categories as well). Let's try not to have a gigantic list for now.
export const KNOWN_PROTOCOLS: KNOWN_PROTOCOL[] = [
  {
    name: 'Uniswap',
    category: PROTOCOL_CATEGORY.DEX,
    addresses: [
      '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD',
      '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
      '0x61fFE014bA17989E743c5F6cB21bF9697530B21e',
      '0xE592427A0AEce92De3Edee1F18E0157C05861564',
      '0xB753548F6E010e7e680BA186F9Ca1BdAB2E90cf2',
    ],
    chain: CHAIN.POLYGON,
  },
  {
    name: 'Aave',
    category: PROTOCOL_CATEGORY.LENDING,
    addresses: ['0x794a61358D6845594F94dc1DB02A252b5b4814aD'],
    chain: CHAIN.POLYGON,
  },
];

export type TOKEN_TYPE = 'ERC20' | 'ERC721' | 'ERC1155';

export type KNOWN_TOKEN = {
  name: string;
  symbol: string;
  type: TOKEN_TYPE;
  address: AddressString;
  chain: CHAIN;
};

// @todo (micael): fill this list with more tokens (ERC20, ERC721, ERC1155). Let's try not to have a gigantic list for now.
export const KNOWN_TOKENS: KNOWN_TOKEN[] = [
  {
    name: 'USDt',
    symbol: 'USDT',
    type: 'ERC20',
    address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
    chain: CHAIN.POLYGON,
  },
];

export type TokenHolding = Awaited<ReturnType<typeof getTokenHoldings>>[number];
