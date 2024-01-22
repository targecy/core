import { useEffect, useState } from 'react';

import ActivityLog from './ActivityLog';
import MyAdvertisingAccount from './MyAdvertisingAccount';
import MyWallet from './MyWallet';
import NetworkStatistics from './NetworkStatistics';

export const Home = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // @todo(kevin): add loading state using skeletons and suspense
  if (!mounted) return <></>;

  return (
    <>
      <div className="m-1 flex h-1/4 flex-row justify-between">
        <NetworkStatistics />
      </div>
      <div className="m-1 flex h-3/4 flex-row justify-between">
        <div className="flex w-full">
          <div className="m-3 flex w-1/3 flex-col">
            <ActivityLog />
          </div>
          <div className="m-3 flex w-2/3 flex-col">
            <MyWallet />
            <MyAdvertisingAccount />
          </div>
        </div>
      </div>
    </>
  );
};
