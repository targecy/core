// SPDX-License-Identifier: agpl-3.0

pragma solidity 0.8.10;

library Constants {
  bytes32 internal constant EIP712_REVISION_HASH = keccak256("1");
  bytes32 internal constant EIP712_DOMAIN_TYPEHASH = keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)");
  string public constant NAME = "Targecy";

  /**
   * @dev The EIP-712 typehash for the "ConsumeAdTargecyVerification" struct used by the contract.
   * @dev The struct contains the following fields:
   * @dev - adId: The ID of the ad being consumed.
   * @dev - nonce: The nonce of the targecy's signature, used to prevent replay attacks.
   */
  bytes32 internal constant CONSUME_AD_VERIFICATION_SIG_TYPEHASH = keccak256("ConsumeAdTargecyVerification(uint256 adId,uint256 nonce,uint256 deadline)");

  uint256 constant PERCENTAGES_PRECISION = 10000;
  uint16 constant PROTOCOL_FEE_PERCENTAGE = 1000; // 10% out of 10000 precision
}
