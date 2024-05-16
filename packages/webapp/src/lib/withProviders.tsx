import { NextPage } from 'next';
import { Provider } from 'react-redux';
import { WalletProvider } from '~/components/shared/Wallet';
import { env } from '~/env.mjs';
import store from '../store/index';

export const withProviders =
  () =>
  <Props extends Record<string, any> = {}, InitialProps = Props>(
    PageComponent: NextPage<Props, InitialProps>
  ): NextPage<Props, InitialProps> => {
    const WithProviders = ({ session, ...props }: any) => (
      <Provider store={store}>
        <WalletProvider>
          <PageComponent {...props} />
        </WalletProvider>
      </Provider>
    );

    if (env.NEXT_PUBLIC_VERCEL_ENV !== 'production') {
      const displayName = PageComponent.displayName || PageComponent.name || 'Component';

      WithProviders.displayName = `withProviders(${displayName})`;
    }

    WithProviders.getInitialProps = PageComponent.getInitialProps;

    return WithProviders;
  };
