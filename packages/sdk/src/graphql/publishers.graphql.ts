import { gql } from 'graphql-request';

export const GetAllPublishers = gql`
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
`;
