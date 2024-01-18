import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { api, relayerApi } from '../services';

export const rootReducer = combineReducers({
  baseApi: api.reducer,
  relayerApi: relayerApi.reducer,
  // backendApi: backendApi.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware).concat(relayerApi.middleware),
});
export type IRootState = ReturnType<typeof rootReducer>;
