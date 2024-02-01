"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTokenHoldingsByAddress = exports.GetTransactionsByAddress = exports.GetSmartContractCallsByAddress = void 0;
const graphql_request_1 = require("graphql-request");
exports.GetSmartContractCallsByAddress = (0, graphql_request_1.gql) `
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
exports.GetTransactionsByAddress = (0, graphql_request_1.gql) `
  query GetTransactions($network: EthereumNetwork!, $address: String, $from: ISO8601DateTime) {
    ethereum(network: $network) {
      transactions(txSender: { is: $address }, date: { since: $from }) {
        hash
      }
    }
  }
`;
exports.GetTokenHoldingsByAddress = (0, graphql_request_1.gql) `
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
