// SPDX-License-Identifier: agpl-3.0

pragma solidity 0.8.10;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { Pausable } from "@openzeppelin/contracts/security/Pausable.sol";

import { ITargecy } from "../interfaces/ITargecy.sol";
import { TargecyStorage } from "./storage/TargecyStorage.sol";
import { Events } from "../libraries/Events.sol";
import { DataTypes } from "../libraries/DataTypes.sol";
import { Constants } from "../libraries/Constants.sol";
import { Errors } from "../libraries/Errors.sol";
import { ICircuitValidator } from "../interfaces/ICircuitValidator.sol";

contract Targecy is TargecyStorage, ITargecy, Ownable, Pausable {
  constructor(
    address _zkProofsValidator,
    address _protocolVault,
    uint256 _defaultImpressionPrice
  ) {
    zkProofsValidator = _zkProofsValidator;
    protocolVault = _protocolVault;
    defaultImpressionPrice = _defaultImpressionPrice;
  }

  function setZKProofsValidator(address _zkProofsValidator) external override onlyOwner {
    zkProofsValidator = _zkProofsValidator;
  }

  function setProtocolVault(address _protocolVault) external override onlyOwner {
    protocolVault = _protocolVault;
  }

  function setDefaultImpressionPrice(uint256 _defaultImpressionPrice) external override onlyOwner {
    defaultImpressionPrice = _defaultImpressionPrice;
  }

  function setZKPRequest(DataTypes.ZKPRequest calldata _zkpRequest) external override onlyOwner {
    requestQueries[_zkRequestId].query.value = _zkpRequest.query.value;
    requestQueries[_zkRequestId].query.operator = _zkpRequest.query.operator;
    requestQueries[_zkRequestId].query.circuitId = _zkpRequest.query.circuitId;
    requestQueries[_zkRequestId].query.slotIndex = _zkpRequest.query.slotIndex;
    requestQueries[_zkRequestId].query.schema = _zkpRequest.query.schema;

    requestQueries[_zkRequestId].query.circuitId = _zkpRequest.query.circuitId;

    if (address(_zkpRequest.validator) == address(0)) {
      requestQueries[_zkRequestId].validator = ICircuitValidator(zkProofsValidator);
    } else {
      requestQueries[_zkRequestId].validator = ICircuitValidator(_zkpRequest.validator);
    }

    emit Events.ZKPRequestCreated(_zkRequestId, address(requestQueries[_zkRequestId].validator), _zkpRequest.query, _zkpRequest.metadataURI);
    _zkRequestId++;
  }

  function editZKPRequest(uint256 id, DataTypes.ZKPRequest calldata _zkpRequest) external override onlyOwner {
    requestQueries[id].query.value = _zkpRequest.query.value;
    requestQueries[id].query.operator = _zkpRequest.query.operator;
    requestQueries[id].query.circuitId = _zkpRequest.query.circuitId;
    requestQueries[id].query.slotIndex = _zkpRequest.query.slotIndex;
    requestQueries[id].query.schema = _zkpRequest.query.schema;

    requestQueries[id].query.circuitId = _zkpRequest.query.circuitId;

    if (address(_zkpRequest.validator) == address(0)) {
      requestQueries[id].validator = ICircuitValidator(zkProofsValidator);
    } else {
      requestQueries[id].validator = ICircuitValidator(_zkpRequest.validator);
    }

    emit Events.ZKPRequestEdited(id, address(requestQueries[id].validator), _zkpRequest.query, _zkpRequest.metadataURI);
  }

  function deleteZKPRequest(uint256 id) external override onlyOwner {
    delete requestQueries[id];

    emit Events.ZKPRequestDeleted(id);
  }

  function createAd(DataTypes.NewAd calldata ad) external payable override {
    if (msg.value < ad.budget) {
      revert Errors.InsufficientFunds();
    }

    ads[_adId] = DataTypes.Ad(_msgSender(), ad.targetGroupIds, ad.metadataURI, ad.budget, ad.budget, ad.maxImpressionPrice, ad.minBlock, ad.maxBlock, 0);

    emit Events.AdCreated(_adId, ad.metadataURI, ad.budget, ad.targetGroupIds);
    _adId++;
  }

  // TODO Add edit and delete ad, target group and zk request.

  function editAd(uint256 adId, DataTypes.NewAd calldata ad) external payable override whenNotPaused {
    DataTypes.Ad storage adStorage = ads[adId];

    if (adStorage.advertiser != _msgSender()) {
      revert Errors.NotAdvertiser();
    }

    if (ad.budget > 0) {
      if (ad.budget < (adStorage.totalBudget - adStorage.remainingBudget)) {
        // Already spent
        revert Errors.InvalidNewBudget();
      } else if (ad.budget < adStorage.totalBudget) {
        // Lowering budget
        payable(_msgSender()).transfer(adStorage.totalBudget - ad.budget);
      } else if (ad.budget > adStorage.totalBudget) {
        // Increasing budget
        if (msg.value != (adStorage.totalBudget - ad.budget)) {
          revert Errors.InsufficientFunds();
        }
      }

      uint256 alreadyConsumed = adStorage.totalBudget - adStorage.remainingBudget;
      adStorage.remainingBudget = ad.budget - alreadyConsumed;
      adStorage.totalBudget = ad.budget;
    }

    adStorage.metadataURI = ad.metadataURI;
    adStorage.targetGroupIds = ad.targetGroupIds;

    emit Events.AdEdited(adId, ad.metadataURI, ad.budget, ad.targetGroupIds);
  }

  function deleteAd(uint256 adId) external override whenNotPaused {
    DataTypes.Ad storage adStorage = ads[adId];

    if (adStorage.advertiser != _msgSender()) {
      revert Errors.NotAdvertiser();
    }

    payable(_msgSender()).transfer(adStorage.remainingBudget);

    delete ads[adId];

    emit Events.AdDeleted(adId);
  }

  function createTargetGroup(string calldata metadataURI, uint256[] calldata zkRequestIds) external override onlyOwner {
    targetGroups[_targetGroupId] = DataTypes.TargetGroup(metadataURI, zkRequestIds, 0);

    emit Events.TargetGroupCreated(_targetGroupId, metadataURI, zkRequestIds);
    _targetGroupId++;
  }

  function editTargetGroup(
    uint256 targetGroupId,
    string calldata metadataURI,
    uint256[] calldata zkRequestIds
  ) external override onlyOwner {
    DataTypes.TargetGroup storage targetGroupStorage = targetGroups[targetGroupId];

    if (zkRequestIds.length == 0) {
      revert Errors.InvalidZKProofsLength();
    }

    targetGroupStorage.metadataURI = metadataURI;
    targetGroupStorage.zkRequestIds = zkRequestIds;

    emit Events.TargetGroupEdited(targetGroupId, metadataURI, zkRequestIds);
  }

  function deleteTargetGroup(uint256 targetGroupId) external override onlyOwner {
    delete targetGroups[targetGroupId];

    emit Events.TargetGroupDeleted(targetGroupId);
  }

  function verifyZKProof(
    uint256 requestId,
    uint256[] memory inputs,
    uint256[2] memory a,
    uint256[2][2] memory b,
    uint256[2] memory c
  ) public view returns (bool) {
    require(requestQueries[requestId].validator != ICircuitValidator(address(0)), "validator is not set for this request id");
    require(requestQueries[requestId].query.schema != 0, "query is not set for this request id");

    if (!requestQueries[requestId].validator.verify(inputs, a, b, c, requestQueries[requestId].query)) {
      return false;
    }

    return true;
  }

  function _bulkVerifyZKProofs(
    uint256[] memory zkRequestIds,
    uint256[][] memory inputs,
    uint256[2][] memory a,
    uint256[2][2][] memory b,
    uint256[2][] memory c
  ) internal view returns (bool) {
    if (zkRequestIds.length != inputs.length || zkRequestIds.length != a.length || zkRequestIds.length != b.length || zkRequestIds.length != c.length) {
      return false;
    }

    for (uint256 i = 0; i < zkRequestIds.length; i++) {
      if (!verifyZKProof(zkRequestIds[i], inputs[i], a[i], b[i], c[i])) {
        return false;
      }
    }

    return true;
  }

  function distributeRewards(DataTypes.Ad storage ad, DataTypes.PublisherRewards calldata publisher) internal {
    uint256 impressionPrice = _getImpressionPrice(_msgSender());

    if (impressionPrice > ad.maxImpressionPrice) {
      revert Errors.ImpressionPriceTooHigh();
    }

    if (impressionPrice > ad.remainingBudget) {
      revert Errors.InsufficientFunds();
    }

    ad.remainingBudget = ad.remainingBudget - impressionPrice;
    ad.impressions = ad.impressions + 1;

    // Protocol Fee
    uint256 protocolFee = calculatePercentage(impressionPrice, Constants.PROTOCOL_FEE_PERCENTAGE);
    payable(protocolVault).transfer(protocolFee);

    // Publisher Fee
    uint256 publisherFee;
    if (publisher.percentage > 0) {
      if (publisher.percentage > (Constants.PERCENTAGES_PRECISION - Constants.PROTOCOL_FEE_PERCENTAGE)) {
        revert Errors.PublisherPercentageTooBig();
      }
      publisherFee = calculatePercentage(impressionPrice, publisher.percentage);
      payable(publisher.publisherVault).transfer(publisherFee);
    }

    // User Rewards
    uint256 userRewards = impressionPrice - protocolFee - publisherFee;
    payable(_msgSender()).transfer(userRewards);
  }

  function consumeAd(
    uint64 adId,
    DataTypes.PublisherRewards calldata publisher,
    DataTypes.ZKProofs calldata zkProofs
  ) external override whenNotPaused {
    DataTypes.Ad storage ad = ads[adId];

    if (ad.remainingBudget == 0) {
      revert Errors.AdConsumed();
    }

    if (ad.minBlock > block.number || ad.maxBlock < block.number) {
      revert Errors.AdNotAvailable();
    }

    // Verify ZKProofs - At least one TargetGroup must be valid
    bool targetGroupValidated;
    for (uint256 i = 0; i < ad.targetGroupIds.length; i++) {
      DataTypes.TargetGroup memory targetGroup = targetGroups[ad.targetGroupIds[i]];

      if (targetGroup.zkRequestIds.length == 0) {
        // TargetGroup does not exists.
        continue;
      }

      if (_bulkVerifyZKProofs(targetGroup.zkRequestIds, zkProofs.inputs, zkProofs.a, zkProofs.b, zkProofs.c)) {
        targetGroupValidated = true;
        targetGroup.impressions = targetGroup.impressions + 1;
        break;
      }
    }
    if (!targetGroupValidated) {
      revert Errors.InvalidZKProofsInput();
    }

    // TODO: Missing security validations:
    // Avoid spoofing (limit ads per wallet per block range?)
    // Avoid reutilization of proofs (wallet signature?)
    // Accept user's signature (for gasless txs)
    // TODO: Validate publisher's signature to avoid calls from code.

    if (publisher.percentage > 0 && publisher.publisherVault != address(0) && whitelistedPublishers[publisher.publisherVault] == false) {
      // The call should come from an whitelisted publisher
      revert Errors.PublisherNotWhitelisted();
    }

    totalImpressions++;

    // Proofs verified, distribute rewards
    distributeRewards(ad, publisher);

    emit Events.AdConsumed(adId, _msgSender(), publisher.publisherVault);
  }

  function whitelistPublisher(address publisher) external override onlyOwner {
    whitelistedPublishers[publisher] = true;

    emit Events.PublisherWhitelisted(publisher);
  }

  function removePublisherFromWhitelist(address publisher) external override onlyOwner {
    whitelistedPublishers[publisher] = false;

    emit Events.PublisherRemovedFromWhitelist(publisher);
  }

  function _getImpressionPrice(address addr) internal view returns (uint256) {
    if (customImpressionPrices[addr] != 0) {
      return customImpressionPrices[addr];
    }

    return defaultImpressionPrice;
  }

  function calculatePercentage(uint256 total, uint256 percentage) public pure returns (uint256) {
    // if (total < Constants.PERCENTAGES_PRECISION) revert Errors.PercentageTotalTooSmall();
    if (percentage > Constants.PERCENTAGES_PRECISION) revert Errors.PercentageTooBig();

    return (total * percentage) / Constants.PERCENTAGES_PRECISION;
  }

  function getTargetGroupZKRequests(uint256 targetGroupId) external view override returns (uint256[] memory) {
    return targetGroups[targetGroupId].zkRequestIds;
  }

  function getAdTargetGroups(uint256 adId) external view override returns (uint256[] memory) {
    return ads[adId].targetGroupIds;
  }
}
