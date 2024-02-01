import { Prisma, PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';

import { SCHEMAS } from '../../../../constants/schemas/schemas.constant';
import { Segment } from '../../../../generated/targecy.types';
import { getSubjectHash } from '../credentials/credentials.service';

/**
 * This function takes a Segments and returns a Prisma predicate to filter segments.
 * Each Segment contains a slotIndex, an operator and a value.
 * The operators are: 1: '=', 2: '<', 3: '>', 4: 'in', 5: 'not in'
 */
export const getPrismaPredicateForSegment = (segment: Segment): Prisma.ReachWhereInput => {
  const schema = Object.entries(SCHEMAS).find(([, schema]) => schema.bigint === segment.querySchema)?.[1];

  if (!schema) throw new TRPCError({ code: 'NOT_FOUND', message: `Schema ${segment.querySchema} not found` });

  const schemaSlots = Object.keys(schema.credentialSubject);
  const slotName = schemaSlots[segment.querySlotIndex];

  switch (segment.queryOperator) {
    case 1:
      return {
        subject: {
          path: [slotName],
          equals: segment.queryValue,
        },
      };
    case 2:
      return {
        subject: {
          path: [slotName],
          lt: segment.queryValue,
        },
      };
    case 3:
      return {
        subject: {
          path: [slotName],
          gt: segment.queryValue,
        },
      };
    case 4:
      return {
        subject: {
          path: [slotName],
          array_contains: segment.queryValue, // @todo (Martin): Review if array works
        },
      };
    case 5:
      return {
        subject: {
          path: [slotName],
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
 * This function takes a list of Segments and returns a Prisma predicate to filter segments.
 * Each Segment contains a slotIndex, an operator and a value.
 * The operators are: 1: '=', 2: '<', 3: '>', 4: 'in', 5: 'not in'
 * All Segments are combined with an AND operator.
 */
export const getPrismaPredicateForSegments = (segments: Segment[]): Prisma.ReachWhereInput => {
  const segmentPredicates = segments.map(getPrismaPredicateForSegment);

  const predicate: Prisma.ReachWhereInput = {
    AND: segmentPredicates,
  };

  return predicate;
};

export const updateSegment = async (
  prisma: PrismaClient,
  input: {
    type: string;
    issuer: string;
    subject: any;
  }
) => {
  const hash = getSubjectHash(input.subject);

  const existingSegment = await prisma.reach.findUnique({
    where: {
      hash_type_issuer: {
        hash,
        type: input.type,
        issuer: input.issuer,
      },
    },
  });

  if (existingSegment) {
    await prisma.reach.update({
      where: {
        hash_type_issuer: {
          hash,
          type: input.type,
          issuer: input.issuer,
        },
      },
      data: {
        amount: existingSegment.amount,
      },
    });
    return;
  }

  // Create Segment
  await prisma.reach.create({
    data: {
      hash,
      type: input.type,
      issuer: input.issuer,
      subject: input.subject,
      amount: 1,
    },
  });
};
