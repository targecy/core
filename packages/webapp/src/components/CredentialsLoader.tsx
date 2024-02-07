export const CredentialsLoader = () => {
  const fragmentLoader = () => {
    return (
      <div role="status" className="w-full animate-pulse">
        <div className="mb-4 h-2.5 w-48 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="mb-2.5 h-2 max-w-[360px] rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="mb-2.5 h-2 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="mb-2.5 h-2 max-w-[330px] rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="mb-2.5 h-2 max-w-[300px] rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-2 max-w-[360px] rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <span className="sr-only">Loading...</span>
      </div>
    );
  };
  return (
    <>
      <div className="mb-8 grid grid-cols-2 gap-8">
        <div className="panel h-full w-full sm:col-span-2 lg:col-span-1">
          <div className="mb-5 flex justify-between dark:text-white-light">
            <div role="status" className="w-full animate-pulse">
              <div className="mb-4 h-2.5 w-48 rounded-full bg-gray-200 dark:bg-gray-700"></div>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
          <div className="grid gap-8 text-sm font-bold text-[#515365] sm:grid-cols-2">
            <div>
              <div>
                <div role="status" className="w-full animate-pulse">
                  <div className="mb-4 h-2.5 w-48 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            </div>
            <div>
              <div>
                <div role="status" className="w-full animate-pulse">
                  <div className="mb-4 h-2.5 w-48 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            </div>

            <div>
              <div>
                <div role="status" className="w-full animate-pulse">
                  <div className="mb-4 h-2.5 w-48 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            </div>

            <div>
              <div>
                <div role="status" className="w-full animate-pulse">
                  <div className="mb-4 h-2.5 w-48 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="panel h-full w-full sm:col-span-2 lg:col-span-1">
          <div className="mb-5 flex justify-between dark:text-white-light">
            <div role="status" className="w-full animate-pulse">
              <div className="mb-4 h-2.5 w-48 rounded-full bg-gray-200 dark:bg-gray-700"></div>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
          <div className="text-sm font-bold text-[#515365] sm:grid-cols-2">
            <div>
              <div>
                <div role="status" className="w-full animate-pulse">
                  <div className="mb-4 h-2.5 w-48 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
              <div>
                <div role="status" className="w-full animate-pulse">
                  <div className="mb-4 h-2.5 w-48 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="panel">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">{fragmentLoader()}</div>
        <div>
          <div className="mb-5">{fragmentLoader()}</div>
        </div>
      </div>
    </>
  );
};
