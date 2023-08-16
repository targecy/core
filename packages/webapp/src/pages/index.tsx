import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useDispatch, useSelector } from 'react-redux';

import Dropdown from '../components/Dropdown';
// import { IRootState } from '../store';
import { setPageTitle } from '../store/themeConfigSlice';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});
import { Home } from '~~/components/Home';

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
