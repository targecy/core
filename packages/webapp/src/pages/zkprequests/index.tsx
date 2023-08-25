import { DataTable, DataTableColumn } from 'mantine-datatable';
import Link from 'next/link';
import { useInterval } from 'react-use';

import { GetAllZkpRequestsQuery, useGetAllZkpRequestsQuery } from '~~/generated/graphql.types';

const ZKPRequests = () => {
  const data = useGetAllZkpRequestsQuery();

  useInterval(() => {
    data.refetch();
  }, 3000);

  const zkprequests = data?.data?.zkprequests;

  const columns: DataTableColumn<GetAllZkpRequestsQuery['zkprequests'][number]>[] = [
    { title: 'Id', accessor: 'id' },
    { title: 'Metadata URI', accessor: 'metadataURI' },
    { title: 'Validator', accessor: 'validator' },
    { title: 'Schema', accessor: 'query_schema' },
    { title: 'Spot Index', accessor: 'query_spotIndex' },
    { title: 'Operator', accessor: 'query_operator' },
    { title: 'Value', accessor: 'query_value' },
  ];

  return (
    <>
      <div className="panel">
        <div className="mb-5 flex items-center justify-between p-2">
          <h5 className="text-lg font-semibold dark:text-white-light">ZKP Requests</h5>
          <Link className="btn btn-primary" href="/zkprequests/new">
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
