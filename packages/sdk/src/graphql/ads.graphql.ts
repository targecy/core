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
    abi
    target
    maxBudget
    currentBudget
    startingTimestamp
    endingTimestamp
    audiences {
      ...AudienceFragment
    }
    blacklistedPublishers {
      ...PublisherFragment
    }
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

  query GetAdsByWhitelistedAdvertisers($whitelistedAdvertisers: [String!]!) {
    ads(where: { advertiser_in: $whitelistedAdvertisers }) {
      ...AdFragment
    }
  }

  query GetAdToShow {
    ads(where: { audiences_not: [] }, orderBy: id, orderDirection: desc) {
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
