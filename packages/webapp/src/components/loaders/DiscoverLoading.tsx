import range from 'lodash/range';

export const DiscoverLoading = () => {
  return (
    <div className="panel h-full w-full overflow-hidden">
      <div className="mb-1 flex justify-between dark:text-white-light">
        <div className="skeleton h-10 w-64 rounded-sm bg-gray-800"></div>
      </div>
      <br></br>
      {range(0, 8).map((i) => (
        <div key={i} className="mb-3 flex justify-between dark:text-white-light">
          <div className="skeleton h-10 w-full rounded-sm bg-gray-800"></div>
        </div>
      ))}
    </div>
  );
};
