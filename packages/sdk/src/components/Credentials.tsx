import { type W3CCredential } from '@0xpolygonid/js-sdk';
import { useContext, useEffect, useState } from 'react';
import { requestPublicCredentials, useCredentials } from '..';
import { TargecyBaseProps, TargecyComponent, TargecyServicesContext } from './misc/Context';
import { useAccount, useConnect, useContractWrite, useSignMessage } from 'wagmi';
import { targecyContractAddress } from '../constants/chain';
const abi = require('../generated/abis/localhost_Targecy.json');
const Credentials = () => {
  const context = useContext(TargecyServicesContext);
  const credentials = useCredentials(context);

  const { signMessageAsync } = useSignMessage({ message: 'public.credentials' });
  const { writeAsync: consumeAdAsync } = useContractWrite({
    address: targecyContractAddress,
    abi,
    functionName: 'consumeAd',
  });

  const { address } = useAccount();
  console.log(address);

  const [requestCredentialTrigger, setRequestCredentialTrigger] = useState(false);

  useEffect(() => {
    if (requestCredentialTrigger) {
      try {
        requestPublicCredentials(context.userIdentity?.did.id, address, context.zkServices).then(() => {
          setRequestCredentialTrigger(false);
        });
      } catch (e) {
        console.error(e);
        setRequestCredentialTrigger(false);
      }
    }
  }, [requestCredentialTrigger]);

  return (
    <div>
      <div>
        <div className="mb-2 flex justify-between	align-middle">
          <h5 className="text-md align-middle font-semibold dark:text-white-light">Credentials</h5>

          {credentials?.filter(
            (credential: W3CCredential) => true
            // credential.credentialSubject.id?.toString() === 'did:iden3:' + (context.userIdentity?.did.id || '')
          ).length === 0 ? (
            !requestCredentialTrigger ? (
              <p
                className="text-light link hover:text-secondary"
                aria-disabled={!!context.zkServices}
                onClick={() => {
                  setRequestCredentialTrigger(true);
                }}>
                Request public credentials
              </p>
            ) : (
              <p className="opacity-50">Requesting...</p>
            )
          ) : (
            <p className=" text-light link hover:text-secondary " onClick={() => clearCredentials()}>
              Clear
            </p>
          )}
        </div>
        <div>
          {credentials.map((credential: W3CCredential) => (
            <div className="flex flex-row rounded-md border border-primary p-2 mb-2 mt-2" key={credential.id}>
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
  );
};

export type TargecyCredentialsProps = {};

export const TargecyCredentials = (props: TargecyCredentialsProps & TargecyBaseProps) => {
  return (
    <TargecyComponent wagmiConfig={props.wagmiConfig}>
      <Credentials />
    </TargecyComponent>
  );
};
