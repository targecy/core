// SPDX-License-Identifier: BUSL-1.1

pragma solidity 0.8.10;

import { DataTypes } from "../libraries/DataTypes.sol";
import { ICircuitValidator } from "../interfaces/ICircuitValidator.sol";

interface ITargecy {
  function setZKProofsValidator(address _zkProofsValidator) external;

  function setProtocolVault(address _protocolVault) external;

  function setSegment(uint256 audienceIdReceived, DataTypes.Segment memory _segment) external;

  function deleteSegment(uint256 audienceId) external;

  function setDefaultImpressionPrice(uint256 _defaultImpressionPrice) external;

  function setDefaultClickPrice(uint256 _defaultClickPrice) external;

  function setDefaultConversionPrice(uint256 _defaultConversionPrice) external;

  function setDefaultIssuer(uint256 _defaultIssuer) external;

  function setRelayerAddress(address _relayerAddress) external;

  function fundAdvertiserBudget(address advertiser, uint256 amount) external;

  function withdrawAdvertiserBudget(uint256 amount) external;

  function pauseAd(uint256 adId) external;

  function unpauseAd(uint256 adId) external;

  function setAd(uint256 adIdReceived, DataTypes.NewAd calldata ad) external payable;

  function deleteAd(uint256 adId) external;

  function consumeAd(uint256 adId, address publisher, DataTypes.ZKProofs calldata zkProofs, bytes[] calldata actionParams) external;

  function consumeAdViaRelayer(address viewer, uint256 adId, address publisher, DataTypes.ZKProofs calldata zkProofs, bytes[] calldata actionParams) external;

  function setAudience(uint256 audienceIdReceived, string calldata metadataURI, uint256[] calldata audienceIds) external;

  function deleteAudience(uint256 audienceId) external;

  function getAudienceSegments(uint256 audienceId) external view returns (uint256[] memory);

  function getAdAudiences(uint256 audienceId) external view returns (uint256[] memory);

  function setPublisher(DataTypes.PublisherSettings memory publisher) external;

  function removePublisher(address publisher) external;

  function changePublisherAddress(address oldAddress, address newAddress) external;

  function pausePublisher(address publisher) external;

  function unpausePublisher(address publisher) external;

  function setAdmin(address targecyAdmin) external;

  function removeAdmin(address targecyAdmin) external;
}
