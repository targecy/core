/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { ethers, upgrades } from 'hardhat';
import { getStringFromFile } from '../utils';

export const upgradeAll = async (): Promise<void> => {
  const addresses = JSON.parse(getStringFromFile('../addresses.json'));

  if (!addresses.targecy) throw new Error('Missing Targecy address');

  const Targecy = await ethers.getContractFactory('Targecy');
  const targecy = await upgrades.upgradeProxy(addresses.targecyProxy as string, Targecy);
  console.log('Targecy upgraded at address ' + targecy.address);
};

export default upgradeAll;
// upgradeAll.tags = ['Targecy'];
