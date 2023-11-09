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
  advertiser: User;
  id: Scalars['String'];
  impressions: Scalars['BigInt'];
  maxBlock: Scalars['BigInt'];
  maxImpressionPrice: Scalars['BigInt'];
  metadataURI: Scalars['String'];
  minBlock: Scalars['BigInt'];
  remainingBudget: Scalars['BigInt'];
  targetGroups: Array<TargetGroup>;
  totalBudget: Scalars['BigInt'];
};


export type AdTargetGroupsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TargetGroup_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<TargetGroup_Filter>;
};

export type Ad_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  advertiser?: InputMaybe<Scalars['String']>;
  advertiser_?: InputMaybe<User_Filter>;
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
  maxBlock?: InputMaybe<Scalars['BigInt']>;
  maxBlock_gt?: InputMaybe<Scalars['BigInt']>;
  maxBlock_gte?: InputMaybe<Scalars['BigInt']>;
  maxBlock_in?: InputMaybe<Array<Scalars['BigInt']>>;
  maxBlock_lt?: InputMaybe<Scalars['BigInt']>;
  maxBlock_lte?: InputMaybe<Scalars['BigInt']>;
  maxBlock_not?: InputMaybe<Scalars['BigInt']>;
  maxBlock_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  maxImpressionPrice?: InputMaybe<Scalars['BigInt']>;
  maxImpressionPrice_gt?: InputMaybe<Scalars['BigInt']>;
  maxImpressionPrice_gte?: InputMaybe<Scalars['BigInt']>;
  maxImpressionPrice_in?: InputMaybe<Array<Scalars['BigInt']>>;
  maxImpressionPrice_lt?: InputMaybe<Scalars['BigInt']>;
  maxImpressionPrice_lte?: InputMaybe<Scalars['BigInt']>;
  maxImpressionPrice_not?: InputMaybe<Scalars['BigInt']>;
  maxImpressionPrice_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
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
  minBlock?: InputMaybe<Scalars['BigInt']>;
  minBlock_gt?: InputMaybe<Scalars['BigInt']>;
  minBlock_gte?: InputMaybe<Scalars['BigInt']>;
  minBlock_in?: InputMaybe<Array<Scalars['BigInt']>>;
  minBlock_lt?: InputMaybe<Scalars['BigInt']>;
  minBlock_lte?: InputMaybe<Scalars['BigInt']>;
  minBlock_not?: InputMaybe<Scalars['BigInt']>;
  minBlock_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  or?: InputMaybe<Array<InputMaybe<Ad_Filter>>>;
  remainingBudget?: InputMaybe<Scalars['BigInt']>;
  remainingBudget_gt?: InputMaybe<Scalars['BigInt']>;
  remainingBudget_gte?: InputMaybe<Scalars['BigInt']>;
  remainingBudget_in?: InputMaybe<Array<Scalars['BigInt']>>;
  remainingBudget_lt?: InputMaybe<Scalars['BigInt']>;
  remainingBudget_lte?: InputMaybe<Scalars['BigInt']>;
  remainingBudget_not?: InputMaybe<Scalars['BigInt']>;
  remainingBudget_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  targetGroups?: InputMaybe<Array<Scalars['String']>>;
  targetGroups_?: InputMaybe<TargetGroup_Filter>;
  targetGroups_contains?: InputMaybe<Array<Scalars['String']>>;
  targetGroups_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  targetGroups_not?: InputMaybe<Array<Scalars['String']>>;
  targetGroups_not_contains?: InputMaybe<Array<Scalars['String']>>;
  targetGroups_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
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
  Advertiser = 'advertiser',
  AdvertiserId = 'advertiser__id',
  AdvertiserImpressions = 'advertiser__impressions',
  Id = 'id',
  Impressions = 'impressions',
  MaxBlock = 'maxBlock',
  MaxImpressionPrice = 'maxImpressionPrice',
  MetadataUri = 'metadataURI',
  MinBlock = 'minBlock',
  RemainingBudget = 'remainingBudget',
  TargetGroups = 'targetGroups',
  TotalBudget = 'totalBudget'
}

export type BlockChangedFilter = {
  number_gte: Scalars['Int'];
};

export type Block_Height = {
  hash?: InputMaybe<Scalars['Bytes']>;
  number?: InputMaybe<Scalars['Int']>;
  number_gte?: InputMaybe<Scalars['Int']>;
};

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type Publisher = {
  __typename?: 'Publisher';
  id: Scalars['String'];
  impressions: Scalars['BigInt'];
};

export type Publisher_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Publisher_Filter>>>;
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

export enum Publisher_OrderBy {
  Id = 'id',
  Impressions = 'impressions'
}

export type Query = {
  __typename?: 'Query';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  ad?: Maybe<Ad>;
  ads: Array<Ad>;
  publisher?: Maybe<Publisher>;
  publishers: Array<Publisher>;
  targetGroup?: Maybe<TargetGroup>;
  targetGroups: Array<TargetGroup>;
  user?: Maybe<User>;
  users: Array<User>;
  zkprequest?: Maybe<ZkpRequest>;
  zkprequests: Array<ZkpRequest>;
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


export type QueryTargetGroupArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryTargetGroupsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TargetGroup_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TargetGroup_Filter>;
};


export type QueryUserArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryUsersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<User_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<User_Filter>;
};


export type QueryZkprequestArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryZkprequestsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ZkpRequest_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ZkpRequest_Filter>;
};

export type Subscription = {
  __typename?: 'Subscription';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  ad?: Maybe<Ad>;
  ads: Array<Ad>;
  publisher?: Maybe<Publisher>;
  publishers: Array<Publisher>;
  targetGroup?: Maybe<TargetGroup>;
  targetGroups: Array<TargetGroup>;
  user?: Maybe<User>;
  users: Array<User>;
  zkprequest?: Maybe<ZkpRequest>;
  zkprequests: Array<ZkpRequest>;
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


export type SubscriptionTargetGroupArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionTargetGroupsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TargetGroup_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TargetGroup_Filter>;
};


export type SubscriptionUserArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionUsersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<User_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<User_Filter>;
};


export type SubscriptionZkprequestArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionZkprequestsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ZkpRequest_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ZkpRequest_Filter>;
};

export type TargetGroup = {
  __typename?: 'TargetGroup';
  id: Scalars['String'];
  metadataURI: Scalars['String'];
  zkRequests: Array<ZkpRequest>;
};


export type TargetGroupZkRequestsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ZkpRequest_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<ZkpRequest_Filter>;
};

export type TargetGroup_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<TargetGroup_Filter>>>;
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
  or?: InputMaybe<Array<InputMaybe<TargetGroup_Filter>>>;
  zkRequests?: InputMaybe<Array<Scalars['String']>>;
  zkRequests_?: InputMaybe<ZkpRequest_Filter>;
  zkRequests_contains?: InputMaybe<Array<Scalars['String']>>;
  zkRequests_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  zkRequests_not?: InputMaybe<Array<Scalars['String']>>;
  zkRequests_not_contains?: InputMaybe<Array<Scalars['String']>>;
  zkRequests_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
};

export enum TargetGroup_OrderBy {
  Id = 'id',
  MetadataUri = 'metadataURI',
  ZkRequests = 'zkRequests'
}

export type User = {
  __typename?: 'User';
  id: Scalars['String'];
  impressions: Scalars['BigInt'];
};

export type User_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<User_Filter>>>;
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
  or?: InputMaybe<Array<InputMaybe<User_Filter>>>;
};

export enum User_OrderBy {
  Id = 'id',
  Impressions = 'impressions'
}

export type ZkpRequest = {
  __typename?: 'ZKPRequest';
  id: Scalars['String'];
  metadataURI: Scalars['String'];
  query_circuitId: Scalars['String'];
  query_operator: Scalars['BigInt'];
  query_schema: Scalars['BigInt'];
  query_slotIndex: Scalars['BigInt'];
  query_value: Array<Scalars['BigInt']>;
  validator: Scalars['Bytes'];
};

export type ZkpRequest_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<ZkpRequest_Filter>>>;
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
  or?: InputMaybe<Array<InputMaybe<ZkpRequest_Filter>>>;
  query_circuitId?: InputMaybe<Scalars['String']>;
  query_circuitId_contains?: InputMaybe<Scalars['String']>;
  query_circuitId_contains_nocase?: InputMaybe<Scalars['String']>;
  query_circuitId_ends_with?: InputMaybe<Scalars['String']>;
  query_circuitId_ends_with_nocase?: InputMaybe<Scalars['String']>;
  query_circuitId_gt?: InputMaybe<Scalars['String']>;
  query_circuitId_gte?: InputMaybe<Scalars['String']>;
  query_circuitId_in?: InputMaybe<Array<Scalars['String']>>;
  query_circuitId_lt?: InputMaybe<Scalars['String']>;
  query_circuitId_lte?: InputMaybe<Scalars['String']>;
  query_circuitId_not?: InputMaybe<Scalars['String']>;
  query_circuitId_not_contains?: InputMaybe<Scalars['String']>;
  query_circuitId_not_contains_nocase?: InputMaybe<Scalars['String']>;
  query_circuitId_not_ends_with?: InputMaybe<Scalars['String']>;
  query_circuitId_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  query_circuitId_not_in?: InputMaybe<Array<Scalars['String']>>;
  query_circuitId_not_starts_with?: InputMaybe<Scalars['String']>;
  query_circuitId_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  query_circuitId_starts_with?: InputMaybe<Scalars['String']>;
  query_circuitId_starts_with_nocase?: InputMaybe<Scalars['String']>;
  query_operator?: InputMaybe<Scalars['BigInt']>;
  query_operator_gt?: InputMaybe<Scalars['BigInt']>;
  query_operator_gte?: InputMaybe<Scalars['BigInt']>;
  query_operator_in?: InputMaybe<Array<Scalars['BigInt']>>;
  query_operator_lt?: InputMaybe<Scalars['BigInt']>;
  query_operator_lte?: InputMaybe<Scalars['BigInt']>;
  query_operator_not?: InputMaybe<Scalars['BigInt']>;
  query_operator_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  query_schema?: InputMaybe<Scalars['BigInt']>;
  query_schema_gt?: InputMaybe<Scalars['BigInt']>;
  query_schema_gte?: InputMaybe<Scalars['BigInt']>;
  query_schema_in?: InputMaybe<Array<Scalars['BigInt']>>;
  query_schema_lt?: InputMaybe<Scalars['BigInt']>;
  query_schema_lte?: InputMaybe<Scalars['BigInt']>;
  query_schema_not?: InputMaybe<Scalars['BigInt']>;
  query_schema_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  query_slotIndex?: InputMaybe<Scalars['BigInt']>;
  query_slotIndex_gt?: InputMaybe<Scalars['BigInt']>;
  query_slotIndex_gte?: InputMaybe<Scalars['BigInt']>;
  query_slotIndex_in?: InputMaybe<Array<Scalars['BigInt']>>;
  query_slotIndex_lt?: InputMaybe<Scalars['BigInt']>;
  query_slotIndex_lte?: InputMaybe<Scalars['BigInt']>;
  query_slotIndex_not?: InputMaybe<Scalars['BigInt']>;
  query_slotIndex_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  query_value?: InputMaybe<Array<Scalars['BigInt']>>;
  query_value_contains?: InputMaybe<Array<Scalars['BigInt']>>;
  query_value_contains_nocase?: InputMaybe<Array<Scalars['BigInt']>>;
  query_value_not?: InputMaybe<Array<Scalars['BigInt']>>;
  query_value_not_contains?: InputMaybe<Array<Scalars['BigInt']>>;
  query_value_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']>>;
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

export enum ZkpRequest_OrderBy {
  Id = 'id',
  MetadataUri = 'metadataURI',
  QueryCircuitId = 'query_circuitId',
  QueryOperator = 'query_operator',
  QuerySchema = 'query_schema',
  QuerySlotIndex = 'query_slotIndex',
  QueryValue = 'query_value',
  Validator = 'validator'
}

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

export type ZkpRequestFragmentFragment = { __typename?: 'ZKPRequest', id: string, metadataURI: string, validator: any, query_schema: any, query_slotIndex: any, query_operator: any, query_value: Array<any>, query_circuitId: string };

export type GetAllZkpRequestsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllZkpRequestsQuery = { __typename?: 'Query', zkprequests: Array<{ __typename?: 'ZKPRequest', id: string, metadataURI: string, validator: any, query_schema: any, query_slotIndex: any, query_operator: any, query_value: Array<any>, query_circuitId: string }> };

export type AdFragmentFragment = { __typename?: 'Ad', id: string, impressions: any, minBlock: any, maxBlock: any, maxImpressionPrice: any, metadataURI: string, remainingBudget: any, totalBudget: any, advertiser: { __typename?: 'User', id: string, impressions: any }, targetGroups: Array<{ __typename?: 'TargetGroup', id: string, metadataURI: string, zkRequests: Array<{ __typename?: 'ZKPRequest', id: string, metadataURI: string, validator: any, query_schema: any, query_slotIndex: any, query_operator: any, query_value: Array<any>, query_circuitId: string }> }> };

export type GetAllAdsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllAdsQuery = { __typename?: 'Query', ads: Array<{ __typename?: 'Ad', id: string, impressions: any, minBlock: any, maxBlock: any, maxImpressionPrice: any, metadataURI: string, remainingBudget: any, totalBudget: any, advertiser: { __typename?: 'User', id: string, impressions: any }, targetGroups: Array<{ __typename?: 'TargetGroup', id: string, metadataURI: string, zkRequests: Array<{ __typename?: 'ZKPRequest', id: string, metadataURI: string, validator: any, query_schema: any, query_slotIndex: any, query_operator: any, query_value: Array<any>, query_circuitId: string }> }> }> };

export type GetAdToShowQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAdToShowQuery = { __typename?: 'Query', ads: Array<{ __typename?: 'Ad', id: string, impressions: any, minBlock: any, maxBlock: any, maxImpressionPrice: any, metadataURI: string, remainingBudget: any, totalBudget: any, advertiser: { __typename?: 'User', id: string, impressions: any }, targetGroups: Array<{ __typename?: 'TargetGroup', id: string, metadataURI: string, zkRequests: Array<{ __typename?: 'ZKPRequest', id: string, metadataURI: string, validator: any, query_schema: any, query_slotIndex: any, query_operator: any, query_value: Array<any>, query_circuitId: string }> }> }> };

export type GetAdByIdQueryVariables = Exact<{
  id?: InputMaybe<Scalars['String']>;
}>;


export type GetAdByIdQuery = { __typename?: 'Query', ads: Array<{ __typename?: 'Ad', id: string, impressions: any, minBlock: any, maxBlock: any, maxImpressionPrice: any, metadataURI: string, remainingBudget: any, totalBudget: any, advertiser: { __typename?: 'User', id: string, impressions: any }, targetGroups: Array<{ __typename?: 'TargetGroup', id: string, metadataURI: string, zkRequests: Array<{ __typename?: 'ZKPRequest', id: string, metadataURI: string, validator: any, query_schema: any, query_slotIndex: any, query_operator: any, query_value: Array<any>, query_circuitId: string }> }> }> };

export type PublisherFragmentFragment = { __typename?: 'Publisher', id: string, impressions: any };

export type GetAllPublishersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllPublishersQuery = { __typename?: 'Query', publishers: Array<{ __typename?: 'Publisher', id: string, impressions: any }> };

export type TargetGroupFragmentFragment = { __typename?: 'TargetGroup', id: string, metadataURI: string, zkRequests: Array<{ __typename?: 'ZKPRequest', id: string, metadataURI: string, validator: any, query_schema: any, query_slotIndex: any, query_operator: any, query_value: Array<any>, query_circuitId: string }> };

export type GetAllTargetGroupsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllTargetGroupsQuery = { __typename?: 'Query', targetGroups: Array<{ __typename?: 'TargetGroup', id: string, metadataURI: string, zkRequests: Array<{ __typename?: 'ZKPRequest', id: string, metadataURI: string, validator: any, query_schema: any, query_slotIndex: any, query_operator: any, query_value: Array<any>, query_circuitId: string }> }> };

export const ZkpRequestFragmentFragmentDoc = `
    fragment ZkpRequestFragment on ZKPRequest {
  id
  metadataURI
  validator
  query_schema
  query_slotIndex
  query_operator
  query_value
  query_circuitId
}
    `;
export const TargetGroupFragmentFragmentDoc = `
    fragment TargetGroupFragment on TargetGroup {
  id
  zkRequests {
    ...ZkpRequestFragment
  }
  metadataURI
}
    ${ZkpRequestFragmentFragmentDoc}`;
export const AdFragmentFragmentDoc = `
    fragment AdFragment on Ad {
  id
  advertiser {
    id
    impressions
  }
  impressions
  minBlock
  maxBlock
  maxImpressionPrice
  targetGroups {
    ...TargetGroupFragment
  }
  metadataURI
  remainingBudget
  totalBudget
}
    ${TargetGroupFragmentFragmentDoc}`;
export const PublisherFragmentFragmentDoc = `
    fragment PublisherFragment on Publisher {
  id
  impressions
}
    `;
export const GetAllZkpRequestsDocument = `
    query GetAllZkpRequests {
  zkprequests {
    ...ZkpRequestFragment
  }
}
    ${ZkpRequestFragmentFragmentDoc}`;
export const GetAllAdsDocument = `
    query GetAllAds {
  ads {
    ...AdFragment
  }
}
    ${AdFragmentFragmentDoc}`;
export const GetAdToShowDocument = `
    query GetAdToShow {
  ads(where: {targetGroups_not: []}, orderBy: id, orderDirection: desc) {
    ...AdFragment
  }
}
    ${AdFragmentFragmentDoc}`;
export const GetAdByIdDocument = `
    query GetAdById($id: String) {
  ads(where: {id: $id}) {
    ...AdFragment
  }
}
    ${AdFragmentFragmentDoc}`;
export const GetAllPublishersDocument = `
    query GetAllPublishers {
  publishers {
    ...PublisherFragment
  }
}
    ${PublisherFragmentFragmentDoc}`;
export const GetAllTargetGroupsDocument = `
    query GetAllTargetGroups {
  targetGroups {
    ...TargetGroupFragment
  }
}
    ${TargetGroupFragmentFragmentDoc}`;

const injectedRtkApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    GetAllZkpRequests: build.query<GetAllZkpRequestsQuery, GetAllZkpRequestsQueryVariables | void>({
      query: (variables) => ({ document: GetAllZkpRequestsDocument, variables })
    }),
    GetAllAds: build.query<GetAllAdsQuery, GetAllAdsQueryVariables | void>({
      query: (variables) => ({ document: GetAllAdsDocument, variables })
    }),
    GetAdToShow: build.query<GetAdToShowQuery, GetAdToShowQueryVariables | void>({
      query: (variables) => ({ document: GetAdToShowDocument, variables })
    }),
    GetAdById: build.query<GetAdByIdQuery, GetAdByIdQueryVariables | void>({
      query: (variables) => ({ document: GetAdByIdDocument, variables })
    }),
    GetAllPublishers: build.query<GetAllPublishersQuery, GetAllPublishersQueryVariables | void>({
      query: (variables) => ({ document: GetAllPublishersDocument, variables })
    }),
    GetAllTargetGroups: build.query<GetAllTargetGroupsQuery, GetAllTargetGroupsQueryVariables | void>({
      query: (variables) => ({ document: GetAllTargetGroupsDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };
export const { useGetAllZkpRequestsQuery, useLazyGetAllZkpRequestsQuery, useGetAllAdsQuery, useLazyGetAllAdsQuery, useGetAdToShowQuery, useLazyGetAdToShowQuery, useGetAdByIdQuery, useLazyGetAdByIdQuery, useGetAllPublishersQuery, useLazyGetAllPublishersQuery, useGetAllTargetGroupsQuery, useLazyGetAllTargetGroupsQuery } = injectedRtkApi;

