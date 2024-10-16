// SPDX-License-Identifier: BUSL-1.1

pragma solidity 0.8.10;

import { ICircuitValidator } from "../interfaces/ICircuitValidator.sol";

library DataTypes {
  /**
   * @notice A struct containing the necessary information to reconstruct an EIP-712 typed data signature.
   *
   * @param v The signature's recovery parameter.
   * @param r The signature's r parameter.
   * @param s The signature's s parameter
   * @param deadline The signature's deadline
   * @param nonce The signature's nonce
   */
  struct EIP712Signature {
    uint8 v;
    bytes32 r;
    bytes32 s;
    uint256 deadline;
    uint256 nonce;
  }

  enum Attribution {
    Impression, // 0
    Click, // 1
    Conversion // 2
  }
  struct NewAd {
    // Properties
    string metadataURI;
    Attribution attribution; // 0: impression, 1: click, 2: conversion
    bool active;
    // Action
    string abi;
    address target;
    // Conditions
    uint256 startingTimestamp;
    uint256 endingTimestamp;
    uint256[] audienceIds;
    address[] whitelistedPublishers;
    address[] blacklistedPublishers;
    // Budget
    uint256 maxBudget;
    uint256 maxPricePerConsumption;
    uint256 maxConsumptionsPerDay;
  }

  struct Ad {
    // Properties
    address advertiser;
    string metadataURI;
    Attribution attribution; // 0: impression, 1: click, 2: conversion
    bool active;
    // Action
    string abi;
    address target;
    // Conditions
    uint256 startingTimestamp;
    uint256 endingTimestamp;
    uint256[] audienceIds;
    address[] whitelistedPublishers;
    address[] blacklistedPublishers;
    // Budget
    uint256 maxBudget;
    uint256 currentBudget;
    uint256 maxConsumptionsPerDay;
    uint256 maxPricePerConsumption;
    // Stats
    uint256 consumptions;
  }

  struct Budget {
    address advertiser;
    uint256 totalBudget;
    uint256 remainingBudget;
  }

  struct Segment {
    ICircuitValidator.CircuitQuery query;
    string metadataURI;
    uint256 issuer;
  }

  struct Audience {
    string metadataURI;
    uint256[] segmentIds;
    uint256 consumptions;
  }

  struct ZKProofs {
    uint256[][] inputs;
    uint256[2][] a;
    uint256[2][2][] b;
    uint256[2][] c;
  }

  struct PublisherSettings {
    string metadataURI;
    uint256 userRewardsPercentage; // presicion: 10000
    address vault;
    bool active;
    uint256 cpi;
    uint256 cpc;
    uint256 cpa;
  }

  struct RewardsDistribution {
    address publisher;
    uint256 publisherAmount;
    address user;
    uint256 userAmount;
    address vault;
    uint256 protocolAmount;
  }
}
