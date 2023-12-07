import Link from 'next/link';

import { env } from '~~/env.mjs';

const scannerUrl: Record<typeof env.NEXT_PUBLIC_VERCEL_ENV, string> = {
  development: `http://localhost:8090`,
  preview: `https://mumbai.polygonscan.com`,
  production: `https://polygonscan.com`,
};

const Footer = () => {
  return (
    <div className="mt-auto p-6 pt-0 text-center dark:text-white-dark ltr:sm:text-right rtl:sm:text-right">
      See{' '}
      <Link
        className=" cursor-pointer transition-all hover:text-primary"
        target="_blank"
        href={`${scannerUrl[env.NEXT_PUBLIC_VERCEL_ENV]}/address/${env.NEXT_PUBLIC_TARGECY_CONTRACT_ADDRESS}`}>
        Targecy in scanner
      </Link>
      . All rights reserved © {new Date().getFullYear()}.
    </div>
  );
};

export default Footer;
