import {
  AdConsumed as AdConsumedEvent,
  AdCreated as AdCreatedEvent,
  AdDeleted as AdDeletedEvent,
  AdEdited as AdEditedEvent,
  PublisherRemovedFromWhitelist,
  PublisherWhitelisted,
  TargetGroupCreated as TargetGroupCreatedEvent,
  TargetGroupDeleted as TargetGroupDeletedEvent,
  TargetGroupEdited as TargetGroupEditedEvent,
  ZKPRequestCreated as ZKPRequestCreatedEvent,
} from '../generated/Targecy/Targecy';
import { Ad, Publisher, TargetGroup, User, ZKPRequest } from '../generated/schema';
import { BigInt, store } from '@graphprotocol/graph-ts';
import { log } from '@graphprotocol/graph-ts';

export function handleAdConsumed(event: AdConsumedEvent): void {
  let adEntity = Ad.load(event.params.adId.toString());

  if (adEntity == null) {
    // LOG SOMETHING
    return;
  }
  adEntity.impressions = adEntity.impressions.plus(BigInt.fromI32(1));
  // Todo add budget changes
  adEntity.save();

  let userEntity = User.load(event.params.user.toString());
  if (userEntity == null) {
    userEntity = new User(event.params.user.toString());
    userEntity.impressions = BigInt.fromI32(1);
  } else {
    userEntity.impressions = userEntity.impressions.plus(BigInt.fromI32(1));
  }
  userEntity.save();

  let publisherEntity = Publisher.load(event.params.publisher.toString());
  if (publisherEntity == null) {
    publisherEntity = new Publisher(event.params.publisher.toString());
    publisherEntity.impressions = BigInt.fromI32(1);
  } else {
    publisherEntity.impressions = publisherEntity.impressions.plus(BigInt.fromI32(1));
  }
  publisherEntity.save();
}

export function handleAdCreated(event: AdCreatedEvent): void {
  let entity = new Ad(event.params.adId.toString());

  entity.metadataURI = event.params.ad.metadataURI;
  entity.totalBudget = event.params.ad.budget;
  entity.remainingBudget = event.params.ad.budget;
  entity.minBlock = event.params.ad.minBlock;
  entity.maxBlock = event.params.ad.maxBlock;
  entity.maxImpressionPrice = event.params.ad.maxImpressionPrice;

  entity.targetGroups = event.params.ad.targetGroupIds.map<string>((id) => id.toString());
  entity.impressions = BigInt.fromI32(0);

  let adv = event.params.advertiser.toHexString();
  let advertiser = User.load(adv);
  if (advertiser == null) {
    advertiser = new User(adv);
    advertiser.impressions = BigInt.fromI32(0);
    advertiser.save();
  }

  entity.advertiser = adv;

  entity.save();
}

export function handleAdDeleted(event: AdDeletedEvent): void {
  store.remove('Ad', event.params.adId.toString());
}

export function handleAdEdited(event: AdEditedEvent): void {
  let entity = Ad.load(event.params.adId.toString());

  if (entity == null) {
    // LOG SOMETHING
    return;
  }

  entity.metadataURI = event.params.metadataURI;
  entity.totalBudget = event.params.budget;
  entity.targetGroups = event.params.targetGroupIds.map<string>((id) => id.toString());

  entity.save();
}

export function handleTargetGroupCreated(event: TargetGroupCreatedEvent): void {
  let entity = new TargetGroup(event.params.targetGroupId.toString());

  entity.metadataURI = event.params.metadataURI;
  entity.zkRequests = event.params.zkRequestIds.map<string>((id) => id.toString());

  entity.save();
}

export function handleTargetGroupDeleted(event: TargetGroupDeletedEvent): void {
  store.remove('TargetGroup', event.params.targetGroupId.toString());
}

export function handleTargetGroupEdited(event: TargetGroupEditedEvent): void {
  let entity = TargetGroup.load(event.params.targetGroupId.toString());

  if (entity == null) {
    // LOG SOMETHING
    return;
  }

  entity.metadataURI = event.params.metadataURI;
  entity.zkRequests = event.params.zkRequestIds.map<string>((id) => id.toString());

  entity.save();
}

export function handleZKPRequestCreated(event: ZKPRequestCreatedEvent): void {
  log.debug('handleZKPRequestCreated for id: {}', [event.params.zkRequestId.toString()]);
  log.debug('handleZKPRequestCreated metadataURI: {}', [event.params.metadataURI]);
  log.debug('asd', []);

  let entity = new ZKPRequest(event.params.zkRequestId.toString());

  entity.metadataURI = event.params.metadataURI;
  entity.validator = event.params.validator;

  entity.query_circuitId = event.params.query.circuitId;
  entity.query_operator = event.params.query.operator;
  entity.query_schema = event.params.query.schema;
  entity.query_slotIndex = event.params.query.slotIndex;
  entity.query_value = event.params.query.value;

  entity.save();

  log.info('New entity saved for id: {}', [entity.id.toString()]);
}

export function handlePublisherWhitelisted(event: PublisherWhitelisted): void {
  let entity = new Publisher(event.params.publisher.toString());
  entity.impressions = BigInt.fromI32(0);
  entity.save();
}

export function handlePublisherRemovedFromWhitelist(event: PublisherRemovedFromWhitelist): void {
  store.remove('Publisher', event.params.publisher.toString());
}
