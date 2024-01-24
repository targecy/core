import { gql } from 'graphql-request';

export const SegmentFragment = gql`
  fragment Segment on Segment {
    querySchema
    querySlotIndex
    queryValue
    queryCircuitId
    queryOperator
    id
    issuer
    metadataURI
  }
`;

export const GetAllSegments = gql`
  query GetAllSegments {
    segments {
      ...Segment
    }
  }
`;

export const GetSegment = gql`
  query GetSegment($id: ID!) {
    segment(id: $id) {
      ...Segment
    }
  }
`;

export const GetSegments = gql`
  query GetSegments($ids: [ID!]!) {
    segments(where: { id_in: $ids }) {
      ...Segment
    }
  }
`;

export const GetSegmentForAudience = gql`
  query GetSegmentForAudience($id: ID!) {
    audience(id: $id) {
      segments {
        ...Segment
      }
    }
  }
`;
