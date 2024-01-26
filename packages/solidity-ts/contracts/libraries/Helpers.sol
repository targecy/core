// SPDX-License-Identifier: BUSL-1.1

pragma solidity 0.8.10;

import { DataTypes } from "./DataTypes.sol";
import { Errors } from "./Errors.sol";
import { Constants } from "./Constants.sol";

import { ICircuitValidator } from "../interfaces/ICircuitValidator.sol";

library Helpers {
  function getDayFromEpoch(uint256 timestamp) internal pure returns (uint256) {
    return timestamp / 86400;
  }

  function getWeekDayFromTimestamp(uint256 timestamp) internal pure returns (uint256) {
    return (timestamp / 86400 + 4) % 7;
  }

  function verifyAudience(
    address validator,
    uint256[][] memory inputs,
    uint256[2][] memory a,
    uint256[2][2][] memory b,
    uint256[2][] memory c,
    uint256[] memory segmentsIds,
    mapping(uint256 => DataTypes.Segment) storage segments
  ) internal view returns (bool) {
    require(a.length == b.length && b.length == c.length && c.length == segmentsIds.length, "Invalid input lengths.");

    for (uint256 i = 0; i < segmentsIds.length; i++) {
      DataTypes.Segment memory segment = segments[segmentsIds[i]];

      if (!Helpers.verifyZKProof(validator, inputs[i], a[i], b[i], c[i], segment)) {
        return false;
      }
    }

    return true;
  }

  function verifyAudiences(
    DataTypes.Ad memory ad,
    DataTypes.ZKProofs calldata zkProofs,
    mapping(uint256 => DataTypes.Audience) storage audiences,
    mapping(uint256 => DataTypes.Segment) storage segments,
    address validator
  ) internal view returns (bool) {
    for (uint256 i = 0; i < ad.audienceIds.length; i++) {
      DataTypes.Audience memory audience = audiences[ad.audienceIds[i]];

      if (audience.segmentIds.length == 0) {
        // Audience does not exists.
        continue;
      }

      if (verifyAudience(validator, zkProofs.inputs, zkProofs.a, zkProofs.b, zkProofs.c, audience.segmentIds, segments)) {
        audience.consumptions = audience.consumptions + 1;
        return true;
      }
    }

    return false;
  }

  function getConsumptionPrice(
    DataTypes.Attribution attribution,
    DataTypes.PublisherSettings memory publisher,
    uint256 defaultImpressionPrice,
    uint256 defaultClickPrice,
    uint256 defaultConversionPrice
  ) internal pure returns (uint256 consumptionPrice) {
    if (attribution == DataTypes.Attribution.Impression) {
      consumptionPrice = publisher.cpi;
      if (consumptionPrice == 0) {
        consumptionPrice = defaultImpressionPrice;
      }
    } else if (attribution == DataTypes.Attribution.Click) {
      consumptionPrice = publisher.cpc;
      if (consumptionPrice == 0) {
        consumptionPrice = defaultClickPrice;
      }
    } else if (attribution == DataTypes.Attribution.Conversion) {
      consumptionPrice = publisher.cpa;
      if (consumptionPrice == 0) {
        consumptionPrice = defaultConversionPrice;
      }
    } else {
      revert Errors.InvalidAttribution();
    }
  }

  function verifyZKProof(
    address validator,
    uint256[] memory inputs,
    uint256[2] memory a,
    uint256[2][2] memory b,
    uint256[2] memory c,
    DataTypes.Segment memory segment
  ) internal view returns (bool) {
    // sig circuit has 8th public signal as issuer id
    require(inputs.length > 7 && inputs[7] == segment.issuer, "ZKProofs has an invalid issuer.");

    return ICircuitValidator(validator).verify(inputs, a, b, c, segment.query);
  }

  function calculatePercentage(uint256 total, uint256 percentage) internal pure returns (uint256) {
    // if (total < Constants.PERCENTAGES_PRECISION) revert Errors.PercentageTotalTooSmall();
    if (percentage > Constants.PERCENTAGES_PRECISION) revert Errors.PercentageTooBig();

    return (total * percentage) / Constants.PERCENTAGES_PRECISION;
  }

  /**
   * @dev Wrapper for ecrecover to reduce code size, used in meta-tx specific functions.
   */
  function _validateRecoveredAddress(bytes32 digest, address expectedAddress, DataTypes.EIP712Signature calldata sig) internal view {
    if (sig.deadline < block.timestamp) revert Errors.SignatureExpired();
    address recoveredAddress = ecrecover(digest, sig.v, sig.r, sig.s);
    if (recoveredAddress == address(0) || recoveredAddress != expectedAddress) revert Errors.SignatureInvalid();
  }

  /**
   * @dev Calculates EIP712 DOMAIN_SEPARATOR based on the current contract and chain ID.
   */
  function _calculateDomainSeparator() internal view returns (bytes32) {
    uint256 chainId;
    assembly {
      chainId := chainid()
    }

    return keccak256(abi.encode(Constants.EIP712_DOMAIN_TYPEHASH, keccak256(bytes(Constants.NAME)), Constants.EIP712_REVISION_HASH, chainId, address(this)));
  }

  /**
   * @dev Calculates EIP712 digest based on the current DOMAIN_SEPARATOR.
   *
   * @param hashedMessage The message hash from which the digest should be calculated.
   *
   * @return bytes32 A 32-byte output representing the EIP712 digest.
   */
  function _calculateDigest(bytes32 hashedMessage) internal view returns (bytes32) {
    bytes32 digest;
    unchecked {
      digest = keccak256(abi.encodePacked("\x19\x01", _calculateDomainSeparator(), hashedMessage));
    }
    return digest;
  }
}
