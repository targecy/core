#!/bin/bash

# Define the directory and file name
DIR="src/config"
FILE="$DIR/hostname.mjs"

# Create the directory if it doesn't exist
mkdir -p $DIR

# Get the hostname of the system
hostname=$(hostname)

# Write the hostname to the TypeScript file
echo "export const hostname = '$hostname';" > $FILE

echo "Hostname has been written to $FILE"
