import { useContractRead } from 'wagmi';

import { targecyContractAddress } from '~/constants/contracts.constants';
import abi from '~/generated/abis/Targecy.json';

export const useReadFromContract = (functionName: string) => {
  const { data } = useContractRead({
    address: targecyContractAddress,
    abi,
    functionName,
  });

  return data?.toString();
};
