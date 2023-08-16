// SPDX-License-Identifier: agpl-3.0

pragma solidity 0.8.10;

library Errors {
  error ImpressionPriceTooHigh();
  error InvalidNewBudget();
  error InvalidZKProofsLength();
  error AdConsumed();
  error AdNotAvailable();
  error InsufficientFunds();
  error NotAdvertiser();
  error PublisherNotWhitelisted();
  error PublisherPercentageTooBig();
  error PercentageTotalTooSmall();
  error PercentageTooBig();
  error SignatureInvalid();
  error SignatureExpired();
  error InvalidProofs();
  error InvalidZKProof();
  error InvalidZKProofsInput();
  error UseConsumeAdMethodInstead();
}
