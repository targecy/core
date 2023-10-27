script_dir=$(dirname "$0")

echo "dir: $script_dir"

graph deploy --node http://localhost:8020/ --ipfs http://127.0.0.1:5001 -l 1.0.1 targecy $script_dir/subgraph.yaml