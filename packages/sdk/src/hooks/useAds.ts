import { getIPFSStorageUrl } from '@common/functions/getIPFSStorageUrl';
import { useState } from 'react';
import { useAsync } from 'react-use';
import { getValidCredentialByProofRequest, useCredentials } from '..';
import { TargecyContextType } from '../components/misc/Context.types';
import { Ad, useGetAllAdsQuery } from '../generated/graphql.types';

export type AdMetadata = {
  title: string;
  description: string;
  image: string;
};

export type AdWithMetadata = {
  ad: Ad;
  metadata: AdMetadata;
};

export const useAds = (context: TargecyContextType) => {
  const { data, isLoading } = useGetAllAdsQuery({});
  const credentials = useCredentials(context);

  const validAds =
    data?.ads.filter(
      (ad) =>
        ad?.audiences.length === 0 ||
        ad?.audiences.some((a) =>
          a.segments.every((zk) => getValidCredentialByProofRequest(credentials.credentials, zk))
        )
    ) || [];

  const [completeAds, setCompleteAds] = useState<
    { ad: Ad; metadata: { title: string; description: string; image: string } }[]
  >([]);

  useAsync(async () => {
    if (validAds) {
      const finalAds: {
        ad: Ad;
        metadata: {
          title: string;
          description: string;
          image: string;
        };
      }[] = [];
      for (const ad of validAds) {
        // @todo(kevin): this is being repeated in the webapp, we should move it to a common place
        const newMetadata = await fetch(getIPFSStorageUrl(ad.metadataURI));
        const json = await newMetadata.json();
        if (json.image.startsWith('ipfs://') || json.image.startsWith('http://') || json.image.startsWith('https://'))
          finalAds.push({
            ad,
            metadata: {
              title: json.title,
              description: json.description,
              image: json.image,
            },
          });
      }

      setCompleteAds(finalAds);
    }
  }, [data]);

  return {
    ads: completeAds,
    isLoading,
  };
};
