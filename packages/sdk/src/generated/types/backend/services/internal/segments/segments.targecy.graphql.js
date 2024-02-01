"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSegmentForAudience = exports.GetSegments = exports.GetSegment = exports.GetAllSegments = exports.SegmentFragment = void 0;
const graphql_request_1 = require("graphql-request");
exports.SegmentFragment = (0, graphql_request_1.gql) `
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
exports.GetAllSegments = (0, graphql_request_1.gql) `
  query GetAllSegments {
    segments {
      ...Segment
    }
  }
`;
exports.GetSegment = (0, graphql_request_1.gql) `
  query GetSegment($id: ID!) {
    segment(id: $id) {
      ...Segment
    }
  }
`;
exports.GetSegments = (0, graphql_request_1.gql) `
  query GetSegments($ids: [ID!]!) {
    segments(where: { id_in: $ids }) {
      ...Segment
    }
  }
`;
exports.GetSegmentForAudience = (0, graphql_request_1.gql) `
  query GetSegmentForAudience($id: ID!) {
    audience(id: $id) {
      segments {
        ...Segment
      }
    }
  }
`;
