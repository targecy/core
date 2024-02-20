export type Benefit = {
  protocol: string;
  chains: string[];
  icon: string;
  offer: string;
  link: URL;
};

export const benefits: Benefit[] = [
  {
    protocol: 'GMX',
    chains: ['arbitrum'], // @todo type this
    icon: '/images/protocols/gmx.png',
    offer: '5% OFF', // @todo type this
    link: new URL('https://www.gmx.io/'),
  },
];
