import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

// import { IRootState } from '../store';
import { setPageTitle } from '../store/themeConfigSlice';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});
import { Home } from '~/components/Home';

const Index = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle('Home'));
  });

  return (
    <>
      <Home></Home>
    </>
  );
};

export default Index;
