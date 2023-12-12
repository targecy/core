import { gql } from 'graphql-request';

export const GetAllAds = gql`
  fragment AdFragment on Ad {
    id
    advertiser {
      id
    }
    metadataURI
    attribution
    startingTimestamp
    endingTimestamp
    audiences {
      ...AudienceFragment
    }
    blacklistedPublishers {
      id
    }
    blacklistedWeekdays
    totalBudget
    remainingBudget
    maxConsumptionsPerDay
    maxPricePerConsumption
    consumptions
    consumptionsPerDay {
      id
      day
      adId
      consumptions
    }
  }

  query GetAllAds {
    ads {
      ...AdFragment
    }
  }

  query GetAdToShow {
    ads(where: { audiences_not: [] }, orderBy: remainingBudget, orderDirection: desc) {
      ...AdFragment
    }
  }

  query GetAdById($id: Bytes!) {
    ads(where: { id: $id }) {
      ...AdFragment
    }
  }
`;
