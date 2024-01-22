import { gql } from 'graphql-request';

export const Advertisers = gql`
  fragment BudgetFragment on Budget {
    id
    totalBudget
    remainingBudget
  }

  fragment AdvertiserFragment on Advertiser {
    id
    adsQuantity
    impressions
    clicks
    conversions
  }

  query GetBudget($id: ID!) {
    budget(id: $id) {
      ...BudgetFragment
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
