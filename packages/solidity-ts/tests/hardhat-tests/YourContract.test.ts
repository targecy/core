import '~helpers/hardhat-imports';
import '~tests/utils/chai-imports';

import { expect } from 'chai';
import { Targecy__factory, Targecy } from 'generated/contract-types';
import hre from 'hardhat';

import { getHardhatSigners } from '~helpers/functions/accounts';

describe('Targecy', function () {
  let yourContract: Targecy;

  before(async () => {
    const { deployer } = await getHardhatSigners(hre);
    const factory = new Targecy__factory(deployer);
    yourContract = await factory.deploy();
  });

  beforeEach(async () => {
    // put stuff you need to run before each test here
  });

  it("Should return the new purpose once it's changed", async function () {
    await yourContract.deployed();
    expect(await yourContract.purpose()).to.equal('Building Unstoppable Apps!!!');

    const newPurpose = 'Hola, mundo!';
    await yourContract.setPurpose(newPurpose);
    expect(await yourContract.purpose()).to.equal(newPurpose);
  });
});
