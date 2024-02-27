import { W3CCredential } from '@0xpolygonid/js-sdk';

import { cloneCredential } from './credential';
import { sha256 } from '@iden3/js-crypto';
import { updatePotentialReachDatabase } from './reach';
import { environment } from './context';

/**
 * This is a workaround for the fact that the browser doesn't allow us to
 * access localStorage from an iframe. Instead, we use postMessage to send
 * messages to an iframe that is hosted on the same domain as the main window.
 * The iframe then saves the data to localStorage and sends it back to the
 * main window. This way we have a shared storage between our dapp and
 * different publishers that use the SDK.
 */

const BASE_URL = 'https://app.targecy.xyz';
const URL = `${BASE_URL}/storage`;

function saveItem(key: string, value: string): Promise<boolean> {
  // Create an iframe and append it to the DOM
  const iframe = document.createElement('iframe');
  iframe.src = URL;
  iframe.style.display = 'none';
  document.body.appendChild(iframe);

  // Send a message to the iframe once it's loaded
  return new Promise((resolve, reject) => {
    iframe.onload = function () {
      try {
        const data = {
          target: 'targecy',
          action: 'save',
          key: key,
          value: value,
        };

        iframe.contentWindow?.postMessage(data, BASE_URL);

        resolve(true);
      } catch (error) {
        reject(error);
      }
    };
  });
}

function retrieveItem(key: string): Promise<string | null> {
  return new Promise((resolve, _reject) => {
    // Create an iframe and append it to the DOM
    const iframe = document.createElement('iframe');
    iframe.src = URL;
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    // Listen for messages from the iframe
    function messageListener(event: MessageEvent) {
      if (event.data.target !== 'targecy') return; // @todo (Martin): check origin here and everywhere necessary

      if (event.data.action === 'data') {
        resolve(event.data.value);
        window.removeEventListener('message', messageListener);
      }
    }

    window.addEventListener('message', messageListener);

    // Request data from the iframe once it's loaded
    iframe.onload = function () {
      const data = {
        target: 'targecy',
        action: 'get',
        key: key,
      };

      iframe.contentWindow?.postMessage(data, BASE_URL);
    };
  });
}

export async function getSavedCredentials() {
  try {
    const json = JSON.parse((await retrieveItem('credentials')) ?? '[]');
    if (!Array.isArray(json)) throw new Error('Invalid credentials');

    return json.map((c) => W3CCredential.fromJSON(c));
  } catch (e) {
    console.error(e);
    return [];
  }
}

const hashCredentialSubject = (credential: W3CCredential) => {
  return sha256(new TextEncoder().encode(JSON.stringify(credential.credentialSubject))).toString();
};

export async function saveCredentials(credentials: W3CCredential[], env: environment) {
  const savedCredentials = await getSavedCredentials();
  const savedCredentialsDids = savedCredentials.map((c) => c.id);

  // Filter out credentials that are already saved
  const savedCredentialsHashed = savedCredentials.map(hashCredentialSubject);
  const newCredentials = credentials
    .filter((c) => !savedCredentialsDids.includes(c.id))
    .filter((c) => !c.type.toString().includes('AuthBBJ'))
    .filter((c) => !savedCredentialsHashed.includes(hashCredentialSubject(c)));

  if (newCredentials.length === 0) return;

  const json = JSON.stringify(savedCredentials.concat(newCredentials));
  await saveItem('credentials', json);

  // Don't wait
  newCredentials.map((c) => updatePotentialReachDatabase(env, c));
}

export async function saveSeed(seed: string) {
  await saveItem('seed', seed);
}

export async function getSeed() {
  return await retrieveItem('seed');
}
