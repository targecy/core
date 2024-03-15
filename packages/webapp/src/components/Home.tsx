import { SCHEMA } from '@backend/constants/schemas/schemas.constant';
import { getIPFSStorageUrl } from '@common/functions/getIPFSStorageUrl';
import { useCredentialsStatistics, useTargecyContext } from '@targecy/sdk';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAsync, useCookie } from 'react-use';
import { useContractRead } from 'wagmi';

import abi from '../generated/abis/Targecy.json';

import { ActivityLog } from './HomeComponents/ActivityLog';
import { HomeLoader } from './loaders/HomeLoader';

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
import { UserRole } from '~/utils/preferences';

const scannerUrl: Record<typeof env.NEXT_PUBLIC_VERCEL_ENV, string> = {
  development: `http://localhost:8090`,
  preview: `https://mumbai.polygonscan.com`,
  production: `https://mumbai.polygonscan.com`,
};

export const Home = () => {
  const { data: adsQuantityData } = useContractRead({
    address: targecyContractAddress,
    abi,
    functionName: '_adId',
  });
  const adsQuantity = adsQuantityData?.toString() ?? 0;

  const { data: audiencesQuantityData, isLoading: audienceQuantityLoading } = useContractRead({
    address: targecyContractAddress,
    abi,
    functionName: '_audienceId',
  });
  const audiencesQuantity = audiencesQuantityData?.toString() ?? 0;

  const { data: segmentsQuantityData, isLoading: segmentsQuantityLoading } = useContractRead({
    address: targecyContractAddress,
    abi,
    functionName: '_segmentId',
  });
  const segmentsQuantity = segmentsQuantityData?.toString() ?? 0;

  const { data: totalConsumptionsData, isLoading: totalConsumtionsLoading } = useContractRead({
    address: targecyContractAddress,
    abi,
    functionName: 'totalConsumptions',
  });
  const totalConsumptions = totalConsumptionsData?.toString() ?? 0;

  const { data: lastAds } = useGetLastAdsQuery({ limit: 5 });
  const [lastAdsMetadata, setLastAdsMetadata] = useState<Record<string, { title?: string; description?: string }>>({});

  const { loading: lastAdsLoading } = useAsync(async () => {
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

  const { loading: lastAudiencesLoading } = useAsync(async () => {
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

  const { loading: lastSegmentsLoading } = useAsync(async () => {
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
  const { loading: backendTrpcLoding } = useAsync(async () => {
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

  const isLoadingQuantities = audienceQuantityLoading || segmentsQuantityLoading || totalConsumtionsLoading;
  const loadingQueries = lastAdsLoading || lastAudiencesLoading || lastSegmentsLoading || backendTrpcLoding;

  const [cookieValue] = useCookie('userRoles');

  const [hasMultipleRoles, setHasMultipleRoles] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [isAdvertiser, setIsAdvertiser] = useState(false);
  const [isPublisher, setIsPublisher] = useState(false);

  const [action, setAction] = useState<
    | {
        url: string;
        label: string;
      }
    | undefined
  >(undefined);

  useEffect(() => {
    const userRoles = JSON.parse(cookieValue ?? '[]') as UserRole[];
    setHasMultipleRoles(userRoles.length > 1);
    setIsUser(userRoles.includes('user'));

    const isAdvertiserBoolean = userRoles.includes('creator') || userRoles.includes('business');
    setIsAdvertiser(isAdvertiserBoolean);
    setIsPublisher(userRoles.includes('publisher'));

    if (isAdvertiserBoolean) {
      setAction({
        url: '/ads/editor',
        label: 'Create Ad',
      });
    }
  }, [cookieValue]);

  if (isLoadingQuantities || loadingQueries) {
    return <HomeLoader />;
  }

  return (
    <div>
      <div className="">
        <div className="flex h-1/4 flex-row justify-between">
          <div className="panel h-max-[100px] mb-3 w-full">
            <div className="flex flex-auto flex-wrap justify-between gap-5 pr-10 text-sm font-bold text-[#515365] sm:grid-cols-2">
              <div>
                <h5 className="text-lg font-semibold text-black dark:text-white  ">Network Statistics</h5>
                <h6 className="text-sm font-semibold text-gray-900 dark:text-gray-400 ">
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
                  <div className="text-gray-900 dark:text-gray-400">Impressions/Clicks/Conversions</div>
                  <div className="text-lg text-primary">{totalConsumptions}</div>
                </div>
              </div>
              <div>
                <div>
                  <div className="text-gray-900 dark:text-gray-400">Ads</div>
                  <div className="text-lg text-primary">{adsQuantity}</div>
                </div>
              </div>

              <div>
                <div>
                  <div className="text-gray-900 dark:text-gray-400">Audiences</div>
                  <div className="text-lg text-primary">{audiencesQuantity} </div>
                </div>
              </div>

              <div>
                <div>
                  <div className="text-gray-900 dark:text-gray-400">Segments</div>
                  <div className="text-lg text-primary ">{segmentsQuantity} </div>
                </div>
              </div>
            </div>
          </div>
          {action && (
            <Link href={action.url} className="btn btn-secondary m-1 ml-3 h-20 w-36">
              {action.label}
            </Link>
          )}
        </div>
        <div className="flex h-3/4 flex-row justify-between">
          <div className="w-full sm:block md:block lg:flex">
            <div className="mt-3 flex-col sm:mr-0 sm:block md:block md:w-full lg:mr-3 lg:flex lg:w-1/3">
              <ActivityLog
                lastAds={lastAds}
                lastAdsMetadata={lastAdsMetadata}
                lastAudiences={lastAudiences}
                lastAudiencesMetadata={lastAudiencesMetadata}
                lastSegments={lastSegments}
                lastSegmentsMetadata={lastSegmentsMetadata}
                schemas={schemas}
              />
            </div>
            <div className="mb-3 mt-3 flex-col sm:ml-0 sm:block sm:w-full md:ml-0 md:block md:w-full lg:ml-3 lg:flex lg:w-2/3">
              {isUser && (
                <div className="mb-3 flex flex-row justify-between">
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
              )}
              {isAdvertiser && (
                <div className="flex  h-fit flex-row justify-between">
                  <div className="panel h-full w-full sm:col-span-2 lg:col-span-1">
                    <div className="mb-5 flex justify-between dark:text-white-light">
                      <h5 className="text-lg font-semibold ">My Advertising Account</h5>
                    </div>
                    <div className="grid gap-8 text-sm font-bold text-[#515365] sm:grid-cols-2">
                      <div>
                        <div>
                          <div className="text-gray-900 dark:text-gray-400">Ads</div>
                          <div className="text-lg text-secondary">{advertiserData?.advertiser?.adsQuantity || 0}</div>
                        </div>
                      </div>
                      <div>
                        <div>
                          <div className="text-gray-900 dark:text-gray-400">Remaining Budget</div>
                          <div className="text-lg text-secondary">{budget?.budget?.remainingBudget || 0}</div>
                        </div>
                      </div>

                      <div>
                        <div>
                          <div className="text-gray-900 dark:text-gray-400">Total Interactions</div>
                          <div className="text-lg text-secondary">{totalInteractions} </div>
                        </div>
                      </div>

                      <div>
                        <div>
                          <div className="text-gray-900 dark:text-gray-400">Cost per any interaction</div>
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
