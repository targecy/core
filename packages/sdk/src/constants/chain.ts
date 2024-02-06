import { zeroAddress } from 'viem';

export const addressZero = zeroAddress;
export const BigNumberZero = 0n;

export const SolidityTypesNames = ['bool', 'int', 'uint', 'address', 'bytes', 'string', 'uint256', 'int256'] as const;
export type SolidityTypes = (typeof SolidityTypesNames)[number];

export const isSolidityType = (type: string): type is SolidityTypes => {
  return SolidityTypesNames.includes(type as SolidityTypes);
};
