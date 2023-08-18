import { Button, Card, Table, Typography, theme } from 'antd';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import Link from 'next/link';
import { title } from 'process';
import { useContractRead } from 'wagmi';
import { Targecy__factory } from '~common/generated/contract-types';
import { GetAllAdsQuery, useGetAllAdsQuery } from '~~/generated/graphql.types';

const Ads = () => {
  const data = useGetAllAdsQuery();
  const { data: adsQuantity } = useContractRead({
    address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    abi: Targecy__factory.abi,
    functionName: '_adId',
  });

  console.log(adsQuantity);

  const ads = data?.data?.ads;

  const columns: DataTableColumn<GetAllAdsQuery['ads'][number]>[] = [
    { title: 'Id', accessor: 'id' },
    { title: 'Impressions', accessor: 'impressions' },
    { title: 'Target Groups', accessor: 'targetGroupsIds' },
    { title: 'Metadata URI', accessor: 'metadataURI' },
    { title: 'Budget', accessor: 'budget' },
  ];

  return (
    <>
      <div className="panel">
        <div className="mb-5 flex items-center justify-between p-2">
          <h5 className="text-lg font-semibold dark:text-white-light">Ads</h5>
          <Link className="btn btn-primary" href="/ads/new">
            Create
          </Link>
        </div>
        <div>
          <DataTable
            rowClassName="bg-white dark:bg-black dark:text-white text-black"
            rowBorderColor="border-fuchsia-400"
            noRecordsText="No results match your search query"
            className="table-hover whitespace-nowrap bg-white p-7 px-2 py-2 dark:bg-black"
            records={ads}
            minHeight={200}
            columns={columns}></DataTable>
        </div>
      </div>
    </>
  );
};

export default Ads;
