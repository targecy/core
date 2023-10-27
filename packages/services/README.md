# Targecy Services

Make sure you have docker installed and compose V2 activated.

To run the services, just run the following command:

```bash
npm run start-all
```

See localhost:8000 for graph-node's playground, localhost:8090 for chain explorer or just hit localhost:8545 for the RPC endpoint.

```curl

$ curl --location --request POST 'localhost:8545' \
--header 'Content-Type: application/json' \
--data-raw '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "eth_blockNumber",
    "params": []
}'

```

To stop the services, just run the following command:

```bash
npm run stop-all
```

To see available accounts with initial balance to use, please see ./chain/accounts/accounts.json or just run the following command:

```bash
$ npm run show-accounts
```

DISCLAIMER: This is a testnet, so don't use any of these accounts in production.
