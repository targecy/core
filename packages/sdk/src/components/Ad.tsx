import { Skeleton } from 'antd';
import { ZeroAddress, ethers } from 'ethers';
import React, { useContext } from 'react';
import { Address } from 'wagmi';

import { useAd } from '../hooks/useAd';
import { environment } from '../utils/context';
import { relayerTrpcClient } from '..';
import { useDispatch } from 'react-redux';
import { setEnvironment } from '../utils/environent.state';

import { TargecyContext, TargecyServicesContext } from './misc';
import { BannerLarge } from './layouts/BannerLarge';
import { AdStyling, Layouts, demoAd, defaultStyling, Attribution } from '../constants/ads';
import { LayoutParams } from './layouts/Params';
import { BannerMedium } from './layouts/BannerMedium';
import { BannerSmall } from './layouts/BannerSmall';
import { Square } from './layouts/Square';
import { ListItem } from './layouts/ListItem';
import { SolidityTypes, SolidityTypesNames } from 'src/constants/chain';

type SharedAdProps = {
  isDemo?: boolean;
  customDemo?: {
    attribution?: Attribution;
    title?: string;
    description?: string;
    imageUrl?: string;
    abi?: string;
    paramsSchema?: Record<string, SolidityTypes>;
  };
  publisher: Address;
  env?: environment;
};

export type AdProps = {
  styling?: AdStyling;
} & SharedAdProps;

const getLayoutComponent = (layout: Layouts) => {
  switch (layout) {
    case Layouts.banner_large:
      return BannerLarge;
    case Layouts.banner_medium:
      return BannerMedium;
    case Layouts.banner_small:
      return BannerSmall;
    case Layouts.square:
      return Square;
    case Layouts.list_item:
      return ListItem;

    default:
      throw new Error('Invalid layout');
  }
};

export const Ad = (props: AdProps) => {
  const context = useContext(TargecyServicesContext);
  let { ad, isLoading } = useAd(context);

  if (props.isDemo) {
    ad = demoAd;
    isLoading = false;

    if (props.customDemo) {
      ad = demoAd;
      if (props.customDemo.attribution != undefined) ad.ad.attribution = props.customDemo.attribution;
      if (props.customDemo.description) ad.metadata.description = props.customDemo.description;
      if (props.customDemo.imageUrl) ad.metadata.image = props.customDemo.imageUrl;
      if (props.customDemo.abi) ad.ad.abi = props.customDemo.abi;
      if (props.customDemo.paramsSchema) ad.metadata.paramsSchema = props.customDemo.paramsSchema;
    }
  }

  if (!ad) return <p>No ads were found for you. Try again later.</p>;

  const styling = Object.assign({ ...defaultStyling }, props.styling);
  const adComponent: React.FC<LayoutParams> = getLayoutComponent(styling.layout ?? Layouts.list_item);

  return (
    <TargecyContext>
      {adComponent({
        isLoading,
        title: ad.metadata.title,
        description: ad.metadata.description,
        image: ad.metadata.image,
        link: ad.metadata.link,
        abi: ad.ad.abi,
        attribution: ad.ad.attribution,
        paramsSchema: ad.metadata.paramsSchema,
        styling,
        env: props.env ?? 'production',
      })}
    </TargecyContext>
  );
};
