import { getIPFSStorageUrl } from '@common/functions/getIPFSStorageUrl';
import { useState } from 'react';
import { useAsync } from 'react-use';
import { getValidCredentialByProofRequest, useCredentials } from '..';
import { TargecyContextType } from '../components/misc/Context.types';
import { Ad, useGetAllAdsQuery } from '../generated/graphql.types';
import { SolidityTypes } from '../constants/chain';

export type AdMetadata = {
  title?: string;
  description?: string;
  image?: string;
  link?: string;
  paramsSchema?: Record<string, SolidityTypes>;
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
    { ad: Ad; metadata: AdMetadata }[]
  >([]);

  useAsync(async () => {
    if (validAds) {
      const finalAds: {
        ad: Ad;
        metadata: AdMetadata;
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
              link: json.link,
              paramsSchema: json.paramsSchema,
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
