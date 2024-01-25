import { useAccountModal } from '@rainbow-me/rainbowkit';
import { Typography } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

import { NoWalletConnected } from '~/components/shared/Wallet/components/NoWalletConnected';
import { useWallet } from '~/hooks';
import { trimAddress } from '~/utils/evm';

const FORM_LINK = 'https://skugmdh7toi.typeform.com/to/hEiAYGEx';

export default function Beta() {
  const { openAccountModal } = useAccountModal();
  const { isConnected, address } = useWallet();
  const router = useRouter();
  const href = router.query.p;
  const session = useSession();
  const sessionData: any = session?.data;

  useEffect(() => {
    if (sessionData?.data.isBetaUser) {
      router.push(href?.toString() ?? '/').catch((e) => console.log(e));
    }
  }, [router, href, sessionData]);

  return (
    <div className=" w-full justify-center ">
      <div className="flex min-h-screen w-full flex-col items-center justify-center gap-3  pb-40">
        <Image width={96} height={274} className="m-5 w-24 flex-none opacity-80 " src="/images/logo.svg" alt="logo" />

        <Typography className="text-bold bg-gradient-to-tr from-gray-800 to-violet-500 bg-clip-text text-3xl  text-transparent  lg:text-6xl xl:text-8xl">
          The revolution starts here.
        </Typography>

        {isConnected && address && session?.status === 'authenticated' ? (
          sessionData?.isBetaUser ? (
            <div className="flex flex-row items-center gap-1">
              <label className="flex inline-flex text-secondary">
                {' '}
                Address <label className="ml-1 mr-1 text-primary">{trimAddress(address)}</label> connected successfully!
                Redirecting...
              </label>
            </div>
          ) : (
            <div className="flex flex-row items-center gap-1">
              <label className="flex inline-flex text-secondary">
                {' '}
                Address {trimAddress(address)} is not whitelisted. Please{' '}
                <Link
                  href={FORM_LINK}
                  target="_blank"
                  className="ml-1 mr-1 text-primary transition-colors	  hover:bg-gradient-to-br  hover:from-slate-50 hover:to-violet-500 hover:bg-clip-text hover:text-transparent ">
                  request access
                </Link>{' '}
                to the beta or
                <label
                  onClick={openAccountModal}
                  className="ml-1 mr-1 text-primary transition-colors	  hover:bg-gradient-to-br  hover:from-slate-50 hover:to-violet-500 hover:bg-clip-text hover:text-transparent ">
                  review connected wallet
                </label>
              </label>
            </div>
          )
        ) : session?.status === 'loading' ? (
          <div className="flex flex-row items-center gap-1">
            <label className="flex inline-flex text-secondary"> Loading...</label>
          </div>
        ) : (
          <>
            <p className="mb-12 md:text-lg lg:text-2xl">
              Have you joined our private beta? Not yet,{' '}
              <Link
                href={FORM_LINK}
                target="_blank"
                className="text-violet-500 transition-colors	  hover:bg-gradient-to-br  hover:from-slate-50 hover:to-violet-500 hover:bg-clip-text hover:text-transparent ">
                request access
              </Link>
            </p>

            <NoWalletConnected caption="Please connect Wallet"></NoWalletConnected>
          </>
        )}
      </div>
    </div>
  );
}
