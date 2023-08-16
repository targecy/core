import { Table } from 'antd';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import { title } from 'process';
import { GetAllAdsQuery, useGetAllAdsQuery } from '~~/generated/graphql.types';

const Ads = () => {
  const data = useGetAllAdsQuery();

  const ads = data?.data?.ads;

  const columns: DataTableColumn<GetAllAdsQuery['ads'][number]>[] = [
    { title: 'Id', accessor: 'id' },
    { title: 'Impressions', accessor: 'impressions' },
  ];

  return <DataTable records={ads} columns={columns}></DataTable>;
};

export default Ads;
