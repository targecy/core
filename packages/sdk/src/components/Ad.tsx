import { BaseAd, BaseAdStyling } from './BaseAd';
import { Address, Config } from 'wagmi';
import { useAd } from '../hooks/useAd';
import { useContext } from 'react';
import { TargecyComponent, TargecyServicesContext } from './misc';
import { ethers } from 'ethers';
import { Skeleton } from 'antd';
import { environment } from 'src/utils/context';

const defaultStyling: BaseAdStyling = {
  width: '500px',
  height: '400px',
  backgroundColor: '#212121',
  titleColor: '#ffffff',
  subtitleColor: '#ffffff',
  borderRadius: '0px',
};

type SharedAdParams = {
  isDemo?: boolean;
  publisher: Address;
  env?: environment;
};

type BaseAdParams = {
  styling?: BaseAdStyling;
} & SharedAdParams;

export type AdParams = BaseAdParams;

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

const isValidStyling = (styling?: BaseAdStyling): boolean =>
  (!styling?.width || validateMinWidth(styling.width)) && (!styling?.height || validateMinHeight(styling.height));

export const AdComponent = (params: AdParams) => {
  const context = useContext(TargecyServicesContext);
  let { ad, isLoading } = useAd(context);

  if (params.isDemo) {
    ad = {
      ad: {
        advertiser: {
          id: ethers.ZeroAddress,
          impressions: 0,
        },
        id: '0',
        impressions: 0,
        maxBlock: 0,
        maxImpressionPrice: 0,
        metadataURI: '',
        minBlock: 0,
        remainingBudget: 0,
        targetGroups: [],
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

  if (isLoading) return <Skeleton style={{ width: params.styling?.width, height: params.styling?.height }}></Skeleton>;

  if (!ad) return undefined;

  return BaseAd({
    id: ad.ad.id,
    title: ad.metadata.title,
    description: ad.metadata.description,
    image: ad.metadata.image,
    isLoading,
    env: params.env || 'production',
    styling: params.styling,
  });
};

export const Ad = (params: AdParams) => {
  if (!isValidStyling(params.styling)) {
    console.error('Invalid styling. Please review requirements.');

    return <label>Invalid Configuration</label>;
  }

  const style = { ...defaultStyling };
  if (params.styling) Object.assign(style, params.styling);

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
        <AdComponent env={params.env} publisher={params.publisher} isDemo={params.isDemo} styling={style} />
      </div>
    </TargecyComponent>
  );
};
