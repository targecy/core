import { gql } from 'graphql-request';

export const GetAllAds = gql`
  query GetAllAds {
    ads {
      impressions
    }
  }
`;
