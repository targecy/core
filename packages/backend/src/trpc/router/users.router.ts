import { router, publicProcedure } from '..';

// @todo move logic to service layer and db connections to repository layer

export const usersRouter = router({
  getTotalAmountOfUsers: publicProcedure.query(async ({ ctx }) => {
    const totalAmount = await ctx.prisma.credential.aggregate({
      _count: {
        issuedTo: true,
      },
    });

    return totalAmount;
  }),
});
