/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-var-requires */

import { env, exit } from 'process';
// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-var-requires
require('dotenv').config();

import { ethers } from 'hardhat';

import * as deployedAddresses from '../generated/config/config.json';

import { initializeData } from './seed/data';
import { uploadMetadata } from './seed/utils';

// @todo set multiple logging levels

const readline = require('readline');

// Create a function that returns a promise
async function askQuestion(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return await new Promise((resolve) => {
    rl.question(query, (answer: string) => {
      rl.close();
      resolve(answer);
    });
  });
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const stringifySupportingBigInts = (obj: any) =>
  JSON.stringify(
    obj,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    (key, value) => (typeof value === 'bigint' ? value.toString() : value), // return everything else unchanged
    2
  );

export async function seed(network: string): Promise<void> {
  console.log('Seeding contract...');

  const addresses: any = deployedAddresses;

  // Connect to the Ethereum network
  let provider, address;
  switch (network) {
    case 'localhost':
      provider = new ethers.JsonRpcProvider('http://localhost:8545', {
        chainId: 1337,
        name: 'localhost',
      });
      address = addresses.localhost_targecyProxy;
      break;
    case 'mumbai':
      provider = new ethers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com');
      address = addresses.mumbai_targecyProxy;
      break;
    case 'matic':
      provider = new ethers.JsonRpcProvider('https://rpc-mainnet.maticvigil.com');
      address = addresses.matic_targecyProxy;
      break;
    default:
      console.log('Network not supported');
      exit(1);
  }

  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!env.ADMIN_KEY) throw new Error('ADMIN_KEY env variable not set');
  const wallet = new ethers.Wallet(env.ADMIN_KEY).connect(provider);

  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!address || address === '') {
    console.log('Targecy contract address not found in config file.');
    exit(1);
  }
  console.log(`Targecy's address: ${address}`);
  console.log(`Wallet's address: ${wallet.address}`);

  const Targecy = await ethers.getContractFactory('Targecy', wallet);
  const targecy = Targecy.attach(address as string);

  // Print current amount of ads, target groups, and ZKP requests
  console.log(`Current amount of ads:  ${Number(await targecy._adId()) - 1}`);
  console.log(`Current amount of target groups:  ${Number(await targecy._targetGroupId()) - 1}`);
  console.log(`Current amount of ZKP requests:  ${Number(await targecy._zkRequestId()) - 1}`);

  const answer1 = await askQuestion('Do you want to continue? (yes/no) ');
  if (answer1.toLowerCase() === 'yes') {
    console.log('Continuing...');
  } else {
    console.log('Operation aborted.');
    exit(0);
  }

  console.log('Data to be uploaded:');
  const { zkpRequests, targetGroups, ads } = await initializeData();
  console.log('ZKP Requests:' + stringifySupportingBigInts(zkpRequests));
  console.log('Target Groups:' + stringifySupportingBigInts(targetGroups));
  console.log('Ads:' + stringifySupportingBigInts(ads));

  const answer = await askQuestion('Do you want to continue? (yes/no) ');
  if (answer.toLowerCase() === 'yes') {
    console.log('Continuing...');
  } else {
    console.log('Operation aborted.');
    exit(0);
  }

  // Upload ZKP requests
  console.log('\nUploading ZKP requests...');
  for (const [index, zkpRequest] of zkpRequests.entries()) {
    const uri = await uploadMetadata(zkpRequest.metadata);
    zkpRequests[index].metadataURI = uri;

    // Call smart contract function to create a ZKP request
    await targecy.setZKPRequest({
      metadataURI: zkpRequest.metadataURI ?? '',
      issuer: ethers.ZeroAddress, // use default
      query: {
        schema: zkpRequest.query.schema,
        slotIndex: zkpRequest.query.slotIndex,
        operator: zkpRequest.query.operator,
        value: zkpRequest.query.value,
        circuitId: zkpRequest.query.circuitId,
      },
    });

    console.log(`ZKP request '${zkpRequest.metadata.title}' created`);
  }

  // Upload target groups
  console.log('\nUploading target groups...');
  for (const [index, targetGroup] of targetGroups.entries()) {
    const uri = await uploadMetadata(targetGroup.metadata);
    targetGroups[index].metadataURI = uri;

    // Call smart contract function to create a target group
    await targecy.createTargetGroup(((targetGroup.metadataURI as string) ?? '', targetGroup.zkpRequestIds as number[]));

    console.log(`Target group '${targetGroup.metadata.title}' created`);
  }

  // Upload Ads
  console.log('\nUploading ads...');
  for (const [index, ad] of ads.entries()) {
    const uri = await uploadMetadata(ad.metadata);
    ads[index].metadataURI = uri;

    // Call smart contract function to create an ad
    await targecy.createAd(
      {
        budget: ad.budget,
        metadataURI: ad.metadataURI ?? '',
        maxImpressionPrice: ad.maxImpressionPrice,
        minBlock: ad.minBlock,
        maxBlock: ad.maxBlock,
        targetGroupIds: ad.targetGroupsIds,
      },
      { value: ad.budget }
    );

    console.log(`Ad '${ad.metadata.title}' created`);
  }
  console.log('\nContract populated with ads, target groups, and ZKP requests.');

  // Print current amount of ads, target groups, and ZKP requests
  console.log(`Current amount of ads:  ${Number(await targecy._adId()) - 1}`);
  console.log(`Current amount of target groups:  ${Number(await targecy._targetGroupId()) - 1}`);
  console.log(`Current amount of ZKP requests:  ${Number(await targecy._zkRequestId()) - 1}`);
}

const consoleParam: string | undefined = process.argv[2]; // Get the console parameter from command line arguments

seed(consoleParam ?? 'localhost')
  .then(() => process.exit(0))
  .catch((error) => console.error(error));
