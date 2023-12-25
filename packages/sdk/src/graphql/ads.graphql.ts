import { gql } from 'graphql-request';

export const Ads = gql`
  fragment AdFragment on Ad {
    id
    advertiser {
      ...AdvertiserFragment
    }
    metadataURI
    attribution
    active
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

  query GetAd($id: ID!) {
    ad(id: $id) {
      ...AdFragment
    }
  }

  query GetLastAds($limit: Int!) {
    ads(first: $limit) {
      ...AdFragment
    }
  }

  query GetAdsByAdvertiser($advertiserId: String!) {
    ads(where: { advertiser: $advertiserId }) {
      ...AdFragment
    }
  }
`;
