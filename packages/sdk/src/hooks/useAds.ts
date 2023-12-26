import { useState } from 'react';
import { useAsync } from 'react-use';
import { TargecyContextType } from '../components/misc/Context';
import { Ad, useGetAllAdsQuery } from '../generated/graphql.types';
import { getValidCredentialByProofRequest, useCredentials } from '..';

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
        const newMetadata = await fetch(`https://${ad.metadataURI}.ipfs.nftstorage.link`);
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
