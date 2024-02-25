import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';

import { DiscoverLoading } from '../loaders/DiscoverLoading';

import { Featured, featuredSheetURL } from './benefits.constants';
import { fetchAndParseSheetData, mapToBenefit } from './utils';

const FeaturedComponent = () => {
  const scrollRef = useRef(null);
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);

  const [featured, setFeatured] = useState<Featured[]>([]);
  const [areFeaturesLoading, setAreFeaturesLoading] = useState(true);

  useEffect(() => {
    try {
      fetchAndParseSheetData<Featured>(featuredSheetURL, mapToBenefit)
        .then((featured) => {
          setFeatured(featured);
          setAreFeaturesLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching benefits', error);
          setAreFeaturesLoading(false);
        });
    } catch (error) {
      console.error('Error fetching benefits', error);
      setAreFeaturesLoading(false);
    }
  }, []);

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

  if (areFeaturesLoading) return <DiscoverLoading />;

  if (!featured || !featured.length) return <p>No protocols available</p>;

  const handleMouseEnter = () => setIsAutoScrollEnabled(false);
  const handleMouseLeave = () => setIsAutoScrollEnabled(true);

  return (
    <div
      className="flex max-h-[150px] w-full  flex-row justify-between overflow-y-auto"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      <div className="panel mb-3 w-full overflow-y-auto p-0" ref={scrollRef}>
        <h5 className="w-ful sticky top-0 bg-inherit p-6 text-lg font-semibold text-black dark:text-white">
          Featured
        </h5>
        <div className="max-h-[700px] p-6 ">
          <div className="flex flex-auto flex-wrap justify-between gap-5 overflow-hidden pr-10 text-sm font-bold  sm:grid-cols-2">
            {featured.map((r: Featured) => (
              <div className="max-h-[60px] w-full" key={r.protocol}>
                <Link
                  href={r.link}
                  target="_blank"
                  className={`w-full cursor-pointer  rounded-lg p-1 hover:text-primary focus:text-primary`}>
                  <div className="flex justify-between">
                    <div className="m-1 flex">
                      <img src={r.icon} alt={r.protocol} className="h-10 w-10" />
                      <div className="ml-3">
                        <p>{r.protocol}</p>
                        <span className="text-gray-700">{r.chain}</span>
                      </div>
                    </div>
                    <div>
                      {!!r.tvl && <p className="float-right text-gray-500">TVL: ${r.tvl.toLocaleString()}</p>}
                      <br></br>
                      {!!r.apy && <p className="float-right text-gray-500">APY: ${r.apy.toLocaleString()}</p>}
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

export default FeaturedComponent;
