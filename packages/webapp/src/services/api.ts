import { getIPFSStorageUrl } from '@common/functions/getIPFSStorageUrl';
import type {
  DefinitionsFromApi,
  OverrideResultType,
  TagTypesFromApi,
} from '@reduxjs/toolkit/dist/query/endpointDefinitions';

import {
  type GetLastAdsQuery,
  type GetAdsByAdvertiserQuery,
  type GetLastAudiencesQuery,
  type GetLastSegmentsQuery,
  api as generatedApi,
} from '~/generated/graphql.types';

// @todo(kevin): generalize this behavior

type TagTypes = TagTypesFromApi<typeof generatedApi>;
type Definitions = DefinitionsFromApi<typeof generatedApi>;

export type Metadata = { title?: string; description?: string; image?: string; imageUrl?: string };

export type AdWithMetadata = GetLastAdsQuery['ads'][0] & { metadata: Metadata };
export type GetLastAdsWithMetadataQuery = Omit<GetLastAdsQuery, 'ads'> & {
  ads: Array<AdWithMetadata>;
};
type GetLastAdsDefinition = OverrideResultType<Definitions['GetLastAds'], GetLastAdsWithMetadataQuery>;

export type GetAdsByAdvertiserWithMetadataQuery = Omit<GetAdsByAdvertiserQuery, 'ads'> & {
  ads: Array<AdWithMetadata>;
};
type GetAdsByAdvertiserDefinition = OverrideResultType<
  Definitions['GetAdsByAdvertiser'],
  GetAdsByAdvertiserWithMetadataQuery
>;

export type AudienceWithMetadata = GetLastAudiencesQuery['audiences'][0] & { metadata: Metadata };
export type GetLastAudiencesWithMetadataQuery = Omit<GetLastAudiencesQuery, 'audiences'> & {
  audiences: Array<AudienceWithMetadata>;
};
type GetLastAudiencesDefinition = OverrideResultType<
  Definitions['GetLastAudiences'],
  GetLastAudiencesWithMetadataQuery
>;

export type SegmentWithMetadata = GetLastSegmentsQuery['segments'][0] & { metadata: Metadata };
export type GetLastSegmentsWithMetadataQuery = Omit<GetLastSegmentsQuery, 'segments'> & {
  segments: Array<SegmentWithMetadata>;
};
type GetLastSegmentsDefinition = OverrideResultType<Definitions['GetLastSegments'], GetLastSegmentsWithMetadataQuery>;

type UpdatedDefitions = Omit<Definitions, 'GetLastAds'> & {
  GetLastAds: GetLastAdsDefinition;
  GetAdsByAdvertiser: GetAdsByAdvertiserDefinition;
  GetLastAudiences: GetLastAudiencesDefinition;
  GetLastSegments: GetLastSegmentsDefinition;
};

export const api = generatedApi.enhanceEndpoints<TagTypes, UpdatedDefitions>({
  endpoints: {
    GetLastAds: {
      transformResponse: async ({ ads, ...response }: GetLastAdsQuery) => {
        const adsWithMetadata = await Promise.all(
          ads.map(async (ad) => {
            let metadata: Metadata = {};
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
    GetAdsByAdvertiser: {
      transformResponse: async ({ ads, ...response }: GetLastAdsQuery) => {
        const adsWithMetadata = await Promise.all(
          ads.map(async (ad) => {
            let metadata: Metadata = {};
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

export const { useGetLastAdsQuery, useGetAdsByAdvertiserQuery, useGetLastAudiencesQuery, useGetLastSegmentsQuery } =
  api;
