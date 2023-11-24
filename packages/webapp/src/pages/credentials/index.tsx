import { W3CCredential } from '@0xpolygonid/js-sdk';
import { useTargecyContext, cloneCredential, useCredentials } from '@targecy/sdk';
import { useState } from 'react';
import { useSignMessage } from 'wagmi';

import { NoWalletConnected } from '~~/components/shared/Wallet/components/NoWalletConnected';
import { useWallet } from '~~/hooks';
import { triggerSweetAlert } from '~~/utils/alerts';
import { backendTrpcClient } from '~~/utils/trpc';

const Credentials = () => {
  const { context } = useTargecyContext();
  const { credentials, setCredentials } = useCredentials(context);
  const { isConnected, address } = useWallet();
  const { signMessageAsync } = useSignMessage();
  const [fetchingCredentials, setFetchingCredentials] = useState(false);

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
    <div className="panel">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between p-2">
        <h5 className="text-2xl font-semibold text-primary">Credentials</h5>

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
        <div className="mb-5">
          <div className="mb-3 ml-3 mr-3 grid grid-cols-3 gap-5">
            <div className="col-span-2">
              <div className="h-[8rem] rounded border border-white-light bg-white shadow-[4px_6px_10px_-3px_#bfc9d4] dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none">
                <div className="w-full px-6 py-7">
                  <h5 className="mb-4 text-xl font-semibold text-secondary">Identity Credential</h5>
                  <p className="text-white-dark">{context.userIdentity?.did.id}</p>
                </div>
              </div>
            </div>
            <div className="col-span-1">
              <div className="panel h-[8rem] flex-col gap-4 border border-white-light bg-white shadow-[4px_6px_10px_-3px_#bfc9d4] dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none">
                <div className="mb-4 flex flex-row justify-between">
                  <h5 className=" text-2xl font-semibold text-secondary">Total</h5>
                  <h5 className=" text-2xl font-semibold dark:text-white">{credentials.length}</h5>
                </div>
                <div className="flex flex-row justify-between">
                  <h5 className="text-2xl font-semibold text-secondary">Public</h5>
                  <h5 className="text-2xl font-semibold dark:text-white">{credentials.length}</h5>
                </div>
              </div>
            </div>
          </div>
          {/* Identity Credential */}

          {/* Misc credentials */}
          {credentials.map((credential: W3CCredential) => (
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
        </div>
      </div>
    </div>
  );
};

export default Credentials;
