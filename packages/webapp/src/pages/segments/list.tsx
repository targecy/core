import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { SCHEMA } from '@backend/constants/schemas/schemas.constant';
import { getIPFSStorageUrl } from '@common/functions/getIPFSStorageUrl';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useAsync, useInterval } from 'react-use';
import Swal from 'sweetalert2';
import { useContractWrite } from 'wagmi';

import { operatorOptions } from './editor';

import { targecyContractAddress } from '~/constants/contracts.constants';
import { GetAllSegmentsQuery, useGetAllSegmentsQuery } from '~/generated/graphql.types';
import { shortString } from '~/utils';
import { backendTrpcClient } from '~/utils/trpc';
import { Targecy__factory } from '~/generated/contract-types';

const SegmentsList = () => {
  const router = useRouter();
  const data = useGetAllSegmentsQuery();

  useInterval(() => {
    data.refetch();
  }, 3000);

  const segments = data?.data?.segments;

  const [metadata, setMetadata] = useState<Record<string, { title?: string; description?: string }>>({});
  useAsync(async () => {
    if (segments) {
      setMetadata(
        (
          await Promise.all(
            segments.map(async (zkpr) => {
              const newMetadata = await fetch(getIPFSStorageUrl(zkpr.metadataURI));
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
  }, [segments]);

  const { writeAsync: deleteSegmentAsync } = useContractWrite({
    address: targecyContractAddress,
    abi: Targecy__factory.abi,
    functionName: 'deleteSegment',
  });

  const deleteSegment = async (id: bigint) => {
    await deleteSegmentAsync({ args: [id] });
    return undefined;
  };

  const [schemas, setSchemas] = useState<SCHEMA<any>[]>([]);
  useAsync(async () => {
    const response = await backendTrpcClient.schemas.getAllSchemas.query();
    setSchemas(Object.entries(response).map(([, schema]) => schema));
  }, []);

  const columns: DataTableColumn<GetAllSegmentsQuery['segments'][number]>[] = [
    { title: 'Id', accessor: 'id' },
    { title: 'Title', accessor: 'id', render: (zkpr) => metadata[zkpr.id]?.title },
    { title: 'Description', accessor: 'id', render: (zkpr) => metadata[zkpr.id]?.description },
    // { title: 'Validator', accessor: 'validator' },
    {
      title: 'Schema',
      accessor: 'query_schema',
      render: (zkpr) => schemas.find((schema) => schema.bigint === zkpr.querySchema)?.title,
    },
    {
      title: 'Field',
      accessor: 'query_spotIndex',
      render: (zkpr) => {
        const subject = schemas.find((schema) => schema.bigint === zkpr.querySchema)?.credentialSubject;
        if (!subject) return undefined;
        const keys = Object.keys(subject);
        return keys[Number(zkpr.querySlotIndex) + 1];
      },
    },
    {
      title: 'Operator',
      accessor: 'query_operator',
      render: (zkpr) => operatorOptions.find((op) => op.value === Number(zkpr.queryOperator))?.label,
    },
    {
      title: 'Value (hashed)',
      accessor: 'query_value',
      // eslint-disable-next-line eqeqeq
      render: (zkpr) => shortString(zkpr.queryValue.filter((e) => e != 0).toString(), 10),
    },
    {
      width: 75,
      accessor: 'actions',
      title: '',
      textAlignment: 'right',
      render: (item) => (
        <div className="flex justify-between">
          <Link href={`/segments/edit/${item.id}`}>
            <EditOutlined rev={undefined} className="align-middle text-warning hover:text-secondary"></EditOutlined>
          </Link>
          <Link href="#">
            <DeleteOutlined
              rev={undefined}
              onClick={() => {
                deleteSegment(BigInt(item.id))
                  .then(async () => {
                    await Swal.mixin({
                      toast: true,
                      position: 'top',
                      showConfirmButton: false,
                      timer: 3000,
                    }).fire({
                      icon: 'success',
                      title: 'Segment deleted successfully',
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
                      title: 'Could not delete Segment.',
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
        <h5 className="text-2xl font-semibold dark:text-white-light">Segments</h5>
        <Link className="btn-outline-secondary btn" href="/segments/editor">
          Create
        </Link>
      </div>
      <div>
        <DataTable
          rowBorderColor="transparent"
          borderColor="grey"
          noRecordsIcon={<div></div>}
          rowClassName="bg-white dark:bg-black dark:text-white text-black"
          noRecordsText="No results match your search query"
          className="table-hover whitespace-nowrap bg-white p-7 px-2 py-2 dark:bg-black"
          records={segments}
          highlightOnHover={true}
          minHeight={200}
          onRowClick={(row) => {
            router.push(`/segments/${row.id}`).catch((e) => console.log(e));
          }}
          columns={columns}></DataTable>
      </div>
    </div>
  );
};

export default SegmentsList;
