import { ERC1155Holding, KNOWN_ERC1155 } from 'constants/contracts.constants';
import { env } from 'process';

import { AddressString } from 'utils';

export async function getERC1155Holdings(address: AddressString): Promise<ERC1155Holding[]> {
  const knownERC1155 = KNOWN_ERC1155;

  const holdings: ERC1155Holding[] = [];

  for (const contract of knownERC1155) {
    const url = `https://api.polygonscan.com/api?module=account&action=token1155tx&contractaddress=${contract}&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${env.POLYGONSCAN_API_KEY}`;

    const response = await fetch(url);

    const body = await response.json();

    if (body.status === '1') {
      const holdingsForContract: {
        tokenID: string;
        tokenValue: string;
        tokenName: string;
      }[] = body.result;

      for (const holding of holdingsForContract) {
        if (Number(holding.tokenValue) > 0) {
          holdings.push({
            contract: contract,
            tokenId: holding.tokenID,
            amount: holding.tokenValue,
          });
        }
      }
    }
  }

  return Promise.resolve(holdings);
}
