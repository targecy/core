import { Ad } from '../generated/graphql.types';
import { AdMetadata } from '../hooks';
import { zeroAddress } from 'viem';

export enum Layouts {
  'banner_large' = 'banner_large',
  'banner_medium' = 'banner_medium',
  'banner_small' = 'banner_small',
  'square' = 'square',
  'list_item' = 'list_item',
}

export type AdStyling = {
  layout?: Layouts;
  backgroundColor?: string;
  titleColor?: string;
  subtitleColor?: string;
  borderRadius?: string; // in pixels
  boxShadow?: string;
  border?: string;
};

export enum Attribution {
  'impression', // 0
  'click', // 1
  'conversion', // 2
}

export const defaultStyling: AdStyling & { layout: Layouts } = {
  layout: Layouts.list_item,
  backgroundColor: '#212121',
  titleColor: '#ffffff',
  subtitleColor: '#ffffff',
  borderRadius: '15px',
  boxShadow: 'black 0px 1px 1px',
  border: '1px solid #212121',
};

export const demoAd: {
  ad: Ad;
  metadata: AdMetadata;
} = {
  ad: {
    advertiser: {
      id: zeroAddress,
      impressions: 0,
      clicks: 0,
      conversions: 0,
      adsQuantity: 0,
      budget: {
        totalBudget: 0,
        remainingBudget: 0,
        id: zeroAddress,
      },
    },
    abi: '',
    target: '',
    id: '0',
    attribution: 2,
    maxBudget: 0,
    currentBudget: 0,
    active: true,
    blacklistedPublishers: [],
    blacklistedWeekdays: [],
    consumptions: 0,
    consumptionsPerDay: [],
    maxConsumptionsPerDay: 9999,
    endingTimestamp: 0,
    maxPricePerConsumption: 0,
    metadataURI: '',
    startingTimestamp: 0,
    audiences: [],
  },
  metadata: {
    title: 'Are you looking for the best yield!',
    description: 'Protocol is the best yield aggregator in the world.',
    image:
      'https://cdn.dribbble.com/users/1925451/screenshots/4224926/media/3fec19dcc072afde5c91df61e49cc14e.jpg?resize=400x0',
    link: 'https://targecy.xyz/',
    paramsSchema: {
      value: 'uint256',
    },
  },
};
