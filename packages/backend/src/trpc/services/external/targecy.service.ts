import { TRPCError } from '@trpc/server';
import { getSdk } from 'generated/targecy.types';
import { GraphQLClient } from 'graphql-request';

const url = process.env.SUBGRAPH_URL || '';
const targecyApi = getSdk(new GraphQLClient(url, {}));

export async function getZKPRequestForTargetGroup(targetGroupId: string) {
  const response = await targecyApi.GetZKPRequestForTargetGroup({ id: targetGroupId });

  if (!response.targetGroup) throw new TRPCError({ code: 'NOT_FOUND', message: 'Target group not found' });

  return response.targetGroup?.zkRequests;
}

export async function getZKPRequestById(id: string) {
  const response = await targecyApi.GetZKPRequest({ id });

  if (!response.zkprequest) throw new TRPCError({ code: 'NOT_FOUND', message: 'ZKPRequest not found' });

  return response.zkprequest;
}

export async function getZKPRequestsByIds(ids: string[]) {
  return Promise.all(
    ids.map(async (id) => {
      return await getZKPRequestById(id);
    })
  );
}

export async function getAllZKPRequests() {
  const response = await targecyApi.GetAllZKPRequests();

  return response.zkprequests;
}
