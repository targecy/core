import { getContract } from '../../utils';
import { Targecy } from '../../generated/contract-types';

type ConsumeAdParams = Parameters<Targecy['consumeAdViaRelayer']>;
export async function consumeAd(params: ConsumeAdParams) {
  const contract = getContract();

  const receipt = await contract.consumeAdViaRelayer(...params);

  // @todo (Martin): append hash to a queue and verify if it was mined

  return receipt.hash;
}
