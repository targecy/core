import { combineReducers, configureStore } from '@reduxjs/toolkit';

import themeConfigSlice from './themeConfigSlice';

import { api } from '~/services/baseApi';

const rootReducer = combineReducers({
  themeConfig: themeConfigSlice,
  baseApi: api.reducer,
});

export default configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
});

export type IRootState = ReturnType<typeof rootReducer>;
