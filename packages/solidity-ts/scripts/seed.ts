/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-var-requires */

import { env, exit } from 'process';
// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-var-requires
require('dotenv').config();

import { ZeroAddress } from 'ethers';
import { ethers } from 'hardhat';

import { hostname } from 'os';

import localhostConfig from '../generated/config/localhost.json';
import maticConfig from '../generated/config/matic.json';
import mumbaiConfig from '../generated/config/mumbai.json';

import { initializeData } from './seed/data';
import { uploadMetadata } from './seed/utils';

import { Targecy, Targecy__factory } from '~generated/contract-types';

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

export async function seed(network: string, force = false): Promise<void> {
  console.log('Seeding contract... network:' + network + ' force: ' + force.toString());

  // Connect to the Ethereum network
  let provider, address;
  switch (network) {
    case 'localhost':
      provider = new ethers.JsonRpcProvider('http://localhost:8545', {
        chainId: 1337,
        name: 'localhost',
      });
      address = localhostConfig[hostname() as keyof typeof localhostConfig];
      break;
    case 'mumbai':
      provider = new ethers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com');
      address = mumbaiConfig.address;
      break;
    case 'matic':
      provider = new ethers.JsonRpcProvider('https://rpc-mainnet.maticvigil.com');
      address = maticConfig.address;
      break;
    default:
      console.log('Network not supported');
      exit(1);
  }

  // Test Provider
  const number = await provider.getBlockNumber();
  console.log(`Provider is up and running. Current block number: ${number}`);

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

  const Targecy = (await ethers.getContractFactory('Targecy', wallet)) as Targecy__factory;
  const targecy = Targecy.attach(address as string) as Targecy;

  // Print current amount of ads, audiences, and segments
  console.log(`Current amount of ads:  ${Number(await targecy._adId()) - 1}`);
  console.log(`Current amount of audiences:  ${Number(await targecy._audienceId()) - 1}`);
  console.log(`Current amount of segments:  ${Number(await targecy._segmentId()) - 1}`);

  if (!force) {
    if (Number(await targecy._adId()) - 1 > 0 || Number(await targecy._audienceId()) - 1 > 0 || Number(await targecy._segmentId()) - 1 > 0)
      console.log('> BE CAREFUL: Contract already has some data, adding new ones may break references between new entities as set in data.ts');
    const answer1 = await askQuestion('Do you want to continue? (yes/no) ');
    if (answer1.toLowerCase() === 'yes') {
      console.log('Continuing...');
    } else {
      console.log('Operation aborted.');
      exit(0);
    }
  }

  const { segments, audiences, ads } = await initializeData();
  if (!force) {
    console.log('Data to be uploaded:');
    console.log('segments:' + stringifySupportingBigInts(segments));
    console.log('audiences:' + stringifySupportingBigInts(audiences));
    console.log('Ads:' + stringifySupportingBigInts(ads));

    const answer = await askQuestion('Do you want to continue? (yes/no) ');
    if (answer.toLowerCase() === 'yes') {
      console.log('Continuing...');
    } else {
      console.log('Operation aborted.');
      exit(0);
    }
  }

  // Upload segments
  console.log('\nUploading segments...');
  for (const [index, segment] of segments.entries()) {
    const uri = await uploadMetadata(segment.metadata);
    segments[index].metadataURI = uri;

    // Call smart contract function to create a segment
    await targecy.setSegment(0, {
      metadataURI: segment.metadataURI ?? '',
      issuer: ethers.ZeroAddress, // use default
      query: {
        schema: segment.query.schema,
        slotIndex: segment.query.slotIndex,
        operator: segment.query.operator,
        value: segment.query.value,
        circuitId: segment.query.circuitId,
      },
    });

    console.log(`Segment '${segment.metadata.title}' created`);
  }

  // Upload audiences
  console.log('\nUploading audiences...');
  for (const [index, audience] of audiences.entries()) {
    const uri = await uploadMetadata(audience.metadata);
    audiences[index].metadataURI = uri;

    // Call smart contract function to create a target group
    await targecy.setAudience(0, (audience.metadataURI as string) ?? '', audience.segmentIds as number[]);

    console.log(`Target group '${audience.metadata.title}' created`);
  }

  // Upload Ads
  console.log('\nUploading ads...');
  for (const [index, ad] of ads.entries()) {
    const uri = await uploadMetadata(ad.metadata);
    ads[index].metadataURI = uri;

    // Call smart contract function to create an ad
    await targecy.setAd(0, {
      metadataURI: ad.metadataURI ?? '',
      attribution: ad.attribution,
      active: true,
      abi: '',
      target: ZeroAddress,
      startingTimestamp: ad.startingTimestamp,
      endingTimestamp: ad.endingTimestamp,
      audienceIds: ad.audiencesIds,
      blacklistedPublishers: ad.blacklistedPublishers,
      maxBudget: ad.budget,
      maxPricePerConsumption: ad.maxPricePerConsumption,
      maxConsumptionsPerDay: ad.maxConsumptionsPerDay,
    });

    console.log(`Ad '${ad.metadata.title}' created`);
  }
  console.log('\nContract populated with ads, audiences, and segments.');

  console.log('See data at playground: ');
  switch (network) {
    case 'localhost':
      console.log('http://http://localhost:8000/subgraphs/name/targecy/graphql');
      break;
    case 'mumbai':
      console.log('https://api.studio.thegraph.com/query/58687/targecy-mumbai/version/latest');
      break;
    case 'matic':
      throw new Error('Set up config for MATIC network');
      break;
    default:
      console.log('Network not supported');
      exit(1);
  }
}

const consoleParam: string | undefined = process.argv[2]; // Get the console parameter from command line arguments
const force = process.argv[3] === 'force'; // Get the force parameter from command line arguments

seed(consoleParam ?? 'localhost', force)
  .then(() => process.exit(0))
  .catch((error) => console.error(error));
