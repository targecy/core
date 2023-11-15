import { gql } from 'graphql-request';

export const ZKPRequestFragment = gql`
  fragment ZKPRequest on ZKPRequest {
    query_schema
    query_slotIndex
    query_value
    query_circuitId
    query_operator
    id
    metadataURI
    validator
  }
`;

export const GetAllZKPRequests = gql`
  query GetAllZKPRequests {
    zkprequests {
      ...ZKPRequest
    }
  }
`;

export const GetZKPRequest = gql`
  query GetZKPRequest($id: ID!) {
    zkprequest(id: $id) {
      ...ZKPRequest
    }
  }
`;

export const GetZKPRequests = gql`
  query GetZKPRequests($ids: [String!]!) {
    zkprequests(where: { id_in: $ids }) {
      ...ZKPRequest
    }
  }
`;

export const GetZKPRequestForTargetGroup = gql`
  query GetZKPRequestForTargetGroup($id: ID!) {
    targetGroup(id: $id) {
      zkRequests {
        ...ZKPRequest
      }
    }
  }
`;
