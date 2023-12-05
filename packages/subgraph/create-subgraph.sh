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

# Extract the address from config.json relative to the script location
address=$(jq -r ".${network}_targecyProxy" "../solidity-ts/generated/config/config.json")

echo "address: $address"

# Create the subgraph.yaml file with the new address
cat > ./subgraph.yaml <<EOL
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
      startBlock: 0 # Change by network
    mapping:
      kind: ethereum/events
      apiVersion: 0.0.7
      language: wasm/assemblyscript
      entities:
        - Ad
        - TargetGroup
        - ZKPRequest
        - User
        - Publisher
      abis:
        - name: Targecy
          file: ./abis/Targecy.json
      eventHandlers:
        - event: AdConsumed(indexed uint256,indexed address,indexed address)
          handler: handleAdConsumed
        - event: AdCreated(indexed uint256,string,uint256,uint256[])
          handler: handleAdCreated
        - event: AdDeleted(indexed uint256)
          handler: handleAdDeleted
        - event: AdEdited(indexed uint256,string,uint256,uint256[])
          handler: handleAdEdited
        - event: TargetGroupCreated(indexed uint256,string,uint256[])
          handler: handleTargetGroupCreated
        - event: TargetGroupDeleted(indexed uint256)
          handler: handleTargetGroupDeleted
        - event: TargetGroupEdited(indexed uint256,string,uint256[])
          handler: handleTargetGroupEdited
        - event: ZKPRequestCreated(indexed uint256,indexed address,(uint256,uint256,uint256,uint256[],string),string,uint256)
          handler: handleZKPRequestCreated
        - event: PublisherWhitelisted(indexed address)
          handler: handlePublisherWhitelisted
        - event: PublisherRemovedFromWhitelist(indexed address)
          handler: handlePublisherRemovedFromWhitelist
      file: ./src/targecy.ts
EOL

cd $current_dir
