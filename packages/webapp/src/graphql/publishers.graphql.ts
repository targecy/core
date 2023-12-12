import { gql } from 'graphql-request';

export const Publisher = gql`
  fragment PublisherFragment on Publisher {
    id
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
