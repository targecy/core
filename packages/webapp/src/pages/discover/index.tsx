import BenefitsComponent from '~/components/Discover/Benefits';
import NewsComponent from '~/components/Discover/NewsComponent';
import RecommendationsComponent from '~/components/Discover/RecommendationsComponent';

const Discover = () => {
  return (
    <>
      <div className="grid grid-cols-2 gap-6">
        <div className="col-span-1 max-h-[300px]">
          <RecommendationsComponent></RecommendationsComponent>
        </div>
        <div className="col-span-1 max-h-[300px]">
          <NewsComponent></NewsComponent>
        </div>
      </div>
      <div className="mt-3">
        <BenefitsComponent />
      </div>
    </>
  );
};

export default Discover;
