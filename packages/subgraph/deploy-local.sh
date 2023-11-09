script_dir=$(dirname "$0")

yarn dlx @graphprotocol/graph-cli deploy --node http://localhost:8020/ --ipfs http://127.0.0.1:5001 -l 1.0.1 targecy $script_dir/subgraph.yaml

# This is a workaround for a buy that happens when running directly yarn deploy-local
