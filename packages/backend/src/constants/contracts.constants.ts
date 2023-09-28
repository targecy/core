import { AddressString } from 'utils';

export type KNOWN_PROTOCOL = {
  name: string;
  addresses: AddressString[];
};

export const KNOWN_PROTOCOLS: KNOWN_PROTOCOL[] = [
  {
    name: 'Uniswap',
    addresses: [
      '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD',
      '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
      '0x61fFE014bA17989E743c5F6cB21bF9697530B21e',
      '0xE592427A0AEce92De3Edee1F18E0157C05861564',
      '0xB753548F6E010e7e680BA186F9Ca1BdAB2E90cf2',
    ],
  },
];
