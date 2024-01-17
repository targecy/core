import { Skeleton } from 'antd';
import { ethers } from 'ethers';
import { useContext } from 'react';
import { Address } from 'wagmi';

import { useAd } from '../hooks/useAd';
import { environment } from '../utils/context';

import { AdStyling } from './AdLayout';
import { BaseAd } from './BaseAd';
import { TargecyComponent, TargecyServicesContext } from './misc';

export const defaultStyling: AdStyling = {
  width: '500px',
  height: '400px',
  backgroundColor: '#212121',
  titleColor: '#ffffff',
  subtitleColor: '#ffffff',
  borderRadius: '0px',
};

type SharedAdProps = {
  isDemo?: boolean;
  publisher: Address;
  env?: environment;
};

export type AdProps = {
  styling?: AdStyling;
} & SharedAdProps;

const validateMinWidth = (width: string) => {
  if (width.includes('px')) {
    const widthInPixels = parseInt(width.replace('px', ''));
    return widthInPixels >= 300;
  }

  return false;
};

const validateMinHeight = (height: string) => {
  if (height.includes('px')) {
    const heightInPixels = parseInt(height.replace('px', ''));
    return heightInPixels >= 250;
  }

  return false;
};

const isValidStyling = (styling?: AdStyling): boolean =>
  (!styling?.width || validateMinWidth(styling.width)) && (!styling?.height || validateMinHeight(styling.height));

export const AdComponent = (props: AdProps) => {
  const context = useContext(TargecyServicesContext);
  let { ad, isLoading } = useAd(context);

  if (props.isDemo) {
    ad = {
      ad: {
        advertiser: {
          id: ethers.ZeroAddress,
          impressions: 0,
          clicks: 0,
          conversions: 0,
          totalBudget: 0,
          remainingBudget: 0,
          adsQuantity: 0,
        },
        id: '0',
        attribution: 0,
        blacklistedPublishers: [],
        blacklistedWeekdays: [],
        consumptions: 0,
        consumptionsPerDay: [],
        maxConsumptionsPerDay: 9999,
        endingTimestamp: 0,
        maxPricePerConsumption: 0,
        metadataURI: '',
        startingTimestamp: 0,
        remainingBudget: 0,
        audiences: [],
        totalBudget: 0,
      },
      metadata: {
        title: 'Are you looking for the best yield!',
        description: 'Protocol is the best yield aggregator in the world.',
        image:
          'https://cdn.dribbble.com/users/1925451/screenshots/4224926/media/3fec19dcc072afde5c91df61e49cc14e.jpg?resize=400x0',
      },
    };
    isLoading = false;
  }

  if (isLoading) return <Skeleton style={{ width: props.styling?.width, height: props.styling?.height }}></Skeleton>;

  if (!ad) return undefined;

  const {
    ad: { id },
    metadata: { title, description, image },
  } = ad;

  return (
    <BaseAd
      id={id}
      title={title}
      description={description}
      image={image}
      isLoading={isLoading}
      env={props.env || 'production'}
      styling={props.styling}
    />
  );
};

export const Ad = (props: AdProps) => {
  if (!isValidStyling(props.styling)) {
    console.error('Invalid styling. Please review requirements.');

    return <label>Invalid Configuration</label>;
  }

  const style = { ...defaultStyling };
  if (props.styling) Object.assign(style, props.styling);

  return (
    <TargecyComponent>
      <div
        className="card"
        style={{
          width: style?.width,
          height: style?.height,
          overflow: 'hidden',
          backgroundColor: style?.backgroundColor,
          borderRadius: style?.borderRadius,
        }}>
        <AdComponent env={props.env} publisher={props.publisher} isDemo={props.isDemo} styling={style} />
      </div>
    </TargecyComponent>
  );
};
