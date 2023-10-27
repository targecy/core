import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import Link from 'next/link';
import { useState } from 'react';
import { useAsync, useInterval } from 'react-use';
import Swal from 'sweetalert2';
import { useContractWrite } from 'wagmi';

import { targecyContractAddress } from '~~/constants/contracts.constants';
import { GetAllZkpRequestsQuery, useGetAllZkpRequestsQuery } from '~~/generated/graphql.types';

const abi = require('../../generated/abis/localhost_Targecy.json');

const ZKPRequests = () => {
  const data = useGetAllZkpRequestsQuery();

  useInterval(() => {
    data.refetch();
  }, 3000);

  const zkprequests = data?.data?.zkprequests;

  const [metadata, setMetadata] = useState<Record<string, { title?: string; description?: string }>>({});
  useAsync(async () => {
    if (zkprequests) {
      const metadata: Record<string, { title?: string; description?: string }> = {};
      for (const tg of zkprequests) {
        const newMetadata = await fetch(`https://ipfs.io/ipfs/${tg.metadataURI}`);
        const json = await newMetadata.json();
        metadata[tg.id] = {
          title: json.title,
          description: json.description,
        };
      }

      setMetadata(metadata);
    }
  }, [zkprequests]);

  const { writeAsync: deleteZKPRequestAsync } = useContractWrite({
    address: targecyContractAddress,
    abi,
    functionName: 'deleteZKPRequest',
  });

  const deleteZKPRequest = async (id: number) => {
    await deleteZKPRequestAsync({ args: [id] });
    return undefined;
  };

  const columns: DataTableColumn<GetAllZkpRequestsQuery['zkprequests'][number]>[] = [
    { title: 'Id', accessor: 'id' },
    { title: 'Title', accessor: 'id', render: (tg) => metadata[tg.id]?.title },
    { title: 'Description', accessor: 'id', render: (tg) => metadata[tg.id]?.description },
    { title: 'Validator', accessor: 'validator' },
    { title: 'Schema', accessor: 'query_schema' },
    { title: 'Spot Index', accessor: 'query_spotIndex' },
    { title: 'Operator', accessor: 'query_operator' },
    { title: 'Value', accessor: 'query_value' },
    {
      width: 75,
      accessor: 'actions',
      title: '',
      textAlignment: 'right',
      render: (item) => (
        <div className="flex justify-between">
          <Link href={`/zkprequests/edit/${item.id}`}>
            <EditOutlined rev={undefined} className="align-middle text-warning hover:text-secondary"></EditOutlined>
          </Link>
          <Link href="#">
            <DeleteOutlined
              rev={undefined}
              onClick={() => {
                deleteZKPRequest(Number(item.id))
                  .then(async () => {
                    await Swal.mixin({
                      toast: true,
                      position: 'top',
                      showConfirmButton: false,
                      timer: 3000,
                    }).fire({
                      icon: 'success',
                      title: 'ZKPRequest deleted successfully',
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
                      title: 'Could not delete ZKPRequest.',
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
          <h5 className="text-lg font-semibold dark:text-white-light">ZKP Requests</h5>
          <Link className="btn btn-primary" href="/zkprequests/editor">
            Create
          </Link>
        </div>
        <div>
          <DataTable
            rowClassName="bg-white dark:bg-black dark:text-white text-black"
            rowBorderColor="border-fuchsia-400"
            noRecordsText="No results match your search query"
            className="table-hover whitespace-nowrap bg-white p-7 px-2 py-2 dark:bg-black"
            records={zkprequests}
            minHeight={200}
            columns={columns}></DataTable>
        </div>
      </div>
    </>
  );
};

export default ZKPRequests;
