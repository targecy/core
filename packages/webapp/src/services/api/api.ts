import { getIPFSStorageUrl } from '@common/functions/getIPFSStorageUrl';

import type { Metadata, TagTypes, UpdatedDefitions } from './api.types';

import {
  type GetLastAdsQuery,
  type GetLastAudiencesQuery,
  type GetLastSegmentsQuery,
  api as generatedApi,
} from '~/generated/graphql.types';

async function mergeWithMetadata<T extends { metadataURI: string }>(
  items: T[]
): Promise<(T & { metadata: Metadata })[]> {
  return Promise.all(
    items.map(async (item) => {
      let metadata: Metadata = {};
      try {
        const response = await fetch(getIPFSStorageUrl(item.metadataURI));
        metadata = await response.json();
      } catch (error) {
        console.error('Error fetching metadata:', error);
      }
      return { ...item, metadata };
    })
  );
}

export const api = generatedApi.enhanceEndpoints<TagTypes, UpdatedDefitions>({
  endpoints: {
    GetLastAds: {
      transformResponse: async ({ ads, ...response }: GetLastAdsQuery) => {
        const adsWithMetadata = await mergeWithMetadata(ads);
        return { ...response, ads: adsWithMetadata };
      },
    },
    GetLastAudiences: {
      transformResponse: async ({ audiences, ...response }: GetLastAudiencesQuery) => {
        const audiencesWithMetadata = await mergeWithMetadata(audiences);
        return { ...response, audiences: audiencesWithMetadata };
      },
    },
    GetLastSegments: {
      transformResponse: async ({ segments, ...response }: GetLastSegmentsQuery) => {
        const segmentsWithMetadata = await mergeWithMetadata(segments);
        return { ...response, segments: segmentsWithMetadata };
      },
    },
  },
});

export const { useGetLastAdsQuery, useGetLastAudiencesQuery, useGetLastSegmentsQuery } = api;
