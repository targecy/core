/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

import themeConfig from '../theme.config';

import { capitalizeFirstLetter } from '~/utils';

export interface ITypeInitialState {
  isDarkMode: boolean;
  sidebar: boolean;
  theme: string;
  menu: string;
  layout: string;
  rtlClass: string;
  animation: string;
  navbar: string;
  locale: string;
  semidark: boolean;
  domain?: string;
  languageList: LanguageList[];
}

export interface LanguageList {
  code: string;
  name: string;
}

const getItemOrDefault = (key: string, defaultValue: string | boolean | any) => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key) || defaultValue;
  }

  return defaultValue;
};

const isDarkMode: boolean = getItemOrDefault('theme', false);
const menu = getItemOrDefault('menu', themeConfig.menu);
const layout = getItemOrDefault('layout', themeConfig.layout);
const rtlClass = getItemOrDefault('rtlClass', themeConfig.rtlClass);
const animation = getItemOrDefault('animation', themeConfig.animation);
const navbar = getItemOrDefault('navbar', themeConfig.navbar);
const semidark: boolean = getItemOrDefault('semidark', themeConfig.semidark);
const selectedLocale = getItemOrDefault('i18nextLng', themeConfig.locale);

const initialState: ITypeInitialState = {
  isDarkMode: isDarkMode,
  sidebar: false,
  theme: themeConfig.theme,
  menu: menu,
  layout: layout,
  rtlClass: rtlClass,
  animation: animation,
  navbar: navbar,
  locale: selectedLocale,
  semidark: semidark,
  languageList: [
    { code: 'zh', name: 'Chinese' },
    { code: 'da', name: 'Danish' },
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'el', name: 'Greek' },
    { code: 'hu', name: 'Hungarian' },
    { code: 'it', name: 'Italian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'pl', name: 'Polish' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'es', name: 'Spanish' },
    { code: 'sv', name: 'Swedish' },
    { code: 'tr', name: 'Turkish' },
    { code: 'ae', name: 'Arabic' },
  ],
};

export const themeConfigSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    toggleTheme(state, { payload }) {
      payload = payload || state.theme; // light | dark | system
      localStorage.setItem('theme', payload);
      state.theme = payload;
      if (payload === 'light') {
        state.isDarkMode = false;
      } else if (payload === 'dark') {
        state.isDarkMode = true;
      } else if (payload === 'system') {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          state.isDarkMode = true;
        } else {
          state.isDarkMode = false;
        }
      }

      if (state.isDarkMode) {
        document.querySelector('body')?.classList.add('dark');
      } else {
        document.querySelector('body')?.classList.remove('dark');
      }
    },
    toggleMenu(state, { payload }) {
      payload = payload || state.menu; // vertical, collapsible-vertical, horizontal
      state.sidebar = false; // reset sidebar state
      localStorage.setItem('menu', payload);
      state.menu = payload;
    },
    toggleDomain(state, { payload }) {
      if ((typeof payload === 'string' && payload.toLowerCase() === 'localhost') || payload.toLowerCase() === 'vercel')
        state.domain = 'targecy';
      else state.domain = payload;
    },
    toggleLayout(state, { payload }) {
      payload = payload || state.layout; // full, boxed-layout
      localStorage.setItem('layout', payload);
      state.layout = payload;
    },
    toggleRTL(state, { payload }) {
      payload = payload || state.rtlClass; // rtl, ltr
      localStorage.setItem('rtlClass', payload);
      state.rtlClass = payload;
      document.querySelector('html')?.setAttribute('dir', state.rtlClass || 'ltr');
    },
    toggleAnimation(state, { payload }) {
      payload = payload || state.animation; // animate__fadeIn, animate__fadeInDown, animate__fadeInUp, animate__fadeInLeft, animate__fadeInRight, animate__slideInDown, animate__slideInLeft, animate__slideInRight, animate__zoomIn
      payload = payload?.trim();
      localStorage.setItem('animation', payload);
      state.animation = payload;
    },
    toggleNavbar(state, { payload }) {
      payload = payload || state.navbar; // navbar-sticky, navbar-floating, navbar-static
      localStorage.setItem('navbar', payload);
      state.navbar = payload;
    },
    toggleSemidark(state, { payload }) {
      payload = payload === true || payload === 'true' ? true : false;
      localStorage.setItem('semidark', payload);
      state.semidark = payload;
    },
    toggleLocale(state, { payload }) {
      payload = payload || state.locale;
      localStorage.setItem('i18nextLng', payload);
      state.locale = payload;
    },
    toggleSidebar(state) {
      state.sidebar = !state.sidebar;
    },

    setPageTitle(state, { payload }) {
      document.title = `${payload} | ${state.domain ? capitalizeFirstLetter(state.domain) : ''} Ads`;
    },
  },
});

export const {
  toggleTheme,
  toggleMenu,
  toggleLayout,
  toggleRTL,
  toggleAnimation,
  toggleNavbar,
  toggleSemidark,
  toggleLocale,
  toggleSidebar,
  toggleDomain,
  setPageTitle,
} = themeConfigSlice.actions;
