// SPDX-License-Identifier: agpl-3.0

pragma solidity 0.8.10;

import { ICircuitValidator } from "../interfaces/ICircuitValidator.sol";
import { DataTypes } from "../libraries/DataTypes.sol";

interface TargecyEvents {
  event AdCreated(uint256 indexed adId, DataTypes.NewAd ad);

  event AdEdited(uint256 indexed adId, string metadataURI, uint256 budget, uint256[] targetGroupIds);

  event AdDeleted(uint256 indexed adId);

  event TargetGroupCreated(uint256 indexed targetGroupId, string metadataURI, uint256[] zkRequestIds);

  event TargetGroupEdited(uint256 indexed targetGroupId, string metadataURI, uint256[] zkRequestIds);

  event TargetGroupDeleted(uint256 indexed targetGroupId);

  event ZKPRequestCreated(uint256 indexed zkRequestId, address indexed validator, ICircuitValidator.CircuitQuery query, string metadataURI, uint256 issuer);

  event ZKPRequestEdited(uint256 indexed zkRequestId, address indexed validator, ICircuitValidator.CircuitQuery query, string metadataURI);

  event ZKPRequestDeleted(uint256 indexed zkRequestId);

  event AdConsumed(uint256 indexed adId, address indexed user, address indexed publisher);

  event PublisherWhitelisted(address indexed publisher);

  event PublisherRemovedFromWhitelist(address indexed publisher);
}
