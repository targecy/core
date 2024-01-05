// SPDX-License-Identifier: BUSL-1.1

pragma solidity 0.8.10;

import { Initializable } from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import { PausableUpgradeable } from "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import { ReentrancyGuardUpgradeable } from "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import { OwnableUpgradeable } from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import { AccessControlUpgradeable } from "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

import { ITargecy } from "../interfaces/ITargecy.sol";
import { TargecyStorage } from "./storage/TargecyStorage.sol";
import { TargecyEvents } from "../libraries/TargecyEvents.sol";
import { DataTypes } from "../libraries/DataTypes.sol";
import { Constants } from "../libraries/Constants.sol";
import { Helpers } from "../libraries/Helpers.sol";
import { Errors } from "../libraries/Errors.sol";
import { ICircuitValidator } from "../interfaces/ICircuitValidator.sol";

contract Targecy is Initializable, AccessControlUpgradeable, PausableUpgradeable, ReentrancyGuardUpgradeable, TargecyStorage, ITargecy {
  function initialize(
    address _zkProofsValidator,
    address _protocolVault,
    address targecyAdmin,
    uint256 _defaultIssuer,
    address _relayerAddress
  ) external initializer {
    __AccessControl_init();
    __Pausable_init();

    zkProofsValidator = _zkProofsValidator;
    protocolVault = _protocolVault;
    defaultIssuer = _defaultIssuer;
    relayerAddress = _relayerAddress;

    defaultImpressionPrice = 10000;
    defaultClickPrice = 100000;
    defaultConversionPrice = 1000000;

    _adId = 1;
    _segmentId = 1;
    _audienceId = 1;
    totalconsumptions = 0;

    _grantRole(DEFAULT_ADMIN_ROLE, targecyAdmin);
    emit TargecyEvents.AdminSet(targecyAdmin);
  }

  function setAdmin(address targecyAdmin) external override onlyRole(DEFAULT_ADMIN_ROLE) {
    _setupRole(DEFAULT_ADMIN_ROLE, targecyAdmin);

    emit TargecyEvents.AdminSet(targecyAdmin);
  }

  function removeAdmin(address targecyAdmin) external override onlyRole(DEFAULT_ADMIN_ROLE) {
    revokeRole(DEFAULT_ADMIN_ROLE, targecyAdmin);

    emit TargecyEvents.AdminRemoved(targecyAdmin);
  }

  function setZKProofsValidator(address _zkProofsValidator) external override onlyRole(DEFAULT_ADMIN_ROLE) {
    zkProofsValidator = _zkProofsValidator;
  }

  function setProtocolVault(address _protocolVault) external override onlyRole(DEFAULT_ADMIN_ROLE) {
    protocolVault = _protocolVault;
  }

  function setDefaultImpressionPrice(uint256 _defaultImpressionPrice) external override onlyRole(DEFAULT_ADMIN_ROLE) {
    defaultImpressionPrice = _defaultImpressionPrice;
  }

  function setDefaultClickPrice(uint256 _defaultClickPrice) external override onlyRole(DEFAULT_ADMIN_ROLE) {
    defaultClickPrice = _defaultClickPrice;
  }

  function setRelayerAddress(address _relayerAddress) external override onlyRole(DEFAULT_ADMIN_ROLE) {
    relayerAddress = _relayerAddress;
  }

  function setDefaultConversionPrice(uint256 _defaultConversionPrice) external override onlyRole(DEFAULT_ADMIN_ROLE) {
    defaultConversionPrice = _defaultConversionPrice;
  }

  function setDefaultIssuer(uint256 _defaultIssuer) external override onlyRole(DEFAULT_ADMIN_ROLE) {
    defaultIssuer = _defaultIssuer;
  }

  function setSegment(DataTypes.Segment calldata _segment) external override onlyRole(DEFAULT_ADMIN_ROLE) {
    requestQueries[_segmentId].query.value = _segment.query.value;
    requestQueries[_segmentId].query.operator = _segment.query.operator;
    requestQueries[_segmentId].query.circuitId = _segment.query.circuitId;
    requestQueries[_segmentId].query.slotIndex = _segment.query.slotIndex;
    requestQueries[_segmentId].query.schema = _segment.query.schema;

    requestQueries[_segmentId].metadataURI = _segment.metadataURI;

    // Use given issuer or default issuer
    if (_segment.issuer == 0) {
      requestQueries[_segmentId].issuer = defaultIssuer;
    } else {
      requestQueries[_segmentId].issuer = _segment.issuer;
    }

    emit TargecyEvents.SegmentCreated(_segmentId, address(zkProofsValidator), _segment.query, _segment.metadataURI, _segment.issuer);
    _segmentId += 1;
  }

  function fundAdvertiserBudget(address advertiser) external payable override {
    DataTypes.Budget storage budget = budgets[advertiser];

    budget.totalBudget = budget.totalBudget + msg.value;
    budget.remainingBudget = budget.remainingBudget + msg.value;

    emit TargecyEvents.AdvertiserBudgetFunded(advertiser, msg.value);
  }

  function withdrawAdvertiserBudget(uint256 amount) external override {
    DataTypes.Budget storage budget = budgets[_msgSender()];

    if (budget.remainingBudget < amount) {
      revert Errors.InsufficientFunds();
    }

    budget.remainingBudget = budget.remainingBudget - amount;
    budget.totalBudget = budget.totalBudget - amount;

    payable(budget.advertiser).transfer(amount);

    emit TargecyEvents.AdvertiserBudgetWithdrawn(budget.advertiser, amount);
  }

  function editSegment(uint256 id, DataTypes.Segment calldata _segment) external override onlyRole(DEFAULT_ADMIN_ROLE) {
    requestQueries[id].query.value = _segment.query.value;
    requestQueries[id].query.operator = _segment.query.operator;
    requestQueries[id].query.circuitId = _segment.query.circuitId;
    requestQueries[id].query.slotIndex = _segment.query.slotIndex;
    requestQueries[id].query.schema = _segment.query.schema;

    requestQueries[id].query.circuitId = _segment.query.circuitId;

    emit TargecyEvents.SegmentEdited(id, address(zkProofsValidator), _segment.query, _segment.metadataURI);
  }

  function deleteSegment(uint256 id) external override onlyRole(DEFAULT_ADMIN_ROLE) {
    delete requestQueries[id];

    emit TargecyEvents.SegmentDeleted(id);
  }

  function createAd(DataTypes.NewAd calldata ad) external payable override {
    if (msg.value < ad.budget) {
      revert Errors.InsufficientFunds();
    }

    require(ad.attribution != DataTypes.Attribution.Conversion, "Targecy: Conversion ads are not allowed yet.");

    ads[_adId] = DataTypes.Ad(
      // Properties
      _msgSender(),
      ad.metadataURI,
      ad.attribution,
      ad.active,
      // Action
      ad.abi,
      ad.target,
      // Conditions
      ad.startingTimestamp,
      ad.endingTimestamp,
      ad.audienceIds,
      ad.blacklistedPublishers,
      ad.blacklistedWeekdays,
      // Budget
      ad.budget,
      0,
      ad.maxConsumptionsPerDay,
      ad.maxPricePerConsumption,
      // Stats
      0
    );

    emit TargecyEvents.AdCreated(_adId, _msgSender(), ad);
    _adId += 1;
  }

  function pauseAd(uint256 adId) external override whenNotPaused {
    DataTypes.Ad storage adStorage = ads[adId];

    if (adStorage.advertiser != _msgSender()) {
      revert Errors.NotAdvertiser();
    }

    adStorage.active = false;

    emit TargecyEvents.AdPaused(adId);
  }

  function unpauseAd(uint256 adId) external override whenNotPaused {
    DataTypes.Ad storage adStorage = ads[adId];

    if (adStorage.advertiser != _msgSender()) {
      revert Errors.NotAdvertiser();
    }

    adStorage.active = true;

    emit TargecyEvents.AdUnpaused(adId);
  }

  function editAd(uint256 adId, DataTypes.NewAd calldata ad) external payable override whenNotPaused {
    DataTypes.Ad storage adStorage = ads[adId];

    if (adStorage.advertiser != _msgSender()) {
      revert Errors.NotAdvertiser();
    }

    if (ad.budget > 0) {
      if (ad.budget <= adStorage.currentBudget) {
        // Already spent
        revert Errors.InvalidNewBudget();
      }

      adStorage.maxBudget = ad.budget;
    }

    adStorage.metadataURI = ad.metadataURI;
    adStorage.audienceIds = ad.audienceIds;

    adStorage.blacklistedPublishers = ad.blacklistedPublishers;
    adStorage.blacklistedWeekdays = ad.blacklistedWeekdays;
    adStorage.startingTimestamp = ad.startingTimestamp;
    adStorage.endingTimestamp = ad.endingTimestamp;
    adStorage.maxConsumptionsPerDay = ad.maxConsumptionsPerDay;
    adStorage.maxPricePerConsumption = ad.maxPricePerConsumption;
    adStorage.attribution = ad.attribution;

    emit TargecyEvents.AdEdited(adId, adStorage);
  }

  function deleteAd(uint256 adId) external override whenNotPaused {
    DataTypes.Ad storage adStorage = ads[adId];

    if (adStorage.advertiser != _msgSender()) {
      revert Errors.NotAdvertiser();
    }

    delete ads[adId];

    emit TargecyEvents.AdDeleted(adId);
  }

  function createAudience(string calldata metadataURI, uint256[] calldata audienceIds) external override onlyRole(DEFAULT_ADMIN_ROLE) {
    audiences[_audienceId] = DataTypes.Audience(metadataURI, audienceIds, 0);

    emit TargecyEvents.AudienceCreated(_audienceId, metadataURI, audienceIds);
    _audienceId += 1;
  }

  function editAudience(uint256 audienceId, string calldata metadataURI, uint256[] calldata segmentIds) external override onlyRole(DEFAULT_ADMIN_ROLE) {
    DataTypes.Audience storage audienceStorage = audiences[audienceId];

    if (segmentIds.length == 0) {
      revert Errors.InvalidZKProofsLength();
    }

    audienceStorage.metadataURI = metadataURI;
    audienceStorage.segmentIds = segmentIds;

    emit TargecyEvents.AudienceEdited(audienceId, metadataURI, segmentIds);
  }

  function deleteAudience(uint256 audienceId) external override onlyRole(DEFAULT_ADMIN_ROLE) {
    delete audiences[audienceId];

    emit TargecyEvents.AudienceDeleted(audienceId);
  }

  function verifyZKProof(
    uint256 requestId,
    uint256[] memory inputs,
    uint256[2] memory a,
    uint256[2][2] memory b,
    uint256[2] memory c
  ) public view returns (bool) {
    // sig circuit has 8th public signal as issuer id
    require(inputs.length > 7 && inputs[7] == requestQueries[requestId].issuer, "ZKProofs has an invalid issuer.");

    return ICircuitValidator(zkProofsValidator).verify(inputs, a, b, c, requestQueries[requestId].query);
  }

  function _bulkVerifyZKProofs(
    uint256[] memory audienceIds,
    uint256[][] memory inputs,
    uint256[2][] memory a,
    uint256[2][2][] memory b,
    uint256[2][] memory c
  ) internal view returns (bool) {
    if (audienceIds.length != inputs.length || audienceIds.length != a.length || audienceIds.length != b.length || audienceIds.length != c.length) {
      return false;
    }

    for (uint256 i = 0; i < audienceIds.length; i++) {
      if (!verifyZKProof(audienceIds[i], inputs[i], a[i], b[i], c[i])) {
        return false;
      }
    }

    return true;
  }

  function getConsumptionPrice(
    DataTypes.Attribution attribution,
    DataTypes.PublisherSettings memory publisher
  ) internal view returns (uint256 consumptionPrice) {
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

  function distributeRewards(uint256 adId, address user, DataTypes.Ad storage ad, DataTypes.PublisherSettings memory publisher) internal {
    uint256 consumptionPrice = getConsumptionPrice(ad.attribution, publisher);

    if (consumptionPrice > ad.maxPricePerConsumption) {
      revert Errors.ConsumptionPriceTooHigh();
    }

    uint256 remainingBudget = ad.maxBudget - ad.currentBudget;

    if (consumptionPrice > remainingBudget) {
      revert Errors.InsufficientFunds();
    }

    ad.currentBudget = ad.currentBudget + consumptionPrice;
    ad.consumptions = ad.consumptions + 1;

    // Remaining Budget
    DataTypes.Budget storage budget = budgets[ad.advertiser];
    budget.remainingBudget = budget.remainingBudget - consumptionPrice;

    // Protocol Fee
    uint256 protocolFee = calculatePercentage(consumptionPrice, Constants.PROTOCOL_FEE_PERCENTAGE);
    payable(protocolVault).transfer(protocolFee);

    // User Rewards
    uint256 userRewards = publisher.userRewardsPercentage > 0 ? calculatePercentage(consumptionPrice, publisher.userRewardsPercentage) : 0;
    payable(user).transfer(userRewards);

    // User Rewards
    uint256 publisherFee = consumptionPrice - protocolFee - userRewards;
    payable(publisher.vault).transfer(publisherFee);

    emit TargecyEvents.AdConsumed(adId, ad, publisher, consumptionPrice);
  }

  /// @notice Sets the pause state to true in case of emergency, triggered by an authorized account.
  function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
    _pause();
  }

  /// @notice Sets the pause state to false when threat is gone, triggered by an authorized account.
  function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
    _unpause();
  }

  function _consumeAd(
    address viewer,
    uint64 adId,
    address publisherVault,
    DataTypes.ZKProofs calldata zkProofs,
    bytes[] calldata actionParams
  ) internal nonReentrant {
    DataTypes.Ad storage ad = ads[adId];

    if (ad.currentBudget == ad.maxBudget) {
      revert Errors.AdConsumed();
    }

    DataTypes.Budget storage budget = budgets[ad.advertiser];
    if (budget.remainingBudget < ad.maxPricePerConsumption) {
      revert Errors.InsufficientFunds();
    }

    if (ad.startingTimestamp > block.timestamp || ad.endingTimestamp < block.timestamp) {
      revert Errors.AdNotAvailable();
    }

    DataTypes.PublisherSettings memory publisher = whitelistedPublishers[publisherVault];

    for (uint256 i = 0; i < ad.blacklistedPublishers.length; i++) {
      if (ad.blacklistedPublishers[i] == publisher.vault) {
        revert Errors.PublisherBlacklistedInAd();
      }
    }

    if (publisher.vault == address(0) || publisher.active == false) {
      revert Errors.PublisherNotWhitelisted();
    }

    uint256 weekDay = Helpers.getWeekDayFromTimestamp(block.timestamp);
    for (uint256 i = 0; i < ad.blacklistedWeekdays.length; i++) {
      if (ad.blacklistedWeekdays[i] == weekDay) {
        revert Errors.WeekdayBlacklistedInAd();
      }
    }

    uint256 dayFromEpoch = Helpers.getDayFromEpoch(block.timestamp);
    if (ad.maxConsumptionsPerDay > 0 && (consumptionsPerDay[adId][dayFromEpoch] + 1) > ad.maxConsumptionsPerDay) {
      revert Errors.NoRemainingComsumptionsForTheDay();
    }
    consumptionsPerDay[adId][dayFromEpoch] = consumptionsPerDay[adId][dayFromEpoch] + 1;

    // Verify ZKProofs - At least one Audience must be valid
    bool audienceValidated;
    for (uint256 i = 0; i < ad.audienceIds.length; i++) {
      DataTypes.Audience memory audience = audiences[ad.audienceIds[i]];

      if (audience.segmentIds.length == 0) {
        // Audience does not exists.
        continue;
      }

      if (_bulkVerifyZKProofs(audience.segmentIds, zkProofs.inputs, zkProofs.a, zkProofs.b, zkProofs.c)) {
        audienceValidated = true;
        audience.consumptions = audience.consumptions + 1;
        break;
      }
    }
    if (!audienceValidated) {
      revert Errors.InvalidZKProofsInput();
    }

    totalconsumptions += 1;

    // Proofs verified, distribute rewards
    distributeRewards(adId, viewer, ad, publisher);

    if (ad.attribution == DataTypes.Attribution.Conversion) {
      (bool success, ) = ad.target.delegatecall(abi.encodeWithSignature(ad.abi, actionParams));
      require(success, "Conversion action failed.");
    }
  }

  /**
   * This function is used to consume an ad via a tx initialized by the relayer.
   *
   * @param adId        The id of the ad to be consumed.
   * @param publisher   The publisher that has shown the ad.
   * @param zkProofs    The zk proofs.
   */
  function consumeAdViaRelayer(
    address viewer,
    uint64 adId,
    address publisher,
    DataTypes.ZKProofs calldata zkProofs,
    bytes[] calldata actionParams
  ) external override whenNotPaused {
    require(msg.sender == relayerAddress, "Targecy: Only relayer can call this function");

    _consumeAd(viewer, adId, publisher, zkProofs, actionParams);
  }

  /**
   * This function is used to consume an ad via a tx initialized by the user.
   *
   * @param adId        The id of the ad to be consumed.
   * @param publisher   The publisher that has shown the ad.
   * @param zkProofs    The zk proofs.
   * @param targecySig  Targecy's signature validating that the ad has been seen.
   */
  function consumeAd(
    uint64 adId,
    address publisher,
    DataTypes.ZKProofs calldata zkProofs,
    bytes[] calldata actionParams,
    DataTypes.EIP712Signature calldata targecySig
  ) external override whenNotPaused {
    // Validates Targecy's signature
    require(!usedSigNonces[targecySig.nonce], "Targecy: Signature nonce already used");
    unchecked {
      Helpers._validateRecoveredAddress(
        Helpers._calculateDigest(keccak256(abi.encode(Constants.CONSUME_AD_VERIFICATION_SIG_TYPEHASH, adId, targecySig.nonce, targecySig.deadline))),
        relayerAddress,
        targecySig
      );
    }
    usedSigNonces[targecySig.nonce] = true;

    DataTypes.Ad storage ad = ads[adId];

    if (ad.attribution != DataTypes.Attribution.Conversion) {
      // Only conversions can be consumed directly by the user until we can ensure that the user is not spoofing the call.
      revert Errors.ImpressionOrClickOnlyAvailableThroughRelayer();
    }

    _consumeAd(msg.sender, adId, publisher, zkProofs, actionParams);
  }

  function setPublisher(DataTypes.PublisherSettings memory publisher) external override onlyRole(DEFAULT_ADMIN_ROLE) {
    whitelistedPublishers[publisher.vault] = publisher;

    emit TargecyEvents.PublisherWhitelisted(publisher.vault, publisher);
  }

  function removePublisher(address publisher) external override onlyRole(DEFAULT_ADMIN_ROLE) {
    delete whitelistedPublishers[publisher];

    emit TargecyEvents.PublisherRemovedFromWhitelist(publisher);
  }

  function changePublisherAddress(address oldAddress, address newAddress) external override onlyRole(DEFAULT_ADMIN_ROLE) {
    DataTypes.PublisherSettings memory publisher = whitelistedPublishers[oldAddress];
    delete whitelistedPublishers[oldAddress];
    whitelistedPublishers[newAddress] = publisher;
  }

  function pausePublisher(address publisher) external override onlyRole(DEFAULT_ADMIN_ROLE) {
    whitelistedPublishers[publisher].active = false;

    emit TargecyEvents.PausePublisher(publisher);
  }

  function unpausePublisher(address publisher) external override onlyRole(DEFAULT_ADMIN_ROLE) {
    whitelistedPublishers[publisher].active = true;

    emit TargecyEvents.UnpausePublisher(publisher);
  }

  function calculatePercentage(uint256 total, uint256 percentage) public pure returns (uint256) {
    // if (total < Constants.PERCENTAGES_PRECISION) revert Errors.PercentageTotalTooSmall();
    if (percentage > Constants.PERCENTAGES_PRECISION) revert Errors.PercentageTooBig();

    return (total * percentage) / Constants.PERCENTAGES_PRECISION;
  }

  function getAudienceSegments(uint256 audienceId) external view override returns (uint256[] memory) {
    return audiences[audienceId].segmentIds;
  }

  function getAdAudiences(uint256 adId) external view override returns (uint256[] memory) {
    return ads[adId].audienceIds;
  }
}
