import { gql } from 'graphql-request';

export const GetAllSegments = gql`
  fragment SegmentFragment on Segment {
    id
    metadataURI
    issuer {
      id
    }
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
