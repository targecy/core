import { environment } from '../utils/context';
export type BaseAdStyling = {
  width?: string; // in pixels
  height?: string; // in pixels
  backgroundColor?: string;
  titleColor?: string;
  subtitleColor?: string;
  borderRadius?: string; // in pixels
  boxShadow?: string;
  border?: string;
};

export type BaseAdParams = {
  id: string;

  title: string;
  description: string;
  image: string;

  isLoading?: boolean;
  env: environment;

  styling?: BaseAdStyling;
};

export const BaseAd = ({ id, title, description, image, isLoading, styling, env }: BaseAdParams) => {
  return (
    <div className="max-w-full">
      <div className="gap-3 grid grid-rows-3" key={id}>
        <img className="row-span-2" src={image} />
        <div className="row-span-1">
          <div className="card-body ">
            <h1 className="card-title text-base" style={{ color: styling?.titleColor }}>
              {title}
            </h1>
            <p className="text-xs" style={{ color: styling?.subtitleColor }}>
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
