import { createWalletClient, custom } from 'viem';
import { polygonMumbai } from 'viem/chains';

import { backendTrpcClient, cloneCredential } from '../utils';
import { environment } from '../utils/context';
import { useState } from 'react';
import { useCredentials, useTargecyContext } from '../hooks';

export type BaseAdStyling = {
  width?: string; // in pixels
  height?: string; // in pixels
  backgroundColor?: string;
  titleColor?: string;
  subtitleColor?: string;
  borderRadius?: string; // in pixels
};

export type BaseAdParams = {
  id: string;

  title: string;
  description: string;
  image: string;

  isLoading?: boolean;
  env: environment;

  styling?: BaseAdStyling;
};

const signMessage = 'Sign this message to verify your wallet and start earning rewards.'; // @todo (Martin): Should add a nonce?

export const BaseAd = ({ id, title, description, image, isLoading, styling, env }: BaseAdParams) => {
  const { context, initialized } = useTargecyContext();
  const { credentials, setCredentials } = useCredentials(context);
  const [fetchingCredentials, setFetchingCredentials] = useState(false);
  const [credentialsFetched, setCredentialsFetched] = useState(false);

  const signAndEarnRewards = () => {
    const client = createWalletClient({
      chain: polygonMumbai,
      transport: custom(window.ethereum),
    });
    client.getAddresses().then(([account]) =>
      client
        .signMessage({
          account,
          message: signMessage,
        })
        .then((signature) => {
          // Onboarding User
          if (!initialized) throw new Error('Context not initialized');
          const did = context.userIdentity?.did.id;
          if (!did) throw new Error('Identity not initialized');
          setFetchingCredentials(true);

          backendTrpcClient(env)
            .credentials.getPublicCredentials.query({ message: signMessage, signature, did, wallet: account })
            .then((credentials: any) => {
              setCredentials(credentials.map(cloneCredential));
              setFetchingCredentials(false);
              setCredentialsFetched(true);

              // @todo (Martin): refresh ad?
            })
            .catch(() => {
              setFetchingCredentials(false);
              setCredentialsFetched(true);
              console.log('Error retrieving public-data credentials.');
            });
        })
        .catch(() => {
          console.log('Error signing message.');
        })
    );
  };

  return (
    <div className="max-w-full">
      <div className="w-full h-full shadow-xl" key={id}>
        <img style={{ objectFit: 'cover', width: '100%', height: '50%' }} src={image} />
        <div className="card-body overflow-hidden">
          <h1 className="card-title text-base" style={{ color: styling?.titleColor }}>
            {title}
          </h1>
          <p className="text-xs" style={{ color: styling?.subtitleColor }}>
            {description}
          </p>

          {!credentialsFetched &&
            (fetchingCredentials ? (
              <label>Fetching...</label>
            ) : (
              !credentials.length && (
                <label
                  onClick={signAndEarnRewards}
                  className="mt-2 mb-1"
                  style={{
                    cursor: 'pointer',
                  }}>
                  Verify wallet and start earning rewards
                </label>
              )
            ))}
        </div>
      </div>
    </div>
  );
};
