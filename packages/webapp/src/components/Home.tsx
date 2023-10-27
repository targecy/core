import { useEffect, useState } from 'react';
import { useContractRead } from 'wagmi';

import * as abi from '../generated/abis/localhost_Targecy_Implementation.json';

import { targecyContractAddress } from '~~/constants/contracts.constants';
import { useWallet } from '~~/hooks';

export const Home = () => {
  const wallet = useWallet();

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
    <div className="flex">
      {/* create 3 columns with panels  */}
      <div className="m-3 flex w-1/3 flex-col p-2">
        <div className="panel">
          <h5 className="text-md font-semibold dark:text-white-light">Ads</h5>
          <h5 className="text-3xl font-semibold dark:text-white">{adsQuantity?.toString() ?? '2'}</h5>
        </div>
      </div>

      <div className="m-3 flex w-1/3 flex-col p-2">
        <div className="panel">
          <h5 className="text-md font-semibold dark:text-white-light">Target Groups</h5>

          <h5 className="text-3xl font-semibold dark:text-white">{targetGroupsQuantity?.toString() || '3'}</h5>
        </div>
      </div>

      <div className="m-3 flex w-1/3 flex-col p-2">
        <div className="panel">
          <h5 className="text-md font-semibold dark:text-white-light">ZKP Requests</h5>
          <h5 className="text-3xl font-semibold dark:text-white">{zkpRequestsQuantity?.toString() || '5'}</h5>
        </div>
      </div>
    </div>
  );
};
