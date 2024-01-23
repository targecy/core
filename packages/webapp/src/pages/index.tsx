import { useEffect } from 'react';

import { Home } from '~/components/Home';
import { useAppDispatch } from '~/hooks';
import { setPageTitle } from '~/store/themeConfigSlice';

const Index = () => {
  const dispatch = useAppDispatch();

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
