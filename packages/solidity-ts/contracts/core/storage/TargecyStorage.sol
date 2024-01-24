// SPDX-License-Identifier: BUSL-1.1

pragma solidity 0.8.10;

import { DataTypes } from "../../libraries/DataTypes.sol";
import { ICircuitValidator } from "../../interfaces/ICircuitValidator.sol";

abstract contract TargecyStorage {
  address public zkProofsValidator;
  address public protocolVault;
  address public relayerAddress;

  uint256 public _segmentId;
  uint256 public _adId;
  uint256 public _audienceId;
  uint256 public totalConsumptions;

  uint256 public defaultImpressionPrice;
  uint256 public defaultClickPrice;
  uint256 public defaultConversionPrice;
  uint256 public defaultIssuer;

  mapping(uint256 => bool) public usedSigNonces;
  mapping(uint256 => mapping(uint256 => uint256)) public consumptionsPerDay;

  mapping(address => DataTypes.PublisherSettings) public whitelistedPublishers;
  mapping(uint256 => DataTypes.Ad) public ads;
  mapping(uint256 => DataTypes.Audience) public audiences;
  mapping(uint256 => DataTypes.Segment) public requestQueries;
}
