import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';

import { SCHEMAS } from '../../../constants/schemas/schemas.constant';
import { Segment } from '../../../generated/targecy.types';

/**
 * This function takes a Segments and returns a Prisma predicate to filter credentials.
 * Each Segment contains a slotIndex, an operator and a value.
 * The operators are: 1: '=', 2: '<', 3: '>', 4: 'in', 5: 'not in'
 */
export const getPrismaPredicateForCredentialsFromSegment = (segment: Segment): Prisma.CredentialWhereInput => {
  const schema = Object.entries(SCHEMAS).find(([, schema]) => schema.bigint === segment.querySchema)?.[1];

  if (!schema) throw new TRPCError({ code: 'NOT_FOUND', message: `Schema ${segment.querySchema} not found` });

  const schemaSlots = Object.keys(schema.credentialSubject);
  const slotName = schemaSlots[segment.querySlotIndex];

  switch (segment.queryOperator) {
    case 1:
      return {
        credential: {
          path: ['credentialSubject', slotName],
          equals: segment.queryValue,
        },
      };
    case 2:
      return {
        credential: {
          path: ['credentialSubject', slotName],
          lt: segment.queryValue,
        },
      };
    case 3:
      return {
        credential: {
          path: ['credentialSubject', slotName],
          gt: segment.queryValue,
        },
      };
    case 4:
      return {
        credential: {
          path: ['credentialSubject', slotName],
          array_contains: segment.queryValue, // @todo (Martin): Review if array works
        },
      };
    case 5:
      return {
        credential: {
          path: ['credentialSubject', slotName],
          not: {
            array_contains: segment.queryValue, // @todo (Martin): Review if array works
          },
        },
      };
    default:
      throw new Error(`Operator ${segment.queryOperator} not supported`);
  }
};

/**
 * This function takes a list of Segments and returns a Prisma predicate to filter credentials.
 * Each Segment contains a slotIndex, an operator and a value.
 * The operators are: 1: '=', 2: '<', 3: '>', 4: 'in', 5: 'not in'
 * All Segments are combined with an AND operator.
 */
export const getPrismaPredicateForCredentialsFromSegments = (segments: Segment[]): Prisma.CredentialWhereInput => {
  const segmentPredicates = segments.map(getPrismaPredicateForCredentialsFromSegment);

  const predicate: Prisma.CredentialWhereInput = {
    AND: segmentPredicates,
  };

  return predicate;
};
