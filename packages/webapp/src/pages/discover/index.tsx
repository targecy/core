import BenefitsComponent from '~/components/Discover/Benefits';
import FeaturedComponent from '~/components/Discover/FeaturedComponent';

const Discover = () => {
  return (
    <>
      <div className="">
        <FeaturedComponent />
      </div>
      <div className="mt-3">
        <BenefitsComponent />
      </div>
    </>
  );
};

export default Discover;
