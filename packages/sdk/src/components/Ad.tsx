import { useAsync } from 'react-use';
import { useContext, useEffect, useState } from 'react';
import { useCredentials } from '../hooks/useCredentials';
import { useAds } from '../hooks/useAds';
import { consumeAd, consumeAdThroughRelayer, generateProof } from '..';
import { TargecyBaseProps, TargecyComponent, TargecyServicesContext } from './misc/Context';
import { useAd } from '../hooks/useAd';
import { targecyContractAddress } from '../constants/chain';
import { Targecy__factory } from '../contract-types';
import { Config, WagmiConfig, WagmiConfigProps, useAccount, useConfig, useContractWrite, useSignMessage } from 'wagmi';
import { waitForTransaction } from '@wagmi/core';
import { NoWalletConnected } from './misc/NoWalletConnected';
import { Ad, useGetAllAdsQuery } from '../generated/graphql.types';
import { relayerTrpcClient } from '../utils/trpc';
import { useConnectModal } from '@rainbow-me/rainbowkit';

export type AdParams = {
  useRelayer?: boolean;
};

const AdComponent = (adParams: AdParams) => {
  const context = useContext(TargecyServicesContext);
  const { ad, isLoading } = useAd(context);
  const credentials = useCredentials(context);
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  const { signMessage } = useSignMessage({ message: 'public.credentials' });

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
      const proofs = generateProof(context, credentials, requestRewardsTrigger.ad);

      if (adParams.useRelayer) {
        consumeAdThroughRelayer(proofs, requestRewardsTrigger.ad).finally(() => {
          setRequestRewardsTrigger({ trigger: false, ad: undefined });
        });
      } else {
        consumeAd(proofs, requestRewardsTrigger.ad, consumeAdAsync, waitForTransaction).finally(() => {
          setRequestRewardsTrigger({ trigger: false, ad: undefined });
        });
      }
    }
  }, [requestRewardsTrigger]);

  if (isLoading) return <div>Loading...</div>;
  if (!ad)
    return (
      <div>
        No Ad Found: <label onClick={() => openConnectModal && openConnectModal()}> asd</label>{' '}
        <label onClick={() => signMessage()}>click</label>
      </div>
    );
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

export const TargecyAd = (adParams: AdParams & TargecyBaseProps) => {
  return (
    <TargecyComponent wagmiConfig={adParams.wagmiConfig}>
      <AdComponent useRelayer={adParams.useRelayer} />
    </TargecyComponent>
  );
};
