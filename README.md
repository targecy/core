# Targecy

This monorepo contains the code for all the services that make up the Targecy platform. Please review the [whitepaper](./docs/whitepaper.pdf) (see docs folder) for context.

## Requirements

- [Node.js](https://nodejs.org/en/) (v12.16.1)
- [Yarn](https://yarnpkg.com/) (v1.22.4)
- [Docker](https://www.docker.com/) (v19.03.8)

## Installation

To spin up the services, just run the following command:

```bash
yarn install
yarn run start-services
```

Once all services are running:

```bash
yarn run deploy-contracts
yarn run deploy-subgraph
yarn run migrate-backend
```

## Running the Dapp

Check that the services are running, and then:

```bash
yarn run start-dapp
yarn run start-backend
yarn run start-relayer
```

Now you have all the services (a local blockchain, The Graph Node, databases, backend, relayer and the main DApp) running locally.

## Ports and Services

The following table shows the ports used by each service:

| Port | Description                |
| ---- | -------------------------- |
| 3090 | Main Dapp                  |
| 4000 | Relayer                    |
| 4001 | Backend                    |
| 5001 | Subgraph IPFS              |
| 5432 | Subgraph Postgres          |
| 5435 | Backend Postgres           |
| 5436 | Relayer Postgres           |
| 7432 | Explorer Postgres          |
| 8000 | Subgraph Node & GraphQL UI |
| 8090 | Local Chain Explorer       |
| 8545 | Local Blockchain RPC       |

_Note: Each service has its own README.md file with specific information._
