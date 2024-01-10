import { W3CCredential } from '@0xpolygonid/js-sdk';

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
