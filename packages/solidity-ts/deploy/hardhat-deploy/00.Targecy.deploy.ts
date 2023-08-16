import { DeployFunction } from 'hardhat-deploy/types';
import { THardhatRuntimeEnvironmentExtended } from 'helpers/types/THardhatRuntimeEnvironmentExtended';

const func: DeployFunction = async (hre: THardhatRuntimeEnvironmentExtended) => {
  const { getNamedAccounts, deployments } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const validatorAddress = '0xb1e86C4c687B85520eF4fd2a0d14e81970a15aFB';
  const protocolVault = '0xEB71ed911e4dFc35Da80103a72fE983C8c709F33';
  const defaultImpressionPrice = 1;

  await deploy('Targecy', {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    args: [validatorAddress, protocolVault, defaultImpressionPrice],
    log: true,
  });

  /*
    // Getting a previously deployed contract
    const Targecy = await ethers.getContract("Targecy", deployer);
    await Targecy.setPurpose("Hello");
    
    //const yourContract = await ethers.getContractAt('Targecy', "0xaAC799eC2d00C013f1F11c37E654e59B0429DF6A") //<-- if you want to instantiate a version of a contract at a specific address!
  */
};
export default func;
func.tags = ['Targecy'];

/*
Tenderly verification
let verification = await tenderly.verify({
  name: contractName,
  address: contractAddress,
  network: targetNetwork,
});
*/
