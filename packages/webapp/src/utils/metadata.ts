export const fetchMetadata = async (metadataURI: string) => {
  const newMetadata = await fetch(`https://${metadataURI}.ipfs.nftstorage.link`);
  const json = await newMetadata.json();

  return {
    title: json.title,
    description: json.description,
    ...(json.image ? { image: json.image } : {}),
  };
};
