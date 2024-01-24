import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { Context, createWrapper } from 'next-redux-wrapper';

import themeConfigSlice from './themeConfigSlice';

import { env } from '~/env.mjs';
import { api } from '~/services/baseApi';

const rootReducer = combineReducers({
  themeConfig: themeConfigSlice,
  [api.reducerPath]: api.reducer,
});

export const makeStore = (_context: Context) =>
  configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

export const wrapper = createWrapper<AppStore>(makeStore, { debug: env.NEXT_PUBLIC_REDUX_WRAPPER_DEBUG });
