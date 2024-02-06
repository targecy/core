import { BaseLayout } from './BaseLayout';
import { LayoutParams } from './Params';
import { ConversionComponent } from './ConversionComponent';
import { Attribution } from '../../constants/ads';
import { AttributionComponent } from './AttributionComponent';

export const ListItem = (props: LayoutParams) => {
  return (
    <BaseLayout {...props}>
      <div className="grid grid-cols-2 gap-4 h-full w-full">
        <div className="col-span-1 h-full">
          <img
            style={{ objectFit: 'cover', width: '100%', height: '100%', borderRadius: props.styling?.borderRadius }}
            src={props.image}
          />
        </div>
        <div className="col-span-1 h-full overflow-scroll">
          {/* Title and description container */}
          <div
            style={{
              padding: '10px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'start',
              alignItems: 'flex-start',
            }}>
            <span
              style={{
                color: props.styling?.titleColor,
                fontSize: '0.75rem',
                fontWeight: 'bold',
                wordWrap: 'break-word',
                whiteSpace: 'normal',
                wordBreak: 'break-word',
                maxWidth: '100%',
              }}>
              {props.title}
            </span>
            <br />
            <span
              style={{
                color: props.styling?.subtitleColor,
                fontSize: '0.75rem',
                fontWeight: 'bold',
                whiteSpace: 'normal',
                overflowWrap: 'break-word',
                wordBreak: 'break-word',
                maxWidth: '100%',
              }}>
              {props.description}

              <AttributionComponent {...props} />
            </span>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};
