import { getIPFSStorageUrl } from '@common/functions/getIPFSStorageUrl';
import {
  DefinitionsFromApi,
  OverrideResultType,
  TagTypesFromApi,
} from '@reduxjs/toolkit/dist/query/endpointDefinitions';

import {
  GetLastAdsQuery,
  GetLastAudiencesQuery,
  GetLastSegmentsQuery,
  api as generatedApi,
} from '~/generated/graphql.types';

// @todo(kevin): generalize this behavior

type TagTypes = TagTypesFromApi<typeof generatedApi>;
type Definitions = DefinitionsFromApi<typeof generatedApi>;

type Metadata = { title?: string; description?: string };

type AdWithMetadata = GetLastAdsQuery['ads'][0] & { metadata: Metadata };
type GetLastAdsWithMetadataQuery = Omit<GetLastAdsQuery, 'ads'> & {
  ads: Array<AdWithMetadata>;
};
type GetLastAdsDefinition = OverrideResultType<Definitions['GetLastAds'], GetLastAdsWithMetadataQuery>;

type AudienceWithMetadata = GetLastAudiencesQuery['audiences'][0] & { metadata: Metadata };
type GetLastAudiencesWithMetadataQuery = Omit<GetLastAudiencesQuery, 'audiences'> & {
  audiences: Array<AudienceWithMetadata>;
};
type GetLastAudiencesDefinition = OverrideResultType<
  Definitions['GetLastAudiences'],
  GetLastAudiencesWithMetadataQuery
>;

type SegmentWithMetadata = GetLastSegmentsQuery['segments'][0] & { metadata: Metadata };
type GetLastSegmentsWithMetadataQuery = Omit<GetLastSegmentsQuery, 'segments'> & {
  segments: Array<SegmentWithMetadata>;
};
type GetLastSegmentsDefinition = OverrideResultType<Definitions['GetLastSegments'], GetLastSegmentsWithMetadataQuery>;

type UpdatedDefitions = Omit<Definitions, 'GetLastAds'> & {
  GetLastAds: GetLastAdsDefinition;
  GetLastAudiences: GetLastAudiencesDefinition;
  GetLastSegments: GetLastSegmentsDefinition;
};

export const api = generatedApi.enhanceEndpoints<TagTypes, UpdatedDefitions>({
  endpoints: {
    GetLastAds: {
      transformResponse: async ({ ads, ...response }: GetLastAdsQuery) => {
        const adsWithMetadata = await Promise.all(
          ads.map(async (ad) => {
            let metadata: Metadata = { title: '', description: '' };
            try {
              const response = await fetch(getIPFSStorageUrl(ad.metadataURI));
              metadata = await response.json();
            } catch (error) {
              console.error('Error fetching metadata:', error);
            }
            return { ...ad, metadata };
          })
        );

        return { ...response, ads: adsWithMetadata };
      },
    },
    GetLastAudiences: {
      transformResponse: async ({ audiences, ...response }: GetLastAudiencesQuery) => {
        const audiencesWithMetadata = await Promise.all(
          audiences.map(async (audience) => {
            let metadata: Metadata = { title: '', description: '' };
            try {
              const response = await fetch(getIPFSStorageUrl(audience.metadataURI));
              metadata = await response.json();
            } catch (error) {
              console.error('Error fetching metadata:', error);
            }
            return { ...audience, metadata };
          })
        );

        return { ...response, audiences: audiencesWithMetadata };
      },
    },
    GetLastSegments: {
      transformResponse: async ({ segments, ...response }: GetLastSegmentsQuery) => {
        const segmentsWithMetadata = await Promise.all(
          segments.map(async (segment) => {
            let metadata: Metadata = { title: '', description: '' };
            try {
              const response = await fetch(getIPFSStorageUrl(segment.metadataURI));
              metadata = await response.json();
            } catch (error) {
              console.error('Error fetching metadata:', error);
            }
            return { ...segment, metadata };
          })
        );

        return { ...response, segments: segmentsWithMetadata };
      },
    },
  },
});

export const { useGetLastAdsQuery, useGetLastAudiencesQuery, useGetLastSegmentsQuery } = api;

/* async function fetchMetadata<
    T extends GetLastAdsQuery | GetLastAudiencesQuery | GetLastSegmentsQuery,
    K extends PickArrayProps<T>
  >(results: T | undefined, entityName: K) {
    try {
      if (!results) return {};

      const entities = results[entityName] as Array<{ id: string; metadataURI: string }>;
      const responses = await Promise.all(
        entities.map(async (item) => {
          const response = await fetch(getIPFSStorageUrl(item.metadataURI));
          const json = await response.json();
          return { id: item.id, metadata: { title: json.title, description: json.description } };
        })
      );
      return responses.reduce<Record<string, Metadata>>((acc, curr) => {
        acc[curr.id] = curr.metadata;
        return acc;
      }, {});
    } catch (error) {
      console.error('Error fetching metadata:', error);
      return {};
    }
  } */

/* 
  type PickArrayProps<T> = {
  [K in keyof T]: T[K] extends Array<any> ? K : never;
}[keyof T];
  */
