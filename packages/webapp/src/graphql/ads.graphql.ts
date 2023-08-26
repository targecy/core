import { gql } from 'graphql-request';

export const GetAllAds = gql`
  fragment AdFragment on Ad {
    id
    impressions
    # minBlock
    # maxBlock
    # maxImpressionPrice
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

  query GetAdById($id: String) {
    ads(where: { id: $id }) {
      ...AdFragment
    }
  }
`;
