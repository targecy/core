import { gql } from 'graphql-request';

export const GetSmartContractCallsByAddress = gql`
  query GetSmartContractCallsByAddress(
    $network: EthereumNetwork!
    $address: String
    $contracts: [String!]
    $from: ISO8601DateTime
  ) {
    ethereum(network: $network) {
      smartContractCalls(caller: { is: $address }, smartContractAddress: { in: $contracts }, date: { since: $from }) {
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

export const GetTokenHoldingsByAddress = gql`
  query GetTokenHoldingsByAddress(
    $network: EthereumNetwork!
    $tokens: [String!]
    $receiver: String!
    $from: ISO8601DateTime
    $till: ISO8601DateTime
  ) {
    ethereum(network: $network) {
      transfers(
        options: { desc: "block.timestamp.time", limit: 10000, offset: 0 }
        date: { since: $from, till: $till }
        amount: { gt: 0 }
        currency: { in: $tokens }
        receiver: { is: $receiver }
      ) {
        block {
          timestamp {
            time(format: "%Y-%m-%d %H:%M:%S")
          }
          height
        }
        sender {
          address
        }
        receiver {
          address
        }
        transaction {
          hash
        }
        amount
        currency {
          symbol
          tokenId
          name
          tokenType
          address
        }
        external
      }
    }
  }
`;
