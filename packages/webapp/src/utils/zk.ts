import { CircuitId, type core, W3CCredential } from '@0xpolygonid/js-sdk';
import { type Dispatch, type SetStateAction } from 'react';

import { type ZKServices } from '~/hooks/zk/useInitZKServices';
import { ProofCredentialMatch, createCredentialRequest } from '~/utils/zk.utils';
import { ZkpRequest } from '~~/generated/graphql.types';

export async function requestKYCCredential(
  services?: ZKServices,
  userDID?: string,
  setCredentials?: Dispatch<SetStateAction<W3CCredential[]>>
) {
  if (!services || !userDID) throw new Error('Missing services or userDID');

  const credentialRequest = createCredentialRequest(userDID);
  const issuedCredentialResponse = await fetch('/api/issuer/requestCredential', {
    method: 'POST',
    body: JSON.stringify(credentialRequest),
  });
  const issuedCredential: W3CCredential = cloneCredential(await issuedCredentialResponse.json());

  // Save it to storage
  await services.dataStorage.credential.saveCredential(issuedCredential);
  setCredentials && setCredentials(await services.credWallet.list());

  return issuedCredential;
}

export function cloneCredential(credential: W3CCredential) {
  const cloned = new W3CCredential();

  const keys = Object.keys(credential) as (keyof W3CCredential)[];
  for (const key of keys) {
    if (credential[key]) {
      cloned[key] = credential[key] as any;
    }
  }
  return cloned;
}

const operatorKeyByNumber: Record<number, string> = {
  1: '$eq',
  2: '$lt',
  3: '$gt',
  4: '$in',
  5: '$nin',
};

export async function generateZKProof(
  match: ProofCredentialMatch,
  zkpRequest: ZkpRequest,
  services: ZKServices,
  userDID: core.DID
) {
  const proofReqSig = {
    id: Number(zkpRequest.id),
    circuitId: CircuitId.AtomicQuerySigV2OnChain,
    optional: false,
    query: {
      allowedIssuers: ['*'],
      type: match.credential.type,
      context: match.credential['@context'],
      credentialSubject: {
        [match.credentialSubjectField]: {
          [operatorKeyByNumber[match.operator]]: match.credentialSubjectValue,
        },
      },
    },
  };

  console.log(proofReqSig, match.credential);

  const proof = await services.proofService.generateProof(proofReqSig, userDID, {
    credential: match.credential,
    challenge: BigInt(1),
    skipRevocation: false,
  });

  proof.proof.pi_a = proof.proof.pi_a.slice(0, 2);
  proof.proof.pi_b = [
    [proof.proof.pi_b[0]?.[1]?.toString() || '', proof.proof.pi_b[0]?.[0]?.toString() || ''],
    [proof.proof.pi_b[1]?.[1]?.toString() || '', proof.proof?.pi_b[1]?.[0]?.toString() || ''],
  ];
  proof.proof.pi_c = proof.proof.pi_c.slice(0, 2);

  // Check Proof
  const proofVerificationResult = await services.proofService.verifyProof(proof, CircuitId.AtomicQuerySigV2OnChain);

  return proof;
}
