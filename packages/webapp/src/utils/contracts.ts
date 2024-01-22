import { useContractQuantityData } from '~/hooks/useContractData';

export const getQuantityData = (functionName: string) => {
  const quantityData = useContractQuantityData(functionName);
};
