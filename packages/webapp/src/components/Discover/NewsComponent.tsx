import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';

import { DiscoverLoading } from '../loaders/DiscoverLoading';

import { useGetNewsQuery } from '~/services/baseApi';

const NewsComponent = () => {
  const scrollRef = useRef(null);
  const { data: news, isLoading: isLoading } = useGetNewsQuery({});
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);

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

  if (!news) return <p>No news available</p>;

  const handleMouseEnter = () => setIsAutoScrollEnabled(false);
  const handleMouseLeave = () => setIsAutoScrollEnabled(true);

  return (
    <div
      className="flex h-full w-full flex-row justify-between overflow-y-auto"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      <div className="panel mb-3 w-full overflow-y-auto p-0" ref={scrollRef}>
        <h5 className="w-ful sticky top-0 bg-inherit p-6 text-lg font-semibold text-black dark:text-white">News</h5>
        <div className="max-h-[700px] p-6 ">
          <div className="flex flex-auto flex-wrap justify-between gap-5 overflow-hidden pr-10 text-sm font-bold  sm:grid-cols-2">
            {news.map((r: any) => (
              <div className="w-full" key={r.id}>
                <Link
                  href={r.link}
                  target="_blank"
                  className={`block w-full  cursor-pointer rounded-lg p-1 hover:text-primary focus:text-primary`}>
                  {r.title}
                </Link>
                <span className="block p-1 pt-0 text-gray-700">{r.description}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsComponent;
