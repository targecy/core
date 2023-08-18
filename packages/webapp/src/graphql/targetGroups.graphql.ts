import { gql } from 'graphql-request';

export const GetAllTargetGroups = gql`
  fragment TargetGroupFragment on TargetGroup {
    id
    zkRequestIds
    metadataURI
  }
  
  query GetAllTargetGroups {
    targetGroups {
      ...TargetGroupFragment
    }
  }
`;
