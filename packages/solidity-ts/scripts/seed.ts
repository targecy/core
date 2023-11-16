/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-var-requires */

import { ethers } from 'hardhat';

import { ads, zkpRequests, targetGroups } from './seed/data';
import { uploadMetadata } from './seed/utils';

import { Targecy, Targecy__factory } from '~generated/contract-types';
import { getMnemonic } from '~helpers/functions';

// @todo set multiple logging levels

export async function seed(): Promise<void> {
  console.log('Seeding contract...');

  const config = require('../generated/config/config.json');
  const mnemonic: string = getMnemonic();
  const TargecyAddress = config.localhost_Targecy_ProxyAddress;

  // Connect to the Ethereum network
  const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545', {
    chainId: 1337,
    name: 'localhost',
  });
  const wallet = ethers.Wallet.fromMnemonic(mnemonic, "m/44'/60'/0'/0/1"); // Sent from the second address.
  const walletConnected = wallet.connect(provider);
  const Targecy: Targecy__factory = await ethers.getContractFactory('Targecy', walletConnected);
  const targecy: Targecy = Targecy.attach(TargecyAddress);

  // Print current amount of ads, target groups, and ZKP requests
  console.log(`Current amount of ads:  ${Number(await targecy._adId()) - 1}`);
  console.log(`Current amount of target groups:  ${Number(await targecy._targetGroupId()) - 1}`);
  console.log(`Current amount of ZKP requests:  ${Number(await targecy._zkRequestId()) - 1}`);

  // Upload ZKP requests
  console.log('\nUploading ZKP requests...');
  for (const [index, zkpRequest] of zkpRequests.entries()) {
    const uri = await uploadMetadata(zkpRequest.metadata);
    zkpRequests[index].metadataURI = uri;

    // Call smart contract function to create a ZKP request
    await targecy.setZKPRequest({
      metadataURI: zkpRequest.metadataURI ?? '',
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
    await targecy.createTargetGroup(targetGroup.metadataURI ?? '', targetGroup.zkpRequestIds);

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

seed()
  .then(() => process.exit(0))
  .catch((error) => console.error(error));
