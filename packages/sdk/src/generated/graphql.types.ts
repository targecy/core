import { api } from '../services/contractsApi';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigDecimal: any;
  BigInt: any;
  Bytes: any;
  Int8: any;
};

export type Ad = {
  __typename?: 'Ad';
  active: Scalars['Boolean'];
  advertiser: Advertiser;
  attribution: Scalars['Int8'];
  audiences: Array<Audience>;
  blacklistedPublishers: Array<Publisher>;
  blacklistedWeekdays: Array<Scalars['BigInt']>;
  consumptions: Scalars['BigInt'];
  consumptionsPerDay: Array<ConsumptionsPerDay>;
  endingTimestamp: Scalars['BigInt'];
  id: Scalars['ID'];
  maxConsumptionsPerDay: Scalars['BigInt'];
  maxPricePerConsumption: Scalars['BigInt'];
  metadataURI: Scalars['String'];
  remainingBudget: Scalars['BigInt'];
  startingTimestamp: Scalars['BigInt'];
  totalBudget: Scalars['BigInt'];
};


export type AdAudiencesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Audience_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Audience_Filter>;
};


export type AdBlacklistedPublishersArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Publisher_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Publisher_Filter>;
};


export type AdConsumptionsPerDayArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ConsumptionsPerDay_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<ConsumptionsPerDay_Filter>;
};

export type Ad_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  active?: InputMaybe<Scalars['Boolean']>;
  active_in?: InputMaybe<Array<Scalars['Boolean']>>;
  active_not?: InputMaybe<Scalars['Boolean']>;
  active_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  advertiser?: InputMaybe<Scalars['String']>;
  advertiser_?: InputMaybe<Advertiser_Filter>;
  advertiser_contains?: InputMaybe<Scalars['String']>;
  advertiser_contains_nocase?: InputMaybe<Scalars['String']>;
  advertiser_ends_with?: InputMaybe<Scalars['String']>;
  advertiser_ends_with_nocase?: InputMaybe<Scalars['String']>;
  advertiser_gt?: InputMaybe<Scalars['String']>;
  advertiser_gte?: InputMaybe<Scalars['String']>;
  advertiser_in?: InputMaybe<Array<Scalars['String']>>;
  advertiser_lt?: InputMaybe<Scalars['String']>;
  advertiser_lte?: InputMaybe<Scalars['String']>;
  advertiser_not?: InputMaybe<Scalars['String']>;
  advertiser_not_contains?: InputMaybe<Scalars['String']>;
  advertiser_not_contains_nocase?: InputMaybe<Scalars['String']>;
  advertiser_not_ends_with?: InputMaybe<Scalars['String']>;
  advertiser_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  advertiser_not_in?: InputMaybe<Array<Scalars['String']>>;
  advertiser_not_starts_with?: InputMaybe<Scalars['String']>;
  advertiser_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  advertiser_starts_with?: InputMaybe<Scalars['String']>;
  advertiser_starts_with_nocase?: InputMaybe<Scalars['String']>;
  and?: InputMaybe<Array<InputMaybe<Ad_Filter>>>;
  attribution?: InputMaybe<Scalars['Int8']>;
  attribution_gt?: InputMaybe<Scalars['Int8']>;
  attribution_gte?: InputMaybe<Scalars['Int8']>;
  attribution_in?: InputMaybe<Array<Scalars['Int8']>>;
  attribution_lt?: InputMaybe<Scalars['Int8']>;
  attribution_lte?: InputMaybe<Scalars['Int8']>;
  attribution_not?: InputMaybe<Scalars['Int8']>;
  attribution_not_in?: InputMaybe<Array<Scalars['Int8']>>;
  audiences?: InputMaybe<Array<Scalars['String']>>;
  audiences_?: InputMaybe<Audience_Filter>;
  audiences_contains?: InputMaybe<Array<Scalars['String']>>;
  audiences_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  audiences_not?: InputMaybe<Array<Scalars['String']>>;
  audiences_not_contains?: InputMaybe<Array<Scalars['String']>>;
  audiences_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  blacklistedPublishers?: InputMaybe<Array<Scalars['String']>>;
  blacklistedPublishers_?: InputMaybe<Publisher_Filter>;
  blacklistedPublishers_contains?: InputMaybe<Array<Scalars['String']>>;
  blacklistedPublishers_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  blacklistedPublishers_not?: InputMaybe<Array<Scalars['String']>>;
  blacklistedPublishers_not_contains?: InputMaybe<Array<Scalars['String']>>;
  blacklistedPublishers_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  blacklistedWeekdays?: InputMaybe<Array<Scalars['BigInt']>>;
  blacklistedWeekdays_contains?: InputMaybe<Array<Scalars['BigInt']>>;
  blacklistedWeekdays_contains_nocase?: InputMaybe<Array<Scalars['BigInt']>>;
  blacklistedWeekdays_not?: InputMaybe<Array<Scalars['BigInt']>>;
  blacklistedWeekdays_not_contains?: InputMaybe<Array<Scalars['BigInt']>>;
  blacklistedWeekdays_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']>>;
  consumptions?: InputMaybe<Scalars['BigInt']>;
  consumptionsPerDay?: InputMaybe<Array<Scalars['String']>>;
  consumptionsPerDay_?: InputMaybe<ConsumptionsPerDay_Filter>;
  consumptionsPerDay_contains?: InputMaybe<Array<Scalars['String']>>;
  consumptionsPerDay_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  consumptionsPerDay_not?: InputMaybe<Array<Scalars['String']>>;
  consumptionsPerDay_not_contains?: InputMaybe<Array<Scalars['String']>>;
  consumptionsPerDay_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  consumptions_gt?: InputMaybe<Scalars['BigInt']>;
  consumptions_gte?: InputMaybe<Scalars['BigInt']>;
  consumptions_in?: InputMaybe<Array<Scalars['BigInt']>>;
  consumptions_lt?: InputMaybe<Scalars['BigInt']>;
  consumptions_lte?: InputMaybe<Scalars['BigInt']>;
  consumptions_not?: InputMaybe<Scalars['BigInt']>;
  consumptions_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  endingTimestamp?: InputMaybe<Scalars['BigInt']>;
  endingTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  endingTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  endingTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  endingTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  endingTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  endingTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  endingTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  maxConsumptionsPerDay?: InputMaybe<Scalars['BigInt']>;
  maxConsumptionsPerDay_gt?: InputMaybe<Scalars['BigInt']>;
  maxConsumptionsPerDay_gte?: InputMaybe<Scalars['BigInt']>;
  maxConsumptionsPerDay_in?: InputMaybe<Array<Scalars['BigInt']>>;
  maxConsumptionsPerDay_lt?: InputMaybe<Scalars['BigInt']>;
  maxConsumptionsPerDay_lte?: InputMaybe<Scalars['BigInt']>;
  maxConsumptionsPerDay_not?: InputMaybe<Scalars['BigInt']>;
  maxConsumptionsPerDay_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  maxPricePerConsumption?: InputMaybe<Scalars['BigInt']>;
  maxPricePerConsumption_gt?: InputMaybe<Scalars['BigInt']>;
  maxPricePerConsumption_gte?: InputMaybe<Scalars['BigInt']>;
  maxPricePerConsumption_in?: InputMaybe<Array<Scalars['BigInt']>>;
  maxPricePerConsumption_lt?: InputMaybe<Scalars['BigInt']>;
  maxPricePerConsumption_lte?: InputMaybe<Scalars['BigInt']>;
  maxPricePerConsumption_not?: InputMaybe<Scalars['BigInt']>;
  maxPricePerConsumption_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  metadataURI?: InputMaybe<Scalars['String']>;
  metadataURI_contains?: InputMaybe<Scalars['String']>;
  metadataURI_contains_nocase?: InputMaybe<Scalars['String']>;
  metadataURI_ends_with?: InputMaybe<Scalars['String']>;
  metadataURI_ends_with_nocase?: InputMaybe<Scalars['String']>;
  metadataURI_gt?: InputMaybe<Scalars['String']>;
  metadataURI_gte?: InputMaybe<Scalars['String']>;
  metadataURI_in?: InputMaybe<Array<Scalars['String']>>;
  metadataURI_lt?: InputMaybe<Scalars['String']>;
  metadataURI_lte?: InputMaybe<Scalars['String']>;
  metadataURI_not?: InputMaybe<Scalars['String']>;
  metadataURI_not_contains?: InputMaybe<Scalars['String']>;
  metadataURI_not_contains_nocase?: InputMaybe<Scalars['String']>;
  metadataURI_not_ends_with?: InputMaybe<Scalars['String']>;
  metadataURI_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  metadataURI_not_in?: InputMaybe<Array<Scalars['String']>>;
  metadataURI_not_starts_with?: InputMaybe<Scalars['String']>;
  metadataURI_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  metadataURI_starts_with?: InputMaybe<Scalars['String']>;
  metadataURI_starts_with_nocase?: InputMaybe<Scalars['String']>;
  or?: InputMaybe<Array<InputMaybe<Ad_Filter>>>;
  remainingBudget?: InputMaybe<Scalars['BigInt']>;
  remainingBudget_gt?: InputMaybe<Scalars['BigInt']>;
  remainingBudget_gte?: InputMaybe<Scalars['BigInt']>;
  remainingBudget_in?: InputMaybe<Array<Scalars['BigInt']>>;
  remainingBudget_lt?: InputMaybe<Scalars['BigInt']>;
  remainingBudget_lte?: InputMaybe<Scalars['BigInt']>;
  remainingBudget_not?: InputMaybe<Scalars['BigInt']>;
  remainingBudget_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  startingTimestamp?: InputMaybe<Scalars['BigInt']>;
  startingTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  startingTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  startingTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  startingTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  startingTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  startingTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  startingTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalBudget?: InputMaybe<Scalars['BigInt']>;
  totalBudget_gt?: InputMaybe<Scalars['BigInt']>;
  totalBudget_gte?: InputMaybe<Scalars['BigInt']>;
  totalBudget_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalBudget_lt?: InputMaybe<Scalars['BigInt']>;
  totalBudget_lte?: InputMaybe<Scalars['BigInt']>;
  totalBudget_not?: InputMaybe<Scalars['BigInt']>;
  totalBudget_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export enum Ad_OrderBy {
  Active = 'active',
  Advertiser = 'advertiser',
  AdvertiserAdsQuantity = 'advertiser__adsQuantity',
  AdvertiserClicks = 'advertiser__clicks',
  AdvertiserConversions = 'advertiser__conversions',
  AdvertiserId = 'advertiser__id',
  AdvertiserImpressions = 'advertiser__impressions',
  AdvertiserRemainingBudget = 'advertiser__remainingBudget',
  AdvertiserTotalBudget = 'advertiser__totalBudget',
  Attribution = 'attribution',
  Audiences = 'audiences',
  BlacklistedPublishers = 'blacklistedPublishers',
  BlacklistedWeekdays = 'blacklistedWeekdays',
  Consumptions = 'consumptions',
  ConsumptionsPerDay = 'consumptionsPerDay',
  EndingTimestamp = 'endingTimestamp',
  Id = 'id',
  MaxConsumptionsPerDay = 'maxConsumptionsPerDay',
  MaxPricePerConsumption = 'maxPricePerConsumption',
  MetadataUri = 'metadataURI',
  RemainingBudget = 'remainingBudget',
  StartingTimestamp = 'startingTimestamp',
  TotalBudget = 'totalBudget'
}

export type Admin = {
  __typename?: 'Admin';
  id: Scalars['String'];
};

export type Admin_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Admin_Filter>>>;
  id?: InputMaybe<Scalars['String']>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_contains_nocase?: InputMaybe<Scalars['String']>;
  id_ends_with?: InputMaybe<Scalars['String']>;
  id_ends_with_nocase?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_not?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_not_contains_nocase?: InputMaybe<Scalars['String']>;
  id_not_ends_with?: InputMaybe<Scalars['String']>;
  id_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_starts_with?: InputMaybe<Scalars['String']>;
  id_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id_starts_with?: InputMaybe<Scalars['String']>;
  id_starts_with_nocase?: InputMaybe<Scalars['String']>;
  or?: InputMaybe<Array<InputMaybe<Admin_Filter>>>;
};

export enum Admin_OrderBy {
  Id = 'id'
}

export type Advertiser = {
  __typename?: 'Advertiser';
  adsQuantity: Scalars['BigInt'];
  clicks: Scalars['BigInt'];
  conversions: Scalars['BigInt'];
  id: Scalars['String'];
  impressions: Scalars['BigInt'];
  remainingBudget: Scalars['BigInt'];
  totalBudget: Scalars['BigInt'];
};

export type Advertiser_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  adsQuantity?: InputMaybe<Scalars['BigInt']>;
  adsQuantity_gt?: InputMaybe<Scalars['BigInt']>;
  adsQuantity_gte?: InputMaybe<Scalars['BigInt']>;
  adsQuantity_in?: InputMaybe<Array<Scalars['BigInt']>>;
  adsQuantity_lt?: InputMaybe<Scalars['BigInt']>;
  adsQuantity_lte?: InputMaybe<Scalars['BigInt']>;
  adsQuantity_not?: InputMaybe<Scalars['BigInt']>;
  adsQuantity_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  and?: InputMaybe<Array<InputMaybe<Advertiser_Filter>>>;
  clicks?: InputMaybe<Scalars['BigInt']>;
  clicks_gt?: InputMaybe<Scalars['BigInt']>;
  clicks_gte?: InputMaybe<Scalars['BigInt']>;
  clicks_in?: InputMaybe<Array<Scalars['BigInt']>>;
  clicks_lt?: InputMaybe<Scalars['BigInt']>;
  clicks_lte?: InputMaybe<Scalars['BigInt']>;
  clicks_not?: InputMaybe<Scalars['BigInt']>;
  clicks_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  conversions?: InputMaybe<Scalars['BigInt']>;
  conversions_gt?: InputMaybe<Scalars['BigInt']>;
  conversions_gte?: InputMaybe<Scalars['BigInt']>;
  conversions_in?: InputMaybe<Array<Scalars['BigInt']>>;
  conversions_lt?: InputMaybe<Scalars['BigInt']>;
  conversions_lte?: InputMaybe<Scalars['BigInt']>;
  conversions_not?: InputMaybe<Scalars['BigInt']>;
  conversions_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['String']>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_contains_nocase?: InputMaybe<Scalars['String']>;
  id_ends_with?: InputMaybe<Scalars['String']>;
  id_ends_with_nocase?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_not?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_not_contains_nocase?: InputMaybe<Scalars['String']>;
  id_not_ends_with?: InputMaybe<Scalars['String']>;
  id_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_starts_with?: InputMaybe<Scalars['String']>;
  id_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id_starts_with?: InputMaybe<Scalars['String']>;
  id_starts_with_nocase?: InputMaybe<Scalars['String']>;
  impressions?: InputMaybe<Scalars['BigInt']>;
  impressions_gt?: InputMaybe<Scalars['BigInt']>;
  impressions_gte?: InputMaybe<Scalars['BigInt']>;
  impressions_in?: InputMaybe<Array<Scalars['BigInt']>>;
  impressions_lt?: InputMaybe<Scalars['BigInt']>;
  impressions_lte?: InputMaybe<Scalars['BigInt']>;
  impressions_not?: InputMaybe<Scalars['BigInt']>;
  impressions_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  or?: InputMaybe<Array<InputMaybe<Advertiser_Filter>>>;
  remainingBudget?: InputMaybe<Scalars['BigInt']>;
  remainingBudget_gt?: InputMaybe<Scalars['BigInt']>;
  remainingBudget_gte?: InputMaybe<Scalars['BigInt']>;
  remainingBudget_in?: InputMaybe<Array<Scalars['BigInt']>>;
  remainingBudget_lt?: InputMaybe<Scalars['BigInt']>;
  remainingBudget_lte?: InputMaybe<Scalars['BigInt']>;
  remainingBudget_not?: InputMaybe<Scalars['BigInt']>;
  remainingBudget_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalBudget?: InputMaybe<Scalars['BigInt']>;
  totalBudget_gt?: InputMaybe<Scalars['BigInt']>;
  totalBudget_gte?: InputMaybe<Scalars['BigInt']>;
  totalBudget_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalBudget_lt?: InputMaybe<Scalars['BigInt']>;
  totalBudget_lte?: InputMaybe<Scalars['BigInt']>;
  totalBudget_not?: InputMaybe<Scalars['BigInt']>;
  totalBudget_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export enum Advertiser_OrderBy {
  AdsQuantity = 'adsQuantity',
  Clicks = 'clicks',
  Conversions = 'conversions',
  Id = 'id',
  Impressions = 'impressions',
  RemainingBudget = 'remainingBudget',
  TotalBudget = 'totalBudget'
}

export type Audience = {
  __typename?: 'Audience';
  consumptions: Scalars['BigInt'];
  id: Scalars['ID'];
  metadataURI: Scalars['String'];
  segments: Array<Segment>;
};


export type AudienceSegmentsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Segment_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Segment_Filter>;
};

export type Audience_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Audience_Filter>>>;
  consumptions?: InputMaybe<Scalars['BigInt']>;
  consumptions_gt?: InputMaybe<Scalars['BigInt']>;
  consumptions_gte?: InputMaybe<Scalars['BigInt']>;
  consumptions_in?: InputMaybe<Array<Scalars['BigInt']>>;
  consumptions_lt?: InputMaybe<Scalars['BigInt']>;
  consumptions_lte?: InputMaybe<Scalars['BigInt']>;
  consumptions_not?: InputMaybe<Scalars['BigInt']>;
  consumptions_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  metadataURI?: InputMaybe<Scalars['String']>;
  metadataURI_contains?: InputMaybe<Scalars['String']>;
  metadataURI_contains_nocase?: InputMaybe<Scalars['String']>;
  metadataURI_ends_with?: InputMaybe<Scalars['String']>;
  metadataURI_ends_with_nocase?: InputMaybe<Scalars['String']>;
  metadataURI_gt?: InputMaybe<Scalars['String']>;
  metadataURI_gte?: InputMaybe<Scalars['String']>;
  metadataURI_in?: InputMaybe<Array<Scalars['String']>>;
  metadataURI_lt?: InputMaybe<Scalars['String']>;
  metadataURI_lte?: InputMaybe<Scalars['String']>;
  metadataURI_not?: InputMaybe<Scalars['String']>;
  metadataURI_not_contains?: InputMaybe<Scalars['String']>;
  metadataURI_not_contains_nocase?: InputMaybe<Scalars['String']>;
  metadataURI_not_ends_with?: InputMaybe<Scalars['String']>;
  metadataURI_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  metadataURI_not_in?: InputMaybe<Array<Scalars['String']>>;
  metadataURI_not_starts_with?: InputMaybe<Scalars['String']>;
  metadataURI_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  metadataURI_starts_with?: InputMaybe<Scalars['String']>;
  metadataURI_starts_with_nocase?: InputMaybe<Scalars['String']>;
  or?: InputMaybe<Array<InputMaybe<Audience_Filter>>>;
  segments?: InputMaybe<Array<Scalars['String']>>;
  segments_?: InputMaybe<Segment_Filter>;
  segments_contains?: InputMaybe<Array<Scalars['String']>>;
  segments_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  segments_not?: InputMaybe<Array<Scalars['String']>>;
  segments_not_contains?: InputMaybe<Array<Scalars['String']>>;
  segments_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
};

export enum Audience_OrderBy {
  Consumptions = 'consumptions',
  Id = 'id',
  MetadataUri = 'metadataURI',
  Segments = 'segments'
}

export type BlockChangedFilter = {
  number_gte: Scalars['Int'];
};

export type Block_Height = {
  hash?: InputMaybe<Scalars['Bytes']>;
  number?: InputMaybe<Scalars['Int']>;
  number_gte?: InputMaybe<Scalars['Int']>;
};

export type ConsumptionsPerDay = {
  __typename?: 'ConsumptionsPerDay';
  adId: Scalars['ID'];
  consumptions: Scalars['BigInt'];
  day: Scalars['BigInt'];
  id: Scalars['String'];
};

export type ConsumptionsPerDay_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  adId?: InputMaybe<Scalars['ID']>;
  adId_gt?: InputMaybe<Scalars['ID']>;
  adId_gte?: InputMaybe<Scalars['ID']>;
  adId_in?: InputMaybe<Array<Scalars['ID']>>;
  adId_lt?: InputMaybe<Scalars['ID']>;
  adId_lte?: InputMaybe<Scalars['ID']>;
  adId_not?: InputMaybe<Scalars['ID']>;
  adId_not_in?: InputMaybe<Array<Scalars['ID']>>;
  and?: InputMaybe<Array<InputMaybe<ConsumptionsPerDay_Filter>>>;
  consumptions?: InputMaybe<Scalars['BigInt']>;
  consumptions_gt?: InputMaybe<Scalars['BigInt']>;
  consumptions_gte?: InputMaybe<Scalars['BigInt']>;
  consumptions_in?: InputMaybe<Array<Scalars['BigInt']>>;
  consumptions_lt?: InputMaybe<Scalars['BigInt']>;
  consumptions_lte?: InputMaybe<Scalars['BigInt']>;
  consumptions_not?: InputMaybe<Scalars['BigInt']>;
  consumptions_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  day?: InputMaybe<Scalars['BigInt']>;
  day_gt?: InputMaybe<Scalars['BigInt']>;
  day_gte?: InputMaybe<Scalars['BigInt']>;
  day_in?: InputMaybe<Array<Scalars['BigInt']>>;
  day_lt?: InputMaybe<Scalars['BigInt']>;
  day_lte?: InputMaybe<Scalars['BigInt']>;
  day_not?: InputMaybe<Scalars['BigInt']>;
  day_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['String']>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_contains_nocase?: InputMaybe<Scalars['String']>;
  id_ends_with?: InputMaybe<Scalars['String']>;
  id_ends_with_nocase?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_not?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_not_contains_nocase?: InputMaybe<Scalars['String']>;
  id_not_ends_with?: InputMaybe<Scalars['String']>;
  id_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_starts_with?: InputMaybe<Scalars['String']>;
  id_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id_starts_with?: InputMaybe<Scalars['String']>;
  id_starts_with_nocase?: InputMaybe<Scalars['String']>;
  or?: InputMaybe<Array<InputMaybe<ConsumptionsPerDay_Filter>>>;
};

export enum ConsumptionsPerDay_OrderBy {
  AdId = 'adId',
  Consumptions = 'consumptions',
  Day = 'day',
  Id = 'id'
}

export type Issuer = {
  __typename?: 'Issuer';
  id: Scalars['String'];
};

export type Issuer_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Issuer_Filter>>>;
  id?: InputMaybe<Scalars['String']>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_contains_nocase?: InputMaybe<Scalars['String']>;
  id_ends_with?: InputMaybe<Scalars['String']>;
  id_ends_with_nocase?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_not?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_not_contains_nocase?: InputMaybe<Scalars['String']>;
  id_not_ends_with?: InputMaybe<Scalars['String']>;
  id_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_starts_with?: InputMaybe<Scalars['String']>;
  id_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id_starts_with?: InputMaybe<Scalars['String']>;
  id_starts_with_nocase?: InputMaybe<Scalars['String']>;
  or?: InputMaybe<Array<InputMaybe<Issuer_Filter>>>;
};

export enum Issuer_OrderBy {
  Id = 'id'
}

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type Publisher = {
  __typename?: 'Publisher';
  active: Scalars['Boolean'];
  adsQuantity: Scalars['BigInt'];
  clicks: Scalars['BigInt'];
  conversions: Scalars['BigInt'];
  cpa: Scalars['BigInt'];
  cpc: Scalars['BigInt'];
  cpi: Scalars['BigInt'];
  id: Scalars['String'];
  impressions: Scalars['BigInt'];
  usersRewardsPercentage: Scalars['BigInt'];
};

export type Publisher_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  active?: InputMaybe<Scalars['Boolean']>;
  active_in?: InputMaybe<Array<Scalars['Boolean']>>;
  active_not?: InputMaybe<Scalars['Boolean']>;
  active_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  adsQuantity?: InputMaybe<Scalars['BigInt']>;
  adsQuantity_gt?: InputMaybe<Scalars['BigInt']>;
  adsQuantity_gte?: InputMaybe<Scalars['BigInt']>;
  adsQuantity_in?: InputMaybe<Array<Scalars['BigInt']>>;
  adsQuantity_lt?: InputMaybe<Scalars['BigInt']>;
  adsQuantity_lte?: InputMaybe<Scalars['BigInt']>;
  adsQuantity_not?: InputMaybe<Scalars['BigInt']>;
  adsQuantity_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  and?: InputMaybe<Array<InputMaybe<Publisher_Filter>>>;
  clicks?: InputMaybe<Scalars['BigInt']>;
  clicks_gt?: InputMaybe<Scalars['BigInt']>;
  clicks_gte?: InputMaybe<Scalars['BigInt']>;
  clicks_in?: InputMaybe<Array<Scalars['BigInt']>>;
  clicks_lt?: InputMaybe<Scalars['BigInt']>;
  clicks_lte?: InputMaybe<Scalars['BigInt']>;
  clicks_not?: InputMaybe<Scalars['BigInt']>;
  clicks_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  conversions?: InputMaybe<Scalars['BigInt']>;
  conversions_gt?: InputMaybe<Scalars['BigInt']>;
  conversions_gte?: InputMaybe<Scalars['BigInt']>;
  conversions_in?: InputMaybe<Array<Scalars['BigInt']>>;
  conversions_lt?: InputMaybe<Scalars['BigInt']>;
  conversions_lte?: InputMaybe<Scalars['BigInt']>;
  conversions_not?: InputMaybe<Scalars['BigInt']>;
  conversions_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  cpa?: InputMaybe<Scalars['BigInt']>;
  cpa_gt?: InputMaybe<Scalars['BigInt']>;
  cpa_gte?: InputMaybe<Scalars['BigInt']>;
  cpa_in?: InputMaybe<Array<Scalars['BigInt']>>;
  cpa_lt?: InputMaybe<Scalars['BigInt']>;
  cpa_lte?: InputMaybe<Scalars['BigInt']>;
  cpa_not?: InputMaybe<Scalars['BigInt']>;
  cpa_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  cpc?: InputMaybe<Scalars['BigInt']>;
  cpc_gt?: InputMaybe<Scalars['BigInt']>;
  cpc_gte?: InputMaybe<Scalars['BigInt']>;
  cpc_in?: InputMaybe<Array<Scalars['BigInt']>>;
  cpc_lt?: InputMaybe<Scalars['BigInt']>;
  cpc_lte?: InputMaybe<Scalars['BigInt']>;
  cpc_not?: InputMaybe<Scalars['BigInt']>;
  cpc_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  cpi?: InputMaybe<Scalars['BigInt']>;
  cpi_gt?: InputMaybe<Scalars['BigInt']>;
  cpi_gte?: InputMaybe<Scalars['BigInt']>;
  cpi_in?: InputMaybe<Array<Scalars['BigInt']>>;
  cpi_lt?: InputMaybe<Scalars['BigInt']>;
  cpi_lte?: InputMaybe<Scalars['BigInt']>;
  cpi_not?: InputMaybe<Scalars['BigInt']>;
  cpi_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['String']>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_contains_nocase?: InputMaybe<Scalars['String']>;
  id_ends_with?: InputMaybe<Scalars['String']>;
  id_ends_with_nocase?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_not?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_not_contains_nocase?: InputMaybe<Scalars['String']>;
  id_not_ends_with?: InputMaybe<Scalars['String']>;
  id_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_starts_with?: InputMaybe<Scalars['String']>;
  id_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id_starts_with?: InputMaybe<Scalars['String']>;
  id_starts_with_nocase?: InputMaybe<Scalars['String']>;
  impressions?: InputMaybe<Scalars['BigInt']>;
  impressions_gt?: InputMaybe<Scalars['BigInt']>;
  impressions_gte?: InputMaybe<Scalars['BigInt']>;
  impressions_in?: InputMaybe<Array<Scalars['BigInt']>>;
  impressions_lt?: InputMaybe<Scalars['BigInt']>;
  impressions_lte?: InputMaybe<Scalars['BigInt']>;
  impressions_not?: InputMaybe<Scalars['BigInt']>;
  impressions_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  or?: InputMaybe<Array<InputMaybe<Publisher_Filter>>>;
  usersRewardsPercentage?: InputMaybe<Scalars['BigInt']>;
  usersRewardsPercentage_gt?: InputMaybe<Scalars['BigInt']>;
  usersRewardsPercentage_gte?: InputMaybe<Scalars['BigInt']>;
  usersRewardsPercentage_in?: InputMaybe<Array<Scalars['BigInt']>>;
  usersRewardsPercentage_lt?: InputMaybe<Scalars['BigInt']>;
  usersRewardsPercentage_lte?: InputMaybe<Scalars['BigInt']>;
  usersRewardsPercentage_not?: InputMaybe<Scalars['BigInt']>;
  usersRewardsPercentage_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export enum Publisher_OrderBy {
  Active = 'active',
  AdsQuantity = 'adsQuantity',
  Clicks = 'clicks',
  Conversions = 'conversions',
  Cpa = 'cpa',
  Cpc = 'cpc',
  Cpi = 'cpi',
  Id = 'id',
  Impressions = 'impressions',
  UsersRewardsPercentage = 'usersRewardsPercentage'
}

export type Query = {
  __typename?: 'Query';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  ad?: Maybe<Ad>;
  admin?: Maybe<Admin>;
  admins: Array<Admin>;
  ads: Array<Ad>;
  advertiser?: Maybe<Advertiser>;
  advertisers: Array<Advertiser>;
  audience?: Maybe<Audience>;
  audiences: Array<Audience>;
  consumptionsPerDay?: Maybe<ConsumptionsPerDay>;
  consumptionsPerDays: Array<ConsumptionsPerDay>;
  issuer?: Maybe<Issuer>;
  issuers: Array<Issuer>;
  publisher?: Maybe<Publisher>;
  publishers: Array<Publisher>;
  segment?: Maybe<Segment>;
  segments: Array<Segment>;
};


export type Query_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type QueryAdArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryAdminArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryAdminsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Admin_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Admin_Filter>;
};


export type QueryAdsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Ad_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Ad_Filter>;
};


export type QueryAdvertiserArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryAdvertisersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Advertiser_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Advertiser_Filter>;
};


export type QueryAudienceArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryAudiencesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Audience_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Audience_Filter>;
};


export type QueryConsumptionsPerDayArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryConsumptionsPerDaysArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ConsumptionsPerDay_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ConsumptionsPerDay_Filter>;
};


export type QueryIssuerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryIssuersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Issuer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Issuer_Filter>;
};


export type QueryPublisherArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPublishersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Publisher_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Publisher_Filter>;
};


export type QuerySegmentArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerySegmentsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Segment_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Segment_Filter>;
};

export type Segment = {
  __typename?: 'Segment';
  id: Scalars['ID'];
  issuer: Issuer;
  metadataURI: Scalars['String'];
  queryCircuitId: Scalars['String'];
  queryOperator: Scalars['BigInt'];
  querySchema: Scalars['BigInt'];
  querySlotIndex: Scalars['BigInt'];
  queryValue: Array<Scalars['BigInt']>;
  validator: Scalars['String'];
};

export type Segment_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Segment_Filter>>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  issuer?: InputMaybe<Scalars['String']>;
  issuer_?: InputMaybe<Issuer_Filter>;
  issuer_contains?: InputMaybe<Scalars['String']>;
  issuer_contains_nocase?: InputMaybe<Scalars['String']>;
  issuer_ends_with?: InputMaybe<Scalars['String']>;
  issuer_ends_with_nocase?: InputMaybe<Scalars['String']>;
  issuer_gt?: InputMaybe<Scalars['String']>;
  issuer_gte?: InputMaybe<Scalars['String']>;
  issuer_in?: InputMaybe<Array<Scalars['String']>>;
  issuer_lt?: InputMaybe<Scalars['String']>;
  issuer_lte?: InputMaybe<Scalars['String']>;
  issuer_not?: InputMaybe<Scalars['String']>;
  issuer_not_contains?: InputMaybe<Scalars['String']>;
  issuer_not_contains_nocase?: InputMaybe<Scalars['String']>;
  issuer_not_ends_with?: InputMaybe<Scalars['String']>;
  issuer_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  issuer_not_in?: InputMaybe<Array<Scalars['String']>>;
  issuer_not_starts_with?: InputMaybe<Scalars['String']>;
  issuer_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  issuer_starts_with?: InputMaybe<Scalars['String']>;
  issuer_starts_with_nocase?: InputMaybe<Scalars['String']>;
  metadataURI?: InputMaybe<Scalars['String']>;
  metadataURI_contains?: InputMaybe<Scalars['String']>;
  metadataURI_contains_nocase?: InputMaybe<Scalars['String']>;
  metadataURI_ends_with?: InputMaybe<Scalars['String']>;
  metadataURI_ends_with_nocase?: InputMaybe<Scalars['String']>;
  metadataURI_gt?: InputMaybe<Scalars['String']>;
  metadataURI_gte?: InputMaybe<Scalars['String']>;
  metadataURI_in?: InputMaybe<Array<Scalars['String']>>;
  metadataURI_lt?: InputMaybe<Scalars['String']>;
  metadataURI_lte?: InputMaybe<Scalars['String']>;
  metadataURI_not?: InputMaybe<Scalars['String']>;
  metadataURI_not_contains?: InputMaybe<Scalars['String']>;
  metadataURI_not_contains_nocase?: InputMaybe<Scalars['String']>;
  metadataURI_not_ends_with?: InputMaybe<Scalars['String']>;
  metadataURI_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  metadataURI_not_in?: InputMaybe<Array<Scalars['String']>>;
  metadataURI_not_starts_with?: InputMaybe<Scalars['String']>;
  metadataURI_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  metadataURI_starts_with?: InputMaybe<Scalars['String']>;
  metadataURI_starts_with_nocase?: InputMaybe<Scalars['String']>;
  or?: InputMaybe<Array<InputMaybe<Segment_Filter>>>;
  queryCircuitId?: InputMaybe<Scalars['String']>;
  queryCircuitId_contains?: InputMaybe<Scalars['String']>;
  queryCircuitId_contains_nocase?: InputMaybe<Scalars['String']>;
  queryCircuitId_ends_with?: InputMaybe<Scalars['String']>;
  queryCircuitId_ends_with_nocase?: InputMaybe<Scalars['String']>;
  queryCircuitId_gt?: InputMaybe<Scalars['String']>;
  queryCircuitId_gte?: InputMaybe<Scalars['String']>;
  queryCircuitId_in?: InputMaybe<Array<Scalars['String']>>;
  queryCircuitId_lt?: InputMaybe<Scalars['String']>;
  queryCircuitId_lte?: InputMaybe<Scalars['String']>;
  queryCircuitId_not?: InputMaybe<Scalars['String']>;
  queryCircuitId_not_contains?: InputMaybe<Scalars['String']>;
  queryCircuitId_not_contains_nocase?: InputMaybe<Scalars['String']>;
  queryCircuitId_not_ends_with?: InputMaybe<Scalars['String']>;
  queryCircuitId_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  queryCircuitId_not_in?: InputMaybe<Array<Scalars['String']>>;
  queryCircuitId_not_starts_with?: InputMaybe<Scalars['String']>;
  queryCircuitId_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  queryCircuitId_starts_with?: InputMaybe<Scalars['String']>;
  queryCircuitId_starts_with_nocase?: InputMaybe<Scalars['String']>;
  queryOperator?: InputMaybe<Scalars['BigInt']>;
  queryOperator_gt?: InputMaybe<Scalars['BigInt']>;
  queryOperator_gte?: InputMaybe<Scalars['BigInt']>;
  queryOperator_in?: InputMaybe<Array<Scalars['BigInt']>>;
  queryOperator_lt?: InputMaybe<Scalars['BigInt']>;
  queryOperator_lte?: InputMaybe<Scalars['BigInt']>;
  queryOperator_not?: InputMaybe<Scalars['BigInt']>;
  queryOperator_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  querySchema?: InputMaybe<Scalars['BigInt']>;
  querySchema_gt?: InputMaybe<Scalars['BigInt']>;
  querySchema_gte?: InputMaybe<Scalars['BigInt']>;
  querySchema_in?: InputMaybe<Array<Scalars['BigInt']>>;
  querySchema_lt?: InputMaybe<Scalars['BigInt']>;
  querySchema_lte?: InputMaybe<Scalars['BigInt']>;
  querySchema_not?: InputMaybe<Scalars['BigInt']>;
  querySchema_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  querySlotIndex?: InputMaybe<Scalars['BigInt']>;
  querySlotIndex_gt?: InputMaybe<Scalars['BigInt']>;
  querySlotIndex_gte?: InputMaybe<Scalars['BigInt']>;
  querySlotIndex_in?: InputMaybe<Array<Scalars['BigInt']>>;
  querySlotIndex_lt?: InputMaybe<Scalars['BigInt']>;
  querySlotIndex_lte?: InputMaybe<Scalars['BigInt']>;
  querySlotIndex_not?: InputMaybe<Scalars['BigInt']>;
  querySlotIndex_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  queryValue?: InputMaybe<Array<Scalars['BigInt']>>;
  queryValue_contains?: InputMaybe<Array<Scalars['BigInt']>>;
  queryValue_contains_nocase?: InputMaybe<Array<Scalars['BigInt']>>;
  queryValue_not?: InputMaybe<Array<Scalars['BigInt']>>;
  queryValue_not_contains?: InputMaybe<Array<Scalars['BigInt']>>;
  queryValue_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']>>;
  validator?: InputMaybe<Scalars['String']>;
  validator_contains?: InputMaybe<Scalars['String']>;
  validator_contains_nocase?: InputMaybe<Scalars['String']>;
  validator_ends_with?: InputMaybe<Scalars['String']>;
  validator_ends_with_nocase?: InputMaybe<Scalars['String']>;
  validator_gt?: InputMaybe<Scalars['String']>;
  validator_gte?: InputMaybe<Scalars['String']>;
  validator_in?: InputMaybe<Array<Scalars['String']>>;
  validator_lt?: InputMaybe<Scalars['String']>;
  validator_lte?: InputMaybe<Scalars['String']>;
  validator_not?: InputMaybe<Scalars['String']>;
  validator_not_contains?: InputMaybe<Scalars['String']>;
  validator_not_contains_nocase?: InputMaybe<Scalars['String']>;
  validator_not_ends_with?: InputMaybe<Scalars['String']>;
  validator_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  validator_not_in?: InputMaybe<Array<Scalars['String']>>;
  validator_not_starts_with?: InputMaybe<Scalars['String']>;
  validator_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  validator_starts_with?: InputMaybe<Scalars['String']>;
  validator_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum Segment_OrderBy {
  Id = 'id',
  Issuer = 'issuer',
  IssuerId = 'issuer__id',
  MetadataUri = 'metadataURI',
  QueryCircuitId = 'queryCircuitId',
  QueryOperator = 'queryOperator',
  QuerySchema = 'querySchema',
  QuerySlotIndex = 'querySlotIndex',
  QueryValue = 'queryValue',
  Validator = 'validator'
}

export type Subscription = {
  __typename?: 'Subscription';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  ad?: Maybe<Ad>;
  admin?: Maybe<Admin>;
  admins: Array<Admin>;
  ads: Array<Ad>;
  advertiser?: Maybe<Advertiser>;
  advertisers: Array<Advertiser>;
  audience?: Maybe<Audience>;
  audiences: Array<Audience>;
  consumptionsPerDay?: Maybe<ConsumptionsPerDay>;
  consumptionsPerDays: Array<ConsumptionsPerDay>;
  issuer?: Maybe<Issuer>;
  issuers: Array<Issuer>;
  publisher?: Maybe<Publisher>;
  publishers: Array<Publisher>;
  segment?: Maybe<Segment>;
  segments: Array<Segment>;
};


export type Subscription_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type SubscriptionAdArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionAdminArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionAdminsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Admin_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Admin_Filter>;
};


export type SubscriptionAdsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Ad_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Ad_Filter>;
};


export type SubscriptionAdvertiserArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionAdvertisersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Advertiser_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Advertiser_Filter>;
};


export type SubscriptionAudienceArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionAudiencesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Audience_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Audience_Filter>;
};


export type SubscriptionConsumptionsPerDayArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionConsumptionsPerDaysArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ConsumptionsPerDay_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ConsumptionsPerDay_Filter>;
};


export type SubscriptionIssuerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionIssuersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Issuer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Issuer_Filter>;
};


export type SubscriptionPublisherArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPublishersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Publisher_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Publisher_Filter>;
};


export type SubscriptionSegmentArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionSegmentsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Segment_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Segment_Filter>;
};

export type _Block_ = {
  __typename?: '_Block_';
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']>;
  /** The block number */
  number: Scalars['Int'];
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars['Int']>;
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  __typename?: '_Meta_';
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars['String'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean'];
};

export enum _SubgraphErrorPolicy_ {
  /** Data will be returned even if the subgraph has indexing errors */
  Allow = 'allow',
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  Deny = 'deny'
}

export type AdminFragmentFragment = { __typename?: 'Admin', id: string };

export type GetAllAdminsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllAdminsQuery = { __typename?: 'Query', admins: Array<{ __typename?: 'Admin', id: string }> };

export type GetAdminQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetAdminQuery = { __typename?: 'Query', admin?: { __typename?: 'Admin', id: string } | null };

export type AdFragmentFragment = { __typename?: 'Ad', id: string, metadataURI: string, attribution: any, active: boolean, startingTimestamp: any, endingTimestamp: any, blacklistedWeekdays: Array<any>, totalBudget: any, remainingBudget: any, maxConsumptionsPerDay: any, maxPricePerConsumption: any, consumptions: any, advertiser: { __typename?: 'Advertiser', id: string, totalBudget: any, remainingBudget: any, adsQuantity: any, impressions: any, clicks: any, conversions: any }, audiences: Array<{ __typename?: 'Audience', id: string, metadataURI: string, consumptions: any, segments: Array<{ __typename?: 'Segment', id: string, metadataURI: string, validator: string, querySchema: any, querySlotIndex: any, queryOperator: any, queryValue: Array<any>, queryCircuitId: string, issuer: { __typename?: 'Issuer', id: string } }> }>, blacklistedPublishers: Array<{ __typename?: 'Publisher', id: string, active: boolean, cpi: any, cpc: any, cpa: any, usersRewardsPercentage: any, adsQuantity: any, impressions: any, clicks: any, conversions: any }>, consumptionsPerDay: Array<{ __typename?: 'ConsumptionsPerDay', id: string, day: any, adId: string, consumptions: any }> };

export type GetAllAdsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllAdsQuery = { __typename?: 'Query', ads: Array<{ __typename?: 'Ad', id: string, metadataURI: string, attribution: any, active: boolean, startingTimestamp: any, endingTimestamp: any, blacklistedWeekdays: Array<any>, totalBudget: any, remainingBudget: any, maxConsumptionsPerDay: any, maxPricePerConsumption: any, consumptions: any, advertiser: { __typename?: 'Advertiser', id: string, totalBudget: any, remainingBudget: any, adsQuantity: any, impressions: any, clicks: any, conversions: any }, audiences: Array<{ __typename?: 'Audience', id: string, metadataURI: string, consumptions: any, segments: Array<{ __typename?: 'Segment', id: string, metadataURI: string, validator: string, querySchema: any, querySlotIndex: any, queryOperator: any, queryValue: Array<any>, queryCircuitId: string, issuer: { __typename?: 'Issuer', id: string } }> }>, blacklistedPublishers: Array<{ __typename?: 'Publisher', id: string, active: boolean, cpi: any, cpc: any, cpa: any, usersRewardsPercentage: any, adsQuantity: any, impressions: any, clicks: any, conversions: any }>, consumptionsPerDay: Array<{ __typename?: 'ConsumptionsPerDay', id: string, day: any, adId: string, consumptions: any }> }> };

export type GetAdToShowQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAdToShowQuery = { __typename?: 'Query', ads: Array<{ __typename?: 'Ad', id: string, metadataURI: string, attribution: any, active: boolean, startingTimestamp: any, endingTimestamp: any, blacklistedWeekdays: Array<any>, totalBudget: any, remainingBudget: any, maxConsumptionsPerDay: any, maxPricePerConsumption: any, consumptions: any, advertiser: { __typename?: 'Advertiser', id: string, totalBudget: any, remainingBudget: any, adsQuantity: any, impressions: any, clicks: any, conversions: any }, audiences: Array<{ __typename?: 'Audience', id: string, metadataURI: string, consumptions: any, segments: Array<{ __typename?: 'Segment', id: string, metadataURI: string, validator: string, querySchema: any, querySlotIndex: any, queryOperator: any, queryValue: Array<any>, queryCircuitId: string, issuer: { __typename?: 'Issuer', id: string } }> }>, blacklistedPublishers: Array<{ __typename?: 'Publisher', id: string, active: boolean, cpi: any, cpc: any, cpa: any, usersRewardsPercentage: any, adsQuantity: any, impressions: any, clicks: any, conversions: any }>, consumptionsPerDay: Array<{ __typename?: 'ConsumptionsPerDay', id: string, day: any, adId: string, consumptions: any }> }> };

export type GetAdQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetAdQuery = { __typename?: 'Query', ad?: { __typename?: 'Ad', id: string, metadataURI: string, attribution: any, active: boolean, startingTimestamp: any, endingTimestamp: any, blacklistedWeekdays: Array<any>, totalBudget: any, remainingBudget: any, maxConsumptionsPerDay: any, maxPricePerConsumption: any, consumptions: any, advertiser: { __typename?: 'Advertiser', id: string, totalBudget: any, remainingBudget: any, adsQuantity: any, impressions: any, clicks: any, conversions: any }, audiences: Array<{ __typename?: 'Audience', id: string, metadataURI: string, consumptions: any, segments: Array<{ __typename?: 'Segment', id: string, metadataURI: string, validator: string, querySchema: any, querySlotIndex: any, queryOperator: any, queryValue: Array<any>, queryCircuitId: string, issuer: { __typename?: 'Issuer', id: string } }> }>, blacklistedPublishers: Array<{ __typename?: 'Publisher', id: string, active: boolean, cpi: any, cpc: any, cpa: any, usersRewardsPercentage: any, adsQuantity: any, impressions: any, clicks: any, conversions: any }>, consumptionsPerDay: Array<{ __typename?: 'ConsumptionsPerDay', id: string, day: any, adId: string, consumptions: any }> } | null };

export type GetLastAdsQueryVariables = Exact<{
  limit: Scalars['Int'];
}>;


export type GetLastAdsQuery = { __typename?: 'Query', ads: Array<{ __typename?: 'Ad', id: string, metadataURI: string, attribution: any, active: boolean, startingTimestamp: any, endingTimestamp: any, blacklistedWeekdays: Array<any>, totalBudget: any, remainingBudget: any, maxConsumptionsPerDay: any, maxPricePerConsumption: any, consumptions: any, advertiser: { __typename?: 'Advertiser', id: string, totalBudget: any, remainingBudget: any, adsQuantity: any, impressions: any, clicks: any, conversions: any }, audiences: Array<{ __typename?: 'Audience', id: string, metadataURI: string, consumptions: any, segments: Array<{ __typename?: 'Segment', id: string, metadataURI: string, validator: string, querySchema: any, querySlotIndex: any, queryOperator: any, queryValue: Array<any>, queryCircuitId: string, issuer: { __typename?: 'Issuer', id: string } }> }>, blacklistedPublishers: Array<{ __typename?: 'Publisher', id: string, active: boolean, cpi: any, cpc: any, cpa: any, usersRewardsPercentage: any, adsQuantity: any, impressions: any, clicks: any, conversions: any }>, consumptionsPerDay: Array<{ __typename?: 'ConsumptionsPerDay', id: string, day: any, adId: string, consumptions: any }> }> };

export type GetAdsByAdvertiserQueryVariables = Exact<{
  advertiserId: Scalars['String'];
}>;


export type GetAdsByAdvertiserQuery = { __typename?: 'Query', ads: Array<{ __typename?: 'Ad', id: string, metadataURI: string, attribution: any, active: boolean, startingTimestamp: any, endingTimestamp: any, blacklistedWeekdays: Array<any>, totalBudget: any, remainingBudget: any, maxConsumptionsPerDay: any, maxPricePerConsumption: any, consumptions: any, advertiser: { __typename?: 'Advertiser', id: string, totalBudget: any, remainingBudget: any, adsQuantity: any, impressions: any, clicks: any, conversions: any }, audiences: Array<{ __typename?: 'Audience', id: string, metadataURI: string, consumptions: any, segments: Array<{ __typename?: 'Segment', id: string, metadataURI: string, validator: string, querySchema: any, querySlotIndex: any, queryOperator: any, queryValue: Array<any>, queryCircuitId: string, issuer: { __typename?: 'Issuer', id: string } }> }>, blacklistedPublishers: Array<{ __typename?: 'Publisher', id: string, active: boolean, cpi: any, cpc: any, cpa: any, usersRewardsPercentage: any, adsQuantity: any, impressions: any, clicks: any, conversions: any }>, consumptionsPerDay: Array<{ __typename?: 'ConsumptionsPerDay', id: string, day: any, adId: string, consumptions: any }> }> };

export type AdvertiserFragmentFragment = { __typename?: 'Advertiser', id: string, totalBudget: any, remainingBudget: any, adsQuantity: any, impressions: any, clicks: any, conversions: any };

export type GetAllAdvertisersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllAdvertisersQuery = { __typename?: 'Query', ads: Array<{ __typename?: 'Ad', id: string, metadataURI: string, attribution: any, active: boolean, startingTimestamp: any, endingTimestamp: any, blacklistedWeekdays: Array<any>, totalBudget: any, remainingBudget: any, maxConsumptionsPerDay: any, maxPricePerConsumption: any, consumptions: any, advertiser: { __typename?: 'Advertiser', id: string, totalBudget: any, remainingBudget: any, adsQuantity: any, impressions: any, clicks: any, conversions: any }, audiences: Array<{ __typename?: 'Audience', id: string, metadataURI: string, consumptions: any, segments: Array<{ __typename?: 'Segment', id: string, metadataURI: string, validator: string, querySchema: any, querySlotIndex: any, queryOperator: any, queryValue: Array<any>, queryCircuitId: string, issuer: { __typename?: 'Issuer', id: string } }> }>, blacklistedPublishers: Array<{ __typename?: 'Publisher', id: string, active: boolean, cpi: any, cpc: any, cpa: any, usersRewardsPercentage: any, adsQuantity: any, impressions: any, clicks: any, conversions: any }>, consumptionsPerDay: Array<{ __typename?: 'ConsumptionsPerDay', id: string, day: any, adId: string, consumptions: any }> }> };

export type GetAdvertiserQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetAdvertiserQuery = { __typename?: 'Query', advertiser?: { __typename?: 'Advertiser', id: string, totalBudget: any, remainingBudget: any, adsQuantity: any, impressions: any, clicks: any, conversions: any } | null };

export type AudienceFragmentFragment = { __typename?: 'Audience', id: string, metadataURI: string, consumptions: any, segments: Array<{ __typename?: 'Segment', id: string, metadataURI: string, validator: string, querySchema: any, querySlotIndex: any, queryOperator: any, queryValue: Array<any>, queryCircuitId: string, issuer: { __typename?: 'Issuer', id: string } }> };

export type GetAllAudiencesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllAudiencesQuery = { __typename?: 'Query', audiences: Array<{ __typename?: 'Audience', id: string, metadataURI: string, consumptions: any, segments: Array<{ __typename?: 'Segment', id: string, metadataURI: string, validator: string, querySchema: any, querySlotIndex: any, queryOperator: any, queryValue: Array<any>, queryCircuitId: string, issuer: { __typename?: 'Issuer', id: string } }> }> };

export type GetAudienceQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetAudienceQuery = { __typename?: 'Query', audience?: { __typename?: 'Audience', id: string, metadataURI: string, consumptions: any, segments: Array<{ __typename?: 'Segment', id: string, metadataURI: string, validator: string, querySchema: any, querySlotIndex: any, queryOperator: any, queryValue: Array<any>, queryCircuitId: string, issuer: { __typename?: 'Issuer', id: string } }> } | null };

export type GetLastAudiencesQueryVariables = Exact<{
  limit: Scalars['Int'];
}>;


export type GetLastAudiencesQuery = { __typename?: 'Query', audiences: Array<{ __typename?: 'Audience', id: string, metadataURI: string, consumptions: any, segments: Array<{ __typename?: 'Segment', id: string, metadataURI: string, validator: string, querySchema: any, querySlotIndex: any, queryOperator: any, queryValue: Array<any>, queryCircuitId: string, issuer: { __typename?: 'Issuer', id: string } }> }> };

export type PublisherFragmentFragment = { __typename?: 'Publisher', id: string, active: boolean, cpi: any, cpc: any, cpa: any, usersRewardsPercentage: any, adsQuantity: any, impressions: any, clicks: any, conversions: any };

export type GetAllPublishersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllPublishersQuery = { __typename?: 'Query', publishers: Array<{ __typename?: 'Publisher', id: string, active: boolean, cpi: any, cpc: any, cpa: any, usersRewardsPercentage: any, adsQuantity: any, impressions: any, clicks: any, conversions: any }> };

export type GetPublisherQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetPublisherQuery = { __typename?: 'Query', publisher?: { __typename?: 'Publisher', id: string, active: boolean, cpi: any, cpc: any, cpa: any, usersRewardsPercentage: any, adsQuantity: any, impressions: any, clicks: any, conversions: any } | null };

export type SegmentFragmentFragment = { __typename?: 'Segment', id: string, metadataURI: string, validator: string, querySchema: any, querySlotIndex: any, queryOperator: any, queryValue: Array<any>, queryCircuitId: string, issuer: { __typename?: 'Issuer', id: string } };

export type GetAllSegmentsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllSegmentsQuery = { __typename?: 'Query', segments: Array<{ __typename?: 'Segment', id: string, metadataURI: string, validator: string, querySchema: any, querySlotIndex: any, queryOperator: any, queryValue: Array<any>, queryCircuitId: string, issuer: { __typename?: 'Issuer', id: string } }> };

export type GetSegmentQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetSegmentQuery = { __typename?: 'Query', segment?: { __typename?: 'Segment', id: string, metadataURI: string, validator: string, querySchema: any, querySlotIndex: any, queryOperator: any, queryValue: Array<any>, queryCircuitId: string, issuer: { __typename?: 'Issuer', id: string } } | null };

export type GetLastSegmentsQueryVariables = Exact<{
  limit: Scalars['Int'];
}>;


export type GetLastSegmentsQuery = { __typename?: 'Query', segments: Array<{ __typename?: 'Segment', id: string, metadataURI: string, validator: string, querySchema: any, querySlotIndex: any, queryOperator: any, queryValue: Array<any>, queryCircuitId: string, issuer: { __typename?: 'Issuer', id: string } }> };

export const AdminFragmentFragmentDoc = `
    fragment AdminFragment on Admin {
  id
}
    `;
export const AdvertiserFragmentFragmentDoc = `
    fragment AdvertiserFragment on Advertiser {
  id
  totalBudget
  remainingBudget
  adsQuantity
  impressions
  clicks
  conversions
}
    `;
export const SegmentFragmentFragmentDoc = `
    fragment SegmentFragment on Segment {
  id
  metadataURI
  issuer {
    id
  }
  validator
  querySchema
  querySlotIndex
  queryOperator
  queryValue
  queryCircuitId
}
    `;
export const AudienceFragmentFragmentDoc = `
    fragment AudienceFragment on Audience {
  id
  metadataURI
  segments {
    ...SegmentFragment
  }
  consumptions
}
    ${SegmentFragmentFragmentDoc}`;
export const PublisherFragmentFragmentDoc = `
    fragment PublisherFragment on Publisher {
  id
  active
  cpi
  cpc
  cpa
  usersRewardsPercentage
  adsQuantity
  impressions
  clicks
  conversions
}
    `;
export const AdFragmentFragmentDoc = `
    fragment AdFragment on Ad {
  id
  advertiser {
    ...AdvertiserFragment
  }
  metadataURI
  attribution
  active
  startingTimestamp
  endingTimestamp
  audiences {
    ...AudienceFragment
  }
  blacklistedPublishers {
    ...PublisherFragment
  }
  blacklistedWeekdays
  totalBudget
  remainingBudget
  maxConsumptionsPerDay
  maxPricePerConsumption
  consumptions
  consumptionsPerDay {
    id
    day
    adId
    consumptions
  }
}
    ${AdvertiserFragmentFragmentDoc}
${AudienceFragmentFragmentDoc}
${PublisherFragmentFragmentDoc}`;
export const GetAllAdminsDocument = `
    query GetAllAdmins {
  admins {
    ...AdminFragment
  }
}
    ${AdminFragmentFragmentDoc}`;
export const GetAdminDocument = `
    query GetAdmin($id: ID!) {
  admin(id: $id) {
    ...AdminFragment
  }
}
    ${AdminFragmentFragmentDoc}`;
export const GetAllAdsDocument = `
    query GetAllAds {
  ads {
    ...AdFragment
  }
}
    ${AdFragmentFragmentDoc}`;
export const GetAdToShowDocument = `
    query GetAdToShow {
  ads(where: {audiences_not: []}, orderBy: remainingBudget, orderDirection: desc) {
    ...AdFragment
  }
}
    ${AdFragmentFragmentDoc}`;
export const GetAdDocument = `
    query GetAd($id: ID!) {
  ad(id: $id) {
    ...AdFragment
  }
}
    ${AdFragmentFragmentDoc}`;
export const GetLastAdsDocument = `
    query GetLastAds($limit: Int!) {
  ads(first: $limit) {
    ...AdFragment
  }
}
    ${AdFragmentFragmentDoc}`;
export const GetAdsByAdvertiserDocument = `
    query GetAdsByAdvertiser($advertiserId: String!) {
  ads(where: {advertiser: $advertiserId}) {
    ...AdFragment
  }
}
    ${AdFragmentFragmentDoc}`;
export const GetAllAdvertisersDocument = `
    query GetAllAdvertisers {
  ads {
    ...AdFragment
  }
}
    ${AdFragmentFragmentDoc}`;
export const GetAdvertiserDocument = `
    query GetAdvertiser($id: ID!) {
  advertiser(id: $id) {
    ...AdvertiserFragment
  }
}
    ${AdvertiserFragmentFragmentDoc}`;
export const GetAllAudiencesDocument = `
    query GetAllAudiences {
  audiences {
    ...AudienceFragment
  }
}
    ${AudienceFragmentFragmentDoc}`;
export const GetAudienceDocument = `
    query GetAudience($id: ID!) {
  audience(id: $id) {
    ...AudienceFragment
  }
}
    ${AudienceFragmentFragmentDoc}`;
export const GetLastAudiencesDocument = `
    query GetLastAudiences($limit: Int!) {
  audiences(first: $limit) {
    ...AudienceFragment
  }
}
    ${AudienceFragmentFragmentDoc}`;
export const GetAllPublishersDocument = `
    query GetAllPublishers {
  publishers {
    ...PublisherFragment
  }
}
    ${PublisherFragmentFragmentDoc}`;
export const GetPublisherDocument = `
    query GetPublisher($id: ID!) {
  publisher(id: $id) {
    ...PublisherFragment
  }
}
    ${PublisherFragmentFragmentDoc}`;
export const GetAllSegmentsDocument = `
    query GetAllSegments {
  segments {
    ...SegmentFragment
  }
}
    ${SegmentFragmentFragmentDoc}`;
export const GetSegmentDocument = `
    query GetSegment($id: ID!) {
  segment(id: $id) {
    ...SegmentFragment
  }
}
    ${SegmentFragmentFragmentDoc}`;
export const GetLastSegmentsDocument = `
    query GetLastSegments($limit: Int!) {
  segments(first: $limit) {
    ...SegmentFragment
  }
}
    ${SegmentFragmentFragmentDoc}`;

const injectedRtkApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    GetAllAdmins: build.query<GetAllAdminsQuery, GetAllAdminsQueryVariables | void>({
      query: (variables) => ({ document: GetAllAdminsDocument, variables })
    }),
    GetAdmin: build.query<GetAdminQuery, GetAdminQueryVariables>({
      query: (variables) => ({ document: GetAdminDocument, variables })
    }),
    GetAllAds: build.query<GetAllAdsQuery, GetAllAdsQueryVariables | void>({
      query: (variables) => ({ document: GetAllAdsDocument, variables })
    }),
    GetAdToShow: build.query<GetAdToShowQuery, GetAdToShowQueryVariables | void>({
      query: (variables) => ({ document: GetAdToShowDocument, variables })
    }),
    GetAd: build.query<GetAdQuery, GetAdQueryVariables>({
      query: (variables) => ({ document: GetAdDocument, variables })
    }),
    GetLastAds: build.query<GetLastAdsQuery, GetLastAdsQueryVariables>({
      query: (variables) => ({ document: GetLastAdsDocument, variables })
    }),
    GetAdsByAdvertiser: build.query<GetAdsByAdvertiserQuery, GetAdsByAdvertiserQueryVariables>({
      query: (variables) => ({ document: GetAdsByAdvertiserDocument, variables })
    }),
    GetAllAdvertisers: build.query<GetAllAdvertisersQuery, GetAllAdvertisersQueryVariables | void>({
      query: (variables) => ({ document: GetAllAdvertisersDocument, variables })
    }),
    GetAdvertiser: build.query<GetAdvertiserQuery, GetAdvertiserQueryVariables>({
      query: (variables) => ({ document: GetAdvertiserDocument, variables })
    }),
    GetAllAudiences: build.query<GetAllAudiencesQuery, GetAllAudiencesQueryVariables | void>({
      query: (variables) => ({ document: GetAllAudiencesDocument, variables })
    }),
    GetAudience: build.query<GetAudienceQuery, GetAudienceQueryVariables>({
      query: (variables) => ({ document: GetAudienceDocument, variables })
    }),
    GetLastAudiences: build.query<GetLastAudiencesQuery, GetLastAudiencesQueryVariables>({
      query: (variables) => ({ document: GetLastAudiencesDocument, variables })
    }),
    GetAllPublishers: build.query<GetAllPublishersQuery, GetAllPublishersQueryVariables | void>({
      query: (variables) => ({ document: GetAllPublishersDocument, variables })
    }),
    GetPublisher: build.query<GetPublisherQuery, GetPublisherQueryVariables>({
      query: (variables) => ({ document: GetPublisherDocument, variables })
    }),
    GetAllSegments: build.query<GetAllSegmentsQuery, GetAllSegmentsQueryVariables | void>({
      query: (variables) => ({ document: GetAllSegmentsDocument, variables })
    }),
    GetSegment: build.query<GetSegmentQuery, GetSegmentQueryVariables>({
      query: (variables) => ({ document: GetSegmentDocument, variables })
    }),
    GetLastSegments: build.query<GetLastSegmentsQuery, GetLastSegmentsQueryVariables>({
      query: (variables) => ({ document: GetLastSegmentsDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };
export const { useGetAllAdminsQuery, useLazyGetAllAdminsQuery, useGetAdminQuery, useLazyGetAdminQuery, useGetAllAdsQuery, useLazyGetAllAdsQuery, useGetAdToShowQuery, useLazyGetAdToShowQuery, useGetAdQuery, useLazyGetAdQuery, useGetLastAdsQuery, useLazyGetLastAdsQuery, useGetAdsByAdvertiserQuery, useLazyGetAdsByAdvertiserQuery, useGetAllAdvertisersQuery, useLazyGetAllAdvertisersQuery, useGetAdvertiserQuery, useLazyGetAdvertiserQuery, useGetAllAudiencesQuery, useLazyGetAllAudiencesQuery, useGetAudienceQuery, useLazyGetAudienceQuery, useGetLastAudiencesQuery, useLazyGetLastAudiencesQuery, useGetAllPublishersQuery, useLazyGetAllPublishersQuery, useGetPublisherQuery, useLazyGetPublisherQuery, useGetAllSegmentsQuery, useLazyGetAllSegmentsQuery, useGetSegmentQuery, useLazyGetSegmentQuery, useGetLastSegmentsQuery, useLazyGetLastSegmentsQuery } = injectedRtkApi;

