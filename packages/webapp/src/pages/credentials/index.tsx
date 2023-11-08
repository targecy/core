import { W3CCredential } from '@0xpolygonid/js-sdk';
import { TargecyComponent, useTargecyContext, cloneCredential, useCredentials } from '@targecy/sdk';
import { useState } from 'react';
import { useConfig, useSignMessage } from 'wagmi';

import { NoWalletConnected } from '~~/components/shared/Wallet/components/NoWalletConnected';
import { useWallet } from '~~/hooks';
import { triggerSweetAlert } from '~~/utils/alerts';
import { backendTrpcClient } from '~~/utils/trpc';

const Credentials = () => {
  const { context, initialized } = useTargecyContext();
  const { credentials, setCredentials } = useCredentials(context);
  const { isConnected, address } = useWallet();
  const { signMessageAsync } = useSignMessage();
  const [fetchingCredentials, setFetchingCredentials] = useState(false);
  const wagmiConfig = useConfig();

  const getPublicCredentials = () =>
    signMessageAsync({ message: 'public.credentials' }).then((signature) =>
      backendTrpcClient.credentials.getPublicCredentials
        .query({
          signature,
          wallet: address as `0x${string}`,
          did: context.userIdentity?.did.id || '',
        })
        .then((res) => {
          setCredentials(res.map(cloneCredential));
          setFetchingCredentials(false);
        })
    );

  if (!context.userIdentity) return <div>Loading...</div>;

  return (
    <TargecyComponent wagmiConfig={wagmiConfig}>
      <div className="panel">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between p-2">
          <h5 className="text-lg font-semibold dark:text-white-light">Credentials</h5>

          {isConnected ? (
            <button
              disabled={fetchingCredentials}
              className="btn btn-primary !mt-6"
              onClick={() => {
                setFetchingCredentials(true);
                getPublicCredentials()
                  .then(() => triggerSweetAlert('Public-data credentials retrieved successfully.', 'success'))
                  .catch(() => triggerSweetAlert('Error retrieving public-data credentials.', 'error'));
              }}>
              {fetchingCredentials ? 'Fetching Credentials...' : 'Fetch public-data credentials'}
            </button>
          ) : (
            <NoWalletConnected caption="Please connect Wallet"></NoWalletConnected>
          )}
        </div>
        <div>
          <div className="card-body">
            <div className="mb-5 flex">
              {/* Identity Credential */}
              <div className="m-3 w-[50rem] rounded border border-white-light bg-white shadow-[4px_6px_10px_-3px_#bfc9d4] dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none">
                <div className="py-7 px-6 w-full" >
                  <h5 className="mb-4 text-xl font-semibold text-[#3b3f5c] dark:text-white-light">
                    Identity Credential
                  </h5>
                  <p className="text-white-dark">{context.userIdentity?.did.id}</p>
                </div>
              </div>

              {/* Misc credentials */}
              {credentials.map((credential: W3CCredential) => (
                <div
                  key={credential.id}
                  className="m-3 w-[50rem] rounded border border-white-light bg-white shadow-[4px_6px_10px_-3px_#bfc9d4] dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none">
                  <div className="py-7 px-6 w-full">
                    <h5 className="mb-4 text-xl font-semibold text-[#3b3f5c] dark:text-white-light">
                      {credential.type.filter((type: string) => type !== 'VerifiableCredential')}
                    </h5>
                    <p className="text-white-dark">
                      Expiration: {credential.expirationDate && new Date(credential.expirationDate).toUTCString()}
                    </p>

                    {Object.entries(credential.credentialSubject)
                      .filter((entry: any[2]) => entry[0] !== 'id' && entry[0] !== 'type')
                      .map((entry: any[2]) => (
                        <p key={entry[0]} className="text-white-dark">
                          <b>{entry[0]}</b>: {entry[1].toString()}
                        </p>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </TargecyComponent>
  );
};

export default Credentials;
