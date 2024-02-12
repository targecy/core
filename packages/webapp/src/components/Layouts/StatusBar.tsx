import { CloseOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useState } from 'react';

import { useGetAdvertiserQuery, useGetBudgetQuery } from '~/generated/graphql.types';
import { useWallet } from '~/hooks';

export const StatusBar = () => {
  const [showComponent, setShowComponent] = useState(true);

  const wallet = useWallet();

  const { data: budget, isLoading: isBudgetLoading } = useGetBudgetQuery({
    id: wallet.address || '',
  });

  const { data: advertiserData, isLoading: isAdvertiserDataLoading } = useGetAdvertiserQuery({
    id: wallet.address || '',
  });

  const isDataLoading = isBudgetLoading || isAdvertiserDataLoading;

  if (isDataLoading || !showComponent) return null;

  let content: React.ReactNode;

  if (!budget?.budget?.remainingBudget) {
    content = (
      <span className="flex flex-grow flex-wrap justify-center gap-1 text-center">
        Seems that your remaining budget is 0,{' '}
        <b
          className="cursor-pointer"
          onClick={() => document && (document.getElementById('budgetModal') as HTMLDialogElement).showModal()}>
          fund your budget
        </b>{' '}
        to keep your ads running!
      </span>
    );
  } else if (!advertiserData?.advertiser?.adsQuantity) {
    content = (
      <span className="flex flex-grow flex-wrap justify-center gap-1 text-center">
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
    <div className="p-6 pb-1 text-center">
      <div className="flex w-full items-center justify-between whitespace-nowrap rounded-md border border-warning p-2 dark:bg-black dark:text-white sm:w-full md:w-full">
        <div className="flex flex-grow flex-wrap justify-center">{content}</div>
        <CloseOutlined
          className="cursor-pointer text-warning hover:text-secondary"
          onClick={() => setShowComponent(false)}
        />
      </div>
    </div>
  ) : null;
};
