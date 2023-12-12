import { GraphQLClient } from 'graphql-request';
import { GraphQLClientRequestHeaders } from 'graphql-request/build/cjs/types';
import gql from 'graphql-tag';
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
  advertiser: Advertiser;
  attribution: Scalars['Int8'];
  audiences: Array<Audience>;
  blacklistedPublishers: Array<Publisher>;
  blacklistedWeekdays: Array<Scalars['BigInt']>;
  consumptions: Scalars['BigInt'];
  consumptionsPerDay: Array<ConsumptionsPerDay>;
  endingTimestamp: Scalars['BigInt'];
  id: Scalars['Bytes'];
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
  id?: InputMaybe<Scalars['Bytes']>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_gt?: InputMaybe<Scalars['Bytes']>;
  id_gte?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_lt?: InputMaybe<Scalars['Bytes']>;
  id_lte?: InputMaybe<Scalars['Bytes']>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
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

export type Ad_OrderBy =
  | 'advertiser'
  | 'advertiser__adsQuantity'
  | 'advertiser__clicks'
  | 'advertiser__conversions'
  | 'advertiser__id'
  | 'advertiser__impressions'
  | 'advertiser__remainingBudget'
  | 'advertiser__totalBudget'
  | 'attribution'
  | 'audiences'
  | 'blacklistedPublishers'
  | 'blacklistedWeekdays'
  | 'consumptions'
  | 'consumptionsPerDay'
  | 'endingTimestamp'
  | 'id'
  | 'maxConsumptionsPerDay'
  | 'maxPricePerConsumption'
  | 'metadataURI'
  | 'remainingBudget'
  | 'startingTimestamp'
  | 'totalBudget';

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

export type Advertiser_OrderBy =
  | 'adsQuantity'
  | 'clicks'
  | 'conversions'
  | 'id'
  | 'impressions'
  | 'remainingBudget'
  | 'totalBudget';

export type Audience = {
  __typename?: 'Audience';
  consumptions: Scalars['BigInt'];
  id: Scalars['Bytes'];
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
  id?: InputMaybe<Scalars['Bytes']>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_gt?: InputMaybe<Scalars['Bytes']>;
  id_gte?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_lt?: InputMaybe<Scalars['Bytes']>;
  id_lte?: InputMaybe<Scalars['Bytes']>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
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

export type Audience_OrderBy =
  | 'consumptions'
  | 'id'
  | 'metadataURI'
  | 'segments';

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
  adId: Scalars['Bytes'];
  consumptions: Scalars['BigInt'];
  day: Scalars['BigInt'];
  id: Scalars['String'];
};

export type ConsumptionsPerDay_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  adId?: InputMaybe<Scalars['Bytes']>;
  adId_contains?: InputMaybe<Scalars['Bytes']>;
  adId_gt?: InputMaybe<Scalars['Bytes']>;
  adId_gte?: InputMaybe<Scalars['Bytes']>;
  adId_in?: InputMaybe<Array<Scalars['Bytes']>>;
  adId_lt?: InputMaybe<Scalars['Bytes']>;
  adId_lte?: InputMaybe<Scalars['Bytes']>;
  adId_not?: InputMaybe<Scalars['Bytes']>;
  adId_not_contains?: InputMaybe<Scalars['Bytes']>;
  adId_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
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

export type ConsumptionsPerDay_OrderBy =
  | 'adId'
  | 'consumptions'
  | 'day'
  | 'id';

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

export type Issuer_OrderBy =
  | 'id';

/** Defines the order direction, either ascending or descending */
export type OrderDirection =
  | 'asc'
  | 'desc';

export type Publisher = {
  __typename?: 'Publisher';
  adsQuantity: Scalars['BigInt'];
  clicks: Scalars['BigInt'];
  conversions: Scalars['BigInt'];
  id: Scalars['String'];
  impressions: Scalars['BigInt'];
};

export type Publisher_Filter = {
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
};

export type Publisher_OrderBy =
  | 'adsQuantity'
  | 'clicks'
  | 'conversions'
  | 'id'
  | 'impressions';

export type Query = {
  __typename?: 'Query';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  ad?: Maybe<Ad>;
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
  id: Scalars['Bytes'];
  issuer: Issuer;
  metadataURI: Scalars['String'];
  queryCircuitId: Scalars['String'];
  queryOperator: Scalars['BigInt'];
  querySchema: Scalars['BigInt'];
  querySlotIndex: Scalars['BigInt'];
  queryValue: Array<Scalars['BigInt']>;
  validator: Scalars['Bytes'];
};

export type Segment_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Segment_Filter>>>;
  id?: InputMaybe<Scalars['Bytes']>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_gt?: InputMaybe<Scalars['Bytes']>;
  id_gte?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_lt?: InputMaybe<Scalars['Bytes']>;
  id_lte?: InputMaybe<Scalars['Bytes']>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
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
  validator?: InputMaybe<Scalars['Bytes']>;
  validator_contains?: InputMaybe<Scalars['Bytes']>;
  validator_gt?: InputMaybe<Scalars['Bytes']>;
  validator_gte?: InputMaybe<Scalars['Bytes']>;
  validator_in?: InputMaybe<Array<Scalars['Bytes']>>;
  validator_lt?: InputMaybe<Scalars['Bytes']>;
  validator_lte?: InputMaybe<Scalars['Bytes']>;
  validator_not?: InputMaybe<Scalars['Bytes']>;
  validator_not_contains?: InputMaybe<Scalars['Bytes']>;
  validator_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export type Segment_OrderBy =
  | 'id'
  | 'issuer'
  | 'issuer__id'
  | 'metadataURI'
  | 'queryCircuitId'
  | 'queryOperator'
  | 'querySchema'
  | 'querySlotIndex'
  | 'queryValue'
  | 'validator';

export type Subscription = {
  __typename?: 'Subscription';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  ad?: Maybe<Ad>;
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

export type _SubgraphErrorPolicy_ =
  /** Data will be returned even if the subgraph has indexing errors */
  | 'allow'
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  | 'deny';

export type SegmentFragment = { __typename?: 'Segment', querySchema: any, querySlotIndex: any, queryValue: Array<any>, queryCircuitId: string, queryOperator: any, id: any, metadataURI: string, validator: any, issuer: { __typename?: 'Issuer', id: string } };

export type GetAllSegmentsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllSegmentsQuery = { __typename?: 'Query', segments: Array<{ __typename?: 'Segment', querySchema: any, querySlotIndex: any, queryValue: Array<any>, queryCircuitId: string, queryOperator: any, id: any, metadataURI: string, validator: any, issuer: { __typename?: 'Issuer', id: string } }> };

export type GetSegmentQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetSegmentQuery = { __typename?: 'Query', segment?: { __typename?: 'Segment', querySchema: any, querySlotIndex: any, queryValue: Array<any>, queryCircuitId: string, queryOperator: any, id: any, metadataURI: string, validator: any, issuer: { __typename?: 'Issuer', id: string } } | null };

export type GetSegmentsQueryVariables = Exact<{
  ids: Array<Scalars['Bytes']> | Scalars['Bytes'];
}>;


export type GetSegmentsQuery = { __typename?: 'Query', segments: Array<{ __typename?: 'Segment', querySchema: any, querySlotIndex: any, queryValue: Array<any>, queryCircuitId: string, queryOperator: any, id: any, metadataURI: string, validator: any, issuer: { __typename?: 'Issuer', id: string } }> };

export type GetSegmentForAudienceQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetSegmentForAudienceQuery = { __typename?: 'Query', audience?: { __typename?: 'Audience', segments: Array<{ __typename?: 'Segment', querySchema: any, querySlotIndex: any, queryValue: Array<any>, queryCircuitId: string, queryOperator: any, id: any, metadataURI: string, validator: any, issuer: { __typename?: 'Issuer', id: string } }> } | null };

export const SegmentFragmentDoc = gql`
    fragment Segment on Segment {
  querySchema
  querySlotIndex
  queryValue
  queryCircuitId
  queryOperator
  id
  issuer {
    id
  }
  metadataURI
  validator
}
    `;
export const GetAllSegmentsDocument = gql`
    query GetAllSegments {
  segments {
    ...Segment
  }
}
    ${SegmentFragmentDoc}`;
export const GetSegmentDocument = gql`
    query GetSegment($id: ID!) {
  segment(id: $id) {
    ...Segment
  }
}
    ${SegmentFragmentDoc}`;
export const GetSegmentsDocument = gql`
    query GetSegments($ids: [Bytes!]!) {
  segments(where: {id_in: $ids}) {
    ...Segment
  }
}
    ${SegmentFragmentDoc}`;
export const GetSegmentForAudienceDocument = gql`
    query GetSegmentForAudience($id: ID!) {
  audience(id: $id) {
    segments {
      ...Segment
    }
  }
}
    ${SegmentFragmentDoc}`;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    GetAllSegments(variables?: GetAllSegmentsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetAllSegmentsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetAllSegmentsQuery>(GetAllSegmentsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetAllSegments', 'query');
    },
    GetSegment(variables: GetSegmentQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetSegmentQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetSegmentQuery>(GetSegmentDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetSegment', 'query');
    },
    GetSegments(variables: GetSegmentsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetSegmentsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetSegmentsQuery>(GetSegmentsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetSegments', 'query');
    },
    GetSegmentForAudience(variables: GetSegmentForAudienceQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetSegmentForAudienceQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetSegmentForAudienceQuery>(GetSegmentForAudienceDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetSegmentForAudience', 'query');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;