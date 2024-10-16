import { getIPFSStorageUrl } from '@common/functions/getIPFSStorageUrl';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useAsync } from 'react-use';
import Swal from 'sweetalert2';
import { useContractWrite } from 'wagmi';

import { targecyContractAddress } from '~/constants/contracts.constants';
import { Targecy__factory } from '~/generated/contract-types';
import { useGetAudienceQuery } from '~/generated/graphql.types';

const AudienceDetailPage = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, isLoading } = useGetAudienceQuery({ id });
  const audience = data?.audience;

  const [metadata, setMetadata] = useState<{ title?: string; description?: string; image?: string }>({});
  useAsync(async () => {
    if (audience) {
      const newMetadata = await fetch(getIPFSStorageUrl(audience.metadataURI));
      const json = await newMetadata.json();
      setMetadata({ title: json.title, description: json.description });
    }
  }, [audience]);

  const [segmentsMetadata, setSegmentsMetadata] = useState<
    Record<string, { title?: string; description?: string; image?: string }>
  >({});
  useAsync(async () => {
    if (audience) {
      const newSegmentsMetadata = (
        await Promise.all(
          audience.segments.map(async (s) => {
            const newMetadata = await fetch(getIPFSStorageUrl(s.metadataURI));
            const json = await newMetadata.json();
            return { id: s.id, metadata: { title: json.title, description: json.description } };
          })
        )
      ).reduce<typeof segmentsMetadata>((acc, curr) => {
        acc[curr.id] = curr.metadata;
        return acc;
      }, {});
      setSegmentsMetadata(newSegmentsMetadata);
    }
  }, [audience]);

  const { writeAsync: deleteAudienceAsync } = useContractWrite({
    address: targecyContractAddress,
    abi: Targecy__factory.abi,
    functionName: 'deleteAudience',
  });

  const deleteAudience = async (id: number) => {
    await deleteAudienceAsync({ args: [BigInt(id)] });
    return undefined;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <ul className="flex space-x-2 rtl:space-x-reverse">
        <li>
          <Link href="/audiences" className="text-primary hover:underline">
            Audiences
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
              <Link href={`/audiences/edit/${id}`} className="btn-outline-warning btn m-2 w-fit">
                Edit
              </Link>
              <button
                className="btn-outline-danger btn m-2 w-fit"
                onClick={() => {
                  deleteAudience(Number(id))
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
                      console.error(error);
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
              <label className="mb-3 text-xl text-black dark:text-white">{audience?.id}</label>
            </div>
          </div>
          <div className="space-between flex w-full flex-row gap-5">
            <div className="flex-col">
              <label className="mb-3 text-xl text-secondary"> Consumptions </label>
            </div>
            <div className="flex-col">
              <label className="mb-3 text-xl text-black dark:text-white">{audience?.consumptions}</label>
            </div>
          </div>
          <div className="space-between flex w-full flex-row gap-5">
            <div className="flex-col">
              <label className="mb-3 text-xl text-secondary"> Segments </label>
            </div>
            <div className="flex-col">
              {audience?.segments.map((segment) => (
                <div className="flex-row" key={segment.id}>
                  <label className="mb-3 text-xl text-black dark:text-white">
                    {segmentsMetadata[segment.id]?.title}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudienceDetailPage;
