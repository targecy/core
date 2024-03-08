import { Analytics } from '@vercel/analytics/react';
import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

import { env } from '~/env.mjs';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Oxygen:wght@400;500;600;700;800&display=swap"
        />

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
      <body>
        <Main />
        <NextScript />
        <Analytics />
      </body>
    </Html>
  );
}
