'use client';

import { useCredentialsStatistics, useTargecyContext } from '@targecy/sdk/src/hooks';

import Statistic from './Statistic';

export default function MyWallet() {
  const { context } = useTargecyContext();
  const credentialsStatistics = useCredentialsStatistics(context);

  return (
    <div className="mb-3 flex h-1/2 flex-row justify-between">
      <div className="panel h-full w-full sm:col-span-2 lg:col-span-1">
        <div className="mb-5 flex justify-between dark:text-white-light">
          <h5 className="text-lg font-semibold">My Wallet</h5>
        </div>
        <div className="grid gap-8 text-sm font-bold text-[#515365] sm:grid-cols-2">
          <Statistic title="Public On-Chain Data Credentials" statistic={credentialsStatistics.public} />
          <Statistic title="Behaviour Data Credentials" statistic={credentialsStatistics.behaviour} />
          <Statistic title="Private Data Credentials" statistic={credentialsStatistics.private} />
          <Statistic variant="success" title="Total" statistic={credentialsStatistics.total} />
        </div>
      </div>
    </div>
  );
}
