import { NextPage } from 'next';

import { WalletProvider } from '~/components/shared/Wallet';
import { env } from '~~/env.mjs';

export const withProviders =
  () =>
  <Props extends Record<string, any> = {}, InitialProps = Props>(
    PageComponent: NextPage<Props, InitialProps>
  ): NextPage<Props, InitialProps> => {
    const WithProviders = ({ session, ...props }: any) => (
      <WalletProvider>
        <PageComponent {...props} />
      </WalletProvider>
    );

    if (env.NEXT_PUBLIC_VERCEL_ENV !== 'production') {
      const displayName = PageComponent.displayName || PageComponent.name || 'Component';

      WithProviders.displayName = `withProviders(${displayName})`;
    }

    WithProviders.getInitialProps = PageComponent.getInitialProps;

    return WithProviders;
  };
