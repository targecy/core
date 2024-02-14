// SPDX-License-Identifier: BUSL-1.1

pragma solidity 0.8.10;

import { Initializable } from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import { PausableUpgradeable } from "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import { ReentrancyGuardUpgradeable } from "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import { OwnableUpgradeable } from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import { AccessControlUpgradeable } from "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import { ITargecy } from "../interfaces/ITargecy.sol";
import { TargecyStorage } from "./storage/TargecyStorage.sol";
import { TargecyEvents } from "../libraries/TargecyEvents.sol";
import { DataTypes } from "../libraries/DataTypes.sol";
import { Constants } from "../libraries/Constants.sol";
import { Helpers } from "../libraries/Helpers.sol";
import { Errors } from "../libraries/Errors.sol";

contract Targecy is Initializable, AccessControlUpgradeable, PausableUpgradeable, ReentrancyGuardUpgradeable, TargecyStorage, ITargecy {
  function initialize(address _validator, address _vault, address targecyAdmin, uint256 _defaultIssuer, address _relayer, address _erc20) external initializer {
    __AccessControl_init();
    __Pausable_init();

    validator = _validator;
    vault = _vault;
    defaultIssuer = _defaultIssuer;
    relayer = _relayer;
    erc20 = _erc20;

    defaultImpressionPrice = 10000;
    defaultClickPrice = 100000;
    defaultConversionPrice = 1000000;

    _adId = 1;
    _segmentId = 1;
    _audienceId = 1;
    totalConsumptions = 0;

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

  function setValidator(address _validator) external override onlyRole(DEFAULT_ADMIN_ROLE) {
    validator = _validator;
  }

  function setVault(address _vault) external override onlyRole(DEFAULT_ADMIN_ROLE) {
    vault = _vault;
  }

  function setDefaultImpressionPrice(uint256 _defaultImpressionPrice) external override onlyRole(DEFAULT_ADMIN_ROLE) {
    defaultImpressionPrice = _defaultImpressionPrice;
  }

  function setDefaultClickPrice(uint256 _defaultClickPrice) external override onlyRole(DEFAULT_ADMIN_ROLE) {
    defaultClickPrice = _defaultClickPrice;
  }

  function setRelayer(address _relayer) external override onlyRole(DEFAULT_ADMIN_ROLE) {
    relayer = _relayer;
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

    segments[idToUse] = _segment;

    // Use given issuer or default issuer
    if (_segment.issuer == 0) {
      segments[idToUse].issuer = defaultIssuer;
    } else {
      segments[idToUse].issuer = _segment.issuer;
    }

    emit TargecyEvents.SegmentEdited(idToUse, segments[idToUse].issuer, _segment.query, _segment.metadataURI);
  }

  function fundAdvertiserBudget(address advertiser, uint256 amount) external override {
    if (!IERC20(erc20).transferFrom(msg.sender, address(this), amount)) {
      revert Errors.CouldNotMakeTransfer();
    }

    DataTypes.Budget storage budget = budgets[advertiser];
    budget.advertiser = advertiser;
    budget.totalBudget = budget.totalBudget + amount;
    budget.remainingBudget = budget.remainingBudget + amount;

    emit TargecyEvents.AdvertiserBudgetFunded(advertiser, amount);
  }

  function withdrawAdvertiserBudget(uint256 amount) external override {
    DataTypes.Budget storage budget = budgets[_msgSender()];

    if (budget.remainingBudget < amount) {
      revert Errors.InsufficientFunds();
    }

    budget.remainingBudget = budget.remainingBudget - amount;
    budget.totalBudget = budget.totalBudget - amount;

    if (!IERC20(erc20).transfer(msg.sender, amount)) revert Errors.CouldNotMakeTransfer();

    emit TargecyEvents.AdvertiserBudgetWithdrawn(budget.advertiser, amount);
  }

  function deleteSegment(uint256 id) external override onlyRole(DEFAULT_ADMIN_ROLE) {
    delete segments[id];

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

      if (ad.maxBudget > 0) {
        if (ad.maxBudget <= adStorage.currentBudget) {
          // Already spent
          revert Errors.InvalidNewBudget();
        }

        adStorage.maxBudget = ad.maxBudget;
      }

      adStorage.metadataURI = ad.metadataURI;
      adStorage.audienceIds = ad.audienceIds;

      adStorage.whitelistedPublishers = ad.whitelistedPublishers;
      adStorage.blacklistedPublishers = ad.blacklistedPublishers;
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
        ad.whitelistedPublishers,
        ad.blacklistedPublishers,
        // Budget
        ad.maxBudget,
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
    DataTypes.Ad storage ad = ads[adId];

    if (ad.advertiser != _msgSender()) {
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
    if (!IERC20(erc20).transfer(vault, protocolFee)) revert Errors.CouldNotMakeTransfer();

    // User Rewards
    uint256 userRewards = Helpers.calculatePercentage(consumptionPrice, publisher.userRewardsPercentage);
    if (!IERC20(erc20).transfer(user, userRewards)) revert Errors.CouldNotMakeTransfer();

    // User Rewards
    uint256 publisherFee = consumptionPrice - protocolFee - userRewards;
    if (!IERC20(erc20).transfer(publisher.vault, publisherFee)) revert Errors.CouldNotMakeTransfer();

    emit TargecyEvents.RewardsDistributed(adId, DataTypes.RewardsDistribution(publisher.vault, publisherFee, user, userRewards, vault, protocolFee));
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
    bytes calldata actionParams
  ) internal nonReentrant {
    DataTypes.Ad storage ad = ads[adId];

    if (ad.currentBudget == ad.maxBudget) {
      revert Errors.AdConsumed();
    }

    if (ad.startingTimestamp > block.timestamp || ad.endingTimestamp < block.timestamp) {
      revert Errors.AdNotAvailable();
    }

    DataTypes.PublisherSettings memory publisher = publishers[publisherVault];

    if (ad.whitelistedPublishers.length > 0) {
      // Check if the publisher is whitelisted
      bool isWhitelisted = false;
      for (uint256 i = 0; i < ad.whitelistedPublishers.length; i++) {
        if (ad.whitelistedPublishers[i] == publisher.vault) {
          isWhitelisted = true;
          break;
        }
      }
      if (!isWhitelisted) {
        revert Errors.PublisherNotWhitelistedInAd();
      }
    }

    if (ad.blacklistedPublishers.length > 0) {
      // Check if the publisher is blacklisted
      for (uint256 i = 0; i < ad.blacklistedPublishers.length; i++) {
        if (ad.blacklistedPublishers[i] == publisher.vault) {
          revert Errors.PublisherBlacklistedInAd();
        }
      }
    }

    if (publisher.vault == address(0) || publisher.active == false) {
      revert Errors.PublisherNotWhitelisted();
    }

    uint256 dayFromEpoch = Helpers.getDayFromEpoch(block.timestamp);
    if (ad.maxConsumptionsPerDay > 0 && (consumptionsPerDay[adId][dayFromEpoch] + 1) > ad.maxConsumptionsPerDay) {
      revert Errors.NoRemainingComsumptionsForTheDay();
    }
    consumptionsPerDay[adId][dayFromEpoch] = consumptionsPerDay[adId][dayFromEpoch] + 1;

    if (!Helpers.verifyAudiences(ad, zkProofs, audiences, segments, validator)) revert Errors.InvalidZKProofsInput();

    totalConsumptions += 1;

    if (ad.attribution == DataTypes.Attribution.Conversion) {
      (bool success, bytes memory result) = address(ad.target).call{ value: msg.value }(abi.encodeWithSignature(ad.abi, actionParams));
      if (success == false) {
        // Redirect revert message
        assembly {
          revert(add(result, 32), mload(result))
        }
      }
    }

    distributeRewards(adId, viewer, ad, publisher);
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
    bytes calldata actionParams
  ) external payable override whenNotPaused {
    if (msg.sender != relayer) revert Errors.SenderIsNotRelayer();

    _consumeAd(viewer, adId, publisher, zkProofs, actionParams);
  }

  /**
   * This function is used to consume an ad via a tx initialized by the user.
   *
   * @param adId        The id of the ad to be consumed.
   * @param publisher   The publisher that has shown the ad.
   * @param zkProofs    The zk proofs.
   */
  function consumeAd(
    uint256 adId,
    address publisher,
    DataTypes.ZKProofs calldata zkProofs,
    bytes calldata actionParams
  ) external payable override whenNotPaused {
    DataTypes.Ad storage ad = ads[adId];

    if (ad.attribution != DataTypes.Attribution.Conversion) {
      // Only conversions can be consumed directly by the user until we can ensure that the user is not spoofing the call.
      revert Errors.ImpressionOrClickOnlyAvailableThroughRelayer();
    }

    _consumeAd(msg.sender, adId, publisher, zkProofs, actionParams);
  }

  function setPublisher(DataTypes.PublisherSettings memory publisher) external override onlyRole(DEFAULT_ADMIN_ROLE) {
    publishers[publisher.vault] = DataTypes.PublisherSettings(
      publisher.metadataURI,
      publisher.userRewardsPercentage,
      publisher.vault,
      publisher.active,
      publisher.cpi,
      publisher.cpc,
      publisher.cpa
    );

    emit TargecyEvents.PublisherWhitelisted(publisher.vault, publisher);
  }

  function removePublisher(address publisher) external override onlyRole(DEFAULT_ADMIN_ROLE) {
    delete publishers[publisher];

    emit TargecyEvents.PublisherRemovedFromWhitelist(publisher);
  }

  function changePublisherAddress(address oldAddress, address newAddress) external override onlyRole(DEFAULT_ADMIN_ROLE) {
    DataTypes.PublisherSettings memory publisher = publishers[oldAddress];
    delete publishers[oldAddress];
    publishers[newAddress] = publisher;
  }

  function pausePublisher(address publisher) external override onlyRole(DEFAULT_ADMIN_ROLE) {
    publishers[publisher].active = false;

    emit TargecyEvents.PausePublisher(publisher);
  }

  function unpausePublisher(address publisher) external override onlyRole(DEFAULT_ADMIN_ROLE) {
    publishers[publisher].active = true;

    emit TargecyEvents.UnpausePublisher(publisher);
  }

  function getAudienceSegments(uint256 audienceId) external view override returns (uint256[] memory) {
    return audiences[audienceId].segmentIds;
  }

  function getAdAudiences(uint256 adId) external view override returns (uint256[] memory) {
    return ads[adId].audienceIds;
  }
}
