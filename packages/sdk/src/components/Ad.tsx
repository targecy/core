import { BaseAd, BaseAdStyling } from './BaseAd';
import { Address } from 'wagmi';
import { useAd } from '../hooks/useAd';
import { useContext, useEffect, useState } from 'react';
import { TargecyComponent, TargecyServicesContext } from './misc';
import { ethers } from 'ethers';
import { Skeleton } from 'antd';
import { environment } from '../utils/context';
import { relayerTrpcClient } from '..';
import { useDispatch } from 'react-redux';
import { setEnvironment } from '../utils/environent.state';

const defaultStyling: BaseAdStyling = {
  width: '500px',
  height: '300px',
  backgroundColor: '#212121',
  titleColor: '#ffffff',
  subtitleColor: '#ffffff',
  borderRadius: '15px',
  boxShadow: 'gray 0px 5px 15px',
  border: '1px solid #212121',
};

type SharedAdParams = {
  demo?: {
    title: string;
    description: string;
    image: string;
  };
  publisher: Address;
  env?: environment;
};

type BaseAdParams = {
  styling?: BaseAdStyling;
} & SharedAdParams;

const demoAd = {
  ad: {
    active: true,
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
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setEnvironment(params.env));
  }, [params.env, dispatch]);

  const context = useContext(TargecyServicesContext);
  const [ad, setAd] = useState<ReturnType<typeof useAd>['ad']>();
  const [isLoading, setIsLoading] = useState<ReturnType<typeof useAd>['isLoading']>(true);
  const { ad: adFromNetwork, isLoading: isLoadingFromNetwork } = useAd(context);

  useEffect(() => {
    if (params.demo) {
      const aux = demoAd;
      aux.metadata = params.demo;
      setAd(aux);
      setIsLoading(false);
    } else {
      setAd(adFromNetwork);
      setIsLoading(isLoadingFromNetwork);
    }
  }, [params.demo, adFromNetwork, isLoadingFromNetwork]);

  const [isConsumed, setIsConsumed] = useState(false); // Consume only once.
  const consumeAd = () => {
    if (!ad?.ad) return undefined;

    setIsConsumed(true);
    console.log('Consuming Ad');

    relayerTrpcClient(params.env ?? 'development')
      .txs.consumeAd.mutate({
        adId: ad.ad.id,
        publisher: params.publisher,
        data: '',
      })
      .catch((error) => {
        console.error(error);
      })
      .then((res) => {
        console.debug('Ad Consumed: ', res);
      });
  };

  useEffect(() => {
    if (Number(ad?.ad?.attribution) === 0 && !params.demo && !isConsumed) {
      // Impression attribution
      consumeAd();
    }
  }, [ad?.ad?.attribution, params.demo]); // Execute once, on mount

  if (isLoading) return <Skeleton style={{ width: params.styling?.width, height: params.styling?.height }}></Skeleton>;

  if (!ad) return <p>No ads were found for you. Try again later.</p>;

  if (Number(ad.ad.attribution) === 0 || params.demo)
    return (
      <BaseAd
        {...{
          id: ad.ad.id,
          title: ad.metadata.title,
          description: ad.metadata.description,
          image: ad.metadata.image,
          isLoading,
          env: params.env ?? 'production',
          styling: params.styling,
        }}></BaseAd>
    );

  if (Number(ad.ad.attribution) === 1)
    return (
      <div onClick={consumeAd}>
        <BaseAd
          {...{
            id: ad.ad.id,
            title: ad.metadata.title,
            description: ad.metadata.description,
            image: ad.metadata.image,
            isLoading,
            env: params.env ?? 'production',
            styling: params.styling,
          }}></BaseAd>
      </div>
    );

  if (Number(ad.ad.attribution) === 2) return <p>Conversion attribution not developed yet.</p>;
};

export const Ad = (params: AdParams) => {
  if (!isValidStyling(params.styling)) {
    console.error('Invalid styling. Please review requirements.');

    return <p>Invalid Configuration</p>;
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
          boxShadow: style?.boxShadow,
          border: style?.border,
        }}>
        <AdComponent env={params.env} publisher={params.publisher} demo={params.demo} styling={style} />
      </div>
    </TargecyComponent>
  );
};
