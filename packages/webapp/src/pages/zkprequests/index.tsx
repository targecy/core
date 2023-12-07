import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import Link from 'next/link';
import { useState } from 'react';
import { useAsync, useInterval } from 'react-use';
import Swal from 'sweetalert2';
import { useContractWrite } from 'wagmi';

import { SCHEMA } from '../../../../backend/src/constants/schemas/schemas.constant';

import { operatorOptions } from './editor';

import { targecyContractAddress } from '~~/constants/contracts.constants';
import { GetAllZkpRequestsQuery, useGetAllZkpRequestsQuery } from '~~/generated/graphql.types';
import { backendTrpcClient } from '~~/utils/trpc';

// Makes string shorter by removing the middle part and replacing it with ...
const shortString = (str: string, length: number) => {
  if (str.length <= length) return str;
  return `${str.substring(0, length / 2)}...${str.substring(str.length - length / 2, str.length)}`;
};

// eslint-disable-next-line @typescript-eslint/no-var-requires
const abi = require('../../generated/abis/Targecy.json');

const ZKPRequests = () => {
  const data = useGetAllZkpRequestsQuery();

  useInterval(() => {
    data.refetch();
  }, 3000);

  const zkprequests = data?.data?.zkprequests;

  const [metadata, setMetadata] = useState<Record<string, { title?: string; description?: string }>>({});
  useAsync(async () => {
    if (zkprequests) {
      setMetadata(
        (
          await Promise.all(
            zkprequests.map(async (zkpr) => {
              const newMetadata = await fetch(`https://${zkpr.metadataURI}.ipfs.nftstorage.link`);
              const json = await newMetadata.json();
              return { id: zkpr.id, metadata: { title: json.title, description: json.description } };
            })
          )
        ).reduce<typeof metadata>((acc, curr) => {
          acc[curr.id] = curr.metadata;
          return acc;
        }, {})
      );
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

  const [schemas, setSchemas] = useState<SCHEMA[]>([]);
  useAsync(async () => {
    const response = await backendTrpcClient.schemas.getAllSchemas.query();
    setSchemas(Object.entries(response).map(([, schema]) => schema));
  }, []);

  const columns: DataTableColumn<GetAllZkpRequestsQuery['zkprequests'][number]>[] = [
    { title: 'Id', accessor: 'id' },
    { title: 'Title', accessor: 'id', render: (zkpr) => metadata[zkpr.id]?.title },
    { title: 'Description', accessor: 'id', render: (zkpr) => metadata[zkpr.id]?.description },
    // { title: 'Validator', accessor: 'validator' },
    {
      title: 'Schema',
      accessor: 'query_schema',
      render: (zkpr) => schemas.find((schema) => schema.bigint === zkpr.query_schema)?.title,
    },
    {
      title: 'Field',
      accessor: 'query_spotIndex',
      render: (zkpr) => {
        const subject = schemas.find((schema) => schema.bigint === zkpr.query_schema)?.credentialSubject;
        if (!subject) return undefined;
        const keys = Object.keys(subject);
        return keys[Number(zkpr.query_slotIndex) + 1];
      },
    },
    {
      title: 'Operator',
      accessor: 'query_operator',
      render: (zkpr) => operatorOptions.find((op) => op.value === Number(zkpr.query_operator))?.label,
    },
    {
      title: 'Value (hashed)',
      accessor: 'query_value',
      // eslint-disable-next-line eqeqeq
      render: (zkpr) => shortString(zkpr.query_value.filter((e) => e != 0).toString(), 10),
    },
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
    <div className="panel">
      <div className="mb-5 flex items-center justify-between p-2">
        <h5 className="text-lg font-semibold dark:text-white-light">Attributes</h5>
        <Link className="btn btn-primary" href="/zkprequests/editor">
          Create
        </Link>
      </div>
      <div>
        <DataTable
          rowClassName="bg-white dark:bg-black dark:text-white text-black"
          noRecordsText="No results match your search query"
          className="table-hover whitespace-nowrap bg-white p-7 px-2 py-2 dark:bg-black"
          records={zkprequests}
          highlightOnHover={true}
          minHeight={200}
          columns={columns}></DataTable>
      </div>
    </div>
  );
};

export default ZKPRequests;
