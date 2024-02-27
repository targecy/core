import { CaretRightOutlined, DeleteOutlined, PauseOutlined } from '@ant-design/icons';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import { useContractWrite } from 'wagmi';

import { PublishersLoader } from '~/components/loaders/PublishersLoader';
import { targecyContractAddress } from '~/constants/contracts.constants';
import { Targecy__factory } from '~/generated/contract-types';
import { GetAllPublishersQuery, useGetAllPublishersQuery } from '~/generated/graphql.types';

const PublishersList = () => {
  const router = useRouter();
  const { data, isLoading } = useGetAllPublishersQuery();
  const publishers = data?.publishers;

  const { writeAsync: pausePublisherAsync } = useContractWrite({
    address: targecyContractAddress,
    abi: Targecy__factory.abi,
    functionName: 'pausePublisher',
  });
  const { writeAsync: unpausePublisherAsync } = useContractWrite({
    address: targecyContractAddress,
    abi: Targecy__factory.abi,
    functionName: 'unpausePublisher',
  });
  const { writeAsync: removePublisherFromWhitelistAsync } = useContractWrite({
    address: targecyContractAddress,
    abi: Targecy__factory.abi,
    functionName: 'removePublisher',
  });

  const pausePublisher = async (address: `0x${string}`) => {
    await pausePublisherAsync({ args: [address] });
    return undefined;
  };
  const unpausePublisher = async (address: `0x${string}`) => {
    await unpausePublisherAsync({ args: [address] });
    return undefined;
  };
  const removePublisherFromWhitelist = async (address: `0x${string}`) => {
    await removePublisherFromWhitelistAsync({ args: [address] });
    return undefined;
  };

  const columns: DataTableColumn<GetAllPublishersQuery['publishers'][number]>[] = [
    { title: 'Address', accessor: 'id' },
    { title: 'Ads Displayed', accessor: 'adsQuantity' },
    { title: 'Impressions', accessor: 'impressions' }, // @todo (Martin): check redundant?
    { title: 'Clicks', accessor: 'clicks' },
    { title: 'Conversions', accessor: 'conversions' },
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
                  pausePublisher(item.id as `0x${string}`)
                    .then(async () => {
                      await Swal.mixin({
                        toast: true,
                        position: 'top',
                        showConfirmButton: false,
                        timer: 3000,
                      }).fire({
                        icon: 'success',
                        title: 'Publisher paused successfully',
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
                        title: 'Could not pause publisher.',
                        padding: '10px 20px',
                      });
                      console.error(error);
                    });
                }}
                className="align-middle text-warning transition-all hover:text-secondary"></PauseOutlined>
            </Link>
          ) : (
            <Link href="#">
              <CaretRightOutlined
                rev={undefined}
                onClick={() => {
                  unpausePublisher(item.id as `0x${string}`)
                    .then(async () => {
                      await Swal.mixin({
                        toast: true,
                        position: 'top',
                        showConfirmButton: false,
                        timer: 3000,
                      }).fire({
                        icon: 'success',
                        title: 'Publisher unpaused successfully',
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
                        title: 'Could not unpause publisher.',
                        padding: '10px 20px',
                      });
                      console.error(error);
                    });
                }}
                className="align-middle text-warning transition-all hover:text-secondary"></CaretRightOutlined>
            </Link>
          )}
          <Link href="#">
            <DeleteOutlined
              rev={undefined}
              onClick={() => {
                removePublisherFromWhitelist(item.id as `0x${string}`)
                  .then(async () => {
                    await Swal.mixin({
                      toast: true,
                      position: 'top',
                      showConfirmButton: false,
                      timer: 3000,
                    }).fire({
                      icon: 'success',
                      title: 'Publisher removed successfully',
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
                      title: 'Could not remove publisher.',
                      padding: '10px 20px',
                    });
                    console.error(error);
                  });
              }}
              className="align-middle text-danger transition-all hover:text-secondary"></DeleteOutlined>
          </Link>
        </div>
      ),
    },
  ];

  if (isLoading) return <PublishersLoader />;

  return (
    <div className="panel">
      <div className="mb-5 flex items-center justify-between p-2">
        <h5 className="text-2xl font-semibold dark:text-white-light">Whitelisted Publishers</h5>
        <Link className="btn-outline-secondary btn" href="/publishers/editor">
          Add
        </Link>
      </div>
      <div>
        <DataTable
          rowBorderColor="transparent"
          borderColor="grey"
          noRecordsIcon={<div></div>}
          rowClassName="bg-white dark:bg-black dark:text-white text-black border"
          noRecordsText="No results match your search query"
          className="table-hover whitespace-nowrap bg-white p-7 px-2 py-2 dark:bg-black"
          records={publishers || []}
          onRowClick={(row) => {
            router.push(`/publishers/${row.id}`).catch((e) => console.error(e));
          }}
          highlightOnHover={true}
          minHeight={200}
          columns={columns}></DataTable>
      </div>
    </div>
  );
};

export default PublishersList;
