export const CredentialsLoader = () => {
  return (
    <>
      <div className="mb-8 grid grid-cols-2 gap-8">
        <div className="panel h-full w-full sm:col-span-2 lg:col-span-1">
          <div className="mb-5 flex justify-between dark:text-white-light">
            <div className="skeleton h-32 w-full"></div>
          </div>
          <div className="grid gap-8 text-sm font-bold text-[#515365] sm:grid-cols-2">
            <div>
              <div>
                <div className="skeleton h-full w-full"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="panel h-full w-full sm:col-span-2 lg:col-span-1">
          <div className="mb-5 flex justify-between dark:text-white-light">
            <div className="skeleton h-32 w-full"></div>
          </div>
          <div className="text-sm font-bold text-[#515365] sm:grid-cols-2">
            <div>
              <div className="skeleton h-full w-full"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="panel">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div className="skeleton h-32 w-full"></div>
        </div>
      </div>
    </>
  );
};
