#!/bin/bash

current_dir=$PWD

# Get the directory where the script is located
script_dir=$(dirname "$0")

cd $script_dir

cd ../..

MNEMONIC_FILE_PATH="./solidity-ts/mnemonics/mnemonic.secret"
# Read the mnemonic from the file
MNEMONIC=$(cat $MNEMONIC_FILE_PATH)

# Escape double quotes in the mnemonic
MNEMONIC_ESCAPED=$(echo $MNEMONIC | sed 's/"/\\"/g')

cd $current_dir

# Generate docker-compose.yml
cat <<EOL > $script_dir/docker-compose.yml
version: '3.8'

services:
  ganache:
    image: trufflesuite/ganache-cli
    volumes:
      - ./accounts:/app/accounts
    mem_limit: 1024m
    ports:
      - '8545:8545' # Expose the Ethereum RPC port
    command: >
      -v
      -a 10
      -b 10
      -k byzantium
      -i 1337
      -m "$MNEMONIC_ESCAPED"
      --account_keys_path ./accounts/accounts.json

volumes:
  ganache-config:
EOL

cd ..