import { gql } from 'graphql-request';

export const Advertisers = gql`
  fragment AdvertiserFragment on Advertiser {
    id
    adsQuantity
    impressions
    clicks
    conversions
    budget {
      id
      totalBudget
      remainingBudget
    }
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
