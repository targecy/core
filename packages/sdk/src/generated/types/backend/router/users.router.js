"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const __1 = require("..");
// @todo move logic to service layer and db connections to repository layer
exports.usersRouter = (0, __1.router)({
    getTotalAmountOfUsers: __1.publicProcedure.query(async ({ ctx }) => {
        const totalAmount = await ctx.prisma.credential.aggregate({
            _count: {
                issuedTo: true,
            },
        });
        return totalAmount;
    }),
});
