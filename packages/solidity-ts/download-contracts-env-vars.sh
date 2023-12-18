
# Env from params
env=${1:-dev}
echo "env: $env"

doppler secrets download --project solidity-ts --config $env --format env --no-file > .env
