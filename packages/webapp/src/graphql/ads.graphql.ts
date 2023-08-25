import { gql } from 'graphql-request';

export const GetAllAds = gql`
  fragment AdFragment on Ad {
    id
    impressions
    targetGroups {
      ...TargetGroupFragment
    }
    metadataURI
    budget
  }

  query GetAllAds {
    ads {
      ...AdFragment
    }
  }

  query GetAdToShow {
    ads(where: { targetGroups_not: [] }, orderBy: id, orderDirection: desc) {
      ...AdFragment
    }
  }
`;
