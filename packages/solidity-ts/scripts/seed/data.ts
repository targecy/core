export const zkpRequests: Array<{
  metadata: {
    title: string;
    description: string;
  };
  metadataURI?: string;
  query: {
    schema: bigint;
    slotIndex: bigint;
    operator: bigint;
    value: bigint[];
    circuitId: string;
  };
}> = [
  {
    metadata: {
      title: 'Has used a Compound protocol',
      description: 'Proves users who have used a Compound protocol.',
    },
    query: {
      schema: 1n,
      slotIndex: 0n,
      operator: 0n,
      value: [1n],
      circuitId: '0x0',
    },
  },
  {
    metadata: {
      title: 'Has a balance of 1 or more USDC',
      description: 'Proves users who have a balance of 1 or more USDC.',
    },
    query: {
      schema: 2n,
      slotIndex: 0n,
      operator: 0n,
      value: [1n],
      circuitId: '0x0',
    },
  },
];

export const targetGroups: Array<{
  metadata: {
    title: string;
    description: string;
  };
  metadataURI?: string;
  zkpRequestIds: number[];
}> = [
  {
    metadata: {
      title: 'Compound users',
      description: 'Users who have used a Compound protocol.',
    },
    zkpRequestIds: [1],
  },
  {
    metadata: {
      title: 'Users with a balance of 1 or more USDC',
      description: 'Users who have a balance of 1 or more USDC.',
    },
    zkpRequestIds: [2],
  },
];

export const ads: Array<{
  metadata: {
    title: string;
    description: string;
    imageUrl: string;
  };
  metadataURI?: string;
  targetGroupsIds: number[];
  budget: bigint;
  minBlock: number;
  maxBlock: number;
  maxImpressionPrice: bigint;
}> = [
  {
    metadata: {
      title: 'Explore Decentralized Finance',
      description: 'Join the DeFi revolution with Compound.',
      imageUrl: 'https://i0.wp.com/startupdope.com/wp-content/uploads/2023/05/compound-protocol.png?fit=1200%2C628&ssl=1',
    },
    targetGroupsIds: [1],
    budget: 1000n,
    minBlock: 0,
    maxBlock: 100000,
    maxImpressionPrice: 100n,
  },
];
