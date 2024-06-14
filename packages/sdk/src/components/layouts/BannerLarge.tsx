import { AttributionComponent } from './AttributionComponent';
import { BaseLayout } from './BaseLayout';
import { LayoutParams } from './Params';
import { DivBase } from './baseStyles';

export const BannerLarge = (props: LayoutParams) => {
  return (
    <BaseLayout {...props}>
      <img
        style={{ objectFit: 'cover', width: '100%', height: '100%', borderRadius: props.styling?.borderRadius }}
        src={props.image}
      />

      {/* Title and description container */}
      <DivBase
        style={{
          ...props.styling,
          ...props.customStyling,
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.opacity = '1';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.opacity = '0';
        }}>
        <span
          style={{
            color: props.styling.titleColor,
          }}>
          {props.title}
        </span>
        <br />
        <span
          style={{
            color: props.styling.subtitleColor,
          }}>
          {props.description}
        </span>
        <br />
        <br />
        <AttributionComponent {...props} />
      </DivBase>
    </BaseLayout>
  );
};
