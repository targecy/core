/* eslint-disable @typescript-eslint/no-namespace */

// import { loadScaffoldConfig } from '@common/scaffold.config';

/** ****************************** */
// global environmental variable declarations
/** ****************************** */
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly NEXT_PUBLIC_ISDEV: string;

      readonly NEXT_PUBLIC_RPC_MAINNET: string;
      readonly NEXT_PUBLIC_RPC_MAINNET_INFURA: string;
      readonly NEXT_PUBLIC_KEY_INFURA: string;
      readonly NEXT_PUBLIC_KEY_ETHERSCAN: string;
      readonly NEXT_PUBLIC_KEY_BLOCKNATIVE_DAPPID: string;
      readonly NEXT_PUBLIC_FAUCET_ALLOWED: string;
      readonly NEXT_PUBLIC_BURNER_FALLBACK_ALLOWED: string;
      readonly NEXT_PUBLIC_CONNECT_TO_BURNER_AUTOMATICALLY: string;
    }
  }
}

export const DEBUG = false;
