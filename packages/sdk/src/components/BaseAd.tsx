import { TargecyBaseProps, TargecyComponent, TargecyServicesContext } from './misc/Context';
const abi = require('../generated/abis/Targecy.json');
import { NoWalletConnected } from './misc/NoWalletConnected';

import { Skeleton } from 'antd';

export type BaseAdStyling = {
  width?: string; // in pixels
  height?: string; // in pixels
  backgroundColor?: string;
  titleColor?: string;
  subtitleColor?: string;
  borderRadius?: string; // in pixels
};

export type BaseAdParams = {
  id: string;

  title: string;
  description: string;
  image: string;

  isLoading?: boolean;

  styling?: BaseAdStyling;
};

export const BaseAd = ({ id, title, description, image, isLoading, styling }: BaseAdParams) => {
  return (
    <div className="max-w-full">
      <div className="w-full h-full shadow-xl" key={id}>
        <img style={{ objectFit: 'cover', width: '100%', height: '50%' }} src={image} />
        <div className="card-body overflow-hidden">
          <h1 className="card-title text-base" style={{ color: styling?.titleColor }}>
            {title}
          </h1>
          <p className="text-xs" style={{ color: styling?.subtitleColor }}>
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};
