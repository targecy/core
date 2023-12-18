import { gql } from 'graphql-request';

export const GetAllAudiences = gql`
  fragment AudienceFragment on Audience {
    id
    metadataURI
    segments {
      ...SegmentFragment
    }
    consumptions
  }

  query GetAllAudiences {
    audiences {
      ...AudienceFragment
    }
  }
`;
