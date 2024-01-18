"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllSegments = exports.getSegmentsByIds = exports.getSegmentById = exports.getSegmentForAudience = void 0;
const server_1 = require("@trpc/server");
const graphql_request_1 = require("graphql-request");
const targecy_types_1 = require("../../../generated/targecy.types");
const url = process.env.SUBGRAPH_URL || '';
const targecyApi = (0, targecy_types_1.getSdk)(new graphql_request_1.GraphQLClient(url, {}));
async function getSegmentForAudience(audienceId) {
    const response = await targecyApi.GetSegmentForAudience({ id: audienceId });
    if (!response.audience)
        throw new server_1.TRPCError({ code: 'NOT_FOUND', message: 'Target group not found' });
    return response.audience?.segments;
}
exports.getSegmentForAudience = getSegmentForAudience;
async function getSegmentById(id) {
    const response = await targecyApi.GetSegment({ id });
    if (!response.segment)
        throw new server_1.TRPCError({ code: 'NOT_FOUND', message: 'Segment not found' });
    return response.segment;
}
exports.getSegmentById = getSegmentById;
async function getSegmentsByIds(ids) {
    return Promise.all(ids.map(async (id) => {
        return await getSegmentById(id);
    }));
}
exports.getSegmentsByIds = getSegmentsByIds;
async function getAllSegments() {
    const response = await targecyApi.GetAllSegments();
    return response.segments;
}
exports.getAllSegments = getAllSegments;
