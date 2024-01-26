import {
  AdConsumed as AdConsumedEvent,
  AdCreated as AdCreatedEvent,
  AdDeleted as AdDeletedEvent,
  AdEdited as AdEditedEvent,
  PublisherRemovedFromWhitelist,
  PublisherWhitelisted,
  AudienceCreated as AudienceCreatedEvent,
  AudienceDeleted as AudienceDeletedEvent,
  AudienceEdited as AudienceEditedEvent,
  SegmentEdited as SegmentEditedEvent,
  SegmentDeleted as SegmentDeletedEvent,
  AdPaused as AdPausedEvent,
  AdUnpaused as AdUnpausedEvent,
  PausePublisher as PausePublisherEvent,
  UnpausePublisher as UnpausePublisherEvent,
  AdminSet as AdminSetEvent,
  AdminRemoved as AdminRemovedEvent,
  AdvertiserBudgetFunded as AdvertiserBudgetFundedEvent,
  AdvertiserBudgetWithdrawn as AdvertiserBudgetWithdrawnEvent,
} from '../generated/Targecy/TargecyEvents';
import { Ad, Publisher, Audience, Segment, Advertiser, ConsumptionsPerDay, Admin, Budget } from '../generated/schema';
import { BigInt, Bytes, store, log } from '@graphprotocol/graph-ts';

function createAdvertiser(id: string): Advertiser {
  let entity = new Advertiser(id);

  if (entity == null) {
    throw new Error('Could not create advertiser.');
  }

  let budget = new Budget(id);
  budget.totalBudget = BigInt.fromI32(0);
  budget.remainingBudget = BigInt.fromI32(0);
  budget.save();

  entity.budget = budget.id;

  entity.adsQuantity = BigInt.fromI32(0);
  entity.impressions = BigInt.fromI32(0);
  entity.clicks = BigInt.fromI32(0);
  entity.conversions = BigInt.fromI32(0);
  entity.save();

  log.info('New Advertiser created with id: {}', [id]);

  return entity;
}

export function handleAdminSet(event: AdminSetEvent): void {
  let entity = new Admin(event.params.admin.toHexString());
  entity.save();
}

export function handleAdminRemoved(event: AdminRemovedEvent): void {
  store.remove('Admin', event.params.admin.toHexString());
}

function handleAdPaused(event: AdPausedEvent): void {
  let entity = Ad.load(event.params.adId.toString());

  if (entity == null) {
    throw new Error('Ad not found. Cannot pause.');
  }

  entity.active = false;
  entity.save();
}

function handleAdUnpaused(event: AdUnpausedEvent): void {
  let entity = Ad.load(event.params.adId.toString());

  if (entity == null) {
    throw new Error('Ad not found. Cannot unpause.');
  }

  entity.active = true;
  entity.save();
}

function timestampToDay(timestamp: BigInt): BigInt {
  return timestamp.div(BigInt.fromI32(86400));
}

function getConsumptionPerDayId(adId: BigInt, day: BigInt): string {
  return adId.toString() + '-' + day.toString();
}

function getConsumptionsPerDay(adId: BigInt, day: BigInt): ConsumptionsPerDay {
  let id = getConsumptionPerDayId(adId, day);
  let entity = ConsumptionsPerDay.load(id);

  if (entity == null) {
    entity = new ConsumptionsPerDay(id);
    entity.adId = adId.toString();
    entity.day = day;
    entity.consumptions = BigInt.fromI32(0);
    entity.save();
  }

  return entity;
}

function getPublisherEntity(address: string): Publisher {
  let publisherEntity = Publisher.load(address.toString());
  if (publisherEntity == null) {
    publisherEntity = new Publisher(address.toString());
    publisherEntity.adsQuantity = BigInt.fromI32(0);
    publisherEntity.impressions = BigInt.fromI32(0);
    publisherEntity.clicks = BigInt.fromI32(0);
    publisherEntity.conversions = BigInt.fromI32(0);
    publisherEntity.save();
  }
  return publisherEntity;
}

function pushToArray<T>(array: Array<T>, element: T): Array<T> {
  const newArray = new Array<T>(array.length + 1);
  for (let i = 0; i < array.length; i++) {
    newArray[i] = array[i];
  }
  newArray[array.length] = element;
  return newArray;
}

export function handleAdConsumed(event: AdConsumedEvent): void {
  let adEntity = Ad.load(event.params.adId.toString());

  if (adEntity == null) {
    throw new Error('Ad not found. Cannot consume.');
  }

  adEntity.consumptions = adEntity.consumptions.plus(BigInt.fromI32(1));
  const audiences = adEntity.audiences;
  for (let i = 0; i < audiences.length; i++) {
    const audience = Audience.load(audiences[i]);
    if (audience == null) {
      throw new Error('Could not find audience.');
    }
    audience.consumptions = audience.consumptions.plus(BigInt.fromI32(1));
    audience.save();
  }

  const budget = Budget.load(adEntity.advertiser);
  if (budget == null) {
    throw new Error('Could not find budget.');
  }
  budget.remainingBudget = budget.remainingBudget.minus(event.params.consumptionPrice);

  const day = timestampToDay(event.block.timestamp);

  const consumptionPerDay = getConsumptionsPerDay(event.params.adId, day);
  consumptionPerDay.consumptions = consumptionPerDay.consumptions.plus(BigInt.fromI32(1));
  consumptionPerDay.save();

  adEntity.consumptionsPerDay = pushToArray(adEntity.consumptionsPerDay, consumptionPerDay.id);
  adEntity.save();

  let publisherEntity = getPublisherEntity(event.params.publisher.toString());
  publisherEntity.adsQuantity = publisherEntity.adsQuantity.plus(BigInt.fromI32(1));
  if (adEntity.attribution == 0) {
    publisherEntity.impressions = publisherEntity.impressions.plus(BigInt.fromI32(1));
  } else if (adEntity.attribution == 1) {
    publisherEntity.clicks = publisherEntity.clicks.plus(BigInt.fromI32(1));
  } else if (adEntity.attribution == 2) {
    publisherEntity.conversions = publisherEntity.conversions.plus(BigInt.fromI32(1));
  } else {
    throw new Error('Invalid attribution model.');
  }
  publisherEntity.save();

  const advertiser = Advertiser.load(adEntity.advertiser);
  if (advertiser == null) {
    throw new Error('Could not find advertiser.');
  }

  if (adEntity.attribution == 0) {
    advertiser.impressions = advertiser.impressions.plus(BigInt.fromI32(1));
  } else if (adEntity.attribution == 1) {
    advertiser.clicks = advertiser.clicks.plus(BigInt.fromI32(1));
  } else if (adEntity.attribution == 2) {
    advertiser.conversions = advertiser.conversions.plus(BigInt.fromI32(1));
  } else {
    throw new Error('Invalid attribution model.');
  }
  advertiser.save();
}

export function handleAdvertiserBudgetFunded(event: AdvertiserBudgetFundedEvent): void {
  let budget = Budget.load(event.params.advertiser.toHexString());
  if (budget == null) {
    budget = new Budget(event.params.advertiser.toHexString());
  }
  budget.totalBudget = budget.totalBudget.plus(event.params.amount);
  budget.remainingBudget = budget.remainingBudget.plus(event.params.amount);
  budget.save();
}

export function handleAdvertiserBudgetWithdrawn(event: AdvertiserBudgetWithdrawnEvent): void {
  let budget = Budget.load(event.params.advertiser.toHexString());
  if (budget == null) {
    throw new Error('Could not find budget.');
  }
  budget.remainingBudget = budget.remainingBudget.minus(event.params.amount);
  budget.totalBudget = budget.totalBudget.minus(event.params.amount);
  budget.save();
}

export function handleAdDeleted(event: AdDeletedEvent): void {
  let entity = Ad.load(event.params.adId.toString());
  if (entity == null) {
    throw new Error('Ad not found. Cannot delete.');
  }

  let advertiser = Advertiser.load(entity.advertiser);
  if (advertiser == null) {
    throw new Error('Could not find advertiser.');
  }
  advertiser.adsQuantity = advertiser.adsQuantity.minus(BigInt.fromI32(1));

  advertiser.save();

  store.remove('Ad', event.params.adId.toString());
}

export function handleAdEdited(event: AdEditedEvent): void {
  let entity = Ad.load(event.params.adId.toString());

  if (entity == null) {
    entity = new Ad(event.params.adId.toString());
  }

  let advertiser = Advertiser.load(event.params.ad.advertiser.toHexString());
  if (advertiser == null) {
    advertiser = new Advertiser(event.params.ad.advertiser.toHexString());
    advertiser.adsQuantity = BigInt.fromI32(0);
    advertiser.impressions = BigInt.fromI32(0);
    advertiser.clicks = BigInt.fromI32(0);
    advertiser.conversions = BigInt.fromI32(0);
    let budget = Budget.load(event.params.ad.advertiser.toHexString());
    if (budget == null) {
      budget = new Budget(event.params.ad.advertiser.toHexString());
      budget.totalBudget = BigInt.fromI32(0);
      budget.remainingBudget = BigInt.fromI32(0);
      budget.save();
    }
    advertiser.budget = budget.id;
    advertiser.save();
  }

  entity.advertiser = advertiser.id;
  entity.maxBudget = event.params.ad.maxBudget;
  entity.startingTimestamp = event.params.ad.startingTimestamp;
  entity.endingTimestamp = event.params.ad.endingTimestamp;
  entity.currentBudget = event.params.ad.currentBudget;
  entity.metadataURI = event.params.ad.metadataURI;
  entity.consumptions = event.params.ad.consumptions;
  entity.audiences = event.params.ad.audienceIds.map<string>((id) => id.toString());
  entity.blacklistedPublishers = event.params.ad.blacklistedPublishers.map<string>((id) => id.toString());
  entity.blacklistedWeekdays = event.params.ad.blacklistedWeekdays.map<BigInt>((id) => BigInt.fromI32(id));
  entity.maxConsumptionsPerDay = event.params.ad.maxConsumptionsPerDay;
  entity.maxPricePerConsumption = event.params.ad.maxPricePerConsumption;
  entity.attribution = event.params.ad.attribution;
  entity.active = event.params.ad.active;
  entity.consumptionsPerDay = [];

  entity.save();
}

export function handleSegmentEdited(event: SegmentEditedEvent): void {
  let entity = Segment.load(event.params.segmentId.toString());

  if (entity == null) {
    entity = new Segment(event.params.segmentId.toString());
  }

  entity.metadataURI = event.params.metadataURI;
  entity.issuer = event.params.issuer;

  entity.queryCircuitId = event.params.query.circuitId;
  entity.queryOperator = event.params.query.operator;
  entity.querySchema = event.params.query.schema;
  entity.querySlotIndex = event.params.query.slotIndex;
  entity.queryValue = event.params.query.value;

  entity.save();
}

export function handleSegmentDeleted(event: SegmentDeletedEvent): void {
  store.remove('Segment', event.params.segmentId.toString());
}

export function handleAudienceDeleted(event: AudienceDeletedEvent): void {
  store.remove('Audience', event.params.audienceId.toString());
}

export function handleAudienceEdited(event: AudienceEditedEvent): void {
  let entity = Audience.load(event.params.audienceId.toString());

  if (entity == null) {
    entity = new Audience(event.params.audienceId.toString());
    entity.consumptions = BigInt.fromI32(0);
  }

  entity.metadataURI = event.params.metadataURI;
  entity.segments = event.params.segmentIds.map<string>((id) => id.toString());

  entity.save();
}

export function handlePublisherWhitelisted(event: PublisherWhitelisted): void {
  let entity = new Publisher(event.params.publisher.toString());

  entity.active = true;
  entity.cpi = event.params.publisher.cpi;
  entity.cpc = event.params.publisher.cpc;
  entity.cpa = event.params.publisher.cpa;
  entity.usersRewardsPercentage = event.params.publisher.userRewardsPercentage;

  entity.adsQuantity = BigInt.fromI32(0);
  entity.impressions = BigInt.fromI32(0);
  entity.clicks = BigInt.fromI32(0);
  entity.conversions = BigInt.fromI32(0);

  entity.save();
}

export function handlePublisherRemovedFromWhitelist(event: PublisherRemovedFromWhitelist): void {
  store.remove('Publisher', event.params.publisher.toString());
}

export function handlePausePublisher(event: PausePublisherEvent): void {
  let entity = Publisher.load(event.params.publisher.toString());

  if (entity == null) {
    throw new Error('Publisher not found. Cannot pause.');
  }

  entity.active = false;

  entity.save();
}

export function handleUnpausePublisher(event: UnpausePublisherEvent): void {
  let entity = Publisher.load(event.params.publisher.toString());

  if (entity == null) {
    throw new Error('Publisher not found. Cannot unpause.');
  }

  entity.active = true;

  entity.save();
}
