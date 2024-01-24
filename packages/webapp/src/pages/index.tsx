import { useEffect, useState } from 'react';

import ActivityLog from '~/components/ActivityLog';
import MyAdvertisingAccount from '~/components/MyAdvertisingAccount';
import MyWallet from '~/components/MyWallet';
import NetworkStatistics from '~/components/NetworkStatistics';
import { useAppDispatch } from '~/hooks';
import { setPageTitle } from '~/store/themeConfigSlice';

const Index = () => {
  const [mounted, setMounted] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setPageTitle('Home'));
  });

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

export default Index;
