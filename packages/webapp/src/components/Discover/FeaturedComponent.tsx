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

  // Adjusted for horizontal auto-scroll functionality
  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current && isAutoScrollEnabled) {
        const currentScrollPosition = (scrollRef.current as any).scrollLeft;
        const maxScrollPosition = (scrollRef.current as any).scrollWidth - (scrollRef.current as any).clientWidth;

        // Scroll back to start to simulate infinite scrolling
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        const newPosition = currentScrollPosition >= maxScrollPosition ? 0 : currentScrollPosition + 1;
        (scrollRef.current as any).scrollTo(newPosition, 0);
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
      className="flex h-[180px] max-w-full flex-col justify-between overflow-x-auto"
      style={{
        scrollbarWidth: 'none',
        scrollbarColor: 'transparent transparent',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      <div className="panel mb-3 h-full overflow-x-auto p-0" ref={scrollRef}>
        <h5 className="sticky left-0 top-0 bg-inherit p-6 text-lg font-semibold text-black dark:text-white">
          Featured
        </h5>
        <div className="flex pl-6 pr-6">
          {featured.map((r: Featured) => (
            <>
              <div className=" mr-32" key={r.id}>
                <Link
                  href={r.link}
                  target="_blank"
                  className={`h-full cursor-pointer rounded-lg p-1 hover:text-primary focus:text-primary`}>
                  <div className="flex flex-row gap-20 ">
                    <div className="flex">
                      <img src={r.icon} alt={r.protocol} className="h-10 w-10" />
                      <div className="ml-5 w-fit">
                        <p>{r.protocol}</p>
                        <span className="text-gray-700">{r.chain}</span>
                      </div>
                    </div>
                    <div className="w-[120px]">
                      {!!r.tvl && <p className="text-gray-500">TVL: ${r.tvl.toLocaleString()}</p>}
                      {!!r.apy && <p className="text-gray-500">APY: ${r.apy.toLocaleString()}</p>}
                    </div>
                  </div>
                </Link>
              </div>
              <div className="mr-32 flex items-center justify-center">
                <div className="">|</div>
              </div>
            </>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedComponent;
