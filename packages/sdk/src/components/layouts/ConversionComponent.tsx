import { LayoutParams } from './Params';
import { HTMLInputTypeAttribute, useState } from 'react';
import { SolidityTypes } from '../../constants/chain';
import { environment } from '../../utils/context';
import { ConversionButton } from './ConversionButton';
import { titleCase } from '../../utils';

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

const chainRpcUrl = (env: environment) => {
  switch (env) {
    case 'development':
      return 'http://localhost:8545';
    case 'production':
      return 'https://rpc.ankr.com/polygon';
    default:
      return 'https://rpc-mumbai.polygon.technology';
  }
};

export const ConversionComponent = (props: LayoutParams) => {
  const [processing, setProcessing] = useState(false);
  const [params, setParams] = useState<Record<string, string>>({});

  const submit = async () => {
    setProcessing(true);

    setProcessing(false);
  };

  return (
    <>
      {Object.keys(props.paramsSchema ?? {}).length > 0 &&
        Object.entries(props.paramsSchema ?? {}).map(([key, type]) => (
          <input
            key={key}
            onChange={(e) => setParams({ ...params, [key]: e.target.value })}
            type={getInputType(type as SolidityTypes)}
            id={key}
            placeholder={titleCase(key)}
            style={{
              marginTop: '0.25rem', // equivalent to mt-1 in Tailwind
              maxWidth: '16rem', // equivalent to max-w-64 in Tailwind
              padding: '0.5rem 1rem', // padding
              border: '1px solid rgba(209, 213, 219, 0.5)', // slight border with transparency
              borderRadius: '0.25rem', // rounded corners
              width: '100%', // full width
              backgroundColor: 'rgba(255, 255, 255, 0.1)', // slight transparency
            }}
          />
        ))}

      <ConversionButton props={props} params={params} />
    </>
  );
};
