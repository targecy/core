import { gql } from 'graphql-request';

export const GetAllPublishers = gql`
  fragment PublisherFragment on Publisher {
    id
    impressions
  }

  query GetAllPublishers {
    publishers {
      ...PublisherFragment
    }
  }
`;
