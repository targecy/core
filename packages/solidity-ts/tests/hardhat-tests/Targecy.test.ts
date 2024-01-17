/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import '~helpers/hardhat-imports';
import '~tests/utils/chai-imports';

import { BigNumber } from '@ethersproject/bignumber';
import { expect } from 'chai';
import { AddressLike, BigNumberish, JsonRpcProvider, JsonRpcSigner } from 'ethers';
import { Targecy, MockValidator } from 'generated/contract-types';
import { ethers } from 'hardhat';

import * as evm from '../utils/evm';

import { decodeEvents, defaultIssuer, getTestAudience, getTestProof, relayerAddress } from './helpers';

import { DataTypes } from '~generated/contract-types/contracts/core/Targecy';

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

  let defaultSegment: DataTypes.SegmentStruct;
  let snapshotId: string;
  let provider: JsonRpcProvider;

  before(async () => {
    await evm.reset();

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
    validator = (await validatorFactory.deploy()).connect(adminWithProvider) as unknown as MockValidator;
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
    const targecyDeployed = (await factory.deploy()) as Targecy;
    await targecyDeployed.initialize(...targecyArgs);
    targecy = targecyDeployed.connect(adminWithProvider);

    const address = await targecy.getAddress();
    console.log(" | Targecy's address: ", address);
    console.log(" | Connected's address: ", (targecy.runner as JsonRpcSigner).address);
    console.log(" | Targecy's provider", targecy.runner?.provider);
    console.log(' | Initialized values > Validator', await targecy.zkProofsValidator());
    console.log(' | Initialized values > Vault', await targecy.protocolVault());
    console.log(' | Initialized values > Relayer Address', await targecy.relayerAddress());
    console.log(' | Initialized values > Ad Id', await targecy._adId());

    defaultSegment = {
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

    console.log('\nAll initialized, running tests! \n\n');

    snapshotId = await evm.snapshot.take();
  });

  beforeEach(async () => {
    await evm.snapshot.revert(snapshotId);
  });

  describe('Audiences', () => {
    it('Should be able to create a audience', async () => {
      expect(await targecy._audienceId()).to.equal(BigNumber.from(1));

      const tx = await targecy.setSegment(0, defaultSegment);
      const receipt = await tx.wait();

      console.log(decodeEvents(receipt));
      expect(decodeEvents(receipt)?.filter((e) => e.name === 'SegmentEdited').length).to.equal(1);
      expect(await targecy._audienceId()).to.equal(BigNumber.from(2));

      const saved = await targecy.requestQueries(1);

      expect(saved.query.circuitId).to.equal(defaultSegment.query.circuitId);
      expect(saved.query.operator).to.equal(defaultSegment.query.operator);
      expect(saved.query.schema).to.equal(defaultSegment.query.schema);
      expect(saved.query.slotIndex).to.equal(defaultSegment.query.slotIndex);
      expect(saved.query.value).to.deep.equal(defaultSegment.query.value);
      expect(saved.metadataURI).to.equal(defaultSegment.metadataURI);
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
      expect(await targecy._audienceId()).to.equal(BigNumber.from(1));

      const tx = await targecy.setAudience(0, 'metadata', [segmentId]);
      const receipt = await tx.wait();

      expect(await targecy._audienceId()).to.equal(BigNumber.from(2));
      expect(decodeEvents(receipt)?.filter((e) => e.name === 'AudienceEdited').length).to.equal(1);

      const saved = await targecy.audiences(1);
      expect(saved.metadataURI).to.equal('metadata');
      expect(saved.consumptions).to.equal(0);
      expect(await targecy.getAudienceSegments(1)).to.deep.equal([segmentId]);
    });
  });

  describe('Ad', () => {
    let segmentId: bigint;
    let tgId: bigint;

    before(async () => {
      // Create Target Group and Audience

      const zkTx = await targecy.setSegment(0, defaultSegment);
      const zkReceipt = await zkTx.wait();
      expect(decodeEvents(zkReceipt)?.filter((e) => e.name === 'SegmentEdited').length).to.equal(1);

      segmentId = (await targecy._audienceId()) - 1n;

      const aTx = await targecy.setAudience(0, 'metadata', [segmentId]);
      const aReceipt = await aTx.wait();

      expect(decodeEvents(aReceipt)?.filter((e) => e.name === 'AudienceEdited').length).to.equal(1);

      tgId = (await targecy._audienceId()) - 1n;
    });

    it.only('Should be able to create an ad', async () => {
      await targecy.setSegment(0, defaultSegment);
      await targecy.setAudience(0, 'metadata', [segmentId]);

      console.log('a');
      expect(await targecy._adId()).to.equal(BigNumber.from(1));

      console.log('b');
      const tx = await targecy.setAd(0, {
        metadataURI: 'metadata',
        attribution: 0,
        active: true,
        abi: '',
        target: '',

        startingTimestamp: 1,
        endingTimestamp: 100,
        audienceIds: [],
        blacklistedPublishers: [],
        blacklistedWeekdays: [],

        budget: 10000000,
        maxPricePerConsumption: 20000,
        maxConsumptionsPerDay: 100,
      });

      console.log('c');

      const receipt = await tx.wait();

      expect(await targecy._adId()).to.equal(BigNumber.from(2));
      expect(decodeEvents(receipt)?.filter((e) => e.name === 'AdEdited').length).to.equal(1);

      console.log('d');
      const saved = await targecy.ads(1);
      expect(saved.metadataURI).to.equal('metadata');
      expect(saved.advertiser).to.equal(await userWithProvider.getAddress());
      expect(saved.maxPricePerConsumption).to.equal(20000);
      expect(saved.startingTimestamp).to.equal(1);
      expect(saved.endingTimestamp).to.equal(100);
      expect(await targecy.getAdAudiences(1)).to.deep.equal([tgId]);
    });
  });

  describe('consumptions', () => {
    it('Should be able to consume an ad', async () => {
      this.timeout(100000);

      await targecy.setSegment(0, getTestAudience());
      await targecy.setAudience(0, 'metadata', [1]);
      await targecy.setAd(
        0,
        {
          active: true,
          attribution: 1,
          abi: '',
          target: '',
          metadataURI: 'metadata',
          maxConsumptionsPerDay: 100,
          budget: 1000000000,
          maxPricePerConsumption: 20000,
          startingTimestamp: 0,
          endingTimestamp: ethers.MaxUint256,
          audienceIds: [1],
          blacklistedPublishers: [],
          blacklistedWeekdays: [],
        },
        { value: 1000000000 }
      );

      console.log('    > Generating proof, this may take +30s');
      const proof = await getTestProof(1);

      const publisherPastBalance = await provider.getBalance(publisherWithProvider.address);
      const vaultPastBalance = await provider.getBalance(vaultWithProvider.address);

      await targecy.setPublisher({ vault: publisherWithProvider.address, userRewardsPercentage: 0, active: true, cpi: 0, cpa: 0, cpc: 0 });

      const tx = await targecy.consumeAd(
        1,
        publisherWithProvider.address,
        {
          inputs: [proof.pub_signals],
          a: [proof.proof.pi_a.map((x) => BigNumber.from(x)) as any],
          b: [proof.proof.pi_b.map((x) => x.map((y) => BigNumber.from(y))) as any],
          c: [proof.proof.pi_c.map((x) => BigNumber.from(x)) as any],
        },
        [],
        {
          v: '',
          r: '',
          s: '',
          deadline: 0,
          nonce: 0,
        }
      );
      const receipt = await tx.wait();

      expect(decodeEvents(receipt)?.filter((e) => e.name === 'AdConsumed').length).to.equal(1);
      expect(publisherPastBalance).to.be.lt(await provider.getBalance(publisherWithProvider.address));
      expect(vaultPastBalance).to.be.lt(await provider.getBalance(vaultWithProvider.address));
    });
  });
});
