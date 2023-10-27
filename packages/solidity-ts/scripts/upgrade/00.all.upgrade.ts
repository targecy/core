/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import * as fs from 'fs';
import * as path from 'path';

import { ethers, upgrades } from 'hardhat';

export const getStringFromFile = (fileName: string): string => {
  const filePath = path.join(__dirname, fileName);
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf8');
    return data;
  } else {
    console.log(`File ${filePath} does not exist.`);
    return '';
  }
};

export const upgradeAll = async (): Promise<void> => {
  const addresses = JSON.parse(getStringFromFile('../addresses.json'));

  if (!addresses.targecy) throw new Error('Missing Targecy address');

  const Targecy = await ethers.getContractFactory('Targecy');
  const targecy = await upgrades.upgradeProxy(addresses.targecyProxy as string, Targecy);
  console.log('Targecy upgraded at address ' + targecy.address);
};

export default upgradeAll;
// upgradeAll.tags = ['Targecy'];
