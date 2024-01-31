"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSegment = exports.getSubjectHash = exports.getPrismaPredicateForSegments = exports.getPrismaPredicateForSegment = void 0;
const js_crypto_1 = require("@iden3/js-crypto");
const server_1 = require("@trpc/server");
const schemas_constant_1 = require("../../../constants/schemas/schemas.constant");
/**
 * This function takes a Segments and returns a Prisma predicate to filter segments.
 * Each Segment contains a slotIndex, an operator and a value.
 * The operators are: 1: '=', 2: '<', 3: '>', 4: 'in', 5: 'not in'
 */
const getPrismaPredicateForSegment = (segment) => {
    const schema = Object.entries(schemas_constant_1.SCHEMAS).find(([, schema]) => schema.bigint === segment.querySchema)?.[1];
    if (!schema)
        throw new server_1.TRPCError({ code: 'NOT_FOUND', message: `Schema ${segment.querySchema} not found` });
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
exports.getPrismaPredicateForSegment = getPrismaPredicateForSegment;
/**
 * This function takes a list of Segments and returns a Prisma predicate to filter segments.
 * Each Segment contains a slotIndex, an operator and a value.
 * The operators are: 1: '=', 2: '<', 3: '>', 4: 'in', 5: 'not in'
 * All Segments are combined with an AND operator.
 */
const getPrismaPredicateForSegments = (segments) => {
    const segmentPredicates = segments.map(exports.getPrismaPredicateForSegment);
    const predicate = {
        AND: segmentPredicates,
    };
    return predicate;
};
exports.getPrismaPredicateForSegments = getPrismaPredicateForSegments;
const getSubjectHash = (subject) => {
    return (0, js_crypto_1.sha256)(new TextEncoder().encode(JSON.stringify(subject))).toString();
};
exports.getSubjectHash = getSubjectHash;
const updateSegment = async (prisma, input) => {
    const hash = (0, exports.getSubjectHash)(input.subject);
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
exports.updateSegment = updateSegment;
