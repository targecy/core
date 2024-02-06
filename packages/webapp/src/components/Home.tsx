import { SCHEMA } from '@backend/constants/schemas/schemas.constant';
import { getIPFSStorageUrl } from '@common/functions/getIPFSStorageUrl';
import { useCredentialsStatistics, useTargecyContext } from '@targecy/sdk';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useAsync } from 'react-use';
import { useContractRead } from 'wagmi';

import abi from '../generated/abis/Targecy.json';

import { targecyContractAddress } from '~/constants/contracts.constants';
import { env } from '~/env.mjs';
import {
  useGetAdvertiserQuery,
  useGetBudgetQuery,
  useGetLastAdsQuery,
  useGetLastAudiencesQuery,
  useGetLastSegmentsQuery,
} from '~/generated/graphql.types';
import { useWallet } from '~/hooks';
import { backendTrpcClient } from '~/utils';

const scannerUrl: Record<typeof env.NEXT_PUBLIC_VERCEL_ENV, string> = {
  development: `http://localhost:8090`,
  preview: `https://mumbai.polygonscan.com`,
  production: `https://polygonscan.com`,
};

export const Home = () => {
  const { data: adsQuantityData } = useContractRead({
    address: targecyContractAddress,
    abi,
    functionName: '_adId',
  });
  const adsQuantity = adsQuantityData?.toString() ?? 0;

  const { data: audiencesQuantityData } = useContractRead({
    address: targecyContractAddress,
    abi,
    functionName: '_audienceId',
  });
  const audiencesQuantity = audiencesQuantityData?.toString() ?? 0;

  const { data: segmentsQuantityData } = useContractRead({
    address: targecyContractAddress,
    abi,
    functionName: '_segmentId',
  });
  const segmentsQuantity = segmentsQuantityData?.toString() ?? 0;

  const { data: totalConsumptionsData } = useContractRead({
    address: targecyContractAddress,
    abi,
    functionName: 'totalConsumptions',
  });
  const totalConsumptions = totalConsumptionsData?.toString() ?? 0;

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: lastAds } = useGetLastAdsQuery({ limit: 5 });
  const [lastAdsMetadata, setLastAdsMetadata] = useState<Record<string, { title?: string; description?: string }>>({});
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

  const { data: lastAudiences } = useGetLastAudiencesQuery({ limit: 5 });
  const [lastAudiencesMetadata, setLastAudiencesMetadata] = useState<
    Record<string, { title?: string; description?: string }>
  >({});
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

  const { data: lastSegments } = useGetLastSegmentsQuery({ limit: 5 });
  const [lastSegmentsMetadata, setLastSegmentsMetadata] = useState<
    Record<string, { title?: string; description?: string }>
  >({});
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

  const [schemas, setSchemas] = useState<SCHEMA<any>[]>([]);
  useAsync(async () => {
    const response = await backendTrpcClient.schemas.getAllSchemas.query();
    setSchemas(Object.entries(response).map(([, schema]) => schema));
  }, []);

  const { context } = useTargecyContext();
  const credentialsStatistics = useCredentialsStatistics(context);

  const wallet = useWallet();
  const { data: advertiserData } = useGetAdvertiserQuery({ id: wallet.address || '' });
  const totalInteractions =
    (Number(advertiserData?.advertiser?.impressions) || 0) +
    (Number(advertiserData?.advertiser?.clicks) || 0) +
    (Number(advertiserData?.advertiser?.conversions) || 0);

  const { data: budget } = useGetBudgetQuery({
    id: wallet.address || '',
  });

  // useAsync(async () => {
  //   await trackCustomEvent(
  //     {
  //       id: 'purchase',
  //       params: {
  //         currency: 'USD',
  //         value: 42,
  //       },
  //     },
  //     env.NEXT_PUBLIC_VERCEL_ENV
  //   );
  // }, []);

  if (!mounted) return <></>;

  return (
    <div>
      <div className="">
        <div className="flex h-1/4 flex-row justify-between">
          <div className="panel mb-3 h-max-[100px] w-full">
            <div className="flex justify-between gap-5 pr-10 text-sm font-bold text-[#515365] sm:grid-cols-2">
              <div>
                <h5 className="text-lg font-semibold text-black dark:text-white  ">Network Statistics</h5>
                <h6 className="text-sm font-semibold ">
                  <Link
                    className=" cursor-pointer transition-all hover:text-primary"
                    target="_blank"
                    href={`${scannerUrl[env.NEXT_PUBLIC_VERCEL_ENV]}/address/${
                      env.NEXT_PUBLIC_TARGECY_CONTRACT_ADDRESS
                    }`}>
                    See contract in scanner
                  </Link>
                </h6>
              </div>
              <div>
                <div>
                  <div>Impressions/Clicks/Conversions</div>
                  <div className="text-lg text-primary">{totalConsumptions}</div>
                </div>
              </div>
              <div>
                <div>
                  <div>Ads</div>
                  <div className="text-lg text-primary">{adsQuantity}</div>
                </div>
              </div>

              <div>
                <div>
                  <div>Audiences</div>
                  <div className="text-lg text-primary">{audiencesQuantity} </div>
                </div>
              </div>

              <div>
                <div>
                  <div>Segments</div>
                  <div className="text-lg text-primary ">{segmentsQuantity} </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex h-3/4 flex-row justify-between">
          <div className="flex w-full">
            <div className="mt-3 mr-3 flex w-1/3 flex-col">
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
            </div>
            <div className="mt-3 ml-3 flex w-2/3 flex-col">
              <div className="mb-3 flex h-1/2 flex-row justify-between">
                <div className="panel h-full w-full sm:col-span-2 lg:col-span-1">
                  <div className="mb-5 flex justify-between dark:text-white-light">
                    <h5 className="text-lg font-semibold ">My Wallet</h5>
                  </div>
                  <div className="grid gap-8 text-sm font-bold text-[#515365] sm:grid-cols-2">
                    <div>
                      <div>
                        <div>Public On-Chain Data Credentials</div>
                        <div className="text-lg text-primary">{credentialsStatistics.public}</div>
                      </div>
                    </div>
                    <div>
                      <div>
                        <div>Behaviour Data Credentials</div>
                        <div className="text-lg text-primary">{credentialsStatistics.behaviour}</div>
                      </div>
                    </div>

                    <div>
                      <div>
                        <div>Private Data Credentials</div>
                        <div className="text-lg text-primary">{credentialsStatistics.private} </div>
                      </div>
                    </div>

                    <div>
                      <div>
                        <div>Configuration Credentials</div>
                        <div className="text-lg text-primary ">{credentialsStatistics.configuration} </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex  h-1/2 flex-row justify-between">
                <div className="panel h-full w-full sm:col-span-2 lg:col-span-1">
                  <div className="mb-5 flex justify-between dark:text-white-light">
                    <h5 className="text-lg font-semibold ">My Advertising Account</h5>
                  </div>
                  <div className="grid gap-8 text-sm font-bold text-[#515365] sm:grid-cols-2">
                    <div>
                      <div>
                        <div>Ads</div>
                        <div className="text-lg text-secondary">{advertiserData?.advertiser?.adsQuantity || 0}</div>
                      </div>
                    </div>
                    <div>
                      <div>
                        <div>Remaining Budget</div>
                        <div className="text-lg text-secondary">{budget?.budget?.remainingBudget || 0}</div>
                      </div>
                    </div>

                    <div>
                      <div>
                        <div>Impressions/Clicks/Conversions/Total</div>
                        <div className="text-lg text-secondary">
                          {advertiserData?.advertiser?.impressions || 0}/{advertiserData?.advertiser?.clicks || 0}/
                          {advertiserData?.advertiser?.conversions || 0}/{totalInteractions}{' '}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div>
                        <div>Cost per any interaction</div>
                        <div className="text-lg text-white dark:text-white ">
                          {totalInteractions > 0
                            ? (Number(budget?.budget?.totalBudget) - Number(budget?.budget?.remainingBudget)) /
                              totalInteractions
                            : '-'}{' '}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
