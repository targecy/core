import { gql } from 'graphql-request';

export const GetSmartContractCallsByAddress = gql`
  query GetSmartContractCallsByAddress($address: String, $contracts: [String!]) {
    ethereum(network: matic) {
      smartContractCalls(caller: { is: $address }, smartContractAddress: { in: $contracts }) {
        count
        smartContract {
          address {
            address
          }
        }
      }
    }
  }
`;
