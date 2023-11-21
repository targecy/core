// scripts/propose-upgrade.js
const { defender } = require('hardhat');
const { getStringFromFile } = require('./utils');

async function main() {
  const addresses = JSON.parse(getStringFromFile('../addresses.json'));

  if (!addresses.targecy) throw new Error('Missing Targecy address');

  const proxyAddress = addresses.targecy;

  const BoxV2 = await ethers.getContractFactory('BoxV2');
  console.log('Preparing proposal...');
  const proposal = await defender.proposeUpgrade(proxyAddress, BoxV2);
  console.log('Upgrade proposal created at:', proposal.url);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
