import { EthereumNetwork } from '../generated/bitquery.types';
import { getTokenHoldings } from '../trpc/services/external/bitquery.service';
import { AddressString } from '../utils';

type AvailableNetworks = EthereumNetwork;
export const SupportedNetworksIterable = ['ethereum', 'matic'] as const;
type SelectedNetworks = (typeof SupportedNetworksIterable)[number];

export type SUPPORTED_NETWORK = AvailableNetworks & SelectedNetworks;

export const SUPPORTED_NETWORKS_DATA: Record<
  SUPPORTED_NETWORK,
  {
    scanner: string;
    name: string;
    code: SUPPORTED_NETWORK;
  }
> = {
  matic: {
    scanner: 'https://polygonscan.com',
    name: 'Polygon',
    code: 'matic',
  },

  ethereum: {
    scanner: 'https://etherscan.io',
    name: 'Ethereum',
    code: 'ethereum',
  },
};

export enum PROTOCOL_CATEGORY {
  DEX = 'DEX',
  LENDING = 'LENDING',
  GAME = 'GAME',
  STAKING = 'STAKING',
  OTHER = 'OTHER',
}

export type KNOWN_PROTOCOL = {
  name: string;
  category: PROTOCOL_CATEGORY;
  addresses: AddressString[];
  chain: SUPPORTED_NETWORK;
};

// @todo (micael): fill this list with more protocols (you can add more categories as well). Let's try not to have a gigantic list for now.
export const KNOWN_PROTOCOLS: Record<SUPPORTED_NETWORK, KNOWN_PROTOCOL[]> = {
  matic: [
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
      chain: SUPPORTED_NETWORKS_DATA.matic.code,
    },
    {
      name: 'Aave',
      category: PROTOCOL_CATEGORY.LENDING,
      addresses: ['0x794a61358D6845594F94dc1DB02A252b5b4814aD'],
      chain: SUPPORTED_NETWORKS_DATA.matic.code,
    },
  ],
  ethereum: [
    {
      name: 'Aave',
      category: PROTOCOL_CATEGORY.LENDING,
      addresses: ['0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2'],
      chain: SUPPORTED_NETWORKS_DATA.ethereum.code,
    },
    {
      name: 'Compound',
      category: PROTOCOL_CATEGORY.LENDING,
      addresses: ['0xc3d688B66703497DAA19211EEdff47f25384cdc3'],
      chain: SUPPORTED_NETWORKS_DATA.ethereum.code,
    },
    {
      name: 'Uniswap',
      category: PROTOCOL_CATEGORY.DEX,
      addresses: ['0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD', '0xe34139463bA50bD61336E0c446Bd8C0867c6fE65'],
      chain: SUPPORTED_NETWORKS_DATA.ethereum.code,
    },
    {
      name: 'Curve',
      category: PROTOCOL_CATEGORY.DEX,
      addresses: ['0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7'],
      chain: SUPPORTED_NETWORKS_DATA.ethereum.code,
    },
  ],
};

export type TOKEN_TYPE = 'ERC20' | 'ERC721' | 'ERC1155';

export type KNOWN_TOKEN = {
  name: string;
  symbol: string;
  type: TOKEN_TYPE;
  address: AddressString;
  chain: SUPPORTED_NETWORK;
};

// @todo (micael): fill this list with more tokens (ERC20, ERC721, ERC1155). Let's try not to have a gigantic list for now.
export const KNOWN_TOKENS: Record<SUPPORTED_NETWORK, KNOWN_TOKEN[]> = {
  matic: [
    {
      name: 'USDt',
      symbol: 'USDT',
      type: 'ERC20',
      address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
      chain: SUPPORTED_NETWORKS_DATA.matic.code,
    },
  ],
  ethereum: [
    {
      name: 'USDC',
      symbol: 'USDC',
      type: 'ERC20',
      address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      chain: SUPPORTED_NETWORKS_DATA.ethereum.code,
    },
    {
      name: 'USDT',
      symbol: 'USDT',
      type: 'ERC20',
      address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      chain: SUPPORTED_NETWORKS_DATA.ethereum.code,
    },
    {
      name: 'LINK',
      symbol: 'LINK',
      type: 'ERC20',
      address: '0x514910771af9ca656af840dff83e8264ecf986ca',
      chain: SUPPORTED_NETWORKS_DATA.ethereum.code,
    },
    {
      name: 'wBTC',
      symbol: 'wBTC',
      type: 'ERC20',
      address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
      chain: SUPPORTED_NETWORKS_DATA.ethereum.code,
    },
    {
      name: 'AXS',
      symbol: 'AXS',
      type: 'ERC20',
      address: '0xbb0e17ef65f82ab018d8edd776e8dd940327b28b',
      chain: SUPPORTED_NETWORKS_DATA.ethereum.code,
    },
    {
      name: 'Pudgy Penguins',
      symbol: 'PPG',
      type: 'ERC721',
      address: '0xBd3531dA5CF5857e7CfAA92426877b022e612cf8',
      chain: SUPPORTED_NETWORKS_DATA.ethereum.code,
    },
    {
      name: 'Wrapped Liquid Staked Ether 2.0',
      symbol: 'wstETH',
      type: 'ERC20',
      address: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
      chain: SUPPORTED_NETWORKS_DATA.ethereum.code,
    },
    {
      name: 'Rocket Pool ETH',
      symbol: 'rETH',
      type: 'ERC20',
      address: '0xae78736cd615f374d3085123a210448e74fc6393',
      chain: SUPPORTED_NETWORKS_DATA.ethereum.code,
    },
  ],
};

export type TokenHolding = Awaited<ReturnType<typeof getTokenHoldings>>[number];
