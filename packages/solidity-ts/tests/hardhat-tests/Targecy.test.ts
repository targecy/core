/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import '~helpers/hardhat-imports';
import '~tests/utils/chai-imports';

import { expect } from 'chai';
import { AddressLike, BigNumberish, JsonRpcProvider, JsonRpcSigner, ZeroAddress } from 'ethers';
import { Targecy, MockValidator } from 'generated/contract-types';
import { ethers } from 'hardhat';

import * as evm from '../utils/evm';

import { ZKServices, decodeEvents, defaultIssuer, getTestAudience, getTestProof, initZKServices, relayerAddress } from './helpers';

import { getStringFromFile, saveStringToFile } from '~scripts/utils';

// @todo add 100% coverage, separate in different files and add proper testing for zk proofs. Test that all events needed in subgraph are being thrown.
describe('Tests', function () {
  this.timeout(0);

  let targecy: Targecy;
  let validator: MockValidator;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars-ts
  let deployerWithProvider: JsonRpcSigner;
  let adminWithProvider: JsonRpcSigner;
  let vaultWithProvider: JsonRpcSigner;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars-ts
  let userWithProvider: JsonRpcSigner;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars-ts
  let publisherWithProvider: JsonRpcSigner;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars-ts
  let advertiserWithProvider: JsonRpcSigner;

  const defaultSegment = {
    metadataURI: '',
    issuer: defaultIssuer,
    query: {
      schema: 1,
      slotIndex: 1,
      operator: 1,
      value: [],
      circuitId: '',
    },
  };

  let snapshotId: string;
  let provider: JsonRpcProvider;

  interface AddressesFile {
    targecy?: string;
    validator?: string;
  }
  const addressesFilePath = '../tests/hardhat-tests/addresses.json';

  let zkServices: ZKServices;

  before(async () => {
    await evm.reset();

    const TEST_USING_LOCAL_CHAIN = process.env.TEST_USING_LOCAL_CHAIN === 'true';
    let deployedAddresses: AddressesFile = {};
    let addressesModified = false;

    if (!TEST_USING_LOCAL_CHAIN) {
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

    console.log(
      `Signers \n | Deployer: ${deployerWithProvider.address} \n | Admin: ${adminWithProvider.address} \n | Vault: ${vaultWithProvider.address} \n | User: ${userWithProvider.address} \n | Publisher: ${publisherWithProvider.address} \n | Advertiser: ${advertiserWithProvider.address} \n`
    );

    console.log('Deploying MockValidator...');
    const validatorFactory = (await ethers.getContractFactory('MockValidator')).connect(deployerWithProvider);
    validator =
      deployedAddresses.validator !== undefined
        ? (validatorFactory.attach(deployedAddresses.validator) as MockValidator)
        : ((await validatorFactory.deploy()).connect(adminWithProvider) as MockValidator);
    const validatorAddress = await validator.getAddress();
    console.log(" | MockValidator's address: ", validatorAddress);
    console.log(" | MockValidator's mock example: ", await validator.connect(adminWithProvider).getCircuitId());

    console.log('\nDeploying Targecy...');
    const targecyArgs: [
      _zkProofsValidator: AddressLike,
      _protocolVault: AddressLike,
      targecyAdmin: AddressLike,
      _defaultIssuer: BigNumberish,
      _relayerAddress: AddressLike
    ] = [await validator.getAddress(), vaultWithProvider.address, adminWithProvider.address, defaultIssuer.toString(), relayerAddress];
    const factory = (await ethers.getContractFactory('Targecy')).connect(deployerWithProvider);
    let targecyDeployed;
    if (deployedAddresses.targecy !== undefined) {
      targecyDeployed = factory.attach(deployedAddresses.targecy) as Targecy;
    } else {
      targecyDeployed = (await factory.deploy()).connect(adminWithProvider) as Targecy;
      await targecyDeployed.initialize(...targecyArgs);
    }
    targecy = targecyDeployed.connect(adminWithProvider);

    const address = await targecy.getAddress();
    console.log(" | Targecy's address: ", address);
    console.log(" | Connected's address: ", (targecy.runner as JsonRpcSigner).address);
    console.log(" | Connected's address balance", await provider.getBalance((targecy.runner as JsonRpcSigner).address));
    console.log(' | Initialized values > Validator', await targecy.zkProofsValidator());
    console.log(' | Initialized values > Vault', await targecy.protocolVault());
    console.log(' | Initialized values > Relayer Address', await targecy.relayerAddress());
    console.log(' | Initialized values > Ad Id', await targecy._adId());

    if (addressesModified) saveStringToFile(JSON.stringify({ targecy: address, validator: validatorAddress }), addressesFilePath, true);

    console.log('\nInitializing Zero-Knowledge Proofs Helpers...');
    zkServices = await initZKServices();
    console.log('Done!');

    console.log('\nReady! Running tests! \n\n');

    snapshotId = await evm.snapshot.take();
  });

  beforeEach(async () => {
    await evm.snapshot.revert(snapshotId);
  });

  describe('Audiences', () => {
    it('Should be able to create a audience', async () => {
      expect(await targecy._audienceId()).to.equal(1n);

      const tx = await targecy.setSegment(0, defaultSegment);
      const receipt = await tx.wait();
      expect(decodeEvents(receipt)?.filter((e) => e.name === 'SegmentEdited').length).to.equal(1);
      const segmentId = (await targecy._audienceId()) - 1n;

      const tx2 = await targecy.setAudience(0, 'metadata', [segmentId]);
      const receipt2 = await tx2.wait();
      expect(decodeEvents(receipt2)?.filter((e) => e.name === 'AudienceEdited').length).to.equal(1);
      const audienceId = (await targecy._audienceId()) - 1n;

      const saved = await targecy.audiences(audienceId);
      expect(saved.metadataURI).to.equal('metadata');
      expect(saved.consumptions).to.equal(0);
      expect(await targecy.getAudienceSegments(audienceId)).to.deep.equal([segmentId]);
      expect(audienceId).to.equal(1n);
      expect(await targecy._audienceId()).to.equal(2n);
    });
  });

  describe('Segments', () => {
    let segmentId: bigint;

    before(async () => {
      const tx = await targecy.setSegment(0, defaultSegment);
      const receipt = await tx.wait();
      expect(decodeEvents(receipt)?.filter((e) => e.name === 'SegmentEdited').length).to.equal(1);

      segmentId = (await targecy._audienceId()) - 1n;
    });

    it('Should be able to create a target group', async () => {
      expect(await targecy._audienceId()).to.equal(1n);

      const tx = await targecy.setAudience(0, 'metadata', [segmentId]);
      const receipt = await tx.wait();

      expect(await targecy._audienceId()).to.equal(2n);
      expect(decodeEvents(receipt)?.filter((e) => e.name === 'AudienceEdited').length).to.equal(1);

      const saved = await targecy.audiences(1);
      expect(saved.metadataURI).to.equal('metadata');
      expect(saved.consumptions).to.equal(0);
      expect(await targecy.getAudienceSegments(1)).to.deep.equal([segmentId]);
    });
  });

  describe('Ad', () => {
    before(async () => {
      // Create Target Group and Audience

      const zkTx = await targecy.setSegment(0, defaultSegment);
      const zkReceipt = await zkTx.wait();
      expect(decodeEvents(zkReceipt)?.filter((e) => e.name === 'SegmentEdited').length).to.equal(1);

      const segmentId = (await targecy._audienceId()) - 1n;

      const aTx = await targecy.setAudience(0, 'metadata', [segmentId]);
      const aReceipt = await aTx.wait();

      expect(decodeEvents(aReceipt)?.filter((e) => e.name === 'AudienceEdited').length).to.equal(1);
    });

    it('Should be able to create an ad', async () => {
      await targecy.setSegment(0, defaultSegment);
      const segmentId = (await targecy._audienceId()) - 1n;
      await targecy.setAudience(0, 'metadata', [segmentId]);
      const audienceId = (await targecy._audienceId()) - 1n;

      expect(await targecy._adId()).to.equal(1n);

      const tx = await targecy.connect(advertiserWithProvider).setAd.send(0, {
        metadataURI: 'metadata',
        attribution: 0,
        active: true,
        abi: '',
        target: ZeroAddress,

        startingTimestamp: 1,
        endingTimestamp: 100,
        audienceIds: [audienceId],
        blacklistedPublishers: [],
        blacklistedWeekdays: [],

        budget: 10000000,
        maxPricePerConsumption: 20000,
        maxConsumptionsPerDay: 100,
      });

      const receipt = await tx.wait();

      expect(await targecy._adId()).to.equal(2n);
      expect(decodeEvents(receipt)?.filter((e) => e.name === 'AdEdited').length).to.equal(1);

      const saved = await targecy.ads(1);
      expect(saved.metadataURI).to.equal('metadata');
      expect(saved.advertiser).to.equal(await advertiserWithProvider.getAddress());

      expect(saved.maxPricePerConsumption).to.equal(20000);
      expect(saved.startingTimestamp).to.equal(1);
      expect(saved.endingTimestamp).to.equal(100);
      expect(await targecy.getAdAudiences(1)).to.deep.equal([audienceId]);
    });
  });

  describe('consumptions', () => {
    it('Should be able to consume an ad', async () => {
      this.timeout(100000);

      await targecy.setSegment(0, getTestAudience());
      await targecy.setAudience(0, 'metadata', [1]);
      await targecy.connect(advertiserWithProvider).setAd(0, {
        active: true,
        attribution: 2,
        abi: '',
        target: ZeroAddress,
        metadataURI: 'metadata',
        maxConsumptionsPerDay: 100,
        budget: 1000000000,
        maxPricePerConsumption: 3000000,
        startingTimestamp: 0,
        endingTimestamp: ethers.MaxUint256,
        audienceIds: [1],
        blacklistedPublishers: [],
        blacklistedWeekdays: [],
      });

      const proof = await getTestProof(zkServices, 1);

      const publisherPastBalance = await provider.getBalance(publisherWithProvider.address);
      const vaultPastBalance = await provider.getBalance(vaultWithProvider.address);

      await targecy.setPublisher({ userRewardsPercentage: 0n, vault: publisherWithProvider.address, active: true, cpi: 0n, cpa: 0n, cpc: 0n });

      expect((await targecy.budgets(advertiserWithProvider.address)).remainingBudget).to.equal(0n);
      await targecy.fundAdvertiserBudget(advertiserWithProvider.address, {
        value: 1000000000n,
      });
      expect((await targecy.budgets(advertiserWithProvider.address)).remainingBudget).to.equal(1000000000n);

      const signals = proof.pub_signals.map((signal) => BigInt(signal));
      signals[7] = defaultIssuer;
      const tx = await targecy.consumeAd(
        1n,
        publisherWithProvider.address,
        {
          inputs: [signals],
          a: [proof.proof.pi_a.map((x) => BigInt(x)) as any],
          b: [proof.proof.pi_b.map((x) => x.map((y) => BigInt(y))) as any],
          c: [proof.proof.pi_c.map((x) => BigInt(x)) as any],
        },
        []
      );
      const receipt = await tx.wait();

      expect(decodeEvents(receipt)?.filter((e) => e.name === 'RewardsDistributed').length).to.equal(1);
      expect(decodeEvents(receipt)?.filter((e) => e.name === 'AdConsumed').length).to.equal(1);
      expect(publisherPastBalance).to.be.lt(await provider.getBalance(publisherWithProvider.address));
      expect(vaultPastBalance).to.be.lt(await provider.getBalance(vaultWithProvider.address));
    });
  });
});
