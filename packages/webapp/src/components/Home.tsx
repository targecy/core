import { useEffect, useState } from 'react';
import { useContractRead } from 'wagmi';

import * as abi from '../generated/abis/Targecy.json';

import { targecyContractAddress } from '~~/constants/contracts.constants';

export const Home = () => {
  const { data: adsQuantity } = useContractRead({
    address: targecyContractAddress,
    abi,
    functionName: '_adId',
  });
  

  const { data: targetGroupsQuantity } = useContractRead({
    address: targecyContractAddress,
    abi,
    functionName: '_targetGroupId',
  });

  const { data: zkpRequestsQuantity } = useContractRead({
    address: targecyContractAddress,
    abi,
    functionName: '_zkRequestId',
  });

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <></>;

  return (
    <div>
      <label className="ml-5 mt-5">Network</label>

      <div className="flex">
        {/* create 3 columns with panels  */}
        <div className="m-3 flex w-1/3 flex-col p-2">
          <div className="panel">
            <h5 className="text-md font-semibold dark:text-white-light">Ads</h5>
            <h5 className="text-3xl font-semibold dark:text-white">{adsQuantity?.toString() ?? '0'}</h5>
          </div>
        </div>

        <div className="m-3 flex w-1/3 flex-col p-2">
          <div className="panel">
            <h5 className="text-md font-semibold dark:text-white-light">Users</h5>

            <h5 className="text-3xl font-semibold dark:text-white">{targetGroupsQuantity?.toString() || '0'}</h5>
          </div>
        </div>

        <div className="m-3 flex w-1/3 flex-col p-2">
          <div className="panel">
            <h5 className="text-md font-semibold dark:text-white-light">Issued credentials</h5>
            <h5 className="text-3xl font-semibold dark:text-white">{zkpRequestsQuantity?.toString() || '0'}</h5>
          </div>
        </div>
      </div>

      <label className="ml-5 mt-5">Profile</label>

      <div className="flex">
        {/* create 3 columns with panels  */}
        <div className="m-3 flex w-1/3 flex-col p-2">
          <div className="panel">
            <h5 className="text-md font-semibold dark:text-white-light">Public-data credentials</h5>
            <h5 className="text-3xl font-semibold dark:text-white">0</h5>
          </div>
        </div>

        <div className="m-3 flex w-1/3 flex-col p-2">
          <div className="panel">
            <h5 className="text-md font-semibold dark:text-white-light">Private-data credentials</h5>
            <h5 className="text-3xl font-semibold dark:text-white">0</h5>
          </div>
        </div>

        <div className="m-3 flex w-1/3 flex-col p-2">
          <div className="panel">
            <h5 className="text-md font-semibold dark:text-white-light">Total Rewards</h5>
            <h5 className="text-3xl font-semibold dark:text-white">0</h5>
          </div>
        </div>
      </div>

      <label className="ml-5 mt-5">Advertiser profile</label>

      <div className="flex">
        {/* create 3 columns with panels  */}
        <div className="m-3 flex w-1/3 flex-col p-2">
          <div className="panel">
            <h5 className="text-md font-semibold dark:text-white-light">Campaigns</h5>
            <h5 className="text-3xl font-semibold dark:text-white">0</h5>
          </div>
        </div>

        <div className="m-3 flex w-1/3 flex-col p-2">
          <div className="panel">
            <h5 className="text-md font-semibold dark:text-white-light">TVL (Total value locked)</h5>
            <h5 className="text-3xl font-semibold dark:text-white">0</h5>
          </div>
        </div>

        <div className="m-3 flex w-1/3 flex-col p-2">
          <div className="panel">
            <h5 className="text-md font-semibold dark:text-white-light">ROI</h5>
            <h5 className="text-3xl font-semibold dark:text-white">0</h5>
          </div>
        </div>
      </div>
    </div>
  );
};
