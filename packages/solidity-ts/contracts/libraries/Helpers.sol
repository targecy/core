// SPDX-License-Identifier: BUSL-1.1

pragma solidity 0.8.10;

import { DataTypes } from "./DataTypes.sol";
import { Errors } from "./Errors.sol";
import { Constants } from "./Constants.sol";

library Helpers {
  function getDayFromEpoch(uint256 timestamp) internal pure returns (uint256) {
    return timestamp / 86400;
  }

  function getWeekDayFromTimestamp(uint256 timestamp) internal pure returns (uint256) {
    return (timestamp / 86400 + 4) % 7;
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
