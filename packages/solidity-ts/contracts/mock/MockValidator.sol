// SPDX-License-Identifier: BUSL-1.1

pragma solidity 0.8.10;

import { ICircuitValidator } from "../interfaces/ICircuitValidator.sol";

contract MockValidator is ICircuitValidator {
  function verify(
    uint256[] memory inputs,
    uint256[2] memory a,
    uint256[2][2] memory b,
    uint256[2] memory c,
    CircuitQuery memory query
  ) external pure returns (bool r) {
    require(inputs.length > 0, "Invalid inputs length");
    require(a.length > 0, "Invalid a length");
    require(b.length > 0, "Invalid b length");
    require(c.length > 0, "Invalid c length");
    require(query.operator > 0, "Invalid operator");

    return true;
  }

  function getCircuitId() external pure returns (string memory id) {
    return "mock";
  }

  function getChallengeInputIndex() external pure returns (uint256 index) {
    return 0;
  }

  function getUserIdInputIndex() external pure returns (uint256 index) {
    return 1;
  }
}
