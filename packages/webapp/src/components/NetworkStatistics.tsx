import Link from 'next/link';

import Statistic from './Statistic';

import { scannerUrl } from '~/constants/scanner.constants';
import { env } from '~/env.mjs';
import { useReadFromContract } from '~/hooks/useContractData';

export default function NetworkStatistics() {
  const totalConsumptions = useReadFromContract('totalConsumptions');
  const countAds = useReadFromContract('_adId');
  const countAudiences = useReadFromContract('_audienceId');
  const countSegments = useReadFromContract('_segmentId');

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
        <Statistic title="Impressions/Clicks/Conversions" statistic={totalConsumptions} />
        <Statistic title="Ads" statistic={countAds} />
        <Statistic title="Audiences" statistic={countAudiences} />
        <Statistic title="Segments" statistic={countSegments} />
      </div>
    </div>
  );
}
