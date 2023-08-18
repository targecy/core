import { Table } from 'antd';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import Link from 'next/link';
import { title } from 'process';
import { GetAllTargetGroupsQuery, useGetAllTargetGroupsQuery } from '~~/generated/graphql.types';

const TargetGroups = () => {
  const data = useGetAllTargetGroupsQuery();

  const targetGroups = data?.data?.targetGroups;

  const columns: DataTableColumn<GetAllTargetGroupsQuery['targetGroups'][number]>[] = [
    { title: 'Id', accessor: 'id' },
    { title: 'ZKP Requests', accessor: 'zkRequestsIds' },
    { title: 'Metadata URI', accessor: 'metadataURI' },
  ];

  return (
    <>
      <div className="panel">
        <div className="mb-5 flex items-center justify-between p-2">
          <h5 className="text-lg font-semibold dark:text-white-light">Target Groups</h5>
          <Link className="btn btn-primary" href="/targetGroups/new">
            Create
          </Link>
        </div>
        <div>
          <DataTable
            rowClassName="bg-white dark:bg-black dark:text-white text-black"
            rowBorderColor="border-fuchsia-400"
            noRecordsText="No results match your search query"
            className="table-hover whitespace-nowrap bg-white p-7 px-2 py-2 dark:bg-black"
            records={targetGroups}
            minHeight={200}
            columns={columns}></DataTable>
        </div>
      </div>
    </>
  );
};

export default TargetGroups;
