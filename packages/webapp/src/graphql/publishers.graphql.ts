import { gql } from 'graphql-request';

export const Publisher = gql`
  fragment PublisherFragment on Publisher {
    id
    active
    metadataURI
    cpi
    cpc
    cpa
    usersRewardsPercentage
    adsQuantity
    impressions
    clicks
    conversions
  }

  query GetAllPublishers {
    publishers {
      ...PublisherFragment
    }
  }

  query GetPublisher($id: ID!) {
    publisher(id: $id) {
      ...PublisherFragment
    }
  }
`;
