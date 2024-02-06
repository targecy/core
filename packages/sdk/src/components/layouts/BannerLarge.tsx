import { Attribution } from '../../constants/ads';
import { BaseLayout } from './BaseLayout';
import { ConversionComponent } from './ConversionComponent';
import { LayoutParams } from './Params';

export const BannerLarge = (props: LayoutParams) => {
  return (
    <BaseLayout {...props}>
      <img
        style={{ objectFit: 'cover', width: '100%', height: '100%', borderRadius: props.styling?.borderRadius }}
        src={props.image}
      />

      {/* Title and description container */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '10px',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          color: 'white',
          borderRadius: props.styling?.borderRadius,
          opacity: 0,
          transition: 'opacity 0.5s',
          overflow: 'scroll',
          height: '100%',
          maxHeight: '100%',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.opacity = '1';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.opacity = '0';
        }}>
        <span>{props.title}</span>
        <br />
        <span>{props.description}</span>
        <br />
        <br />
        {props.attribution === Attribution.conversion ? <ConversionComponent {...props} /> : ''}
      </div>
    </BaseLayout>
  );
};
