#!/bin/bash

# Get the directory where the script is located

current_dir=$($PWD)
echo "current dir: $current_dir"

script_dir=$(dirname "$0")
echo "dir: $script_dir"

# Check if a network argument is provided, default to 'localhost'
network=${1:-localhost}
echo "Network: $network"

cd $script_dir
hostname=$(hostname)
echo "hostname: $hostname"

echo "File:"
cat "../solidity-ts/generated/config/${network}.json"

# Extract the address from config relative to the script location
# If network is localhost, use localhost.json, and fetch hostname  if mumbai, use mumbai.json, etc.

if [ $network == "localhost" ]; then
  address=$(jq -r ".[\"$hostname\"]" "../solidity-ts/generated/config/${network}.json")
else
  address=$(jq -r ".address" "../solidity-ts/generated/config/${network}.json")
fi

echo "address: $address"

# Starting block is 43259277 in local (or mumbai) and 50000000 in matic
startBlock=43259277
if [ $network == "matic" ]; then
  startBlock=50000000
fi

# Create the subgraph.yaml file with the new address
cat > ./subgraph.yaml <<EOL
# DO NOT MODIFY THIS FILE DIRECTLY -> modify ./create-subgraph.sh instead

specVersion: 0.0.6
schema:
  file: ./schema.graphql
dataSources:
  - kind: ethereum/contract
    name: Targecy
    network: $network
    source:
      address: "$address"
      abi: Targecy
      startBlock: $startBlock
    mapping:
      kind: ethereum/events
      apiVersion: 0.0.7
      language: wasm/assemblyscript
      entities:
        - Ad
        - Audience
        - Segment
        - User
        - Publisher
      abis:
        - name: Targecy
          file: ./abis/Targecy.json
      eventHandlers:
        - event: AdConsumed(indexed uint256,(address,string,uint8,bool,uint256,uint256,uint256[],address[],uint8[],uint256,uint256,uint256,uint256,uint256),(uint256,address,bool,uint256,uint256,uint256),uint256)
          handler: handleAdConsumed
        - event: AdCreated(indexed uint256,indexed address,(string,uint8,bool,uint256,uint256,uint256[],address[],uint8[],uint256,uint256,uint256))
          handler: handleAdCreated
        - event: AdDeleted(indexed uint256)
          handler: handleAdDeleted
        - event: AdEdited(indexed uint256,(address,string,uint8,bool,uint256,uint256,uint256[],address[],uint8[],uint256,uint256,uint256,uint256,uint256))
          handler: handleAdEdited
        - event: AudienceCreated(indexed uint256,string,uint256[])
          handler: handleAudienceCreated
        - event: AudienceDeleted(indexed uint256)
          handler: handleAudienceDeleted
        - event: AudienceEdited(indexed uint256,string,uint256[])
          handler: handleAudienceEdited
        - event: SegmentCreated(indexed uint256,indexed address,(uint256,uint256,uint256,uint256[],string),string,uint256)
          handler: handleSegmentCreated
        - event: PublisherWhitelisted(indexed address,(uint256,address,bool,uint256,uint256,uint256))
          handler: handlePublisherWhitelisted
        - event: PublisherRemovedFromWhitelist(indexed address)
          handler: handlePublisherRemovedFromWhitelist
        - event: PausePublisher(indexed address)
          handler: handlePausePublisher
        - event: UnpausePublisher(indexed address)
          handler: handleUnpausePublisher
        - event: AdminSet(indexed address)
          handler: handleAdminSet
        - event: AdminRemoved(indexed address)
          handler: handleAdminRemoved
        - event AdvertiserBudgetFunded(indexed address,uint256,uint256)
          handler: handleAdvertiserBudgetFunded
        - event AdvertiserBudgetWithdrawn(indexed address,uint256,uint256)
          handler: handleAdvertiserBudgetWithdrawn
      file: ./src/targecy.ts
EOL

cd $current_dir
