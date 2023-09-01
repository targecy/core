import { gql } from 'graphql-request';

export const GetAllZkpRequests = gql`
  fragment ZkpRequestFragment on ZKPRequest {
    id
    metadataURI
    validator
    query_schema
    query_slotIndex
    query_operator
    query_value
    query_circuitId
  }

  query GetAllZkpRequests {
    zkprequests {
      ...ZkpRequestFragment
    }
  }
`;
