import { TRPCError } from '@trpc/server';
import { GraphQLClient } from 'graphql-request';

import { getSdk } from '../../../generated/targecy.types';

const versionByEnv = (env: string | undefined) => {
  switch (env) {
    case 'staging':
    case 'test':
    case 'preview':
      return '1.3.1';
    case 'development':
      return 'targecy';
    default:
      return 'latest';
  }
};

const url = `${process.env.TARGECY_SUBGRAPH_URL}/${
  versionByEnv(process.env.TARGECY_SUBGRAPH_URL) ?? process.env.TARGECY_SUBGRAPH_VERSION
}`;

const targecyApi = getSdk(new GraphQLClient(url, {}));

export async function getSegmentForAudience(audienceId: string) {
  const response = await targecyApi.GetSegmentForAudience({ id: audienceId });

  if (!response.audience) throw new TRPCError({ code: 'NOT_FOUND', message: 'Target group not found' });

  return response.audience?.segments;
}

export async function getSegmentById(id: string) {
  const response = await targecyApi.GetSegment({ id });

  if (!response.segment) throw new TRPCError({ code: 'NOT_FOUND', message: 'Segment not found' });

  return response.segment;
}

export async function getSegmentsByIds(ids: string[]) {
  return Promise.all(
    ids.map(async (id) => {
      return await getSegmentById(id);
    })
  );
}

export async function getAllSegments() {
  const response = await targecyApi.GetAllSegments();

  return response.segments;
}
