// SPDX-License-Identifier: agpl-3.0

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
