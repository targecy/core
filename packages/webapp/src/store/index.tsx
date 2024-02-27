import { combineReducers, configureStore } from '@reduxjs/toolkit';

import themeConfigSlice from './themeConfigSlice';

import { api, defillamaApi, newsApi } from '~/services/baseApi';

const rootReducer = combineReducers({
  themeConfig: themeConfigSlice,
  baseApi: api.reducer,
  newsApi: newsApi.reducer,
  defillamaApi: defillamaApi.reducer,
});

export default configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware).concat(defillamaApi.middleware).concat(newsApi.middleware),
});

export type IRootState = ReturnType<typeof rootReducer>;
