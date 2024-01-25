import { getIPFSStorageUrl } from '@common/functions/getIPFSStorageUrl';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useAsync } from 'react-use';
import Swal from 'sweetalert2';
import { useContractWrite } from 'wagmi';

import { targecyContractAddress } from '~/constants/contracts.constants';
import { useGetAdQuery } from '~/generated/graphql.types';
import { weekdayToNumber } from '~/utils';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const abi = require('../../generated/abis/Targecy.json');

const AdDetailPage = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, isLoading } = useGetAdQuery({ id });
  const ad = data?.ad;

  const [metadata, setMetadata] = useState<{ title?: string; description?: string; image?: string; imageUrl?: string }>(
    {}
  );
  useAsync(async () => {
    if (ad) {
      const newMetadata = await fetch(getIPFSStorageUrl(ad.metadataURI));
      const { title, description, image, imageUrl } = await newMetadata.json();
      setMetadata({ title, description, image: image || imageUrl });
    }
  }, [ad]);
  const { writeAsync: deleteAdAsync } = useContractWrite({
    address: targecyContractAddress,
    abi,
    functionName: 'deleteAd',
  });

  const deleteAd = async (id: number) => {
    await deleteAdAsync({ args: [id] });
    return undefined;
  };

  const [audiencesMetadata, setAudiencesMetadata] = useState<
    Record<string, { title?: string; description?: string; image?: string }>
  >({});
  useAsync(async () => {
    if (ad) {
      const newAudiencesMetadata = (
        await Promise.all(
          ad.audiences.map(async (s) => {
            const newMetadata = await fetch(getIPFSStorageUrl(s.metadataURI));
            const json = await newMetadata.json();
            return { id: s.id, metadata: { title: json.title, description: json.description } };
          })
        )
      ).reduce<typeof audiencesMetadata>((acc, curr) => {
        acc[curr.id] = curr.metadata;
        return acc;
      }, {});
      setAudiencesMetadata(newAudiencesMetadata);
    }
  }, [ad]);

  let attributionLabel;
  switch (ad?.attribution) {
    case '0':
      attributionLabel = 'Impression';
      break;
    case '1':
      attributionLabel = 'Click';
      break;
    case '2':
      attributionLabel = 'Conversion';
      break;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <ul className="flex space-x-2 rtl:space-x-reverse">
        <li>
          <Link href="/ads" className="text-primary hover:underline">
            Ads
          </Link>
        </li>
        <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">{id}</li>
      </ul>

      <div className="space-y-8 pt-5">
        <div className="panel items-center overflow-x-auto whitespace-nowrap p-7 text-primary">
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-3 grid grid-cols-3 gap-2">
              <div className="col-span-1">
                <Image
                  width={300}
                  height={250}
                  src={metadata.image || ''}
                  className="h-[250px] w-[300px] object-contain"
                  alt={metadata.title || 'Ad image'}
                />
              </div>
              <div className="col-span-2 p-4">
                <label className="mb-1 text-2xl text-black dark:text-white">{metadata.title}</label>
                <label className="mb-3 text-lg text-black opacity-80 dark:text-white">{metadata.description}</label>
              </div>
            </div>

            <div className="flex w-full justify-end">
              <Link href={`/ads/edit/${id}`} className="btn-outline-warning btn m-2 w-fit">
                Edit
              </Link>
              <button
                className="btn-outline-danger btn m-2 w-fit"
                onClick={() => {
                  deleteAd(Number(id))
                    .then(async () => {
                      await Swal.mixin({
                        toast: true,
                        position: 'top',
                        showConfirmButton: false,
                        timer: 3000,
                      }).fire({
                        icon: 'success',
                        title: 'Ad deleted successfully',
                        padding: '10px 20px',
                      });
                    })
                    .catch(async (error) => {
                      await Swal.mixin({
                        toast: true,
                        position: 'top',
                        showConfirmButton: false,
                        timer: 3000,
                      }).fire({
                        icon: 'error',
                        title: 'Could not delete ad.',
                        padding: '10px 20px',
                      });
                      console.log(error);
                    });
                }}>
                Delete
              </button>
            </div>
          </div>
          <br></br>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid-cols-1">
              <label className="text-md text-dark dark:text-white">Basic</label>
              <div className="space-between flex w-full flex-row gap-5">
                <div className="flex-col">
                  <label className="mb-3 text-xl text-secondary"> ID </label>
                </div>
                <div className="flex-col">
                  <label className="mb-3 text-xl text-black dark:text-white">{ad?.id}</label>
                </div>
              </div>
              <div className="space-between flex w-full flex-row gap-5">
                <div className="flex-col">
                  <label className="mb-3 text-xl text-secondary"> Advertiser </label>
                </div>
                <div className="flex-col">
                  <label className="mb-3 text-xl text-black dark:text-white">{ad?.advertiser.id}</label>
                </div>
              </div>

              <div className="space-between flex w-full flex-row gap-5">
                <div className="flex-col">
                  <label className="mb-3 text-xl text-secondary"> Attribution </label>
                </div>
                <div className="flex-col">
                  <label className="mb-3 text-xl text-black dark:text-white">{attributionLabel}</label>
                </div>
              </div>

              <br></br>
              <label className="text-md text-dark dark:text-white"> Conditions</label>
              <div className="space-between flex w-full flex-row gap-5">
                <div className="flex-col">
                  <label className="mb-3 text-xl text-secondary"> Starting Date </label>
                </div>
                <div className="flex-col">
                  <label className="mb-3 text-xl text-black dark:text-white">
                    {new Date(ad?.startingTimestamp).toLocaleString()}
                  </label>
                </div>
              </div>
              <div className="space-between flex w-full flex-row gap-5">
                <div className="flex-col">
                  <label className="mb-3 text-xl text-secondary"> Ending Date </label>
                </div>
                <div className="flex-col">
                  <label className="mb-3 text-xl text-black dark:text-white">
                    {new Date(ad?.endingTimestamp).toLocaleString()}
                  </label>
                </div>
              </div>

              <div className="space-between flex w-full flex-row gap-5">
                <div className="flex-col">
                  <label className="mb-3 text-xl text-secondary"> Blacklisted Publishers </label>
                </div>
                <div className="flex-col">
                  <label className="mb-3 text-xl text-black dark:text-white">
                    {ad?.blacklistedPublishers?.toString() || '-'}
                  </label>
                </div>
              </div>
              <div className="space-between flex w-full flex-row gap-5">
                <div className="flex-col">
                  <label className="mb-3 text-xl text-secondary"> Blacklisted Weekdays </label>
                </div>
                <div className="flex-col">
                  <label className="mb-3 text-xl text-black dark:text-white">
                    {ad?.blacklistedWeekdays?.sort().map(weekdayToNumber).toString() || '-'}
                  </label>
                </div>
              </div>

              <br></br>

              <label className="text-md text-dark dark:text-white"> Budget</label>
              <div className="space-between flex w-full flex-row gap-5">
                <div className="flex-col">
                  <label className="mb-3 text-xl text-secondary"> Maximum Budget </label>
                </div>
                <div className="flex-col">
                  <label className="mb-3 text-xl text-black dark:text-white">{ad?.maxBudget}</label>
                </div>
              </div>
              <div className="space-between flex w-full flex-row gap-5">
                <div className="flex-col">
                  <label className="mb-3 text-xl text-secondary"> Maximum {attributionLabel}s per day </label>
                </div>
                <div className="flex-col">
                  <label className="mb-3 text-xl text-black dark:text-white">{ad?.maxConsumptionsPerDay}</label>
                </div>
              </div>

              <div className="space-between flex w-full flex-row gap-5">
                <div className="flex-col">
                  <label className="mb-3 text-xl text-secondary"> Maximum Price per {attributionLabel} </label>
                </div>
                <div className="flex-col">
                  <label className="mb-3 text-xl text-black dark:text-white">{ad?.maxPricePerConsumption}</label>
                </div>
              </div>

              <br></br>
              <label className="text-md text-dark dark:text-white"> Audiences</label>
              <div className="space-between flex w-full flex-row gap-5">
                <div className="flex-col">
                  <label className="mb-3 text-xl text-secondary"> Audiences </label>
                </div>
                <div className="flex-col">
                  {ad?.audiences.map((audience) => (
                    <div className="flex-row" key={audience.id}>
                      <label className="mb-3 text-xl text-black dark:text-white">
                        <Link
                          href={`/audiences/${audience.id}`}
                          target="_blank"
                          className="mb-3 text-xl text-black transition-all hover:text-primary dark:text-white dark:hover:text-primary">
                          {audiencesMetadata[audience.id]?.title}
                        </Link>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid-cols-1">
              <label className="text-md text-dark dark:text-white"> Statistics</label>
              <div className="space-between flex w-full flex-row gap-5">
                <div className="flex-col">
                  <label className="mb-1 text-xl text-secondary"> Total {attributionLabel}s </label>
                </div>
                <div className="flex-col">
                  <label className="mb-1 text-xl text-black dark:text-white">{ad?.consumptions}</label>
                </div>
              </div>

              <div className="space-between flex w-full flex-row gap-5">
                <div className="flex-col">
                  <label className="mb-1 text-xl text-secondary"> {attributionLabel}s per day </label>
                </div>
                <div className="flex-col">
                  <label className="mb-1 text-xl text-black dark:text-white">
                    {/* @todo (Martin): plot points into a curve */}
                    {ad?.consumptionsPerDay.length
                      ? ad?.consumptionsPerDay.map((perDay) => (
                          <label className="mb-1 text-xl text-black dark:text-white" key={perDay.id}>
                            {new Date(perDay.day).toLocaleString()} : {perDay.consumptions}
                          </label>
                        ))
                      : '-'}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdDetailPage;
