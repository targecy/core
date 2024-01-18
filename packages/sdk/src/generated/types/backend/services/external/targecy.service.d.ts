export declare function getSegmentForAudience(audienceId: string): Promise<{
    __typename?: "Segment" | undefined;
    querySchema: any;
    querySlotIndex: any;
    queryValue: any[];
    queryCircuitId: string;
    queryOperator: any;
    id: string;
    metadataURI: string;
    validator: string;
    issuer: {
        __typename?: "Issuer" | undefined;
        id: string;
    };
}[]>;
export declare function getSegmentById(id: string): Promise<{
    __typename?: "Segment" | undefined;
    querySchema: any;
    querySlotIndex: any;
    queryValue: any[];
    queryCircuitId: string;
    queryOperator: any;
    id: string;
    metadataURI: string;
    validator: string;
    issuer: {
        __typename?: "Issuer" | undefined;
        id: string;
    };
}>;
export declare function getSegmentsByIds(ids: string[]): Promise<{
    __typename?: "Segment" | undefined;
    querySchema: any;
    querySlotIndex: any;
    queryValue: any[];
    queryCircuitId: string;
    queryOperator: any;
    id: string;
    metadataURI: string;
    validator: string;
    issuer: {
        __typename?: "Issuer" | undefined;
        id: string;
    };
}[]>;
export declare function getAllSegments(): Promise<{
    __typename?: "Segment" | undefined;
    querySchema: any;
    querySlotIndex: any;
    queryValue: any[];
    queryCircuitId: string;
    queryOperator: any;
    id: string;
    metadataURI: string;
    validator: string;
    issuer: {
        __typename?: "Issuer" | undefined;
        id: string;
    };
}[]>;
