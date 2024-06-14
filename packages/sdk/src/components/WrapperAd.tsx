import { Provider } from 'react-redux';
import { Ad, AdProps } from './Ad';
import { store } from '../utils/store';

export const WrapperAd = (props: AdProps) => {
  const { styling, publisher, customDemo, env, isDemo, whitelistedAdvertisers, customStyling } = props;

  return (
    <Provider store={store}>
      <Ad
        customStyling={customStyling}
        styling={styling}
        publisher={publisher}
        customDemo={customDemo}
        env={env}
        isDemo={isDemo}
        whitelistedAdvertisers={whitelistedAdvertisers}
      />
    </Provider>
  );
};
