import fs from 'fs';

import chalk from 'chalk';

import { hardhatDeploymentsDir } from '~helpers/constants/toolkitPaths';

export const contractsDir = './generated';
export const graphDir = '../subgraph';
export const webappDir = '../webapp/src/generated';
export const sdkDir = '../sdk/src/generated';

const publishContract = (dir: string, contractName: string, networkName: string): boolean => {
  try {
    const contract = fs.readFileSync(`${hardhatDeploymentsDir}/${networkName}/${contractName}.json`).toString();
    const contractJson: { address: string; abi: [] } = JSON.parse(contract);
    const graphConfigPath = `${dir}/config/config.json`;
    let graphConfigStr = '{}';
    try {
      if (fs.existsSync(graphConfigPath)) {
        graphConfigStr = fs.readFileSync(graphConfigPath).toString() as any;
      }
    } catch (e) {
      console.log(e);
    }

    const graphConfig = JSON.parse(graphConfigStr);
    graphConfig[`${networkName}_${contractName}Address`] = contractJson.address;

    const folderPath = graphConfigPath.replace('/config.json', '');
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }
    fs.writeFileSync(graphConfigPath, JSON.stringify(graphConfig, null, 2));
    if (!fs.existsSync(`${dir}/abis`)) fs.mkdirSync(`${dir}/abis`);
    fs.writeFileSync(`${dir}/abis/${networkName}_${contractName}.json`, JSON.stringify(contractJson.abi, null, 2));

    console.log(' 📠 Published ' + chalk.green(contractName) + ' to the frontend');

    return true;
  } catch (e) {
    console.log('Failed to publish ' + chalk.red(contractName) + ' to ' + dir + '.');
    console.log(e);
    return false;
  }
};
export const hardhatPublishToOtherPackage = (dir: string): void => {
  console.log(chalk.white('Running Post Deploy: publish contracts to ' + dir + '...'));

  const deploymentSubdirs = fs.readdirSync(hardhatDeploymentsDir);
  deploymentSubdirs.forEach(function (directory) {
    const files = fs.readdirSync(`${hardhatDeploymentsDir}/${directory}`);
    files.forEach(function (file) {
      if (file.includes('.json')) {
        const contractName = file.replace('.json', '');
        publishContract(dir, contractName, directory);
      }
    });
  });
  console.log(chalk.green('✔️ Published contracts to the ' + dir + ' package! '));
};
