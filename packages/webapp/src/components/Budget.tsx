import { useGetBudgetQuery } from '~/generated/graphql.types';
import { useWallet } from '~/hooks';

export const Budget = () => {
  const wallet = useWallet();

  const { data, isLoading } = useGetBudgetQuery({
    id: wallet.address || '',
  });

  return <span className="text-gray mr-2">${isLoading ? '...' : data?.budget?.remainingBudget || 0}</span>;
};
