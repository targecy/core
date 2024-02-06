import { getIPFSStorageUrl } from '@common/functions/getIPFSStorageUrl';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useAsync } from 'react-use';
import Swal from 'sweetalert2';
import { useContractWrite } from 'wagmi';

import { targecyContractAddress } from '~/constants/contracts.constants';
import { Targecy__factory } from '~/generated/contract-types';
import { useGetSegmentQuery } from '~/generated/graphql.types';
import { shortString } from '~/utils';

const SegmentDetailPage = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, isLoading } = useGetSegmentQuery({ id });
  const segment = data?.segment;

  const [metadata, setMetadata] = useState<{ title?: string; description?: string; image?: string }>({});
  useAsync(async () => {
    if (segment) {
      const newMetadata = await fetch(getIPFSStorageUrl(segment.metadataURI));
      const json = await newMetadata.json();
      setMetadata({ title: json.title, description: json.description });
    }
  }, [segment]);
  const { writeAsync: deleteSegmentAsync } = useContractWrite({
    address: targecyContractAddress,
    abi: Targecy__factory.abi,
    functionName: 'deleteSegment',
  });

  const deleteSegment = async (id: bigint) => {
    await deleteSegmentAsync({ args: [id] });
    return undefined;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <ul className="flex space-x-2 rtl:space-x-reverse">
        <li>
          <Link href="/segments" className="text-primary hover:underline">
            Segments
          </Link>
        </li>
        <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">{id}</li>
      </ul>

      <div className="space-y-8 pt-5">
        <div className="panel items-center overflow-x-auto whitespace-nowrap p-7 text-primary">
          <div className="grid grid-cols-2 gap-4">
            <div className="">
              <label className="mb-1 text-2xl text-black dark:text-white">{metadata.title}</label>
              <label className="mb-3 text-lg text-black dark:text-white">{metadata.description}</label>
            </div>

            <div className="flex w-full justify-end">
              <Link href={`/segments/edit/${id}`} className="btn-outline-warning btn m-2 w-fit">
                Edit
              </Link>
              <button
                className="btn-outline-danger btn m-2 w-fit"
                onClick={() => {
                  deleteSegment(BigInt(id))
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
                        title: 'Could not delete segment.',
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

          <div className="space-between flex w-full flex-row gap-5">
            <div className="flex-col">
              <label className="mb-3 text-xl text-secondary"> ID </label>
            </div>
            <div className="flex-col">
              <label className="mb-3 text-xl text-black dark:text-white">{segment?.id}</label>
            </div>
          </div>
          <div className="space-between flex w-full flex-row gap-5">
            <div className="flex-col">
              <label className="mb-3 text-xl text-secondary"> Issuer </label>
            </div>
            <div className="flex-col">
              <label className="mb-3 text-xl text-black dark:text-white">{segment?.issuer.id}</label>
            </div>
          </div>
          <div className="space-between flex w-full flex-row gap-5">
            <div className="flex-col">
              <label className="mb-3 text-xl text-secondary"> Zero-Knowledge Proof Query </label>
            </div>
            <div className="flex-col">
              <div className="space-between flex w-full flex-row gap-5">
                <div className="flex-col">
                  <label className="mb-3 text-xl text-black dark:text-white"> Circuit </label>
                </div>
                <div className="flex-col">
                  <label className="mb-3 text-xl text-black dark:text-white">{segment?.queryCircuitId}</label>
                </div>
              </div>{' '}
              <div className="space-between flex w-full flex-row gap-5">
                <div className="flex-col">
                  <label className="mb-3 text-xl text-black dark:text-white"> Schema </label>
                </div>
                <div className="flex-col">
                  <label className="mb-3 text-xl text-black dark:text-white">{segment?.querySchema}</label>
                </div>
              </div>{' '}
              <div className="space-between flex w-full flex-row gap-5">
                <div className="flex-col">
                  <label className="mb-3 text-xl text-black dark:text-white"> Slot Index </label>
                </div>
                <div className="flex-col">
                  <label className="mb-3 text-xl text-black dark:text-white">{segment?.querySlotIndex}</label>
                </div>
              </div>{' '}
              <div className="space-between flex w-full flex-row gap-5">
                <div className="flex-col">
                  <label className="mb-3 text-xl text-black dark:text-white"> Operator </label>
                </div>
                <div className="flex-col">
                  <label className="mb-3 text-xl text-black dark:text-white">{segment?.queryOperator}</label>
                </div>
              </div>{' '}
              <div className="space-between flex w-full flex-row gap-5">
                <div className="flex-col">
                  <label className="mb-3 text-xl text-black dark:text-white"> Value (parsed) </label>
                </div>
                <div className="flex-col">
                  <label className="w-max-1 mb-3 break-words text-xl text-black dark:text-white">
                    {shortString(segment?.queryValue?.filter((e: string) => e !== '0')?.toString() ?? '', 10)}
                  </label>
                </div>
              </div>{' '}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SegmentDetailPage;
