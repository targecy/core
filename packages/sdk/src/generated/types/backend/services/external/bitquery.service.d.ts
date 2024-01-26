import { AddressString } from '../../../utils';
export declare function getUsedContractsbyAddress(address: AddressString, from?: Date): Promise<import("../../../constants/contracts.constants").KNOWN_PROTOCOL[]>;
export declare function getIsActiveOnChainByAddress(address: AddressString, from?: Date): Promise<{
    network: "ethereum" | "matic";
    isActive: boolean;
}[]>;
export declare function getTokenHoldings(address: AddressString, from?: Date): Promise<{
    token: string | null | undefined;
    symbol: string | undefined;
    tokenId: string | null | undefined;
    type: string | null | undefined;
    amount: number | null | undefined;
    tx: string | undefined;
    height: number | undefined;
    timestamp: string | undefined;
    chain: "ethereum" | "matic";
}[]>;
