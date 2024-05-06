import { combineReducers, configureStore } from '@reduxjs/toolkit';


import { api, defillamaApi, newsApi } from '~/services/baseApi';
import { themeConfigSlice } from './themeConfigSlice';

const rootReducer = combineReducers({
  themeConfig: themeConfigSlice.reducer,
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
