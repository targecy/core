import { CredentialRequest, CredentialStatusType, IdentityWallet, W3CCredential, core } from '@0xpolygonid/js-sdk';
import { environment, initServices } from './context';
import { getSavedCredentials, saveCredentials } from './sharedStorage';
import { backendTrpcClient } from './trpc';
import { DID } from '@iden3/js-iden3-core';
import { SCHEMAS } from '@backend/constants/schemas/schemas.constant';
import { sha256 } from '@iden3/js-crypto';
import { createUserIdentity } from './zk';

enum TrackingEventType {
  PAGE_VIEW = 'page_view',
  CUSTOM_EVENT = 'custom_event',
}

type TrackingEventBaseParams = {
  type: TrackingEventType;
};

type PageViewEventParams = {
  path: string;
};

const isPageViewEventParams = (params: Record<string, any>): params is PageViewEventParams => {
  return 'path' in params;
};

type CustomEventParams = {
  id: string;
  params: Record<string, string | number | boolean>;
};

const isCustomEventParams = (params: Record<string, any>): params is CustomEventParams => {
  return 'id' in params && 'params' in params;
};

type TrackingEvent = TrackingEventBaseParams & (PageViewEventParams | CustomEventParams);

export const trackCustomEvent = (params: CustomEventParams, env: environment = 'production') =>
  trackEvent(env, { type: TrackingEventType.CUSTOM_EVENT, ...params });

export const trackPageView = (page: PageViewEventParams, env: environment = 'production') =>
  trackEvent(env, { type: TrackingEventType.PAGE_VIEW, path: page.path });

const trackEvent = async (env: environment, params: TrackingEvent) => {
  if (!window) {
    console.error('window is not defined');
    return false;
  }
  const issuerUrl = window.location.hostname;

  const zkServices = await initServices();
  const identityWallet = zkServices.identityWallet;
  const userIdentity = await createUserIdentity(zkServices.identityWallet);

  const savedCredentials = await getSavedCredentials();

  const issuerIdentity = await createIssuerIdentity(identityWallet, issuerUrl.toString());

  const credentialToSave = await eventToCredential(env, identityWallet, issuerIdentity.did, userIdentity.did, params);

  const credentialAlreadySaved = savedCredentials.find(
    (c) => JSON.stringify(c.credentialSubject) == JSON.stringify(credentialToSave.credentialSubject)
  );

  if (!credentialAlreadySaved) {
    saveCredential(credentialToSave);
    updatePotentialReachDatabase(env, credentialToSave);
  }

  return true;
};

// Function to hash the URL to a 32-byte seed
function hashUrlTo32ByteSeed(url: string) {
  return sha256(new TextEncoder().encode(url));
}

export async function createIssuerIdentity(wallet: IdentityWallet, url: string) {
  return await wallet.createIdentity({
    method: core.DidMethod.Iden3,
    blockchain: core.Blockchain.Polygon,
    networkId: core.NetworkId.Mumbai,
    seed: hashUrlTo32ByteSeed(url),
    revocationOpts: {
      type: CredentialStatusType.Iden3ReverseSparseMerkleTreeProof,
      id: 'https://rhs-staging.polygonid.me',
    },
  });
}

const getCredentialRequest = (event: TrackingEvent, userDID: DID): CredentialRequest => {
  const credentialRequestBase = {
    revocationOpts: {
      type: CredentialStatusType.Iden3ReverseSparseMerkleTreeProof,
      id: 'https://rhs-staging.polygonid.me',
    },
  };

  switch (event.type) {
    case TrackingEventType.PAGE_VIEW:
      if (!isPageViewEventParams(event)) throw new Error('Invalid event params');
      const pageViewCredentialSubject: (typeof SCHEMAS)['PageViewTargecySchema']['credentialSubject'] = {
        id: `did:iden3:${userDID.id}`,
        path: event.path,
      };
      return {
        ...credentialRequestBase,
        credentialSchema: SCHEMAS['PageViewTargecySchema'].schemaUrl,
        type: SCHEMAS['PageViewTargecySchema'].type,
        credentialSubject: pageViewCredentialSubject,
      };
    case TrackingEventType.CUSTOM_EVENT:
      if (!isCustomEventParams(event)) throw new Error('Invalid event params');
      const customEventCredentialSubject: (typeof SCHEMAS)['CustomEventTargecySchema']['credentialSubject'] = {
        id: `did:iden3:${userDID.id}`,
        eventId: event.id,
        eventParam: JSON.stringify(event.params),
      };
      return {
        ...credentialRequestBase,
        credentialSchema: SCHEMAS['CustomEventTargecySchema'].schemaUrl,
        type: SCHEMAS['CustomEventTargecySchema'].type,
        credentialSubject: customEventCredentialSubject,
      };
    default:
      throw new Error('Invalid event type');
  }
};

const eventToCredential = (
  env: environment,
  identityWallet: IdentityWallet,
  issuerDID: DID,
  userDID: DID,
  event: TrackingEvent
) => {
  return identityWallet.issueCredential(issuerDID, getCredentialRequest(event, userDID), {
    ipfsGatewayURL: 'https://ipfs.io',
  });
};

const saveCredential = async (credential: W3CCredential) => {
  await saveCredentials([credential]);
};

const updatePotentialReachDatabase = async (env: environment, credential: W3CCredential) => {
  const subject = credential.credentialSubject;
  delete subject.id; // We don't track users data!

  backendTrpcClient(env).reach.updateReach.mutate({
    type: credential.type.length > 1 ? credential.type[1] : credential.type[0],
    issuer: credential.issuer,
    subject,
  });
};
