import {
  type TagTypesFromApi,
  type DefinitionsFromApi,
  type OverrideResultType,
} from '@reduxjs/toolkit/dist/query/endpointDefinitions';

import {
  type GetLastAdsQuery,
  type GetLastAudiencesQuery,
  type GetLastSegmentsQuery,
  type GetAdsByAdvertiserQuery,
  api,
} from '~/generated/graphql.types';

export type TagTypes = TagTypesFromApi<typeof api>;
export type Definitions = DefinitionsFromApi<typeof api>;

export type Metadata = { title?: string; description?: string; image?: string; imageUrl?: string };

export type AdWithMetadata = GetLastAdsQuery['ads'][0] & { metadata: Metadata };
export type GetLastAdsWithMetadataQuery = Omit<GetLastAdsQuery, 'ads'> & {
  ads: Array<AdWithMetadata>;
};
export type GetLastAdsDefinition = OverrideResultType<Definitions['GetLastAds'], GetLastAdsWithMetadataQuery>;

export type GetAdsByAdvertiserWithMetadataQuery = Omit<GetAdsByAdvertiserQuery, 'ads'> & {
  ads: Array<AdWithMetadata>;
};
export type GetAdsByAdvertiserDefinition = OverrideResultType<
  Definitions['GetAdsByAdvertiser'],
  GetAdsByAdvertiserWithMetadataQuery
>;

export type AudienceWithMetadata = GetLastAudiencesQuery['audiences'][0] & { metadata: Metadata };
export type GetLastAudiencesWithMetadataQuery = Omit<GetLastAudiencesQuery, 'audiences'> & {
  audiences: Array<AudienceWithMetadata>;
};
export type GetLastAudiencesDefinition = OverrideResultType<
  Definitions['GetLastAudiences'],
  GetLastAudiencesWithMetadataQuery
>;

export type SegmentWithMetadata = GetLastSegmentsQuery['segments'][0] & { metadata: Metadata };
export type GetLastSegmentsWithMetadataQuery = Omit<GetLastSegmentsQuery, 'segments'> & {
  segments: Array<SegmentWithMetadata>;
};
export type GetLastSegmentsDefinition = OverrideResultType<
  Definitions['GetLastSegments'],
  GetLastSegmentsWithMetadataQuery
>;

export type UpdatedDefitions = Omit<Definitions, 'GetLastAds'> & {
  GetLastAds: GetLastAdsDefinition;
  GetAdsByAdvertiser: GetAdsByAdvertiserDefinition;
  GetLastAudiences: GetLastAudiencesDefinition;
  GetLastSegments: GetLastSegmentsDefinition;
};
