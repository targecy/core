import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import Link from 'next/link';
import { useState } from 'react';
import { useAsync, useInterval } from 'react-use';
import Swal from 'sweetalert2';
import { useContractRead, useContractWrite } from 'wagmi';

import { targecyContractAddress } from '~~/constants/contracts.constants';
import { GetAllAdsQuery, useGetAllAdsQuery } from '~~/generated/graphql.types';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const abi = require('../../generated/abis/Targecy.json');

const Ads = () => {
  const data = useGetAllAdsQuery();
  const { data: adsQuantity } = useContractRead({
    address: targecyContractAddress,
    abi,
    functionName: '_adId',
  });

  useInterval(() => {
    data.refetch();
  }, 3000);

  const ads = data?.data?.ads;

  const [metadata, setMetadata] = useState<Record<string, { title?: string; description?: string; image?: string }>>(
    {}
  );
  useAsync(async () => {
    if (ads) {
      setMetadata(
        (
          await Promise.all(
            ads.map(async (ad) => {
              const newMetadata = await fetch(`https://${ad.metadataURI}.ipfs.nftstorage.link`);
              const json = await newMetadata.json();
              return {
                id: ad.id,
                metadata: { title: json.title, description: json.description, image: json.imageUrl },
              };
            })
          )
        ).reduce<typeof metadata>((acc, curr) => {
          acc[curr.id] = curr.metadata;
          return acc;
        }, {})
      );
    }
  }, [ads]);

  const { writeAsync: deleteAdAsync } = useContractWrite({
    address: targecyContractAddress,
    abi,
    functionName: 'deleteAd',
  });

  const deleteAd = async (id: number) => {
    await deleteAdAsync({ args: [id] });
    return undefined;
  };

  const columns: DataTableColumn<GetAllAdsQuery['ads'][number]>[] = [
    { title: 'Id', accessor: 'id' },
    {
      title: 'Image',
      accessor: 'id',
      render: (ad) => <img src={metadata[ad.id]?.image} className="h-[75px] w-[75px] object-contain"></img>,
    },
    { title: 'Title', accessor: 'id', render: (ad) => metadata[ad.id]?.title },
    { title: 'Description', accessor: 'id', render: (ad) => metadata[ad.id]?.description },
    { title: 'consumptions', accessor: 'consumptions' },
    {
      title: 'Audiences',
      accessor: 'audiencesIds',
      render: (value) => value.audiences.map((a) => a.id).join(', '),
    },
    { title: 'Remaining Budget', accessor: 'remainingBudget' },
    { title: 'Total Budget', accessor: 'totalBudget' },
    {
      accessor: 'actions',
      title: '',
      textAlignment: 'right',
      render: (item) => (
        <div className="flex justify-between">
          <Link href={`/ads/edit/${item.id}`}>
            <EditOutlined
              rev={undefined}
              onClick={() => {}}
              className="align-middle text-warning hover:text-secondary"></EditOutlined>
          </Link>
          <Link href="#">
            <DeleteOutlined
              rev={undefined}
              onClick={() => {
                deleteAd(Number(item.id))
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
              }}
              className="align-middle text-danger hover:text-secondary"></DeleteOutlined>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="panel">
      <div className="mb-5 flex items-center justify-between p-2">
        <h5 className="text-lg font-semibold dark:text-white-light">Ads</h5>
        <Link className="btn btn-primary" href="/ads/editor">
          Create
        </Link>
      </div>
      <div>
        <DataTable
          rowClassName="bg-white dark:bg-black dark:text-white text-black"
          noRecordsText="No results match your search query"
          className="table-hover whitespace-nowrap bg-white p-7 px-2 py-2 dark:bg-black"
          records={ads || []}
          highlightOnHover={true}
          minHeight={200}
          columns={columns}></DataTable>
      </div>
    </div>
  );
};

export default Ads;
