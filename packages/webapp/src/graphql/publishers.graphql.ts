import { gql } from 'graphql-request';

export const GetAllPublishers = gql`
  fragment PublisherFragment on Publisher {
    id
    address
    impressions
  }

  query GetAllPublishers {
    publishers {
      ...PublisherFragment
    }
  }
`;
