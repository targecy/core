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

  console.log('Deploying MockValidator...');
  const mockValidatorDeployResult = await deploy('MockValidator', {
    from: deployer,
    log: true,
  });

  const validatorAddress = mockValidatorDeployResult.address;
  console.log("MockValidator's address: ", validatorAddress);

  console.log("Deploying Targecy's proxy...");
  const defaultImpressionPrice = 10000;
  const deployment = await deploy('Targecy', {
    args: [],
    proxy: {
      // viaAdminContract: 'ProxyAdmin',
      proxyContract: 'TransparentUpgradeableProxy',
      // methodName: 'initialize',
      execute: {
        init: {
          methodName: 'initialize',
          args: [validatorAddress, '0x8D78D554CBA781B0744BF24DD84f23d7767f11a3', defaultImpressionPrice, '0xC8E4fcfF013b61Bea893d54427F1a72691FFe7a2'],
        },
      },
    },
    from: deployer,
    log: true,
    skipIfAlreadyDeployed: false,
    // autoMine: true,
  });

  console.log("Targecy's address: ", deployment.address);

  saveStringToFile(
    JSON.stringify({
      targecyProxy: deployment.address,
      targecyImplementation: deployment.implementation,
    }),
    '../addresses.json'
  );
};
export default func;
func.tags = ['MockValidator', 'Targecy'];
