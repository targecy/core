/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { prepareCircuitArrayValues } from '@0xpolygonid/js-sdk';
import { KNOWN_PROTOCOLS, KNOWN_TOKENS } from '@backend/constants/contracts.constants';
import { SCHEMAS } from '@backend/constants/schemas/schemas.constant';
import { MtValue, PoseidonHasher } from '@iden3/js-jsonld-merklization';

const Operators = {
  NOOP: 0n, // No operation, skip query verification in circuit
  EQ: 1n, // equal
  LT: 2n, // less than
  GT: 3n, // greater than
  IN: 4n, // in
  NIN: 5n, // not in
  NE: 6n, // not equal
};

const stringToBigInt = async (str: string): Promise<bigint> => await MtValue.mkValueString(new PoseidonHasher(), str);
const stringToBigIntArray = async (str: string, padding: number): Promise<bigint[]> => prepareCircuitArrayValues([await stringToBigInt(str)], padding);

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const initializeData = async () => {
  const segments: Array<{
    metadata: {
      title: string;
      description: string;
    };
    metadataURI?: string;
    issuer?: bigint;
    query: {
      schema: bigint;
      slotIndex: bigint;
      operator: bigint;
      value: bigint[];
      circuitId: string;
    };
  }> = [
    // Active users on chain
    {
      issuer: Operators.EQ,
      metadata: {
        title: 'Has executed a tx on ethereum',
        description: 'Proves users who have executed a tx on ethereum some time ago.',
      },
      query: {
        schema: BigInt(SCHEMAS.ActiveOnChainTargecySchema.bigint as string),
        slotIndex: BigInt(Object.keys(SCHEMAS.ActiveOnChainTargecySchema.credentialSubject).indexOf('chain') - 1), // 0 is the first added slot -> chain
        operator: Operators.EQ,
        circuitId: 'credentialAtomicQuerySigV2OnChain',
        value: await stringToBigIntArray('ethereum', 64),
      },
    },
    {
      metadata: {
        title: 'Has executed a tx on polygon',
        description: 'Proves users who have executed a tx on polygon some time ago.',
      },
      query: {
        schema: BigInt(SCHEMAS.ActiveOnChainTargecySchema.bigint as string),
        slotIndex: BigInt(Object.keys(SCHEMAS.ActiveOnChainTargecySchema.credentialSubject).indexOf('chain') - 1), // 0 is the first added slot -> chain
        operator: Operators.EQ,
        circuitId: 'credentialAtomicQuerySigV2OnChain',
        value: await stringToBigIntArray('polygon', 64),
      },
    },

    // Token balances
    {
      metadata: {
        title: 'Has balance of USDC',
        description: 'Proves users who have a balance of USDC',
      },
      query: {
        schema: BigInt(SCHEMAS.TokenHolderTargecySchema.bigint as string),
        slotIndex: BigInt(Object.keys(SCHEMAS.TokenHolderTargecySchema.credentialSubject).indexOf('token') - 1),
        operator: Operators.EQ,
        circuitId: 'credentialAtomicQuerySigV2OnChain',
        value: await stringToBigIntArray(KNOWN_TOKENS.ethereum.find((data) => data.symbol === 'USDC')?.address ?? '', 64),
      },
    },
    {
      metadata: {
        title: 'Has balance of LINK',
        description: 'Proves users who have a balance of LINK.',
      },
      query: {
        schema: BigInt(SCHEMAS.TokenHolderTargecySchema.bigint as string),
        slotIndex: BigInt(Object.keys(SCHEMAS.TokenHolderTargecySchema.credentialSubject).indexOf('token') - 1),
        operator: Operators.EQ,
        value: await stringToBigIntArray(KNOWN_TOKENS.ethereum.find((data) => data.symbol === 'LINK')?.address ?? '', 64),
        circuitId: 'credentialAtomicQuerySigV2OnChain',
      },
    },
    {
      metadata: {
        title: 'Has balance of wBTC',
        description: 'Proves users who have a balance of wBTC.',
      },
      query: {
        schema: BigInt(SCHEMAS.TokenHolderTargecySchema.bigint as string),
        slotIndex: BigInt(Object.keys(SCHEMAS.TokenHolderTargecySchema.credentialSubject).indexOf('token') - 1),
        operator: Operators.EQ,
        value: await stringToBigIntArray(KNOWN_TOKENS.ethereum.find((data) => data.symbol === 'wBTC')?.address ?? '', 64),
        circuitId: 'credentialAtomicQuerySigV2OnChain',
      },
    },
    {
      metadata: {
        title: 'Has balance of AXS',
        description: 'Proves users who have a balance of AXS (Axie Infinity Token).',
      },
      query: {
        schema: BigInt(SCHEMAS.TokenHolderTargecySchema.bigint as string),
        slotIndex: BigInt(Object.keys(SCHEMAS.TokenHolderTargecySchema.credentialSubject).indexOf('token') - 1),
        operator: Operators.EQ,
        value: await stringToBigIntArray(KNOWN_TOKENS.ethereum.find((data) => data.symbol === 'AXS')?.address ?? '', 64),
        circuitId: 'credentialAtomicQuerySigV2OnChain',
      },
    },

    // Protocol users
    {
      metadata: {
        title: 'Has interacted with Aave',
        description: 'Proves users who have interacted with Aave.',
      },
      query: {
        schema: BigInt(SCHEMAS.ProtocolUsedTargecySchema.bigint as string),
        slotIndex: BigInt(Object.keys(SCHEMAS.ProtocolUsedTargecySchema.credentialSubject).indexOf('protocol') - 1),
        operator: Operators.EQ,
        value: await stringToBigIntArray(KNOWN_PROTOCOLS.ethereum.find((data) => data.name === 'Aave')?.addresses[0] ?? '', 64),
        circuitId: 'credentialAtomicQuerySigV2OnChain',
      },
    },
    {
      metadata: {
        title: 'Has interacted with Compound',
        description: 'Proves users who have interacted with Compound.',
      },
      query: {
        schema: BigInt(SCHEMAS.ProtocolUsedTargecySchema.bigint as string),
        slotIndex: BigInt(Object.keys(SCHEMAS.ProtocolUsedTargecySchema.credentialSubject).indexOf('protocol') - 1),
        operator: Operators.EQ,
        value: await stringToBigIntArray(KNOWN_PROTOCOLS.ethereum.find((data) => data.name === 'Compound')?.addresses[0] ?? '', 64),
        circuitId: 'credentialAtomicQuerySigV2OnChain',
      },
    },
    {
      metadata: {
        title: 'Has interacted with Uniswap',
        description: 'Proves users who have interacted with Uniswap.',
      },
      query: {
        schema: BigInt(SCHEMAS.ProtocolUsedTargecySchema.bigint as string),
        slotIndex: BigInt(Object.keys(SCHEMAS.ProtocolUsedTargecySchema.credentialSubject).indexOf('protocol') - 1),
        operator: Operators.EQ,
        value: await stringToBigIntArray(KNOWN_PROTOCOLS.ethereum.find((data) => data.name === 'Uniswap')?.addresses[0] ?? '', 64),
        circuitId: 'credentialAtomicQuerySigV2OnChain',
      },
    },
    {
      metadata: {
        title: 'Has interacted with Curve',
        description: 'Proves users who have interacted with Curve.',
      },
      query: {
        schema: BigInt(SCHEMAS.ProtocolUsedTargecySchema.bigint as string),
        slotIndex: BigInt(Object.keys(SCHEMAS.ProtocolUsedTargecySchema.credentialSubject).indexOf('protocol') - 1),
        operator: Operators.EQ,
        value: await stringToBigIntArray(KNOWN_PROTOCOLS.ethereum.find((data) => data.name === 'Curve')?.addresses[0] ?? '', 64),
        circuitId: 'credentialAtomicQuerySigV2OnChain',
      },
    },
    // {
    //   metadata: {
    //     title: 'Has interacted with Lido',
    //     description: 'Proves users who have interacted with Lido.',
    //   },
    //   query: {
    //     schema: BigInt(SCHEMAS.ProtocolUsedTargecySchema.bigint as string),
    //     slotIndex: BigInt(Object.keys(SCHEMAS.ProtocolUsedTargecySchema.credentialSubject).indexOf('protocol') - 1),
    //     operator: Operators.EQ,
    //     value: await stringToBigIntArray(KNOWN_PROTOCOLS.ethereum.find((data) => data.name === 'Lido')?.addresses[0] ?? '', 64),
    //     circuitId: 'credentialAtomicQuerySigV2OnChain',
    //   },
    // },
  ];

  const audiences: Array<{
    metadata: {
      title: string;
      description: string;
    };
    metadataURI?: string;
    segmentIds: number[];
  }> = [
    // Active On Chain
    {
      metadata: {
        title: 'Active on ethereum',
        description: 'Users that have executed a tx on ethereum some time ago.',
      },
      segmentIds: [segments.findIndex((request) => request.metadata.title === 'Has executed a tx on ethereum') + 1],
    },
    {
      metadata: {
        title: 'Active on polygon',
        description: 'Users that have executed a tx on polygon some time ago.',
      },
      segmentIds: [segments.findIndex((request) => request.metadata.title === 'Has executed a tx on polygon') + 1],
    },

    // Token Holders
    {
      metadata: {
        title: 'USDC Holder',
        description: 'Users that hold USDC.',
      },
      segmentIds: [segments.findIndex((request) => request.metadata.title === 'Has balance of USDC') + 1],
    },
    {
      metadata: {
        title: 'LINK Holder',
        description: 'Users that hold LINK.',
      },
      segmentIds: [segments.findIndex((request) => request.metadata.title === 'Has balance of LINK') + 1],
    },
    {
      metadata: {
        title: 'wBTC Holder',
        description: 'Users that hold wBTC.',
      },
      segmentIds: [segments.findIndex((request) => request.metadata.title === 'Has balance of wBTC') + 1],
    },
    {
      metadata: {
        title: 'AXS Holder',
        description: 'Users that hold AXS (Axie Infinity Token).',
      },
      segmentIds: [segments.findIndex((request) => request.metadata.title === 'Has balance of AXS') + 1],
    },

    // Protocol Users
    {
      metadata: {
        title: 'Interacted with Aave',
        description: 'Users that have interacted with Aave.',
      },
      segmentIds: [segments.findIndex((request) => request.metadata.title === 'Has interacted with Aave') + 1],
    },
    {
      metadata: {
        title: 'Interacted with Compound',
        description: 'Users that have interacted with Compound.',
      },
      segmentIds: [segments.findIndex((request) => request.metadata.title === 'Has interacted with Compound') + 1],
    },
    {
      metadata: {
        title: 'Interacted with Uniswap',
        description: 'Users that have interacted with Uniswap.',
      },
      segmentIds: [segments.findIndex((request) => request.metadata.title === 'Has interacted with Uniswap') + 1],
    },
    {
      metadata: {
        title: 'Interacted with Curve',
        description: 'Users that have interacted with Curve.',
      },
      segmentIds: [segments.findIndex((request) => request.metadata.title === 'Has interacted with Curve') + 1],
    },
    // {
    //   metadata: {
    //     title: 'Interacted with Lido',
    //     description: 'Users that have interacted with Lido.',
    //   },
    //   segmentIds: [segments.findIndex((request) => request.metadata.title === 'Has interacted with Lido') + 1],
    // },
  ];

  const ads: Array<{
    metadata: {
      title: string;
      description: string;
      image: string;
    };
    metadataURI?: string;
    attribution: number;
    startingTimestamp: number;
    endingTimestamp: number;
    audiencesIds: number[];
    blacklistedPublishers: string[];
    blacklistedWeekdays: number[];
    budget: bigint;
    maxPricePerConsumption: bigint;
    maxConsumptionsPerDay: number;
  }> = [
    {
      metadata: {
        title: 'Explore Ethereum Ecosystem',
        description: 'Ethereum is the most actively used blockchain.',
        image: 'https://bafkreied5kebp57wdi3qo5ijvszejsnqa5swbpkfbb22yfj27rbpoedw5u.ipfs.nftstorage.link/',
      },
      audiencesIds: [audiences.findIndex((group) => group.metadata.title === 'Active on ethereum') + 1],
      budget: 1000000n,
      startingTimestamp: 0,
      endingTimestamp: 99999999999,
      maxPricePerConsumption: 10000n,
      maxConsumptionsPerDay: 1000000,
      attribution: 0,
      blacklistedPublishers: [],
      blacklistedWeekdays: [],
    },
  ];

  return {
    segments,
    audiences,
    ads,
  };
};
