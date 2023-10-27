// SPDX-License-Identifier: agpl-3.0

pragma solidity 0.8.10;

import { ICircuitValidator } from "../interfaces/ICircuitValidator.sol";

library DataTypes {
  struct NewAd {
    string metadataURI;
    uint256 budget;
    uint256 maxImpressionPrice;
    uint256 minBlock;
    uint256 maxBlock;
    uint256[] targetGroupIds;
  }

  struct ZKPRequest {
    ICircuitValidator.CircuitQuery query;
    string metadataURI;
  }

  struct TargetGroup {
    string metadataURI;
    uint256[] zkRequestIds;
    uint256 impressions;
  }

  struct Ad {
    address advertiser;
    uint256[] targetGroupIds;
    string metadataURI;
    uint256 totalBudget;
    uint256 remainingBudget;
    uint256 maxImpressionPrice;
    uint256 minBlock;
    uint256 maxBlock;
    uint256 impressions;
  }

  struct ZKProofs {
    uint256[][] inputs;
    uint256[2][] a;
    uint256[2][2][] b;
    uint256[2][] c;
  }

  struct PublisherRewards {
    uint256 percentage; // presicion: 10000
    address publisherVault;
  }
}
