/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedListener,
  TypedContractMethod,
} from "../../../common";

export declare namespace ICircuitValidator {
  export type CircuitQueryStruct = {
    schema: BigNumberish;
    slotIndex: BigNumberish;
    operator: BigNumberish;
    value: BigNumberish[];
    circuitId: string;
  };

  export type CircuitQueryStructOutput = [
    schema: bigint,
    slotIndex: bigint,
    operator: bigint,
    value: bigint[],
    circuitId: string
  ] & {
    schema: bigint;
    slotIndex: bigint;
    operator: bigint;
    value: bigint[];
    circuitId: string;
  };
}

export interface TargecyStorageInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "_adId"
      | "_audienceId"
      | "_segmentId"
      | "ads"
      | "audiences"
      | "budgets"
      | "consumptionsPerDay"
      | "defaultClickPrice"
      | "defaultConversionPrice"
      | "defaultImpressionPrice"
      | "defaultIssuer"
      | "erc20"
      | "publishers"
      | "relayer"
      | "segments"
      | "totalConsumptions"
      | "validator"
      | "vault"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "_adId", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "_audienceId",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "_segmentId",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "ads", values: [BigNumberish]): string;
  encodeFunctionData(
    functionFragment: "audiences",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "budgets",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "consumptionsPerDay",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "defaultClickPrice",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "defaultConversionPrice",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "defaultImpressionPrice",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "defaultIssuer",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "erc20", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "publishers",
    values: [AddressLike]
  ): string;
  encodeFunctionData(functionFragment: "relayer", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "segments",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "totalConsumptions",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "validator", values?: undefined): string;
  encodeFunctionData(functionFragment: "vault", values?: undefined): string;

  decodeFunctionResult(functionFragment: "_adId", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "_audienceId",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "_segmentId", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "ads", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "audiences", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "budgets", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "consumptionsPerDay",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "defaultClickPrice",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "defaultConversionPrice",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "defaultImpressionPrice",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "defaultIssuer",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "erc20", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "publishers", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "relayer", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "segments", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "totalConsumptions",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "validator", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "vault", data: BytesLike): Result;
}

export interface TargecyStorage extends BaseContract {
  contractName: "TargecyStorage";

  connect(runner?: ContractRunner | null): TargecyStorage;
  waitForDeployment(): Promise<this>;

  interface: TargecyStorageInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  _adId: TypedContractMethod<[], [bigint], "view">;

  _audienceId: TypedContractMethod<[], [bigint], "view">;

  _segmentId: TypedContractMethod<[], [bigint], "view">;

  ads: TypedContractMethod<
    [arg0: BigNumberish],
    [
      [
        string,
        string,
        bigint,
        boolean,
        string,
        string,
        bigint,
        bigint,
        bigint,
        bigint,
        bigint,
        bigint,
        bigint
      ] & {
        advertiser: string;
        metadataURI: string;
        attribution: bigint;
        active: boolean;
        abi: string;
        target: string;
        startingTimestamp: bigint;
        endingTimestamp: bigint;
        maxBudget: bigint;
        currentBudget: bigint;
        maxConsumptionsPerDay: bigint;
        maxPricePerConsumption: bigint;
        consumptions: bigint;
      }
    ],
    "view"
  >;

  audiences: TypedContractMethod<
    [arg0: BigNumberish],
    [[string, bigint] & { metadataURI: string; consumptions: bigint }],
    "view"
  >;

  budgets: TypedContractMethod<
    [arg0: AddressLike],
    [
      [string, bigint, bigint] & {
        advertiser: string;
        totalBudget: bigint;
        remainingBudget: bigint;
      }
    ],
    "view"
  >;

  consumptionsPerDay: TypedContractMethod<
    [arg0: BigNumberish, arg1: BigNumberish],
    [bigint],
    "view"
  >;

  defaultClickPrice: TypedContractMethod<[], [bigint], "view">;

  defaultConversionPrice: TypedContractMethod<[], [bigint], "view">;

  defaultImpressionPrice: TypedContractMethod<[], [bigint], "view">;

  defaultIssuer: TypedContractMethod<[], [bigint], "view">;

  erc20: TypedContractMethod<[], [string], "view">;

  publishers: TypedContractMethod<
    [arg0: AddressLike],
    [
      [string, bigint, string, boolean, bigint, bigint, bigint] & {
        metadataURI: string;
        userRewardsPercentage: bigint;
        vault: string;
        active: boolean;
        cpi: bigint;
        cpc: bigint;
        cpa: bigint;
      }
    ],
    "view"
  >;

  relayer: TypedContractMethod<[], [string], "view">;

  segments: TypedContractMethod<
    [arg0: BigNumberish],
    [
      [ICircuitValidator.CircuitQueryStructOutput, string, bigint] & {
        query: ICircuitValidator.CircuitQueryStructOutput;
        metadataURI: string;
        issuer: bigint;
      }
    ],
    "view"
  >;

  totalConsumptions: TypedContractMethod<[], [bigint], "view">;

  validator: TypedContractMethod<[], [string], "view">;

  vault: TypedContractMethod<[], [string], "view">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "_adId"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "_audienceId"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "_segmentId"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "ads"
  ): TypedContractMethod<
    [arg0: BigNumberish],
    [
      [
        string,
        string,
        bigint,
        boolean,
        string,
        string,
        bigint,
        bigint,
        bigint,
        bigint,
        bigint,
        bigint,
        bigint
      ] & {
        advertiser: string;
        metadataURI: string;
        attribution: bigint;
        active: boolean;
        abi: string;
        target: string;
        startingTimestamp: bigint;
        endingTimestamp: bigint;
        maxBudget: bigint;
        currentBudget: bigint;
        maxConsumptionsPerDay: bigint;
        maxPricePerConsumption: bigint;
        consumptions: bigint;
      }
    ],
    "view"
  >;
  getFunction(
    nameOrSignature: "audiences"
  ): TypedContractMethod<
    [arg0: BigNumberish],
    [[string, bigint] & { metadataURI: string; consumptions: bigint }],
    "view"
  >;
  getFunction(
    nameOrSignature: "budgets"
  ): TypedContractMethod<
    [arg0: AddressLike],
    [
      [string, bigint, bigint] & {
        advertiser: string;
        totalBudget: bigint;
        remainingBudget: bigint;
      }
    ],
    "view"
  >;
  getFunction(
    nameOrSignature: "consumptionsPerDay"
  ): TypedContractMethod<
    [arg0: BigNumberish, arg1: BigNumberish],
    [bigint],
    "view"
  >;
  getFunction(
    nameOrSignature: "defaultClickPrice"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "defaultConversionPrice"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "defaultImpressionPrice"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "defaultIssuer"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "erc20"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "publishers"
  ): TypedContractMethod<
    [arg0: AddressLike],
    [
      [string, bigint, string, boolean, bigint, bigint, bigint] & {
        metadataURI: string;
        userRewardsPercentage: bigint;
        vault: string;
        active: boolean;
        cpi: bigint;
        cpc: bigint;
        cpa: bigint;
      }
    ],
    "view"
  >;
  getFunction(
    nameOrSignature: "relayer"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "segments"
  ): TypedContractMethod<
    [arg0: BigNumberish],
    [
      [ICircuitValidator.CircuitQueryStructOutput, string, bigint] & {
        query: ICircuitValidator.CircuitQueryStructOutput;
        metadataURI: string;
        issuer: bigint;
      }
    ],
    "view"
  >;
  getFunction(
    nameOrSignature: "totalConsumptions"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "validator"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "vault"
  ): TypedContractMethod<[], [string], "view">;

  filters: {};
}
