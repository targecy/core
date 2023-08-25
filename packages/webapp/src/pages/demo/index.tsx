import { type W3CCredential } from '@0xpolygonid/js-sdk';
import { useEffect, useState } from 'react';
import { useAsync } from 'react-use';
import Swal from 'sweetalert2';
import { useContractWrite } from 'wagmi';

import { useInitUserIdentity, useInitZKServices } from '~/hooks/zk';
import { cloneCredential, generateZKProof, requestKYCCredential } from '~/utils/zk';
import { Targecy__factory } from '~common/generated/contract-types';
import { NoWalletConnected } from '~~/components/shared/Wallet/components/NoWalletConnected';
import { BigNumberZero, addressZero, targecyContractAddress } from '~~/constants/contracts.constants';
import { Ad, useGetAdToShowQuery } from '~~/generated/graphql.types';
import { useWallet } from '~~/hooks';
import { getSchemaHashFromCredential, getValidCredentialByProofRequest } from '~~/utils/zk.utils';

const Demo = () => {
  const ads = useGetAdToShowQuery().data?.ads;
  const [metadata, setMetadata] = useState<{ title?: string; description?: string; image?: string }[]>([]);
  const { isConnected, address } = useWallet();

  useAsync(async () => {
    if (ads) {
      const metadata = [];
      for (const ad of ads) {
        const newMetadata = await fetch(`https://ipfs.io/ipfs/${ad.metadataURI}`);
        const json = await newMetadata.json();
        metadata.push({
          title: json.title,
          description: json.description,
          image: json.image,
        });
      }

      setMetadata(metadata);
    }
  }, [ads]);

  const zkServices = useInitZKServices();
  const userIdentity = useInitUserIdentity(zkServices);

  const [credentials, setCredentials] = useState<W3CCredential[]>([]);
  const [initialized, setInitialized] = useState(false);

  // Save and upload from storage
  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
      const credentialsReceived = JSON.parse(localStorage.getItem('credentials') || '[]');
      setCredentials(credentialsReceived.map(cloneCredential));
    } else {
      if (credentials.length > 0) {
        localStorage.setItem('credentials', JSON.stringify(credentials));
      }
    }
  }, [credentials]);
  // useListCredentials(credentials, setCredentials, zkServices);

  const [requestCredentialTrigger, setRequestCredentialTrigger] = useState(false);

  useEffect(() => {
    if (requestCredentialTrigger) {
      requestKYCCredential(zkServices, userIdentity?.did.id, setCredentials).then(() => {
        setRequestCredentialTrigger(false);
      });
    }
  }, [requestCredentialTrigger, zkServices, userIdentity?.did.id]);

  const { writeAsync: consumeAdAsync } = useContractWrite({
    address: targecyContractAddress,
    abi: Targecy__factory.abi,
    functionName: 'consumeAd',
  });

  const { writeAsync: verifyZKProofAsync } = useContractWrite({
    address: targecyContractAddress,
    abi: Targecy__factory.abi,
    functionName: 'verifyZKProof',
  });

  const generateProofAndConsumeAd = async (ad: Ad) => {
    if (!userIdentity || !zkServices) throw new Error('User or zkServices not initialized');

    let proofs = [];
    for (const targetGroup of ad.targetGroups) {
      for (const proofRequest of targetGroup.zkRequests) {
        const proofCredentialMatch = getValidCredentialByProofRequest(credentials, proofRequest);
        if (!proofCredentialMatch) continue;

        const proof = await generateZKProof(proofCredentialMatch, proofRequest, zkServices, userIdentity?.did);
        proofs.push({ proof, id: proofRequest.id });
      }
      if (proofs.length === targetGroup.zkRequests.length) break;
      else proofs = []; // Will try next target group
    }

    if (proofs.length === 0 && ad.targetGroups.length > 0) {
      await Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 3000,
      }).fire({
        icon: 'error',
        title: 'No valid credentials for this ad',
        padding: '10px 20px',
      });
      return;
    }

    for (const proof of proofs) {
      const verifyProofResponse = await verifyZKProofAsync({
        args: [
          proof.id,
          proof.proof.pub_signals,
          proof.proof.proof.pi_a,
          proof.proof.proof.pi_b,
          proof.proof.proof.pi_c,
        ],
      });

      console.log(verifyProofResponse);
    }

    const consumeAdResponse = await consumeAdAsync({
      args: [
        BigInt(ad.id),
        {
          percentage: BigNumberZero,
          publisherVault: addressZero, // Just for testing
        },
        {
          // requestIds: proofs.map((proof) => proof.id),
          inputs: proofs.map((proof) => proof.proof.pub_signals),
          a: proofs.map((proof) => proof.proof.proof.pi_a),
          b: proofs.map((proof) => proof.proof.proof.pi_b),
          c: proofs.map((proof) => proof.proof.proof.pi_c),
        },
      ],
    });

    console.log(consumeAdResponse);
  };

  return (
    <>
      <div className="flex">
        {/* Credentials  */}
        <div className="panel min-w-[600px]">
          <h1 className="font-weight-400 text-lg font-semibold">User's Wallet</h1>
          {userIdentity && <h2>DID: {userIdentity.did.id}</h2>}

          <br></br>
          <div className="mb-2 flex justify-between	align-middle">
            <h5 className="text-md align-middle font-semibold dark:text-white-light">Credentials</h5>

            {credentials?.filter(
              (credential: W3CCredential) =>
                credential.credentialSubject.id?.toString() === 'did:iden3:' + (userIdentity?.did.id || '')
            ).length == 0 &&
              (!requestCredentialTrigger ? (
                <p className="link text-secondary" onClick={() => setRequestCredentialTrigger(true)}>
                  Request demo credential
                </p>
              ) : (
                <p className="opacity-50">Requesting...</p>
              ))}
          </div>
          {credentials
            ?.filter(
              (credential: W3CCredential) =>
                credential.credentialSubject.id?.toString() === 'did:iden3:' + (userIdentity?.did.id || '')
            )
            .map((credential: W3CCredential) => (
              <div className="flex flex-row rounded-md border border-primary p-2" key={credential.id}>
                <div>
                  <h1 className="font-semibold">Credential</h1>
                  <h1>{credential.type.filter((type: string) => type !== 'VerifiableCredential')}</h1>
                  <h1 color="text.secondary">
                    Expiration: {credential.expirationDate && new Date(credential.expirationDate).toUTCString()}
                  </h1>
                  <h1>Schema: {getSchemaHashFromCredential(credential).toString()}</h1>
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

        {/* Ad */}
        <div className="m-3 flex w-1/3 flex-col p-2">
          {ads?.map((ad, index) => (
            <div className="card w-96 bg-white shadow-xl dark:bg-black" key={ad.id}>
              <figure>
                <img src={metadata[index]?.image} alt="Shoes" />
              </figure>
              <div className="card-body">
                <h2 className="card-title">{metadata[index]?.title}</h2>
                <p>{metadata[index]?.description}</p>

                <div className="card-actions m-1 justify-end">
                  {isConnected ? (
                    <button
                      className="w-all btn btn-secondary"
                      onClick={() => {
                        generateProofAndConsumeAd(ad);
                      }}>
                      Generate Proof & Request Rewards
                    </button>
                  ) : (
                    <NoWalletConnected caption="Please connect Wallet"></NoWalletConnected>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Demo;
