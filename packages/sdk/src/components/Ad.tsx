import { Skeleton } from 'antd';
import { ZeroAddress, ethers } from 'ethers';
import { useContext } from 'react';
import { Address } from 'wagmi';

import { useAd } from '../hooks/useAd';
import { environment } from '../utils/context';
import { relayerTrpcClient } from '..';
import { useDispatch } from 'react-redux';
import { setEnvironment } from '../utils/environent.state';

import { AdStyling } from './AdLayout';
import { BaseAd } from './BaseAd';
import { TargecyContext, TargecyServicesContext } from './misc';

export const defaultStyling: AdStyling = {
  width: '500px',
  height: '300px',
  backgroundColor: '#212121',
  titleColor: '#ffffff',
  subtitleColor: '#ffffff',
  borderRadius: '15px',
  boxShadow: 'gray 0px 5px 15px',
  border: '1px solid #212121',
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
          adsQuantity: 0,
          budget: {
            totalBudget: 0,
            remainingBudget: 0,
            id: ZeroAddress,
          },
        },
        id: '0',
        attribution: 0,
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
      },
    };
    isLoading = false;
  }

  if (isLoading) return <Skeleton style={{ width: props.styling?.width, height: props.styling?.height }}></Skeleton>;

  if (!ad) return <p>No ads were found for you. Try again later.</p>;

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

    return <p>Invalid Configuration</p>;
  }

  const style = { ...defaultStyling };
  if (props.styling) Object.assign(style, props.styling);

  return (
    <TargecyContext>
      <div
        className="card"
        style={{
          width: style?.width,
          height: style?.height,
          overflow: 'hidden',
          backgroundColor: style?.backgroundColor,
          borderRadius: style?.borderRadius,
          boxShadow: style?.boxShadow,
          border: style?.border,
        }}>
        <AdComponent env={props.env} publisher={props.publisher} isDemo={props.isDemo} styling={style} />
      </div>
    </TargecyContext>
  );
};
