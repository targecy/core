// SPDX-License-Identifier: BUSL-1.1

pragma solidity 0.8.10;

import { ICircuitValidator } from "../interfaces/ICircuitValidator.sol";
import { DataTypes } from "../libraries/DataTypes.sol";

interface TargecyEvents {
  event AdCreated(uint256 indexed adId, address indexed advertiser, DataTypes.NewAd ad);

  event AdEdited(uint256 indexed adId, DataTypes.Ad ad);

  event AdDeleted(uint256 indexed adId);

  event AudienceCreated(uint256 indexed audienceId, string metadataURI, uint256[] segmentIds);

  event AudienceEdited(uint256 indexed audienceId, string metadataURI, uint256[] segmentIds);

  event AudienceDeleted(uint256 indexed audienceId);

  event SegmentCreated(uint256 indexed segmentId, address indexed validator, ICircuitValidator.CircuitQuery query, string metadataURI, uint256 issuer);

  event SegmentEdited(uint256 indexed segmentId, address indexed validator, ICircuitValidator.CircuitQuery query, string metadataURI);

  event SegmentDeleted(uint256 indexed segmentId);

  event AdConsumed(uint256 indexed adId, DataTypes.Ad ad, address publisher, uint256 consumptionPrice);

  event PublisherWhitelisted(address indexed publisher);

  event PublisherRemovedFromWhitelist(address indexed publisher);

  event AdminSet(address indexed admin);

  event AdminRemoved(address indexed admin);
}
