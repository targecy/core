import { BaseLayout } from './BaseLayout';
import { LayoutParams } from './Params';

export const BannerMedium = (props: LayoutParams) => {
  return (
    <BaseLayout {...props} >

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
      </div>
    </BaseLayout>
  );
};
