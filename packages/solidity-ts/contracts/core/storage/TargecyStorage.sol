// SPDX-License-Identifier: agpl-3.0

pragma solidity 0.8.10;

import { DataTypes } from "../../libraries/DataTypes.sol";
import { ICircuitValidator } from "../../interfaces/ICircuitValidator.sol";

abstract contract TargecyStorage {
  address public zkProofsValidator;
  address public protocolVault;
  address public relayerAddress;

  uint256 public _zkRequestId;
  uint256 public _adId;
  uint256 public _targetGroupId;
  uint256 public totalImpressions;

  uint256 public defaultImpressionPrice;

  mapping(uint256 => bool) public usedSigNonces;

  mapping(address => bool) public whitelistedPublishers;
  mapping(address => uint256) public customImpressionPrices;
  mapping(uint256 => DataTypes.Ad) public ads;
  mapping(uint256 => DataTypes.TargetGroup) public targetGroups;
  mapping(uint256 => DataTypes.ZKPRequest) public requestQueries;
}
