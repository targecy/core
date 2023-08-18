import { gql } from 'graphql-request';

export const GetAllAds = gql`
  fragment AdFragment on Ad {
    id
    impressions
    targetGroupIds
    metadataURI
    budget
  }
  
  query GetAllAds {
    ads {
      ...AdFragment
    }
  }
`;
