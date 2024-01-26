import { Prisma } from '@prisma/client';
import { Segment } from '../../../generated/targecy.types';
/**
 * This function takes a Segments and returns a Prisma predicate to filter credentials.
 * Each Segment contains a slotIndex, an operator and a value.
 * The operators are: 1: '=', 2: '<', 3: '>', 4: 'in', 5: 'not in'
 */
export declare const getPrismaPredicateForCredentialsFromSegment: (segment: Segment) => Prisma.CredentialWhereInput;
/**
 * This function takes a list of Segments and returns a Prisma predicate to filter credentials.
 * Each Segment contains a slotIndex, an operator and a value.
 * The operators are: 1: '=', 2: '<', 3: '>', 4: 'in', 5: 'not in'
 * All Segments are combined with an AND operator.
 */
export declare const getPrismaPredicateForCredentialsFromSegments: (segments: Segment[]) => Prisma.CredentialWhereInput;
