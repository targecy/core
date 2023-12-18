import { gql } from 'graphql-request';

export const GetAllSegments = gql`
  fragment SegmentFragment on Segment {
    id
    issuer {
      id
    }
    metadataURI
    validator
    querySchema
    querySlotIndex
    queryOperator
    queryValue
    queryCircuitId
  }

  query GetAllSegments {
    segments {
      ...SegmentFragment
    }
  }
`;
