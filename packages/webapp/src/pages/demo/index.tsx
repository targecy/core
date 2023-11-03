import { TargecyAd } from '@targecy/sdk';
import { useConfig } from 'wagmi';

const Demo = () => {
  const wagmiConfig = useConfig();

  if (!wagmiConfig || !wagmiConfig.queryClient) return null;

  return (
    <>
      <div className="p-2">
        <h1 className="font-weight-400 text-lg font-semibold">Demo Publisher</h1>
      </div>
      <div className="flex">
        <div className="ml-3 mt-3 mb-3 flex flex-col">
          <div className="mockup-code">
            <pre data-prefix="1. " className="pl-3">
              <code>{'<TargecyAd />    # Gets one Ad'}</code>
            </pre>
          </div>
        </div>
      </div>

      <div className="mt-2 flex">
        <div className="m-3 flex w-1/3 flex-col p-2">
          <label className="m2">Available Ads</label>
          <TargecyAd useRelayer={false} wagmiConfig={wagmiConfig} />
        </div>
      </div>
    </>
  );
};

export default Demo;
