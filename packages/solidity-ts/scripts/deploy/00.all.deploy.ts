require('dotenv').config();

import { hexToBytes } from '@0xpolygonid/js-sdk';
import { ContractFactory } from 'ethers';
import { ethers } from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';

import { THardhatRuntimeEnvironmentExtended } from '~helpers/types/THardhatRuntimeEnvironmentExtended';
import { getStringFromFile, saveStringToFile } from '~scripts/utils';

const VAULT = '0x97C9f2450dfb4ae01f776ea3F772F51C3BEFa26a';
const ADMIN = '0xFF12A566B10A92E311b8A2a52302806756Ab0A4b';
const MUMBAI_MULTISIG = '0x8fe74Ce445F70b9a46F254dcc02c0857974F96eb';
const MUMBAI_VALIDATOR = '0xF2D4Eeb4d455fb673104902282Ce68B9ce4Ac450';
const MATIC_VALIDATOR = '0x9ee6a2682Caa2E0AC99dA46afb88Ad7e6A58Cd1b';
const DEFAULT_IMPRESSION_PRICE = 10000000;

const func: DeployFunction = async (hre: THardhatRuntimeEnvironmentExtended) => {
  const { deployments, getNamedAccounts, network, upgrades } = hre;
  const { deployer } = await getNamedAccounts();

  console.log('Starting Deployment for network: ' + network.name + ' with deployer: ' + deployer);

  let validatorAddress;
  if (network.name === 'localhost') {
    console.log('Deploying MockValidator...');
    const mockValidatorDeployResult = await deployments.deploy('MockValidator', {
      from: deployer,
      log: true,
    });
    validatorAddress = mockValidatorDeployResult.address;
  } else if (network.name === 'mumbai') {
    validatorAddress = MUMBAI_VALIDATOR;
  } else if (network.name === 'matic') {
    validatorAddress = MATIC_VALIDATOR;
  } else throw new Error(`Unsupported network: ${network.name}`);
  console.log('Using validator at address: ' + validatorAddress + ' for chain ' + network.name);

  console.log("Deploying Targecy's proxy...");
  const factory = await ethers.getContractFactory('Targecy');
  const deploymentResult = await upgrades.deployProxy(factory, [validatorAddress, VAULT, DEFAULT_IMPRESSION_PRICE, ADMIN], { 
    verifySourceCode: true,
  });
  const address = await deploymentResult.getAddress();
  console.log("Targecy's address: ", address);

  if (network.name === 'mumbai') {
    console.log('Transferring ownership of ProxyAdmin...');
    // The owner of the ProxyAdmin can upgrade our contracts
    await upgrades.admin.changeProxyAdmin(address, MUMBAI_MULTISIG);
    console.log('Transferred ownership of ProxyAdmin to:', MUMBAI_MULTISIG);
  } else if (network.name === 'matic') {
    throw new Error('Multisig for MATIC not implemented yet');
  } else throw new Error(`Unsupported network: ${network.name}`);

  saveStringToFile(
    JSON.stringify({
      targecyProxy: await deploymentResult.getAddress(),
    }),
    '../generated/addresses.json'
  );
};
export default func;
func.tags = ['MockValidator', 'Targecy'];
