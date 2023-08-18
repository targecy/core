import { Skeleton, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useBlockNumber, useContractRead } from 'wagmi';
import { Targecy__factory } from '~common/generated/contract-types';
import { useWallet } from '~~/hooks';

export const Home = () => {
  const wallet = useWallet();

  const { data: adsQuantity } = useContractRead({
    address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    abi: Targecy__factory.abi,
    functionName: '_adId',
  });

  const { data: targetGroupsQuantity } = useContractRead({
    address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    abi: Targecy__factory.abi,
    functionName: '_targetGroupId',
  });

  const { data: zkpRequestsQuantity } = useContractRead({
    address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    abi: Targecy__factory.abi,
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
      <div className="flex w-1/3 flex-col p-2 m-3">
        <div className="panel">
          <h5 className="text-md font-semibold dark:text-white-light">Ads</h5>
          {adsQuantity ? (
            <h5 className="text-3xl font-semibold dark:text-white">{adsQuantity.toString()}</h5>
          ) : (
            <Skeleton />
          )}
        </div>
      </div>
      
      <div className="flex w-1/3 flex-col p-2 m-3">
        <div className="panel">
          <h5 className="text-md font-semibold dark:text-white-light">Target Groups</h5>
          {targetGroupsQuantity ? (
            <h5 className="text-3xl font-semibold dark:text-white">{targetGroupsQuantity.toString()}</h5>
          ) : (
            <Skeleton />
          )}
        </div>
      </div>

      <div className="flex w-1/3 flex-col p-2 m-3">
        <div className="panel">
          <h5 className="text-md font-semibold dark:text-white-light">ZKP Requests</h5>
          {zkpRequestsQuantity ? (
            <h5 className="text-3xl font-semibold dark:text-white">{zkpRequestsQuantity.toString()}</h5>
          ) : (
            <Skeleton />
          )}
        </div>
      </div>
    </div>
  );
};
