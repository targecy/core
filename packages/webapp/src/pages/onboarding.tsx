import { useAccountModal } from '@rainbow-me/rainbowkit';
import { useTargecyContext } from '@targecy/sdk/hooks/useTargecyContext';
import { trackCustomEvent } from '@targecy/sdk/utils/tracking';
import { track } from '@vercel/analytics/react';
import { Typography } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useCookie } from 'react-use';

import { NoWalletConnected } from '~/components/shared/Wallet/components/NoWalletConnected';
// import { useWallet } from '~/hooks';
import { IRootState } from '~/store';
import { capitalizeFirstLetter, isTargecyDomain } from '~/utils';
import { UserRole } from '~/utils/preferences';

export default function Onboarding() {
  const context = useTargecyContext();
  const { openAccountModal } = useAccountModal();
  // const { isConnected, address } = useWallet();
  const router = useRouter();
  const href = router.query.p;
  const session = useSession();
  const status = session?.status;
  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>([]);
  const [cookieValue, updateCookie, deleteCookie] = useCookie('userRoles');
  const [settingValue, setSettingValue] = useState(false);
  const domain = useSelector((state: IRootState) => state.themeConfig.domain);

  const handleRoleChange = (role: UserRole) => {
    setSettingValue(true);
    const newRoles = selectedRoles.includes(role) ? selectedRoles.filter((r) => r !== role) : [...selectedRoles, role];
    setSelectedRoles(newRoles);

    try {
      track('role_selected', {
        roles: newRoles.toString(),
      });
    } catch (error) {
      console.error('Error tracking role_selected', error);
    }

    updateCookie(JSON.stringify(newRoles));
  };

  useEffect(() => {
    setSettingValue(false);
    if (cookieValue) {
      setSelectedRoles(JSON.parse(cookieValue));
    }
  }, [cookieValue]);

  const goToApp = () => {
    if (cookieValue && JSON.parse(cookieValue ?? '[]').length) {
      console.log('href', href?.toString() ?? '/');
      trackCustomEvent({ id: 'targecy_user', params: { roles: selectedRoles.toString() } });
      router.push(href?.toString() ?? '/').catch(console.error);
    } else {
      console.error('Roles not confirmed', cookieValue);
    }
  };

  return (
    <div className=" w-full justify-center ">
      <div className="flex min-h-screen w-full flex-col items-center justify-center gap-3  pb-40">
        <img className="m-5 w-32 flex-none opacity-80 " src={`/images/logos/${domain}.png`} alt="logo" />

        <Typography className="text-bold h-[1.3em] h-fit bg-gradient-to-tr from-gray-800 to-violet-500 bg-clip-text  text-3xl text-transparent   lg:text-6xl xl:text-8xl">
          Welcome to {domain && capitalizeFirstLetter(domain)} {!isTargecyDomain(domain) && ' Ads Manager'}
        </Typography>

        {status === 'authenticated' && (
          <div className="flex flex-col items-center gap-2">
            <p className="flex">
              {' '}
              Wallet is connected! Please select your profile type or{' '}
              <label
                onClick={openAccountModal}
                className="ml-1 mr-1  transition-colors	  hover:bg-gradient-to-br  hover:from-slate-50 hover:to-violet-500 hover:bg-clip-text hover:text-transparent ">
                review connected wallet.
              </label>
            </p>

            <div className="mb-32 mt-5 flex justify-around gap-4 text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
              <div
                onClick={() => handleRoleChange('user')}
                className={`group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 ${
                  selectedRoles.includes('user')
                    ? 'borde-gray-700 bg-gray-200 dark:border-gray-300 dark:bg-neutral-700/30'
                    : ''
                }`}>
                <h2 className={`mb-3 text-2xl font-semibold`}>Individual </h2>
                <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
                  You want to discover new protocols, manage your profile and earn rewards.
                </p>
              </div>

              <div
                onClick={() => handleRoleChange('creator')}
                className={`group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 ${
                  selectedRoles.includes('creator')
                    ? 'borde-gray-700 bg-gray-200 dark:border-gray-300 dark:bg-neutral-700/30'
                    : ''
                }`}>
                <h2 className={`mb-3 text-2xl font-semibold`}>Creator</h2>
                <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>You want to gain exposure for your content.</p>
              </div>

              {isTargecyDomain(domain) && (
                <div
                  onClick={() => handleRoleChange('business')}
                  className={`group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 ${
                    selectedRoles.includes('business')
                      ? 'borde-gray-700 bg-gray-200 dark:border-gray-300 dark:bg-neutral-700/30'
                      : ''
                  }`}>
                  <h2 className={`mb-3 text-2xl font-semibold`}>Business </h2>
                  <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
                    You want to advertise on {domain} and grow your metrics.
                  </p>
                </div>
              )}

              {/* <div
                onClick={() => handleRoleChange('publisher')}
                className={`group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 ${
                  selectedRoles.includes('publisher')
                    ? 'borde-gray-700 bg-gray-200 dark:border-gray-300 dark:bg-neutral-700/30'
                    : ''
                }`}>
                <h2 className={`mb-3 text-2xl font-semibold`}>Publisher </h2>
                <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>You want to monetize your content.</p>
              </div> */}
            </div>

            <button
              disabled={settingValue || !selectedRoles.length}
              className="btn-outline-secondary btn mt-10 w-1/2"
              onClick={() => {
                goToApp();
              }}>
              {' '}
              Go to App{' '}
            </button>

            {isTargecyDomain(domain) && (
              <p>
                If you want to monetize your traffic{' '}
                <Link className="hover:text-secondary" href="maito:help@targecy.xyz" target="_blank">
                  contact us
                </Link>
              </p>
            )}
          </div>
        )}

        {status === 'unauthenticated' && (
          <>
            <p className="mb-4 md:text-lg lg:text-2xl">Please sign in with your wallet to start.</p>

            <NoWalletConnected caption="Please connect Wallet"></NoWalletConnected>
          </>
        )}

        {status === 'loading' && <p>Loading...</p>}
      </div>
    </div>
  );
}
