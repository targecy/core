import Head from 'next/head';
import Script from 'next/script';
import { useSelector } from 'react-redux';

import { env } from '~/env.mjs';
import { IRootState } from '~/store';
import { capitalizeFirstLetter } from '~/utils';

const TargecyHead = () => {
  const domain = useSelector((state: IRootState) => state.themeConfig.domain);

  return (
    <Head>
      <title>{domain && capitalizeFirstLetter(domain)} Ads</title>
      <meta charSet="UTF-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta
        name="description"
        content="A decentralized and transparent advertising solution ready to empower the next generation of web3 protocols."
      />
      <link rel="icon" href={`/images/logos/${domain}.png`} />

      {env.NEXT_PUBLIC_GOOGLE_ANALYTICS && (
        <>
          <Script async src={`https://www.googletagmanager.com/gtag/js?id=${env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`} />
          <Script id="google-analytics">
            {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${env.NEXT_PUBLIC_GOOGLE_ANALYTICS}');
              `}
          </Script>
        </>
      )}
    </Head>
  );
};

export default TargecyHead;
