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

export type Ad_OrderBy =
  | 'advertiser'
  | 'advertiser__id'
  | 'advertiser__impressions'
  | 'id'
  | 'impressions'
  | 'maxBlock'
  | 'maxImpressionPrice'
  | 'metadataURI'
  | 'minBlock'
  | 'remainingBudget'
  | 'targetGroups'
  | 'totalBudget';

export type BlockChangedFilter = {
  number_gte: Scalars['Int'];
};

export type Block_Height = {
  hash?: InputMaybe<Scalars['Bytes']>;
  number?: InputMaybe<Scalars['Int']>;
  number_gte?: InputMaybe<Scalars['Int']>;
};

/** Defines the order direction, either ascending or descending */
export type OrderDirection =
  | 'asc'
  | 'desc';

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

export type Publisher_OrderBy =
  | 'id'
  | 'impressions';

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

export type TargetGroup_OrderBy =
  | 'id'
  | 'metadataURI'
  | 'zkRequests';

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

export type User_OrderBy =
  | 'id'
  | 'impressions';

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

export type ZkpRequest_OrderBy =
  | 'id'
  | 'metadataURI'
  | 'query_circuitId'
  | 'query_operator'
  | 'query_schema'
  | 'query_slotIndex'
  | 'query_value'
  | 'validator';

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

export type ZkpRequestFragment = { __typename?: 'ZKPRequest', query_schema: any, query_slotIndex: any, query_value: Array<any>, query_circuitId: string, query_operator: any, id: string, metadataURI: string, validator: any };

export type GetAllZkpRequestsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllZkpRequestsQuery = { __typename?: 'Query', zkprequests: Array<{ __typename?: 'ZKPRequest', query_schema: any, query_slotIndex: any, query_value: Array<any>, query_circuitId: string, query_operator: any, id: string, metadataURI: string, validator: any }> };

export type GetZkpRequestQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetZkpRequestQuery = { __typename?: 'Query', zkprequest?: { __typename?: 'ZKPRequest', query_schema: any, query_slotIndex: any, query_value: Array<any>, query_circuitId: string, query_operator: any, id: string, metadataURI: string, validator: any } | null };

export type GetZkpRequestsQueryVariables = Exact<{
  ids: Array<Scalars['String']> | Scalars['String'];
}>;


export type GetZkpRequestsQuery = { __typename?: 'Query', zkprequests: Array<{ __typename?: 'ZKPRequest', query_schema: any, query_slotIndex: any, query_value: Array<any>, query_circuitId: string, query_operator: any, id: string, metadataURI: string, validator: any }> };

export type GetZkpRequestForTargetGroupQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetZkpRequestForTargetGroupQuery = { __typename?: 'Query', targetGroup?: { __typename?: 'TargetGroup', zkRequests: Array<{ __typename?: 'ZKPRequest', query_schema: any, query_slotIndex: any, query_value: Array<any>, query_circuitId: string, query_operator: any, id: string, metadataURI: string, validator: any }> } | null };

export const ZkpRequestFragmentDoc = gql`
    fragment ZKPRequest on ZKPRequest {
  query_schema
  query_slotIndex
  query_value
  query_circuitId
  query_operator
  id
  metadataURI
  validator
}
    `;
export const GetAllZkpRequestsDocument = gql`
    query GetAllZKPRequests {
  zkprequests {
    ...ZKPRequest
  }
}
    ${ZkpRequestFragmentDoc}`;
export const GetZkpRequestDocument = gql`
    query GetZKPRequest($id: ID!) {
  zkprequest(id: $id) {
    ...ZKPRequest
  }
}
    ${ZkpRequestFragmentDoc}`;
export const GetZkpRequestsDocument = gql`
    query GetZKPRequests($ids: [String!]!) {
  zkprequests(where: {id_in: $ids}) {
    ...ZKPRequest
  }
}
    ${ZkpRequestFragmentDoc}`;
export const GetZkpRequestForTargetGroupDocument = gql`
    query GetZKPRequestForTargetGroup($id: ID!) {
  targetGroup(id: $id) {
    zkRequests {
      ...ZKPRequest
    }
  }
}
    ${ZkpRequestFragmentDoc}`;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    GetAllZKPRequests(variables?: GetAllZkpRequestsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetAllZkpRequestsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetAllZkpRequestsQuery>(GetAllZkpRequestsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetAllZKPRequests', 'query');
    },
    GetZKPRequest(variables: GetZkpRequestQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetZkpRequestQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetZkpRequestQuery>(GetZkpRequestDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetZKPRequest', 'query');
    },
    GetZKPRequests(variables: GetZkpRequestsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetZkpRequestsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetZkpRequestsQuery>(GetZkpRequestsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetZKPRequests', 'query');
    },
    GetZKPRequestForTargetGroup(variables: GetZkpRequestForTargetGroupQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetZkpRequestForTargetGroupQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetZkpRequestForTargetGroupQuery>(GetZkpRequestForTargetGroupDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetZKPRequestForTargetGroup', 'query');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;