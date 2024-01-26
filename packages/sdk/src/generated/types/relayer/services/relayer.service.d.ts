import { Targecy } from '../../generated/contract-types';
type ConsumeAdParams = Parameters<Targecy['consumeAdViaRelayer']>;
export declare function consumeAd(params: ConsumeAdParams): Promise<string>;
export {};
