import fs from 'fs';

import { contractsDir, graphDir, hardhatPublishToOtherPackage, relayerDir, sdkDir, webappDir } from '~helpers/functions/hardhat/publishToSubgraph';

// run script
hardhatPublishToOtherPackage(contractsDir);
hardhatPublishToOtherPackage(graphDir);
hardhatPublishToOtherPackage(webappDir);
hardhatPublishToOtherPackage(sdkDir);
hardhatPublishToOtherPackage(relayerDir);

// Copy contract-types folder to relayer
console.log('Copying contract-types folder to relayer...');
const contractTypesDir = './generated/contract-types';
const relayerContractTypesDir = '../relayer/src/generated/contract-types';
const webappContractTypesDir = '../webapp/src/generated/contract-types';
if (!Boolean(fs.existsSync(relayerContractTypesDir))) fs.mkdirSync(relayerContractTypesDir);
if (!Boolean(fs.existsSync(webappContractTypesDir))) fs.mkdirSync(webappContractTypesDir);
// Copy contract-types folder to relayer
fs.cp(contractTypesDir, relayerContractTypesDir, { recursive: true }, (err) => console.error(err));
fs.cp(contractTypesDir, webappContractTypesDir, { recursive: true }, (err) => console.error(err));
console.log('Copied contract-types folder to relayer and webapp');
console.log('Done!');
