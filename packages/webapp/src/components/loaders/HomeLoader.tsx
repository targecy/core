export const HomeLoader = () => {
  return (
    <div>
      <div className="">
        <div className="flex h-1/4 flex-row justify-between">
          <div className="panel h-max-[100px] mb-3 w-full">
            <div className="skeleton h-32 w-full"></div>
          </div>
        </div>
      </div>
      <div className="flex h-3/4 flex-row justify-between">
        <div className="flex w-full">
          <div className="mr-3 mt-3 flex h-auto w-1/3 flex-col">
            <div className="panel h-full">
              <div className="skeleton h-full w-full"></div>
            </div>
          </div>
          <div className="ml-3 mt-3 flex w-2/3 flex-col">
            <div className="mb-3 flex h-auto flex-row justify-between">
              <div className="panel h-full w-full sm:col-span-2 lg:col-span-1">
                <div className="skeleton h-32 w-full"></div>
              </div>
            </div>
            <div className="mt-3 flex  h-auto flex-row justify-between">
              <div className="panel h-full w-full sm:col-span-2 lg:col-span-1">
                <div className="mb-5 flex justify-between dark:text-white-light">
                  <div className="skeleton h-32 w-full"></div>
                </div>
                <div className="grid gap-8 text-sm font-bold text-[#515365] sm:grid-cols-2">
                  <div>
                    <div>
                      <div className="skeleton h-32 w-full"></div>
                    </div>
                  </div>
                  <div>
                    <div>
                      <div className="skeleton h-32 w-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
