/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import fs from 'fs';

import chalk from 'chalk';

import { hardhatArtifactsDir } from '~helpers/constants/toolkitPaths';

export const contractsDir = './generated';
export const graphDir = '../subgraph';
export const webappDir = '../webapp/src/generated';
export const sdkDir = '../sdk/src/generated';
export const relayerDir = '../relayer/src/generated';

const publishContract = (dir: string, contractName: string): boolean => {
  try {
    const contract = fs.readFileSync(`${hardhatArtifactsDir}/contracts/core/${contractName}.sol/${contractName}.json`).toString();
    const contractJson: { address: string; abi: [] } = JSON.parse(contract as string);

    if (!Boolean(fs.existsSync(`${dir}/abis`))) fs.mkdirSync(`${dir}/abis`);
    fs.writeFileSync(`${dir}/abis/${contractName}.json`, JSON.stringify(contractJson.abi, null, 2));

    console.log(' 📠 Published ' + chalk.green(contractName));

    return true;
  } catch (e) {
    console.log('Failed to publish ' + chalk.red(contractName) + ' to ' + dir + '.');
    console.log(e);
    return false;
  }
};
export const hardhatPublishToOtherPackage = (dir: string): void => {
  console.log(chalk.white('Running Post Deploy: publish contracts to ' + dir + '...'));

  // Copy config/config.json
  if (dir.includes('generated') && dir != contractsDir) {
    console.log('Copying config/config.json to ' + dir + '...');
    const configPath = `${contractsDir}/config/config.json`;
    const configContent = JSON.parse(fs.readFileSync(configPath).toString() as string);
    const folderPath = `${dir}/config`;
    const destinyPath = `${dir}/config/config.json`;
    if (!Boolean(fs.existsSync(folderPath))) {
      fs.mkdirSync(folderPath);
    }
    fs.writeFileSync(destinyPath, JSON.stringify(configContent, null, 2));
    console.log(chalk.green(' ✔️ Copied config/config.json to ' + dir + '!'));
  }

  const deploymentSubdirs = fs.readdirSync(hardhatArtifactsDir + '/contracts/core/Targecy.sol');
  deploymentSubdirs.forEach(function () {
    const files = fs.readdirSync(`${hardhatArtifactsDir}/contracts/core/Targecy.sol`);
    files.forEach(function (file) {
      if (file.includes('.json') && !file.includes('dbg')) {
        console.log('Publishing ' + file + ' to ' + dir + '...');
        const contractName = file.replace('.json', '');
        publishContract(dir, contractName as string);
      }
    });
  });
  console.log(chalk.green('✔️ Published contracts to the ' + dir + ' package! '));
};
