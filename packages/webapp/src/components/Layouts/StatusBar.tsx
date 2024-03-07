import { CloseOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useCookie } from 'react-use';

import { useGetAdvertiserQuery, useGetBudgetQuery } from '~/generated/graphql.types';
import { useWallet } from '~/hooks';
import { SessionData } from '~/pages/api/auth/[...nextauth]';
import { UserRole } from '~/utils/preferences';

export const StatusBar = () => {
  const [showComponent, setShowComponent] = useState(true);

  const wallet = useWallet();
  const sessionData = useSession().data?.user as SessionData | null;

  const { data: budget, isLoading: isBudgetLoading } = useGetBudgetQuery({
    id: wallet.address || '',
  });

  const { data: advertiserData, isLoading: isAdvertiserDataLoading } = useGetAdvertiserQuery({
    id: wallet.address || '',
  });

  const isDataLoading = isBudgetLoading || isAdvertiserDataLoading;

  const [cookieValue] = useCookie('userRoles');

  const [hasMultipleRoles, setHasMultipleRoles] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [isAdvertiser, setIsAdvertiser] = useState(false);
  const [isPublisher, setIsPublisher] = useState(false);

  useEffect(() => {
    const userRoles = JSON.parse(cookieValue ?? '[]') as UserRole[];
    setHasMultipleRoles(userRoles.length > 1);
    setIsUser(userRoles.includes('user'));
    setIsAdvertiser(userRoles.includes('advertiser'));
    setIsPublisher(userRoles.includes('publisher'));
  }, [cookieValue]);

  if (isDataLoading || !showComponent) return null;

  let content: React.ReactNode;

  if (isUser) {
    content = (
      <span className="flex flex-grow flex-wrap justify-center gap-1 text-center">
        Enhance your{' '}
        <Link className="font-bold" href="/credentials" target="_blank">
          {' '}
          profile
        </Link>{' '}
        and boost your rewards!
      </span>
    );
  } else if (isAdvertiser && !budget?.budget?.remainingBudget) {
    content = (
      <span className="flex flex-grow flex-wrap justify-center gap-1 text-center text-warning">
        Seems that your remaining budget is 0,{' '}
        <b
          className="ml-1 mr-1 cursor-pointer"
          onClick={() => document && (document.getElementById('budgetModal') as HTMLDialogElement).showModal()}>
          fund your budget
        </b>{' '}
        to keep your ads running!
      </span>
    );
  } else if (isAdvertiser && !advertiserData?.advertiser?.adsQuantity) {
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
  } else if (isPublisher) {
    content = (
      <span className="flex flex-grow flex-wrap justify-center gap-1 text-center">
        Customize your ad space in our{' '}
        <Link className="font-bold" href="/wizard" target="_blank">
          {' '}
          wizard
        </Link>{' '}
        to match your style!
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
