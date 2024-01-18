import { useTargecyContext, cloneCredential, useCredentials, useCredentialsStatistics } from '@targecy/sdk';
import { useState } from 'react';
import { useSignMessage } from 'wagmi';

import { NoWalletConnected } from '~/components/shared/Wallet/components/NoWalletConnected';
import { useWallet } from '~/hooks';
import { triggerSweetAlert } from '~/utils/alerts';
import { backendTrpcClient } from '~/utils/trpc';

const Credentials = () => {
  const { context } = useTargecyContext();
  const { credentials, setCredentials } = useCredentials(context);
  const credentialsStatistics = useCredentialsStatistics(context);
  const { isConnected, address } = useWallet();
  const { signMessageAsync } = useSignMessage();
  const [fetchingCredentials, setFetchingCredentials] = useState(false);
  const [credentialsFetched, setCredentialsFetched] = useState(false);

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
    <>
      <div className="mb-8 grid grid-cols-2 gap-8">
        <div className="panel h-full w-full sm:col-span-2 lg:col-span-1">
          <div className="mb-5 flex justify-between dark:text-white-light">
            <h5 className="text-lg font-semibold ">My Wallet</h5>
          </div>
          <div className="grid gap-8 text-sm font-bold text-[#515365] sm:grid-cols-2">
            <div>
              <div>
                <div>Public On-Chain Data Credentials</div>
                <div className="text-lg text-primary">{credentialsStatistics.public}</div>
              </div>
            </div>
            <div>
              <div>
                <div>Behaviour Data Credentials</div>
                <div className="text-lg text-primary">{credentialsStatistics.behaviour}</div>
              </div>
            </div>

            <div>
              <div>
                <div>Private Data Credentials</div>
                <div className="text-lg text-primary">{credentialsStatistics.private} </div>
              </div>
            </div>

            <div>
              <div>
                <div>Total</div>
                <div className="text-lg text-success ">{credentialsStatistics.total} </div>
              </div>
            </div>
          </div>
        </div>
        <div className="panel h-full w-full sm:col-span-2 lg:col-span-1">
          <div className="mb-5 flex justify-between dark:text-white-light">
            <h5 className="text-lg font-semibold ">Identity Credential</h5>
          </div>
          <div className="text-sm font-bold text-[#515365] sm:grid-cols-2">
            <div>
              <div>
                <div>Type</div>
                <div className="text-lg text-white">{context.userIdentity?.credential.type}</div>
              </div>
              <div>
                <div>DID</div>
                <div className="text-lg text-white">{context.userIdentity?.did.id}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="panel">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <h5 className="text-2xl font-semibold text-primary">Credentials</h5>

          {isConnected ? (
            !credentialsFetched && (
              <button
                disabled={fetchingCredentials}
                className="btn btn-primary !mt-6"
                onClick={() => {
                  setFetchingCredentials(true);
                  setCredentialsFetched(true);
                  getPublicCredentials()
                    .then(() => triggerSweetAlert('Public-data credentials retrieved successfully.', 'success'))
                    .catch(() => triggerSweetAlert('Error retrieving public-data credentials.', 'error'));
                }}>
                {fetchingCredentials ? 'Fetching Credentials...' : 'Fetch public-data credentials'}
              </button>
            )
          ) : (
            <NoWalletConnected caption="Please connect Wallet"></NoWalletConnected>
          )}
        </div>
        <div>
          <div className="mb-5">
            {/* Identity Credential */}

            {/* Misc credentials */}
            {credentials.map((credential) => (
              <div
                key={credential.id}
                className="m-3 w-[50rem] rounded border border-white-light bg-white shadow-[4px_6px_10px_-3px_#bfc9d4] dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none">
                <div className="w-full px-6 py-7">
                  <h5 className="mb-4 text-xl font-semibold text-secondary">
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
            {!credentials.length && !credentialsFetched && (
              <label className="mt-4">
                You have not fetched any credentials yet. Please click on the button above to fetch your credentials.
              </label>
            )}
            {!credentials.length && credentialsFetched && (
              <label className="mt-4">
                We could not find any credentials for this wallet. Please try again in the future or request us for
                specific credentials.
              </label>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Credentials;
