// SPDX-License-Identifier: agpl-3.0

pragma solidity 0.8.10;

import { DataTypes } from "../../libraries/DataTypes.sol";
import { ICircuitValidator } from "../../interfaces/ICircuitValidator.sol";

abstract contract TargecyStorage {
  address public zkProofsValidator = address(0);
  address public protocolVault = address(0);

  uint256 public _zkRequestId = 1;
  uint256 public _adId = 1;
  uint256 public _targetGroupId = 1;
  uint256 public totalImpressions = 0;

  uint256 public defaultImpressionPrice = 1;

  mapping(address => bool) public whitelistedPublishers;
  mapping(address => uint256) public customImpressionPrices;
  mapping(uint256 => DataTypes.Ad) public ads;
  mapping(uint256 => DataTypes.TargetGroup) public targetGroups;
  mapping(uint256 => DataTypes.ZKPRequest) public requestQueries;
}
