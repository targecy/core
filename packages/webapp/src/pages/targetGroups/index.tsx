import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import Link from 'next/link';
import { useState } from 'react';
import { useAsync, useInterval } from 'react-use';
import Swal from 'sweetalert2';
import { useContractWrite } from 'wagmi';

import { targecyContractAddress } from '~~/constants/contracts.constants';
import { GetAllTargetGroupsQuery, useGetAllTargetGroupsQuery } from '~~/generated/graphql.types';

const abi = require('../../generated/abis/Targecy.json');

const TargetGroups = () => {
  const data = useGetAllTargetGroupsQuery();

  useInterval(() => {
    data.refetch();
  }, 3000);

  const targetGroups = data?.data?.targetGroups;

  const [metadata, setMetadata] = useState<Record<string, { title?: string; description?: string; image?: string }>>(
    {}
  );
  useAsync(async () => {
    if (targetGroups) {
      const newMetadataState: Record<string, { title?: string; description?: string }> = {};
      for (const tg of targetGroups) {
        const newMetadata = await fetch(`https://${tg.metadataURI}.ipfs.nftstorage.link`);
        const json = await newMetadata.json();
        newMetadataState[tg.id] = {
          title: json.title,
          description: json.description,
        };
        setMetadata(newMetadataState);
      }
    }
  }, [targetGroups]);

  const { writeAsync: deleteTargetGroupAsync } = useContractWrite({
    address: targecyContractAddress,
    abi,
    functionName: 'deleteTargetGroup',
  });

  const deleteTargetGroup = async (id: number) => {
    await deleteTargetGroupAsync({ args: [id] });
    return undefined;
  };

  const columns: DataTableColumn<GetAllTargetGroupsQuery['targetGroups'][number]>[] = [
    { title: 'Id', accessor: 'id' },
    { title: 'Title', accessor: 'id', render: (tg) => metadata[tg.id]?.title },
    { title: 'Description', accessor: 'id', render: (tg) => metadata[tg.id]?.description },
    {
      title: 'Attributes IDs',
      accessor: 'zkRequests',
      render: (value) => value.zkRequests.map((r) => r.id).join(', '),
    },
    {
      width: 75,
      accessor: 'actions',
      title: '',
      textAlignment: 'right',
      render: (item) => (
        <div className="flex justify-between">
          <Link href={`/targetGroups/edit/${item.id}`}>
            <EditOutlined
              rev={undefined}
              onClick={() => {}}
              className="align-middle text-warning hover:text-secondary"></EditOutlined>
          </Link>
          <Link href="#">
            <DeleteOutlined
              rev={undefined}
              onClick={() => {
                deleteTargetGroup(Number(item.id))
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
    <>
      <div className="panel">
        <div className="mb-5 flex items-center justify-between p-2">
          <h5 className="text-lg font-semibold dark:text-white-light">Target Groups</h5>
          <Link className="btn btn-primary" href="/targetGroups/editor">
            Create
          </Link>
        </div>
        <div>
          <DataTable
            rowClassName="bg-white dark:bg-black dark:text-white text-black"
            noRecordsText="No results match your search query"
            className="table-hover whitespace-nowrap bg-white p-7 px-2 py-2 dark:bg-black"
            records={targetGroups}
            highlightOnHover={true}
            minHeight={200}
            columns={columns}></DataTable>
        </div>
      </div>
    </>
  );
};

export default TargetGroups;
