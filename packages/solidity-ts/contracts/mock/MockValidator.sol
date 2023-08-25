// SPDX-License-Identifier: agpl-3.0

pragma solidity 0.8.10;

import { ICircuitValidator } from "../interfaces/ICircuitValidator.sol";

contract MockValidator is ICircuitValidator {
  function verify(
    uint256[] memory inputs,
    uint256[2] memory a,
    uint256[2][2] memory b,
    uint256[2] memory c,
    CircuitQuery memory query
  ) external view returns (bool r) {
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
