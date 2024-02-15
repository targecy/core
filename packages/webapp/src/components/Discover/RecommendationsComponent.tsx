import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';

import { DiscoverLoading } from '../loaders/DiscoverLoading';

import { TopProtocols } from '~/pages/discover/utils';
import { useGetProtocolsQuery } from '~/services/baseApi';

const RecommendationsComponent = () => {
  const scrollRef = useRef(null);
  const { data, isLoading } = useGetProtocolsQuery({});
  const { protocols } = data || {};
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);
  const [filteredProtocols, setFilteredProtocols] = useState<TopProtocols['protocols']>([]);

  console.log(data);

  // Keep an aleatory subset of protocols. @todo : recommendations based on credentials
  // Initialize filtered protocols once upon data fetch completion
  useEffect(() => {
    if (data?.protocols) {
      // Randomly filter protocols and maintain this subset
      const subset = data.protocols.filter(() => Math.random() > 0.5).slice(0, 30);
      setFilteredProtocols(subset);
    }
  }, [data]);

  // Auto-scroll functionality
  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current && isAutoScrollEnabled) {
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        const newPosition = (scrollRef.current as any).scrollTop + 0.5; // Adjust scroll speed if necessary
        (scrollRef.current as any).scrollTo(0, newPosition);
      }
    }, 50); // Adjust auto-scroll speed if necessary

    return () => clearInterval(interval);
  }, [isAutoScrollEnabled]);

  if (isLoading) return <DiscoverLoading />;

  if (!protocols) return <p>No protocols available</p>;

  const handleMouseEnter = () => setIsAutoScrollEnabled(false);
  const handleMouseLeave = () => setIsAutoScrollEnabled(true);

  return (
    <div
      className="flex h-full w-full flex-row justify-between overflow-y-auto"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      <div className="panel mb-3 w-full overflow-y-auto p-0" ref={scrollRef}>
        <h5 className="w-ful sticky top-0 bg-inherit p-6 text-lg font-semibold text-black dark:text-white">
          Recommended Protocols
        </h5>
        <div className="max-h-[700px] p-6 ">
          <div className="flex flex-auto flex-wrap justify-between gap-5 overflow-hidden pr-10 text-sm font-bold  sm:grid-cols-2">
            {filteredProtocols.map((r) => (
              <div className="max-h-[60px] w-full" key={r.name}>
                <Link
                  href={r.url}
                  target="_blank"
                  className={`w-full cursor-pointer  rounded-lg p-1 hover:text-primary focus:text-primary`}>
                  <div className="m-1 flex">
                    <img src={r.logo} alt={r.name} className="h-10 w-10" />
                    <div className="ml-3">
                      <p>{r.name}</p>
                      <span className="text-gray-700">{r.category}</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationsComponent;
