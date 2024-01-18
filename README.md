# Targecy

This monorepo contains the code for all the services that make up the Targecy platform. Please review the [whitepaper](./docs/whitepaper.pdf) (see docs folder) for context or [ARCHITECTURE.md](./ARCHITECTURE.md) for a high-level overview of the platform.

## Requirements

- [Node.js](https://nodejs.org/en/)
- [Yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/) (make sure to turn on Compose V2 Option)
- [jq](https://jqlang.github.io/jq/)
- [yq](https://mikefarah.gitbook.io/yq/)
- [gnupg](https://www.gnupg.org/)
- [Doppler](https://doppler.com)

```bash
 brew install yarn node docker jq gnupg dopplerhq/cli/doppler
```

_Note: It is recommended to use a computer with 16GB (RAM) or just run essential services._

## Installation

1. Clone the repo

```bash
 git clone git@github.com:targecy/core.git
```

2. Fetch secrets from [Doppler](https://www.doppler.com/)

```bash
# Ask to the team for access to Doppler!

# Login to Doppler following the instructions in the CLI
 doppler login

# Fetch secrets from Doppler for each project
 yarn download-env-vars
```

To install dependencies and spin up the services, just run the following command:

```bash
 yarn install && yarn start-services
```

_Note: if you want to run the blockchain explorer (a Blockscout instance) as well, which is not essential, run yarn start-explorer_

Once all services are running, in order to initialize the contracts, the subgraph and the backend, please execute:

```bash
 yarn setup
```

If you want to seed Targecy with some data, run:

```bash
 yarn seed
```

Help: If you want to see the available commands, in root or in any package, run:

```bash
$ yarn run
```

## Running the Dapp

Check that the services are running, and then execute the following in different terminals:

```bash
 yarn dev-dapp
 yarn start-backend
 yarn start-relayer
```

Now you have all the services (a local blockchain, The Graph Node, databases, backend, relayer and the main DApp) running locally.

## Reset

In case you want to reset the entire local environment, you can run these commands in less than 3 minutes.

```bash
yarn reset-services && yarn setup
```

## Ports and Services

These are the services that make up the Targecy platform:

- [Dapp](./packages/webapp/README.md)
- [SDK](./packages/sdk/README.md)
- [Backend](./packages/backend/README.md)
- [Relayer](./packages/relayer/README.md)
- [Subgraph](./packages/subgraph/README.md)
- [Contracts](./packages/solidity-ts/README.md)

Also, this repo provides local instances of the following services:

- [Chain](./packages/services/chain/docker-compose.yml)
- [Chain Explorer](./packages/services/explorer/docker-compose-no-build-ganache.yml)
- [Databases](./packages/services/databases/docker-compose.yml)
- [The Graph Node](./packages/services/subgraph/docker-compose.yml)

The following table shows the ports used by each service:

| Port     | Description                                                                        |
| -------- | ---------------------------------------------------------------------------------- |
| **3090** | [Main Dapp](http://localhost:3090)                                                 |
| **4000** | Relayer                                                                            |
| **4001** | Backend                                                                            |
| **5001** | Subgraph IPFS                                                                      |
| **5432** | Subgraph Postgres                                                                  |
| **5435** | Backend Postgres                                                                   |
| **5436** | Relayer Postgres                                                                   |
| **7432** | Explorer Postgres                                                                  |
| **8000** | [Subgraph Node & GraphQL UI](http://localhost:8000/subgraphs/name/targecy/graphql) |
| **8090** | [Local Chain Explorer](http://localhost:8090)                                      |
| **8545** | Local Blockchain RPC                                                               |

_Note: Each service has its own README.md file with specific information._

## DevX

Some comments:

- As you can see, Targecy requires multiple and different elements to work, this may create friction for builders, so this repo has been designed to provide a smooth DevX, requiring as few steps as possible to get the platform up and running.
- The main scripts are in the root package.json file. These scripts are used to start the services, setup the contracts, seed the data, etc.
- There are multiple test, lint, seed, etc. solutions integrated in each part of the platform, the goal is to provide a state-of-the-art DevX while ensuring robustness, we encourage everyone to help us improving this aspect.

## Contact

In case you have any questions, please contact us [here](mailto:martin@targecy.xyz).
