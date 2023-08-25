/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import '~helpers/hardhat-imports';
import '~tests/utils/chai-imports';

import { CircuitId, CredentialRequest, CredentialStatusType, ZeroKnowledgeProofResponse } from '@0xpolygonid/js-sdk';
import { EventFragment, Interface } from '@ethersproject/abi';
import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { Targecy__factory, Targecy, MockValidator__factory, MockValidator, Events__factory } from 'generated/contract-types';
import hre, { ethers } from 'hardhat';
import { SignerWithAddress } from 'hardhat-deploy-ethers/signers';
import { Log, Receipt } from 'hardhat-deploy/types';

import { DataTypes } from '~generated/contract-types/contracts/core/Targecy';
import { getHardhatSigners } from '~helpers/functions/accounts';
import { createIssuerIdentity, createUserIdentity, getCircuitStorage, initProofService, initializeStorages } from '~tests/utils/zk.utils';

function decodeEvents(receipt: Receipt): EventFragment[] {
  if (receipt.logs == null) return [];

  const iface = new Interface(Events__factory.abi);

  return receipt.logs?.map((log: Log) => iface.parseLog(log).eventFragment);
}

function getTestZKRequest(validatorAddress: string): DataTypes.ZKPRequestStruct {
  return {
    validator: validatorAddress,
    metadataURI: '',
    query: {
      schema: 1,
      slotIndex: 2, // documentType
      operator: 1, // eq
      value: [99],
      circuitId: CircuitId.AtomicQuerySigV2OnChain,
    },
  };
}

async function getTestProof(zkRequestId: number): Promise<ZeroKnowledgeProofResponse> {
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
    id: Number(zkRequestId),
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

describe('Targecy', function () {
  let targecy: Targecy;
  let admin: SignerWithAddress;
  let validator: MockValidator;
  let user: SignerWithAddress;
  let publisher: SignerWithAddress;
  let vault: SignerWithAddress;
  let defaultZKPRequest: DataTypes.ZKPRequestStruct;

  before(async () => {
    const { deployer, user1: protocolVault, user2, user3 } = await getHardhatSigners(hre);

    // Deploy Mock Validator
    const mockValidatorFactory = new MockValidator__factory(deployer);
    validator = await mockValidatorFactory.deploy();
    await validator.deployed();

    const factory = new Targecy__factory(deployer);
    targecy = await factory.deploy(validator.address, protocolVault.address, 10000);
    await targecy.deployed();

    user = user2;
    publisher = user3;
    admin = deployer;
    vault = protocolVault;

    defaultZKPRequest = {
      validator: validator.address,
      metadataURI: '',
      query: {
        schema: 1,
        slotIndex: 1,
        operator: 1,
        value: [],
        circuitId: '',
      },
    };
  });

  describe('ZKRequests', () => {
    it('Should be able to create a zkrequest', async () => {
      expect(await targecy._zkRequestId()).to.equal(ethers.BigNumber.from(1));

      const tx = await targecy.setZKPRequest(defaultZKPRequest);
      const receipt = await tx.wait();

      expect(decodeEvents(receipt)?.filter((e) => e.name === 'ZKPRequestCreated').length).to.equal(1);
      expect(await targecy._zkRequestId()).to.equal(ethers.BigNumber.from(2));

      const saved = await targecy.requestQueries(1);

      expect(saved.validator).to.equal(validator.address);
      expect(saved.query.circuitId).to.equal(defaultZKPRequest.query.circuitId);
      expect(saved.query.operator).to.equal(defaultZKPRequest.query.operator);
      expect(saved.query.schema).to.equal(defaultZKPRequest.query.schema);
      expect(saved.query.slotIndex).to.equal(defaultZKPRequest.query.slotIndex);
      expect(saved.query.value).to.deep.equal(defaultZKPRequest.query.value);
      expect(saved.metadataURI).to.equal(defaultZKPRequest.metadataURI);
    });
  });

  describe('Target Groups', () => {
    let zkpRequestId: BigNumber;

    before(async () => {
      const tx = await targecy.setZKPRequest(defaultZKPRequest);
      const receipt = await tx.wait();
      expect(decodeEvents(receipt)?.filter((e) => e.name === 'ZKPRequestCreated').length).to.equal(1);

      zkpRequestId = (await targecy._zkRequestId()).sub(1);
    });

    it('Should be able to create a target group', async () => {
      expect(await targecy._targetGroupId()).to.equal(ethers.BigNumber.from(1));

      const tx = await targecy.createTargetGroup('metadata', [zkpRequestId]);
      const receipt = await tx.wait();

      expect(await targecy._targetGroupId()).to.equal(ethers.BigNumber.from(2));
      expect(decodeEvents(receipt)?.filter((e) => e.name === 'TargetGroupCreated').length).to.equal(1);

      const saved = await targecy.targetGroups(1);
      expect(saved.metadataURI).to.equal('metadata');
      expect(saved.impressions).to.equal(0);
      expect(await targecy.getTargetGroupZKRequests(1)).to.deep.equal([zkpRequestId]);
    });
  });

  describe('Ad', () => {
    let zkpRequestId: BigNumber;
    let tgId: BigNumber;

    before(async () => {
      // Create Target Group and ZKRequest

      const zkTx = await targecy.setZKPRequest(defaultZKPRequest);
      const zkReceipt = await zkTx.wait();
      expect(decodeEvents(zkReceipt)?.filter((e) => e.name === 'ZKPRequestCreated').length).to.equal(1);

      zkpRequestId = (await targecy._zkRequestId()).sub(1);

      const tgTx = await targecy.createTargetGroup('metadata', [zkpRequestId]);
      const tgReceipt = await tgTx.wait();

      expect(decodeEvents(tgReceipt)?.filter((e) => e.name === 'TargetGroupCreated').length).to.equal(1);

      tgId = (await targecy._targetGroupId()).sub(1);
    });

    it('Should be able to create an ad', async () => {
      expect(await targecy._adId()).to.equal(ethers.BigNumber.from(1));

      const tx = await targecy.connect(user).createAd(
        {
          metadataURI: 'metadata',
          budget: 10000000,
          maxImpressionPrice: 20000,
          minBlock: 1,
          maxBlock: 100,
          targetGroupIds: [tgId],
        },
        { value: 10000000 }
      );

      const receipt = await tx.wait();

      expect(await targecy._adId()).to.equal(ethers.BigNumber.from(2));
      expect(decodeEvents(receipt)?.filter((e) => e.name === 'AdCreated').length).to.equal(1);

      const saved = await targecy.ads(1);
      expect(saved.metadataURI).to.equal('metadata');
      expect(saved.totalBudget).to.equal(10000000);
      expect(saved.remainingBudget).to.equal(10000000);
      expect(saved.advertiser).to.equal(user.address);
      expect(saved.maxImpressionPrice).to.equal(20000);
      expect(saved.minBlock).to.equal(1);
      expect(saved.maxBlock).to.equal(100);
      expect(await targecy.getAdTargetGroups(1)).to.deep.equal([tgId]);
    });
  });

  describe('Impressions', () => {
    let zkpRequestId: BigNumber;
    let tgId: BigNumber;
    let adId: BigNumber;

    before(async () => {
      // Create Ad
      const zkTx = await targecy.setZKPRequest(getTestZKRequest(validator.address));
      const zkReceipt = await zkTx.wait();
      expect(decodeEvents(zkReceipt)?.filter((e) => e.name === 'ZKPRequestCreated').length).to.equal(1);

      zkpRequestId = (await targecy._zkRequestId()).sub(1);

      const tgTx = await targecy.createTargetGroup('metadata', [zkpRequestId]);
      const tgReceipt = await tgTx.wait();

      expect(decodeEvents(tgReceipt)?.filter((e) => e.name === 'TargetGroupCreated').length).to.equal(1);

      tgId = (await targecy._targetGroupId()).sub(1);
      const tx = await targecy.connect(user).createAd(
        {
          metadataURI: 'metadata',
          budget: 1000000000,
          maxImpressionPrice: 20000,
          minBlock: 0,
          maxBlock: ethers.constants.MaxUint256,
          targetGroupIds: [tgId],
        },
        { value: 1000000000 }
      );

      const receipt = await tx.wait();
      expect(decodeEvents(receipt)?.filter((e) => e.name === 'AdCreated').length).to.equal(1);

      adId = (await targecy._adId()).sub(1);

      const whitelistPublisherTx = await targecy.connect(admin).whitelistPublisher(publisher.address);
      const whitelistPublisherReceipt = await whitelistPublisherTx.wait();
      expect(decodeEvents(whitelistPublisherReceipt)?.filter((e) => e.name === 'PublisherWhitelisted').length).to.equal(1);
    });

    it('Should be able to consume an ad', async () => {
      this.timeout(100000);

      console.log('    > Generating proof, this may take +30s');
      const proof = await getTestProof(zkpRequestId.toNumber());

      const verify = await targecy
        .connect(user)
        .verifyZKProof(
          zkpRequestId,
          proof.pub_signals,
          proof.proof.pi_a.map((x) => ethers.BigNumber.from(x)) as any,
          proof.proof.pi_b.map((x) => x.map((y) => ethers.BigNumber.from(y))) as any,
          proof.proof.pi_c.map((x) => ethers.BigNumber.from(x)) as any
        );

      expect(verify).to.be.equal(true);

      expect((await targecy.ads(adId)).remainingBudget).gt(10000);

      const publisherPastBalance = await publisher.getBalance();
      const vaultPastBalance = await vault.getBalance();
      const pastRemainingBudget = (await targecy.ads(adId)).remainingBudget;

      const tx = await targecy.connect(user).consumeAd(
        adId,
        {
          publisherVault: publisher.address,
          percentage: 5000, // 5% on 10000 precision
        },
        {
          inputs: [proof.pub_signals],
          a: [proof.proof.pi_a.map((x) => ethers.BigNumber.from(x)) as any],
          b: [proof.proof.pi_b.map((x) => x.map((y) => ethers.BigNumber.from(y))) as any],
          c: [proof.proof.pi_c.map((x) => ethers.BigNumber.from(x)) as any],
        }
      );
      const receipt = await tx.wait();
      expect(decodeEvents(receipt)?.filter((e) => e.name === 'AdConsumed').length).to.equal(1);
      expect(publisherPastBalance).to.be.lt(await publisher.getBalance());
      expect(vaultPastBalance).to.be.lt(await vault.getBalance());
      expect(pastRemainingBudget).to.be.gt((await targecy.ads(adId)).remainingBudget);
    });
  });
});
