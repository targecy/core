// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-var-requires
require('dotenv').config();

import { hostname } from 'os';

import { ethers } from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { isolatedEnv } from 'hardhat.config';

import { ERC20PresetFixedSupply, ERC20PresetFixedSupply__factory } from '~generated/contract-types';
import { THardhatRuntimeEnvironmentExtended } from '~helpers/types/THardhatRuntimeEnvironmentExtended';
import { getStringFromFile, saveStringToFile } from '~scripts/utils';

const func: DeployFunction = async (hre: THardhatRuntimeEnvironmentExtended) => {
  console.log("Starting deployment of Targecy's contracts...");
  const { deployments, getNamedAccounts, network, upgrades } = hre;
  const { deployer, user1: admin, user2: vault, user3: user, user4: publisher, user5: advertiser } = await getNamedAccounts();

  if (Boolean(isolatedEnv)) console.warn('\n\n>>> RUNNING IN ISOLATED MODE. ARE YOU SURE?  <<< \n\n');

  let config: {
    defaultIssuer: bigint;
    vault: `0x${string}`;
    admin: `0x${string}`;
    relayer: `0x${string}`;
    multisig?: `0x${string}`;
    validator?: `0x${string}`;
    erc20?: `0x${string}`;
  };

  switch (network.name) {
    case 'localhost':
      config = {
        defaultIssuer: 22382985665935745230331508376293136780434330883292739172972565885070348801n, // This value is generated from issuer's DID and printed on backend startup
        admin: '0xc8e4fcff013b61bea893d54427f1a72691ffe7a2',
        vault: '0x8d78d554cba781b0744bf24dd84f23d7767f11a3',
        relayer: '0x8d78d554cba781b0744bf24dd84f23d7767f11a3', // @todo SET CORRECT AND DEPLOY
      };
      break;
    case 'mumbai':
      config = {
        defaultIssuer: 27524721169281435317324794740804524348876903871467534457093785347343127041n, // @todo (Martin): force set in mumbai contracts
        admin: '0xFF12A566B10A92E311b8A2a52302806756Ab0A4b',
        vault: '0x97C9f2450dfb4ae01f776ea3F772F51C3BEFa26a',
        multisig: '0x8fe74Ce445F70b9a46F254dcc02c0857974F96eb',
        validator: '0xF2D4Eeb4d455fb673104902282Ce68B9ce4Ac450',
        relayer: '0x8fe74Ce445F70b9a46F254dcc02c0857974F96eb', // @todo SET CORRECT AND DEPLOY
        erc20: '0x', // @todo SET REAL USDC
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

    console.log('Deploying MockERC20...');
    const amountToGive = 1000000000n;
    const mockERC20DeployResult = await deployments.deploy('ERC20PresetFixedSupply', {
      from: deployer,
      log: true,
      args: ['USDC', 'USDC', amountToGive * 100n, deployer],
    });
    config.erc20 = mockERC20DeployResult.address as `0x${string}`;
    const erc20Factory = (await ethers.getContractFactory('ERC20PresetFixedSupply')) as ERC20PresetFixedSupply__factory;
    const erc20 = erc20Factory.attach(config.erc20) as ERC20PresetFixedSupply;

    // Distribute MockERC20 on local chain
    console.log('Distributing mock erc20 assets');
    const accounts = [admin, vault, user, publisher, advertiser];
    for (const account of accounts) {
      console.log(`Giving ${account} ${amountToGive} USDC`);
      await erc20.transfer(account, amountToGive);
    }

    console.log(`${accounts} have ${await erc20.balanceOf(accounts[0])}`);

    // @todo CHECK THIS WORKS AS EXPECTED
  }

  console.log("Deploying Targecy's proxy...");
  const factory = await ethers.getContractFactory('Targecy');
  const deploymentResult = await upgrades.deployProxy(
    factory,
    [config.validator, config.vault, config.admin, config.defaultIssuer, config.relayer, config.erc20],
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

  let current;
  try {
    console.log('Parsing config file...', getStringFromFile(`../generated/config/${network.name}.json`));
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    current = JSON.parse(getStringFromFile(`../generated/config/${network.name}.json`));
    console.debug('Current config file: ', current);
  } catch (e) {
    console.log('Error parsing config file: ', e);
    current = {};
    console.log('No config file found, creating new one.');
  }

  if (network.name === 'localhost') {
    current = { ...current, ...{ [hostname()]: address } };
  } else {
    current = { ...current, ...{ [`address`]: address } };
  }

  console.log('Saving config file...', current);

  saveStringToFile(JSON.stringify(current), `../generated/config/${network.name}.json`, true);
};
export default func;
func.tags = ['MockValidator', 'Targecy'];
