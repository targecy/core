export const CredentialsLoader = () => {
  return (
    <>
      <div className="panel h-full w-full  sm:col-span-2 lg:col-span-1">
        <div className=" flex h-full justify-between dark:text-white-light">
          <div className="skeleton h-32 h-full min-h-[200px] w-full rounded-sm rounded-sm bg-gray-800 bg-gray-800"></div>
        </div>
        <div className="grid gap-8 text-sm font-bold text-[#515365] sm:grid-cols-2">
          <div>
            <div>
              <div className="skeleton h-full w-full rounded-sm bg-gray-800"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
