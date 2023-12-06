# Define the list of packages
packages=("webapp" "backend" "relayer" "solidity-ts" "subgraph")

script_dir=$(dirname "$0")
cd $script_dir
echo "Downloading env vars from Doppler..."

env=${1:-dev}
echo "env: $env"

# Loop through each package
for package in "${packages[@]}"; do
    # Navigate to the package directory
    cd "packages/$package/"
    
    # Download the environment variables using Doppler
    doppler secrets download --project "$package" --config "$env" --format env --no-file > .env
    
    # Navigate back to the root directory
    cd ../..
    
    # Echo the completion message
    echo "Downloaded env vars for $package"
done

echo "Done downloading env vars from Doppler"