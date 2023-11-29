// SPDX-License-Identifier: agpl-3.0

pragma solidity 0.8.10;

import { DataTypes } from "../libraries/DataTypes.sol";
import { ICircuitValidator } from "../interfaces/ICircuitValidator.sol";

interface ITargecy {
  function setZKProofsValidator(address _zkProofsValidator) external;

  function setProtocolVault(address _protocolVault) external;

  function setZKPRequest(DataTypes.ZKPRequest memory _zkpRequest) external;

  function editZKPRequest(uint256 zkRequestId, DataTypes.ZKPRequest memory _zkpRequest) external;

  function deleteZKPRequest(uint256 zkRequestId) external;

  function setDefaultImpressionPrice(uint256 _defaultImpressionPrice) external;

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

  function createTargetGroup(string calldata metadataURI, uint256[] calldata zkRequestIds) external;

  function editTargetGroup(uint256 targetGroupId, string calldata metadataURI, uint256[] calldata zkRequestIds) external;

  function deleteTargetGroup(uint256 targetGroupId) external;

  function getTargetGroupZKRequests(uint256 targetGroupId) external view returns (uint256[] memory);

  function getAdTargetGroups(uint256 targetGroupId) external view returns (uint256[] memory);

  function whitelistPublisher(address publisher) external;

  function removePublisherFromWhitelist(address publisher) external;
}
