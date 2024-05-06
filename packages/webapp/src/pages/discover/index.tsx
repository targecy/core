import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import BenefitsComponent from '~/components/Discover/Benefits';
import FeaturedComponent from '~/components/Discover/FeaturedComponent';
import { setPageTitle } from '~/store/themeConfigSlice';

const Discover = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle('Discover'));
  });

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
