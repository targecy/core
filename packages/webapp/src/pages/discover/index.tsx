import BenefitsComponent from '~/components/Discover/Benefits';
import RecommendationsComponent from '~/components/Discover/RecommendationsComponent';

const Discover = () => {
  return (
    <>
      <div className="">
        <RecommendationsComponent></RecommendationsComponent>
      </div>
      <div className="mt-3">
        <BenefitsComponent />
      </div>
    </>
  );
};

export default Discover;
