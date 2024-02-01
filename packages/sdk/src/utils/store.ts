import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { api, relayerApi } from '../services';
import environmentReducer from './environent.state';

export const rootReducer = combineReducers({
  baseApi: api.reducer,
  relayerApi: relayerApi.reducer,
  environment: environmentReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware).concat(relayerApi.middleware),
});
export type IRootState = ReturnType<typeof rootReducer>;
