#!/bin/bash

# Get the directory where the script is located
script_dir=$(dirname "$0")

# The JSON file
json_file="$script_dir/abis/localhost_Targecy.json"

# Use jq to remove objects containing the string
jq 'map(if .inputs then .inputs = (.inputs | map(if .type == "tuple" and .components then .components = (.components | map(select(.type != "uint256[2][2][]"))) else . end)) else . end)' $json_file > temp.json && mv temp.json $json_file