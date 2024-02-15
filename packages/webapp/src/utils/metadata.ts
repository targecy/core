import { getIPFSStorageUrl } from '@common/functions/getIPFSStorageUrl';

export const fetchMetadata = async (metadataURI: string) => {
  const newMetadata = await fetch(getIPFSStorageUrl(metadataURI));
  const json = await newMetadata.json();

  return {
    title: json.title,
    description: json.description,
    ...(json.image ? { image: json.image } : {}),
  };
};

export type PublisherMetadata = {
  name: string;
  url: string;
};

export const fetchPublisherMetadata = async (metadataURI: string): Promise<PublisherMetadata> => {
  const newMetadata = await fetch(getIPFSStorageUrl(metadataURI));
  const json = await newMetadata.json();

  return {
    name: json.name,
    url: json.url,
  };
};
