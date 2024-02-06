import { LayoutParams } from './Params';
import { HTMLInputTypeAttribute, useState } from 'react';
import { SolidityTypes } from '../../constants/chain';
import { environment } from '../../utils/context';
import { ConversionButton } from './ConversionButton';

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
      return 'https://rpc.ankr.com/polygon_mumbai';
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
            placeholder={key}
            className="form-input mt-1 max-w-64"
          />
        ))}

      <ConversionButton props={props} params={params} />
    </>
  );
};
