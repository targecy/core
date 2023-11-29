import { BaseAd, BaseAdStyling } from './BaseAd';
import { TargecyBaseProps, TargecyComponent, TargecyServicesContext } from './misc/Context';
const abi = require('../generated/abis/Targecy.json');
import { NoWalletConnected } from './misc/NoWalletConnected';

import { Skeleton } from 'antd';

export type InteractiveAdStyling = {} & BaseAdStyling;

export type InteractiveAdParams = {
  id: string;

  title: string;
  description: string;
  image: string;

  isLoading?: boolean;

  styling?: InteractiveAdStyling;
};

export const InteractiveAd = ({ id, title, description, image, isLoading, styling }: InteractiveAdParams) => {
  return (
    <div>
      <BaseAd id={id} title={title} description={description} image={image} isLoading={isLoading} styling={styling} />
      <button>Consume</button>
    </div>
  );
};
