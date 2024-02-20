import { DataTable, DataTableColumn } from 'mantine-datatable';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { DiscoverLoading } from '../loaders/DiscoverLoading';

import { Benefit, benefits } from './benefits.constants';

const BenefitsComponent = () => {
  if (!benefits) return <DiscoverLoading />;

  const benefitsColumns: DataTableColumn<Benefit>[] = [
    {
      title: '',
      accessor: 'icon',
      render: (value) => (
        <div className="flex items-center">
          <Image src={value.icon} alt={value.icon} width={25} height={25} className="mr-2" />
        </div>
      ),
      width: 50,
    },
    {
      title: 'Protocol',
      accessor: 'protocol',
    },
    {
      title: 'Chains',
      accessor: 'chains',
    },
    {
      title: 'Offer',
      accessor: 'offer',
    },
    {
      title: 'Link',
      accessor: 'link',
      render: (value) => (
        <Link target="_blank" className="cursor-pointer hover:text-primary" href={value.link.toString()}>
          Go to site
        </Link>
      ),
    },
  ];
  return (
    <>
      <div className="flex h-full min-h-[400px] w-full flex-row justify-between overflow-y-auto">
        <div className="panel mb-1 w-full overflow-y-auto p-0">
          <div className="sticky top-0 w-full bg-inherit p-6 pb-3 ">
            <h5 className="text-lg font-semibold text-black dark:text-white">Benefits</h5>
            <p className="text-gray-500">A crafted list of benefits for you based on your credentials.</p>
          </div>
          <div className="max-h-[700px] pb-3 pl-3 pr-3 ">
            <DataTable
              rowBorderColor="transparent"
              borderColor="grey"
              noRecordsIcon={<div></div>}
              noRecordsText="No protocols found, make sure to get your credentials."
              rowClassName="bg-white dark:bg-black dark:text-white text-black"
              className="table-hover whitespace-nowrap bg-white p-7 px-2 py-2 dark:bg-black"
              records={benefits || []}
              highlightOnHover={true}
              minHeight={100}
              columns={benefitsColumns}
              idAccessor="id"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default BenefitsComponent;
