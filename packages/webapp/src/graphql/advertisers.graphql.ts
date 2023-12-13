import { gql } from 'graphql-request';

export const Advertisers = gql`
  fragment AdvertiserFragment on Advertiser {
    id
    totalBudget
    remainingBudget
    adsQuantity
    impressions
    clicks
    conversions
  }

  query GetAllAdvertisers {
    ads {
      ...AdFragment
    }
  }

  query GetAdvertiser($id: ID!) {
    advertiser(id: $id) {
      ...AdvertiserFragment
    }
  }
`;
