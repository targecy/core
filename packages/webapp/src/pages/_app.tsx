import { datadogLogs } from '@datadog/browser-logs';
import { datadogRum } from '@datadog/browser-rum';
import { compose } from '@reduxjs/toolkit';
import { TargecyTracker } from '@targecy/sdk';
import { Analytics } from '@vercel/analytics/react';
import { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { appWithI18Next } from 'ni18n';
import { ni18nConfig } from 'ni18n.config.ts';
import { ReactElement, ReactNode, useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';

import DefaultLayout from '../components/Layouts/DefaultLayout';
import store from '../store/index';

// Perfect Scrollbar
import 'react-perfect-scrollbar/dist/css/styles.css';

import '../styles/tailwind.css';

import TargecyHead from '~/components/main/Head';
import { env } from '~/env.mjs';
import { withProviders } from '~/lib/withProviders';
import { toggleDomain } from '~/store/themeConfigSlice';
import { extractDomainName } from '~/utils';

export type NextPageWithLayout<P = unknown, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

// if (env.NEXT_PUBLIC_VERCEL_ENV !== 'development') {
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
// }

const ProviderWrapper = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch();

  const router = useRouter();
  useEffect(() => {
    dispatch(toggleDomain(extractDomainName(window.location.hostname)));
  }, [router.pathname]);

  return <>{children}</>;
};

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => <DefaultLayout>{page}</DefaultLayout>);

  return (
    <TargecyTracker env={env.NEXT_PUBLIC_VERCEL_ENV} pathsToIgnore={['/storage']}>
      <Provider store={store}>
        <ProviderWrapper>
          <TargecyHead />

          {getLayout(<Component {...pageProps} />)}

          <Analytics />
        </ProviderWrapper>
      </Provider>
    </TargecyTracker>
  );
};

const hocs = compose(withProviders());

const AppWithI18n = appWithI18Next(hocs(App), ni18nConfig);

export default AppWithI18n;
