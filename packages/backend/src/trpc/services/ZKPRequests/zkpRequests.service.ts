import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';

import { SCHEMAS } from '../../../constants/schemas/schemas.constant';
import { ZkpRequest } from '../../../generated/targecy.types';

/**
 * This function takes a ZKPRequests and returns a Prisma predicate to filter credentials.
 * Each ZKPRequest contains a slotIndex, an operator and a value.
 * The operators are: 1: '=', 2: '<', 3: '>', 4: 'in', 5: 'not in'
 */
export const getPrismaPredicateForCredentialsFromZKPRequest = (zkpRequest: ZkpRequest): Prisma.CredentialWhereInput => {
  const schema = Object.entries(SCHEMAS).find(([, schema]) => schema.bigint === zkpRequest.query_schema)?.[1];

  if (!schema) throw new TRPCError({ code: 'NOT_FOUND', message: `Schema ${zkpRequest.query_schema} not found` });

  const schemaSlots = Object.keys(schema.credentialSubject);
  const slotName = schemaSlots[zkpRequest.query_slotIndex];

  switch (zkpRequest.query_operator) {
    case 1:
      return {
        credential: {
          path: ['credentialSubject', slotName],
          equals: zkpRequest.query_value,
        },
      };
    case 2:
      return {
        credential: {
          path: ['credentialSubject', slotName],
          lt: zkpRequest.query_value,
        },
      };
    case 3:
      return {
        credential: {
          path: ['credentialSubject', slotName],
          gt: zkpRequest.query_value,
        },
      };
    case 4:
      return {
        credential: {
          path: ['credentialSubject', slotName],
          array_contains: zkpRequest.query_value, // @todo (Martin): Review if array works
        },
      };
    case 5:
      return {
        credential: {
          path: ['credentialSubject', slotName],
          not: {
            array_contains: zkpRequest.query_value, // @todo (Martin): Review if array works
          },
        },
      };
    default:
      throw new Error(`Operator ${zkpRequest.query_operator} not supported`);
  }
};

/**
 * This function takes a list of ZKPRequests and returns a Prisma predicate to filter credentials.
 * Each ZKPRequest contains a slotIndex, an operator and a value.
 * The operators are: 1: '=', 2: '<', 3: '>', 4: 'in', 5: 'not in'
 * All ZKPRequests are combined with an AND operator.
 */
export const getPrismaPredicateForCredentialsFromZKPRequests = (
  zkpRequests: ZkpRequest[]
): Prisma.CredentialWhereInput => {
  const zkpRequestPredicates = zkpRequests.map(getPrismaPredicateForCredentialsFromZKPRequest);

  const predicate: Prisma.CredentialWhereInput = {
    AND: zkpRequestPredicates,
  };

  return predicate;
};
