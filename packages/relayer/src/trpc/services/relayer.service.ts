import { walletClient } from 'utils/signer';

type TxParameters = {
  data: any;
};

export async function sendTx(txParams: TxParameters) {
  const result = await walletClient.sendTransaction({
    to: process.env.CONTRACT_ADDRESS as `0x${string}`,
    data: txParams.data,
  });

  return result;
}
