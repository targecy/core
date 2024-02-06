import React, { useContext } from 'react';
import { BannerLarge, BannerMedium, BannerSmall, Square, ListItem } from './layouts';
import { TargecyServicesContext } from './misc';
import { useAd } from '../hooks/useAd';
import { demoAd, defaultStyling, Layouts, Attribution, AdStyling } from '../constants/ads';
import { LayoutParams } from './layouts/Params';
import { SolidityTypes } from '../constants/chain';
import { Address, FallbackTransport } from 'viem';
import { environment } from '../utils/context';

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

export const Ad = (props: AdProps) => {
  const context = useContext(TargecyServicesContext);
  let { ad, isLoading } = useAd(context);

  if (props.isDemo) {
    ad = { ...demoAd };
    isLoading = false;

    if (props.customDemo) {
      if (props.customDemo.attribution !== undefined) ad.ad.attribution = props.customDemo.attribution;
      if (props.customDemo.title) ad.metadata.title = props.customDemo.title;
      if (props.customDemo.description) ad.metadata.description = props.customDemo.description;
      if (props.customDemo.imageUrl) ad.metadata.image = props.customDemo.imageUrl;
      if (props.customDemo.abi) ad.ad.abi = props.customDemo.abi;
      if (props.customDemo.paramsSchema) ad.metadata.paramsSchema = props.customDemo.paramsSchema;
    }
  }

  if (!ad) return <p>No ads were found for you. Try again later.</p>;

  const styling = { ...defaultStyling, ...props.styling };
  const layoutProps: LayoutParams = {
    isLoading,
    title: ad.metadata.title,
    description: ad.metadata.description,
    image: ad.metadata.image,
    link: ad.metadata.link,
    abi: ad.ad.abi,
    target: ad.ad.target as Address,
    attribution: ad.ad.attribution,
    paramsSchema: ad.metadata.paramsSchema,
    publisher: props.publisher,
    styling,
    adId: ad.ad.id,
    env: props.env ?? 'production',
    isDemo: props.isDemo,
  };

  switch (styling.layout) {
    case 'banner_large':
      return <BannerLarge {...layoutProps} />;
    case 'banner_medium':
      return <BannerMedium {...layoutProps} />;
    case 'banner_small':
      return <BannerSmall {...layoutProps} />;
    case 'square':
      return <Square {...layoutProps} />;
    case 'list_item':
      return <ListItem {...layoutProps} />;
    default:
      throw new Error('Invalid layout');
  }
};
