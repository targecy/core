import { EditOutlined, DeleteOutlined, PauseOutlined, CaretRightOutlined } from '@ant-design/icons';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useInterval } from 'react-use';
import Swal from 'sweetalert2';
import { useContractWrite } from 'wagmi';

import { targecyContractAddress } from '~/constants/contracts.constants';
import { useWallet } from '~/hooks';
import { useGetAdsByAdvertiserQuery, GetAdsByAdvertiserWithMetadataQuery } from '~/services/api';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const abi = require('../../generated/abis/Targecy.json');

const AdsList = () => {
  const router = useRouter();
  const { address } = useWallet();
  const results = useGetAdsByAdvertiserQuery({ advertiserId: address?.toLowerCase() ?? '' });

  useInterval(() => {
    results.refetch();
  }, 3000);

  const ads = results?.data?.ads;

  const { writeAsync: deleteAdAsync } = useContractWrite({
    address: targecyContractAddress,
    abi,
    functionName: 'deleteAd',
  });

  const deleteAd = async (id: number) => {
    await deleteAdAsync({ args: [id] });
    return undefined;
  };

  const { writeAsync: pauseAdAsync } = useContractWrite({
    address: targecyContractAddress,
    abi,
    functionName: 'pauseAd',
  });

  const pauseAd = async (id: number) => {
    await pauseAdAsync({ args: [id] });
    return undefined;
  };

  const { writeAsync: unpauseAdAsync } = useContractWrite({
    address: targecyContractAddress,
    abi,
    functionName: 'unpauseAd',
  });

  const unpauseAd = async (id: number) => {
    await unpauseAdAsync({ args: [id] });
    return undefined;
  };

  const columns: DataTableColumn<GetAdsByAdvertiserWithMetadataQuery['ads'][number]>[] = [
    { title: 'Id', accessor: 'id' },
    {
      title: 'Image',
      accessor: 'image',
      render: (ad) => (
        <Image
          width={75}
          height={75}
          src={ad.metadata.image || ad.metadata.imageUrl || ''}
          className="h-[75px] w-[75px] object-contain"
          alt={ad.metadata.title || 'Ad image'}
        />
      ),
    },
    { title: 'Title', accessor: 'title', render: (ad) => ad.metadata.title },
    { title: 'Description', accessor: 'description', render: (ad) => ad.metadata.description },
    {
      title: 'Attribution',
      accessor: 'attribution',
      render: (value) => {
        switch (value.attribution) {
          case '0':
            return 'Impression';
          case '1':
            return 'Click';
          case '2':
            return 'Conversion';
          default:
            throw new Error('Invalid attribution');
        }
      },
    },
    { title: 'Consumptions', accessor: 'consumptions', render: (value) => value.consumptions },
    {
      accessor: 'actions',
      title: '',
      textAlignment: 'right',
      render: (item) => (
        <div className="flex justify-between">
          {item.active ? (
            <Link href="#">
              <PauseOutlined
                rev={undefined}
                onClick={() => {
                  pauseAd(Number(item.id))
                    .then(async () => {
                      await Swal.mixin({
                        toast: true,
                        position: 'top',
                        showConfirmButton: false,
                        timer: 3000,
                      }).fire({
                        icon: 'success',
                        title: 'Ad paused successfully',
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
                        title: 'Could not pause ad.',
                        padding: '10px 20px',
                      });
                      console.log(error);
                    });
                }}
                className="ml-2 align-middle text-warning transition-all hover:text-secondary"
              />
            </Link>
          ) : (
            <Link href="#">
              <CaretRightOutlined
                rev={undefined}
                onClick={() => {
                  unpauseAd(Number(item.id))
                    .then(async () => {
                      await Swal.mixin({
                        toast: true,
                        position: 'top',
                        showConfirmButton: false,
                        timer: 3000,
                      }).fire({
                        icon: 'success',
                        title: 'Ad unpaused successfully',
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
                        title: 'Could not unpause ad.',
                        padding: '10px 20px',
                      });
                      console.log(error);
                    });
                }}
                className="ml-2 align-middle text-warning transition-all hover:text-secondary"
              />
            </Link>
          )}
          <Link href={`/ads/edit/${item.id}`}>
            <EditOutlined
              rev={undefined}
              onClick={() => {}}
              className="align-middle text-warning transition-all  hover:text-secondary"></EditOutlined>
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
              className="ml-2 align-middle text-danger transition-all hover:text-secondary"
            />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="panel">
      <div className="mb-5 flex items-center justify-between p-2">
        <h5 className="text-2xl font-semibold dark:text-white-light">Ads</h5>
        <Link className="btn-outline-secondary btn" href="/ads/editor">
          Create
        </Link>
      </div>
      <div>
        <DataTable
          rowBorderColor="transparent"
          borderColor="grey"
          noRecordsIcon={<div></div>}
          rowClassName="bg-white dark:bg-black dark:text-white text-black"
          className="table-hover whitespace-nowrap bg-white p-7 px-2 py-2 dark:bg-black"
          records={ads || []}
          onRowClick={(row) => {
            router.push(`/ads/${row.id}`).catch((e) => console.log(e));
          }}
          highlightOnHover={true}
          minHeight={100}
          columns={columns}
          idAccessor="id"
        />
      </div>
    </div>
  );
};

export default AdsList;
