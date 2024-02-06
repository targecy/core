import Link from 'next/link';

import { useGetAdvertiserQuery, useGetBudgetQuery } from '~/generated/graphql.types';
import { useWallet } from '~/hooks';

export const StatusBar = () => {
  const wallet = useWallet();

  const { data: budget, isLoading: isBudgetLoading } = useGetBudgetQuery({
    id: wallet.address || '',
  });

  const { data: advertiserData, isLoading: isAdvertiserDataLoading } = useGetAdvertiserQuery({
    id: wallet.address || '',
  });

  const isDataLoading = isBudgetLoading || isAdvertiserDataLoading;

  if (isDataLoading) return null;

  let content: React.ReactNode;

  if (!budget?.budget?.remainingBudget) {
    content = (
      <span>
        Seems that your remaining budget is 0,{' '}
        <b className="cursor-pointer" onClick={() => document && (document.getElementById('budgetModal') as HTMLDialogElement).showModal()}>
          fund your budget
        </b>{' '}
        to keep your ads running!
      </span>
    );
  } else if (!advertiserData?.advertiser?.adsQuantity) {
    content = (
      <span>
        You do not have any ads yet,{' '}
        <Link className="font-bold" href="/ads/editor" target="_blank">
          {' '}
          create one
        </Link>{' '}
        to start earning rewards!
      </span>
    );
  }

  return content ? (
    <div className="p-6 pb-1">
      <div className="flex w-full items-center justify-center whitespace-nowrap rounded-md border	 border-orange-300  p-2  dark:bg-black dark:text-white">
        {content}
      </div>
    </div>
  ) : null;
};
