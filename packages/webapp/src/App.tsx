import { Oxygen, Nunito } from 'next/font/google';
import { PropsWithChildren, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { IRootState } from './store';
import {
  toggleRTL,
  toggleTheme,
  toggleLocale,
  toggleMenu,
  toggleLayout,
  toggleAnimation,
  toggleNavbar,
  toggleSemidark,
} from './store/themeConfigSlice';

const oxygen = Oxygen({
  weight: ['400', '700'],
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-oxygen',
});

const nunito = Nunito({
  weight: ['400', '700'],
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-nunito',
});

function App({ children }: PropsWithChildren) {
  const themeConfig = useSelector((state: IRootState) => state.themeConfig);
  const dispatch = useDispatch();
  const { i18n } = useTranslation();

  useEffect(() => {
    const { theme, menu, layout, rtlClass, animation, navbar, semidark, locale } = themeConfig;

    dispatch(toggleTheme(theme));
    dispatch(toggleMenu(menu));
    dispatch(toggleLayout(layout));
    dispatch(toggleRTL(rtlClass));
    dispatch(toggleAnimation(animation));
    dispatch(toggleNavbar(navbar));
    dispatch(toggleSemidark(semidark));
    dispatch(toggleLocale(locale));
    void i18n.changeLanguage(locale);
  }, []);

  const { sidebar, menu, layout, rtlClass } = themeConfig;

  return (
    <div
      className={`${sidebar ? 'toggle-sidebar' : ''} ${menu} ${layout} ${rtlClass} main-section relative ${
        nunito.variable
      } ${oxygen.variable} text-sm font-normal antialiased`}>
      {children}
    </div>
  );
}

export default App;
