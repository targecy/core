// SPDX-License-Identifier: BUSL-1.1

pragma solidity 0.8.10;

import { DataTypes } from "../libraries/DataTypes.sol";
import { ICircuitValidator } from "../interfaces/ICircuitValidator.sol";

interface ITargecy {
  function setZKProofsValidator(address _zkProofsValidator) external;

  function setProtocolVault(address _protocolVault) external;

  function setSegment(DataTypes.Segment memory _segment) external;

  function editSegment(uint256 audienceId, DataTypes.Segment memory _segment) external;

  function deleteSegment(uint256 audienceId) external;

  function setDefaultImpressionPrice(uint256 _defaultImpressionPrice) external;

  function setDefaultClickPrice(uint256 _defaultClickPrice) external;

  function setDefaultConversionPrice(uint256 _defaultConversionPrice) external;

  function setDefaultIssuer(uint256 _defaultIssuer) external;

  function createAd(DataTypes.NewAd calldata ad) external payable;

  function editAd(uint256 adId, DataTypes.NewAd calldata ad) external payable;

  function deleteAd(uint256 adId) external;

  function consumeAd(
    uint64 adId,
    DataTypes.PublisherRewards calldata publisher,
    DataTypes.ZKProofs calldata zkProofs,
    DataTypes.EIP712Signature calldata targecySig
  ) external;

  function consumeAdViaRelayer(address viewer, uint64 adId, DataTypes.PublisherRewards calldata publisher, DataTypes.ZKProofs calldata zkProofs) external;

  function createAudience(string calldata metadataURI, uint256[] calldata audienceIds) external;

  function editAudience(uint256 audienceId, string calldata metadataURI, uint256[] calldata audienceIds) external;

  function deleteAudience(uint256 audienceId) external;

  function getAudienceSegments(uint256 audienceId) external view returns (uint256[] memory);

  function getAdAudiences(uint256 audienceId) external view returns (uint256[] memory);

  function whitelistPublisher(address publisher) external;

  function removePublisherFromWhitelist(address publisher) external;

  function setAdmin(address targecyAdmin) external;

  function removeAdmin(address targecyAdmin) external;
}
