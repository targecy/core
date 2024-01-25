import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';

import { setPageTitle } from '../store/themeConfigSlice';

import BlankLayout from '~/components/Layouts/BlankLayout';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { RootState } from '~/store';

const Error404 = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setPageTitle('Error 404'));
  });
  const isDark = useAppSelector(
    (state: RootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode
  );

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="px-6 py-16 text-center font-semibold before:container before:absolute before:left-1/2 before:aspect-square before:-translate-x-1/2 before:rounded-full before:bg-[linear-gradient(180deg,#4361EE_0%,rgba(67,97,238,0)_50.73%)] before:opacity-10 md:py-20">
        <div className="relative">
          <Image
            width={500}
            height={500}
            src={isDark ? '/images/error/404-dark.svg' : '/images/error/404-light.svg'}
            alt="404"
            className="mx-auto -mt-10 w-full max-w-xs object-cover md:-mt-14 md:max-w-xl"
          />
          <p className="mt-5 text-base dark:text-white">The page you requested was not found!</p>
          <Link href="/" className="btn-gradient btn mx-auto !mt-7 w-max border-0 uppercase shadow-none">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
};
Error404.getLayout = (page: any) => {
  return <BlankLayout>{page}</BlankLayout>;
};
export default Error404;
