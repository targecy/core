"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemasRouter = void 0;
const server_1 = require("@trpc/server");
const zod_1 = require("zod");
const __1 = require("..");
const schemas_constant_1 = require("../../constants/schemas/schemas.constant");
// @todo move logic to service layer and db connections to repository layer
exports.schemasRouter = (0, __1.router)({
    getAllSchemas: __1.publicProcedure.query(() => {
        return schemas_constant_1.SCHEMAS;
    }),
    getSchemaByType: __1.publicProcedure
        .input(zod_1.z.object({
        type: zod_1.z.string(),
    }))
        .query(({ input }) => {
        if (!(input.type in schemas_constant_1.SCHEMA_TYPES))
            throw new server_1.TRPCError({ code: 'NOT_FOUND', message: 'Schema not found' });
        return schemas_constant_1.SCHEMAS[input.type];
    }),
});
