/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import * as fs from 'fs';
import * as path from 'path';

import { task } from 'hardhat/config';

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

task('upgrade', 'Upgrade Contracts').setAction(async (_, hre) => {
  const addresses = JSON.parse(getStringFromFile('../addresses.json'));

  if (!addresses.targecy) throw new Error('Missing Targecy address');

  const Targecy = await hre.ethers.getContractFactory('Targecy');
  const targecy = await hre.upgrades.upgradeProxy(addresses.targecy as string, Targecy);
  console.log('Targecy upgraded at address ' + targecy.address);
});
