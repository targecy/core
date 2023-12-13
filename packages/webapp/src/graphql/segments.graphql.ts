import { gql } from 'graphql-request';

export const Segments = gql`
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

  query GetSegment($id: ID!) {
    segment(id: $id) {
      ...SegmentFragment
    }
  }

  query GetLastSegments($limit: Int!) {
    segments(first: $limit) {
      ...SegmentFragment
    }
  }
`;
