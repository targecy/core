import { datadogLogs } from '@datadog/browser-logs';
import { datadogRum } from '@datadog/browser-rum';
import { compose } from '@reduxjs/toolkit';
import { TargecyTracker } from '@targecy/sdk';
import { NextPage } from 'next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { appWithI18Next } from 'ni18n';
import { ni18nConfig } from 'ni18n.config.ts';
import { ReactElement, ReactNode } from 'react';
import { Provider } from 'react-redux';

import DefaultLayout from '../components/Layouts/DefaultLayout';
import store from '../store/index';

// Perfect Scrollbar
import 'react-perfect-scrollbar/dist/css/styles.css';

import '../styles/tailwind.css';

import { env } from '~/env.mjs';
import { withProviders } from '~/lib/withProviders';

export type NextPageWithLayout<P = unknown, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

if (env.NEXT_PUBLIC_VERCEL_ENV !== 'development') {
  datadogRum.init({
    applicationId: 'c67b2bb4-e954-4ec8-b652-2faeb725d198',
    clientToken: 'pub8b1d36983b7012cb76a1af361bcb75cc',
    site: 'datadoghq.com',
    service: 'dapp',
    env: env.NEXT_PUBLIC_VERCEL_ENV,
    version: env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
    sessionSampleRate: 10,
    sessionReplaySampleRate: 0,
    trackUserInteractions: true,
    trackResources: true,
    trackLongTasks: true,
    defaultPrivacyLevel: 'mask-user-input',
  });

  datadogLogs.init({
    clientToken: 'puba07a9f47cba40760139fec60df972df9',
    site: 'datadoghq.com',
    service: 'dapp',
    env: env.NEXT_PUBLIC_VERCEL_ENV,
    version: env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
    forwardErrorsToLogs: true,
    sessionSampleRate: 100,
  });
}

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => <DefaultLayout>{page}</DefaultLayout>);

  return (
    <TargecyTracker env={env.NEXT_PUBLIC_VERCEL_ENV} pathsToIgnore={['/storage']}>
      <Provider store={store}>
        <Head>
          <title>Targecy</title>
          <meta charSet="UTF-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta
            name="description"
            content="A decentralized and transparent advertising solution ready to empower the next generation of web3 protocols."
          />
          <link rel="icon" href="/images/logo.svg" />
        </Head>

        {getLayout(<Component {...pageProps} />)}
      </Provider>
    </TargecyTracker>
  );
};

const hocs = compose(withProviders());

const AppWithI18n = appWithI18Next(hocs(App), ni18nConfig);

export default AppWithI18n;
