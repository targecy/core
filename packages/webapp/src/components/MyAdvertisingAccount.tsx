import Statistic from './Statistic';

import { useGetAdvertiserQuery, useGetBudgetQuery } from '~/generated/graphql.types';
import { useWallet } from '~/hooks/useWallet';

export default function MyAdvertisingAccount() {
  const wallet = useWallet();
  const { data: advertiserData } = useGetAdvertiserQuery({ id: wallet.address || '' });
  const { impressions = 0, clicks = 0, conversions = 0, adsQuantity = 0 } = advertiserData?.advertiser || {};
  const { data: budget } = useGetBudgetQuery({
    id: wallet.address || '',
  });
  const totalInteractions = [impressions, clicks, conversions]
    .filter(Boolean)
    .map(Number)
    .reduce((a, b) => a + b, 0);

  return (
    <div className="mt-3 flex  h-1/2 flex-row justify-between">
      <div className="panel h-full w-full sm:col-span-2 lg:col-span-1">
        <div className="mb-5 flex justify-between dark:text-white-light">
          <h5 className="text-lg font-semibold ">My Advertising Account</h5>
        </div>
        <div className="grid gap-8 text-sm font-bold text-[#515365] sm:grid-cols-2">
          <Statistic title="Ads" statistic={adsQuantity} />
          <Statistic title="Remaining Budget" statistic={budget?.budget?.remainingBudget || 0} />
          <Statistic
            title="Impressions/Clicks/Conversions/Total"
            statistic={`${impressions}/${clicks}/${conversions}/${totalInteractions}`}
          />
          <Statistic
            title="Cost per any interaction"
            className="text-white dark:text-white"
            statistic={
              totalInteractions > 0
                ? (Number(budget?.budget?.totalBudget) - Number(budget?.budget?.remainingBudget)) / totalInteractions
                : '-'
            }
          />
        </div>
      </div>
    </div>
  );
}
