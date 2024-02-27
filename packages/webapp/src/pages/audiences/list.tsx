import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { getIPFSStorageUrl } from '@common/functions/getIPFSStorageUrl';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useAsync, useInterval } from 'react-use';
import Swal from 'sweetalert2';
import { useContractWrite } from 'wagmi';

import { AudiencesLoader } from '~/components/loaders/AudienceLoader';
import { targecyContractAddress } from '~/constants/contracts.constants';
import { Targecy__factory } from '~/generated/contract-types';
import { GetAllAudiencesQuery, useGetAllAudiencesQuery } from '~/generated/graphql.types';
import { fetchMetadata } from '~/utils/metadata';

const ListAudiences = () => {
  const data = useGetAllAudiencesQuery();

  useInterval(() => {
    data.refetch();
  }, 3000);

  const audiences = data?.data?.audiences;

  const [metadata, setMetadata] = useState<Record<string, { title?: string; description?: string; image?: string }>>(
    {}
  );
  const [ZKPMetadata, setZKPMetadata] = useState<Record<string, Awaited<ReturnType<typeof fetchMetadata>>>>({});

  const { loading: audiencesLoading } = useAsync(async () => {
    if (audiences) {
      setMetadata(
        (
          await Promise.all(
            audiences.map(async (a) => {
              const newMetadata = await fetch(getIPFSStorageUrl(a.metadataURI));
              const json = await newMetadata.json();
              return { id: a.id, metadata: { title: json.title, description: json.description } };
            })
          )
        ).reduce<typeof metadata>((acc, curr) => {
          acc[curr.id] = curr.metadata;
          return acc;
        }, {})
      );

      const ZKPMetedatasURIs = audiences?.flatMap((a) => a.segments.map((s) => s.metadataURI)) || [];
      setZKPMetadata(
        (
          await Promise.all(
            ZKPMetedatasURIs.map(async (uri) => {
              const received = await fetchMetadata(uri);
              return { uri, metadata: received };
            })
          )
        ).reduce<typeof ZKPMetadata>((acc, curr) => {
          acc[curr.uri] = curr.metadata;
          return acc;
        }, {})
      );
    }
  }, [audiences]);

  const { writeAsync: deleteAudienceAsync } = useContractWrite({
    address: targecyContractAddress,
    abi: Targecy__factory.abi,
    functionName: 'deleteAudience',
  });

  const deleteAudience = async (id: bigint) => {
    await deleteAudienceAsync({ args: [id] });
    return undefined;
  };

  const columns: DataTableColumn<GetAllAudiencesQuery['audiences'][number]>[] = [
    { title: 'Id', accessor: 'id' },
    { title: 'Title', accessor: 'id', render: (a) => metadata[a.id]?.title },
    { title: 'Description', accessor: 'id', render: (a) => metadata[a.id]?.description },
    {
      title: 'Segments',
      accessor: 'segments',
      render: (value) => value.segments.map((s) => ZKPMetadata[s.metadataURI]?.title).join(', '),
    },
    {
      width: 75,
      accessor: 'actions',
      title: '',
      textAlignment: 'right',
      render: (item) => (
        <div className="flex justify-between">
          <Link href={`/audiences/edit/${item.id}`}>
            <EditOutlined
              rev={undefined}
              onClick={() => {}}
              className="align-middle text-warning transition-all hover:text-secondary"></EditOutlined>
          </Link>
          <Link href="#">
            <DeleteOutlined
              rev={undefined}
              onClick={() => {
                deleteAudience(BigInt(item.id))
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
              className="align-middle text-danger transition-all hover:text-secondary"></DeleteOutlined>
          </Link>
        </div>
      ),
    },
  ];

  const router = useRouter();

  if (audiencesLoading) return <AudiencesLoader />;

  return (
    <div className="panel">
      <div className="mb-5 flex items-center justify-between p-2">
        <h5 className="text-2xl font-semibold dark:text-white-light">Audiences</h5>
        <Link className="btn-outline-secondary btn" href="/audiences/editor">
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
          records={audiences}
          highlightOnHover={true}
          minHeight={200}
          onRowClick={(row) => {
            router.push(`/audiences/${row.id}`).catch((e) => console.error(e));
          }}
          columns={columns}></DataTable>
      </div>
    </div>
  );
};

export default ListAudiences;
