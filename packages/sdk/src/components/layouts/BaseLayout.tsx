import { ReactNode, PropsWithChildren } from 'react';
import { LayoutParams } from './Params';
import { Attribution, Layouts, LayoutsType, defaultStyling } from '../../constants/ads';

const getSizesByLayout = (layout: LayoutsType) => {
  switch (layout) {
    case 'banner_large':
      return { width: '970px', height: '90px' };
    case 'banner_medium':
      return { width: '780px', height: '90px' };
    case 'banner_small':
      return { width: '300px', height: '50px' };
    case 'square':
      return { width: '400px', height: '400px' };
    case 'list_item':
      return { width: '500px', height: '200px' };
    default:
      throw new Error('Invalid layout');
  }
};

export const BaseLayout = (props: PropsWithChildren<LayoutParams>) => {
  const { width, height } = getSizesByLayout(props.styling?.layout ?? defaultStyling.layout);

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: props.styling?.backgroundColor,
        borderRadius: props.styling?.borderRadius,
        boxShadow: props.styling?.boxShadow,
        border: props.styling?.border,
        position: 'relative',
        overflow: 'auto',
        cursor: props.attribution == Attribution.click ? 'pointer' : 'default',
      }}>
      {props.children}
    </div>
  );
};
