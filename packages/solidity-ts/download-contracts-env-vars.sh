
# Env from params
env=${1:-dev}
echo "env: $env"

doppler secrets download --project contracts --config $env --format env --no-file > .env
