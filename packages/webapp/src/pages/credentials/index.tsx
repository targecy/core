import { W3CCredential } from '@0xpolygonid/js-sdk';
import { cloneCredential, useCredentials } from '@targecy/sdk';
import { useContext, useState } from 'react';

import { TargecyServicesContext } from '../../../../sdk/src/components/misc/Context';

import { NoWalletConnected } from '~~/components/shared/Wallet/components/NoWalletConnected';
import { useWallet } from '~~/hooks';
import { backendTrpcClient } from '~~/utils/trpc';
import { useSignMessage } from 'wagmi';

const Credentials = () => {
  const context = useContext(TargecyServicesContext);
  const { credentials, setCredentials } = useCredentials(context);
  const { isConnected, address } = useWallet();
  const { signMessageAsync } = useSignMessage();
  const [procesingAd, setProcesingAd] = useState(false);

  const getPublicCredentials = () =>
    signMessageAsync({ message: 'public.credentials' }).then((signature) =>
      backendTrpcClient.credentials.getPublicCredentials
        .query({
          signature,
          wallet: address as `0x${string}`,
          did: context.userIdentity?.did.id || '',
        })
        .then((res) => setCredentials(res.map(cloneCredential)))
    );

  return (
    <>
      <div className="panel">
        <div className="mb-5 flex items-center justify-between p-2">
          <h5 className="text-lg font-semibold dark:text-white-light">Credentials</h5>

          {isConnected ? (
            <button
              disabled={procesingAd}
              className="btn btn-primary !mt-6"
              onClick={() => {
                getPublicCredentials();
              }}>
              {procesingAd ? 'Fetching Credentials...' : 'Fetch public-data credentials'}
            </button>
          ) : (
            <NoWalletConnected caption="Please connect Wallet"></NoWalletConnected>
          )}
        </div>
        <div>
          <div className="card-body">
            <div className="flex">
              <div>
                {credentials.map((credential: W3CCredential) => (
                  <div className="mb-2 mt-2 flex flex-row rounded-md border border-primary p-2" key={credential.id}>
                    <div>
                      <h1 className="font-semibold">Credential</h1>
                      <h1>{credential.type.filter((type: string) => type !== 'VerifiableCredential')}</h1>
                      <h1 color="text.secondary">
                        Expiration: {credential.expirationDate && new Date(credential.expirationDate).toUTCString()}
                      </h1>
                      {/* <h1>Schema: {getSchemaHashFromCredential(credential).toString()}</h1> */}
                      <h1>
                        {Object.entries(credential.credentialSubject)
                          .filter((entry: any[2]) => entry[0] !== 'id' && entry[0] !== 'type')
                          .map((entry: any[2]) => (
                            <span key={entry[0]}>
                              <span>
                                <b>{entry[0]}</b>: {entry[1].toString()}
                              </span>
                              <br />
                            </span>
                          ))}
                      </h1>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Credentials;
