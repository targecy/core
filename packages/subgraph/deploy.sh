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
subgraph=${1:-"targecy-mumbai"}
echo "Subgraph: $subgraph"

key=${2:-$TEST_SUBGRAPH_KEY}
echo "Key: $key"

version=${3:-1.2.0}
echo "Version: $version"

yarn dlx @graphprotocol/graph-cli@0.62.0 deploy --studio $subgraph --deploy-key $key -l $version $script_dir/subgraph.yaml

# This is a workaround for a bug that happens when running directly yarn graph deploy
