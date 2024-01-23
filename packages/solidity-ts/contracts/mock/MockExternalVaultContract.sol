// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract MockExternalVaultContract {
  uint256 public value;
  address public owner;

  event ValueSet(uint256 indexed value, address indexed owner);

  constructor() {
    value = 0;
    owner = address(0);
  }

  // This function receives both arguments and value on purpose as an example.
  function setValue(bytes calldata _bytes) external payable {
    // Decode params into individual arguments
    (uint256 _value, address _owner) = abi.decode(_bytes, (uint256, address));

    require(_value == msg.value, "MockExternalVaultContract: argument value does not match msg.value");
    require(_value > value, "MockExternalVaultContract: value must be greater than current value");

    value = _value;
    owner = _owner;

    emit ValueSet(value, owner);
  }
}
