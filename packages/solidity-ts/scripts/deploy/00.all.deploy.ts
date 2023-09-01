import * as fs from 'fs';
import * as path from 'path';

import { DeployFunction } from 'hardhat-deploy/types';

import { THardhatRuntimeEnvironmentExtended } from '~helpers/types/THardhatRuntimeEnvironmentExtended';

// Function to save a string to a file
export const saveStringToFile = (str: string, fileName: string): void => {
  const filePath = path.join(__dirname, fileName);
  fs.writeFileSync(filePath, str, 'utf8');
  console.log(`Saved string to ${filePath}`);
};

const func: DeployFunction = async (hre: THardhatRuntimeEnvironmentExtended) => {
  console.log('Starting Deployment...');

  const { deployments, getNamedAccounts } = hre;
  const { deployer } = await getNamedAccounts();

  const { deploy } = deployments;
  console.log('Deployer: ', deployer);

  const mockValidatorDeployResult = await deploy('MockValidator', {
    from: deployer,
    log: true,
  });

  const validatorAddress = mockValidatorDeployResult.address;
  const protocolVault = '0xEB71ed911e4dFc35Da80103a72fE983C8c709F33';
  const defaultImpressionPrice = 1;

  const deployment = await deploy('Targecy', {
    args: [],
    proxy: {
      // viaAdminContract: 'ProxyAdmin',
      proxyContract: 'TransparentUpgradeableProxy',
      // methodName: 'initialize',
      execute: {
        init: {
          methodName: 'initialize',
          args: [validatorAddress, protocolVault, defaultImpressionPrice],
        },
      },
    },
    from: deployer,
    log: true,
    skipIfAlreadyDeployed: false,
    autoMine: true,
  });

  saveStringToFile(
    JSON.stringify({
      targecy: deployment.address,
    }),
    '../addresses.json'
  );
};
export default func;
func.tags = ['MockValidator', 'Targecy'];
