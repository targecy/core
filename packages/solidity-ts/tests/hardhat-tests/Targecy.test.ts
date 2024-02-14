/* eslint-disable mocha/no-setup-in-describe */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import '~helpers/hardhat-imports';
import '~tests/utils/chai-imports';

import { expect } from 'chai';
import { AddressLike, BigNumberish, JsonRpcProvider, JsonRpcSigner, ZeroAddress } from 'ethers';
import {
  Targecy,
  MockValidator,
  ERC20PresetFixedSupply as ERC20,
  ERC20PresetFixedSupply__factory,
  TargecyEvents__factory,
  MockValidator__factory,
  MockExternalVaultContract,
  MockExternalVaultContract__factory,
  Targecy__factory,
} from 'generated/contract-types';
import { ethers } from 'hardhat';
import { isolatedEnv } from 'hardhat.config';

import * as evm from '../utils/evm';

import { ZKServices, decodeEvents, defaultIssuer, getTestAudience, getTestProof, initZKServices } from './helpers';

import { getStringFromFile, saveStringToFile } from '~scripts/utils';

interface AddressesFile {
  targecy?: string;
  validator?: string;
  erc20?: string;
  externalContract?: string;
}

describe('Tests', function () {
  this.timeout(0);

  // Params
  const runUsingLocalChain = process.env.TEST_USING_LOCAL_CHAIN === 'true';
  const addressesFilePath = '../tests/hardhat-tests/addresses.json';

  // Contracts
  let targecy: Targecy;
  let targecyAddress: AddressLike;
  let validator: MockValidator;
  let erc20: ERC20;
  let externalContract: MockExternalVaultContract;
  let externalContractAddress: AddressLike;
  let abiByAddress: Record<string, any>;

  // Users
  let deployerWithProvider: JsonRpcSigner;
  let adminWithProvider: JsonRpcSigner;
  let vaultWithProvider: JsonRpcSigner;
  let userWithProvider: JsonRpcSigner;
  let publisherWithProvider: JsonRpcSigner;
  let advertiserWithProvider: JsonRpcSigner;
  let relayerWithProvider: JsonRpcSigner;

  // Default values
  const defaultSegment = {
    metadataURI: 'metadata',
    issuer: defaultIssuer,
    query: {
      schema: 1,
      slotIndex: 1,
      operator: 1,
      value: [],
      circuitId: '',
    },
  };

  // EVM & ZK
  let snapshotId: string;
  let provider: JsonRpcProvider;
  let zkServices: ZKServices;

  before(async () => {
    await evm.reset();

    let deployedAddresses: AddressesFile = {};
    let addressesModified = false;

    if (!runUsingLocalChain) {
      provider = ethers.provider;
    } else {
      provider = new ethers.JsonRpcProvider(
        'http://localhost:8545',
        {
          chainId: 1337,
          name: 'localhost',
        },
        {
          polling: true,
        }
      );

      try {
        console.log('Loading addresses.json...');
        deployedAddresses = JSON.parse(getStringFromFile(addressesFilePath));
        console.log('Loaded addresses.json');
      } catch (e) {
        console.log('Could not load addresses.json, deploying contracts...');
        addressesModified = true;
      }
    }

    deployerWithProvider = await provider.getSigner(0);
    adminWithProvider = await provider.getSigner(1);
    vaultWithProvider = await provider.getSigner(2);
    userWithProvider = await provider.getSigner(3);
    publisherWithProvider = await provider.getSigner(4);
    advertiserWithProvider = await provider.getSigner(5);
    relayerWithProvider = await provider.getSigner(6);

    console.log(
      `Signers \n | Deployer: ${deployerWithProvider.address} \n | Admin: ${adminWithProvider.address} \n | Vault: ${vaultWithProvider.address} \n | User: ${userWithProvider.address} \n | Publisher: ${publisherWithProvider.address} \n | Advertiser: ${advertiserWithProvider.address} \n`
    );

    console.log('Deploying MockExternalVaultContract...');
    const externalContractFactory = (await ethers.getContractFactory('MockExternalVaultContract')).connect(deployerWithProvider);
    externalContract =
      deployedAddresses.externalContract !== undefined
        ? (externalContractFactory.attach(deployedAddresses.externalContract) as MockExternalVaultContract)
        : ((await externalContractFactory.deploy()).connect(adminWithProvider) as MockExternalVaultContract);
    externalContractAddress = await externalContract.getAddress();
    console.log(" | MockExternalVaultContract's address: ", externalContractAddress);
    console.log(" | MockExternalVaultContract's initial value: ", await externalContract.connect(adminWithProvider).value());

    console.log('\nDeploying MockValidator...');
    const validatorFactory = (await ethers.getContractFactory('MockValidator')).connect(deployerWithProvider);
    validator =
      deployedAddresses.validator !== undefined
        ? (validatorFactory.attach(deployedAddresses.validator) as MockValidator)
        : ((await validatorFactory.deploy()).connect(adminWithProvider) as MockValidator);
    const validatorAddress = await validator.getAddress();
    console.log(" | MockValidator's address: ", validatorAddress);
    console.log(" | MockValidator's mock example: ", await validator.connect(adminWithProvider).getCircuitId());

    console.log('\nDeploying MockERC20...');
    const erc20Factory = ((await ethers.getContractFactory('ERC20PresetFixedSupply')) as ERC20PresetFixedSupply__factory).connect(deployerWithProvider);
    const defaultAmountToDistribute = 100000000000n;
    const erc20Params: [name: string, symbol: string, initialSupply: BigNumberish, owner: AddressLike] = [
      'USDc',
      'USDC',
      defaultAmountToDistribute * 100n,
      adminWithProvider.address,
    ];
    erc20 =
      deployedAddresses.erc20 !== undefined
        ? (erc20Factory.attach(deployedAddresses.erc20).connect(adminWithProvider) as ERC20)
        : ((await erc20Factory.deploy(...erc20Params)).connect(adminWithProvider) as ERC20);
    const erc20Address = await erc20.getAddress();

    // Fund users
    await erc20.transfer(advertiserWithProvider.address, defaultAmountToDistribute);
    await erc20.transfer(userWithProvider.address, defaultAmountToDistribute);
    await erc20.transfer(publisherWithProvider.address, defaultAmountToDistribute);

    console.log(" | MockERC20's address: ", erc20Address);
    console.log(" | MockERC20's total supply: ", await erc20.connect(adminWithProvider).totalSupply());
    console.log(" | MockERC20's balance of admin: ", await erc20.balanceOf(adminWithProvider.address));
    console.log(" | MockERC20's balance of user: ", await erc20.balanceOf(userWithProvider.address));
    console.log(" | MockERC20's balance of publisher: ", await erc20.balanceOf(publisherWithProvider.address));
    console.log(" | MockERC20's balance of advertiser: ", await erc20.balanceOf(advertiserWithProvider.address));

    console.log('\nDeploying Targecy...');
    const targecyArgs: [
      _validator: AddressLike,
      _vault: AddressLike,
      targecyAdmin: AddressLike,
      _defaultIssuer: BigNumberish,
      _relayer: AddressLike,
      _erc20Address: AddressLike
    ] = [
      await validator.getAddress(),
      vaultWithProvider.address,
      adminWithProvider.address,
      defaultIssuer.toString(),
      relayerWithProvider.address,
      erc20Address,
    ];
    const factory = (await ethers.getContractFactory('Targecy')).connect(deployerWithProvider);
    let targecyDeployed;
    if (deployedAddresses.targecy !== undefined) {
      targecyDeployed = factory.attach(deployedAddresses.targecy) as Targecy;
    } else {
      targecyDeployed = (await factory.deploy()).connect(adminWithProvider) as Targecy;
      await targecyDeployed.initialize(...targecyArgs);
    }
    targecy = targecyDeployed.connect(adminWithProvider);

    targecyAddress = await targecy.getAddress();
    console.log(" | Targecy's address: ", targecyAddress);
    console.log(" | Connected's address: ", (targecy.runner as JsonRpcSigner).address);
    console.log(" | Connected's address native assets balance", await provider.getBalance((targecy.runner as JsonRpcSigner).address));
    console.log(" | Connected's address erc20 assets balance", await erc20.balanceOf((targecy.runner as JsonRpcSigner).address));
    console.log(' | Initialized values > Validator', await targecy.validator());
    console.log(' | Initialized values > MockERC20', await targecy.erc20());
    console.log(' | Initialized values > Vault', await targecy.vault());
    console.log(' | Initialized values > Relayer Address', await targecy.relayer());
    console.log(' | Initialized values > Ad Id', await targecy._adId());

    abiByAddress = {
      [targecyAddress]: [...TargecyEvents__factory.abi, ...Targecy__factory.abi],
      [validatorAddress]: MockValidator__factory.abi,
      [erc20Address]: ERC20PresetFixedSupply__factory.abi,
      [externalContractAddress]: MockExternalVaultContract__factory.abi,
    };

    if (addressesModified) {
      const toSave: AddressesFile = { targecy: targecyAddress, validator: validatorAddress, erc20: erc20Address, externalContract: externalContractAddress };
      saveStringToFile(JSON.stringify(toSave), addressesFilePath, true);
    }

    if (!Boolean(isolatedEnv)) {
      console.log('\nInitializing Zero-Knowledge Proofs Helpers...');
      // In case the tests are being run without internet signal
      zkServices = await initZKServices();
      console.log(' | Identity DID', zkServices.userIdentity.did.id);
      console.log('Done!');
    }

    console.log('\nReady! Running tests! \n\n');

    snapshotId = await evm.snapshot.take();
  });

  describe('Segments', () => {
    beforeEach(async () => {
      await evm.snapshot.revert(snapshotId);
    });

    it('Should be able to create a segment', async () => {
      expect(await targecy._segmentId()).to.equal(1n);

      const tx = await targecy.setSegment(0, defaultSegment);
      const receipt = await tx.wait();

      expect(await targecy._segmentId()).to.equal(2n);
      expect(decodeEvents(receipt, abiByAddress)?.filter((e) => e.name === 'SegmentEdited').length).to.equal(1);

      const saved = await targecy.segments(1);
      expect(saved.metadataURI).to.equal('metadata');
      expect(saved.query.schema).to.equal(defaultSegment.query.schema);
      expect(saved.query.circuitId).to.equal(defaultSegment.query.circuitId);
      expect(saved.query.slotIndex).to.equal(defaultSegment.query.slotIndex);
      expect(saved.query.operator).to.equal(defaultSegment.query.operator);
      expect(saved.query.value).to.deep.equal(defaultSegment.query.value);
    });

    it('Should be able to edit a segment', async () => {
      expect(await targecy._segmentId()).to.equal(1n);

      await targecy.setSegment(0, defaultSegment);
      const saved = await targecy.segments(1);
      expect(saved.metadataURI).to.equal('metadata');

      const editedSegment = defaultSegment;
      editedSegment.metadataURI = 'metadata2';
      const editTx = await targecy.setSegment(1, editedSegment);
      const editReceipt = await editTx.wait();
      expect(decodeEvents(editReceipt, abiByAddress)?.filter((e) => e.name === 'SegmentEdited').length).to.equal(1);
      const savedEdited = await targecy.segments(1);
      expect(savedEdited.metadataURI).to.equal('metadata2');
    });

    it('Should be able to delete a segment', async () => {
      expect(await targecy._segmentId()).to.equal(1n);

      const tx = await targecy.setSegment(0, defaultSegment);
      const receipt = await tx.wait();

      expect(await targecy._segmentId()).to.equal(2n);
      const segmentId = (await targecy._segmentId()) - 1n;
      expect(decodeEvents(receipt, abiByAddress)?.filter((e) => e.name === 'SegmentEdited').length).to.equal(1);

      const saved = await targecy.segments(1);
      expect(saved.metadataURI).to.equal(defaultSegment.metadataURI);
      expect(saved.query.schema).to.equal(defaultSegment.query.schema);

      await expect(targecy.connect(userWithProvider).deleteAd(segmentId)).to.be.reverted; // Only admin can delete it
      await targecy.deleteSegment(segmentId);
      const deleted = await targecy.segments(1);
      expect(deleted.query.schema).to.be.eq(0n);
    });
  });

  describe('Audiences', () => {
    beforeEach(async () => {
      await evm.snapshot.revert(snapshotId);
    });

    it('Should be able to create an audience', async () => {
      expect(await targecy._audienceId()).to.equal(1n);

      const tx = await targecy.setSegment(0, defaultSegment);
      const receipt = await tx.wait();
      expect(decodeEvents(receipt, abiByAddress)?.filter((e) => e.name === 'SegmentEdited').length).to.equal(1);
      const segmentId = (await targecy._audienceId()) - 1n;

      const tx2 = await targecy.setAudience(0, 'metadata', [segmentId]);
      const receipt2 = await tx2.wait();
      expect(decodeEvents(receipt2, abiByAddress)?.filter((e) => e.name === 'AudienceEdited').length).to.equal(1);
      const audienceId = (await targecy._audienceId()) - 1n;

      const saved = await targecy.audiences(audienceId);
      expect(saved.metadataURI).to.equal('metadata');
      expect(saved.consumptions).to.equal(0);
      expect(await targecy.getAudienceSegments(audienceId)).to.deep.equal([segmentId]);
      expect(audienceId).to.equal(1n);
      expect(await targecy._audienceId()).to.equal(2n);
    });

    it('Should be able to edit an audience', async () => {
      expect(await targecy._audienceId()).to.equal(1n);

      const tx = await targecy.setSegment(0, defaultSegment);
      const receipt = await tx.wait();
      expect(decodeEvents(receipt, abiByAddress)?.filter((e) => e.name === 'SegmentEdited').length).to.equal(1);
      const segmentId = (await targecy._segmentId()) - 1n;

      const segment2tx = await targecy.setSegment(0, defaultSegment);
      const segment2receipt = await segment2tx.wait();
      expect(decodeEvents(segment2receipt, abiByAddress)?.filter((e) => e.name === 'SegmentEdited').length).to.equal(1);
      const segment2Id = (await targecy._segmentId()) - 1n;

      const tx2 = await targecy.setAudience(0, 'metadata', [segmentId]);
      const receipt2 = await tx2.wait();
      expect(decodeEvents(receipt2, abiByAddress)?.filter((e) => e.name === 'AudienceEdited').length).to.equal(1);
      const audienceId = (await targecy._audienceId()) - 1n;

      const saved = await targecy.audiences(audienceId);
      expect(saved.metadataURI).to.equal('metadata');
      expect(saved.consumptions).to.equal(0);
      expect(await targecy.getAudienceSegments(audienceId)).to.deep.equal([segmentId]);
      expect(audienceId).to.equal(1n);
      expect(await targecy._audienceId()).to.equal(2n);

      const editionTx = await targecy.setAudience(audienceId, 'metadata2', [segment2Id]);
      const editionReceipt = await editionTx.wait();
      expect(decodeEvents(editionReceipt, abiByAddress)?.filter((e) => e.name === 'AudienceEdited').length).to.equal(1);
      const savedEdited = await targecy.audiences(audienceId);
      expect(savedEdited.metadataURI).to.equal('metadata2');
      expect(savedEdited.consumptions).to.equal(0);
      expect(await targecy.getAudienceSegments(audienceId)).to.deep.equal([segment2Id]);
    });

    it('Should be able to delete a audience', async () => {
      expect(await targecy._audienceId()).to.equal(1n);

      const tx = await targecy.setSegment(0, defaultSegment);
      const receipt = await tx.wait();
      expect(decodeEvents(receipt, abiByAddress)?.filter((e) => e.name === 'SegmentEdited').length).to.equal(1);
      const segmentId = (await targecy._audienceId()) - 1n;

      const tx2 = await targecy.setAudience(0, 'metadata', [segmentId]);
      const receipt2 = await tx2.wait();
      expect(decodeEvents(receipt2, abiByAddress)?.filter((e) => e.name === 'AudienceEdited').length).to.equal(1);
      const audienceId = (await targecy._audienceId()) - 1n;

      const saved = await targecy.audiences(audienceId);
      expect(saved.metadataURI).to.equal('metadata');
      expect(saved.consumptions).to.equal(0);
      expect(await targecy.getAudienceSegments(audienceId)).to.deep.equal([segmentId]);
      expect(audienceId).to.equal(1n);
      expect(await targecy._audienceId()).to.equal(2n);

      await expect(targecy.connect(userWithProvider).deleteAudience(audienceId)).to.be.reverted; // Only admin can delete it
      await targecy.deleteAudience(audienceId);
      const deleted = await targecy.audiences(audienceId);
      expect(deleted.metadataURI).to.equal('');
    });
  });

  describe('Ads', () => {
    beforeEach(async () => {
      await evm.snapshot.revert(snapshotId);
    });

    before(async () => {
      // Create Segment and Audience

      const zkTx = await targecy.setSegment(0, defaultSegment);
      const zkReceipt = await zkTx.wait();
      expect(decodeEvents(zkReceipt, abiByAddress)?.filter((e) => e.name === 'SegmentEdited').length).to.equal(1);

      const segmentId = (await targecy._audienceId()) - 1n;

      const aTx = await targecy.setAudience(0, 'metadata', [segmentId]);
      const aReceipt = await aTx.wait();

      expect(decodeEvents(aReceipt, abiByAddress)?.filter((e) => e.name === 'AudienceEdited').length).to.equal(1);
    });

    it('Should be able to create an ad', async () => {
      await targecy.setSegment(0, defaultSegment);
      const segmentId = (await targecy._audienceId()) - 1n;
      await targecy.setAudience(0, 'metadata', [segmentId]);
      const audienceId = (await targecy._audienceId()) - 1n;

      expect(await targecy._adId()).to.equal(1n);

      const tx = await targecy.connect(advertiserWithProvider).setAd(0, {
        metadataURI: 'metadata',
        attribution: 0,
        active: true,
        abi: '',
        target: ZeroAddress,

        startingTimestamp: 1,
        endingTimestamp: 100,
        audienceIds: [audienceId],
        blacklistedPublishers: [],

        maxBudget: 10000000,
        maxPricePerConsumption: 20000,
        maxConsumptionsPerDay: 100,
      });

      const receipt = await tx.wait();

      expect(await targecy._adId()).to.equal(2n);
      expect(decodeEvents(receipt, abiByAddress)?.filter((e) => e.name === 'AdEdited').length).to.equal(1);

      const saved = await targecy.ads(1);
      expect(saved.metadataURI).to.equal('metadata');
      expect(saved.advertiser).to.equal(await advertiserWithProvider.getAddress());

      expect(saved.maxPricePerConsumption).to.equal(20000);
      expect(saved.startingTimestamp).to.equal(1);
      expect(saved.endingTimestamp).to.equal(100);
      expect(await targecy.getAdAudiences(1)).to.deep.equal([audienceId]);
    });

    it('Should be able to edit an ad', async () => {
      (await targecy.setSegment(0, defaultSegment)).wait();
      const segmentId = (await targecy._audienceId()) - 1n;
      (await targecy.setAudience(0, 'metadata', [segmentId])).wait();
      (await targecy.setAudience(0, 'metadata', [segmentId])).wait();
      const audienceId = (await targecy._audienceId()) - 2n;
      const audienceId2 = (await targecy._audienceId()) - 1n;

      expect(await targecy._adId()).to.equal(1n);

      const ad1 = {
        metadataURI: 'metadata',
        attribution: 0,
        active: true,
        abi: '',
        target: ZeroAddress,

        startingTimestamp: 1,
        endingTimestamp: 100,
        audienceIds: [audienceId],
        blacklistedPublishers: [ZeroAddress],

        maxBudget: 10000000,
        maxPricePerConsumption: 20000,
        maxConsumptionsPerDay: 100,
      };

      const ad2 = ad1;
      ad2.metadataURI = 'metadata2';
      ad2.active = false;
      ad2.abi = 'abi';
      ad2.target = ZeroAddress;
      ad2.startingTimestamp = 2;
      ad2.endingTimestamp = 200;
      ad2.audienceIds = [audienceId2];
      ad2.maxBudget = 20000000;
      ad2.maxPricePerConsumption = 30000;
      ad2.maxConsumptionsPerDay = 200;
      ad2.blacklistedPublishers = [publisherWithProvider.address];

      const tx = await targecy.connect(advertiserWithProvider).setAd(0, ad1);
      const receipt = await tx.wait();
      expect(await targecy._adId()).to.equal(2n);
      const adId = (await targecy._adId()) - 1n;
      expect(decodeEvents(receipt, abiByAddress)?.filter((e) => e.name === 'AdEdited').length).to.equal(1);

      const saved = await targecy.ads(1);
      expect(saved.metadataURI).to.equal(ad1.metadataURI);
      expect(saved.attribution).to.equal(ad1.attribution);
      expect(saved.active).to.equal(ad1.active);
      expect(saved.abi).to.equal(ad1.abi);
      expect(saved.target).to.equal(ad1.target);
      expect(saved.maxBudget).to.equal(ad1.maxBudget);
      expect(saved.advertiser).to.equal(await advertiserWithProvider.getAddress());
      expect(saved.maxPricePerConsumption).to.equal(ad1.maxPricePerConsumption);
      expect(saved.startingTimestamp).to.equal(ad1.startingTimestamp);
      expect(saved.endingTimestamp).to.equal(ad1.endingTimestamp);
      expect(await targecy.getAdAudiences(adId)).to.deep.equal(ad1.audienceIds);

      // Edit
      const tx2 = await targecy.connect(advertiserWithProvider).setAd(adId, ad2);
      const receipt2 = await tx2.wait();
      expect(await targecy._adId()).to.equal(2n);
      expect(decodeEvents(receipt2, abiByAddress)?.filter((e) => e.name === 'AdEdited').length).to.equal(1);

      const savedEdited = await targecy.ads(adId);
      expect(savedEdited.metadataURI).to.equal(ad2.metadataURI);
      expect(savedEdited.attribution).to.equal(ad2.attribution);
      expect(savedEdited.active).to.equal(ad2.active);
      expect(savedEdited.abi).to.equal(ad2.abi);
      expect(savedEdited.target).to.equal(ad2.target);
      expect(savedEdited.maxBudget).to.equal(ad2.maxBudget);
      expect(savedEdited.advertiser).to.equal(await advertiserWithProvider.getAddress());
      expect(savedEdited.maxPricePerConsumption).to.equal(ad2.maxPricePerConsumption);
      expect(savedEdited.startingTimestamp).to.equal(ad2.startingTimestamp);
      expect(savedEdited.endingTimestamp).to.equal(ad2.endingTimestamp);
      expect(await targecy.getAdAudiences(adId)).to.deep.equal(ad2.audienceIds);
      // Todo check blacklisted weekdays and publishers -> contract too long if I add helpers for those.
    });

    it('Should be able to delete an ad', async () => {
      (
        await targecy.connect(advertiserWithProvider).setAd(0, {
          metadataURI: 'metadata',
          attribution: 0,
          active: true,
          abi: '',
          target: ZeroAddress,

          startingTimestamp: 1,
          endingTimestamp: 100,
          audienceIds: [],
          blacklistedPublishers: [ZeroAddress],

          maxBudget: 10000000,
          maxPricePerConsumption: 20000,
          maxConsumptionsPerDay: 100,
        })
      ).wait();
      const adId = (await targecy._adId()) - 1n;

      const saved = await targecy.ads(adId);
      expect(saved.metadataURI).to.equal('metadata');

      await expect(targecy.deleteAd(adId)).to.be.reverted; // Only advertiser can delete it!
      const deleteTx = await targecy.connect(advertiserWithProvider).deleteAd(adId);
      const receipt = await deleteTx.wait();
      expect(decodeEvents(receipt, abiByAddress)?.filter((e) => e.name === 'AdDeleted').length).to.equal(1);

      const deleted = await targecy.ads(adId);
      expect(deleted.metadataURI).to.equal('');
    });
  });

  describe('Advertisers', () => {
    beforeEach(async () => {
      await evm.snapshot.revert(snapshotId);
    });

    it('Advertisers should be able to fund their budgets', async () => {
      const initialAdvertiserERC20Balance = await erc20.balanceOf(advertiserWithProvider.address);
      const initialAdvertiserBudgetBalance = (await targecy.budgets(advertiserWithProvider.address)).totalBudget;

      expect(initialAdvertiserERC20Balance).to.be.gt(0n);
      expect(initialAdvertiserBudgetBalance).to.be.eq(0n);

      const amount = 1000000n;
      await erc20.connect(advertiserWithProvider).approve(targecyAddress, amount);
      await targecy.connect(advertiserWithProvider).fundAdvertiserBudget(advertiserWithProvider.address, amount);

      const finalAdvertiserERC20Balance = await erc20.balanceOf(advertiserWithProvider.address);
      const finalAdvertiserBudgetBalance = (await targecy.budgets(advertiserWithProvider.address)).totalBudget;

      expect(finalAdvertiserERC20Balance).to.be.eq(initialAdvertiserERC20Balance - amount);
      expect(finalAdvertiserBudgetBalance).to.be.eq(amount);
    });

    it('Advertisers should be able to withdraw (only their) funds', async () => {
      const amountDeposited = 1000000n;
      await erc20.connect(advertiserWithProvider).approve(targecyAddress, amountDeposited);
      await targecy.connect(advertiserWithProvider).fundAdvertiserBudget(advertiserWithProvider.address, amountDeposited);

      const initialAdvertiserERC20Balance = await erc20.balanceOf(advertiserWithProvider.address);
      const initialAdvertiserBudgetBalance = (await targecy.budgets(advertiserWithProvider.address)).totalBudget;

      expect(initialAdvertiserBudgetBalance).to.be.eq(amountDeposited, 'Amount deposited incorrect.');

      const amountToWithdraw = 30000n;
      await targecy.connect(advertiserWithProvider).withdrawAdvertiserBudget(amountToWithdraw);

      const finalAdvertiserERC20Balance = await erc20.balanceOf(advertiserWithProvider.address);
      const finalAdvertiserBudgetBalance = (await targecy.budgets(advertiserWithProvider.address)).totalBudget;

      expect(finalAdvertiserERC20Balance).to.be.eq(amountToWithdraw + BigInt(initialAdvertiserERC20Balance));
      expect(finalAdvertiserBudgetBalance).to.be.eq(initialAdvertiserBudgetBalance - amountToWithdraw);
    });

    it('Anyone can deposit for anyone', async () => {
      const initialAdvertiserERC20Balance = await erc20.balanceOf(adminWithProvider.address);
      const initialAdvertiserBudgetBalance = (await targecy.budgets(advertiserWithProvider.address)).totalBudget;

      expect(initialAdvertiserERC20Balance).to.be.gt(0n);
      expect(initialAdvertiserBudgetBalance).to.be.eq(0n);

      const amount = 1000000n;
      await erc20.connect(adminWithProvider).approve(targecyAddress, amount);
      await targecy.connect(adminWithProvider).fundAdvertiserBudget(advertiserWithProvider.address, amount);

      const finalAdvertiserERC20Balance = await erc20.balanceOf(adminWithProvider.address);
      const finalAdvertiserBudgetBalance = (await targecy.budgets(advertiserWithProvider.address)).totalBudget;

      expect(finalAdvertiserERC20Balance).to.be.eq(initialAdvertiserERC20Balance - amount);
      expect(finalAdvertiserBudgetBalance).to.be.eq(amount);
    });
  });

  describe('Publishers', () => {
    beforeEach(async () => {
      await evm.snapshot.revert(snapshotId);
    });

    it('Only admins can set a publisher', async () => {
      const params = {
        vault: publisherWithProvider.address,
        userRewardsPercentage: 10000,
        active: true,
        cpi: 1n,
        cpc: 1n,
        cpa: 1n,
      };
      await expect(targecy.connect(userWithProvider).setPublisher(params)).to.be.reverted;
      await targecy.connect(adminWithProvider).setPublisher(params);
      const saved = await targecy.publishers(publisherWithProvider.address);
      expect(saved.userRewardsPercentage).to.be.eq(params.userRewardsPercentage);
      expect(saved.vault).to.be.eq(params.vault);
      expect(saved.active).to.be.eq(params.active);
      expect(saved.cpa).to.be.eq(params.cpa);
      expect(saved.cpc).to.be.eq(params.cpc);
      expect(saved.cpi).to.be.eq(params.cpi);
    });

    it('Only whitelisted publishers can trigger consumptions', async () => {
      const params = {
        vault: publisherWithProvider.address,
        userRewardsPercentage: 10000,
        active: true,
        cpi: 1n,
        cpc: 1n,
        cpa: 1n,
      };
      await targecy.connect(advertiserWithProvider).setAd(0, {
        active: true,
        attribution: 0,
        abi: '',
        target: ZeroAddress,
        metadataURI: 'metadata',
        maxConsumptionsPerDay: 100,
        maxBudget: 1000000000,
        maxPricePerConsumption: 3000000,
        startingTimestamp: 0,
        endingTimestamp: ethers.MaxUint256,
        audienceIds: [1],
        blacklistedPublishers: [],
      });

      await targecy.connect(adminWithProvider).setPublisher(params);
      await expect(
        targecy.connect(userWithProvider).consumeAd(
          1n,
          ZeroAddress,
          {
            inputs: [[1n, 1n]],
            a: [[1n, 1n]],
            b: [
              [
                [1n, 1n],
                [1n, 1n],
              ],
            ],
            c: [[1n, 1n]],
          },
          ZeroAddress
        )
      ).to.be.reverted; // @todo use specific errors!
    });
  });

  describe('Consumptions', () => {
    let conversionAdId: bigint;
    let viewAdId: bigint;
    let zkProofs: any;

    beforeEach(async () => {
      await evm.snapshot.revert(snapshotId);

      if (Boolean(isolatedEnv)) return; // This ad requires internet connection for generating proofs. @todo (@Martin): review this with polygon id team
      await targecy.setSegment(0, getTestAudience());
      await targecy.setAudience(0, 'metadata', [1]);

      const response = await targecy.connect(advertiserWithProvider).setAd(0, {
        active: true,
        attribution: 2,
        abi: 'setValue(bytes)',
        target: externalContractAddress,
        metadataURI: 'metadata',
        maxConsumptionsPerDay: 100,
        maxBudget: 1000000000,
        maxPricePerConsumption: 3000000,
        startingTimestamp: 0,
        endingTimestamp: ethers.MaxUint256,
        audienceIds: [1],
        blacklistedPublishers: [],
      });
      const receipt = await response.wait();
      expect(decodeEvents(receipt, abiByAddress)?.filter((e) => e.name === 'AdEdited').length).to.equal(1);
      conversionAdId = (await targecy._adId()) - 1n;

      const response2 = await targecy.connect(advertiserWithProvider).setAd(0, {
        active: true,
        attribution: 0,
        abi: '',
        target: ZeroAddress,
        metadataURI: 'metadata',
        maxConsumptionsPerDay: 100,
        maxBudget: 1000000000,
        maxPricePerConsumption: 3000000,
        startingTimestamp: 0,
        endingTimestamp: ethers.MaxUint256,
        audienceIds: [1],
        blacklistedPublishers: [],
      });
      const receipt2 = await response2.wait();
      expect(decodeEvents(receipt2, abiByAddress)?.filter((e) => e.name === 'AdEdited').length).to.equal(1);
      viewAdId = (await targecy._adId()) - 1n;

      this.timeout(100000);
      const proof = await getTestProof(zkServices, 1);

      await targecy.setPublisher({ userRewardsPercentage: 5000n, vault: publisherWithProvider.address, active: true, cpi: 0n, cpa: 0n, cpc: 0n });

      expect((await targecy.budgets(advertiserWithProvider.address)).remainingBudget).to.equal(0n);
      await erc20.approve(await targecy.getAddress(), 1000000000n); // Must approve ERC20 transfers
      await targecy.fundAdvertiserBudget(advertiserWithProvider.address, 1000000000n);
      expect((await targecy.budgets(advertiserWithProvider.address)).remainingBudget).to.equal(1000000000n);

      const signals = proof.pub_signals.map((signal) => BigInt(signal));
      signals[7] = defaultIssuer;

      zkProofs = {
        inputs: [signals],
        a: [proof.proof.pi_a.map((x) => BigInt(x)) as any],
        b: [proof.proof.pi_b.map((x) => x.map((y) => BigInt(y))) as any],
        c: [proof.proof.pi_c.map((x) => BigInt(x)) as any],
      };
    });

    it('Should be able to consume an ad converting at an external contract', async () => {
      const publisherPastBalance = await erc20.balanceOf(publisherWithProvider.address);
      const vaultPastBalance = await erc20.balanceOf(vaultWithProvider.address);
      const userPastBalance = await erc20.balanceOf(userWithProvider.address);
      const contractPastBalance = await erc20.balanceOf(targecyAddress);
      const advertiserRemainingBudget = (await targecy.budgets(advertiserWithProvider.address)).remainingBudget;
      const valueForExternalContract = 2n;
      const encodedValueForExternalContract = ethers.AbiCoder.defaultAbiCoder().encode(
        ['uint256', 'address'],
        [valueForExternalContract, userWithProvider.address]
      );
      expect(await externalContract.owner()).to.equal(ZeroAddress);
      expect(await externalContract.value()).to.equal(0n);

      const tx = await targecy.connect(userWithProvider).consumeAd(conversionAdId, publisherWithProvider.address, zkProofs, encodedValueForExternalContract, {
        value: valueForExternalContract,
      });
      const receipt = await tx.wait();

      expect(decodeEvents(receipt, abiByAddress)?.filter((e) => e.name === 'ValueSet').length).to.equal(1);

      expect(await externalContract.owner()).to.equal(userWithProvider.address);
      expect(await externalContract.value()).to.equal(valueForExternalContract);

      expect(decodeEvents(receipt, abiByAddress)?.filter((e) => e.name === 'RewardsDistributed').length).to.equal(1);
      expect(decodeEvents(receipt, abiByAddress)?.filter((e) => e.name === 'AdConsumed').length).to.equal(1);
      expect(userPastBalance).to.be.lt(await erc20.balanceOf(userWithProvider.address));
      expect(vaultPastBalance).to.be.lt(await erc20.balanceOf(vaultWithProvider.address));
      expect(publisherPastBalance).to.be.lt(await erc20.balanceOf(publisherWithProvider.address));
      expect(contractPastBalance).to.be.gt(await erc20.balanceOf(targecyAddress));
      expect((await targecy.budgets(advertiserWithProvider.address)).remainingBudget).to.be.lt(advertiserRemainingBudget);
    });

    it('Should be able to consume an ad via relayer', async () => {
      const publisherPastBalance = await erc20.balanceOf(publisherWithProvider.address);
      const vaultPastBalance = await erc20.balanceOf(vaultWithProvider.address);
      const userPastBalance = await erc20.balanceOf(userWithProvider.address);
      const contractPastBalance = await erc20.balanceOf(targecyAddress);
      const advertiserRemainingBudget = (await targecy.budgets(advertiserWithProvider.address)).remainingBudget;

      const tx = await targecy
        .connect(relayerWithProvider)
        .consumeAdViaRelayer(userWithProvider.address, viewAdId, publisherWithProvider.address, zkProofs, ZeroAddress);
      const receipt = await tx.wait();

      expect(decodeEvents(receipt, abiByAddress)?.filter((e) => e.name === 'RewardsDistributed').length).to.equal(1);
      expect(decodeEvents(receipt, abiByAddress)?.filter((e) => e.name === 'AdConsumed').length).to.equal(1);
      expect(userPastBalance).to.be.lt(await erc20.balanceOf(userWithProvider.address));
      expect(vaultPastBalance).to.be.lt(await erc20.balanceOf(vaultWithProvider.address));
      expect(publisherPastBalance).to.be.lt(await erc20.balanceOf(publisherWithProvider.address));
      expect(contractPastBalance).to.be.gt(await erc20.balanceOf(targecyAddress));
      expect((await targecy.budgets(advertiserWithProvider.address)).remainingBudget).to.be.lt(advertiserRemainingBudget);
    });

    it('Non whitelisted publishers can not consume ads', async () => {
      await expect(targecy.connect(userWithProvider).consumeAd(viewAdId, ZeroAddress, zkProofs, ZeroAddress)).to.be.reverted;
    });

    it('Invalid ZK Proofs structure', async () => {
      const invalidZKProofs = zkProofs;
      invalidZKProofs.a = [];
      await expect(targecy.connect(userWithProvider).consumeAd(viewAdId, publisherWithProvider.address, invalidZKProofs, ZeroAddress)).to.be.reverted;
    });

    it('Advertiser need to have funds in order to consume ads', async () => {
      await targecy.connect(userWithProvider).setAd(0, {
        active: true,
        attribution: 2,
        abi: '',
        target: ZeroAddress,
        metadataURI: 'metadata',
        maxConsumptionsPerDay: 100,
        maxBudget: 1000000000,
        maxPricePerConsumption: 3000000,
        startingTimestamp: 0,
        endingTimestamp: ethers.MaxUint256,
        audienceIds: [1],
        blacklistedPublishers: [],
      });
      const invalidAdId = (await targecy._adId()) - 1n;

      await expect(
        targecy.connect(relayerWithProvider).consumeAdViaRelayer(userWithProvider.address, invalidAdId, publisherWithProvider.address, zkProofs, ZeroAddress)
      ).to.be.reverted;

      // Fund advertiser

      expect((await targecy.budgets(userWithProvider.address)).remainingBudget).to.equal(0n);
      await erc20.approve(await targecy.getAddress(), 1000000000n); // Must approve ERC20 transfers
      await targecy.fundAdvertiserBudget(userWithProvider.address, 1000000000n);
      expect((await targecy.budgets(userWithProvider.address)).remainingBudget).to.equal(1000000000n);

      // Try again
      const tx = await targecy
        .connect(relayerWithProvider)
        .consumeAdViaRelayer(userWithProvider.address, invalidAdId, publisherWithProvider.address, zkProofs, ZeroAddress);
      const receipt = await tx.wait();
      expect(decodeEvents(receipt, abiByAddress)?.filter((e) => e.name === 'AdConsumed').length).to.equal(1);
    });
  });

  describe('Configuration', () => {
    beforeEach(async () => {
      await evm.snapshot.revert(snapshotId);
    });

    it('Only admins can set default issuer', async () => {
      await expect(targecy.connect(userWithProvider).setDefaultIssuer(1n)).to.be.reverted;
      expect(targecy.connect(adminWithProvider).setDefaultIssuer(1n)).to.be.satisfy(targecy.connect(adminWithProvider).setDefaultIssuer);
    });
    it('Only admins can set default impression price', async () => {
      await expect(targecy.connect(userWithProvider).setDefaultImpressionPrice(1n)).to.be.reverted;
      expect(targecy.connect(adminWithProvider).setDefaultImpressionPrice(1n)).to.be.satisfy(targecy.connect(adminWithProvider).setDefaultImpressionPrice);
    });
    it('Only admins can set default click price', async () => {
      await expect(targecy.connect(userWithProvider).setDefaultClickPrice(1n)).to.be.reverted;
      expect(targecy.connect(adminWithProvider).setDefaultClickPrice(1n)).to.be.satisfy(targecy.connect(adminWithProvider).setDefaultClickPrice);
    });
    it('Only admins can set default conversion price', async () => {
      await expect(targecy.connect(userWithProvider).setDefaultConversionPrice(1n)).to.be.reverted;
      expect(targecy.connect(adminWithProvider).setDefaultConversionPrice(1n)).to.be.satisfy(targecy.connect(adminWithProvider).setDefaultConversionPrice);
    });
    it('Only admins can set admins', async () => {
      await expect(targecy.connect(userWithProvider).setAdmin(ZeroAddress)).to.be.reverted;
      expect(targecy.connect(adminWithProvider).setAdmin(ZeroAddress)).to.be.satisfy(targecy.connect(adminWithProvider).setAdmin);
    });
    it('Only admins can set ZKProofs Validator', async () => {
      await expect(targecy.connect(userWithProvider).setValidator(ZeroAddress)).to.be.reverted;
      expect(targecy.connect(adminWithProvider).setValidator(ZeroAddress)).to.be.satisfy(targecy.connect(adminWithProvider).setValidator);
    });
    it('Only admins can set Protocol Vault', async () => {
      await expect(targecy.connect(userWithProvider).setVault(ZeroAddress)).to.be.reverted;
      expect(targecy.connect(adminWithProvider).setVault(ZeroAddress)).to.be.satisfy(targecy.connect(adminWithProvider).setVault);
    });
    it('Only admins can set relayer address', async () => {
      await expect(targecy.connect(userWithProvider).setRelayer(ZeroAddress)).to.be.reverted;
      expect(targecy.connect(adminWithProvider).setRelayer(ZeroAddress)).to.be.satisfy(targecy.connect(adminWithProvider).setRelayer);
    });
  });
});
