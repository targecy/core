import { HTMLInputTypeAttribute, useState } from 'react';
import { Attribution } from '../../constants/ads';
import { NoWalletConnected } from '../misc';
import { BaseLayout } from './BaseLayout';
import { LayoutParams } from './Params';
import { SolidityTypes } from '../../constants/chain';

const getInputType = (type: SolidityTypes): HTMLInputTypeAttribute => {
  switch (type) {
    case 'address':
    case 'bytes':
    case 'bool':
    case 'string':
      return 'text';

    case 'int':
    case 'uint':
    case 'int256':
    case 'uint256':
      return 'number';

    default:
      return 'text';
  }
};

export const ListItem = (props: LayoutParams) => {

  const [processing, setProcessing] = useState(false);
  const submit = async (data: any) => {
    setProcessing(true);
    console.log(data);

    setProcessing(false);
  };

  const [params, setParams] = useState<Record<string, string>>({});

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

              {props.attribution == Attribution.conversion && Object.keys(props.paramsSchema ?? {}).length
                ? Object.entries(props.paramsSchema ?? {}).map(([key, type]) => {
                    return (
                      <input
                        key={key}
                        onChange={(e) => setParams({ ...params, ...{ [key]: e.target.value } })}
                        type={getInputType(type)}
                        id={key}
                        placeholder={key}
                        className="form-input mt-1"
                      />
                    );
                  })
                : ''}

              {props.attribution == Attribution.conversion && Object.keys(props.paramsSchema ?? {}).length ? (
                <div className="mt-2">
                  <button
                  disabled={processing}
                    type="submit"
                    className="btn btn-primary"
                    onClick={() => {
                      submit(params);
                    }}>
                    Confirm
                  </button>
                </div>
              ) : (
                ''
              )}
            </span>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};
