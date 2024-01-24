import { SCHEMA } from '@backend/constants/schemas/schemas.constant';
import { useEffect, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';

import { useGetLastAdsQuery, useGetLastAudiencesQuery, useGetLastSegmentsQuery } from '~/services/api';
import { backendTrpcClient } from '~/utils';

// @todo(kevin): add loader/skeleton for type of data

export default function ActivityLog() {
  const { data: lastAdsResult } = useGetLastAdsQuery({ limit: 5 });
  const { data: lastAudiencesResult } = useGetLastAudiencesQuery({ limit: 5 });
  const { data: lastSegmentsResult } = useGetLastSegmentsQuery({ limit: 5 });

  const [schemas, setSchemas] = useState<SCHEMA[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await backendTrpcClient.schemas.getAllSchemas.query();
        setSchemas(Object.entries(response).map(([, schema]) => schema));
      } catch (error) {
        console.error('Error in ...:', error);
      }
    }

    void fetchData();
  }, []);

  return (
    <div className="panel">
      <div className="-mx-5 mb-5 flex items-start justify-between border-b border-white-light p-5 pt-0  dark:border-[#1b2e4b] dark:text-white-light">
        <h5 className="text-lg font-semibold ">Activity Log</h5>
        <div className="dropdown"></div>
      </div>
      <PerfectScrollbar className="perfect-scrollbar relative h-[360px] ltr:-mr-3 ltr:pr-3 rtl:-ml-3 rtl:pl-3">
        <div className="space-y-7">
          {lastAdsResult?.ads.map((ad) => (
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
                    {ad.metadata.title}
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
          {lastAudiencesResult?.audiences.map((audience) => (
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
                    {audience.metadata.title}
                  </button>
                </h5>
                <p className="text-xs text-white-dark">{audience.segments.length} Segments</p>
              </div>
            </div>
          ))}
          {lastSegmentsResult?.segments.map((segment) => (
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
                    {segment.metadata.title}
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
