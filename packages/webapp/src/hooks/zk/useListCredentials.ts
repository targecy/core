import { type W3CCredential } from '@0xpolygonid/js-sdk';
import { Dispatch, SetStateAction } from 'react';
import { useAsync } from 'react-use';

import { ZKServices } from './useInitZKServices';

export const useListCredentials = (
  credentials: W3CCredential[],
  setCredentials: Dispatch<SetStateAction<W3CCredential[]>>,
  services?: ZKServices
) => {
  useAsync(async () => {
    if (!services || !setCredentials) return;
    const newCredentials = await services.credWallet.list();
    setCredentials([...credentials, ...newCredentials]);
  }, [services]).value;
};
