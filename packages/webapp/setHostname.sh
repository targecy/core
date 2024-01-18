#!/bin/bash

# Define the directory and file name
DIR="src/config"
FILE="$DIR/hostname.mjs"

# Create the directory if it doesn't exist
mkdir -p $DIR

# Check if the hostname command exists
if command -v hostname &> /dev/null
then
    # Get the hostname of the system
    hostname=$(hostname)
else
    # Use default value if hostname command does not exist
    hostname="THIS_ENVIRONMENT_DOES_NOT_HAVE_HOSTNAME_USE_ENV_VARS"
fi

# Write the hostname to the TypeScript file
echo "export const hostname = '$hostname';" > $FILE

echo "Hostname has been written to $FILE"
