import { getIPFSStorageUrl } from '@common/functions/getIPFSStorageUrl';
import { useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useAsync } from 'react-use';

import { SCHEMA } from '../../../backend/src/constants/schemas/schemas.constant';

import { useGetLastAdsQuery, useGetLastAudiencesQuery, useGetLastSegmentsQuery } from '~/generated/graphql.types';
import { backendTrpcClient } from '~/utils';

export default function ActivityLog() {
  const { data: lastAds } = useGetLastAdsQuery({ limit: 5 });
  const { data: lastAudiences } = useGetLastAudiencesQuery({ limit: 5 });
  const { data: lastSegments } = useGetLastSegmentsQuery({ limit: 5 });

  const [lastAdsMetadata, setLastAdsMetadata] = useState<Record<string, { title?: string; description?: string }>>({});
  const [lastAudiencesMetadata, setLastAudiencesMetadata] = useState<
    Record<string, { title?: string; description?: string }>
  >({});
  const [lastSegmentsMetadata, setLastSegmentsMetadata] = useState<
    Record<string, { title?: string; description?: string }>
  >({});

  const [schemas, setSchemas] = useState<SCHEMA[]>([]);

  useAsync(async () => {
    if (lastAds) {
      setLastAdsMetadata(
        (
          await Promise.all(
            lastAds.ads.map(async (ad) => {
              const newMetadata = await fetch(getIPFSStorageUrl(ad.metadataURI));
              const json = await newMetadata.json();
              return { id: ad.id, metadata: { title: json.title, description: json.description } };
            })
          )
        ).reduce<typeof lastAdsMetadata>((acc, curr) => {
          acc[curr.id] = curr.metadata;
          return acc;
        }, {})
      );
    }
  }, [lastAds]);

  useAsync(async () => {
    if (lastAudiences) {
      setLastAudiencesMetadata(
        (
          await Promise.all(
            lastAudiences.audiences.map(async (audience) => {
              const newMetadata = await fetch(getIPFSStorageUrl(audience.metadataURI));
              const json = await newMetadata.json();
              return { id: audience.id, metadata: { title: json.title, description: json.description } };
            })
          )
        ).reduce<typeof lastAudiencesMetadata>((acc, curr) => {
          acc[curr.id] = curr.metadata;
          return acc;
        }, {})
      );
    }
  }, [lastAudiences]);

  useAsync(async () => {
    if (lastSegments) {
      setLastSegmentsMetadata(
        (
          await Promise.all(
            lastSegments.segments.map(async (segment) => {
              const newMetadata = await fetch(getIPFSStorageUrl(segment.metadataURI));
              const json = await newMetadata.json();
              return { id: segment.id, metadata: { title: json.title, description: json.description } };
            })
          )
        ).reduce<typeof lastSegmentsMetadata>((acc, curr) => {
          acc[curr.id] = curr.metadata;
          return acc;
        }, {})
      );
    }
  }, [lastSegments]);

  useAsync(async () => {
    const response = await backendTrpcClient.schemas.getAllSchemas.query();
    setSchemas(Object.entries(response).map(([, schema]) => schema));
  }, []);

  return (
    <div className="panel">
      <div className="-mx-5 mb-5 flex items-start justify-between border-b border-white-light p-5 pt-0  dark:border-[#1b2e4b] dark:text-white-light">
        <h5 className="text-lg font-semibold ">Activity Log</h5>
        <div className="dropdown"></div>
      </div>
      <PerfectScrollbar className="perfect-scrollbar relative h-[360px] ltr:-mr-3 ltr:pr-3 rtl:-ml-3 rtl:pl-3">
        <div className="space-y-7">
          {lastAds?.ads.map((ad) => (
            <div className="flex" key={ad.id}>
              <div className="relative z-10 shrink-0 before:absolute before:left-4 before:top-10 before:h-[calc(100%-24px)] before:w-[2px] before:bg-white-dark/30 ltr:mr-2 rtl:ml-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white shadow">
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </div>
              </div>
              <div>
                <h5 className="font-semibold dark:text-white-light">
                  New ad created :{' '}
                  <button type="button" className="text-success">
                    {lastAdsMetadata[ad.id]?.title}
                  </button>
                </h5>
                <p className="text-xs text-white-dark">
                  {new Date(ad.startingTimestamp).toLocaleString()} -{' '}
                  {new Date(ad.endingTimestamp).toLocaleString() !== 'Invalid Date'
                    ? new Date(ad.endingTimestamp).toLocaleString()
                    : 'Infinity'}{' '}
                </p>
              </div>
            </div>
          ))}
          {lastAudiences?.audiences.map((audience) => (
            <div className="flex" key={audience.id}>
              <div className="relative z-10 shrink-0 before:absolute before:left-4 before:top-10 before:h-[calc(100%-24px)] before:w-[2px] before:bg-white-dark/30 ltr:mr-2 rtl:ml-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-white shadow">
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </div>
              </div>
              <div>
                <h5 className="font-semibold dark:text-white-light">
                  New audience created :{' '}
                  <button type="button" className="text-success">
                    {lastAudiencesMetadata[audience.id]?.title}
                  </button>
                </h5>
                <p className="text-xs text-white-dark">{audience.segments.length} Segments</p>
              </div>
            </div>
          ))}
          {lastSegments?.segments.map((segment) => (
            <div className="flex" key={segment.id}>
              <div className="relative z-10 shrink-0 before:absolute before:left-4 before:top-10 before:h-[calc(100%-24px)] before:w-[2px] before:bg-white-dark/30 ltr:mr-2 rtl:ml-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-dark text-white shadow">
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </div>
              </div>
              <div>
                <h5 className="font-semibold dark:text-white-light">
                  New segment created :{' '}
                  <button type="button" className="text-success">
                    {lastSegmentsMetadata[segment.id]?.title}
                  </button>
                </h5>
                <p className="text-xs text-white-dark">
                  {schemas.find((s) => s.bigint === segment.querySchema)?.title || 'Unknown Schema'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </PerfectScrollbar>
    </div>
  );
}
