import { range } from 'lodash';

export const DiscoverLoading = () => {
  return (
    <div className="panel h-full w-full overflow-hidden">
      <div className="mb-1 flex justify-between dark:text-white-light">
        <div className="skeleton h-10 w-64"></div>
      </div>
      <br></br>
      {range(0, 8).map((i) => (
        <div key={i} className="mb-3 flex justify-between dark:text-white-light">
          <div className="skeleton h-10 w-full"></div>
        </div>
      ))}
    </div>
  );
};
