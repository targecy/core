script_dir=$(dirname "$0")

# get version from parameter or use default
version=${1:-1.1.1}

yarn dlx @graphprotocol/graph-cli@0.62.0 deploy --node http://localhost:8020/ --ipfs http://127.0.0.1:5001 -l $version targecy $script_dir/subgraph.yaml

# This is a workaround for a buy that happens when running directly yarn deploy-local
