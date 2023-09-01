import { useAsync } from 'react-use';
import { useContext, useEffect, useState } from 'react';
import { useCredentials } from '../hooks/useCredentials';
import { useAds } from '../hooks/useAds';
import { generateProofAndConsumeAd, getValidCredentialByProofRequest } from '..';
import { TargecyComponent, TargecyServicesContext } from './misc/Context';
import { useAd } from '../hooks/useAd';
import { targecyContractAddress } from '../constants/chain';
import { Targecy__factory } from '../contract-types';
import { Config, WagmiConfig, WagmiConfigProps, useAccount, useConfig, useContractWrite } from 'wagmi';
import { waitForTransaction } from '@wagmi/core';
import { NoWalletConnected } from './misc/NoWalletConnected';
import { Ad, useGetAllAdsQuery } from '../generated/graphql.types';

const AdComponent = () => {
  const context = useContext(TargecyServicesContext);
  const { ad, isLoading } = useAd(context);
  const credentials = useCredentials(context);
  const { isConnected } = useAccount();

  const [requestRewardsTrigger, setRequestRewardsTrigger] = useState<{ trigger: boolean; ad?: Ad }>({
    trigger: false,
    ad: undefined,
  });

  const { writeAsync: consumeAdAsync } = useContractWrite({
    address: targecyContractAddress,
    abi: Targecy__factory.abi,
    functionName: 'consumeAd',
  });

  useEffect(() => {
    if (requestRewardsTrigger.trigger && requestRewardsTrigger.ad) {
      generateProofAndConsumeAd(
        context,
        credentials,
        requestRewardsTrigger.ad,
        consumeAdAsync,
        waitForTransaction
      ).finally(() => {
        setRequestRewardsTrigger({ trigger: false, ad: undefined });
      });
    }
  }, [requestRewardsTrigger]);

  if (isLoading) return <div>Loading...</div>;
  if (!ad) return <div>No Ad Found</div>;
  return (
    <div>
      <div className="card w-96 bg-white shadow-xl dark:bg-black" key={ad.ad.id}>
        <figure>
          <img src={ad.metadata.image} />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{ad.metadata.title}</h2>
          <p>{ad.metadata.description}</p>

          <div className="card-actions m-1 justify-end">
            {isConnected ? (
              <button
                className="btn btn-secondary w-full"
                disabled={requestRewardsTrigger.trigger}
                onClick={() => {
                  setRequestRewardsTrigger({ trigger: true, ad: ad.ad });
                }}>
                {requestRewardsTrigger.trigger ? 'Requesting...' : 'Request Rewards'}
              </button>
            ) : (
              <NoWalletConnected caption="Please connect Wallet"></NoWalletConnected>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const TargecyAd = () => {
  return (
    <TargecyComponent>
      <AdComponent />
    </TargecyComponent>
  );
};
