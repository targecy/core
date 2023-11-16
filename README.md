# Targecy

This monorepo contains the code for all the services that make up the Targecy platform. Please review the [whitepaper](./docs/whitepaper.pdf) (see docs folder) for context.

## Requirements

- [Node.js](https://nodejs.org/en/)
- [Yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/) (make sure to turn on Compose V2 Option)
- [jq](https://jqlang.github.io/jq/)
- [yq](https://mikefarah.gitbook.io/yq/)
- [gnupg](https://www.gnupg.org/)
- [Doppler](https://doppler.com)

```bash
$ brew install yarn node docker jq gnupg dopplerhq/cli/doppler
```

_Note: It is recommended to use a computer with 16GB (RAM) or just run essential services._

## Installation

1. Clone the repo
  
```bash
$ git clone git@github.com:targecy/core.git
```

2. Fetch secrets from Doppler

```bash
# Ask to the team for access to Doppler!

# Login to Doppler following the instructions in the CLI
$ doppler login

# Fetch secrets from Doppler for each project
$ yarn download-env-vars
```


To spin up the services, just run the following command:

```bash
$ yarn install && yarn start-services
```

_Note: if you want to run the blockchain explorer (a Blockscout instance) as well, which is not essential, run yarn start-explorer_

Once all services are running, in order to initialize the contracts, the subgraph and the backend, please execute:

```bash
$ yarn setup
```

If you want to seed Targecy with some data, run:

```bash
$ yarn seed
```

## Running the Dapp

Check that the services are running, and then execute the following in different terminals:

```bash
$ yarn dev-dapp
$ yarn start-backend
$ yarn start-relayer
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
