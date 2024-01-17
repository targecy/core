/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import '~helpers/hardhat-imports';
import '~tests/utils/chai-imports';

import { CircuitId, CredentialRequest, CredentialStatusType, ZeroKnowledgeProofResponse } from '@0xpolygonid/js-sdk';
import { EventFragment, Interface } from '@ethersproject/abi';
import { BigNumber } from '@ethersproject/bignumber';
import { expect } from 'chai';
import { AddressLike, BigNumberish, ContractTransactionReceipt, JsonRpcProvider, JsonRpcSigner } from 'ethers';
import { Targecy, MockValidator, TargecyEvents__factory } from 'generated/contract-types';
import { ethers } from 'hardhat';

import * as evm from '../utils/evm';

import { DataTypes } from '~generated/contract-types/contracts/core/Targecy';
import { createIssuerIdentity, createUserIdentity, getCircuitStorage, initProofService, initializeStorages } from '~tests/utils/zk.utils';

const defaultIssuer = 1313424234234234234n;
const relayerAddress = '0x3bBF2d68CBb8C813Cbc4b4237abFeeE7023279ae';

function decodeEvents(receipt?: ContractTransactionReceipt | null): EventFragment[] {
  if (receipt?.logs == null) return [];

  const iface = new Interface(TargecyEvents__factory.abi);

  return receipt.logs?.map(
    (log) =>
      iface.parseLog({
        topics: log.topics as string[],
        data: log.data,
      }).eventFragment
  );
}

function getTestAudience(): DataTypes.SegmentStruct {
  return {
    metadataURI: '',
    issuer: defaultIssuer,
    query: {
      schema: 1,
      slotIndex: 2, // documentType
      operator: 1, // eq
      value: [99],
      circuitId: CircuitId.AtomicQuerySigV2OnChain,
    },
  };
}

async function getTestProof(audienceId: number): Promise<ZeroKnowledgeProofResponse> {
  const storages = initializeStorages();
  const circuitStorage = await getCircuitStorage();
  const issuerIdentity = await createIssuerIdentity(storages.identityWallet);
  const userIdentity = await createUserIdentity(storages.identityWallet);
  const proofService = initProofService(storages.identityWallet, storages.credWallet, storages.dataStorage.states, circuitStorage);

  const credentialRequest: CredentialRequest = {
    credentialSchema: 'https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json/KYCAgeCredential-v3.json',
    type: 'KYCAgeCredential',
    credentialSubject: {
      id: `did:iden3:${userIdentity.did.id.toString()}`,
      birthday: 19960424,
      documentType: 99,
    },
    expiration: 12345678888,
    revocationOpts: {
      type: CredentialStatusType.Iden3ReverseSparseMerkleTreeProof,
      id: 'https://rhs-staging.polygonid.me',
    },
  };

  const credential = await storages.identityWallet.issueCredential(issuerIdentity.did, credentialRequest);
  await storages.dataStorage.credential.saveCredential(credential);

  const proofReqSig = {
    id: Number(audienceId),
    circuitId: CircuitId.AtomicQuerySigV2OnChain,
    optional: false,
    query: {
      allowedIssuers: ['*'],
      type: credential.type,
      context: credential['@context'],
      credentialSubject: {
        documentType: {
          $eq: 99,
        },
      },
    },
  };

  const proof = await proofService.generateProof(proofReqSig, userIdentity.did, {
    credential: credential,
    challenge: BigInt(1),
    skipRevocation: false,
  });

  proof.proof.pi_a = proof.proof.pi_a.slice(0, 2);
  proof.proof.pi_b = [
    [proof.proof.pi_b[0]?.[1]?.toString(), proof.proof.pi_b[0]?.[0]?.toString()],
    [proof.proof.pi_b[1]?.[1]?.toString(), proof.proof?.pi_b[1]?.[0]?.toString()],
  ];
  proof.proof.pi_c = proof.proof.pi_c.slice(0, 2);

  return proof;
}

// @todo add 100% coverage, separate in different files and add proper testing for zk proofs. Test that all events needed in subgraph are being thrown.
describe('>>> Targecy Tests <<<', function () {
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

    // console.log('A', await contract._adId());
    // console.log('AAA', await contract.connect(adminWithProvider).getFunction('_adId')());
    // console.log('B', await (contract.connect(adminWithProvider) as unknown as Targecy).pause());
    // console.log('C', await (contract.connect(adminWithProvider) as unknown as Contract)._adId());
    // console.log("Ad ID's: ", (await targecy._adId()).toString());

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

      expect(decodeEvents(receipt)?.filter((e) => e.name === 'SegmentCreated').length).to.equal(1);
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
      expect(decodeEvents(receipt)?.filter((e) => e.name === 'SegmentCreated').length).to.equal(1);

      segmentId = (await targecy._audienceId()) - 1n;
    });

    it('Should be able to create a target group', async () => {
      expect(await targecy._audienceId()).to.equal(BigNumber.from(1));

      const tx = await targecy.setAudience(0, 'metadata', [segmentId]);
      const receipt = await tx.wait();

      expect(await targecy._audienceId()).to.equal(BigNumber.from(2));
      expect(decodeEvents(receipt)?.filter((e) => e.name === 'AudienceCreated').length).to.equal(1);

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
      expect(decodeEvents(zkReceipt)?.filter((e) => e.name === 'SegmentCreated').length).to.equal(1);

      segmentId = (await targecy._audienceId()) - 1n;

      const aTx = await targecy.setAudience(0, 'metadata', [segmentId]);
      const aReceipt = await aTx.wait();

      expect(decodeEvents(aReceipt)?.filter((e) => e.name === 'AudienceCreated').length).to.equal(1);

      tgId = (await targecy._audienceId()) - 1n;
    });

    it('Should be able to create an ad', async () => {
      await targecy.setSegment(0, defaultSegment);
      await targecy.setAudience(0, 'metadata', [segmentId]);

      expect(await targecy._adId()).to.equal(BigNumber.from(1));

      const tx = await targecy.setAd(
        0,
        {
          metadataURI: 'metadata',
          attribution: 0,
          active: true,
          abi: '',
          target: '',
          budget: 10000000,
          maxPricePerConsumption: 20000,
          startingTimestamp: 1,
          endingTimestamp: 100,
          audienceIds: [tgId],
          blacklistedPublishers: [],
          blacklistedWeekdays: [],
          maxConsumptionsPerDay: 100,
        },
        { value: 10000000 }
      );

      const receipt = await tx.wait();

      expect(await targecy._adId()).to.equal(BigNumber.from(2));
      expect(decodeEvents(receipt)?.filter((e) => e.name === 'AdCreated').length).to.equal(1);

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
