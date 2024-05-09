import { Ad } from '../generated/graphql.types';
import { AdMetadata } from '../hooks';
import { zeroAddress } from 'viem';

export const Layouts = ['banner_large', 'banner_medium', 'banner_small', 'square', 'list_item'] as const;
export type LayoutsType = (typeof Layouts)[number];
export const isLayout = (layout: string): layout is LayoutsType => {
  return Layouts.includes(layout as LayoutsType);
};

export type AdStyling = {
  layout?: LayoutsType;
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

export const defaultStyling: AdStyling & { layout: LayoutsType } = {
  layout: 'list_item',
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
    abi: 'setValue(uint256)',
    target: zeroAddress,
    id: '0',
    attribution: 2,
    maxBudget: 0,
    currentBudget: 0,
    active: true,
    blacklistedPublishers: [],
    whitelistedPublishers: [],
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
    title: 'Introducing Targecy',
    description: 'Experience the next evolution in digital advertising.',
    image:
      'https://i.ibb.co/3fVNRBx/ad-basic.png',
    link: 'https://targecy.xyz/',
    
  },
};
