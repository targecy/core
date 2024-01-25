import { Oxygen } from 'next/font/google';
import { useTranslation } from 'next-i18next';
import { PropsWithChildren, useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '~/hooks';
import { RootState } from '~/store';
import {
  toggleRTL,
  toggleTheme,
  toggleLocale,
  toggleMenu,
  toggleLayout,
  toggleAnimation,
  toggleNavbar,
  toggleSemidark,
} from '~/store/themeConfigSlice';

/* const nunito = Nunito({
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  subsets: ['latin'],
});*/

const oxygen = Oxygen({
  weight: ['400', '700'],
  display: 'swap',
  subsets: ['latin'],
});

function App({ children }: PropsWithChildren) {
  const themeConfig = useAppSelector((state: RootState) => state.themeConfig);
  const dispatch = useAppDispatch();
  const { i18n } = useTranslation();

  useEffect(() => {
    dispatch(toggleTheme(localStorage.getItem('theme') || themeConfig.theme));
    dispatch(toggleMenu(localStorage.getItem('menu') || themeConfig.menu));
    dispatch(toggleLayout(localStorage.getItem('layout') || themeConfig.layout));
    dispatch(toggleRTL(localStorage.getItem('rtlClass') || themeConfig.rtlClass));
    dispatch(toggleAnimation(localStorage.getItem('animation') || themeConfig.animation));
    dispatch(toggleNavbar(localStorage.getItem('navbar') || themeConfig.navbar));
    dispatch(toggleSemidark(localStorage.getItem('semidark') || themeConfig.semidark));
    // locale
    const locale = localStorage.getItem('i18nextLng') || themeConfig.locale;
    dispatch(toggleLocale(locale));
    void i18n.changeLanguage(locale);
  }, [
    dispatch,
    themeConfig.theme,
    themeConfig.menu,
    themeConfig.layout,
    themeConfig.rtlClass,
    themeConfig.animation,
    themeConfig.navbar,
    themeConfig.locale,
    themeConfig.semidark,
    i18n,
  ]);

  return (
    <div
      className={`${(themeConfig.sidebar && 'toggle-sidebar') || ''} ${themeConfig.menu} ${themeConfig.layout} ${
        themeConfig.rtlClass
      } main-section relative ${oxygen.className} text-sm font-normal antialiased`}>
      {children}
    </div>
  );
}

export default App;
