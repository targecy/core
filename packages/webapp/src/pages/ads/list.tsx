import { EditOutlined, DeleteOutlined, PauseOutlined, CaretRightOutlined } from '@ant-design/icons';
import { getIPFSStorageUrl } from '@common/functions/getIPFSStorageUrl';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAsync, useInterval } from 'react-use';
import Swal from 'sweetalert2';
import { useContractWrite } from 'wagmi';

import { AdsListLoader } from '~/components/AdsListLoader';
import { targecyContractAddress } from '~/constants/contracts.constants';
import { Targecy__factory } from '~/generated/contract-types';
import { GetAllAdsQuery, useGetAdsByAdvertiserQuery } from '~/generated/graphql.types';
import { useWallet } from '~/hooks';
import { setPageTitle } from '~/store/themeConfigSlice';

const AdsList = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle('Campaigns'));
  });

  const router = useRouter();
  const { address } = useWallet();
  const data = useGetAdsByAdvertiserQuery({ advertiserId: address?.toLowerCase() ?? '' });

  useInterval(() => {
    data.refetch();
  }, 2000);

  const ads = data?.data?.ads;

  const [metadata, setMetadata] = useState<Record<string, { title?: string; description?: string; image?: string }>>(
    {}
  );
  const { loading: loadingAdsByAdvertiserData } = useAsync(async () => {
    if (ads) {
      setMetadata(
        (
          await Promise.all(
            ads.map(async (ad) => {
              const newMetadata = await fetch(getIPFSStorageUrl(ad.metadataURI));
              const { title, description, image, imageUrl } = await newMetadata.json();
              return {
                id: ad.id,
                metadata: { title, description, image: image || imageUrl },
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
    abi: Targecy__factory.abi,
    functionName: 'deleteAd',
  });

  const deleteAd = async (id: number) => {
    await deleteAdAsync({ args: [BigInt(id)] });
    return undefined;
  };

  const { writeAsync: pauseAdAsync } = useContractWrite({
    address: targecyContractAddress,
    abi: Targecy__factory.abi,
    functionName: 'pauseAd',
  });

  const pauseAd = async (id: number) => {
    await pauseAdAsync({ args: [BigInt(id)] });
    return undefined;
  };

  const { writeAsync: unpauseAdAsync } = useContractWrite({
    address: targecyContractAddress,
    abi: Targecy__factory.abi,
    functionName: 'unpauseAd',
  });

  const unpauseAd = async (id: number) => {
    await unpauseAdAsync({ args: [BigInt(id)] });
    return undefined;
  };

  const columns: DataTableColumn<GetAllAdsQuery['ads'][number]>[] = [
    { title: 'Id', accessor: 'id' },
    {
      title: 'Image',
      accessor: 'image',
      render: (ad) => <img src={metadata[ad.id]?.image} className="h-[75px] w-[75px] object-contain"></img>,
    },
    { title: 'Title', accessor: 'title', render: (ad) => metadata[ad.id]?.title },
    { title: 'Description', accessor: 'description', render: (ad) => metadata[ad.id]?.description },
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
                      console.error(error);
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
                      console.error(error);
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
                    console.error(error);
                  });
              }}
              className="ml-2 align-middle text-danger transition-all hover:text-secondary"
            />
          </Link>
        </div>
      ),
    },
  ];

  if (loadingAdsByAdvertiserData) return <AdsListLoader />;

  return (
    <div className="panel">
      <div className="mb-5 flex items-center justify-between p-2">
        <h5 className="text-2xl font-semibold dark:text-white-light">Ads</h5>
        <Link className="btn-secondary btn" href="/ads/editor">
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
            router.push(`/ads/${row.id}`).catch((e) => console.error(e));
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
