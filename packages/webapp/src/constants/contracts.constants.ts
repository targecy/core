import { ethers } from "ethers";
import { z } from "zod";


export const targecyContractAddress =  process.env.NEXT_PUBLIC_TARGECY_CONTRACT_ADDRESS ?? ethers.constants.AddressZero;
if (targecyContractAddress === ethers.constants.AddressZero) {
  throw new Error('Missing NEXT_PUBLIC_TARGECY_CONTRACT_ADDRESS');
}
