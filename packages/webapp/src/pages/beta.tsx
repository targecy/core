import { Typography } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { NoWalletConnected } from '~~/components/shared/Wallet/components/NoWalletConnected';
import { useWallet } from '~~/hooks';
import { trimAddress } from '~~/utils/evm';

const FORM_LINK = 'https://skugmdh7toi.typeform.com/to/hEiAYGEx';

export default function Beta() {
  const { isConnected, address } = useWallet();
  const router = useRouter();
  const href = router.query.p;

  useEffect(() => {
    if (isConnected) {
      router.push(href?.toString() ?? '/').catch((e) => console.log(e));
    }
  }, [router, isConnected, href]);

  return (
    <div className=" w-full justify-center ">
      <div className="flex min-h-screen w-full flex-col items-center justify-center gap-3  pb-40">
        <img className="m-5 w-24 flex-none opacity-80 " src="/images/logo.svg" alt="logo" />

        <Typography className="text-bold bg-gradient-to-tr from-gray-800 to-violet-500 bg-clip-text text-8xl text-transparent">
          The revolution starts here.
        </Typography>

        {isConnected && address ? (
          <div className="flex flex-row items-center gap-1">
            <label className="flex inline-flex text-secondary">
              {' '}
              Address <label className="ml-1 mr-1 text-primary">{trimAddress(address)}</label> connected successfully!
              Redirecting...
            </label>
          </div>
        ) : (
          <>
            <p className="mb-12 text-2xl">
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
