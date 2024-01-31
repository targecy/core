import { Prisma, PrismaClient } from '@prisma/client';
import { Segment } from '../../../generated/targecy.types';
/**
 * This function takes a Segments and returns a Prisma predicate to filter segments.
 * Each Segment contains a slotIndex, an operator and a value.
 * The operators are: 1: '=', 2: '<', 3: '>', 4: 'in', 5: 'not in'
 */
export declare const getPrismaPredicateForSegment: (segment: Segment) => Prisma.ReachWhereInput;
/**
 * This function takes a list of Segments and returns a Prisma predicate to filter segments.
 * Each Segment contains a slotIndex, an operator and a value.
 * The operators are: 1: '=', 2: '<', 3: '>', 4: 'in', 5: 'not in'
 * All Segments are combined with an AND operator.
 */
export declare const getPrismaPredicateForSegments: (segments: Segment[]) => Prisma.ReachWhereInput;
export declare const getSubjectHash: (subject: any) => string;
export declare const updateSegment: (prisma: PrismaClient, input: {
    type: string;
    issuer: string;
    subject: any;
}) => Promise<void>;
