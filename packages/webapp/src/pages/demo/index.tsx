import { TargecyCredentials, TargecyAd, UserIdentity } from '@targecy/sdk';

const Demo = () => {
  return (
    <>
      <div className="flex">
        {/* create 3 columns with panels  */}
        <div className="m-3 flex w-1/3 flex-col">
          <div className="mockup-code">
            <pre data-prefix="1. ">
              <code>{'<UserIdentity />   # Gets DID'}</code>
            </pre>
          </div>
        </div>

        <div className="m-3 flex w-1/3 flex-col">
          <div className="mockup-code">
            <pre data-prefix="1. ">
              <code>{'<Credentials />   # Gets from storage'}</code>
            </pre>
          </div>
        </div>

        <div className="m-3 flex w-1/3 flex-col">
          <div className="mockup-code">
            <pre data-prefix="1. ">
              <code>{'<TargecyAd />    # Gets one Ad'}</code>
            </pre>
          </div>
        </div>
      </div>

      <div className="flex">
        <div className="panel min-w-[600px]">
          <h1 className="font-weight-400 text-lg font-semibold">User Wallet</h1>
          <UserIdentity />
          <TargecyCredentials />
        </div>

        <div className="m-3 flex w-1/3 flex-col p-2">
          <TargecyAd />
        </div>
      </div>
    </>
  );
};

export default Demo;
