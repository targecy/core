import { gql } from 'graphql-request';

export const GetAllTargetGroups = gql`
  fragment TargetGroupFragment on TargetGroup {
    id
    zkRequests {
      ...ZkpRequestFragment
    }
    metadataURI
  }

  query GetAllTargetGroups {
    targetGroups {
      ...TargetGroupFragment
    }
  }
`;
