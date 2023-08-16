// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";

import { Targecy } from "contracts/yourContract.sol";

contract TargecyDeploy is Script {
  function setUp() public {}

  function run() public {
    vm.startBroadcast();
    new Targecy();
    vm.stopBroadcast();
  }
}
