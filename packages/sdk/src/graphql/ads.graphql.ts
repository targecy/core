import { gql } from 'graphql-request';

export const GetAllAds = gql`
  fragment AdvertiserFragment on Advertiser {
    id
    adsQuantity
    impressions
    clicks
    conversions
    remainingBudget
    totalBudget
  }

  fragment ConsumptionsPerDayFragment on ConsumptionsPerDay {
    id
    day
    adId
    consumptions
  }

  fragment AdFragment on Ad {
    id
    advertiser {
      ...AdvertiserFragment
    }
    metadataURI
    attribution
    startingTimestamp
    endingTimestamp
    audiences {
      ...AudienceFragment
    }
    blacklistedPublishers {
      ...PublisherFragment
    }
    blacklistedWeekdays
    totalBudget
    remainingBudget
    maxConsumptionsPerDay
    maxPricePerConsumption
    consumptions
    consumptionsPerDay {
      ...ConsumptionsPerDayFragment
    }
  }

  query GetAllAds {
    ads {
      ...AdFragment
    }
  }

  query GetAdToShow {
    ads(where: { audiences_not: [] }, orderBy: id, orderDirection: desc) {
      ...AdFragment
    }
  }

  query GetAdById($id: ID) {
    ads(where: { id: $id }) {
      ...AdFragment
    }
  }
`;
