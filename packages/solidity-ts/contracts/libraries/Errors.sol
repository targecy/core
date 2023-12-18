// SPDX-License-Identifier: BUSL-1.1

pragma solidity 0.8.10;

library Errors {
  error PublisherBlacklistedInAd();
  error WeekdayBlacklistedInAd();
  error NoRemainingComsumptionsForTheDay();
  error ConsumptionPriceTooHigh();
  error InvalidNewBudget();
  error InvalidAttribution();
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
