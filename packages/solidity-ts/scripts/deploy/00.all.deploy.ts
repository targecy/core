// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-var-requires
require('dotenv').config();

import { ethers } from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';

import { THardhatRuntimeEnvironmentExtended } from '~helpers/types/THardhatRuntimeEnvironmentExtended';
import { saveStringToFile } from '~scripts/utils';

const func: DeployFunction = async (hre: THardhatRuntimeEnvironmentExtended) => {
  const { deployments, getNamedAccounts, network, upgrades } = hre;
  const { deployer } = await getNamedAccounts();

  let config: {
    defaultIssuer: bigint;
    vault: `0x${string}`;
    admin: `0x${string}`;
    multisig?: `0x${string}`;
    validator?: `0x${string}`;
    defaultImpressionPrice: number;
  };

  switch (network.name) {
    case 'localhost':
      config = {
        defaultIssuer: 22382985665935745230331508376293136780434330883292739172972565885070348801n,
        admin: '0xc8e4fcff013b61bea893d54427f1a72691ffe7a2',
        vault: '0x8d78d554cba781b0744bf24dd84f23d7767f11a3',
        defaultImpressionPrice: 10000000,
      };
      break;
    case 'mumbai':
      config = {
        defaultIssuer: 0n,
        admin: '0xFF12A566B10A92E311b8A2a52302806756Ab0A4b',
        vault: '0x97C9f2450dfb4ae01f776ea3F772F51C3BEFa26a',
        multisig: '0x8fe74Ce445F70b9a46F254dcc02c0857974F96eb',
        validator: '0xF2D4Eeb4d455fb673104902282Ce68B9ce4Ac450',
        defaultImpressionPrice: 10000000,
      };
      break;
    case 'matic':
      throw new Error('Set up config for MATIC network');
    default:
      throw new Error(`Unsupported network: ${network.name}`);
  }

  console.log(`Starting Deployment for network: ${network.name} with deployer: ${deployer}`);

  if (network.name === 'localhost') {
    console.log('Deploying MockValidator...');
    const mockValidatorDeployResult = await deployments.deploy('MockValidator', {
      from: deployer,
      log: true,
    });
    config.validator = mockValidatorDeployResult.address as `0x${string}`;
  }

  console.log("Deploying Targecy's proxy...");
  const factory = await ethers.getContractFactory('Targecy');
  const deploymentResult = await upgrades.deployProxy(
    factory,
    [config.validator, config.vault, config.defaultImpressionPrice, config.admin, config.defaultIssuer],
    {
      verifySourceCode: true,
    }
  );
  const address = await deploymentResult.getAddress();
  console.log("Targecy's address: ", address);

  if (network.name === 'localhost') {
    console.log('No need to transfer ownership of ProxyAdmin on localhost');
  } else if (network.name === 'mumbai' || network.name === 'matic') {
    console.log('Transferring ownership of ProxyAdmin...');
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!config.multisig) throw new Error('Multisig address not set');

    // The owner of the ProxyAdmin can upgrade our contracts
    await upgrades.admin.changeProxyAdmin(address, config.multisig);
    console.log('Transferred ownership of ProxyAdmin to:', config.multisig);
  }

  saveStringToFile(
    JSON.stringify({
      [`${network.name}_targecyProxy`]: await deploymentResult.getAddress(),
    }),
    '../generated/config/config.json',
    false
  );
};
export default func;
func.tags = ['MockValidator', 'Targecy'];
