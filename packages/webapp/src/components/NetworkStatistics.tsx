import Link from 'next/link';

import Statistic from './Statistic';

import { scannerUrl } from '~/constants/scanner.constants';
import { env } from '~/env.mjs';
import { useReadFromContract } from '~/hooks/useContractData';

export default function NetworkStatistics() {
  return (
    <div className="panel h-max-[100px] m-3 w-full">
      <div className="flex justify-between gap-5 pr-10 text-sm font-bold text-[#515365] sm:grid-cols-2">
        <div>
          <h5 className="text-lg font-semibold text-black dark:text-white">Network Statistics</h5>
          <h6 className="text-sm font-semibold ">
            <Link
              className=" cursor-pointer transition-all hover:text-primary"
              target="_blank"
              href={`${scannerUrl[env.NEXT_PUBLIC_VERCEL_ENV]}/address/${env.NEXT_PUBLIC_TARGECY_CONTRACT_ADDRESS}`}>
              See contract in scanner
            </Link>
          </h6>
        </div>
        {/* @todo(kevin): check if the function is totalconsumptions instead of totalConsumptions  */}
        <Statistic title="Impressions/Clicks/Conversions" statistic={useReadFromContract('totalConsumptions')} />
        <Statistic title="Ads" statistic={useReadFromContract('_adId')} />
        <Statistic title="Audiences" statistic={useReadFromContract('_audienceId')} />
        <Statistic title="Segments" statistic={useReadFromContract('_segmentId')} />
      </div>
    </div>
  );
}
