/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  createConnectorForExternalAbi,
  createConnectorForFoundryContract,
  createConnectorForHardhatContract,
} from 'eth-hooks/context';
import { invariant } from 'ts-invariant';

import * as toolkitContracts from '~common/generated/contract-types/';
import foundryDeployedContractsJson from '~common/generated/foundry_contracts.json';
import hardhatDeployedContractsJson from '~common/generated/hardhat_contracts.json';
import { scaffoldConfig } from '~common/scaffold.config';

/**
 * ⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️
 * ### Instructions
 * 1. edit externalContracts.config.ts to add your external contract addresses.
 * 2. edit `appContractsConfig` function below and add them to the list
 * 3. run `yarn contracts:build` to generate types for contracts
 * 4. run `yarn deploy` to generate hardhat_contracts.json
 *
 * ### Summary
 * - called  by useAppContracts
 * @returns
 */
export const appContractsConfig = () => {
  try {
    const result = {
      // --------------------------------------------------
      // 🙋🏽‍♂️ Contracts examples either using hardhat or foundry
      // --------------------------------------------------
      Targecy:
        scaffoldConfig.build.solidityToolkit === 'hardhat'
          ? createConnectorForHardhatContract(
              'Targecy',
              toolkitContracts.Targecy__factory,
              hardhatDeployedContractsJson
            )
          : createConnectorForFoundryContract(
              'Targecy',
              toolkitContracts.Targecy__factory,
              foundryDeployedContractsJson
            ),

      // --------------------------------------------------
      // 🙋🏽‍♂️ Add your external contracts here, make sure to define the address in `externalContractsConfig.ts`Í
      // --------------------------------------------------
      // DAI: createConnectorForExternalContract('DAI', externalContracts.DAI__factory, externalContractsAddressMap),

      // --------------------------------------------------
      // 🙋🏽‍♂️ Add your external abi here (unverified contracts)`
      // --------------------------------------------------
      TargecyFromAbi: createConnectorForExternalAbi(
        'Targecy',
        {
          [1235]: {
            address: 'xxx',
          },
        },
        toolkitContracts.Targecy__factory.abi
        // optional if you have a connect function:  externalContracts.Targecy__factory.connect
      ),
    } as const;

    return result;
  } catch (e) {
    invariant.error(
      '❌ appContractsConfig: ERROR with loading contracts please run `yarn contracts:build or yarn contracts:rebuild`.  Then run `yarn deploy`!'
    );
    invariant.error(e);
    throw e;
  }
};
