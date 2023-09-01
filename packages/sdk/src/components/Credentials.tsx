import { type W3CCredential } from '@0xpolygonid/js-sdk';
import { useContext, useEffect, useState } from 'react';
import { requestKYCCredential, useCredentials } from '..';
import { TargecyComponent, TargecyServicesContext } from './misc/Context';

const Credentials = () => {
  const context = useContext(TargecyServicesContext);
  const credentials = useCredentials(context);

  const [requestCredentialTrigger, setRequestCredentialTrigger] = useState(false);

  useEffect(() => {
    if (requestCredentialTrigger) {
      requestKYCCredential(context.zkServices, context.userIdentity?.did.id).then(() => {
        setRequestCredentialTrigger(false);
      });
    }
  }, [requestCredentialTrigger, context]);

  const clearCredentials = () => {
    credentials.forEach((c) => context.zkServices?.credWallet.remove(c.id));
    localStorage.removeItem('credentials');
  };

  return (
    <TargecyComponent>
      <div>
        <div className="mb-2 flex justify-between	align-middle">
          <h5 className="text-md align-middle font-semibold dark:text-white-light">Credentials</h5>

          {credentials?.filter(
            (credential: W3CCredential) =>
              credential.credentialSubject.id?.toString() === 'did:iden3:' + (context.userIdentity?.did.id || '')
          ).length === 0 ? (
            !requestCredentialTrigger ? (
              <p
                className="text-light link hover:text-secondary"
                aria-disabled={!!context.zkServices}
                onClick={() => setRequestCredentialTrigger(true)}>
                Request demo credential
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
    </TargecyComponent>
  );
};

export const TargecyCredentials = () => {
  return (
    <TargecyComponent>
      <Credentials />
    </TargecyComponent>
  );
};
