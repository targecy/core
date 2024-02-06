import { relayerTrpcClient } from '../../utils';
import { Attribution } from '../../constants';
import { ConversionComponent } from './ConversionComponent';
import { LayoutParams } from './Params';
import { useAsync } from 'react-use';

export const AttributionComponent = (props: LayoutParams) => {
  useAsync(async () => {
    // Should consume it only once
    if (props.isDemo === false && props.attribution === Attribution.conversion) {
      const hash = await relayerTrpcClient(props.env).txs.consumeAd.mutate({
        publisher: props.publisher,
        adId: props.adId,
      });
      console.log(hash);

      // @todo : verify tx result
    }
  }, []);

  if (props.attribution === Attribution.conversion) {
    return <ConversionComponent {...props} />;
  } else {
    // Impression and click does not require any UI
    return null;
  }
};
