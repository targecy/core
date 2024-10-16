script_dir=$(dirname "$0")

# Path to the .env file
env_file=".env"

# Check if the .env file exists
if [ ! -f "$env_file" ]; then
    echo "Error: .env file not found."
    exit 1
fi

# Source the .env file
source "$env_file"

# Check if a network argument is provided, default to 'localhost'
subgraph=${1:-"targecy-amoy"}
echo "Subgraph: $subgraph"

key=${2:-$TEST_SUBGRAPH_KEY}
echo "Key: $key"

version=${3:-1.3.1}
echo "Version: $version"

# @todo save version in file and read it from webapp and backend, both codegen and code

yarn dlx @graphprotocol/graph-cli@0.71.2 deploy --studio $subgraph --deploy-key $key -l $version $script_dir/subgraph.yaml

# This is a workaround for a bug that happens when running directly yarn graph deploy
