
script_dir=$(dirname "$0")
cd $script_dir
echo "Downloading env vars from Doppler..."

cd packages/webapp/
doppler secrets download --project dapp --config dev --format env --no-file > .env
cd ../..
echo "Downloaded env vars for webapp"

cd packages/backend/
doppler secrets download --project backend --config dev --format env --no-file > .env
cd ../..
echo "Downloaded env vars for backend"

cd packages/relayer/
doppler secrets download --project relayer --config dev --format env --no-file > .env
cd ../..
echo "Downloaded env vars for relayer"

echo "Done downloading env vars from Doppler"