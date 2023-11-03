import { SCHEMAS, SCHEMA_TYPES } from 'constants/schemas/schemas.constant';

import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { router, publicProcedure } from '..';

// @todo move logic to service layer and db connections to repository layer

export const schemasRouter = router({
  getAllSchemas: publicProcedure.query(() => {
    return SCHEMAS;
  }),

  getSchemaByType: publicProcedure
    .input(
      z.object({
        type: z.string(),
      })
    )
    .query(({ input }) => {
      if (!(input.type in SCHEMA_TYPES)) throw new TRPCError({ code: 'NOT_FOUND', message: 'Schema not found' });

      return SCHEMAS[input.type as keyof typeof SCHEMA_TYPES];
    }),
});
