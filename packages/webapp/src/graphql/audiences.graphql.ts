import { gql } from 'graphql-request';

export const Audiences = gql`
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

  query GetAudience($id: ID!) {
    audience(id: $id) {
      ...AudienceFragment
    }
  }

  query GetLastAudiences($limit: Int!) {
    audiences(first: $limit) {
      ...AudienceFragment
    }
  }
`;
