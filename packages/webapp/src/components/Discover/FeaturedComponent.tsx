import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';

import { DiscoverLoading } from '../loaders/DiscoverLoading';

import { Featured, featuredSheetURL } from './benefits.constants';
import { fetchAndParseSheetData } from './utils';

const FeaturedComponent = () => {
  const scrollRef = useRef(null);

  const [featured, setFeatured] = useState<Featured[]>([]);
  const [areFeaturesLoading, setAreFeaturesLoading] = useState(true);

  useEffect(() => {
    try {
      fetchAndParseSheetData<Featured>(featuredSheetURL)
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

  const ElementsToRenderCarousel = () => {
    return featured.map((r: Featured) => (
      <div key={r.id} className="mx-5">
        <Link
          href={r.link}
          target="_blank"
          className={`h-full cursor-pointer rounded-lg p-1 hover:text-primary focus:text-primary`}>
          <div className="flex flex-row gap-16 ">
            <div className="flex">
              <img src={r.icon} alt={r.protocol} className="h-10 w-10" />
              <div className="ml-5 w-fit">
                <p>{r.protocol}</p>
                <span className="text-gray-700">{r.chain}</span>
              </div>
            </div>
            <div className="w-[150px]">
              {!!r.tvl && <p className="text-gray-500">TVL: {r.tvl.toLocaleString()}</p>}
              {!!r.apy && <p className="text-gray-500">APY: {r.apy.toLocaleString()}</p>}
            </div>
          </div>
        </Link>
      </div>
    ));
  };

  if (areFeaturesLoading) return <DiscoverLoading />;

  if (!featured || !featured.length) return <p>No protocols available</p>;

  return (
    <div className="flex h-[180px] max-w-full flex-col justify-between overflow-x-auto">
      <div className="panel mb-3 h-full overflow-x-auto p-0" ref={scrollRef}>
        <h5 className="sticky left-0 top-0 bg-inherit p-6 text-lg font-semibold text-black dark:text-white">
          Featured
        </h5>

        <div className="pause-animations-on-children-on-hover">
          <div className="ml-12 mr-32 flex w-full animate-marquee">
            <ElementsToRenderCarousel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedComponent;
