import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { Home } from '~/components/Home';
import { setPageTitle } from '~/store/themeConfigSlice';

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
