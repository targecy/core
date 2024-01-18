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

  function setSegment(uint256 idReceived, DataTypes.Segment calldata _segment) external override onlyRole(DEFAULT_ADMIN_ROLE) {
    uint256 idToUse = idReceived;
    if (idToUse == 0) {
      idToUse = _segmentId;
      _segmentId += 1;
    }

    requestQueries[idToUse] = _segment;

    // Use given issuer or default issuer
    if (_segment.issuer == 0) {
      requestQueries[idToUse].issuer = defaultIssuer;
    } else {
      requestQueries[idToUse].issuer = _segment.issuer;
    }

    emit TargecyEvents.SegmentEdited(idToUse, address(zkProofsValidator), _segment.query, _segment.metadataURI);
  }

  function fundAdvertiserBudget(address advertiser) external payable override {
    DataTypes.Budget storage budget = budgets[advertiser];

    budget.advertiser = advertiser;
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

  function deleteSegment(uint256 id) external override onlyRole(DEFAULT_ADMIN_ROLE) {
    delete requestQueries[id];

    emit TargecyEvents.SegmentDeleted(id);
  }

  function setAd(uint256 adIdReceived, DataTypes.NewAd calldata ad) external payable override whenNotPaused {
    uint256 adId = adIdReceived;
    if (adId == 0) {
      adId = _adId;
      _adId += 1;
    }

    DataTypes.Ad storage adStorage = ads[adId];

    if (adStorage.maxBudget > 0) {
      // Edit
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
    } else {
      ads[adId] = DataTypes.Ad(
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
    }

    emit TargecyEvents.AdEdited(adId, adStorage);
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

  function deleteAd(uint256 adId) external override whenNotPaused {
    DataTypes.Ad storage adStorage = ads[adId];

    if (adStorage.advertiser != _msgSender()) {
      revert Errors.NotAdvertiser();
    }

    delete ads[adId];

    emit TargecyEvents.AdDeleted(adId);
  }

  function setAudience(uint256 audienceIdReceived, string calldata metadataURI, uint256[] calldata segmentIds) external override onlyRole(DEFAULT_ADMIN_ROLE) {
    if (segmentIds.length == 0) {
      revert Errors.AudiencesMustHaveAtLeastOneSegment();
    }

    uint256 idToUse = audienceIdReceived;
    if (idToUse == 0) {
      idToUse = _audienceId;
      _audienceId += 1;
    }

    DataTypes.Audience storage audience = audiences[audienceIdReceived];
    if (audience.segmentIds.length == 0) {
      // Create
      audiences[idToUse] = DataTypes.Audience(metadataURI, segmentIds, 0);
    } else {
      audience.metadataURI = metadataURI;
      audience.segmentIds = segmentIds;
    }

    emit TargecyEvents.AudienceEdited(idToUse, metadataURI, segmentIds);
  }

  function deleteAudience(uint256 audienceId) external override onlyRole(DEFAULT_ADMIN_ROLE) {
    delete audiences[audienceId];

    emit TargecyEvents.AudienceDeleted(audienceId);
  }

  function distributeRewards(uint256 adId, address user, DataTypes.Ad storage ad, DataTypes.PublisherSettings memory publisher) internal {
    uint256 consumptionPrice = Helpers.getConsumptionPrice(ad.attribution, publisher, defaultImpressionPrice, defaultClickPrice, defaultConversionPrice);

    // Ad Budget's limitations
    if (consumptionPrice > ad.maxPricePerConsumption) {
      revert Errors.ConsumptionPriceTooHigh(); // Advertiser does not agree with the price
    }
    uint256 adRemainingBudget = ad.maxBudget - ad.currentBudget;
    if (consumptionPrice > adRemainingBudget) {
      revert Errors.InsufficientFunds(); // Ad's max budget has been reached
    }
    ad.currentBudget = ad.currentBudget + consumptionPrice;
    ad.consumptions = ad.consumptions + 1;

    // Advertiser's Core Budget
    DataTypes.Budget storage budget = budgets[ad.advertiser];
    if (consumptionPrice > budget.remainingBudget) {
      revert Errors.InsufficientFunds(); // Advertiser's core budget limit has been reached
    }
    budget.remainingBudget = budget.remainingBudget - consumptionPrice;

    // Protocol Fee
    uint256 protocolFee = Helpers.calculatePercentage(consumptionPrice, Constants.PROTOCOL_FEE_PERCENTAGE);
    payable(protocolVault).transfer(protocolFee);

    // User Rewards
    uint256 userRewards = publisher.userRewardsPercentage > 0 ? Helpers.calculatePercentage(consumptionPrice, publisher.userRewardsPercentage) : 0;
    payable(user).transfer(userRewards);

    // User Rewards
    uint256 publisherFee = consumptionPrice - protocolFee - userRewards;
    payable(publisher.vault).transfer(publisherFee);

    emit TargecyEvents.RewardsDistributed(adId, DataTypes.RewardsDistribution(publisher.vault, publisherFee, user, userRewards, protocolVault, protocolFee));
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
    uint256 adId,
    address publisherVault,
    DataTypes.ZKProofs calldata zkProofs,
    bytes[] calldata actionParams
  ) internal nonReentrant {
    DataTypes.Ad storage ad = ads[adId];

    if (ad.currentBudget == ad.maxBudget) {
      revert Errors.AdConsumed();
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

    if (!Helpers.verifyAudiences(ad, zkProofs, audiences, requestQueries, zkProofsValidator)) revert Errors.InvalidZKProofsInput();

    totalconsumptions += 1;

    // Proofs verified, distribute rewards
    distributeRewards(adId, viewer, ad, publisher);

    if (ad.attribution == DataTypes.Attribution.Conversion) {
      (bool success, ) = ad.target.call(abi.encodeWithSignature(ad.abi, actionParams));
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
    uint256 adId,
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
   */
  function consumeAd(uint256 adId, address publisher, DataTypes.ZKProofs calldata zkProofs, bytes[] calldata actionParams) external override whenNotPaused {
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

  function getAudienceSegments(uint256 audienceId) external view override returns (uint256[] memory) {
    return audiences[audienceId].segmentIds;
  }

  function getAdAudiences(uint256 adId) external view override returns (uint256[] memory) {
    return ads[adId].audienceIds;
  }
}
